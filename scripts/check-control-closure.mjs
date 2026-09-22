import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'CONTROL_PUBLIC_PLAN_REV2.json',resultPath=p+'CONTROL_PUBLIC_RESULT_REV2.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'CONTROL_TESTS_REV3.json'),reference=read(p+'CONTROL_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,7);assert.equal(result.runs,17);assert.equal(result.restores,142);assert.equal(result.advancing,125);assert.equal(result.terminal,17);
assert.equal(plan.runs.length,17);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,7);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,17);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,22);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
assert.equal(read(p+'CONTROL_BUILD_REV2.json').status,'PASS');
const allocations=read('docs/formal/CONTROL_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:17},(_,i)=>1008+i));assert.equal(allocations.namespace,null);
for(const revision of [1,2]) {
  const freeze=read(p+`campaign3-control-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.models.length,7);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const preserved=read(p+'control-development-rev1/PRESERVATION.json');for(const a of preserved.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(read(p+'CONTROL_DEVELOPMENT_TESTS_REV1.json').numFailedTests,4);
const witness=read(p+'CONTROL_ACTION_WITNESS_REV1.json');assert.equal(witness.status,'PASS');assert.equal(witness.planSha256,sha(planPath));
assert.equal(read(p+'campaign3-control-model-rev1/FREEZE.json').contractSha256,sha(p+'control-development-rev1/CONTROL_PUBLIC_CONTRACT.md'));
assert.equal(read(p+'campaign3-control-model-rev2/FREEZE.json').contractSha256,sha('docs/formal/CONTROL_PUBLIC_CONTRACT.md'));
const files=[planPath,resultPath,p+'CONTROL_TESTS_REV3.json',p+'CONTROL_REFERENCE_TESTS_REV1.json',p+'CONTROL_BUILD_REV2.json',p+'CAMPAIGN3_CONTROL_QUALIFICATION.md',p+'CONTROL_IMPLEMENTATION_FINDINGS.md',p+'CONTROL_DEVELOPMENT_TESTS_REV1.json',p+'control-development-rev1/PRESERVATION.json',p+'CONTROL_ACTION_WITNESS_REV1.json','scripts/check-control-action-witness.mjs','scripts/check-control-closure.mjs'];
const closure={status:'PASS',contract:'control-public/0.2-candidate',models:7,runs:17,prefixes:142,advancing:125,terminal:17,tests:22,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'CONTROL_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Control closure evidence drift');console.log('PASS CONTROL:7 models/17 runs/142 prefixes;22+328 tests; failed schema cohort preserved.');
