import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'PROCRASTINATION_PUBLIC_PLAN_REV2.json',resultPath=p+'PROCRASTINATION_PUBLIC_RESULT_REV2.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'PROCRASTINATION_TESTS_REV2.json'),reference=read(p+'PROCRASTINATION_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,4);assert.equal(result.runs,20);assert.equal(result.restores,180);assert.equal(result.advancing,160);assert.equal(result.terminal,20);
assert.equal(plan.runs.length,20);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,4);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,20);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.numPassedTests,26);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
const build=read(p+'PROCRASTINATION_BUILD_REV2.json');assert.equal(build.status,'PASS');for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.success,true);assert.equal(reference.success,true);
assert.equal(result.restores,result.results.reduce((n,r)=>n+r.prefixes,0));assert.equal(result.restores-result.advancing,result.terminal);
const allocations=read('docs/formal/PROCRASTINATION_PUBLIC_ALLOCATION_TABLE.json');
assert.deepEqual(allocations.records.map(r=>r.typeId),Array.from({length:24},(_,i)=>1353+i));assert.equal(allocations.namespace,null);
for(const revision of [2]) {
  const freeze=read(p+`campaign3-procrastination-model-rev${revision}/FREEZE.json`);
  assert.equal(freeze.contractSha256,sha('docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md'));assert.equal(freeze.allocationSha256,sha('docs/formal/PROCRASTINATION_PUBLIC_ALLOCATION_TABLE.json'));assert.deepEqual(new Set(freeze.models.map(m=>m.modelIdentity)),new Set(plan.runs.map(r=>r.modelIdentity)));assert.equal(freeze.models.length,4);for(const model of freeze.models)for(const a of model.files)assert.equal(sha(a.path),a.sha256,a.path);
}
const root=p+'campaign3-procrastination-model-rev1/',prior=read(root+'FREEZE.json');for(const m of prior.models)for(const a of m.files)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(prior.contractSha256,sha(root+'preserved/docs/formal/PROCRASTINATION_PUBLIC_CONTRACT.md'));assert.equal(prior.allocationSha256,sha(root+'preserved/docs/formal/PROCRASTINATION_PUBLIC_ALLOCATION_TABLE.json'));for(const a of read(root+'PRESERVATION.json').artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const firstPlan=read(p+'PROCRASTINATION_PUBLIC_PLAN_REV1.json');for(const a of firstPlan.artifacts){const file=a.path.includes('campaign3-procrastination-model-rev1/FREEZE.json')?a.path:root+'preserved/'+a.path;assert.equal(sha(file),a.sha256,file);}
assert.equal(read(p+'PROCRASTINATION_ADOPTION_FAILURE_REV1.json').numFailedTests,1);assert.equal(read(p+'PROCRASTINATION_TESTS_REV1.json').numPassedTests,25);
const preservation=p+'PROCRASTINATION_PRESERVATION_REV1.json';for(const a of read(preservation).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const viewPath=p+'PROCRASTINATION_PUBLIC_VIEWS_REV2.json',views=read(viewPath);assert.equal(views.planSha256,sha(planPath));assert.equal(views.views.length,20);const seen=new Set();
const hashHex=h=>createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');
for(const [key,v] of views.views){assert(!seen.has(key));seen.add(key);const row=result.results.find(r=>r.candidate+'/'+r.law+'/'+r.name===key);assert(row);assert.equal(hashHex(v.outputs),row.outputSha256);assert.deepEqual(v.observerViews.map(hashHex),row.observerSha256);}
const files=[preservation,viewPath,p+'PROCRASTINATION_IMPLEMENTATION_FINDINGS.md',planPath,resultPath,p+'PROCRASTINATION_TESTS_REV2.json',p+'PROCRASTINATION_REFERENCE_TESTS_REV1.json',p+'PROCRASTINATION_BUILD_REV2.json',p+'CAMPAIGN3_PROCRASTINATION_QUALIFICATION.md','scripts/check-procrastination-closure.mjs'];
const closure={status:'PASS',contract:'procrastination-public/0.2-candidate',models:4,runs:20,prefixes:180,advancing:160,terminal:20,tests:26,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'PROCRASTINATION_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Procrastination closure evidence drift');
console.log('PASS procrastination:4 models/20 public runs/180 prefixes;26+328 tests; counters1376/0.');
