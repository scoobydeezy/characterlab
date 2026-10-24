import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-general-rev1',read=p=>JSON.parse(fs.readFileSync(p));
const sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),manifest=read(root+'/manifest.json');
assert.equal(receipt.status,'PASS GENERAL V9 BATCH COHORT');assert.deepEqual(receipt.sources,manifest.sources);
for(const s of manifest.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256,s.path);}
const catalog=read('src/workbench/batchCatalogV9.json'),previous=read('src/workbench/batchCatalogV8.json');
assert.deepEqual(catalog.jobs.slice(0,947),previous.jobs);
const frozen=read('docs/planning/campaign3-general-attention-model-rev2/FREEZE.json');
const nativeRoot='docs/planning/workbench-general-cohort-rev1',native=read(nativeRoot+'/receipt.json');
const results=receipt.report.snapshot.results;assert.equal(receipt.report.snapshot.status,'complete');
assert.equal(results.length,43);assert.equal(receipt.report.snapshot.current,43);
assert.deepEqual(results.map(r=>r.job),catalog.jobs.filter(j=>j.experimentId==='general'));
assert.deepEqual(results.map(r=>r.job.name),frozen.models.map(m=>m.name));
let prefixes=0;
for(const result of results){
 assert.equal(result.status,'complete');assert.equal(result.job.seedHex,frozen.seed);
 const model=frozen.models.find(m=>m.name===result.job.name);
 const artifact=native.artifacts.find(a=>a.recipe===model.name),bytes=fs.readFileSync(nativeRoot+'/'+artifact.path);
 assert.equal(sha(bytes),artifact.sha256);const expected=JSON.parse(bytes);
 assert.equal(result.prefixes.length,expected.prefixes.length);
 const program=receipt.report.originals.general.programs.find(p=>p.name===model.name);
 assert.equal(program.runSeed,frozen.seed);assert.equal(program.modelIdentity,model.modelIdentity);assert.equal(program.runIdentity,model.runIdentity);
 for(const field of ['initial','originals']){const source=model.files[field],bytes=fs.readFileSync(source.path);assert.equal(sha(bytes),source.sha256);assert.equal(program[field],bytes.toString('utf8').trim());}
 for(const [i,p]of result.prefixes.entries()){
  for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash'])assert.equal(p[key],expected.prefixes[i][key]);
  assert.equal(p.modelHash,sha(Buffer.from(model.modelIdentity,'hex')));assert.equal(p.runHash,sha(Buffer.from(model.runIdentity,'hex')));
  assert.equal(p.saveHash,result.job.expectedSaveHashes[i]);assert.equal(p.expectedSaveHash,p.saveHash);assert.equal(p.matchesFrozenSave,true);
  assert.equal(p.total,result.prefixes.length-1);assert.equal(p.complete,i===result.prefixes.length-1);prefixes++;
 }
}
assert.equal(prefixes,568);
fs.writeFileSync(root+'/acceptance.json',JSON.stringify({status:'PASS INDEPENDENT GENERAL BATCH RECONCILIATION',roles:43,prefixes,
 sourcesVerified:manifest.sources.length,sourceHoldReleased:true,receipt:{path:root+'/receipt.json',sha256:sha(fs.readFileSync(root+'/receipt.json'))},
 scope:'Exact original frozen identities,32-byte seed,initial/calendar bytes and568 native prefix commitments reconciled. Terminal no-op behavior is checked by the frozen writer. Full990 replay and browser qualification remain open.'},null,2)+'\n',{flag:'wx'});
console.log(`PASS43/568; released ${manifest.sources.length} current-source holds`);
