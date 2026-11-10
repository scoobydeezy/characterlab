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
import {snap,through,finish,state,knowledge,bytes,exact,create,projection,probability,instrument,concern,memory,allDraws,equalReceivers,frac,type Mode} from './fixtures/assembledAffectReceiving';
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
