import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=x=>JSON.parse(fs.readFileSync(x)),sha=x=>createHash('sha256').update(fs.readFileSync(x)).digest('hex');
const plan=read(p+'INTENTION_PLAN_REV2.json'),result=read(p+'INTENTION_RESULT_REV2.json'),prior=read(p+'INTENTION_RESULT_REV1.json'),views=read(p+'INTENTION_VIEWS_REV2.json');
assert.equal(result.status,'PASS');assert.equal(result.models,3);assert.equal(result.runs,54);assert.equal(result.prefixes,486);assert.equal(plan.models.length,3);assert.equal(plan.runs.length,54);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,54);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,3);assert(plan.experimentIdentity&&plan.comparisonCase);
assert.equal(result.planSha256,sha(p+'INTENTION_PLAN_REV2.json'));assert.equal(views.planSha256,result.planSha256);assert.equal(views.views.length,54);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const [i,row] of result.results.entries()){
 const original=plan.runs[i],old=prior.results.find(x=>x.law===row.law&&x.name===row.name),v=views.views.find(x=>x.law===row.law&&x.name===row.name);
 assert.equal(row.runIdentity,original.runIdentity);assert.equal(row.modelIdentity,original.modelIdentity);assert.notEqual(row.modelIdentity,old.modelIdentity);assert.equal(row.prefixHashes.length,9);assert.deepEqual(row.prefixHashes,old.prefixHashes);assert.equal(row.finalSha256,old.finalSha256);assert.equal(row.safeSha256,old.safeSha256);assert.deepEqual(v.safe,{rows:v.full.rows,state:v.full.state});assert.equal(v.full.rows.length,8);
}
for(const file of ['INTENTION_PRESERVATION_REV1.json','INTENTION_BUILD_REV2.json'])for(const a of read(p+file).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(read(p+'INTENTION_BUILD_REV2.json').status,'PASS');
for(const [file,count] of [['INTENTION_TESTS_REV3.json',15],['INTENTION_REFERENCE_TESTS_REV1.json',328]]){const r=read(p+file);assert.equal(r.success,true);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
assert.equal(read(p+'INTENTION_TESTS_REV2.json').numFailedTests,1);
const files=['INTENTION_PLAN_REV2.json','INTENTION_RESULT_REV2.json','INTENTION_VIEWS_REV2.json','INTENTION_TESTS_REV3.json','INTENTION_REFERENCE_TESTS_REV1.json','INTENTION_BUILD_REV2.json','INTENTION_PRESERVATION_REV1.json','CAMPAIGN3_INTENTION_QUALIFICATION.md'];
const closure={status:'PASS',scope:'intention-forgetting-component/0.1-candidate; no new public scheduler/save API',models:3,runs:54,componentPrefixes:486,tests:15,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-intention-closure.mjs',sha256:sha('scripts/check-intention-closure.mjs')}]};
const file=p+'INTENTION_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(read(file),closure);console.log('PASS intention:3 models/54 runs/486 component prefixes;15+328 tests;1400/0.');
