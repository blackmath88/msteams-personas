// Minimal Chrome DevTools Protocol driver (no dependencies; Node >= 22 for global WebSocket).
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function launch({ bin = process.env.CHROMIUM || 'chromium', port = 9333 } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'mtp-cdp-'));
  const proc = spawn(bin, ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, 'about:blank'], { stdio: 'ignore' });
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    await sleep(200);
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === 'page'); } catch { /* not up yet */ }
  }
  if (!target) throw new Error('chromium did not start');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
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
    async close() { ws.close(); proc.kill(); await sleep(300); try { rmSync(dir, { recursive: true, force: true }); } catch (e) { /* profile cleanup is best effort */ } }
  };
  return page;
}
