#!/usr/bin/env node
// A replica must stop polling when its local gateway is down; otherwise it could consume
// queued calls that a healthy replica could serve. This wrapper supervises only its own child.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const config = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
let child = null, stopping = false;
async function stopChild() {
  const old = child; child = null;
  if (!old || old.exitCode !== null || old.signalCode !== null) return;
  old.kill('SIGTERM');
  for (let i = 0; i < 50 && old.exitCode === null && old.signalCode === null; i++) await pause(100);
  if (old.exitCode === null && old.signalCode === null) old.kill('SIGKILL');
}
process.on('SIGTERM', () => { stopping = true; });
process.on('SIGINT', () => { stopping = true; });
while (!stopping) {
  let healthy = false;
  try {
    const response = await fetch(`http://127.0.0.1:${config.gatewayPort || 8790}/healthz`, { signal: AbortSignal.timeout(2500) });
    healthy = response.ok;
  } catch { /* Stop this replica's poller until its gateway returns. */ }
  if (!healthy) await stopChild();
  else if (!child || child.exitCode !== null || child.signalCode !== null) {
    child = spawn(join(config.root, 'bin/tunnel-client'), ['run', '--profile-file', join(config.root, 'tunnel.yaml')], { stdio: ['ignore', 'inherit', 'inherit'] });
    child.on('error', () => { stopping = true; });
  }
  await pause(2000);
}
await stopChild();
