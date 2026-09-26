import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'PERFORMANCE_PUBLIC_PLAN_REV1.json',resultPath=p+'PERFORMANCE_PUBLIC_RESULT_REV1.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'PERFORMANCE_TESTS_REV1.json'),reference=read(p+'PERFORMANCE_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,4);assert.equal(result.runs,22);assert.equal(result.restores,198);assert.equal(result.advancing,176);assert.equal(result.terminal,22);
assert.equal(plan.runs.length,22);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,4);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,22);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,19);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
const build=read(p+'PERFORMANCE_BUILD_REV1.json');assert.equal(build.status,'PASS');for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.success,true);assert.equal(reference.success,true);
assert.equal(result.restores,result.results.reduce((n,r)=>n+r.prefixes,0));assert.equal(result.restores-result.advancing,result.terminal);
const allocations=read('docs/formal/PERFORMANCE_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:19},(_,i)=>1292+i));assert.equal(allocations.namespace,1183);
for(const revision of [1]) {
  const freeze=read(p+`campaign3-performance-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.contractSha256,sha('docs/formal/PERFORMANCE_PUBLIC_CONTRACT.md'));assert.equal(freeze.allocationSha256,sha('docs/formal/PERFORMANCE_PUBLIC_ALLOCATION_TABLE.json'));assert.deepEqual(new Set(freeze.models.map(m=>m.modelIdentity)),new Set(plan.runs.map(r=>r.modelIdentity)));assert.equal(freeze.models.length,4);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const preservation=p+'PERFORMANCE_PRESERVATION_REV1.json';for(const a of read(preservation).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const viewPath=p+'PERFORMANCE_PUBLIC_VIEWS_REV1.json',views=read(viewPath);assert.equal(views.planSha256,sha(planPath));assert.equal(views.views.length,22);const seen=new Set();
const hashHex=h=>createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');
for(const [key,v] of views.views){assert(!seen.has(key));seen.add(key);const row=result.results.find(r=>r.law+'/'+r.name===key);assert(row);assert.equal(hashHex(v.outputs),row.outputSha256);assert.deepEqual(v.observerViews.map(hashHex),row.observerSha256);}
const files=[preservation,viewPath,p+'PERFORMANCE_IMPLEMENTATION_FINDINGS.md',planPath,resultPath,p+'PERFORMANCE_TESTS_REV1.json',p+'PERFORMANCE_REFERENCE_TESTS_REV1.json',p+'PERFORMANCE_BUILD_REV1.json',p+'CAMPAIGN3_PERFORMANCE_QUALIFICATION.md','scripts/check-performance-closure.mjs'];
const closure={status:'PASS',contract:'performance-public/0.1-candidate',models:4,runs:22,prefixes:198,advancing:176,terminal:22,tests:19,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'PERFORMANCE_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Performance closure evidence drift');
console.log('PASS performance:4 models/22 public runs/198 prefixes;19+328 tests; counters1310/0.');
