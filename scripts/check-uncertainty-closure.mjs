import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const p='docs/planning/',read=n=>JSON.parse(fs.readFileSync(p+n)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read('UNCERTAINTY_PLAN_REV1.json'),r=read('UNCERTAINTY_RESULT_REV1.json');
for(const f of plan.artifacts)assert.equal(sha(f.path),f.sha256,f.path);
assert.equal(r.status,'PASS');assert.equal(r.planSha256,sha(p+'UNCERTAINTY_PLAN_REV1.json'));assert.equal(plan.models.length,5);assert.equal(plan.runs.length,155);assert.equal(new Set(plan.runs.map(x=>x.runIdentity)).size,155);assert.equal(r.results.length,155);assert.equal(r.prefixes,775);assert.equal(r.advancing,620);assert.equal(r.terminal,155);
for(const [i,row] of r.results.entries()){for(const k of ['law','name','seed','modelIdentity','runIdentity'])assert.deepEqual(row[k],plan.runs[i][k]);assert.equal(row.prefixHashes.length,5);}
const get=(law,name,seed=7)=>r.results.find(x=>x.law===law&&x.name===name&&x.seed===seed),diff=[];
for(let seed=0;seed<8;seed++){
 const a=get('UpperRisk','narrow',seed),b=get('UpperRisk','wide',seed),bad=get('UpperRisk','biased',seed);assert.deepEqual(a.safe.rows[0].choice,b.safe.rows[0].choice);
 for(const [x,radius,strength,probability] of [[a,100,400,'2/5'],[b,300,800,'7/12']]){assert.deepEqual(x.diagnostic,{actual:550,estimate:500,radius,error:50,containsTruth:true});assert.equal(x.safe.rows[1].strength,strength);assert.equal(x.safe.rows[1].choice.probabilities.find(v=>v.name==='restore').probability,probability);}
 assert.equal(bad.diagnostic.error,350);assert.equal(bad.diagnostic.containsTruth,false);
 if(JSON.stringify(a.safe.rows.map(x=>x.choice.chosen))!==JSON.stringify(b.safe.rows.map(x=>x.choice.chosen)))diff.push(seed);
 assert.deepEqual(get('MidpointRisk','narrow',seed).safe.rows.map(x=>x.choice),get('MidpointRisk','wide',seed).safe.rows.map(x=>x.choice));
}
assert.deepEqual(diff,[0,1,2,4,5,6]);assert.deepEqual(r.qualityChoiceDivergentSeeds,diff);
for(const {law} of plan.models){assert.deepEqual(get(law,'narrow').safe,get(law,'hidden').safe);assert.deepEqual(get(law,'absent').safe,get(law,'deniedChanged').safe);assert.deepEqual(get(law,'narrow').safe.belief,get(law,'duplicate').safe.belief);assert.deepEqual(get(law,'biased').safe.rows.slice(0,2),get(law,'corrected').safe.rows.slice(0,2));assert.deepEqual(get(law,'biased').safe.rows[2].choice,get(law,'corrected').safe.rows[2].choice);}
assert.notEqual(get('UpperRisk','biased').safe.rows[3].strength,get('UpperRisk','corrected').safe.rows[3].strength);
for(const [n,count] of [['UNCERTAINTY_TESTS_REV1.json',15],['UNCERTAINTY_REFERENCE_TESTS_REV1.json',328]]){const t=read(n);assert(t.success);assert.equal(t.numPassedTests,count);assert.equal(t.numFailedTests,0);}
const build=read('UNCERTAINTY_BUILD_REV1.json');assert.equal(build.exitCode,0);for(const f of build.artifacts)assert.equal(sha(f.path),f.sha256,f.path);
const files=['UNCERTAINTY_PLAN_REV1.json','UNCERTAINTY_RESULT_REV1.json','UNCERTAINTY_TESTS_REV1.json','UNCERTAINTY_REFERENCE_TESTS_REV1.json','UNCERTAINTY_BUILD_REV1.json','CAMPAIGN3_UNCERTAINTY_QUALIFICATION.md'];
const result={status:'PASS',verdict:'VER-C3-UNCERTAINTY-001',scope:'Controlled interoceptive interval belief and selection; no native admission or clinical calibration.',models:5,runs:155,prefixes:775,tests:15,referenceTests:328,counters:[1508,0],artifacts:[...files.map(n=>({path:p+n,sha256:sha(p+n)})),{path:'scripts/check-uncertainty-closure.mjs',sha256:sha('scripts/check-uncertainty-closure.mjs')}]};
const out=p+'UNCERTAINTY_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read('UNCERTAINTY_CLOSURE_REV1.json'),result);console.log('PASS uncertainty:5 models/155 runs/775 prefixes;15+328 tests/build;1508/0.');
