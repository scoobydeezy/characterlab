import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-persistence-batch-rev1';assert(!fs.existsSync(root),'Preserve existing evidence');
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),bytes=h=>Uint8Array.from(Buffer.from(h,'hex'));
const catalog=read('src/workbench/batchCatalogV11.json'),previous=read('src/workbench/batchCatalogV10.json');assert.deepEqual(catalog.jobs.slice(0,1068),previous.jobs);
const paths=new Set();function visit(p){p=p.replaceAll('\\','/');if(paths.has(p))return;paths.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;
 for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){
  const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);
 }}
for(const p of ['src/workbench/persistenceBatch.ts','src/test/workbenchPersistenceBatch.test.ts',
 'scripts/check-workbench-persistence-batch.mjs','scripts/build-workbench-batch-catalog-v11.mjs','package.json','package-lock.json',
 'docs/planning/workbench-adapt-parent-parity-rev1/receipt.json','docs/planning/workbench-det-parity-rev1/receipt.json'])visit(p);
const sources=[...paths].sort().map(path=>{const b=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return {path,copy,sha256:sha(b)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {createPersistenceBatchRun}=await server.ssrLoadModule('/src/workbench/persistenceBatch.ts'),results=[];
 for(const job of catalog.jobs.slice(1068)){
  const original=catalog[job.experimentId],p=original.programs.find(p=>p.name===job.name),m=original.models.find(m=>m.name===p.model);
  assert.equal(p.runSeed,'00'.repeat(32));assert.equal(job.seed,0);
  const isAdapt=job.experimentId==='adapt',mod=await server.ssrLoadModule(isAdapt?'/src/campaign2/memoryFactory.ts':'/src/campaign2/cognitiveFactory.ts');
  const prepare=isAdapt?mod.prepareMemoryModel:mod.prepareCognitiveModel,create=isAdapt?mod.createMemoryRun:mod.createCognitiveRun;
  const source={...original.versions,...Object.fromEntries(['parameters','registry','content'].map(k=>[k,bytes(m[k])]))};
  const native=await create(await prepare(source),{initialState:bytes(p.initialState),orderedInputs:bytes(p.orderedInputs),runSeed:bytes(p.runSeed)});
  const prior=read(`docs/planning/${isAdapt?'workbench-adapt-parent-parity-rev1':'workbench-det-parity-rev1'}/receipt.json`).results.find(r=>r.program===job.name);
  const expected=prior.prefixes??prior.checks,run=await createPersistenceBatchRun(job),prefixes=[];
  for(const [i,e]of expected.entries()){
   const view=run.view(),state=native.snapshot();
   assert.equal(view.prefix,i);assert.equal(view.total,expected.length-1);assert.equal(view.complete,i===expected.length-1);
   assert.equal(view.clock,String(state.clock));assert.equal(view.modelHash,sha(bytes(m.modelIdentity)));assert.equal(view.runHash,sha(native.runIdentity()));
   assert.equal(view.stateHash,sha(state.state));assert.equal(view.saveHash,sha(native.save()));
   for(const key of ['prefix','clock','stateHash','saveHash'])assert.equal(view[key],e[key],`${job.id}/${i}/${key}`);
   assert.equal(sha(state.outputs),e.outputsHash);assert.equal(sha(state.trace),e.traceHash);assert.equal(view.saveHash,job.expectedSaveHashes[i]);
   prefixes.push(view);const moved=await run.advance();assert.equal(moved,await native.settleNextInstant());assert.equal(moved,i+1<expected.length);
   if(!moved){assert.deepEqual(run.view(),view);assert.equal(sha(native.save()),view.saveHash);}
  }
  results.push({job,prefixes});console.log(`PASS ${job.id}/${prefixes.length}`);
 }
 assert.equal(results.length,4);assert.equal(results.reduce((n,r)=>n+r.prefixes.length,0),26);
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS PREPARED PERSISTENCE BATCH TRANSPORT',sources,roles:4,prefixes:26,results,
  scope:'ADAPT accepted parent2/8 and DET cognitive successor2/18, exact original seeds and direct public native clock/model/run/state/save/output/trace joins plus terminal no-ops. Prepared transport only; shared session/worker/UI not yet admitted. Other ADAPT/DET controls, BIO/SEM and full Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),stack:error.stack},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
