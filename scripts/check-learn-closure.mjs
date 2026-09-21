import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const p='docs/planning/';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const hash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const freeze=read(p+'campaign3-learn-model-rev1/FREEZE.json'),plan=read(p+'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json'),result=read(p+'LEARN_PUBLIC_EXPERIMENT_REV1.json');
assert.equal(freeze.models.length,6);assert.equal(new Set(freeze.models.map(m=>m.modelIdentity)).size,6);
for(const m of freeze.models)for(const f of m.files)assert.equal(hash(f.path),f.sha256,f.path);
assert.equal(hash('docs/formal/LEARN_PUBLIC_CONTRACT.md'),freeze.contractSha256);
assert.equal(hash('docs/formal/LEARN_PUBLIC_ALLOCATION_TABLE.json'),freeze.allocationSha256);
assert.equal(result.planSha256,hash(p+'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json'));
assert.equal(result.status,'PASS');assert.equal(result.runs,39);assert.equal(result.restores,580);assert.equal(result.advancing,541);assert.equal(result.terminal,39);
assert.equal(plan.runs.length,result.results.length);
for(const row of result.results)assert(plan.runs.some(r=>r.name===row.name&&r.law===row.law&&r.numeric===row.numeric&&r.runIdentity===row.runIdentity));
// Independent receipt-level expectations for both numeric profiles, including
// the lattice cases not asserted by the exact-rational public evaluator.
const last=(law,numeric,name)=>result.results.find(r=>r.law===law&&r.numeric===numeric&&r.name===name).trajectory.at(-1);
for(const numeric of [1,2]){
 assert.deepEqual(last(1,numeric,'compatible'),{mean:'2/5',precision:'50/1',applied:false});
 assert.deepEqual(last(1,numeric,'zero'),{unknown:true,applied:false});
 assert.deepEqual(last(1,numeric,'repeated'),{mean:'13/50',precision:'4/1',applied:true});
 assert.equal(last(1,numeric,'inconsistent').mean,numeric===1?'27/520':'51923/1000000');
 assert.equal(last(1,numeric,'inconsistent').precision,'52/1');
 assert.equal(last(2,numeric,'repeated').mean,numeric===1?'51/350':'72857/500000');
 assert.equal(last(2,numeric,'repeated').precision,'14/1');
 assert.equal(last(2,numeric,'compatible').precision,'52/1');
 assert.equal(last(2,numeric,'zero').precision,'2/1');
 assert.equal(last(3,numeric,'inconsistent').mean,'1/20');
 const repeated=result.results.find(r=>r.law===1&&r.numeric===numeric&&r.name==='repeated').trajectory;
 assert.equal(repeated[0].precision,'2/1');
 for(const entry of repeated.slice(1,6))assert.deepEqual(entry,{mean:'1/10',precision:'2/1',applied:false});
}
const tests=['LEARN_PRESERVATION_TESTS_REV2.json','LEARN_REFERENCE_TESTS_REV1.json'].map(n=>{const r=read(p+n);assert(r.success&&r.numFailedTests===0);return {path:p+n,passed:r.numPassedTests,sha256:hash(p+n)};});
const paths=['src/campaign3/learnCodecs.ts','src/campaign3/learnModel.ts','src/campaign3/learnRuntime.ts','src/campaign3/learnFactory.ts','src/campaign3/learnMath.ts','src/test/learnFixtures.ts','src/test/learnPublic.test.ts','scripts/qualify-learn-public.mjs','scripts/freeze-learn-models.mjs','docs/formal/LEARN_PUBLIC_CONTRACT.md','docs/formal/LEARN_PUBLIC_ALLOCATION_TABLE.json',p+'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json',p+'LEARN_PUBLIC_EXPERIMENT_REV1.json'];
const receipt={status:'PASS',scope:'Bounded LEARN model/plan/result/test/source closure; not full active-suite or general inference qualification.',models:6,imageFiles:freeze.models.reduce((n,m)=>n+m.files.length,0),runs:39,restores:580,advancing:541,terminal:39,tests,files:paths.map(path=>({path,sha256:hash(path)}))};
const out=p+'LEARN_VALIDATION_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
else assert.deepEqual(read(out),receipt,'Final LEARN evidence/source drift');
console.log('PASS: LEARN closure integrity:6 models,39 runs,580 prefix continuations; '+tests.map(t=>t.passed).join('+')+' tests');
