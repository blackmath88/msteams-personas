#!/usr/bin/env node
// msteams-personas command line: the same validator and renderer as the website and MCP server.
// stdout carries only JSON (or a PNG-free manifest); messages go to stderr.
//
// Exit codes: 0 success · 1 project invalid · 2 usage or unreadable input · 3 render failed
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getCapabilities, getExample, validateProject, renderToDir, renderComponentsToDir, INPUT_LIMIT_BYTES } from './ops.mjs';

const HELP = `Usage: node tools/cli.mjs <command> [options]

  capabilities                      supported profiles, limits and versions (JSON)
  example [--kind tasks|workspace] [--out project.json]      a complete valid example project (JSON)
  validate <project.json | ->       validate; prints {ok, errors, warnings}
  render <project.json | -> --out <dir> [--scale 1|2] [--timeout <ms>]
                                    write ordered PNGs and manifest.json; prints the manifest
  component <project.json | -> --out <dir> (--spec <components.json> | --scene <id> [--view <v>]
            [--select <id,id> | --bucket <name>] [--width <px>] [--marks true]) [--scale 1|2]
                                    M365 screens or excerpts without slide chrome, with anchors;
                                    writes PNGs and manifest.json (default scale 2)

Exit codes: 0 ok, 1 project invalid, 2 usage/input error, 3 render failed (fit, browser, timeout).
Rendering needs Chromium (set CHROMIUM=/path/to/chrome if it is not on PATH as "chromium").`;

const out = o => process.stdout.write(JSON.stringify(o, null, 2) + '\n');
const fail = (msg, code = 2) => { process.stderr.write(msg + '\n'); process.exit(code); };

function args(argv) {
  const pos = [], opt = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opt.help = true;
    else if (a.startsWith('--')) { const k = a.slice(2); const v = argv[i + 1]; if (v === undefined || v.startsWith('--')) fail(`Option --${k} needs a value.`); opt[k] = v; i++; }
    else pos.push(a);
  }
  return { pos, opt };
}
function readInput(file) {
  if (!file) fail('Missing project file. Use "-" for stdin.\n\n' + HELP);
  try {
    const text = file === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(file), 'utf8');
    if (Buffer.byteLength(text) > INPUT_LIMIT_BYTES) fail(`Input is larger than ${INPUT_LIMIT_BYTES} bytes.`);
    return text;
  } catch (e) { fail(`Cannot read ${file}: ${e.message}`); }
}

const { pos, opt } = args(process.argv.slice(2));
const cmd = pos[0];
if (opt.help || !cmd) { (cmd ? process.stdout : process.stderr).write(HELP + '\n'); process.exit(cmd || opt.help ? 0 : 2); }

if (cmd === 'capabilities') out(getCapabilities());
else if (cmd === 'example') {
  if (opt.kind && !['tasks', 'workspace'].includes(opt.kind)) fail('Choose --kind tasks or workspace.');
  const json = JSON.stringify(getExample(opt.kind), null, 2) + '\n';
  if (opt.out) { writeFileSync(resolve(opt.out), json); process.stderr.write(`Example written to ${opt.out}\n`); }
  else process.stdout.write(json);
}
else if (cmd === 'validate') {
  const r = validateProject(readInput(pos[1]));
  out(r);
  process.exit(r.ok ? 0 : r.errors.some(e => ['empty', 'too-large', 'many-blocks', 'no-json', 'bad-json'].includes(e.code)) ? 2 : 1);
}
else if (cmd === 'render') {
  if (!opt.out) fail('render needs --out <dir>.\n\n' + HELP);
  const scale = opt.scale ? Number(opt.scale) : 1, timeoutMs = opt.timeout ? Number(opt.timeout) : undefined;
  const m = await renderToDir(readInput(pos[1]), resolve(opt.out), { scale, timeoutMs });
  out(m);
  if (m.ok) process.stderr.write(`${m.slides.length} PNG written to ${opt.out}\n`);
  process.exit(m.ok ? 0 : m.stage === 'parse' ? 2 : m.stage === 'validate' || m.stage === 'options' ? 1 : 3);
}
else if (cmd === 'component') {
  if (!opt.out) fail('component needs --out <dir>.\n\n' + HELP);
  let specs;
  if (opt.spec) { try { specs = JSON.parse(readFileSync(resolve(opt.spec), 'utf8')); } catch (e) { fail(`Cannot read ${opt.spec}: ${e.message}`); } if (!Array.isArray(specs)) specs = [specs]; }
  else if (opt.scene) {
    const s = { scene: opt.scene };
    if (opt.view) s.view = opt.view;
    if (opt.bucket) s.select = { bucket: opt.bucket };
    else if (opt.select) s.select = { [s.view === 'messages' ? 'messageIds' : 'postIds']: opt.select.split(',').map(x => x.trim()).filter(Boolean) };
    if (opt.width) s.width = Number(opt.width);
    if (opt.marks) s.marks = opt.marks === 'true';
    specs = [s];
  } else fail('component needs --spec <file> or --scene <id>.\n\n' + HELP);
  const scale = opt.scale ? Number(opt.scale) : 2, timeoutMs = opt.timeout ? Number(opt.timeout) : undefined;
  const m = await renderComponentsToDir(readInput(pos[1]), specs, resolve(opt.out), { scale, timeoutMs });
  out(m);
  if (m.ok) process.stderr.write(`${m.components.length} PNG written to ${opt.out}\n`);
  process.exit(m.ok ? 0 : m.stage === 'parse' ? 2 : m.stage === 'validate' || m.stage === 'options' ? 1 : 3);
}
else fail(`Unknown command "${cmd}".\n\n${HELP}`);
