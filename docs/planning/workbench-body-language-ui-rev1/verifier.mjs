import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-body-language-ui-rev1',parent='docs/planning/workbench-body-language-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const r=read(parent+'/receipt.json');assert.equal(r.status,'PASS BODY ADMITTED PRESSURE LANGUAGE');
 for(const s of r.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 const script='scripts/check-workbench-body-language-ui.mjs',bytes=fs.readFileSync(script);fs.writeFileSync(root+'/verifier.mjs',bytes,{flag:'wx'});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources:r.sources,parent:{path:parent+'/receipt.json',sha256:sha(fs.readFileSync(parent+'/receipt.json'))},verifier:{path:script,sha256:sha(bytes)}},null,2)+'\n',{flag:'wx'});console.log('FROZEN BODY language browser qualification');
}else{
 const freeze=read(root+'/freeze.json'),r=read(freeze.parent.path),b=read(root+'/browser.json');
 assert.equal(sha(fs.readFileSync(freeze.parent.path)),freeze.parent.sha256);assert.equal(sha(fs.readFileSync(freeze.verifier.path)),freeze.verifier.sha256);assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifier.sha256);
 for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(parent+'/sources/'+s.path)),s.sha256,s.path);}
 assert.deepEqual(b.captures.map(c=>[c.program,c.prefix]),[['baseline',0],['baseline',1],['baseline',2],['baseline',3],['unavailable',1]]);
 for(const c of b.captures){
  const file=r.results.find(x=>x.program===c.program),bytes=fs.readFileSync(parent+'/'+file.path);assert.equal(sha(bytes),file.sha256);const expected=JSON.parse(bytes)[c.prefix];
  assert.deepEqual(JSON.parse(c.report),expected.report);assert.deepEqual(c.descriptions,expected.report.rows.map(r=>r.text));assert.equal(c.alerts,0);
  assert.deepEqual(c.hashes,['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'].map(k=>expected.identity[k]));
 }
 assert.deepEqual(b.beforeDisclosureHashes,b.afterDisclosureHashes);
 assert.deepEqual(JSON.parse(b.captures[3].report).rows.slice(0,2),JSON.parse(b.captures[2].report).rows);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED BODY LANGUAGE BROWSER',sourceFreeze:freeze,cases:b.captures.map(c=>({program:c.program,prefix:c.prefix})),artifacts:['browser.json','language.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Five displayed prefixes match complete qualified description records and six native hashes. Empty, known-zero, positive and unavailable states covered; historical text survives later delivery/sampling. Keyboard evidence disclosure preserves hashes. Full corpus browser and complete workbench entry remain separate.'},null,2)+'\n',{flag:'wx'});console.log('PASS bounded BODY language browser');
}
