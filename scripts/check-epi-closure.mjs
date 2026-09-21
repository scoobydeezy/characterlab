import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const freeze=read(p+'campaign3-epi-model-rev1/FREEZE.json'),plan=read(p+'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json'),result=read(p+'EPI_PUBLIC_EXPERIMENT_REV1.json');
assert.equal(freeze.models.length,6);assert.equal(new Set(freeze.models.map(m=>m.modelIdentity)).size,6);
for(const m of freeze.models)for(const f of m.files)assert.equal(hash(f.path),f.sha256);
assert.equal(hash('docs/formal/EPI_PUBLIC_CONTRACT.md'),freeze.contractSha256);assert.equal(hash('docs/formal/EPI_PUBLIC_ALLOCATION_TABLE.json'),freeze.allocationSha256);
for(const a of plan.artifacts)assert.equal(hash(a.path),a.sha256);
assert.equal(result.planSha256,hash(p+'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json'));assert.equal(result.status,'PASS');assert.equal(result.runs,72);assert.equal(result.restores,240);assert.equal(result.advancing,168);assert.equal(result.terminal,72);assert.equal(plan.runs.length,result.results.length);
for(const row of result.results)assert(plan.runs.some(r=>r.name===row.name&&r.law===row.law&&r.numeric===row.numeric&&r.runIdentity===row.runIdentity));
for(const law of [1,2,3])for(const numeric of [1,2]){
 const get=name=>result.results.find(r=>r.law===law&&r.numeric===numeric&&r.name===name);
 for(const name of ['established','informative','fresh','missing']){const a=get(name+'A'),b=get(name+'B');if(law===1||name==='missing'){assert.equal(a.characterOutputsSha256,b.characterOutputsSha256);assert.equal(a.stateSha256,b.stateSha256);}else assert.notEqual(a.characterOutputsSha256,b.characterOutputsSha256);assert.notEqual(a.researchOutputsSha256,b.researchOutputsSha256);assert.notEqual(a.traceSha256,b.traceSha256);}
 if(law===1)assert.notEqual(get('permittedA').stateSha256,get('permittedB').stateSha256);
}
const tests=['EPI_PRESERVATION_TESTS_REV1.json','EPI_REFERENCE_TESTS_REV1.json'].map(name=>{const t=read(p+name);assert(t.success&&t.numFailedTests===0);return {path:p+name,passed:t.numPassedTests,sha256:hash(p+name)};});
const paths=['src/campaign3/epiCodecs.ts','src/campaign3/epiModel.ts','src/campaign3/epiRuntime.ts','src/campaign3/epiFactory.ts','src/campaign3/epiMath.ts','src/campaign3/encodingAccessMath.ts','src/test/epiFixtures.ts','src/test/epiPublic.test.ts','scripts/qualify-epi-public.mjs','scripts/freeze-epi-models.mjs','docs/formal/EPI_PUBLIC_CONTRACT.md','docs/formal/EPI_PUBLIC_ALLOCATION_TABLE.json',p+'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json',p+'EPI_PUBLIC_EXPERIMENT_REV1.json',p+'EPI_BUILD_VALIDATION_REV1.json'];
const receipt={status:'PASS',scope:'Bounded exact EPI pair and declared consumer roster; no whole cognition or numerical-law necessity claim.',models:6,imageFiles:24,runs:72,restores:240,advancing:168,terminal:72,tests,files:paths.map(path=>({path,sha256:hash(path)}))},out=p+'EPI_VALIDATION_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),receipt,'EPI closure drift');
console.log('PASS: EPI closure integrity:6 models/72 runs/240 prefixes; '+tests.map(t=>t.passed).join('+')+' tests.');
