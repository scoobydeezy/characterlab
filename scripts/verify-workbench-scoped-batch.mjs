import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-scoped-batch-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=read(root+'/manifest.json'),bindings=new Map(manifest.sources.map(s=>[s.path,s]));assert.equal(bindings.size,manifest.sources.length);
for(const s of manifest.sources){assert.equal(s.copy,root+'/sources/'+s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
function frozen(p){const s=bindings.get(p);assert(s,`Missing frozen source ${p}`);return read(s.copy);}
const catalog=frozen('src/workbench/batchCatalogV12.json'),previous=frozen('src/workbench/batchCatalogV11.json');
assert.deepEqual(catalog.jobs.slice(0,1072),previous.jobs);const jobs=catalog.jobs.slice(1072);assert.equal(jobs.length,14);
const bio=frozen('docs/planning/workbench-bio-parity-rev1/receipt.json'),sem=frozen('docs/planning/workbench-sem-parity-rev1/receipt.json');
assert.equal(bio.status,'PASS BIO COMPONENT ADAPTER PARITY AND CONTINUATION');assert.equal(sem.status,'PASS ACCEPTED SEM INTEGRATED HARNESS PARITY');
const expected=jobs.map(job=>{
 if(job.experimentId==='bio'){
  const run=catalog.bio.identities.runs.find(r=>r.name===job.name),model=catalog.bio.identities.models.find(m=>m.law===run.law);
  assert.equal(job.executionKind,'composed-component');assert.equal(job.law,run.law);assert.equal(job.seed,run.earlySeed);
  assert.equal(job.seedHex,run.earlySeed.toString(16).padStart(2,'0').repeat(32));
  const artifact=bio.cases.find(c=>c.name===job.name),p='docs/planning/workbench-bio-parity-rev1/'+artifact.path;
  assert.equal(bindings.get(p).sha256,artifact.sha256);const prior=frozen(p);assert.equal(prior.prefixes.length,20);
  return {job,prefixes:prior.prefixes.map(v=>({prefix:v.prefix,total:19,complete:v.prefix===19,clock:null,modelHash:sha(Buffer.from(model.modelIdentity,'hex')),runHash:sha(Buffer.from(run.runIdentity,'hex')),stateHash:v.stateHash,saveHash:v.saveHash}))};
 }
 assert.equal(job.experimentId,'sem');assert.equal(job.executionKind,'fixed-scheduler-harness');assert.equal(job.seed,13);
 assert.equal(job.seedHex,'00'.repeat(31)+'0d');assert.equal(catalog.sem.runSeed,job.seedHex);assert.equal(catalog.sem.fixtureDigest,sem.fixtureDigest);
 assert.equal(sem.results.length,4);
 return {job,prefixes:sem.results.map(v=>({prefix:v.prefix,total:3,complete:v.prefix===3,clock:v.clock,modelHash:sha(Buffer.from(catalog.sem.modelIdentity,'hex')),runHash:sha(Buffer.from(catalog.sem.runIdentity,'hex')),stateHash:v.stateHash,saveHash:v.saveHash}))};
});
function verify(results){
 assert.equal(results.length,14);let prefixes=0;
 for(const [i,r]of results.entries()){
  const e=expected[i];assert.deepEqual(r.job,e.job);assert.equal(r.prefixes.length,e.prefixes.length);
  for(const [j,p]of r.prefixes.entries()){
   assert.deepEqual(p,e.prefixes[j],`${r.job.id}/${j}`);assert.equal(p.prefix,j);assert.equal(p.saveHash,r.job.expectedSaveHashes[j]);prefixes++;
  }
 }
 assert.equal(prefixes,264);return prefixes;
}
if(process.argv.includes('--preflight')){
 verify(expected);
 const mutations=[['missing role',r=>r.pop()],['reordered role',r=>[r[0],r[1]]=[r[1],r[0]]],
  ['invented component clock',r=>r[0].prefixes[0].clock='0'],['missing SEM clock',r=>r[13].prefixes[0].clock=null],
  ['wrong SEM seed encoding',r=>r[13].job.seedHex='0d'.repeat(32)],['promoted BIO boundary',r=>r[0].job.executionKind='public-run'],
  ['wrong saved state',r=>r[0].prefixes[0].stateHash='00'.repeat(32)],['missing prefix',r=>r[0].prefixes.pop()],
  ['early completion',r=>r[0].prefixes[0].complete=true],['wrong model identity',r=>r[0].prefixes[0].modelHash='00'.repeat(32)]];
 for(const [label,mutate]of mutations){const r=structuredClone(expected);mutate(r);assert.throws(()=>verify(r),undefined,label);}
 const evidence='docs/planning/workbench-scoped-batch-verifier-rev2';fs.mkdirSync(evidence,{recursive:true});
 const verifier=fs.readFileSync('scripts/verify-workbench-scoped-batch.mjs');fs.writeFileSync(evidence+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(evidence+'/preflight.json',JSON.stringify({status:'PASS SCOPED VERIFIER PREFLIGHT ONLY',priorRoles:14,priorPrefixes:264,sourcesVerified:manifest.sources.length,rejectedMutations:mutations.map(([label])=>label),verifierSha256:sha(verifier),
  scope:'Retained native references exercise comparison and ten corruption rejections. This is not fresh scoped transport completion, shared admission or browser acceptance.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS preflight14/264;10 corruptions rejected; live audit acceptance remains pending');
}else{
 const receipt=read(root+'/receipt.json');assert.equal(receipt.status,'PASS PREPARED BIO SEM SCOPED TRANSPORT');assert.deepEqual(receipt.sources,manifest.sources);assert.equal(receipt.roles,14);assert.equal(receipt.prefixes,264);
 const prefixes=verify(receipt.results);for(const s of manifest.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 const verifier=fs.readFileSync('scripts/verify-workbench-scoped-batch.mjs');fs.writeFileSync(root+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(root+'/acceptance.json',JSON.stringify({status:'PASS INDEPENDENT SCOPED TRANSPORT RECONCILIATION',roles:14,prefixes,sourcesVerified:manifest.sources.length,sourceHoldReleased:true,receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),verifierSha256:sha(verifier),
  scope:'All BIO component/SEM harness declarations,seed encodings,clocks,model/run/state/save identities and retained prefix boundaries reconciled. Direct native execution,empty SEM input commitment and terminal no-ops are evidenced by frozen writer. Shared UI/worker and full corpus acceptance remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log(`PASS independent14/264; released ${manifest.sources.length} current-source holds`);
}
