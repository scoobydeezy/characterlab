/** M181 plance82ada5: physical truth stays behind the actual perception boundary. */
import {it,expect} from 'vitest';
import {fixture} from './fixtures/assembledRegulatorySensing';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {decode,enc,items,key,list,text,u,q,C,rec,f,uint,bytes,outputs,exact,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {BODY_SAMPLE,BODY_DELIVERY} from '../assembled/body';
import {ACTION_BODY,ACTION_BODY_EVENT,ACTION_BODY_RECEIPT,ACTION_BODY_RECEIPT_EVENT} from '../assembled/actionBody';
import {SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
import {STRESS,STRESS_APPLY,stressAnchor,stressPath} from '../assembled/regulatoryStress';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {createStoredBody} from '../campaign3/bodyOwnershipComparison';
import {reserveBin} from '../campaign3/embodiedMath';
import {createBiologicalRun} from '../campaign3/biologicalIntegration';
import {regulatoryCase} from './affectRegulatoryFixtures';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M181 time');return v.value;};
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
const kind=(v:CanonicalValue,n:bigint):boolean=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n;
const tag=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&typeof v.items[0]!=='boolean'&&v.items[0].kind==='text'?v.items[0].value:'';
function build(r:Run){const s=r.snapshot();return {s,st:restoreAuthoritativeState(decode(s.state)),tr:outputs(s.trace,160n),out:items(decode(s.outputs),'list')};}
const cache=new WeakMap<Run,ReturnType<typeof build>>();
function view(r:Run){let v=cache.get(r);if(!v||v.s!==r.snapshot()){v=build(r);cache.set(r,v);}return v;}
const reports=(r:Run,label:string)=>view(r).out.filter(v=>tag(v)===label).map(v=>items(v,'list'));
const physicalTypes=[BODY_SAMPLE,BODY_DELIVERY,ACTION_BODY_EVENT,ACTION_BODY_RECEIPT_EVENT,STRESS_APPLY].map(key);
const isPhysical=(t:ReturnType<typeof rec>)=>physicalTypes.includes(key(f(event(t),5n)));
const same=(a:CanonicalValue,b:CanonicalValue)=>bytes(enc(a),enc(b));
function safeOutput(v:CanonicalValue,physical:Map<string,number>){
 const t=tag(v),replacement=kind(v,479n)?list([text('physical-reserve-consequence')]):t===STRESS+'/applied'?list(items(v,'list').slice(0,3)):[ACTION_BODY,ACTION_BODY_RECEIPT].includes(t)?(()=>{
  const a=[...items(v,'list')],i=t===ACTION_BODY?6:5;expect(a).toHaveLength(i+1);
  if(kind(a[i],479n))a[i]=list([text('physical-reserve-consequence')]);else expect(a[i]).toEqual(list([]));return list(a);
 })():v;
 if(replacement!==v){const k=key(v),count=physical.get(k)??0;expect(count,'each projected physical row has its own actual producer').toBeGreaterThan(0);physical.set(k,count-1);}
 return replacement;
}
function safeRows(r:Run){
 const v=view(r),physical=new Map<string,number>();
 for(const t of v.tr.filter(isPhysical)){const phase=uint(f(event(t),3n));if(phase===110n||phase===52n)for(const row of items(f(t,13n),'list'))physical.set(key(row),(physical.get(key(row))??0)+1);}
 return v.out.map(row=>safeOutput(row,physical));
}
const cognitiveState=(r:Run)=>enc(new AuthoritativeState(view(r).st.entries().filter(e=>e.path.rootStateTypeId!==455n)).canonicalValue());
function sampleBoundary(a:ReturnType<typeof rec>,b:ReturnType<typeof rec>){
 for(const n of[1n,2n,4n,5n,6n,7n,8n,9n,10n,12n,13n,14n,16n,17n,18n,19n])same(f(a,n),f(b,n));
 const left=items(f(a,11n),'list').map(v=>rec(v,147n)),right=items(f(b,11n),'list').map(v=>rec(v,147n));expect(left).toHaveLength(right.length);
 for(let i=0;i<left.length;i++){const path=rec(f(left[i],2n),140n);if(uint(f(path,1n))===455n){expect(uint(f(path,2n))).toBe(1n);for(const [n,v]of left[i].fields)if(n!==4n)same(v,f(right[i],n));}else same(left[i],right[i]);}
 const qa=items(f(a,15n),'list'),qb=items(f(b,15n),'list');expect(qa).toHaveLength(qb.length);
 for(let i=0;i<qa.length;i++)for(const n of[2n,3n,4n])same(f(rec(qa[i],484n),n),f(rec(qb[i],484n),n));
}
function paired(a:Run,b:Run,from=0){
 const x=view(a),y=view(b);expect(x.s.clock).toBe(y.s.clock);bytes(cognitiveState(a),cognitiveState(b));same(list(safeRows(a)),list(safeRows(b)));expect(x.tr).toHaveLength(y.tr.length);let draws=0;
 for(let i=from;i<x.tr.length;i++){const ta=x.tr[i],tb=y.tr[i];expect(key(f(event(ta),5n))).toBe(key(f(event(tb),5n)));
  if(key(f(event(ta),5n))===key(BODY_SAMPLE))sampleBoundary(ta,tb);
  else if(!isPhysical(ta)){
   for(const read of items(f(ta,11n),'list'))expect(uint(f(rec(f(rec(read,147n),2n),140n),1n)),'no cognitive direct physical read').not.toBe(455n);
   for(const [n,v]of ta.fields)if(n!==3n)same(v,f(tb,n));
  }else{same(f(ta,14n),f(tb,14n));expect(items(f(ta,14n),'list')).toHaveLength(0);}
  draws+=items(f(ta,14n),'list').length;
 }
 return {rows:x.tr.length,draws};
}
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
function probe(r:Run,status:string,upper?:number,exposure?:CanonicalValue){
 const v=view(r),a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)!;expect(a,'live appraisal10').toBeDefined();expect(a[5]).toEqual(text(status));
 const producer=v.tr.find(t=>at(f(event(t),2n))===10n&&key(f(t,13n))===key(list(a)))!;expect(producer).toBeDefined();expect(uint(f(event(producer),3n))).toBe(50n);
 const joint=items(items(a[7],'list')[1],'list'),sample=joint[2],sampleTrace=v.tr.find(t=>at(f(event(t),2n))===10n&&key(f(event(t),5n))===key(BODY_SAMPLE))!;expect(sampleTrace).toBeDefined();
 const reads=items(f(sampleTrace,11n),'list').map(v=>rec(v,147n)),bodyReads=reads.filter(v=>uint(f(rec(f(v,2n),140n),1n))===455n);
 if(status==='Known'){
  const s=rec(sample,461n),bounds=rec(f(s,5n),462n);expect(readQ(f(bounds,2n))).toEqual(Q.of(BigInt(upper!)));expect(a[6]).toEqual(list([exposure!,exposure!]));expect(bodyReads).toHaveLength(1);expect(uint(f(rec(f(bodyReads[0],2n),140n),2n))).toBe(1n);
  expect(kind(joint[3],227n)).toBe(true);expect(v.out.some(o=>key(o)===key(sample))).toBe(true);
  const selected=reports(r,'assembled-body-selection/0.1').find(v=>at(v[1])===10n)!;expect(selected).toBeDefined();expect(selected[4]).toEqual(text('Selected'));
  const concern=outputs(v.s.outputs,388n).find(c=>key(f(c,2n))===key(joint[1]));expect(concern,'actual concern consumer').toBeDefined();expect(outputs(v.s.outputs,408n).length,'actual evaluated reason stage').toBeGreaterThan(0);
 }else{expect(a[6]).toEqual(list([]));expect(sample).toEqual(list([]));expect(bodyReads).toHaveLength(0);expect(items(f(sampleTrace,15n),'list')).toHaveLength(0);expect(outputs(v.s.outputs,463n).some(o=>at(f(o,4n))===10n)).toBe(true);}
 return {a,producer,sampleTrace};
}
function deniedSamples(r:Run){
 const samples=view(r).tr.filter(t=>key(f(event(t),5n))===key(BODY_SAMPLE));
 expect(samples.map(t=>at(f(event(t),2n)))).toEqual([10n,26n]);
 for(const t of samples){
  for(const read of items(f(t,11n),'list'))expect(uint(f(rec(f(rec(read,147n),2n),140n),1n)),'every denied/unavailable sample excludes physical reads').not.toBe(455n);
  expect(items(f(t,15n),'list')).toHaveLength(0);
  const published=items(f(t,13n),'list');expect(published).toHaveLength(1);expect(kind(published[0],463n)).toBe(true);
 }
}
function consequence(r:Run,p:ReturnType<typeof probe>,expected:number){
 const out=reports(r,STRESS+'/applied').find(v=>at(v[1])===11n)!;expect(out,'live physical consumer11').toBeDefined();const packet=items(out[2],'list');expect(packet[4]).toEqual(list(p.a));expect(packet[3]).toEqual(f(event(p.producer),1n));expect(at(packet[2])).toBe(10n);
 expect(stressAnchor(out[4])).toEqual({at:11n,level:expected});expect(stressAnchor(view(r).st.read(stressPath(C)).value!)).toEqual({at:11n,level:expected});return out;
}
function originalSample(r:Run,initial:number,width:number){
 const p=probe(r,'Known',width===20?60:50,width===20?q(7,20):q(3,8)),quant=rec(items(f(p.sampleTrace,15n),'list')[0],484n);
 const original=createStoredBody(Q.of(BigInt(initial)),Q.of(1n)).sample(10n,Q.of(BigInt(width)),true),bin=reserveBin(original.level,Q.of(100n),Q.of(BigInt(width)));
 expect(readQ(f(quant,1n))).toEqual(original.level);const observed=rec(items(items(p.a[7],'list')[1],'list')[2],461n),bounds=rec(f(observed,5n),462n);
 expect([readQ(f(bounds,1n)),readQ(f(bounds,2n))]).toEqual([bin.lower,bin.upper]);expect(original.mediated.kind).toBe('Known');
 return p;
}
it('final181 original hidden biology histories',async()=>{
 for(let seed=0;seed<8;seed++){const a=regulatoryCase('HiddenA'),b=regulatoryCase('HiddenB'),x=createBiologicalRun(a.law,a.frames,a.config,seed),y=createBiologicalRun(b.law,b.frames,b.config,seed);
  for(let i=0;i<12;i++){expect(await x.step()).toBe(true);expect(await y.step()).toBe(true);expect(x.observerView()).toEqual(y.observerView());expect(x.snapshot().world).not.toEqual(y.snapshot().world);}expect(await x.step()).toBe(false);expect(await y.step()).toBe(false);
 }
 console.info('M181 ORIGINAL PASS HiddenA/B eight seeds/full12: identical entire observer histories, different physical worlds. Reserve source correspondence checked on actual native samples separately.');
});
it('final181 alias and permitted resolution reach physical stress',async()=>{
 const a=await startMemory(fixture('alias51')),b=await startMemory(fixture('alias59')),fine=await startMemory(fixture('fine51'));
 expect(a.b.s).toEqual(b.b.s);bytes(a.b.d.orderedInputs,b.b.d.orderedInputs);bytes(a.b.d.initialState,fine.b.d.initialState);
 let cursor=0,draws=0;
 for(let n=0;a.run.snapshot().clock<10n;n++){expect(n).toBeLessThan(96);for(const r of[a.run,b.run,fine.run])expect(await r.settleNextInstant()).toBe(true);const checked=paired(a.run,b.run,cursor);cursor=checked.rows;draws+=checked.draws;}
 const x=originalSample(a.run,51,20),y=originalSample(b.run,59,20),z=originalSample(fine.run,51,10);expect(x.a).toEqual(y.a);
 expect(view(a.run).st.read({rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]})).not.toEqual(view(b.run).st.read({rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]}));
 for(const r of[a.run,b.run,fine.run])await through(r,11n);consequence(a.run,x,175);consequence(b.run,y,175);consequence(fine.run,z,188);
 let checked=paired(a.run,b.run,cursor);cursor=checked.rows;draws+=checked.draws;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);checked=paired(a.run,b.run,cursor);cursor=checked.rows;draws+=checked.draws;if(!more)break;if(n===95)throw Error('M181 pair cap');}
 await finish(fine.run);expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,b.run])expect(r.diagnostic()).toBeUndefined();
 console.info('M181 ALIAS PASS true41/49 -> interval40..60 -> U7/20 -> stress175; fine true41 ->40..50 -> U3/8 ->stress188. Whole safe cognition/full nonphysical trace equality through101; matched draws='+draws+'; rows='+cursor+'.');
},550000);
it('final181 hidden stress cannot bypass its absent sensory channel',async()=>{
 const a=await startMemory(fixture()),b=await startMemory(fixture('stress200'));expect(a.b.s).toEqual(b.b.s);bytes(a.b.d.orderedInputs,b.b.d.orderedInputs);let cursor=0,draws=0,compared=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);const checked=paired(a.run,b.run,cursor);cursor=checked.rows;draws+=checked.draws;
  if(more&&a.run.snapshot().clock===10n){probe(a.run,'Known',60,q(7,20));probe(b.run,'Known',60,q(7,20));}
  if(more&&a.run.snapshot().clock===11n){consequence(a.run,probe(a.run,'Known',60,q(7,20)),175);consequence(b.run,probe(b.run,'Known',60,q(7,20)),176);compared=true;}
  if(!more)break;if(n===95)throw Error('M181 hidden stress cap');
 }
 expect(compared).toBe(true);expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,b.run])expect(r.diagnostic()).toBeUndefined();
 console.info('M181 STRESS PRIVACY PASS initial0/200 -> physical175/176 at11, identical whole safe cognition through101; no stress sensing claimed; matched draws='+draws+'.');
},550000);
it('final181 denied and unavailable physical states',async()=>{
 const a=await startMemory(fixture('denied51')),b=await startMemory(fixture('denied59')),unavailable=await startMemory(fixture('unavailable51'));let cursor=0,draws=0,compared=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[b.run,unavailable.run])expect(await r.settleNextInstant()).toBe(more);const checked=paired(a.run,b.run,cursor);cursor=checked.rows;draws+=checked.draws;bytes(cognitiveState(a.run),cognitiveState(unavailable.run));same(list(safeRows(a.run)),list(safeRows(unavailable.run)));
  if(more&&a.run.snapshot().clock===10n)for(const r of[a.run,b.run,unavailable.run])probe(r,'Unavailable');
  if(more&&a.run.snapshot().clock===11n){consequence(a.run,probe(a.run,'Unavailable'),0);consequence(b.run,probe(b.run,'Unavailable'),1);consequence(unavailable.run,probe(unavailable.run,'Unavailable'),0);compared=true;}
  if(!more)break;if(n===95)throw Error('M181 denied cap');
 }
 expect(compared).toBe(true);expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,b.run,unavailable.run]){expect(r.diagnostic()).toBeUndefined();deniedSamples(r);}
 console.info('M181 DENIED PASS reserve51/59 and stress0/200 hidden through101; all samples10/26: no455 read, no quantization, actual appraisal10 Unknown; unavailable same safe view; matched draws='+draws+'.');
},550000);
it('final181 fine sensor repeat and public restore',async()=>{
 const a=await startMemory(fixture('fine51')),repeat=await startMemory(fixture('fine51'));for(const r of[a.run,repeat.run])await through(r,10n);exact(a.run,repeat.run);const p=originalSample(a.run,51,10);
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);let reached=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[repeat.run,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.run,r);}if(more&&a.run.snapshot().clock===11n){consequence(a.run,p,188);reached=true;}if(!more)break;if(n===95)throw Error('M181 continuation cap');}
 expect(reached).toBe(true);expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,repeat.run,restored])expect(r.diagnostic()).toBeUndefined();
 console.info('M181 CONTINUATION PASS independent repeat and public save10 match every subsequent full byte through101, including actual stress11=188.');
},550000);
