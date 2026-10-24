import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-scoped-browser-rev1',nativeRoot='docs/planning/workbench-batch-scoped-shared-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root),'Preserve existing evidence');
 const native=read(nativeRoot+'/receipt.json'),acceptance=read(nativeRoot+'/acceptance.json');
 assert.equal(native.status,'PASS SHARED BIO SEM SCOPED BATCH');assert.equal(acceptance.status,'PASS INDEPENDENT SHARED SCOPED RECONCILIATION');
 assert.equal(sha(fs.readFileSync(nativeRoot+'/receipt.json')),acceptance.receiptSha256);
 for(const s of native.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 const build='C:/Users/scoob/AppData/Local/Temp/characterlab-workbench-665',assets=[];
 function visit(relative=''){for(const entry of fs.readdirSync(path.join(build,relative),{withFileTypes:true})){
  const name=path.join(relative,entry.name);if(entry.isDirectory())visit(name);else{const served=path.join(build,name),bytes=fs.readFileSync(served),copy=path.join(root,'assets',name);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});assets.push({served,copy,sha256:sha(bytes)});}
 }}visit();assert(assets.some(a=>a.served.endsWith('index.html')));
 const verifier=fs.readFileSync('scripts/check-workbench-scoped-batch-browser.mjs');fs.writeFileSync(root+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources:native.sources,assets,verifierSha256:sha(verifier),nativeReceiptSha256:acceptance.receiptSha256,
  nativeAcceptanceSha256:sha(fs.readFileSync(nativeRoot+'/acceptance.json')),currentSourceHold:false},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN scoped browser assets; browser acceptance remains pending');
}else{
 const freeze=read(root+'/freeze.json'),native=read(nativeRoot+'/receipt.json');
 assert.equal(sha(fs.readFileSync(nativeRoot+'/receipt.json')),freeze.nativeReceiptSha256);
 assert.equal(sha(fs.readFileSync(nativeRoot+'/acceptance.json')),freeze.nativeAcceptanceSha256);
 assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifierSha256);
 assert.equal(sha(fs.readFileSync('scripts/check-workbench-scoped-batch-browser.mjs')),freeze.verifierSha256);
 for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
 for(const a of freeze.assets){assert.equal(sha(fs.readFileSync(a.served)),a.sha256,a.served);assert.equal(sha(fs.readFileSync(a.copy)),a.sha256,a.copy);}
 const artifacts=[];
 for(const id of ['bio','sem']){
  const b=read(root+'/'+id+'.json'),expected=structuredClone(native.report),other=id==='bio'?'sem':'bio';
  expected.originals[other]=null;expected.experiments=expected.experiments.filter(e=>e.id===id);
  expected.snapshot.results=expected.snapshot.results.filter(r=>r.job.experimentId===id);
  expected.executionBoundaries=expected.executionBoundaries.filter(e=>expected.snapshot.results.some(r=>r.job.id===e.id));
  const results=expected.snapshot.results,count=id==='bio'?13:1,prefixes=id==='bio'?260:4;
  expected.snapshot.current=count;assert.equal(results.length,count);assert.equal(results.reduce((n,r)=>n+r.prefixes.length,0),prefixes);
  assert.equal(b.status,`${count}/${count} execution roles complete · ${prefixes} prefixes checked`);assert.deepEqual(b.alerts,[]);
  assert.deepEqual(b.headers,['Program','Execution boundary','Law / seed','Status','Prefix checks','Exact evidence']);
  assert.deepEqual(b.rows,results.map((r,i)=>{const boundary=expected.executionBoundaries[i];return {
   id:r.job.id,status:r.status,checks:r.prefixes.length+'/'+r.job.expectedSaveHashes.length,seed:r.job.seedHex,
   seedLabel:(id==='bio'?'Early decision run seed (32-byte hex)':'Run seed (32-byte hex)')+': '+r.job.seedHex,
   boundary:{kind:boundary.kind,label:boundary.label,step:boundary.step+'. '+(boundary.clock==='unavailable'?'Scheduler clock unavailable.':'Native scheduler clock.'),qualification:boundary.qualification}
  };}));
  assert.deepEqual(b.hashes,results.flatMap(r=>r.prefixes.flatMap(p=>[p.saveHash,p.expectedSaveHash])));
  const text=JSON.stringify(expected,null,2);assert.equal(b.preview,text.slice(0,64000));
  assert.equal(b.downloadLabel,'Download complete JSON ('+Buffer.byteLength(text).toLocaleString('en-US')+' bytes)');
  assert(b.limitCaption.includes('at most 1086 execution roles and 33 retained prefixes per program'));
  for(const suffix of ['json','png']){const file=id+'.'+suffix;artifacts.push({path:file,sha256:sha(fs.readFileSync(root+'/'+file))});}
 }
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BIO AND SEM SHARED BROWSER BATCH',roles:14,prefixes:264,displayedHashes:528,freeze,artifacts,
  scope:'Two browser cohort selections; exact seeds, declared boundaries, 528 actual/expected hash strings, report previews and byte declarations. Complete report download transport, fresh1086 execution, broader BIO/SEM controls, player language and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS browser14 roles/264 prefixes/528 displayed hashes');
}
