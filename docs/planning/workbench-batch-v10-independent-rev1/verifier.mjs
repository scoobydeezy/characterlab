import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const root='docs/planning/workbench-batch-parity-rev10';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=read(root+'/manifest.json');
assert.equal(manifest.status,'FROZEN BEFORE EXECUTION');
assert.equal(manifest.currentSourceHold,false);
const bindings=new Map(manifest.sources.map(s=>[s.path,s]));
assert.equal(bindings.size,manifest.sources.length);
for(const s of manifest.sources){
 assert.equal(s.copy,root+'/sources/'+s.path);
 assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
}
function frozen(p){const s=bindings.get(p);assert(s,`Missing frozen binding: ${p}`);return read(s.copy);}
const catalog=frozen('src/workbench/batchCatalogV10.json');
const old=frozen('docs/planning/workbench-batch-parity-rev8/receipt.json');
const general=frozen('docs/planning/workbench-batch-general-rev1/receipt.json');
const publicSources=frozen('docs/planning/workbench-public-source-batch-rev1/receipt.json');
assert.equal(old.status,'PASS SHARED V8 BATCH EXECUTION');
assert.equal(general.status,'PASS GENERAL V9 BATCH COHORT');
assert.equal(publicSources.status,'PASS PREPARED PUBLIC SOURCE BATCH TRANSPORT');
const previous=[...old.report.snapshot.results,...general.report.snapshot.results,...publicSources.results];
assert.equal(previous.length,1068);
assert.deepEqual(previous.map(r=>r.job),catalog.jobs);
assert.equal(new Set(catalog.jobs.map(j=>j.id)).size,1068);
const keys=['prefix','total','complete','clock','modelHash','runHash','stateHash','saveHash'];
function verifyResults(results){
 assert.equal(results.length,1068);
 let prefixes=0;
 for(const [index,result]of results.entries()){
  const job=catalog.jobs[index],prior=previous[index];
  assert.deepEqual(result.job,job,`Declaration ${index}`);
  assert.equal(result.status,'complete',job.id);assert.equal(result.error,undefined,job.id);
  assert.equal(result.prefixes.length,job.expectedSaveHashes.length,job.id);
  assert.equal(result.prefixes.length,prior.prefixes.length,job.id);
  for(const [i,p]of result.prefixes.entries()){
   const label=`${job.id}/${i}`;
   assert.equal(p.prefix,i,label);assert.equal(p.total,result.prefixes.length-1,label);
   assert.equal(p.complete,i===result.prefixes.length-1,label);
   assert.equal(p.saveHash,job.expectedSaveHashes[i],label);
   assert.equal(p.expectedSaveHash,p.saveHash,label);assert.equal(p.matchesFrozenSave,true,label);
   for(const key of keys)assert.equal(p[key],prior.prefixes[i][key],`${label}/${key}`);
   for(const key of ['modelHash','runHash'])assert.equal(p[key],result.prefixes[0][key],`${label}/${key}`);
   prefixes++;
  }
 }
 assert.equal(prefixes,7284);return prefixes;
}

