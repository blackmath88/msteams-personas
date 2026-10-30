// The operations every non-browser route calls. The CLI and the MCP server are thin adapters
// over these functions; the website calls the same ProjectCore and ProjectRender directly.
import { PC, renderProject, LIMITS } from './render.mjs';

export const INPUT_LIMIT_BYTES = PC.MAX_INPUT;

export function getCapabilities() {
  return {
    format: PC.FORMAT, projectVersion: PC.PROJECT_VERSION, capabilityVersion: PC.CAPABILITY_VERSION, rendererVersion: PC.RENDERER_VERSION,
    stateIds: PC.STATE_IDS, ...PC.capabilities(),
    output: { width: 1920, height: 1080, format: 'image/png', scales: LIMITS.scales },
    inputLimitBytes: INPUT_LIMIT_BYTES,
    semantics: 'states are complete snapshots: a task missing from a state is not shown there; list "personal" = a person\'s own list (owner required), list "plan" = the shared plan.'
  };
}

export function getExample() { return PC.template(); }

/* Accepts a parsed object or text (raw JSON or one ```json fence). Never throws. */
export function parseProject(input) {
  if (typeof input !== 'string') {
    const size = Buffer.byteLength(JSON.stringify(input ?? null));
    if (size > INPUT_LIMIT_BYTES) return { error: { code: 'too-large', path: '', severity: 'error', message: `Project is ${size} bytes; the limit is ${INPUT_LIMIT_BYTES}.` } };
    return { project: input };
  }
  const r = PC.parseInput(input);
  return r.error ? { error: { ...r.error, path: '', severity: 'error' } } : r;
}

export function validateProject(input) {
  const r = parseProject(input);
  if (r.error) return { ok: false, errors: [r.error], warnings: [] };
  const v = PC.validate(r.project);
  return { ok: v.ok, errors: v.errors, warnings: v.warnings, summary: v.ok ? { title: r.project.meta.title, slides: r.project.slides.map((s, i) => ({ index: i, id: s.id, file: PC.fileName(r.project, i) })) } : undefined };
}

export async function renderToDir(input, outDir, opts = {}) {
  const r = parseProject(input);
  if (r.error) return { format: 'msteams-personas/render-manifest', ok: false, stage: 'parse', slides: [], diagnostics: [r.error] };
  return renderProject(r.project, { ...opts, outDir });
}
