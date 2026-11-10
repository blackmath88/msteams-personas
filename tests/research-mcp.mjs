// Real SDK client over stdio. This is not an assistant-host or Microsoft tenant test.
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import R from '../src/research-catalogue.js';
const temp = mkdtempSync(join(tmpdir(),'research-mcp-'));
const client = new Client({name:'research-regression',version:'1.0.0'});
const transport = new StdioClientTransport({command:process.execPath,args:[resolve('tools/mcp-server.mjs')],env:{...process.env,MTP_ARTIFACT_DIR:temp},stderr:'ignore'});
const call = (name,args={}) => client.callTool({name,arguments:args}); const checks=[];
try {
  await client.connect(transport);
  assert.ok((await client.listTools()).tools.some(t=>t.name==='get_catalogue'));
  const catalogue=(await call('get_catalogue')).structuredContent;
  assert.equal(catalogue.personas.length,4); assert.equal(catalogue.scenarios.length,12);
  checks.push('MCP discovers four personas, twelve statuses and full source records');
  const caps=(await call('get_capabilities')).structuredContent; assert.equal(caps.capabilityVersion,6);
  for(const s of R.scenarios.filter(s=>s.status==='renderable')) {
    const p=(await call('get_example',{kind:s.id})).structuredContent;
    assert.deepEqual(p,R.project(s.id)); assert.equal((await call('validate_project',{project:p})).structuredContent.ok,true);
    checks.push(s.id+': discovered example validates through MCP');
  }
  for(const kind of ['weekly-meeting','shared-loop']) {
    const result=await call('render_project',{project:R.project(kind)}),m=result.structuredContent;
    assert.equal(result.isError,undefined); assert.equal(m.ok,true);
    const cli=JSON.parse(readFileSync(resolve('docs/morning-review',kind,'manifest.json')));
    assert.equal(m.slides.length,cli.slides.length);
    for(let i=0;i<m.slides.length;i++) {
      const data=(await client.readResource({uri:m.slides[i].uri})).contents[0];
      const bytes=Buffer.from(data.blob,'base64'); assert.equal(bytes.readUInt32BE(16),1920); assert.equal(bytes.readUInt32BE(20),1080);
      assert.equal(createHash('sha256').update(bytes).digest('hex'),cli.slides[i].sha256);
    }
    checks.push(kind+': every retrieved PNG is byte-identical to CLI/gallery rendering');
  }
  writeFileSync(resolve('docs/morning-review/mcp-checks.json'),JSON.stringify({ok:true,checks,scope:'Official SDK stdio client; no real assistant-host trial or live tenant acceptance.'},null,2)+'\n');
  console.log(checks.join('\n'));
}finally{await client.close();rmSync(temp,{recursive:true,force:true});}
