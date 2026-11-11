#!/usr/bin/env python3
"""Write user-owned service definitions from an observed host configuration; no sudo or sleep changes.
Usage: python3 tools/fleet-services.py /absolute/config.json [--coordinator]
Install/enable commands are printed, not executed. Preserve any existing tunnel before cutover.
"""
import json
import os
from pathlib import Path
import plistlib
import sys

config_path = Path(sys.argv[1]).resolve()
c = json.loads(config_path.read_text())
root = Path(c['root'])
(root / 'logs').mkdir(parents=True, exist_ok=True)
coordinator = '--coordinator' in sys.argv
programs = {
    'renderer': [c['node'], str(root / 'control/fleet-host.mjs'), str(config_path)],
    'tunnel': [c['node'], str(root / 'control/fleet-tunnel.mjs'), str(config_path)],
}
if coordinator:
    programs['updater'] = [c['python'], str(root / 'control/fleet-update.py'), 'fleet', str(config_path)]

if sys.platform == 'darwin':
    directory = Path.home() / 'Library/LaunchAgents'; directory.mkdir(exist_ok=True)
    for name, args in programs.items():
        label = 'ch.msteams-personas.fleet.' + name
        value = {'Label': label, 'ProgramArguments': args, 'RunAtLoad': True, 'ProcessType': 'Background',
                 'WorkingDirectory': str(root), 'StandardOutPath': str(root / 'logs' / (name + '.out.log')),
                 'StandardErrorPath': str(root / 'logs' / (name + '.err.log'))}
        if name == 'updater': value['StartInterval'] = 900
        else: value.update(KeepAlive=True, ThrottleInterval=10)
        path = directory / (label + '.plist')
        if path.exists(): raise SystemExit('Refusing to overwrite existing service: ' + str(path))
        path.write_bytes(plistlib.dumps(value))
        print('launchctl bootstrap gui/' + str(os.getuid()) + ' "' + str(path) + '"')
else:
    directory = Path.home() / '.config/systemd/user'; directory.mkdir(parents=True, exist_ok=True)
    for name, args in programs.items():
        unit = 'msteams-personas-' + name
        path = directory / (unit + '.service')
        if path.exists(): raise SystemExit('Refusing to overwrite existing service: ' + str(path))
        command = ' '.join('"' + a.replace('"', '\\"') + '"' for a in args)
        content = '[Unit]\nDescription=msteams-personas fleet ' + name + '\nAfter=network-online.target\n\n[Service]\n'
        content += 'ExecStart=' + command + '\nWorkingDirectory=' + str(root) + '\nUMask=0077\nTimeoutStopSec=130\n'
        content += 'Type=oneshot\n' if name == 'updater' else 'Restart=on-failure\nRestartSec=5\n'
        content += '\n[Install]\nWantedBy=default.target\n'
        path.write_text(content)
        if name == 'updater':
            (directory / (unit + '.timer')).write_text('[Unit]\nDescription=Coordinated renderer updates\n[Timer]\nOnBootSec=5min\nOnUnitActiveSec=15min\nPersistent=true\n[Install]\nWantedBy=timers.target\n')
            print('systemctl --user enable --now ' + unit + '.timer')
        else: print('systemctl --user enable --now ' + unit)
    print('Run systemctl --user daemon-reload before enabling units.')
