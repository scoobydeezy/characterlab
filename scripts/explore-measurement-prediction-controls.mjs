// Research oracle only: no canonical belief records, allocation or runtime activation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url);
const output=new URL('../docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_CONTROL_EXPLORATION.json',import.meta.url);
assert(!fs.existsSync(output),'Preserve prior reports; choose a new revision path.');
const paths=['scripts/explore-measurement-prediction-controls.mjs','src/substrate/exactMath.ts','reference/src/model/estimate.ts','reference/src/kernel/rational.ts','reference/src/kernel/lattice.ts'];
const fingerprint=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const before=paths.map(fingerprint);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {Rational:R}=await server.ssrLoadModule('/reference/src/kernel/rational.ts');
 const {updateEstimate,initialEstimate}=await server.ssrLoadModule('/reference/src/model/estimate.ts');
 const q=n=>Q.of(BigInt(n)),show=x=>`${x.numerator}/${x.denominator}`;
 const oracle=xs=>xs.reduce((a,b)=>a.add(b),q(0)).divide(q(xs.length));
 const mean=xs=>{let m;let n=0n;for(const x of xs){m=m===undefined?x:m.multiply(Q.of(n)).add(x).divide(Q.of(n+1n));n++;}return m;};
 const gain=xs=>xs.reduce((m,x)=>m===undefined?x:m.add(x).divide(q(2)),undefined);
 const historical=xs=>{let s=initialEstimate(0);for(const [i,x] of xs.entries())s=updateEstimate(s,{lambdaQ:R.ZERO,kC:R.ONE},R.ONE,R.ONE,R.of(x.numerator,x.denominator),i+1,'point').next;return Q.of(s.mu.p,s.mu.q);};
 const cases=[
  {name:'unobserved is absent',points:[],expected:undefined},
  {name:'learned zero exists',points:[q(0)],expected:'0/1'},
  {name:'history influences forecast',points:[q(0),q(10),q(10)],expected:'20/3'},
  {name:'diagnostic permitted change',points:[q(5),Q.of(51n,10n)],expected:'101/20'},
 ];
 const results=cases.map(c=>{const m=mean(c.points);assert.equal(m===undefined?undefined:show(m),c.expected);if(m)assert(m.equals(oracle(c.points)));return {name:c.name,inputs:c.points.map(show),expected:c.expected??'Absent',actual:m===undefined?'Absent':show(m),lastReading:c.points.length?show(c.points.at(-1)):'Absent',constantGainHalf:c.points.length?show(gain(c.points)):'Absent',historicalQuantized:c.points.length?show(historical(c.points)):'Absent'};});
 // Exhaustive finite algebra controls: independent sum/count oracle, reversal,
 // and both intervals around zero. These are not public runtime witnesses.
 const alphabet=[Q.of(-1n,3n),q(0),Q.of(1n,10n),q(5),Q.of(51n,10n),q(10)];
 let exhaustive=0,quantizationWitness;
 for(const a of alphabet)for(const b of alphabet)for(const c of alphabet)for(const d of alphabet){
  const xs=[a,b,c,d],m=mean(xs),reverse=mean([...xs].reverse());
  assert(m.equals(oracle(xs)));assert(m.equals(reverse));exhaustive++;
  const h=historical(xs),hr=historical([...xs].reverse());
  if(!quantizationWitness&&!h.equals(hr))quantizationWitness={inputs:xs.map(show),exactMean:show(m),historicalForward:show(h),historicalReverse:show(hr)};
 }
 assert(quantizationWitness,'Must exhibit, not merely speculate about, order-dependent historical quantization.');
 assert.notEqual(results[2].actual,results[2].constantGainHalf);
 assert.notEqual(results[2].actual,results[2].lastReading);
 assert.notEqual(results[2].actual,results[2].historicalQuantized);
 assert.deepEqual(paths.map(fingerprint),before);
 const report={status:'EXECUTED RESEARCH CONTROL EXPLORATION; NO SEAM QUALIFICATION',sourceFingerprints:before,cases:results,finiteAlgebraCases:exhaustive,quantizationWitness,limitations:['No canonical prediction schema or implementation exists.','No public admission, subject projection, state mutation, scheduling, trace or restore is exercised.','Negative points are algebra controls outside the first diagnostic profile.','Historical source is loaded read-only as an explicitly named control, never imported by active src.','No claim of calibrated uncertainty, independence, psychological sufficiency or retention.']};
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,cases:results,finiteAlgebraCases:exhaustive,quantizationWitness},null,2));
} finally {await server.close();}
