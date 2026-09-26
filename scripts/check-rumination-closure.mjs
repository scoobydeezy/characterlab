import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'RUMINATION_PUBLIC_PLAN_REV1.json',resultPath=p+'RUMINATION_PUBLIC_RESULT_REV1.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'RUMINATION_TESTS_REV1.json'),reference=read(p+'RUMINATION_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,4);assert.equal(result.runs,23);assert.equal(result.restores,207);assert.equal(result.advancing,184);assert.equal(result.terminal,23);
assert.equal(plan.runs.length,23);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,4);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,22);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,25);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
const build=read(p+'RUMINATION_BUILD_REV1.json');assert.equal(build.status,'PASS');for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.success,true);assert.equal(reference.success,true);
assert.equal(result.restores,result.results.reduce((n,r)=>n+r.prefixes,0));assert.equal(result.restores-result.advancing,result.terminal);
const allocations=read('docs/formal/RUMINATION_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:21},(_,i)=>1311+i));assert.equal(allocations.namespace,null);
for(const revision of [1]) {
  const freeze=read(p+`campaign3-rumination-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.contractSha256,sha('docs/formal/RUMINATION_PUBLIC_CONTRACT.md'));assert.equal(freeze.allocationSha256,sha('docs/formal/RUMINATION_PUBLIC_ALLOCATION_TABLE.json'));assert.deepEqual(new Set(freeze.models.map(m=>m.modelIdentity)),new Set(plan.runs.map(r=>r.modelIdentity)));assert.equal(freeze.models.length,4);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const preservation=p+'RUMINATION_PRESERVATION_REV1.json';for(const a of read(preservation).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const viewPath=p+'RUMINATION_PUBLIC_VIEWS_REV1.json',views=read(viewPath);assert.equal(views.planSha256,sha(planPath));assert.equal(views.views.length,23);const seen=new Set();
const hashHex=h=>createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');
for(const [key,v] of views.views){assert(!seen.has(key));seen.add(key);const row=result.results.find(r=>r.candidate+'/'+r.law+'/'+r.name===key);assert(row);assert.equal(hashHex(v.outputs),row.outputSha256);assert.deepEqual(v.observerViews.map(hashHex),row.observerSha256);}
const duplicate=p+'RUMINATION_DUPLICATE_CASE_FINDING_REV1.json';const finding=read(duplicate);assert.equal(finding.planSha256,sha(planPath));assert.equal(finding.distinctRuns,22);assert.deepEqual(plan.runs.filter(r=>r.runIdentity===finding.duplicates[0].runIdentity).map(r=>r.name),['unbroken','noInterruption']);const uniqueRows=[...new Map(result.results.map(r=>[r.runIdentity,r])).values()];assert.equal(uniqueRows.reduce((n,r)=>n+r.prefixes,0),198);
const files=[duplicate,preservation,viewPath,p+'RUMINATION_IMPLEMENTATION_FINDINGS.md',planPath,resultPath,p+'RUMINATION_TESTS_REV1.json',p+'RUMINATION_REFERENCE_TESTS_REV1.json',p+'RUMINATION_BUILD_REV1.json',p+'CAMPAIGN3_RUMINATION_QUALIFICATION.md','scripts/check-rumination-closure.mjs'];
const closure={status:'PASS',contract:'rumination-public/0.1-candidate',models:4,distinctRuns:22,distinctPrefixes:198,executions:23,replayChecks:207,advancingChecks:184,terminalChecks:23,duplicateReplayChecks:9,tests:25,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'RUMINATION_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Rumination closure evidence drift');
console.log('PASS rumination:4 models/22 distinct runs/198 distinct prefixes;23 executions/207 replay checks;25+328 tests; counters1331/0.');
