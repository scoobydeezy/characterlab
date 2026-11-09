import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {validateMitigationPacket} from '../assembled/mitigation';
import {BODY_DELIVERY} from '../assembled/body';
import {POSITION_SOURCE} from '../assembled/positionPerception';
import {it,expect} from 'vitest';
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,type Cell} from './fixtures/assembledAffectFactorial';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {INTERPRETED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath,reappraisalKnowledge} from '../assembled/reappraisal';
import {bodyPath} from '../assembled/body';
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
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>f(rec(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n);
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

const str=(x:Q)=>x.numerator+'/'+x.denominator;
const bits=[0,1] as const;
const cells:Cell[]=bits.flatMap(p=>bits.flatMap(s=>bits.flatMap(v=>bits.map(c=>({p,s,v,c})))));
it('M74 declarations: each adjacent matrix pair changes exactly its declared source',()=>{
 const fs=cells.map(cell=>({cell,b:fixture(cell)}));
 for(const {cell,b:a}of fs)for(const axis of ['p','s','v','c'] as const){
  if(cell[axis])continue;const other={...cell,[axis]:1} as Cell,b=fs.find(x=>Object.keys(other).every(k=>other[k as keyof Cell]===x.cell[k as keyof Cell]))!.b;
  bytes(a.d.initialState,b.d.initialState);
  if(axis==='s'){
   bytes(a.d.orderedInputs,b.d.orderedInputs);
   expect({...a.s,registry:null}).toEqual({...b.s,registry:null});
   const left=[...items(decode(a.s.registry),'list')],right=[...items(decode(b.s.registry),'list')],ar=[...items(left[28],'list')],br=[...items(right[28],'list')];
   expect(ar[5]).toEqual(q(0,1));expect(br[5]).toEqual(q(1,1));br[5]=ar[5];right[28]=list(br);expect(right).toEqual(left);
  }else{
   expect(a.s).toEqual(b.s);const left=items(decode(a.d.orderedInputs),'list'),right=[...items(decode(b.d.orderedInputs),'list')];
   const diff=right.map((r,i)=>key(r)===key(left[i])?-1:i).filter(i=>i>=0);expect(diff).toHaveLength(1);
   const i=diff[0],l=items(left[i],'list'),r=[...items(right[i],'list')];expect(signedValue(r[0])).toBe(axis==='c'?6n:9n);
   const lp=items(l[3],'list'),rp=[...items(r[3],'list')];
   if(axis==='v'){expect(r[2]).toEqual(BODY_DELIVERY);expect(lp[1]).toEqual(q(0,1));expect(rp[1]).toEqual(q(90,1));rp[1]=lp[1];}
   else {expect(r[2]).toEqual(POSITION_SOURCE);const la=items(lp[3],'list'),ra=[...items(rp[3],'list')];expect(ra[7]).toBe(axis==='p');expect(la[7]).toBe(axis==='c');ra[7]=la[7];rp[3]=list(ra);}
   r[3]=list(rp);right[i]=list(r);expect(right).toEqual(left);
  }
 }
 console.info('M74 DECLARATIONS PASS32 single-factor edges; physical threat annex fixed across p/c; no injected estimates.');
});
function cellProof(r:Run,cell:Cell){
 const x=projection(r),provenance=items(x.a[7],'list'),v=Q.of(cell.v?19n:99n,100n),p=Q.of(BigInt(cell.p)),s=Q.of(BigInt(cell.s)),c=Q.of(BigInt(cell.c));
 expect(items(provenance[4],'list')).toEqual([q(cell.p,1),q(cell.s,1),q(v.numerator,v.denominator),q(cell.c,1)]);
 const k=knowledge(r);expect(k.efficacy!.cue!.mean!.equals(p)).toBe(true);expect(k.efficacy!.means.map(n=>str(n!))).toEqual(['1/1',cell.c?'0/1':'1/1']);
 expect(k.efficacy!.control!.equals(c)).toBe(true);expect(k.efficacy!.supports).toHaveLength(2);expect(k.efficacy!.cue!.supports).toHaveLength(1);
 for(const support of k.efficacy!.supports)expect(items(items(support,'list')[1],'list').map(p=>validateMitigationPacket(p).role)).toEqual(['Before','Motion','After']);
 expect(items(k.efficacy!.cue!.supports[0],'list').map(p=>validateMitigationPacket(p).glyph)).toEqual([0n,0n,0n]);
 const joint=items(provenance[1],'list'),sample=rec(joint[2],461n);expect(signedValue(f(sample,4n))).toBe(10n);expect(txt(items(joint[5],'list')[1])).toBe('Current');
 expect(items(provenance[8],'list').slice(0,2)).toEqual([q(100,1),q(cell.v?81:1,100)]);
 const E=p.multiply(s).multiply(Q.of(1n).add(v)).divide(Q.of(2n)),U=E.multiply(Q.of(1n).subtract(c)),H=E.multiply(Q.of(2n).subtract(c)).divide(Q.of(2n));
 expect(x.a[6]).toEqual(list([q(E.numerator,E.denominator),q(U.numerator,U.denominator)]));
 const factors={likelihood:p,severity:s,vulnerability:v,control:c};
 for(const [candidate,expected] of [['SplitExposure',[E,U]],['ScalarUncontrolled',[U]],['HistoricalProduct',[H]]] as const){
  const actual=compareAffectFactors(factors,candidate);expect(actual.status).toBe('Known');if(actual.status!=='Known')throw Error('live candidate');expect(actual.coordinates).toEqual(expected);
 }
 const nuclei=[x.nucleus(taskA)[0],x.nucleus(taskB)[0]];expect(nuclei.map(n=>uint(f(n,4n)))).toEqual([6n,6n]);expect(nuclei.map(n=>signedValue(f(n,5n)))).toEqual([0n,0n]);
 const positive=U.compare(Q.of(0n))>0;expect(nuclei.map(n=>signedValue(f(n,6n)))).toEqual([positive?3n:0n,0n]);
 for(const t of [taskA,taskB])expect(f(x.signal(t,1n)[0],2n)).toEqual(q(1,1));
 if(positive){expect(uint(f(x.data,8n))).toBe(1n);expect(f(x.data,1n)).toEqual(x.A);expect(x.signal(taskA,2n)).toHaveLength(1);expect(readQ(f(x.signal(taskA,2n)[0],2n))).toEqual(U);}
 else {expect(x.signal(taskA,2n)).toEqual([]);expect(uint(f(x.data,8n))).not.toBe(1n);expect(probability(x.data,x.A)).toEqual(Q.of(1n,2n));}
 const trace=outputs(snap(r).trace,160n),concern=trace.find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n&&signedValue(f(rec(f(t,4n),130n),2n))===10n)!;
 expect(concern,'actual concern receiver').toBeDefined();expect(items(f(concern,12n),'list')[1]).toEqual(list(x.a));
 const row=items(f(rec(f(concern,13n),388n),3n),'list').map(v=>rec(v,387n)).find(v=>key(f(v,1n))===key(taskA))!;
 expect(f(rec(f(row,2n),386n),2n)).toEqual(q(U.numerator,U.denominator));
 console.info('M74 CELL '+JSON.stringify({bits:cell,p:str(p),s:str(s),v:str(v),c:str(c),E:str(E),U:str(U),H:str(H),actualThreatProbability:positive?'1/1':'1/2',situation:positive?3:0,controlSupports:k.efficacy!.supports.length,cueSupports:k.efficacy!.cue!.supports.length}));
 return {x,E,U,H,knowledge:state(r).read(reappraisalPath(C))};
}
for(const p of bits)it('M74 matrix p'+p+': eight sourced cells and three candidate formulas',async()=>{
 const prefix=new Map<number,{state:Uint8Array;outputs:Uint8Array}>(),rows:{cell:Cell;result:ReturnType<typeof cellProof>}[]=[];
 for(const cell of cells.filter(c=>c.p===p)){
  const {r}=await create(cell,3n),at3=snap(r),before=prefix.get(cell.s);
  if(before){bytes(before.state,at3.state);bytes(before.outputs,at3.outputs);}else prefix.set(cell.s,{state:at3.state,outputs:at3.outputs});
  await through(r,10n);rows.push({cell,result:cellProof(r,cell)});
 }
 for(const row of rows.filter(x=>x.cell.s===0)){const other=rows.find(x=>x.cell.s===1&&x.cell.v===row.cell.v&&x.cell.c===row.cell.c)!;expect(row.result.knowledge).toEqual(other.result.knowledge);}
 if(p===1){
  const full=rows.filter(x=>x.cell.s===1&&x.cell.c===1);
  expect(full).toHaveLength(2);expect(full[0].result.U).toEqual(full[1].result.U);expect(full[0].result.E).not.toEqual(full[1].result.E);
  for(const x of full){expect(x.result.H.compare(Q.of(0n))).toBeGreaterThan(0);expect(x.result.U).toEqual(Q.of(0n));}
  const capped=rows.filter(x=>x.cell.s===1&&x.cell.c===0);expect(capped[0].result.U).not.toEqual(capped[1].result.U);expect(f(capped[0].result.x.data,1n)).toEqual(f(capped[1].result.x.data,1n));
  console.info('M74 preserved equal-U/different-E collision, HistoricalProduct residual at full control, and two distinct positive U values with identical saturated Auto response. No scalar receiver equivalence inferred.');
 }
 console.info('M74 MATRIX p'+p+' PASS8 native cells/24 candidate evaluations; actual sources and concern/reason/choice/execution live.');
},540000);
const primary:Cell={p:1,s:1,v:1,c:1};
it('M74 controls and continuation: hidden truth unknown control and exact restored run',async()=>{
 const a=await create(primary,9n),repeat=await createCharacterRun(a.m,a.b.d);await through(repeat,9n);exact(a.r,repeat);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 await through(a.r,10n);const base=cellProof(a.r,primary);
 const hidden=await create(primary,10n,'hidden'),h=cellProof(hidden.r,primary);expect(base.x.a).toEqual(h.x.a);expect(base.x.ns).toEqual(h.x.ns);expect(base.knowledge).toEqual(h.knowledge);
 const denied=await create(primary,10n,'denied'),d=projection(denied.r,'denied');expect(knowledge(denied.r).efficacy!.control).toBeUndefined();expect(d.a[6]).toEqual(list([]));expect(d.signal(taskA,2n)).toEqual([]);
 for(const r of [a.r,repeat,restored]){await through(r,10n);cellProof(r,primary);await finish(r);}exact(a.r,repeat);exact(a.r,restored);
 console.info('M74 CONTROLS PASS hidden annex invariant; denied Motion unknown control; primary repeat/restore9->101 exact state/output/trace/save/identity.');
},540000);
