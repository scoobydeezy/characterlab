import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-bio-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const planPath='docs/planning/BIO_COMPARISON_PLAN_REV3.json',identityPath='docs/planning/BIO_IDENTITY_PLAN_REV1.json',resultPath='docs/planning/BIO_COMPARISON_RESULT_REV3.json';
const plan=JSON.parse(fs.readFileSync(planPath)),identities=JSON.parse(fs.readFileSync(identityPath)),historical=JSON.parse(fs.readFileSync(resultPath));
for(const a of [...plan.artifacts,...identities.artifacts])assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
const paths=[...new Set(['src/workbench/bioAdapter.ts','src/workbench/canonical.ts','src/test/workbenchBio.test.ts','scripts/check-workbench-bio.mjs',planPath,identityPath,resultPath,...plan.artifacts.map(a=>a.path),...identities.artifacts.map(a=>a.path)])];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {BioWorkbenchRun,BIO_CASES}=await server.ssrLoadModule('/src/workbench/bioAdapter.ts'),{createBioComparison,bioSummary}=await server.ssrLoadModule('/src/campaign3/bioComparison.ts'),{canonicalEncode}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{dataItems}=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 assert.deepEqual(BIO_CASES,identities.runs.map(r=>r.name));const cases=[];
 for(const [index,spec]of plan.cases.entries()){
  const a=await BioWorkbenchRun.create(spec.name),native=createBioComparison(spec.law,{earlySeed:spec.earlySeed,contrarySeeds:plan.contrarySeeds}),checkpoints=[],prefixes=[];
  for(let prefix=0;prefix<=19;prefix++){
   const before=a.checkpoint(),s=a.snapshot();assert.equal(before.saveHex,Buffer.from(native.save()).toString('hex'));assert.equal(s.stateHash,sha(canonicalEncode(native.snapshot())));assert.equal(s.prefix,prefix);assert.equal(s.complete,prefix===19);
   const rows=dataItems(dataItems(native.snapshot(),'list')[3],'list');assert.deepEqual(s.records.map(r=>r.summary),rows.map(bioSummary));assert.deepEqual(a.checkpoint(),before);
   const model=identities.models.find(m=>m.law===spec.law),run=identities.runs.find(r=>r.name===spec.name);assert.equal(s.modelHash,sha(Buffer.from(model.modelIdentity,'hex')));assert.equal(s.runHash,sha(Buffer.from(run.runIdentity,'hex')));
   checkpoints.push(before);prefixes.push({prefix,stateHash:s.stateHash,saveHash:s.saveHash,modelHash:s.modelHash,runHash:s.runHash,records:s.records.length,recordsHash:sha(JSON.stringify(s.records))});
   assert.equal(await a.advance(),await native.step());
  }
  assert.equal(a.snapshot().saveHash,historical.results.find(r=>r.name===spec.name).saveSha256);
  for(const [i,c]of checkpoints.entries()){
   const restored=await BioWorkbenchRun.restore(c);assert.deepEqual(restored.checkpoint(),c);assert.equal(await restored.advance(),i<19);assert.deepEqual(restored.checkpoint(),checkpoints[Math.min(i+1,19)]);
  }
  const path=`case-${String(index).padStart(2,'0')}.json`;fs.writeFileSync(root+'/'+path,JSON.stringify({name:spec.name,law:spec.law,prefixes,finalRecords:a.snapshot().records},null,2)+'\n',{flag:'wx'});cases.push({name:spec.name,path,sha256:sha(fs.readFileSync(root+'/'+path)),prefixes:prefixes.length});console.log(`PASS ${index+1}/13 ${spec.name}:20 component prefixes and continuations`);
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BIO COMPONENT ADAPTER PARITY AND CONTINUATION',sources,cases,counts:{cases:cases.length,prefixes:cases.reduce((n,c)=>n+c.prefixes,0)},scope:'All13 identity-bound BIO component cases/260 prefixes; current save bytes/state hashes/row summaries equal direct components, final saves match historical qualified matrix. Every checkpoint restores and reproduces its next save or terminal no-op. Diagnostic reads preserve checkpoints. These are composed component records, not public scheduler trace or factory admission. No browser, observer-safe language, broader biography or Campaign4 entry qualification.'},null,2)+'\n',{flag:'wx'});console.log('PASS full BIO adapter');
}finally{await server.close();}
