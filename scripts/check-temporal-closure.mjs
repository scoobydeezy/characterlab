import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=x=>JSON.parse(fs.readFileSync(x)),hash=x=>createHash('sha256').update(x).digest('hex'),sha=x=>hash(fs.readFileSync(x));
const plan=read(p+'TEMPORAL_PLAN_REV1.json'),result=read(p+'TEMPORAL_RESULT_REV1.json'),views=read(p+'TEMPORAL_VIEWS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.models,4);assert.equal(result.runs,27);assert.equal(result.prefixes,243);assert.equal(result.advancing,216);assert.equal(result.terminal,27);
assert.equal(plan.models.length,4);assert.equal(plan.runs.length,27);assert.equal(result.results.length,27);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,27);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,4);assert(plan.experimentIdentity&&plan.comparisonCase);
assert.equal(result.planSha256,sha(p+'TEMPORAL_PLAN_REV1.json'));assert.equal(views.planSha256,result.planSha256);assert.equal(views.views.length,27);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const [i,row] of result.results.entries()){
 const original=plan.runs[i],v=views.views.find(x=>x.law===row.law&&x.name===row.name);
 assert.equal(row.runIdentity,original.runIdentity);assert.equal(row.modelIdentity,original.modelIdentity);assert.equal(row.law,original.law);assert.equal(row.name,original.name);assert.equal(row.prefixHashes.length,9);assert.equal(row.prefixHashes.at(-1),row.saveSha256);
 assert.equal(hash(JSON.stringify(v.snapshot)),row.snapshotSha256);assert.equal(hash(JSON.stringify(v.safe)),row.safeSha256);assert.deepEqual(v.safe,{goals:v.snapshot.goals,safe:v.snapshot.safe,forecast:v.snapshot.forecast,rows:v.snapshot.rows});assert.equal(v.snapshot.rows.length,8);
}
const safe=name=>views.views.find(x=>x.law==='HorizonRelative'&&x.name===name).safe;
for(const [a,b] of [['missingReceipt','hiddenBlocked'],['falseReceipt','trueReceipt'],['deniedAdoption','hiddenAdoption']])assert.deepEqual(safe(a),safe(b));
for(const file of ['TEMPORAL_PRESERVATION_REV1.json','TEMPORAL_BUILD_REV1.json'])for(const a of read(p+file).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(read(p+'TEMPORAL_BUILD_REV1.json').status,'PASS');
for(const [file,count] of [['TEMPORAL_TESTS_REV1.json',16],['TEMPORAL_REFERENCE_TESTS_REV1.json',328]]){const r=read(p+file);assert.equal(r.success,true);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
const files=['TEMPORAL_PLAN_REV1.json','TEMPORAL_RESULT_REV1.json','TEMPORAL_VIEWS_REV1.json','TEMPORAL_TESTS_REV1.json','TEMPORAL_REFERENCE_TESTS_REV1.json','TEMPORAL_BUILD_REV1.json','TEMPORAL_PRESERVATION_REV1.json','CAMPAIGN3_TEMPORAL_QUALIFICATION.md'];
const closure={status:'PASS',scope:'temporal-goal-conflict-component/0.1-candidate; no new public scheduler/save API',models:4,runs:27,componentPrefixes:243,advancing:216,terminal:27,tests:16,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-temporal-closure.mjs',sha256:sha('scripts/check-temporal-closure.mjs')}]};
const file=p+'TEMPORAL_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(read(file),closure);console.log('PASS temporal:4 models/27 runs/243 component prefixes;16+328 tests;1400/0.');
