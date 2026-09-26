import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'FATIGUE_PUBLIC_PLAN_REV1.json',resultPath=p+'FATIGUE_PUBLIC_RESULT_REV1.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'FATIGUE_TESTS_REV1.json'),reference=read(p+'FATIGUE_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,4);assert.equal(result.runs,20);assert.equal(result.restores,180);assert.equal(result.advancing,160);assert.equal(result.terminal,20);
assert.equal(plan.runs.length,20);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,4);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,20);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,25);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
const build=read(p+'FATIGUE_BUILD_REV1.json');assert.equal(build.status,'PASS');for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.success,true);assert.equal(reference.success,true);
assert.equal(result.restores,result.results.reduce((n,r)=>n+r.prefixes,0));assert.equal(result.restores-result.advancing,result.terminal);
const allocations=read('docs/formal/FATIGUE_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:21},(_,i)=>1332+i));assert.equal(allocations.namespace,null);
for(const revision of [1]) {
  const freeze=read(p+`campaign3-fatigue-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.contractSha256,sha('docs/formal/FATIGUE_PUBLIC_CONTRACT.md'));assert.equal(freeze.allocationSha256,sha('docs/formal/FATIGUE_PUBLIC_ALLOCATION_TABLE.json'));assert.deepEqual(new Set(freeze.models.map(m=>m.modelIdentity)),new Set(plan.runs.map(r=>r.modelIdentity)));assert.equal(freeze.models.length,4);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const preservation=p+'FATIGUE_PRESERVATION_REV1.json';for(const a of read(preservation).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const viewPath=p+'FATIGUE_PUBLIC_VIEWS_REV1.json',views=read(viewPath);assert.equal(views.planSha256,sha(planPath));assert.equal(views.views.length,20);const seen=new Set();
const hashHex=h=>createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');
for(const [key,v] of views.views){assert(!seen.has(key));seen.add(key);const row=result.results.find(r=>r.candidate+'/'+r.law+'/'+r.name===key);assert(row);assert.equal(hashHex(v.outputs),row.outputSha256);assert.deepEqual(v.observerViews.map(hashHex),row.observerSha256);}
const files=[preservation,viewPath,p+'FATIGUE_IMPLEMENTATION_FINDINGS.md',planPath,resultPath,p+'FATIGUE_TESTS_REV1.json',p+'FATIGUE_REFERENCE_TESTS_REV1.json',p+'FATIGUE_BUILD_REV1.json',p+'CAMPAIGN3_FATIGUE_QUALIFICATION.md','scripts/check-fatigue-closure.mjs'];
const closure={status:'PASS',contract:'fatigue-public/0.1-candidate',models:4,runs:20,prefixes:180,advancing:160,terminal:20,tests:25,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'FATIGUE_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Fatigue closure evidence drift');
console.log('PASS fatigue:4 models/20 public runs/180 prefixes;25+328 tests; counters1352/0.');
