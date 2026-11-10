// Official SDK client, not a live assistant-host trial. Compare retrieved bytes with CLI/gallery.
import {Client} from '@modelcontextprotocol/client';
import {StdioClientTransport} from '@modelcontextprotocol/client/stdio';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import R from '../src/research-catalogue.js';
const temp=mkdtempSync(join(tmpdir(),'business-mcp-')),client=new Client({name:'business-check',version:'1.0'}),checks=[];
const call=(name,args={})=>client.callTool({name,arguments:args});
try{
  await client.connect(new StdioClientTransport({command:process.execPath,args:[resolve('tools/mcp-server.mjs')],env:{...process.env,MTP_ARTIFACT_DIR:temp},stderr:'ignore'}));
  for(const filters of [{collection:'business'},{domain:'administration',teamPattern:'committee'},{teamPattern:'individual'},{domain:'administration',teamPattern:'individual'}]){
    const got=(await call('get_catalogue',filters)).structuredContent;
    assert.deepEqual(got,R.catalogue(filters));
    const args=['tools/cli.mjs','catalogue'];for(const [k,v] of Object.entries(filters))args.push('--'+(k==='teamPattern'?'team-pattern':k),v);
    assert.deepEqual(JSON.parse(execFileSync(process.execPath,args,{encoding:'utf8'})),got);checks.push('CLI/MCP filters agree: '+JSON.stringify(filters));
  }
  const caps=(await call('get_capabilities')).structuredContent;
  for(const id of ['municipal-opening-hours','service-appointment-change']){
    assert.ok(caps.examples.includes(id));const p=(await call('get_example',{kind:id})).structuredContent;
    assert.deepEqual(p,R.project(id));assert.equal((await call('validate_project',{project:p})).structuredContent.ok,true);
    const r=await call('render_project',{project:p}),m=r.structuredContent;assert.equal(m.ok,true,JSON.stringify(m));
    const cli=JSON.parse(readFileSync(resolve('docs/business-review',id,'manifest.json')));
    assert.equal(m.slides.length,5);
    for(const [i,sl]of m.slides.entries()){
      const content=(await client.readResource({uri:sl.uri})).contents[0],bytes=Buffer.from(content.blob,'base64');
      assert.equal(bytes.toString('ascii',1,4),'PNG');assert.equal(bytes.readUInt32BE(16),1920);assert.equal(bytes.readUInt32BE(20),1080);
      assert.equal(createHash('sha256').update(bytes).digest('hex'),cli.slides[i].sha256);
    }
    checks.push(id+': discovered, validated, rendered and all five PNGs retrieved byte-identically to CLI');
  }
  writeFileSync(resolve('docs/business-review/checks/mcp.json'),JSON.stringify({ok:true,checks,scope:'SDK stdio + CLI, not a real assistant-host or tenant trial.'},null,2)+'\n');console.log(checks.join('\n'));
}finally{await client.close();rmSync(temp,{recursive:true,force:true});}
