import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-scoped-shared-rev1',reference='docs/planning/workbench-scoped-batch-rev2';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const accepted=read(reference+'/acceptance.json'),prior=read(reference+'/receipt.json');
assert.equal(accepted.status,'PASS INDEPENDENT SCOPED TRANSPORT RECONCILIATION');
assert.equal(sha(fs.readFileSync(reference+'/receipt.json')),accepted.receiptSha256);
const catalog=read(reference+'/sources/src/workbench/batchCatalogV12.json');
const catalogBinding=prior.sources.find(s=>s.path==='src/workbench/batchCatalogV12.json');
assert(catalogBinding);assert.equal(sha(fs.readFileSync(catalogBinding.copy)),catalogBinding.sha256);
const jobs=catalog.jobs.slice(1072);assert.equal(jobs.length,14);assert.deepEqual(prior.results.map(r=>r.job),jobs);
const expectedResults=prior.results.map(r=>({job:r.job,status:'complete',prefixes:r.prefixes.map(p=>({...p,expectedSaveHash:p.saveHash,matchesFrozenSave:true}))}));
function verify(report){
 assert.equal(report.version,'workbench-batch-export/0.12');assert.equal(report.registryVersion,'workbench-experiments/0.27');
 assert.equal(report.catalogVersion,catalog.version);assert.deepEqual(report.catalogSources,catalog.sources);
 assert.deepEqual(report.resourceLimits,{jobs:1086,prefixesPerJob:33,simultaneousRuns:1});
 assert.equal(report.snapshot.version,'workbench-batch/0.12');assert.equal(report.snapshot.status,'complete');assert.equal(report.snapshot.current,14);
 assert.deepEqual(report.snapshot.results,expectedResults);
 assert.deepEqual(report.originals.bio,catalog.bio);assert.deepEqual(report.originals.sem,catalog.sem);
 assert.equal(report.executionBoundaries.length,14);
 for(const [i,b]of report.executionBoundaries.entries()){
  assert.equal(b.id,jobs[i].id);
  assert.equal(b.kind,jobs[i].executionKind);
  assert.equal(b.clock,jobs[i].experimentId==='bio'?'unavailable':'native');
 }
 assert.equal(report.snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),264);
}
if(process.argv.includes('--preflight')){
 const fixture={version:'workbench-batch-export/0.12',registryVersion:'workbench-experiments/0.27',catalogVersion:catalog.version,catalogSources:catalog.sources,
  resourceLimits:{jobs:1086,prefixesPerJob:33,simultaneousRuns:1},snapshot:{version:'workbench-batch/0.12',status:'complete',current:14,results:expectedResults},
  originals:{bio:catalog.bio,sem:catalog.sem},executionBoundaries:jobs.map(j=>({id:j.id,kind:j.executionKind,clock:j.experimentId==='bio'?'unavailable':'native'}))};
 verify(fixture);
 const mutations=[
  ['missing role',r=>r.snapshot.results.pop()],['reordered roles',r=>[r.snapshot.results[0],r.snapshot.results[1]]=[r.snapshot.results[1],r.snapshot.results[0]]],
  ['partial status',r=>r.snapshot.status='running'],['invented BIO clock',r=>r.snapshot.results[0].prefixes[0].clock='0'],
  ['missing SEM clock',r=>r.snapshot.results[13].prefixes[0].clock=null],['repeated SEM seed',r=>r.snapshot.results[13].job.seedHex='0d'.repeat(32)],
  ['wrong state with matching save',r=>r.snapshot.results[0].prefixes[0].stateHash='00'.repeat(32)],
  ['false match',r=>r.snapshot.results[0].prefixes[0].matchesFrozenSave=false],['wrong expected save',r=>r.snapshot.results[0].prefixes[0].expectedSaveHash='00'.repeat(32)],
  ['missing prefix',r=>r.snapshot.results[0].prefixes.pop()],['promoted component',r=>r.executionBoundaries[0].kind='public-run'],
  ['false component clock label',r=>r.executionBoundaries[0].clock='native'],['misbound boundary',r=>r.executionBoundaries[0].id='other'],
  ['missing BIO originals',r=>r.originals.bio.plan.cases.pop()],['changed SEM originals',r=>r.originals.sem.runSeed='0d'.repeat(32)]];
 for(const [label,mutate]of mutations){const candidate=structuredClone(fixture);mutate(candidate);assert.throws(()=>verify(candidate),undefined,label);}
 const evidence='docs/planning/workbench-scoped-shared-verifier-rev1';assert(!fs.existsSync(evidence),'Preserve prior evidence');fs.mkdirSync(evidence,{recursive:true});
 const verifier=fs.readFileSync('scripts/verify-workbench-scoped-shared.mjs');fs.writeFileSync(evidence+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(evidence+'/preflight.json',JSON.stringify({status:'PASS SHARED SCOPED VERIFIER PREFLIGHT ONLY',roles:14,prefixes:264,referenceReceiptSha256:accepted.receiptSha256,
  verifierSha256:sha(verifier),rejectedMutations:mutations.map(([label])=>label),scope:'Retained transport references exercise independent report validation. No new native execution, shared worker, browser or full corpus acceptance.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS shared verifier preflight14/264;15 corruptions rejected; fresh shared execution remains pending');
}else{
 const manifest=read(root+'/manifest.json'),receipt=read(root+'/receipt.json');assert.equal(manifest.status,'FROZEN BEFORE EXECUTION');
 assert.equal(receipt.status,'PASS SHARED BIO SEM SCOPED BATCH');assert.equal(receipt.roles,14);assert.equal(receipt.prefixes,264);assert.deepEqual(receipt.sources,manifest.sources);
 assert.equal(new Set(manifest.sources.map(s=>s.path)).size,manifest.sources.length);
 for(const s of manifest.sources){assert.equal(s.copy,root+'/sources/'+s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
 const sourceBindings=new Map(manifest.sources.map(s=>[s.path,s]));
 assert.equal(sourceBindings.get(reference+'/receipt.json')?.sha256,accepted.receiptSha256);
 assert.equal(sourceBindings.get('src/workbench/batchCatalogV12.json')?.sha256,catalogBinding.sha256);
 verify(receipt.report);
 const verifier=fs.readFileSync('scripts/verify-workbench-scoped-shared.mjs');fs.writeFileSync(root+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(root+'/acceptance.json',JSON.stringify({status:'PASS INDEPENDENT SHARED SCOPED RECONCILIATION',roles:14,prefixes:264,sourcesVerified:manifest.sources.length,
  receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),verifierSha256:sha(verifier),scope:'Exact accepted native transport views, seeds, clock boundaries, complete BIO/SEM originals and shared report metadata. Browser, prior1072 fresh execution and complete corpus remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS independent shared14/264 reconciliation');
}
