// Minimal Chrome DevTools Protocol driver (no dependencies; Node >= 22 for global WebSocket).
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, readlinkSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function launch({ bin = process.env.CHROMIUM || 'chromium', port = 9333, width, height } = {}) {
  const fetchers = () => { try { return readdirSync(tmpdir()).filter(n => n.startsWith('org.chromium.Chromium.chromium_chrome_url_fetcher_')); } catch { return []; } };
  const before = new Set(fetchers());
  const base = mkdtempSync(join(tmpdir(), 'mtp-cdp-')), dir = join(base, 'profile');
  /* Chromium's own scratch files go next to the profile, so closing removes both. */
  mkdirSync(dir); mkdirSync(join(base, 'tmp'));
  const args = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-component-update', '--disable-background-networking', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`];
  if (width && height) args.push(`--window-size=${width},${height}`);
  /* Chromium puts a Unix socket below TMPDIR; socket paths are limited to ~100 bytes, so a
     long TMPDIR is left alone and the socket dir is removed via the profile's link instead. */
  const env = join(base, 'tmp').length <= 60 ? { ...process.env, TMPDIR: join(base, 'tmp') } : process.env;
  const proc = spawn(bin, [...args, 'about:blank'], { stdio: 'ignore', env });
  const exited = new Promise(r => proc.once('exit', r));
  /* Kill the browser and remove its profile; safe to call more than once. */
  let gone = false;
  async function kill() {
    if (gone) return; gone = true;
    if (proc.exitCode === null && proc.signalCode === null) {
      proc.kill('SIGTERM');
      if (await Promise.race([exited.then(() => true), sleep(3000).then(() => false)]) === false) { proc.kill('SIGKILL'); await exited; }
    }
    try { const sock = readlinkSync(join(dir, 'SingletonSocket')); if (/org\.chromium\./.test(sock)) rmSync(dirname(sock), { recursive: true, force: true }); } catch { /* no socket link */ }
    /* Chromium also leaves a url_fetcher scratch dir in TMPDIR: remove the ones that appeared
       while this browser ran (another Chromium starting at the same moment could lose its
       fetcher cache; it is recreated on demand). */
    for (const n of fetchers()) if (!before.has(n)) { try { rmSync(join(tmpdir(), n), { recursive: true, force: true }); } catch { /* best effort */ } }
    /* Helper processes can still write profile state just after the main process exits:
       remove until the directory stays gone. */
    for (let i = 0; i < 20 && existsSync(base); i++) {
      try { rmSync(base, { recursive: true, force: true, maxRetries: 3, retryDelay: 50 }); } catch { /* retry */ }
      await sleep(i ? 150 : 50);
    }
  }
  let target;
  try {
    for (let i = 0; i < 75 && !target; i++) {
      await sleep(200);
      if (proc.exitCode !== null) break;
      let p = port;
      /* port 0: Chromium picks a free port and writes it to DevToolsActivePort */
      if (!p) { try { p = +readFileSync(join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { continue; } }
      try { target = (await (await fetch(`http://127.0.0.1:${p}/json`)).json()).find(t => t.type === 'page'); } catch { /* not up yet */ }
    }
    if (!target) throw new Error(`chromium did not start (${bin})`);
  } catch (e) { await kill(); throw e; }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  try { await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; }); } catch (e) { await kill(); throw new Error('cannot connect to chromium'); }
  let id = 0; const pending = new Map(); const errors = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push(m.params.args.map(a => a.value).join(' '));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable');

  const page = {
    errors,
    async size(width, height, scale = 1) { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: width < 600 }); },
    async goto(url) { await send('Page.navigate', { url }); await sleep(500); },
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
      return r.result.value;
    },
    async key(key, code = key, keyCode = 0) {
      for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode: keyCode });
      await sleep(120);
    },
    async type(text) { await send('Input.insertText', { text }); await sleep(150); },
    async shot(path, full = false) {
      const p = { format: 'png' };
      if (full) {
        const m = await send('Page.getLayoutMetrics');
        p.clip = { x: 0, y: 0, width: m.cssContentSize.width, height: Math.min(m.cssContentSize.height, 6000), scale: 1 };
        p.captureBeyondViewport = true;
      }
      const { data } = await send('Page.captureScreenshot', p);
      writeFileSync(path, Buffer.from(data, 'base64'));
    },
    sleep,
    pid: proc.pid, profileDir: base,
    async close() {
      /* graceful first, so Chromium finishes its own writes; kill() follows either way */
      try { await Promise.race([send('Browser.close'), sleep(1500)]); } catch { /* already gone */ }
      await Promise.race([exited, sleep(2000)]);
      try { ws.close(); } catch { /* already closed */ }
      await kill();
    }
  };
  return page;
}
