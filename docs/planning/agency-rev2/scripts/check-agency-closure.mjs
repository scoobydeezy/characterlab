import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'AGENCY_PUBLIC_PLAN_REV2.json',resultPath=p+'AGENCY_PUBLIC_RESULT_REV2.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'AGENCY_TESTS_REV2.json'),reference=read(p+'AGENCY_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,5);assert.equal(result.runs,19);assert.equal(result.restores,71);assert.equal(result.advancing,52);assert.equal(result.terminal,19);
assert.equal(plan.runs.length,19);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,5);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,19);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,36);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
assert.equal(read(p+'AGENCY_BUILD_REV2.json').status,'PASS');
assert.equal(read(p+'AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json').numFailedTests,1);
const preserved=read(p+'agency-rev1/PRESERVATION.json');
for(const a of preserved.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const oldPlan=read(p+'AGENCY_PUBLIC_PLAN_REV1.json');
for(const a of oldPlan.artifacts) {
  const copy=preserved.artifacts.find(x=>x.original===a.path);assert(copy,a.path);assert.equal(copy.sha256,a.sha256,a.path);
}
const allocations=read('docs/formal/AGENCY_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:18},(_,i)=>971+i));assert.equal(allocations.namespace,1163);
for(const revision of [1,2]) {
  const freeze=read(p+`campaign3-agency-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.models.length,5);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const files=[planPath,resultPath,p+'AGENCY_TESTS_REV2.json',p+'AGENCY_REFERENCE_TESTS_REV1.json',p+'AGENCY_BUILD_REV2.json',p+'AGENCY_UNRECEIVED_REPORT_FAILURE_REV1.json',p+'agency-rev1/PRESERVATION.json',p+'CAMPAIGN3_AGENCY_QUALIFICATION.md',p+'AGENCY_IMPLEMENTATION_FINDINGS.md','scripts/check-agency-closure.mjs'];
const closure={status:'PASS',contract:'agency-public/0.2-candidate',models:5,runs:19,prefixes:71,advancing:52,terminal:19,tests:36,referenceTests:328,preservedFailure:'unreceived report shifted a later nonrecipient occurrence ID in revision1',artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'AGENCY_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Agency closure evidence drift');
console.log('PASS agency:5 models/19 public runs/71 prefixes;36+328 tests; failed first cohort preserved.');
