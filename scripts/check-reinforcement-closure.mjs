import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=x=>JSON.parse(fs.readFileSync(x)),hash=x=>createHash('sha256').update(x).digest('hex'),sha=x=>hash(fs.readFileSync(x));
const plan=read(p+'REINFORCEMENT_PLAN_REV1.json'),result=read(p+'REINFORCEMENT_RESULT_REV1.json'),views=read(p+'REINFORCEMENT_VIEWS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.models,5);assert.equal(result.runs,31);assert.equal(result.prefixes,279);assert.equal(result.advancing,248);assert.equal(result.terminal,31);
assert.equal(plan.models.length,5);assert.equal(plan.runs.length,31);assert.equal(result.results.length,31);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,31);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,5);assert(plan.experimentIdentity&&plan.comparisonCase);
assert.equal(result.planSha256,sha(p+'REINFORCEMENT_PLAN_REV1.json'));assert.equal(views.planSha256,result.planSha256);assert.equal(views.views.length,31);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const [i,row] of result.results.entries()){
 const original=plan.runs[i],v=views.views.find(x=>x.law===row.law&&x.name===row.name&&x.seed===row.seed);
 assert.equal(row.runIdentity,original.runIdentity);assert.equal(row.modelIdentity,original.modelIdentity);assert.equal(row.law,original.law);assert.equal(row.name,original.name);assert.equal(row.seed,original.seed);assert.equal(row.prefixHashes.length,9);assert.equal(row.prefixHashes.at(-1),row.saveSha256);
 assert.equal(hash(JSON.stringify(v.snapshot)),row.snapshotSha256);assert.equal(hash(JSON.stringify(v.safe)),row.safeSha256);assert.deepEqual(v.safe,{journal:v.snapshot.journal,belief:v.snapshot.belief,rows:v.snapshot.rows});assert.equal(v.snapshot.rows.length,8);
}
const safe=name=>views.views.find(x=>x.law==='MeanHistory'&&x.name===name&&x.seed===2).safe;
for(const [a,b] of [['falseSuccess','trueSuccess'],['withheld','hiddenFailure']])assert.deepEqual(safe(a),safe(b));
for(const file of ['REINFORCEMENT_BUILD_REV1.json'])for(const a of read(p+file).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(read(p+'REINFORCEMENT_BUILD_REV1.json').status,'PASS');
for(const [file,count] of [['REINFORCEMENT_TESTS_REV1.json',8],['REINFORCEMENT_REFERENCE_TESTS_REV1.json',328]]){const r=read(p+file);assert.equal(r.success,true);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
assert.equal(result.newModels,0);assert.deepEqual(plan.models,read(p+'SUBSTITUTION_PLAN_REV1.json').models);assert.deepEqual(result.divergedSeeds,[2,3,4,5,6,7]);
const files=['REINFORCEMENT_PLAN_REV1.json','REINFORCEMENT_RESULT_REV1.json','REINFORCEMENT_VIEWS_REV1.json','REINFORCEMENT_TESTS_REV1.json','REINFORCEMENT_REFERENCE_TESTS_REV1.json','REINFORCEMENT_BUILD_REV1.json','REINFORCEMENT_FINDINGS.md','REINFORCEMENT_EXPLORATION_REV1.json','SUBSTITUTION_CLOSURE_REV1.json','TOLERANCE_READINESS.md','CAMPAIGN3_REINFORCEMENT_QUALIFICATION.md'];
const closure={status:'PASS',scope:'reinforcement-feedback-experiment/0.1-candidate; no new public scheduler/save API',models:5,newModels:0,runs:31,componentPrefixes:279,advancing:248,terminal:31,tests:8,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-reinforcement-closure.mjs',sha256:sha('scripts/check-reinforcement-closure.mjs')}]};
const file=p+'REINFORCEMENT_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(read(file),closure);console.log('PASS reinforcement:5 reused models/31 runs/279 component prefixes;8+328 tests;1400/0.');
