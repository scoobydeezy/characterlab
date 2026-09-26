import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(p+f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read('COSTLY_REWARD_PLAN_REV1.json'),result=read('COSTLY_REWARD_RESULT_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(p+'COSTLY_REWARD_PLAN_REV1.json'));
assert.equal(plan.models.length,6);assert.equal(plan.runs.length,50);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,50);assert.equal(result.results.length,50);assert.equal(result.componentPrefixes,650);assert.equal(result.advancing,600);assert.equal(result.terminal,50);assert.equal(result.repeatedCostlySeeds,7);assert(plan.experimentIdentity&&plan.comparisonCase);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const gcd=(a,b)=>b?gcd(b,a%b):a,q=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
for(const [i,r] of result.results.entries()){
 const input=plan.runs[i];for(const k of ['law','name','seed','modelIdentity','runIdentity'])assert.equal(r[k],input[k]);assert.equal(r.prefixHashes.length,13);assert.equal(r.snapshot.rows.length,12);assert.equal(r.snapshot.world.length,12);
 const {world,addresses,...safe}=r.snapshot;assert.deepEqual(safe,r.observerView);assert(addresses.length>=0);
 const history=[];let goal=false,maintained=false;
 for(const [j,f] of input.frames.entries()){
  const row=r.snapshot.rows[j],w=world[j],latest=input.law==='LatestHistory';
  const estimate=k=>history.length?q(BigInt(latest?Number(history.at(-1)[k]):history.filter(s=>s[k]).length),BigInt(latest?1:history.length)):null;
  assert.equal(row.rewardBelief,estimate('reward'));assert.equal(row.harmBelief,estimate('harm'));assert.equal(row.goal,goal);
  maintained=goal&&(f.visible&&f.reminder||maintained&&f.support);assert.equal(row.maintained,maintained);
  assert.equal(w.performedA,row.intent===0&&f.executionA);assert.equal(w.reward,w.performedA&&f.rewardA);assert.equal(w.harm,w.performedA&&f.harmA);assert.equal(w.privateBit,f.privateBit);
  const receipt=row.intent===0&&f.receipt?{reward:f.reportReward===0?w.reward:f.reportReward===1,harm:f.reportHarm===0?w.harm:f.reportHarm===1}:null;assert.deepEqual(row.receipt,receipt);
  if(input.law!=='NoLearning'&&receipt)history.push({at:j+1,...receipt,cue:f.visible&&f.cue});goal=goal||f.visible&&f.adopt;
 }
 assert.deepEqual(r.snapshot.history,history);assert.equal(r.snapshot.goal,goal);assert.equal(r.sequence,r.snapshot.rows.map(r=>r.intent<0?'-':r.intent===0?'A':'B').join(''));
}
const get=(law,name,seed=7)=>result.results.find(r=>r.law===law&&r.name===name&&r.seed===seed);
for(let seed=0;seed<8;seed++){const a=get('MeanHistory','main',seed),b=get('MeanHistory','withheld',seed);assert.equal(get('MeanHistory','noLoad',seed).sequence,'AAAABBBBBBBB');assert.equal(a.sequence.slice(4,6),'BB');assert.equal(a.sequence.slice(10),'BB');assert(a.snapshot.rows.slice(4).every(r=>r.goal&&r.maintained));assert.equal(b.snapshot.history.length,4);assert.equal(a.snapshot.rows[6].resolution,b.snapshot.rows[6].resolution);}
for(const [a,b] of [['trueReports','falseReports'],['withheld','hiddenDenied']])assert.deepEqual(get('MeanHistory',a).observerView,get('MeanHistory',b).observerView);
assert(get('MeanHistory','harmless').snapshot.world.every(r=>!r.harm));assert.equal(get('MeanHistory','otherCue').sequence,'AAAABBBBBBBB');assert.notEqual(get('BeliefAccess','otherCue').sequence,'AAAABBBBBBBB');
for(const [file,count] of [['COSTLY_REWARD_TESTS_REV1.json',17],['COSTLY_REWARD_REFERENCE_TESTS_REV1.json',328]]){const r=read(file);assert(r.success);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
const build=read('COSTLY_REWARD_BUILD_REV1.json');assert.equal(build.status,'PASS');assert.equal(build.exitCode,0);for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256);
const files=['COSTLY_REWARD_PLAN_REV1.json','COSTLY_REWARD_RESULT_REV1.json','COSTLY_REWARD_EXPLORATION_REV1.json','COSTLY_REWARD_TESTS_REV1.json','COSTLY_REWARD_REFERENCE_TESTS_REV1.json','COSTLY_REWARD_BUILD_REV1.json','COSTLY_REWARD_FINDINGS.md','CAMPAIGN3_COSTLY_REWARD_QUALIFICATION.md','IDENTITY_EVIDENCE_READINESS.md'];
const closure={status:'PASS',scope:'costly-reward-component/0.1-candidate; bounded acquired costly pursuit, not full addiction or public scheduler qualification',models:6,runs:50,componentPrefixes:650,tests:17,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-costly-reward-closure.mjs',sha256:sha('scripts/check-costly-reward-closure.mjs')}]};
const file=p+'COSTLY_REWARD_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(JSON.parse(fs.readFileSync(file)),closure);console.log('PASS costly reward:6 models/50 runs/650 component prefixes;17+328 tests/build;1400/0.');
