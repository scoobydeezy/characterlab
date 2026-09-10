// Exact fixture arithmetic model only: does not execute CharacterLab runtime.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const out='docs/planning/CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json';
assert(!fs.existsSync(out),'preserve receipt; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inputs=[['sample',10],['sample',40],['delivery',40,30],['sample',41],['sample',75],['delivery',75,5],['delivery',75,60],['sample',76],['sample',180]];
const gcd=(a,b)=>b?gcd(b,a%b):a;
const fraction=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
// Scale2 represents all fixture reserve/rate values exactly, including rate1/2.
function run({initial=80n,rate=2n,width=10n,missing=false,overflow=false}={}){
 let q=initial*2n,at=0n,samples=0,deliveries=0;const records=[],boundaries=[];
 for(let i=0;i<inputs.length;i++){
  const [kind,time,amount]=inputs[i],t=BigInt(time),raw=q-rate*(t-at),before=raw>0n?raw:0n;
  if(kind==='sample'){
   const w=width*2n,l=before===200n?200n-w:(before/w)*w,u=l+w;
   records.push({input:i,kind,time,reserve:fraction(before,2n),interval:missing?null:[fraction(l,2n),fraction(u,2n)],pressure:missing?'Unavailable':fraction(u<120n?120n-u:0n,120n),observationOrdinal:samples*3,experienceOrdinal:missing?null:samples*3+1,privatePaddingOrdinal:missing?samples*3+1:null,pressureOrdinal:samples*3+2,children:[9+samples*5,13+samples*5]});samples++;
  }else{
   const e=BigInt(overflow&&i===6?64:amount)*2n,applied=e<200n-before?e:200n-before;
   q=before+applied;at=t;deliveries++;
   records.push({input:i,kind,time,before:fraction(before,2n),potential:fraction(e,2n),applied:fraction(applied,2n),overflow:fraction(e-applied,2n),after:fraction(q,2n)});
  }
  if(i===inputs.length-1||inputs[i+1][1]!==time)boundaries.push({time,anchor:[fraction(q,2n),Number(at)],nextRuntime:samples*3,nextEvent:9+samples*5,nextSequence:9+samples*5,pendingInputIds:inputs.map((_,j)=>j).filter(j=>j>i)});
 }
 return {records,boundaries,totals:{samples,deliveries,events:samples*6+deliveries,generatedChildren:samples*5,runtimeAdvances:samples*3,semOutputs:missing?0:samples}};
}
const cases={baseline:run(),hiddenInitial:run({initial:89n}),slower:run({rate:1n}),coarser:run({width:20n}),denied:run({missing:true}),unavailable:run({missing:true}),overflow:run({overflow:true})};
const sample=c=>c.records.filter(r=>r.kind==='sample');
assert.deepEqual(sample(cases.baseline).map(r=>r.pressure),['0/1','1/6','0/1','1/3','0/1','5/6']);
assert.deepEqual(sample(cases.baseline).map(r=>r.reserve),['70/1','40/1','69/1','35/1','99/1','0/1']);
assert.deepEqual(sample(cases.hiddenInitial).slice(0,2).map(r=>[r.interval,r.pressure]),sample(cases.baseline).slice(0,2).map(r=>[r.interval,r.pressure]));
assert.equal(sample(cases.slower)[1].pressure,'0/1');assert.equal(sample(cases.coarser)[1].pressure,'0/1');
assert.deepEqual(cases.denied,cases.unavailable);
assert.equal(cases.overflow.records[6].overflow,'4/1');assert.deepEqual(sample(cases.overflow),sample(cases.baseline));
assert.deepEqual(cases.baseline.boundaries.find(b=>b.time===40),{time:40,anchor:['70/1',40],nextRuntime:6,nextEvent:19,nextSequence:19,pendingInputIds:[3,4,5,6,7,8]});
assert.deepEqual(cases.baseline.boundaries.find(b=>b.time===75),{time:75,anchor:['100/1',75],nextRuntime:12,nextEvent:29,nextSequence:29,pendingInputIds:[7,8]});
assert.equal(cases.baseline.totals.events,39);assert.equal(cases.baseline.totals.runtimeAdvances,18);
for(const c of Object.values(cases))assert.deepEqual(c.totals.generatedChildren,30);
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
const doc='docs/planning/CAMPAIGN3_EMBODIED_PROFILE_WITNESS_DRAFT.md';
fs.writeFileSync(out,JSON.stringify({status:'SYM-3 EXPECTED ARITHMETIC CHECKED; PUBLIC PROFILE NOT EXECUTED',inputs,cases,preservedChecks:frozen.checks.length,
 limitation:'This script implements finite expectation arithmetic only. No production scheduler, PRJ, SEM, ingress, patch, trace or restore operation was executed.',
 document:{path:doc,sha256:hash(doc)},script:{path:'scripts/check-campaign3-embodied-profile-expectations.mjs',sha256:hash('scripts/check-campaign3-embodied-profile-expectations.mjs')}},null,2)+'\n');
console.log(JSON.stringify({cases:Object.keys(cases).length,baselineEvents:39,baselineRuntimeAdvances:18,preservedChecks:frozen.checks.length,status:'EXPECTED VALUES ONLY; NO EMB PASS'}));
