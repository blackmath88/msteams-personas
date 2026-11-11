#!/usr/bin/env python3
"""Main-only renderer releases. Stable control plane is installed separately, never self-modified.
One scheduled coordinator (Mini) visits standbys then primary. Host flock also covers manual work.
"""
import contextlib
import fcntl
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import urllib.request


@contextlib.contextmanager
def lock(path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('a') as handle:
        fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        yield


def atomic_link(root, name, target):
    temporary = root / (name + '.next')
    temporary.unlink(missing_ok=True)
    temporary.symlink_to(target)
    temporary.replace(root / name)


def api(config, path, method='GET', base=None):
    token = Path(config['tokenFile']).read_text().strip()
    base = base or 'http://{}:{}'.format(config['address'], config.get('privatePort', 8791))
    req = urllib.request.Request(base + path, method=method, data=b'{}' if method == 'POST' else None,
                                 headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=12) as response:
        return json.load(response)


def run(config, args, cwd=None, timeout=1200):
    env = dict(os.environ, CHROMIUM=config['chromium'],
               PATH=str(Path(config['node']).parent) + os.pathsep + os.environ.get('PATH', '/usr/bin:/bin'))
    print('+', ' '.join(map(str, args)), flush=True)
    subprocess.run(list(map(str, args)), cwd=cwd, env=env, timeout=timeout, check=True)


def drain(config):
    api(config, '/admin/drain', 'POST')
    for _ in range(120):
        status = api(config, '/status')
        if status.get('forwarding', 0) == 0 and status.get('active', 0) == 0 and status.get('queued', 0) == 0:
            return
        time.sleep(1)
    raise RuntimeError('drain timeout; active render left running')


def wait_worker(config, sha):
    for _ in range(40):
        value = api(config, '/status')
        if value.get('reachable') and value.get('commit') == sha:
            return
        time.sleep(.5)
    raise RuntimeError('post-start health failed for ' + sha)


def promote(config, candidate, live=True, postcheck=True):
    root = Path(config['root'])
    old = (root / 'current').resolve() if (root / 'current').exists() else None
    sha = (candidate / '.release-sha').read_text().strip()
    try:
        atomic_link(root, 'current', candidate)
        if live:
            api(config, '/admin/reload', 'POST')
            wait_worker(config, sha)
            if postcheck:
                # Keep draining while checking; smoke bypasses gateway and uses the private host.
                api(config, '/admin/resume', 'POST')
                run(config, [config['node'], root / 'control/fleet-smoke.mjs', config['_path'], root / 'evidence' / sha])
                run(config, [config['node'], root / 'control/fleet-smoke.mjs', config['_path'], root / 'evidence' / (sha + '-modern'), 'host', 'modern'])
        if old and old != candidate:
            atomic_link(root, 'previous', old)
    except BaseException:
        if old:
            if live:
                drain(config)
            atomic_link(root, 'current', old)
            if live:
                api(config, '/admin/reload', 'POST')
                wait_worker(config, (old / '.release-sha').read_text().strip())
        raise
    finally:
        if live:
            api(config, '/admin/resume', 'POST')


def update_host(config):
    root = Path(config['root']); root.mkdir(parents=True, exist_ok=True)
    with lock(root / 'update.lock'):
        repo = root / 'source.git'
        if not repo.exists():
            run(config, ['git', 'init', '--bare', repo])
            run(config, ['git', '-C', repo, 'remote', 'add', 'origin', 'https://github.com/blackmath88/msteams-personas.git'])
        # There is deliberately no branch/URL/ref argument in the API or this command.
        run(config, ['git', '-C', repo, 'fetch', '--depth=1', 'origin', 'refs/heads/main'])
        sha = subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'FETCH_HEAD'], text=True).strip()
        current = root / 'current/.release-sha'
        if current.exists() and current.read_text().strip() == sha:
            print('Already current:', sha); return
        rejected = root / 'rejected.json'
        if rejected.exists() and json.loads(rejected.read_text()).get('sha') == sha:
            raise RuntimeError('candidate quarantined after prior failure: ' + sha)
        candidate = root / 'releases' / sha
        candidate.parent.mkdir(parents=True, exist_ok=True)
        candidate.mkdir(exist_ok=True)
        archive = root / 'candidate.tar'
        run(config, ['git', '-C', repo, 'archive', '--format=tar', '--output=' + str(archive), sha])
        run(config, ['tar', '-xf', archive, '-C', candidate]); archive.unlink()
        (candidate / '.release-sha').write_text(sha + '\n')
        live = (root / 'current').exists()
        drained = False
        try:
            run(config, [config['npm'], 'ci', '--no-audit', '--no-fund'], candidate)
            run(config, [config['npm'], 'test'], candidate)
            run(config, [config['python'], 'tests/fleet-update-test.py'], candidate)
            run(config, [config['node'], 'check-worlds.mjs'], candidate)
            if live:
                drain(config); drained = True
            run(config, [config['node'], 'tests/workspace-mcp.mjs', root / 'evidence' / (sha + '-candidate')], candidate)
            (candidate / '.verified.json').write_text(json.dumps({'sha': sha, 'verifiedAt': time.time(), 'gates': ['npm test', 'check-worlds', 'workspace-mcp']}))
            promote(config, candidate, live)
            print('PROMOTED', config['id'], sha, flush=True)
        except BaseException as error:
            rejected.write_text(json.dumps({'sha': sha, 'reason': str(error), 'at': time.time()}))
            raise
        finally:
            if drained:
                api(config, '/admin/resume', 'POST')


