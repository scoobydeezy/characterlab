import {it,expect,vi} from 'vitest';
import * as reappraisal from '../assembled/reappraisal';
import * as factor from '../campaign3/affectFactorComparison';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {isSocialEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {list,text,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,type Cell} from './fixtures/assembledAffectScalar';
import {receivingRecord as rec} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {INTERPRETED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath,reappraisalKnowledge} from '../assembled/reappraisal';
import {sid} from '../assembled/skill';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
function snap(r:Run){let v=cache.get(r);if(!v){v=r.snapshot();cache.set(r,v);}return v;}
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
async function create(cell:Cell,at=10n,control:'normal'|'hidden'|'denied'='normal'){const b=fixture(cell,control),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function projection(r:Run,mode:'normal'|'denied'='normal'){
 const a=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(SHARED_AFFECT_APPRAISAL))).map(v=>items(v,'list')).find(v=>uint(v[1])===10n)!;
 expect(a,'actual appraisal10').toBeDefined();expect(txt(a[5])).toBe(mode==='denied'?'Unavailable':'Known');
 if(mode!=='denied')expect(readQ(items(a[6],'list')[1]).compare(Q.of(0n)),'live known affect, including zero').toBeGreaterThanOrEqual(0);
 const d=outputs(snap(r).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;expect(d).toBeDefined();
 const data=result(d),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const signal=(task:CanonicalValue,role:bigint)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===role;});
 const nucleus=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 expect(candidates,'available physical alternatives').toHaveLength(2);
 const A=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-one')))!;
 const B=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')))!;
 expect(A).toBeDefined();expect(B).toBeDefined();expect(A).not.toEqual(B);
 for(const task of [taskA,taskB]){
  expect(signal(task,1n),'positive base liveness').toHaveLength(1);
  expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);
  expect(nucleus(task),'live compiled ground').toHaveLength(1);
 }
 expect(ns).toHaveLength(2);
 const trace=outputs(snap(r).trace,160n),event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n);
 const receive=trace.find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&signedValue(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n)!;
 expect(receive).toBeDefined();const input=items(f(receive,12n),'list');expect(input[1]).toEqual(list(a));
 const producer=trace.find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)))!;
 expect(producer,'actual completed appraisal producer').toBeDefined();expect(items(f(producer,11n),'list')).toHaveLength(3);
 expect(txt(f(producer,6n))).toBe(INTERPRETED_THREAT_VERSION);
 expect(f(rec(f(receive,13n),403n),3n)).toEqual(f(raw,3n));
 for(const t of [producer,receive])expect(items(f(t,14n),'list'),'no affect random draws').toEqual([]);
 expect(outputs(snap(r).outputs,433n).some(o=>{const intent=rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(d);}), 'decision reaches execution').toBe(true);
 expect(state(r).read(framePath(C)).presence).toBe(false);
 return {a,d,data,context,raw,ns,signal,nucleus,A,B};
}
const probability=(data:CanonicalValue,candidate:CanonicalValue)=>readQ(f(rec(items(f(rec(data,420n),2n),'list').find(p=>key(f(rec(p,421n),1n))===key(candidate))!,421n),2n));


