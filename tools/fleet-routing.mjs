export function originOf(message, legacyHost = 'blackbird') {
  let id;
  if (message.method === 'tools/call' && message.params?.name === 'retrieve_artifact') id = message.params.arguments?.renderId;
  if (message.method === 'resources/read') {
    const match = /^mtp:\/\/renders\/([^/]+)\//.exec(message.params?.uri || '');
    if (!match) throw new Error('invalid_artifact_uri');
    id = match[1];
  }
  if (id === undefined) return null;
  if (/^r-[0-9a-f]{16}$/.test(id)) return legacyHost;
  const match = /^r-([a-z][a-z0-9]{0,20})-[0-9a-f]{16}$/.exec(id);
  if (!match) throw new Error('invalid_render_id');
  return match[1];
}

export const isRender = message => message.method === 'tools/call' && ['render_project', 'render_components'].includes(message.params?.name);

// Modern MCP validates method/name/parameter headers against the self-contained body.
// Preserve protocol metadata across both proxy hops, without copying caller auth or Host.
export const protocolHeaders = headers => Object.fromEntries(Object.entries(headers)
  .filter(([name, value]) => /^mcp-/i.test(name) && name.toLowerCase() !== 'mcp-session-id' && typeof value === 'string'));

export function failureResponse(message, error) {
  const detail = { ok: false, code: error.message.split(':')[0], message: error.message };
  // Domain failures are tool results, not transport failures that a connector may retry.
  return { jsonrpc: '2.0', id: message?.id ?? null, ...(message?.method === 'tools/call'
    ? { result: { isError: true, content: [{ type: 'text', text: error.message }], structuredContent: detail } }
    : { error: { code: -32002, message: error.message } }) };
}

export function supports(status, message) {
  const caps = status?.capabilities;
  if (!status?.ready || !caps || caps.capabilityVersion < 6) return false;
  const project = message.params?.arguments?.project;
  if (project?.capabilityVersion > caps.capabilityVersion) return false;
  return (project?.scenes || []).every(s => Object.hasOwn(caps.profiles, s.profile));
}

// Failure history belongs to each redundant gateway. A recovered higher priority host must
// stay healthy for the stability interval before receiving new jobs. Artifacts bypass selection.
export class FleetRouter {
  constructor(hosts, { stabilityMs = 30_000, now = Date.now } = {}) {
    this.hosts = hosts; this.stabilityMs = stabilityMs; this.now = now; this.seen = new Map();
  }
  observe(host, status) {
    const previous = this.seen.get(host.id);
    if (!status?.ready) { this.seen.set(host.id, { healthy: false, since: 0 }); return; }
    this.seen.set(host.id, { healthy: true, since: previous?.healthy ? previous.since : previous ? this.now() : status.readySince || this.now() });
  }
  select(message, statuses) {
    const origin = originOf(message);
    if (origin) {
      const host = this.hosts.find(h => h.id === origin);
      if (!host || !statuses[origin]?.reachable) throw new Error(`artifact_origin_unavailable: ${origin}; retry retrieval when that host returns; no rerender was started`);
      return host;
    }
    for (const host of this.hosts) {
      const status = statuses[host.id]; this.observe(host, status);
      if (supports(status, message) && this.now() - this.seen.get(host.id).since >= this.stabilityMs) return host;
    }
    throw new Error('no_eligible_renderer: no stable healthy host supports this request');
  }
}
