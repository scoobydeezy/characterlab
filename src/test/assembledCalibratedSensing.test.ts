/** M183 pland070ebb8: calibrated evidence drives existing appraisal and physical stress. */
import {it,expect} from 'vitest';
import {fixture} from './fixtures/assembledCalibratedSensing';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {decode,enc,items,key,list,text,u,q,C,rec,f,uint,bytes,outputs,exact,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {calibratedReserve,compileBodyDeclaration,CALIBRATED_SENSING,BODY_SAMPLE,BODY_DELIVERY} from '../assembled/body';
import {ACTION_BODY,ACTION_BODY_EVENT,ACTION_BODY_RECEIPT,ACTION_BODY_RECEIPT_EVENT} from '../assembled/actionBody';
import {SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
import {STRESS,STRESS_APPLY,stressAnchor,stressPath} from '../assembled/regulatoryStress';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {reserveBin} from '../campaign3/embodiedMath';
import {typedIdentifier,signed} from '../substrate/canonicalEncoding';
import {dataRecord as metadataRecord} from '../campaign2/canonicalData';
import {defaultConstitution,initialBiology,senseBiology} from '../campaign3/biologicalDynamics';
import {fixture as oldFixture} from './fixtures/assembledRegulatorySensing';
import * as oldSelection from '../campaign3/interoceptiveSelection';
import * as selection from '../assembled/interoceptiveSelection';
import {embodiedRecord} from '../campaign3/embodiedCodecs';
import {BODY_OBSERVER,BODY_CHANNEL} from '../assembled/body';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M183 time');return v.value;};
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
 expect(qa).toHaveLength(2);const ca=items(qa[0],'list'),cb=items(qb[0],'list');expect(ca).toHaveLength(5);for(const i of[0,2,3])same(ca[i],cb[i]);for(const n of[2n,3n,4n])same(f(rec(qa[1],484n),n),f(rec(qb[1],484n),n));
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

function declarations(b:ReturnType<typeof fixture>){
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(55);expect(items(slots[6],'list')).toHaveLength(8);
 const rows=items(slots[0],'set').filter(v=>kind(v,171n)).map(v=>metadataRecord(v,171n));
 const definition=(name:string)=>{const row=rows.find(r=>{const id=f(r,1n);return typeof id!=='boolean'&&id.kind==='typedIdentifier'&&typeof id.payload!=='boolean'&&id.payload.kind==='text'&&id.payload.value===name;});expect(row).toBeDefined();return f(row!,4n);};
 expect(f(metadataRecord(definition('definition/protocol-execution'),434n),1n)).toBe(false);
 const threat=items(slots[28],'list')[4],social=items(slots[19],'list');
 expect(items(social[1],'list').flatMap(v=>items(items(v,'list')[1],'list')).some(v=>key(items(v,'list')[0])===key(threat))).toBe(false);
 expect(b.d.runSeed).toEqual(new Uint8Array(32));
}
function calibratedProbe(r:Run,bias:number,raw:number,lower:number,upper:number,exposure:CanonicalValue){
 const p=probe(r,'Known',upper,exposure),operations=items(f(p.sampleTrace,15n),'list');expect(operations).toHaveLength(2);
 const calibration=items(operations[0],'list'),shifted=Math.max(0,Math.min(100,raw+bias/10));
 expect(calibration).toEqual([text(CALIBRATED_SENSING),q(raw,1),signed(bias),q(bias,10),q(shifted,1)]);
 const quant=rec(operations[1],484n);expect(readQ(f(quant,1n))).toEqual(Q.of(BigInt(shifted)));
 const sample=rec(items(items(p.a[7],'list')[1],'list')[2],461n);expect(f(sample,6n)).toEqual(text('embodied-level-observation/0.2-candidate'));expect(readQ(f(rec(f(sample,5n),462n),1n))).toEqual(Q.of(BigInt(lower)));
 const episodes=view(r).st.entries().filter(e=>e.path.rootStateTypeId===346n&&typeof e.value!=='boolean'&&e.value.kind==='list'&&e.value.items.some(v=>key(v)===key(sample)));
 expect(episodes.length,'actual shared episodic consumer').toBeGreaterThan(0);
 for(const t of view(r).tr){expect(items(f(t,14n),'list'),'deterministic causal comparison, no dice claim').toHaveLength(0);if(!isPhysical(t))for(const read of items(f(t,11n),'list'))expect(uint(f(rec(f(rec(read,147n),2n),140n),1n))).not.toBe(455n);}
 return p;
}
it('final183 arithmetic admission and visible declarations',async()=>{
 const b=fixture(),slots=items(decode(b.s.registry),'list'),body=items(slots[6],'list');declarations(b);
 for(const bias of[-1000,-200,0,200,1000])for(const level of[0,1,41,99,100]){
  const actual=calibratedReserve(Q.of(BigInt(level)),Q.of(100n),BigInt(bias)),c=defaultConstitution(),original=initialBiology(c);original.channels.stress.level=level*10;
  const observed=senseBiology(original,c,{resolution:200,denied:[],bias:{stress:bias}}).stress!;
  const clipped=Math.max(0,Math.min(1000,level*10+bias));expect(actual.level).toEqual(Q.of(BigInt(clipped),10n));
  const bin=reserveBin(actual.level,Q.of(100n),Q.of(20n));expect(bin.lower).toEqual(Q.of(BigInt(clipped===1000?80:observed/10)));if(bias===0)expect(actual.level).toEqual(Q.of(BigInt(level)));
 }
 expect(calibratedReserve(Q.of(1n,3n),Q.of(5n,2n),1n)).toEqual({offset:Q.of(1n,400n),level:Q.of(403n,1200n)});
 for(const value of[signed(-1001),signed(1001),q(1,2),u(1),true])expect(()=>compileBodyDeclaration(list([...body.slice(0,7),value]),true)).toThrow(/calibration/);
 expect(()=>compileBodyDeclaration(list(body.slice(0,7)),true)).toThrow();expect(()=>compileBodyDeclaration(list([...body,signed(0)]),true)).toThrow();
 expect(()=>compileBodyDeclaration(slots[6])).toThrow();expect(()=>compileBodyDeclaration(items(decode(oldFixture().s.registry),'list')[6],true)).toThrow();
 for(const [source,registry]of[[b.s,oldFixture().s.registry],[oldFixture().s,b.s.registry]] as const)await expect(prepareCharacterModel({...source,registry})).rejects.toThrow(/body declaration/);
 const v1='embodied-level-observation/0.1-candidate',v2='embodied-level-observation/0.2-candidate';
 const sample=(version:string,present:boolean)=>embodiedRecord(present?461:463,[typedIdentifier(1115,u(1)),BODY_OBSERVER,BODY_CHANNEL,signed(10),...(present?[embodiedRecord(462,[q(60,1),q(80,1)])]:[]),text(version)]);
 for(const present of[true,false])for(const capacity of[0,1,2]){
  const original=oldSelection.selectInteroceptiveSamples([sample(v1,present)],capacity),old=selection.selectInteroceptiveSamples([sample(v1,present)],capacity,v1),next=selection.selectInteroceptiveSamples([sample(v2,present)],capacity,v2);
  expect(next.audit).toEqual(original.audit);expect(old.audit).toEqual(original.audit);expect(selection.consumeInteroceptiveSelection(old.view)).toEqual(oldSelection.consumeInteroceptiveSelection(original.view));
  expect(selection.consumeInteroceptiveSelection(next.view)).toEqual(present&&capacity?[sample(v2,true)]:[]);expect(()=>selection.consumeInteroceptiveSelection(next.view)).toThrow();
 }
 expect(()=>selection.selectInteroceptiveSamples([sample(v1,true)],1,v2)).toThrow(/version/);expect(()=>selection.selectInteroceptiveSamples([sample(v2,true)],1,v1)).toThrow(/version/);expect(()=>oldSelection.selectInteroceptiveSamples([sample(v2,true)],1)).toThrow(/version/);
 console.info('M183 ARITHMETIC PASS 25 original normalized sensor comparisons, explicit cap endpoint, zero calibration, exact off-lattice extension; original/successor capacities0/1/2 and unavailable/one-use agree; invalid domains/version mixing reject; declarations seed0/threat nonsocial/protocol execution disabled.');
},550000);
it('final183 calibrated evidence changes actual appraisal and stress with exact continuation',async()=>{
 const a=await startMemory(fixture(200)),b=await startMemory(fixture(-200)),repeat=await startMemory(fixture(200));
 declarations(a.b);declarations(b.b);bytes(a.b.d.initialState,b.b.d.initialState);bytes(a.b.d.orderedInputs,b.b.d.orderedInputs);
 for(const r of[a.run,b.run,repeat.run])await through(r,10n);exact(a.run,repeat.run);
 const x=calibratedProbe(a.run,200,41,60,80,q(3,10)),y=calibratedProbe(b.run,-200,41,20,40,q(2,5));
 const physical=(r:Run)=>enc(new AuthoritativeState(view(r).st.entries().filter(e=>e.path.rootStateTypeId===455n)).canonicalValue());bytes(physical(a.run),physical(b.run));
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);let reached=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[repeat.run,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.run,r);}expect(await b.run.settleNextInstant()).toBe(more);
  if(more&&a.run.snapshot().clock===11n){consequence(a.run,x,150);consequence(b.run,y,200);reached=true;}if(!more)break;if(n===95)throw Error('M183 cap');}
 expect(reached).toBe(true);for(const r of[a.run,b.run,repeat.run,restored]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
 console.info('M183 NATIVE PASS same physical41, biases+200/-200 -> calibrated61/21 -> intervals60..80/20..40 -> actual U3/10 vs2/5 -> authenticated stress11=150/200. Shared episodic consumer; independent repeat/public save10 exact every byte through101.');
},550000);
it('final183 calibrated aliases preserve the entire safe cognition',async()=>{
 const a=await startMemory(fixture(200)),b=await startMemory(fixture(200,'alias59'));expect(a.b.s).toEqual(b.b.s);let cursor=0,draws=0,reached=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);const checked=paired(a.run,b.run,cursor);cursor=checked.rows;draws+=checked.draws;
  if(more&&a.run.snapshot().clock===10n){calibratedProbe(a.run,200,41,60,80,q(3,10));calibratedProbe(b.run,200,49,60,80,q(3,10));reached=true;}if(!more)break;if(n===95)throw Error('M183 alias cap');}
 expect(reached).toBe(true);for(const r of[a.run,b.run]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
 console.info('M183 PRIVACY PASS raw41/49, calibrated61/69, same60..80 interval; entire safe state/output and nonphysical trace equal through101; matched draws='+draws+'.');
},550000);
it('final183 calibration never bypasses denied or unavailable evidence',async()=>{
 const a=await startMemory(fixture(200,'denied51')),b=await startMemory(fixture(-200,'unavailable51'));let reached=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);bytes(cognitiveState(a.run),cognitiveState(b.run));same(list(safeRows(a.run)),list(safeRows(b.run)));
  if(more&&a.run.snapshot().clock===10n)for(const r of[a.run,b.run])probe(r,'Unavailable');
  if(more&&a.run.snapshot().clock===11n){for(const r of[a.run,b.run])consequence(r,probe(r,'Unavailable'),0);reached=true;}if(!more)break;if(n===95)throw Error('M183 unknown cap');}
 expect(reached).toBe(true);for(const r of[a.run,b.run]){deniedSamples(r);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
 console.info('M183 UNKNOWN PASS denied+200/unavailable-200: no physical reads or sensor arithmetic at10/26, unknown actual appraisal and zero new impulse; same safe cognition through101.');
},550000);
