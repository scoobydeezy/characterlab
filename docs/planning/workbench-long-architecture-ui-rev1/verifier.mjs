import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-long-architecture-ui-rev1',parent='docs/planning/workbench-long-architecture-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const receipt=read(parent+'/receipt.json');assert.equal(receipt.status,'PASS LONG CANONICAL STATE CORRESPONDENCE');
 for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 const script='scripts/check-workbench-long-architecture-ui.mjs',bytes=fs.readFileSync(script);fs.writeFileSync(root+'/verifier.mjs',bytes,{flag:'wx'});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({parent:{path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json'))},verifier:{path:script,sha256:sha(bytes)},sources:receipt.sources},null,2)+'\n',{flag:'wx'});console.log('FROZEN LONG architecture browser qualification');
}else{
 const freeze=read(root+'/freeze.json'),p=read(freeze.parent.path),b=read(root+'/browser.json');
 assert.equal(sha(fs.readFileSync(freeze.parent.path)),freeze.parent.sha256);assert.equal(sha(fs.readFileSync(freeze.verifier.path)),freeze.verifier.sha256);assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifier.sha256);
 for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(parent+'/sources/'+s.path)),s.sha256,s.path);}
 assert.deepEqual(b.captures.map(c=>[c.program,c.prefix]),[['representation-4-law-1',0],['maximum-time',1]]);
 for(const c of b.captures){
  const result=p.results.find(r=>r.program===c.program),bytes=fs.readFileSync(parent+'/'+result.path);assert.equal(sha(bytes),result.sha256);const expected=JSON.parse(gunzipSync(bytes))[c.prefix];
  assert.deepEqual(JSON.parse(c.report),expected);assert.deepEqual(c.hashes,c.afterHashes);
  for(const key of ['modelHash','runHash','stateHash','saveHash'])assert(c.hashes.includes(expected.identity[key]));
  assert.equal(c.alerts,0);
 }
 const control=JSON.parse(b.captures[0].report);assert.equal(control.controlPaths.length,1);assert(control.rows.find(r=>r.control).binding===null);
 assert(b.controlText.includes('never count it under three canonical boxes'));
 const active=JSON.parse(b.captures[1].report),event=JSON.parse(b.selectedEvent);assert(active.rows.some(r=>r.events.some(e=>e.id===event.id)));
 assert.equal(b.selectedEventId,event.id);assert.deepEqual(b.beforeNavigationHashes,b.afterNavigationHashes);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED LONG ARCHITECTURE BROWSER',sourceFreeze:freeze,cases:b.captures.map(c=>({program:c.program,prefix:c.prefix})),event:event.id,artifacts:['browser.json','architecture.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Exact complete displayed correspondence reports for destructive shared-slot prefix0 and maximum-time prefix1 match all-prefix qualification. Comparator disclosure and event navigation preserve native hashes. This is bounded browser coverage, not all programs, causal necessity or Campaign4 entry.'},null,2)+'\n',{flag:'wx'});console.log('PASS bounded LONG architecture browser');
}
