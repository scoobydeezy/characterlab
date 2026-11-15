import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,time,rec,f,items,key,decode,enc,list,text,q,bytes,outputs,exact,type Run,type CanonicalValue,type Profile} from './fixtures/assembledCensoredLearning';
import {BODY_DELIVERY} from '../assembled/body';
import {EFFECT_OBSERVE} from '../assembled/effectEvidence';
import {unsigned} from '../substrate/canonicalEncoding';
import {applyEpiEvidence} from '../campaign3/epiMath';
import {runCase,applications} from './learnFixtures';
const types=(r:Run,t:bigint)=>outputs(r.snapshot().outputs,t);
const same=(a:CanonicalValue,b:CanonicalValue)=>bytes(enc(a),enc(b));
const sample=(a:ReturnType<typeof rec>)=>rec(f(rec(f(a,2n),904n),2n),900n);
const estimate=(v:CanonicalValue|undefined,t=902n)=>v?rec(v,t):undefined;
const shape=(v:CanonicalValue|undefined,t=902n)=>{const e=estimate(v,t);return e?[f(e,1n),f(e,2n),items(f(e,3n),'set').length]:undefined;};
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(64);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,other?:Run){for(let n=0;n<64;n++){const next=await r.settleNextInstant();if(other){expect(await other.settleNextInstant()).toBe(next);exact(r,other);}if(!next){expect(r.snapshot().clock).toBe(101n);return;} }throw Error('settle cap64');}
function live(r:Run,count:number,mean?:CanonicalValue,precision?:CanonicalValue,at=12n){
 const a=types(r,905n),s=types(r,900n);expect(a).toHaveLength(count);expect(s).toHaveLength(count);
 for(const app of a){const predicted=applyEpiEvidence(app.fields.get(3n),f(app,2n),1,1);expect(app.fields.get(4n)).toEqual(predicted.next);expect(f(app,5n)).toBe(predicted.applied);}
 const p=outputs(r.snapshot().trace,160n).filter(t=>time(f(rec(f(t,4n),130n),2n))===at&&key(f(t,6n))===key(text('effect-evidence/0.1'))).flatMap(t=>items(f(t,13n),'list')).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===906n).map(v=>rec(v,906n));
 expect(p.length,'later appraisal consumes belief').toBeGreaterThan(0);
 for(const x of p){expect(x.fields.get(4n)).toEqual(a.at(-1)!.fields.get(4n));if(mean){expect(f(x,5n)).toEqual(mean);expect(f(x,6n)).toEqual(precision);}else expect(x.fields.has(4n)).toBe(false);}
 expect(types(r,409n).length,'ordinary decisions still run').toBeGreaterThan(0);
}
async function correspondence(r:Run,name:string){
 const native=types(r,905n);
 for(const law of [1,2,3])for(const numeric of [1,2]){
  const original=applications((await runCase(name,law,numeric)).outputs);expect(original.length).toBe(native.length);
  let prior:CanonicalValue|undefined;
  for(let i=0;i<native.length;i++){
   const actual=applyEpiEvidence(prior,f(native[i],2n),law,numeric),old=original[i];prior=actual.next;
   expect(shape(prior)).toEqual(shape(old.fields.get(4n),889n));expect(actual.applied).toBe(f(old,5n));
   expect(actual.rawMean).toEqual(f(old,6n));expect(actual.rawPrecision).toEqual(f(old,7n));
   const ns=sample(native[i]),os=rec(f(rec(f(old,2n),891n),2n),887n);
   for(const k of [5n,6n,7n])expect(f(ns,k)).toEqual(f(os,k));
  }
  console.info('M116 correspondence '+name+' law'+law+' numeric'+numeric+' applications'+native.length);
 }
}
function tracePair(a:Run,b:Run){
 const ta=outputs(a.snapshot().trace,160n),tb=outputs(b.snapshot().trace,160n);expect(ta.length).toBe(tb.length);let draws=0;
 for(let i=0;i<ta.length;i++){
  const ev=rec(f(ta[i],4n),130n),truth=[BODY_DELIVERY,EFFECT_OBSERVE].some(x=>key(x)===key(f(ev,5n))),delivery=key(BODY_DELIVERY)===key(f(ev,5n));
  const omit=truth?[3n,4n,12n,13n,...(delivery?[18n]:[])]:[3n];
  if(delivery){
   const x=items(f(ta[i],18n),'list').map(v=>rec(v,130n)),y=items(f(tb[i],18n),'list').map(v=>rec(v,130n));
   expect(x.length).toBe(y.length);expect(x.length).toBeLessThanOrEqual(1);
   for(let j=0;j<x.length;j++){
    expect(f(x[j],5n)).toEqual(EFFECT_OBSERVE);expect(f(x[j],3n)).toEqual(unsigned(120));
    same(list([...x[j].fields].filter(([k])=>k!==6n).map(([k,v])=>list([unsigned(k),v]))),list([...y[j].fields].filter(([k])=>k!==6n).map(([k,v])=>list([unsigned(k),v]))));
    expect(f(x[j],6n)).toEqual(items(f(ta[i],13n),'list')[0]);expect(f(y[j],6n)).toEqual(items(f(tb[i],13n),'list')[0]);
   }
  }
  same(list([...ta[i].fields].filter(([k])=>!omit.includes(k)).map(([k,v])=>list([unsigned(k),v]))),list([...tb[i].fields].filter(([k])=>!omit.includes(k)).map(([k,v])=>list([unsigned(k),v]))));
  draws+=items(f(ta[i],14n),'list').length;
 }
 expect(draws).toBeGreaterThan(0);return {events:ta.length,draws};
}
it('M116 repeated censoring hidden truth and continuation',async()=>{
 const a=fixture('repeated'),b=fixture('hidden');expect(a.s).toEqual(b.s);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);
 const m=await prepareCharacterModel(a.s),left=await createCharacterRun(m,a.d),right=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,a.d);let restored:Run|undefined;
 const safe=(r:Run)=>list(items(decode(r.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===479n)));
 for(let i=0;i<64;i++){
  const next=await left.settleNextInstant();expect(await right.settleNextInstant()).toBe(next);
  expect(await repeat.settleNextInstant()).toBe(next);exact(left,repeat);
  if(restored){expect(await restored.settleNextInstant()).toBe(next);exact(left,restored);}
  bytes(left.snapshot().state,right.snapshot().state);same(safe(left),safe(right));
  if(left.snapshot().clock===6n){const apps=types(left,905n);expect(apps).toHaveLength(6);expect(shape(f(apps[0],4n))).toEqual([q(1,10),q(2,1),1]);for(const x of apps.slice(1)){expect(f(x,5n)).toBe(false);same(f(x,4n),f(apps[0],4n));}restored=await restoreCharacterRun(a.s,{initialState:a.d.initialState,orderedInputs:a.d.orderedInputs,save:left.save()});exact(left,restored);}
  console.info('M116 repeated settlement '+left.snapshot().clock+(next?'':':end'));
  if(!next){expect(left.snapshot().clock).toBe(101n);break;}expect(i).toBeLessThan(63);
 }
 expect(restored).toBeDefined();live(left,7,q(13,50),q(4,1));live(right,7,q(13,50),q(4,1));
 const physical=types(left,479n);expect(physical.slice(0,6).map(x=>[f(x,1n),f(x,3n),f(x,4n)])).toEqual(Array.from({length:6},()=>[q(90,1),q(10,1),q(0,1)]));
 expect(types(right,479n).slice(0,6).map(x=>f(x,4n))).toEqual(Array.from({length:6},()=>q(70,1)));
 console.info('M116 paired trace '+JSON.stringify(tracePair(left,right)));await correspondence(left,'repeated');await correspondence(right,'hidden');
},550000);
it('M116 acquired high precision priors and late read',async()=>{
 for(const profile of ['compatible','inconsistent']as const){
  const b=fixture(profile),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d),duplicate=profile==='inconsistent'?await createCharacterRun(m,b.d):undefined;
  await through(r,97n);if(duplicate){await through(duplicate,97n);exact(r,duplicate);}
  const training=types(r,905n);expect(training).toHaveLength(25);
  for(let i=0;i<25;i++){expect(time(f(sample(training[i]),4n))).toBe(BigInt(1+4*i));expect(shape(f(training[i],4n))).toEqual([profile==='compatible'?q(2,5):q(1,20),q(2*(i+1),1),i+1]);}
  const prior=f(training[24],4n),restored=profile==='inconsistent'?await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()}):undefined;
  await finish(r,restored);if(duplicate){await finish(duplicate);exact(r,duplicate);}
  live(r,26,profile==='compatible'?q(2,5):q(27,520),q(profile==='compatible'?50:52,1),100n);
  if(profile==='compatible'){same(f(types(r,905n)[25],4n),prior);expect(f(types(r,905n)[25],5n)).toBe(false);}
  await correspondence(r,profile);console.info('M116 high prior PASS '+profile);
 }
},550000);
it('M116 unknown positive zero and denied evidence',async()=>{
 for(const profile of ['zero','positiveZero','missing']as Profile[]){
  const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await finish(r);
  if(profile==='missing'){live(r,1,q(21,50),q(2,1));await correspondence(r,'missing');}
  else if(profile==='zero'){live(r,1);await correspondence(r,'zero');}
  else{live(r,2,q(2,5),q(2,1));const a=types(r,905n);same(f(a[0],4n),f(a[1],4n));expect(f(a[1],5n)).toBe(false);const original=applications((await runCase('positiveZero')).outputs);expect(shape(f(original.at(-1)!,4n),889n)).toEqual([q(2,5),q(50,1),25]);}
  console.info('M116 negative control PASS '+profile);
 }
},550000);
