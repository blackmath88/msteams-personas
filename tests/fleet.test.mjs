import test from 'node:test';
import assert from 'node:assert/strict';
import { RenderQueue } from '../tools/render-queue.mjs';
import { FleetRouter, originOf, supports } from '../tools/fleet-routing.mjs';

const hosts = ['linuc', 'bruh', 'blackbird'].map(id => ({ id }));
const healthy = () => ({ ready: true, reachable: true, readySince: 1, capabilities: { capabilityVersion: 6, profiles: { 'workspace-houses': {}, 'workspace-house-teams': {} } } });
const request = { method: 'tools/call', params: { name: 'render_project', arguments: { project: { capabilityVersion: 5, scenes: [{ profile: 'workspace-houses' }] } } } };
test('ordered failover, recovered primary stability, and stale capability exclusion', () => {
  let now = 60_000;
  const router = new FleetRouter(hosts, { now: () => now });
  const statuses = Object.fromEntries(hosts.map(h => [h.id, healthy()]));
  assert.equal(router.select(request, statuses).id, 'linuc');
  statuses.linuc.ready = false;
  assert.equal(router.select(request, statuses).id, 'bruh');
  statuses.bruh.ready = false;
  assert.equal(router.select(request, statuses).id, 'blackbird');
  statuses.linuc = healthy();
  assert.equal(router.select(request, statuses).id, 'blackbird');
  now += 30_001;
  assert.equal(router.select(request, statuses).id, 'linuc');
  statuses.linuc.capabilities.capabilityVersion = 2;
  assert.equal(router.select(request, statuses).id, 'blackbird');
  statuses.blackbird.capabilities.profiles = {};
  assert.throws(() => router.select(request, statuses), /no_eligible_renderer/);
});
test('artifact origin is independent of active host and missing origin never falls through', () => {
  const router = new FleetRouter(hosts);
  const message = { method: 'tools/call', params: { name: 'retrieve_artifact', arguments: { renderId: 'r-bruh-0123456789abcdef' } } };
  const statuses = { linuc: healthy(), bruh: { reachable: true, ready: false } };
  assert.equal(router.select(message, statuses).id, 'bruh');
  statuses.bruh.reachable = false;
  assert.throws(() => router.select(message, statuses), /artifact_origin_unavailable: bruh/);
  assert.equal(originOf({ method: 'resources/read', params: { uri: 'mtp://renders/r-blackbird-0123456789abcdef/file.png' } }), 'blackbird');
  message.params.arguments.renderId = 'r-0123456789abcdef';
  assert.equal(originOf(message), 'blackbird');
  message.params.arguments.renderId = '../etc/passwd';
  assert.throws(() => originOf(message), /invalid_render_id/);
});
test('newer requested capability is not sent to an older worker', () => {
  const newer = structuredClone(request); newer.params.arguments.project.capabilityVersion = 7;
  assert.equal(supports(healthy(), newer), false);
});
test('one active render, bounded queue, queue timeout never runs cancelled work', async () => {
  const queue = new RenderQueue({ waitMs: 20 });
  let finish, called = false;
  const active = queue.run(() => new Promise(r => { finish = r; }));
  const waiting = queue.run(() => { called = true; });
  await assert.rejects(queue.run(() => {}), /renderer_busy/);
  await assert.rejects(waiting, /queue_timeout/);
  finish(); await active;
  assert.equal(called, false); assert.equal(queue.status().active, 0);
});
test('queued work stays serialized and drain rejects new work', async () => {
  const queue = new RenderQueue(); let finish; const events = [];
  const first = queue.run(async () => { events.push('start1'); await new Promise(r => { finish = r; }); events.push('end1'); });
  const second = queue.run(() => { events.push('start2'); });
  queue.draining = true;
  await assert.rejects(queue.run(() => {}), /renderer_draining/);
  finish(); await Promise.all([first, second]);
  assert.deepEqual(events, ['start1', 'end1', 'start2']);
});