def rollback_test(config):
    """Deliberately broken synthetic local candidate: never fetched from a branch or PR."""
    root = Path(config['root'])
    with lock(root / 'update.lock'):
        old = (root / 'current').resolve()
        bad = root / 'releases/synthetic-rejected'
        (bad / 'tools').mkdir(parents=True, exist_ok=True)
        (bad / '.release-sha').write_text('synthetic-rejected\n')
        (bad / 'tools/mcp-server.mjs').write_text('process.exit(42);\n')
        drain(config)
        try:
            promote(config, bad, postcheck=False)
        except RuntimeError as error:
            if 'post-start health failed' not in str(error):
                raise
            assert (root / 'current').resolve() == old
            print('PASS rollback: rejected synthetic candidate, restored', old.name, flush=True)
        else:
            raise AssertionError('synthetic candidate unexpectedly promoted')
        finally:
            shutil.rmtree(bad)


def fleet(config):
    root = Path(config['root'])
    with lock(root / 'fleet.lock'):
        # Reverse priority updates the second fallback, first fallback, then primary.
        for host in reversed(config['hosts']):
            statuses = {}
            for peer in config['hosts']:
                try:
                    statuses[peer['id']] = api(config, '/status', base=peer['url'])
                except Exception:
                    pass  # Sleeping hosts catch up in the next coordinated pass.
            if host['id'] not in statuses:
                print('OFFLINE', host['id'], flush=True); continue
            if not any(s.get('ready') for name, s in statuses.items() if name != host['id']):
                raise RuntimeError('refuse to update last verified available renderer: ' + host['id'])
            api(config, '/admin/update', 'POST', host['url'])
            for _ in range(1800):
                time.sleep(1)
                state = api(config, '/status', base=host['url']).get('update')
                if state and not state['running']:
                    if state['code'] != 0:
                        raise RuntimeError('update failed on ' + host['id'] + '; inspect its update.log')
                    break
            else:
                raise RuntimeError('update unsettled on ' + host['id'] + '; subsequent hosts left alone')
            time.sleep(35)  # Recovery stability interval before draining the next host.


if __name__ == '__main__':
    operation, path = sys.argv[1:3]
    config = json.loads(Path(path).read_text()); config['_path'] = str(Path(path).resolve())
    if operation == 'host': update_host(config)
    elif operation == 'fleet': fleet(config)
    elif operation == 'rollback-test': rollback_test(config)
    elif operation == 'rollback':
        root = Path(config['root'])
        with lock(root / 'update.lock'):
            drain(config); promote(config, (root / 'previous').resolve())
    else: raise SystemExit('operation must be host, fleet, rollback or rollback-test')
