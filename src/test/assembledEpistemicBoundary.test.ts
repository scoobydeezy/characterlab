/** M113 plan4bf44214: current-reference saturated delivery boundary.
 * Nonsocial M106 tasks, normal channels, seed0. Only body rate/initial/delivery
 * are scenario parameters. No authored psychological state or alternate pipeline. */
import {it,expect} from 'vitest';
import {fixture as prior,learned,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,signedValue,bytes,type Run,type CanonicalValue} from './fixtures/assembledBiography';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {FEEDBACK_RULES,FEEDBACK_REGISTRY} from '../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {record} from '../substrate/canonicalEncoding';
import {BODY_DELIVERY,BODY_SELECTION_REPORT} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {isBodyEpisodePath} from '../assembled/memory';
import {C} from './fixtures/campaign2Cognitive';
import {embodiedRecord} from '../campaign3/embodiedCodecs';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';

function fixture(reserve:number,amount:number){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')];
 const index=slots.findIndex(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-body/0.1')));
 expect(index).toBeGreaterThanOrEqual(0);
 const body=[...items(slots[index],'list')];expect(body[1]).toEqual(q(100,1));expect(body[3]).toEqual(q(1,1));body[2]=q(0,1);slots[index]=list(body);
 let count=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];
  if(key(row[2])===key(BODY_DELIVERY)){expect(row[0]).toEqual(signed(9));expect(items(row[3],'list')[0]).toEqual(C);row[3]=list([C,q(amount,1)]);count++;}
  return list(row);
 });expect(count).toBe(1);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:embodiedRecord(454,[q(reserve,1),signed(0)])}:e));
 return {s:{...b.s,rulesVersion:FEEDBACK_RULES,registrySchemaVersion:FEEDBACK_REGISTRY,registry:enc(list(slots))},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
const isRecord=(v:CanonicalValue,type:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type;
const rows=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const truth=(r:Run)=>outputs(r.snapshot().outputs,479n);
const reports=(r:Run,label:string)=>rows(r).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const same=(a:CanonicalValue,b:CanonicalValue)=>bytes(enc(a),enc(b));
const scalar=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const exact=(a:Run,b:Run)=>{const x=a.snapshot(),y=b.snapshot();expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace']as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());};
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
function noPhysicalReceipt(v:CanonicalValue):void{
 if(typeof v==='boolean')return;
 if(v.kind==='record'){expect(v.schema.typeId,'truth receipt cannot enter cognitive data').not.toBe(479n);for(const x of v.fields.values())noPhysicalReceipt(x);}
 else if(v.kind==='list'||v.kind==='set')v.items.forEach(noPhysicalReceipt);
 else if(v.kind==='map')v.entries.forEach(([k,x])=>{noPhysicalReceipt(k);noPhysicalReceipt(x);});
 else if(v.kind==='typedIdentifier')noPhysicalReceipt(v.payload);
}
function projection(t:CanonicalValue){
 const r=rec(t,160n),delivery=key(f(event(r),5n))===key(BODY_DELIVERY);
 // Only the common run-identity field and the declared truth source projections
 // differ. Every read, RNG record, state patch, owner and child remains compared.
 return record(r.schema,new Map([...r.fields].filter(([k])=>k!==3n&&!(delivery&&[4n,12n,13n].includes(k)))));
}
function compare(a:Run,b:Run){
 const x=a.snapshot(),y=b.snapshot();expect([x.clock,x.status]).toEqual([y.clock,y.status]);bytes(x.state,y.state);
 const ax=rows(a).filter(v=>!isRecord(v,479n)),bx=rows(b).filter(v=>!isRecord(v,479n));same(list(ax),list(bx));
 const ta=outputs(x.trace,160n),tb=outputs(y.trace,160n);expect(ta.length).toBe(tb.length);
 for(let i=0;i<ta.length;i++){
  same(projection(ta[i]),projection(tb[i]));
  if(key(f(event(ta[i]),5n))===key(BODY_DELIVERY)){
   const e=event(ta[i]),other=event(tb[i]);same(record(e.schema,new Map([...e.fields].filter(([k])=>k!==6n))),record(other.schema,new Map([...other.fields].filter(([k])=>k!==6n))));
   expect(f(e,6n)).toEqual(list([C,q(10,1)]));expect(f(other,6n)).toEqual(list([C,q(80,1)]));
  }else for(const k of [12n,13n]){noPhysicalReceipt(f(ta[i],k));noPhysicalReceipt(f(tb[i],k));}
 }
 return {events:ta.length,draws:ta.flatMap(t=>items(f(t,14n),'list')).length};
}
function live(r:Run){
 const samples=outputs(r.snapshot().outputs,461n),sem=outputs(r.snapshot().outputs,227n),appraisals=reports(r,JOINT_APPRAISAL);
 expect(samples.length).toBeGreaterThan(0);expect(sem.length).toBeGreaterThan(0);expect(reports(r,BODY_SELECTION_REPORT).length).toBeGreaterThan(0);
 expect(appraisals.length).toBeGreaterThan(0);
 const current=appraisals.filter(a=>isRecord(a[2],461n));
 expect(current.length,'live body sample consumed by appraisal').toBeGreaterThan(0);
 for(const a of current){expect(samples.some(s=>key(s)===key(a[2]))).toBe(true);const factors=items(a[4],'list').map(v=>items(v,'list'));expect(factors.length).toBeGreaterThan(0);for(const row of factors){expect(row).toHaveLength(5);for(const x of row.slice(1))expect(typeof x!=='boolean'&&x.kind==='rational').toBe(true);}}
 const state=restoreAuthoritativeState(decode(r.snapshot().state));expect(state.entries().some(e=>isBodyEpisodePath(e.path))).toBe(true);
 const decisions=outputs(r.snapshot().outputs,409n);expect(decisions.length).toBeGreaterThanOrEqual(2);
 for(const d of decisions){expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);}
 expect(outputs(r.snapshot().outputs,433n).length).toBeGreaterThanOrEqual(2);
 const formation=learned(r);expect(formation.journal.length).toBeGreaterThan(0);
 return {samples:samples.length,experiences:sem.length,appraisals:current.length,decisions:decisions.length,qualifications:formation.journal.length,
  stateRoots:[...new Set(state.entries().map(e=>String(e.path.rootStateTypeId)))],
  sampleIntervals:samples.map(s=>[String(signedValue(f(s,4n))),key(f(s,5n))])};
}
function manifest(a:ReturnType<typeof fixture>,b:ReturnType<typeof fixture>){
 expect(a.s).toEqual(b.s);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);
 const x=items(decode(a.d.orderedInputs),'list'),y=items(decode(b.d.orderedInputs),'list');expect(x.length).toBe(y.length);
 let differences=0;for(let i=0;i<x.length;i++){if(key(x[i])===key(y[i]))continue;differences++;const p=items(x[i],'list'),qv=items(y[i],'list');expect(p[2]).toEqual(BODY_DELIVERY);same(list(p.filter((_,i)=>i!==3)),list(qv.filter((_,i)=>i!==3)));expect(p[3]).toEqual(list([C,q(10,1)]));expect(qv[3]).toEqual(list([C,q(80,1)]));}expect(differences).toBe(1);
}
it('M113 saturated hidden overflow cannot reach current-character cognition',async()=>{
 const a=fixture(95,10),b=fixture(95,80);manifest(a,b);
 const model=await prepareCharacterModel(a.s),left=await createCharacterRun(model,a.d),right=await createCharacterRun(model,b.d),repeat=await createCharacterRun(model,a.d);
 let restored:Run|undefined;const settlements:string[]=[];
 for(let n=0;n<32;n++){
  const next=await left.settleNextInstant();expect(await right.settleNextInstant()).toBe(next);
  if(left.snapshot().clock<=10n){expect(await repeat.settleNextInstant()).toBe(next);exact(left,repeat);}
  if(restored){expect(await restored.settleNextInstant()).toBe(next);exact(left,restored);}
  const counts=compare(left,right),at=left.snapshot().clock;settlements.push(String(at)+(next?'':':exhausted'));
  if(at===10n&&!restored){restored=await restoreCharacterRun(a.s,{initialState:a.d.initialState,orderedInputs:a.d.orderedInputs,save:left.save()});exact(left,restored);}
  console.info('M113 equality '+JSON.stringify({at:String(at),next,...counts}));
  if(at===12n){console.info('M113 LIVE '+JSON.stringify(live(left)));live(right);}
  if(!next){expect(at).toBe(101n);break;}expect(n).toBeLessThan(31);
 }
 expect(restored).toBeDefined();expect(left.diagnostic()).toBeUndefined();expect(right.diagnostic()).toBeUndefined();
 const x=truth(left),y=truth(right);expect(x).toHaveLength(1);expect(y).toHaveLength(1);
 expect([1n,2n,3n,4n,5n].map(k=>f(x[0],k))).toEqual([95,10,5,5,100].map(n=>q(n,1)));
 expect([1n,2n,3n,4n,5n].map(k=>f(y[0],k))).toEqual([95,80,5,75,100].map(n=>q(n,1)));
 expect([1n,2n,3n,4n,5n].map(k=>readQ(f(x[0],k)).divide(Q.of(100n)))).toEqual([Q.of(19n,20n),Q.of(1n,10n),Q.of(1n,20n),Q.of(1n,20n),Q.of(1n)]);
 expect(left.runIdentity()).not.toEqual(right.runIdentity());
 console.info('M113 SATURATION PASS '+JSON.stringify({settlements,left:[1n,2n,3n,4n,5n].map(k=>scalar(f(x[0],k))),right:[1n,2n,3n,4n,5n].map(k=>scalar(f(y[0],k))),...compare(left,right)}));
},550000);
it('M113 permitted evidence control changes live body appraisal',async()=>{
 const a=fixture(30,10),b=fixture(30,80);manifest(a,b);const model=await prepareCharacterModel(a.s),left=await createCharacterRun(model,a.d),right=await createCharacterRun(model,b.d);
 await through(left,9n);await through(right,9n);
 // Before the next sample, cognition is unchanged despite different physical state.
 same(list(rows(left).filter(v=>!isRecord(v,479n))),list(rows(right).filter(v=>!isRecord(v,479n))));
 await through(left,12n);await through(right,12n);const la=live(left),lb=live(right);
 const sx=outputs(left.snapshot().outputs,461n),sy=outputs(right.snapshot().outputs,461n);
 expect(sx.length).toBe(sy.length);
 const changed=sx.findIndex((s,i)=>key(s)!==key(sy[i]));expect(changed).toBeGreaterThanOrEqual(0);expect(signedValue(f(sx[changed],4n))).toBe(10n);
 const ax=reports(left,JOINT_APPRAISAL).find(a=>isRecord(a[2],461n)&&signedValue(f(rec(a[2],461n),4n))===10n)!;
 const ay=reports(right,JOINT_APPRAISAL).find(a=>isRecord(a[2],461n)&&signedValue(f(rec(a[2],461n),4n))===10n)!;
 expect(ax).toBeDefined();expect(ay).toBeDefined();expect(ax[4]).not.toEqual(ay[4]);
 console.info('M113 PERMITTED PASS '+JSON.stringify({firstSample:String(signedValue(f(sx[changed],4n))),left:la,right:lb,appraisalLeft:key(ax[4]),appraisalRight:key(ay[4])}));
},550000);
