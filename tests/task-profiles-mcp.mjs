// Actual six-slide MCP flow. CHROMIUM selects the local browser. No running service is changed.
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url).pathname;
const out = join(root,'docs/evidence-task-profiles/mcp');
mkdirSync(out,{recursive:true});
const artifacts = mkdtempSync(join(tmpdir(),'mtp-task-art-'));
const client = new Client({name:'task-profiles-verification',version:'1.0.0'});
const transport = new StdioClientTransport({command:process.execPath,args:[join(root,'tools/mcp-server.mjs')],env:{...process.env,MTP_ARTIFACT_DIR:artifacts}});
const project = JSON.parse(readFileSync(join(root,'examples/leadership-forum-six.project.json'),'utf8'));
const log = [];
const call = async (name,args={}) => { const r=await client.callTool({name,arguments:args}); log.push({name,isError:!!r.isError,result:r.structuredContent}); return r; };
try {
  await client.connect(transport);
  const caps=(await call('get_capabilities')).structuredContent;
  assert.equal(caps.capabilityVersion,4);
  assert.ok(caps.profiles.todo && caps.profiles['planner-task']);
  assert.equal((await call('get_example')).structuredContent.slides.length,3);
  assert.deepEqual((await call('validate_project',{project})).structuredContent.warnings,[]);
  const result=await call('render_project',{project});
  assert.ok(!result.isError,JSON.stringify(result.structuredContent));
  const manifest=result.structuredContent;
  assert.equal(manifest.slides.length,6);
  for(const slide of manifest.slides) {
    const r=await call('retrieve_artifact',{renderId:manifest.renderId,file:slide.file});
    const im=r.content.find(c=>c.type==='image');
    assert.ok(im,slide.file);
    const bytes=Buffer.from(im.data,'base64');
    assert.equal(bytes.readUInt32BE(16),1920); assert.equal(bytes.readUInt32BE(20),1080);
    assert.equal(createHash('sha256').update(bytes).digest('hex'),slide.sha256);
    writeFileSync(join(out,slide.file),bytes);
  }
  const bad=structuredClone(project); bad.scenes[4].taskIds.push('t-raum');
  assert.ok((await call('validate_project',{project:bad})).structuredContent.errors.some(e=>e.code==='todo-task-owner'));
  assert.equal((await call('render_project',{project:bad})).isError,true);
  const detailOverflow=structuredClone(project);
  detailOverflow.states[1].tasks['t-einladung'].notes='Text '.repeat(1400);
  const failed=await call('render_project',{project:detailOverflow});
  assert.equal(failed.isError,true);
  assert.equal(failed.structuredContent.stage,'render');
  assert.ok(failed.structuredContent.diagnostics.some(d=>d.code==='fit'));
  assert.equal(failed.content.some(c=>c.type==='resource_link'),false);
  writeFileSync(join(out,'verification.json'),JSON.stringify(log,null,2));
  console.log('PASS: six profiles validated, rendered and every PNG retrieved through MCP; invalid ownership and overflowing details refused. Render '+manifest.renderId);
} finally { await client.close(); rmSync(artifacts,{recursive:true,force:true}); }
