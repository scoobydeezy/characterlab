import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-scoped-batch-rev2';assert(!fs.existsSync(root),'Preserve evidence');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const catalog=read('src/workbench/batchCatalogV12.json'),previous=read('src/workbench/batchCatalogV11.json');assert.deepEqual(catalog.jobs.slice(0,1072),previous.jobs);
const bioRoot='docs/planning/workbench-bio-parity-rev1',bioReceipt=read(bioRoot+'/receipt.json'),semReceipt=read('docs/planning/workbench-sem-parity-rev1/receipt.json');
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;
 for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){
  const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);
 }}
for(const p of ['src/workbench/scopedBatch.ts','src/test/workbenchScopedBatch.test.ts','scripts/build-workbench-batch-catalog-v12.mjs','scripts/check-workbench-scoped-batch.mjs',
 'package.json','package-lock.json',bioRoot+'/receipt.json','docs/planning/workbench-sem-parity-rev1/receipt.json',...bioReceipt.cases.map(c=>bioRoot+'/'+c.path)])visit(p);
const sources=[...files].sort().map(path=>{const b=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return {path,copy,sha256:sha(b)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {createScopedBatchRun}=await server.ssrLoadModule('/src/workbench/scopedBatch.ts');
 const {canonicalEncode:enc,list}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {createBioComparison}=await server.ssrLoadModule('/src/campaign3/bioComparison.ts');
 const h=await server.ssrLoadModule('/src/test/fixtures/phenSem001Run.ts'),{createCanonicalSave}=await server.ssrLoadModule('/src/substrate/persistence.ts');
 const results=[];
 for(const job of [...catalog.jobs.slice(-1),...catalog.jobs.slice(1072,-1)]){
  const run=await createScopedBatchRun(job),prefixes=[];
  if(job.experimentId==='bio'){
   assert.equal(job.executionKind,'composed-component');assert.equal(job.seedHex,job.seed.toString(16).padStart(2,'0').repeat(32));
   const spec=catalog.bio.identities.runs.find(r=>r.name===job.name),model=catalog.bio.identities.models.find(m=>m.law===job.law);
   assert.equal(spec.earlySeed,job.seed);assert.equal(spec.law,job.law);
   const artifact=bioReceipt.cases.find(c=>c.name===job.name),body=fs.readFileSync(bioRoot+'/'+artifact.path);assert.equal(sha(body),artifact.sha256);const expected=JSON.parse(body).prefixes;
   const native=createBioComparison(job.law,{earlySeed:job.seed,contrarySeeds:catalog.bio.plan.contrarySeeds});
   for(const [i,e]of expected.entries()){
    const v=run.view();assert.equal(v.prefix,i);assert.equal(v.total,19);assert.equal(v.complete,i===19);assert.equal(v.clock,null);
    for(const k of ['prefix','modelHash','runHash','stateHash','saveHash'])assert.equal(v[k],e[k],`${job.id}/${i}/${k}`);
    assert.equal(v.modelHash,sha(Buffer.from(model.modelIdentity,'hex')));assert.equal(v.runHash,sha(Buffer.from(spec.runIdentity,'hex')));
    assert.equal(v.stateHash,sha(enc(native.snapshot())));assert.equal(v.saveHash,sha(native.save()));assert.equal(v.saveHash,job.expectedSaveHashes[i]);prefixes.push(v);
    const moved=await run.advance();assert.equal(moved,await native.step());assert.equal(moved,i<19);if(!moved)assert.deepEqual(run.view(),v);
   }
  }else{
   assert.equal(job.executionKind,'fixed-scheduler-harness');const state=h.initialState(),identity=await h.identities(state);
   const seed=identity.runIdentity.value.fields.get(4n);assert.equal(seed.kind,'bytes');assert.equal(Buffer.from(seed.value).toString('hex'),job.seedHex);
   assert.equal(job.seed,13);assert.equal(identity.runIdentity.value.fields.get(3n).value.length,32);
   assert.equal(Buffer.from(identity.runIdentity.value.fields.get(3n).value).toString('hex'),sha(enc(list([]))));
   const native=h.scheduler(state,new Map([[h.handlerKey(h.OBSERVE),h.observeHandler()]]));
   for(const [i,e]of semReceipt.results.entries()){
    const v=run.view(),save=createCanonicalSave({scheduler:native,stateAdapter:h.adapter,...identity,continuingRunInputs:list([])});
    assert.equal(v.prefix,i);assert.equal(v.total,3);assert.equal(v.complete,i===3);assert.equal(v.clock,String(native.getClock()));
    for(const k of ['prefix','clock','stateHash','saveHash'])assert.equal(v[k],e[k]);
    assert.equal(v.modelHash,sha(identity.modelIdentity.canonicalBytes));assert.equal(v.runHash,sha(identity.runIdentity.canonicalBytes));
    assert.equal(v.stateHash,sha(enc(h.adapter.canonicalValue(native.getState()))));assert.equal(v.saveHash,sha(save));assert.equal(v.saveHash,job.expectedSaveHashes[i]);
    assert.equal(sha(enc(list(native.getOutputs()))),e.outputsHash);assert.equal(sha(enc(list(native.getCommittedTrace()))),e.traceHash);prefixes.push(v);
    const moved=await run.advance();assert.equal(moved,i<3);
    if(i<3){const [observer,at,experience]=h.SCHEDULE[i];native.schedule({dueAt:at,phase:10n,eventTypeId:h.OBSERVE,payload:h.observerPayload(observer,experience),dependencies:list([])});const settled=await native.settleNextInstant();assert(settled,'SEM scheduled instant must settle');assert.equal(settled.dueAt,at);}else assert.deepEqual(run.view(),v);
   }
  }
  const result={job,prefixes};results.push(result);const index=catalog.jobs.findIndex(j=>j.id===job.id)-1072;fs.writeFileSync(root+'/role-'+String(index).padStart(2,'0')+'.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(`PASS ${results.length}/14 ${job.id}`);
 }
 results.sort((a,b)=>catalog.jobs.findIndex(j=>j.id===a.job.id)-catalog.jobs.findIndex(j=>j.id===b.job.id));
 assert.equal(results.length,14);assert.equal(results.reduce((n,r)=>n+r.prefixes.length,0),264);
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS PREPARED BIO SEM SCOPED TRANSPORT',sources,roles:14,prefixes:264,results,
  scope:'BIO13/260 component steps preserve null scheduler clock and original seed routing; SEM1/4 fixed harness preserves native time,exact friendly13 seed and empty original input commitment. Direct native and retained prefix identities/saves match with terminal no-ops. Not shared batch admission, public factory promotion, complete controls, language or Campaign4 entry.'},null,2)+'\n',{flag:'wx'});
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),stack:error.stack},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
