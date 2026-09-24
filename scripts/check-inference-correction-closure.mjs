import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'INFERENCE_CORRECTION_PUBLIC_PLAN_REV1.json',resultPath=p+'INFERENCE_CORRECTION_PUBLIC_RESULT_REV1.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'INFERENCE_CORRECTION_TESTS_REV1.json'),reference=read(p+'INFERENCE_CORRECTION_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,5);assert.equal(result.runs,15);assert.equal(result.restores,120);assert.equal(result.advancing,105);assert.equal(result.terminal,15);
assert.equal(plan.runs.length,15);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,5);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,15);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,7);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
assert.equal(read(p+'INFERENCE_CORRECTION_BUILD_REV1.json').status,'PASS');
const freeze=read(p+'campaign3-agency-model-rev3/FREEZE.json');
assert.equal(freeze.models.length,5);for(const m of freeze.models)for(const a of m.files)assert.equal(sha(a.path),a.sha256,a.path);
assert.deepEqual(new Set(plan.runs.map(r=>r.modelIdentity)),new Set(freeze.models.map(m=>m.modelIdentity)));
const files=[planPath,resultPath,p+'INFERENCE_CORRECTION_TESTS_REV1.json',p+'INFERENCE_CORRECTION_REFERENCE_TESTS_REV1.json',p+'INFERENCE_CORRECTION_BUILD_REV1.json',p+'CAMPAIGN3_INFERENCE_CORRECTION_QUALIFICATION.md','scripts/check-inference-correction-closure.mjs','docs/formal/INFERENCE_CORRECTION_EXPERIMENT.md'];
const closure={status:'PASS',contract:'inference-correction-experiment/0.1-candidate',newModels:0,models:5,runs:15,prefixes:120,advancing:105,terminal:15,tests:7,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'INFERENCE_CORRECTION_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Inference correction closure evidence drift');
console.log('PASS inference correction:5 reused models/15 runs/120 prefixes;7+328 tests; no allocation.');
