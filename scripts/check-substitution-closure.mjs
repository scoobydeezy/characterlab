import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=x=>JSON.parse(fs.readFileSync(x)),hash=x=>createHash('sha256').update(x).digest('hex'),sha=x=>hash(fs.readFileSync(x));
const plan=read(p+'SUBSTITUTION_PLAN_REV1.json'),result=read(p+'SUBSTITUTION_RESULT_REV1.json'),views=read(p+'SUBSTITUTION_VIEWS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.models,5);assert.equal(result.runs,29);assert.equal(result.prefixes,261);assert.equal(result.advancing,232);assert.equal(result.terminal,29);
assert.equal(plan.models.length,5);assert.equal(plan.runs.length,29);assert.equal(result.results.length,29);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,29);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,5);assert(plan.experimentIdentity&&plan.comparisonCase);
assert.equal(result.planSha256,sha(p+'SUBSTITUTION_PLAN_REV1.json'));assert.equal(views.planSha256,result.planSha256);assert.equal(views.views.length,29);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const [i,row] of result.results.entries()){
 const original=plan.runs[i],v=views.views.find(x=>x.law===row.law&&x.name===row.name);
 assert.equal(row.runIdentity,original.runIdentity);assert.equal(row.modelIdentity,original.modelIdentity);assert.equal(row.law,original.law);assert.equal(row.name,original.name);assert.equal(row.prefixHashes.length,9);assert.equal(row.prefixHashes.at(-1),row.saveSha256);
 assert.equal(hash(JSON.stringify(v.snapshot)),row.snapshotSha256);assert.equal(hash(JSON.stringify(v.safe)),row.safeSha256);assert.deepEqual(v.safe,{journal:v.snapshot.journal,belief:v.snapshot.belief,rows:v.snapshot.rows});assert.equal(v.snapshot.rows.length,8);
}
const safe=name=>views.views.find(x=>x.law==='LatestHistory'&&x.name===name).safe;
for(const [a,b] of [['diversified','falseTraining'],['deniedFeedback','hiddenBlocked'],['falseSuccess','trueSuccess'],['deniedInfo','absentInfo']])assert.deepEqual(safe(a),safe(b));
for(const file of ['SUBSTITUTION_PRESERVATION_REV1.json','SUBSTITUTION_BUILD_REV1.json'])for(const a of read(p+file).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(read(p+'SUBSTITUTION_BUILD_REV1.json').status,'PASS');
for(const [file,count] of [['SUBSTITUTION_TESTS_REV3.json',15],['SUBSTITUTION_REFERENCE_TESTS_REV1.json',328]]){const r=read(p+file);assert.equal(r.success,true);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
for(const rev of [1,2]){for(const a of read(p+'SUBSTITUTION_DEVELOPMENT_FINDING_REV'+rev+'.json').artifacts)assert.equal(sha(a.path),a.sha256);assert.equal(read(p+'SUBSTITUTION_TESTS_REV'+rev+'.json').numFailedTests,rev===1?15:4);}
const snap=(name,law='LatestHistory')=>views.views.find(v=>v.name===name&&v.law===law).snapshot;
assert.equal(snap('concentrated').unserved,3);assert.equal(snap('diversified').unserved,0);assert.deepEqual(snap('diversified').rows.slice(5).map(r=>r.intent),[1,1,1]);
for(const name of ['correctedConcentrated','correctedDiversified'])assert(snap(name).rows.slice(5).every(r=>r.intent===-1&&r.expression===null));
const files=['SUBSTITUTION_PLAN_REV1.json','SUBSTITUTION_RESULT_REV1.json','SUBSTITUTION_VIEWS_REV1.json','SUBSTITUTION_TESTS_REV3.json','SUBSTITUTION_REFERENCE_TESTS_REV1.json','SUBSTITUTION_BUILD_REV1.json','SUBSTITUTION_PRESERVATION_REV1.json','CAMPAIGN3_SUBSTITUTION_QUALIFICATION.md'];
const closure={status:'PASS',scope:'dependence-substitutes-component/0.2-candidate; no new public scheduler/save API',models:5,runs:29,componentPrefixes:261,advancing:232,terminal:29,tests:15,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-substitution-closure.mjs',sha256:sha('scripts/check-substitution-closure.mjs')}]};
const file=p+'SUBSTITUTION_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(read(file),closure);console.log('PASS substitution:5 models/29 runs/261 component prefixes;15+328 tests;1400/0; failed cohorts preserved.');