type Mode='Native'|'ScalarUncontrolled'|'ScalarExposure'|'HistoricalAverage';
type Packet={status:'Unavailable'}|{status:'Known';value:Q};
// The adapter can see ONE number; it cannot reconstruct the missing coordinate.
// Original evidence/provenance remains visible in the trace, never used by this adapter.
function receive(packet:Packet):factor.AffectProjection{return packet.status==='Unavailable'?packet:{status:'Known',coordinates:[Q.of(0n),packet.value]};}
async function instrument<T>(mode:Mode,body:()=>Promise<T>){
 if(mode==='Native')return body();
 const originalFactory=reappraisal.createReappraisalExecution,originalFactor=factor.compareAffectFactors;
 let inside=false,calls=0;
 const factory=vi.spyOn(reappraisal,'createReappraisalExecution').mockImplementation((...args)=>{
  const real=originalFactory(...args);
  return Object.freeze({...real,appraise(...args:Parameters<typeof real.appraise>){
   expect(inside).toBe(false);inside=true;try{return real.appraise(...args);}finally{inside=false;}
  }});
 });
 const kernel=vi.spyOn(factor,'compareAffectFactors').mockImplementation((input,candidate)=>{
  const result=originalFactor(input,candidate);if(!inside)return result;
  expect(candidate).toBe('SplitExposure');calls++;
  if(result.status==='Unavailable')return receive({status:'Unavailable'});
  const [E,U]=result.coordinates;
  const packet:Packet={status:'Known',value:mode==='ScalarUncontrolled'?U:mode==='ScalarExposure'?E:E.add(U).divide(Q.of(2n))};
  expect(Object.keys(packet)).toEqual(['status','value']);return receive(packet);
 });
 try{const value=await body();expect(calls,'actual shared producer substitutions').toBeGreaterThan(0);return value;}
 finally{kernel.mockRestore();factory.mockRestore();expect(inside).toBe(false);}
}
const event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n);
function concern(r:Run){
 const t=outputs(snap(r).trace,160n).find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n&&signedValue(f(event(t),2n))===10n)!;
 expect(t,'actual concern consumption10').toBeDefined();
 expect(items(f(t,12n),'list')[1]).toEqual(list(projection(r,knowledge(r).efficacy!.control===undefined?'denied':'normal').a));
 return f(t,13n);
}
const reports=(r:Run,label:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
function memory(r:Run,unknown=false){
 const a=reports(r,AFFECT_RECALL).find(a=>signedValue(a[1])===11n)!;expect(a,'actual delayed recall11').toBeDefined();
 const carry=unpackAffectCue(a[2],11n);expect(carry.carry?.at).toBe(10);expect(carry.carry?.status).toBe(unknown?'Unavailable':'Known');
 const episodes=state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list'));
 expect(episodes,'retained acquired memories').toHaveLength(2);
 const byId=new Map(episodes.map(a=>[uint(id(a[1]).payload),signedValue(a[5])]));
 expect([...byId.values()].sort()).toEqual([7n,8n]);
 const scores=items(a[4],'list').map(v=>{const x=items(v,'list');return {at:byId.get(uint(x[0])),base:frac(x[1]),pull:frac(x[2]),score:frac(x[3])};}).sort((a,b)=>Number(a.at!-b.at!));
 expect(scores,'both eligible memories').toHaveLength(2);expect(scores.some(s=>readQ(q(...s.pull.split('/').map(BigInt) as [bigint,bigint])).compare(Q.of(0n))>0),'live associative pull').toBe(true);
 const trace=outputs(snap(r).trace,160n),t=trace.find(t=>key(f(event(t),5n))===key(MEMORY_RECALL)&&signedValue(f(event(t),2n))===11n&&key(f(event(t),6n))===key(a[2]))!;
 expect(t,'actual ranking trace').toBeDefined();expect(items(f(t,13n),'list')).toContainEqual(list(a));const e=event(t);expect(signedValue(f(e,2n))).toBe(11n);expect(uint(f(e,3n))).toBe(20n);
 expect(items(f(e,8n),'list')).toContainEqual(u(carry.source!));
 const producer=trace.find(t=>uint(f(event(t),1n))===carry.source&&key(f(t,13n))===key(items(a[2],'list')[2]))!;
 expect(producer,'prior completed appraisal causal parent').toBeDefined();expect(signedValue(f(event(producer),2n))).toBe(10n);
 expect(items(f(t,11n),'list')).toHaveLength(2);
 const selected=items(a[5],'list').map(v=>byId.get(uint(items(v,'list')[0])));
 expect(selected.length).toBeGreaterThan(0);
 for(const at of selected)expect(items(episodes.find(x=>signedValue(x[5])===at)![4],'list')).toContainEqual(signed(11));
 return {gain:frac(a[3]),scores,selected,episodes,carry,raw:a};
}
function allDraws(r:Run){return outputs(snap(r).trace,160n).flatMap(t=>items(f(t,14n),'list'));}
function equalReceivers(a:Run,b:Run,unknown=false){
 const pa=projection(a,unknown?'denied':'normal'),pb=projection(b,unknown?'denied':'normal');
 expect(pa.raw).toEqual(pb.raw);expect(pa.ns).toEqual(pb.ns);expect(pa.d).toEqual(pb.d);
 expect(concern(a)).toEqual(concern(b));expect(outputs(snap(a).outputs,433n)).toEqual(outputs(snap(b).outputs,433n));
 expect(knowledge(a)).toEqual(knowledge(b));bytes(snap(a).state,snap(b).state);expect(allDraws(a)).toEqual(allDraws(b));
 const ma=memory(a,unknown),mb=memory(b,unknown);
 for(const k of ['gain','scores','selected','episodes'] as const)expect(ma[k]).toEqual(mb[k]);
 return {pa,pb,ma,mb};
}
const primary:Cell={p:1,s:1,v:1,c:1};
async function run(mode:Mode='Native',cell:Cell=primary,control:'normal'|'hidden'|'denied'='normal'){
 return instrument(mode,()=>create(cell,11n,control));
}
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
const summary=(r:Run,mode:Mode)=>{const p=projection(r),m=memory(r);return {mode,coords:p.a[6],gain:m.gain,scores:m.scores,selected:m.selected,draws:allDraws(r).length,probabilityA:uint(f(p.data,8n))===1n?(key(f(p.data,1n))===key(p.A)?'1/1':'0/1'):frac(f(rec(items(f(p.data,2n),'list').find(v=>key(f(rec(v,421n),1n))===key(p.A))!,421n),2n)),automatic:uint(f(p.data,8n))===1n};};
it('M75 primary: scalar packets reach actual concern reason choice execution and recall',async()=>{
 const native=await run(),scalar=await run('ScalarUncontrolled');
 const {pa,pb,ma,mb}=equalReceivers(native.r,scalar.r);
 expect(pa.a[6]).toEqual(list([q(119,200),q(0,1)]));expect(pb.a[6]).toEqual(list([q(0,1),q(0,1)]));
 expect(pa.a).not.toEqual(pb.a);expect(ma.raw[2]).not.toEqual(mb.raw[2]);
 expect(allDraws(native.r).length,'matched actual random records, not merely equal seed').toBeGreaterThan(0);
 expect(probability(pa.data,pa.A)).toEqual(Q.of(1n,2n));expect(ma.gain).toBe('1/1');
 console.info('M75 RECEIVER '+json(summary(native.r,'Native')));
 console.info('M75 RECEIVER '+json(summary(scalar.r,'ScalarUncontrolled')));
 for(const mode of ['ScalarExposure','HistoricalAverage'] as const){
  const x=await run(mode),p=projection(x.r),m=memory(x.r),value=mode==='ScalarExposure'?Q.of(119n,200n):Q.of(119n,400n);
  expect(p.a[6]).toEqual(list([q(0,1),q(value.numerator,value.denominator)]));
  expect(p.signal(taskA,2n)).toHaveLength(1);expect(readQ(f(p.signal(taskA,2n)[0],2n))).toEqual(value);
  expect(concern(x.r)).not.toEqual(concern(native.r));
  expect((uint(f(p.data,8n))===1n?(key(f(p.data,1n))===key(p.A)?Q.of(1n):Q.of(0n)):probability(p.data,p.A)).compare(Q.of(1n,2n))).toBeGreaterThan(0);
  expect(m.gain).toBe((value.add(Q.of(1n))).numerator+'/'+value.add(Q.of(1n)).denominator);
  expect(m.scores.map(({at,base,pull})=>({at,base,pull}))).toEqual(ma.scores.map(({at,base,pull})=>({at,base,pull})));
  expect(m.scores).not.toEqual(ma.scores);
  console.info('M75 RECEIVER '+json(summary(x.r,mode)));
 }
 console.info('M75 PRIMARY PASS scalar U preserves actual receivers/state/draws; E/H change modifier, P(A)>1/2 and recall score. Diagnostic E difference retained; no admitted scalar model.');
},540000);
it('M75 controls: positive uncontrolled threat unknown evidence and hidden annex',async()=>{
 for(const control of ['positive','denied'] as const){
  const cell=control==='positive'?{...primary,c:0 as const}:primary,channel=control==='denied'?'denied':'normal';
  const a=await run('Native',cell,channel),b=await run('ScalarUncontrolled',cell,channel),x=equalReceivers(a.r,b.r,control==='denied');
  if(control==='positive'){expect(x.pa.a[6]).toEqual(list([q(119,200),q(119,200)]));expect(x.pb.a[6]).toEqual(list([q(0,1),q(119,200)]));expect(x.ma.gain).toBe('319/200');}
  else {expect(x.pa.a[6]).toEqual(list([]));expect(x.pb.a[6]).toEqual(list([]));expect(x.ma.gain).toBe('1/1');expect(x.pa.signal(taskA,2n)).toEqual([]);}
  console.info('M75 CONTROL '+control+' PASS native/U receivers, state, draws and memory equal; gain='+x.ma.gain);
 }
 const a=await run(),hidden=await run('Native',primary,'hidden');
 expect(projection(a.r).a).toEqual(projection(hidden.r).a);expect(projection(a.r).ns).toEqual(projection(hidden.r).ns);expect(knowledge(a.r)).toEqual(knowledge(hidden.r));
 const am=memory(a.r),hm=memory(hidden.r);for(const k of ['gain','scores','selected','episodes'] as const)expect(am[k]).toEqual(hm[k]);
 console.info('M75 HIDDEN PASS perceived knowledge/appraisal/reasons/recall unchanged.');
},540000);
it('M75 persistence: native exact repeat and restore10 through queued recall to terminal',async()=>{
 const a=await create(primary,10n),repeat=await createCharacterRun(a.m,a.b.d);await through(repeat,10n);exact(a.r,repeat);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 for(const r of [a.r,repeat,restored]){await through(r,11n);memory(r);await finish(r);}
 exact(a.r,repeat);exact(a.r,restored);
 console.info('M75 PERSISTENCE PASS native repeat/restore10->11->101 exact state/output/trace/save/identity. No scalar public-checkpoint claim.');
},540000);