if(process.argv.includes('--preflight')){
 // Prior receipts exercise the verifier only. They are not fresh V10 execution.
 const fixture=previous.map(r=>({job:r.job,status:'complete',prefixes:r.prefixes.map(p=>({...p,expectedSaveHash:p.saveHash,matchesFrozenSave:true}))}));
 verifyResults(fixture);
 const mutations=[
  ['missing role',r=>r.pop()],
  ['reordered role',r=>[r[0],r[1]]=[r[1],r[0]]],
  ['changed seed',r=>r[947].job.seedHex='00'.repeat(32)],
  ['partial completion',r=>r[0].status='running'],
  ['missing prefix',r=>r[0].prefixes.pop()],
  ['wrong state with matching save flag',r=>r[0].prefixes[0].stateHash='00'.repeat(32)],
  ['wrong clock',r=>r[0].prefixes[0].clock='999'],
  ['wrong expected save',r=>r[0].prefixes[0].expectedSaveHash='00'.repeat(32)],
  ['wrong completion boundary',r=>r[0].prefixes[0].complete=true],
  ['identity drift',r=>r[0].prefixes[1].runHash='00'.repeat(32)],
  ['false match flag',r=>r[0].prefixes[0].matchesFrozenSave=false],
 ];
 for(const [label,change]of mutations){const candidate=structuredClone(fixture);change(candidate);assert.throws(()=>verifyResults(candidate),undefined,label);}
 const evidence='docs/planning/workbench-batch-v10-independent-rev1';
 fs.mkdirSync(evidence,{recursive:true});
 const verifier=fs.readFileSync('scripts/verify-workbench-batch-v10.mjs');
 fs.writeFileSync(evidence+'/verifier.mjs',verifier,{flag:'wx'});
 fs.writeFileSync(evidence+'/preflight.json',JSON.stringify({status:'PASS VERIFIER PREFLIGHT ONLY',sourcesVerified:manifest.sources.length,
  priorRoles:1068,priorPrefixes:7284,rejectedMutations:mutations.map(([label])=>label),verifierSha256:sha(verifier),
  nativeManifestSha256:sha(fs.readFileSync(root+'/manifest.json')),
  scope:'Prior accepted receipts validate the independent comparison and eleven corruption rejections. No fresh V10 completion or browser acceptance is established.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS verifier preflight:1068 prior roles/7284 prefixes;11 corruptions rejected. Fresh V10 acceptance remains pending.');
}else{
 const receipt=read(root+'/receipt.json'),report=receipt.report;
 assert.equal(receipt.status,'PASS FULL V10 NATIVE BATCH');assert.deepEqual(receipt.sources,manifest.sources);
 assert.equal(receipt.roles,1068);assert.equal(receipt.prefixes,7284);
 assert.equal(report.version,'workbench-batch-export/0.10');assert.equal(report.registryVersion,'workbench-experiments/0.25');
 assert.equal(report.catalogVersion,catalog.version);assert.deepEqual(report.catalogSources,catalog.sources);
 assert.deepEqual(report.resourceLimits,{jobs:1068,prefixesPerJob:33,simultaneousRuns:1});
 assert.equal(report.snapshot.version,'workbench-batch/0.10');assert.equal(report.snapshot.status,'complete');assert.equal(report.snapshot.current,1068);
 const prefixes=verifyResults(report.snapshot.results);
 for(const [key,value]of Object.entries(old.report.originals))assert.deepEqual(report.originals[key],value,key);
 assert.deepEqual(report.originals.general,general.report.originals.general);
 assert.deepEqual(report.originals.body,catalog.body);assert.deepEqual(report.originals.multisource,catalog.multisource);
 assert.deepEqual(Object.keys(report.originals).sort(),[...Object.keys(old.report.originals),'general','body','multisource'].sort());
 assert.deepEqual(report.experiments.map(e=>e.id).sort(),[...new Set(catalog.jobs.map(j=>j.experimentId))].sort());
 fs.writeFileSync(root+'/acceptance.json',JSON.stringify({status:'PASS INDEPENDENT FULL V10 NATIVE RECONCILIATION',roles:1068,prefixes,
  sourcesVerified:manifest.sources.length,currentSourceHold:false,
  receipt:{path:root+'/receipt.json',sha256:sha(fs.readFileSync(root+'/receipt.json'))},
  verifier:{path:'scripts/verify-workbench-batch-v10.mjs',sha256:sha(fs.readFileSync('scripts/verify-workbench-batch-v10.mjs'))},
  scope:'Every fresh result joined to prior accepted role/prefix identities, clocks, state and save commitments; original exports preserved. Terminal no-op execution is evidenced by the frozen writer, not independently replayed here. Browser completion, remaining components/successors, language and Campaign4 entry remain separate.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS independent1068-role/7284-prefix V10 reconciliation');
}
