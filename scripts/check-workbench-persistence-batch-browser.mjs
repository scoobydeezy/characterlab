import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-persistence-browser-rev1',nativeRoot='docs/planning/workbench-batch-persistence-shared-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));const native=read(nativeRoot+'/receipt.json');assert.equal(native.status,'PASS SHARED PERSISTENCE BATCH');
 for(const s of native.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 const build='C:/Users/scoob/AppData/Local/Temp/characterlab-workbench-663',assets=[];
 function visit(relative=''){for(const entry of fs.readdirSync(path.join(build,relative),{withFileTypes:true})){
  const name=path.join(relative,entry.name);if(entry.isDirectory())visit(name);else{const served=path.join(build,name),bytes=fs.readFileSync(served),copy=path.join(root,'assets',name);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});assets.push({served,copy,sha256:sha(bytes)});}
 }}visit();assert(assets.some(a=>a.served.endsWith('index.html')));
 const verifier=fs.readFileSync('scripts/check-workbench-persistence-batch-browser.mjs');fs.writeFileSync(root+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources:native.sources,assets,verifierSha256:sha(verifier),nativeReceiptSha256:sha(fs.readFileSync(nativeRoot+'/receipt.json')),currentSourceHold:false},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN persistence browser assets and source copies');
}else{
 const freeze=read(root+'/freeze.json'),native=read(nativeRoot+'/receipt.json');
 assert.equal(sha(fs.readFileSync(nativeRoot+'/receipt.json')),freeze.nativeReceiptSha256);assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),freeze.verifierSha256);
 for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
 for(const a of freeze.assets){assert.equal(sha(fs.readFileSync(a.served)),a.sha256,a.served);assert.equal(sha(fs.readFileSync(a.copy)),a.sha256,a.copy);}
 const artifacts=[];
 for(const id of ['adapt','det']){
  const b=read(root+'/'+id+'.json'),expected=structuredClone(native.report),other=id==='adapt'?'det':'adapt';
  expected.originals[other].programs=[];expected.originals[other].models=[];
  expected.experiments=expected.experiments.filter(e=>e.id===id);expected.snapshot.results=expected.snapshot.results.filter(r=>r.job.experimentId===id);expected.snapshot.current=2;
  const results=expected.snapshot.results,prefixes=results.reduce((n,r)=>n+r.prefixes.length,0);
  assert.equal(b.status,`2/2 execution roles complete · ${prefixes} prefixes checked`);assert.deepEqual(b.alerts,[]);
  assert.deepEqual(b.rows,results.map(r=>({id:r.job.id,status:r.status,checks:r.prefixes.length+'/'+r.job.expectedSaveHashes.length,seed:String(r.job.seed)})));
  assert.deepEqual(b.hashes,results.flatMap(r=>r.prefixes.flatMap(p=>[p.saveHash,p.expectedSaveHash])));
  const text=JSON.stringify(expected,null,2);assert.equal(b.preview,text.slice(0,64000));assert.equal(b.downloadLabel,'Download complete JSON ('+Buffer.byteLength(text).toLocaleString('en-US')+' bytes)');
  assert(b.limitCaption.includes('at most 1072 execution roles and 33 retained prefixes per program'));
  for(const suffix of ['json','png']){const file=id+'.'+suffix;artifacts.push({path:file,sha256:sha(fs.readFileSync(root+'/'+file))});}
 }
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS ADAPT AND DET SHARED BROWSER BATCH',roles:4,prefixes:26,displayedHashes:52,freeze,artifacts,
  scope:'All four new V11 roles across two cohort selections; exact displayed seed/prefix hashes, report previews and byte declarations. Full1072 replay, download transport, broader ADAPT/DET controls, BIO/SEM and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS browser4 roles/26 prefixes/52 displayed hashes');
}
