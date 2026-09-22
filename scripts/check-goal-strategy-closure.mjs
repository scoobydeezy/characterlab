import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'GOAL_STRATEGY_PUBLIC_PLAN_REV1.json',resultPath=p+'GOAL_STRATEGY_PUBLIC_RESULT_REV1.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'GOAL_STRATEGY_TESTS_REV1.json'),reference=read(p+'GOAL_STRATEGY_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,4);assert.equal(result.runs,19);assert.equal(result.restores,94);assert.equal(result.advancing,75);assert.equal(result.terminal,19);
assert.equal(plan.runs.length,19);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,4);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,19);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,26);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
assert.equal(read(p+'GOAL_STRATEGY_BUILD_REV1.json').status,'PASS');
const allocations=read('docs/formal/GOAL_STRATEGY_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:19},(_,i)=>989+i));assert.equal(allocations.namespace,1164);
for(const revision of [1]) {
  const freeze=read(p+`campaign3-goal-strategy-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.models.length,4);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const files=[planPath,resultPath,p+'GOAL_STRATEGY_TESTS_REV1.json',p+'GOAL_STRATEGY_REFERENCE_TESTS_REV1.json',p+'GOAL_STRATEGY_BUILD_REV1.json',p+'CAMPAIGN3_GOAL_STRATEGY_QUALIFICATION.md','scripts/check-goal-strategy-closure.mjs'];
const closure={status:'PASS',contract:'goal-strategy-public/0.1-candidate',models:4,runs:19,prefixes:94,advancing:75,terminal:19,tests:26,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'GOAL_STRATEGY_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Goal/strategy closure evidence drift');
console.log('PASS goal/strategy:4 models/19 public runs/94 prefixes;26+328 tests.');
