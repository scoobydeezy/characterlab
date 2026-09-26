import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(p+f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read('RELAPSE_PLAN_REV2.json'),old=read('RELAPSE_PLAN_REV1.json'),result=read('RELAPSE_RESULT_REV2.json'),control=read('CONTROL_PUBLIC_PLAN_REV2.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(p+'RELAPSE_PLAN_REV2.json'));assert.equal(plan.models.length,7);assert.equal(plan.runs.length,31);assert.equal(result.results.length,31);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,31);assert.equal(result.prefixes,279);assert.equal(result.advancing,248);assert.equal(result.terminal,31);assert.equal(result.newModels,0);assert(plan.experimentIdentity&&plan.comparisonCase);
assert.deepEqual(plan.runs,old.runs);assert.deepEqual(plan.models,old.models);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const a of control.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const model of plan.models)assert.equal(model.modelIdentity,control.runs.find(r=>r.candidate===model.candidate&&r.law===model.law).modelIdentity);
for(const a of read('RELAPSE_HARNESS_FAILURE_REV1.json').artifacts)assert.equal(sha(a.preserved),a.sha256,a.preserved);
for(const [i,row] of result.results.entries()){for(const k of ['name','candidate','law','seed','runIdentity','modelIdentity'])assert.equal(row[k],plan.runs[i][k]);assert.equal(row.prefixHashes.length,9);assert.equal(row.summary.actions.length,8);assert(row.traceSha256&&row.outputSha256&&row.stateSha256&&row.safeSha256);}
const get=(name,seed=7,candidate=1,law=1)=>result.results.find(r=>r.name===name&&r.seed===seed&&r.candidate===candidate&&r.law===law),returned=[];
for(let seed=0;seed<8;seed++){
 const a=get('main',seed).summary,b=get('noLoad',seed).summary;
 assert.deepEqual(a.actions.slice(0,6),[true,true,true,false,false,false]);assert.equal(a.actions[7],false);assert.deepEqual(b.actions.slice(3),[false,false,false,false,false]);
 assert.deepEqual(a.retained.slice(3),[true,true,true,true,true]);assert.deepEqual(a.maintained.slice(3),[true,true,true,true,true]);assert.deepEqual(a.inhibited.slice(3),[true,true,true,false,true]);assert.equal(a.appraisals[6],b.appraisals[6]);assert.equal(a.distributions[6].length,2);assert.equal(a.distributions[6][0],a.distributions[6][1]);for(let i=3;i<8;i++)assert.equal(a.historyBefore[i],a.historyAfter[i]);if(a.actions[6])returned.push(seed);
}
assert(returned.length);assert.deepEqual(result.returnedSeeds,returned);assert.equal(get('main').safeSha256,get('hiddenReward').safeSha256);
for(const name of ['otherCue','unseenTraining','negativeBelief','deniedCard'])assert.equal(get(name).summary.actions[6],false);
assert.equal(get('retired').summary.retained[6],false);assert.deepEqual(get('retired').summary.actions.slice(6),[true,true]);assert.equal(get('lost').summary.retained[6],true);assert.equal(get('lost').summary.maintained[6],false);assert.equal(get('lost',7,4).summary.inhibited[6],true);
for(const [file,count] of [['RELAPSE_TESTS_REV1.json',5],['RELAPSE_REFERENCE_TESTS_REV1.json',328]]){const r=read(file);assert(r.success);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
const build=read('RELAPSE_BUILD_REV1.json');assert.equal(build.status,'PASS');assert.equal(build.exitCode,0);for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256);
const files=['RELAPSE_PLAN_REV1.json','RELAPSE_PLAN_REV2.json','RELAPSE_RESULT_REV2.json','RELAPSE_TESTS_REV1.json','RELAPSE_REFERENCE_TESTS_REV1.json','RELAPSE_BUILD_REV1.json','RELAPSE_HARNESS_FAILURE_REV1.json','RELAPSE_FINDINGS.md','CAMPAIGN3_RELAPSE_QUALIFICATION.md','ADDICTION_INTEGRATION_READINESS.md'];
const closure={status:'PASS',scope:'relapse-experiment/0.1-candidate; unchanged control-public/0.2-candidate',models:7,newModels:0,publicRuns:31,prefixes:279,advancing:248,terminal:31,returnedSeeds:returned,tests:5,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-relapse-closure.mjs',sha256:sha('scripts/check-relapse-closure.mjs')}]};
const file=p+'RELAPSE_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(JSON.parse(fs.readFileSync(file)),closure);console.log('PASS relapse:7 reused models/31 public runs/279 prefixes;5+328 tests/build;1400/0; return seeds '+returned.join(','));
