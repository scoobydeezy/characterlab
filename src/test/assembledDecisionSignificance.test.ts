import {it,expect} from 'vitest';
import {list,text,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ComparisonDrawMap,type RandomAddress} from '../substrate/random';
import {comparisonRoles} from '../assembled/comparison';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,target,other} from './fixtures/assembledDecisionSignificance';
import {snap,through,finish,exact,probability} from './fixtures/assembledAffectReceiving';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt,dataRecord as substrateRecord} from '../campaign2/canonicalData';
import {readQ,readDistribution} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {restoreAuthoritativeState} from '../substrate/state';
import {relationshipPath,relationshipHistory,relationshipFold,REL} from '../assembled/relationship';
import {sid} from '../assembled/skill';
import {C} from './fixtures/campaign2Cognitive';
import {INTERPRETED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
const decision=(r:Run)=>outputs(snap(r).outputs,409n).find(d=>signedValue(f(d,2n))===10n)!;
function mapFor(r:Run){
 const d=decision(r);expect(d).toBeDefined();const root=id(f(d,1n)),ns=items(f(rec(f(d,3n),408n),3n),'list');
 const addresses:RandomAddress[]=ns.map(v=>{const nk=rec(f(rec(v,407n),1n),404n),c=rec(f(nk,1n),395n);return {causalRootId:root,purposeId:sid(1042,'purpose/task-reason-face'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(nk,3n))}]};});
 expect(addresses).toHaveLength(2);
 addresses.push({causalRootId:root,purposeId:sid(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[addresses[0].subjectBindings[0]]});
 return new ComparisonDrawMap(addresses.map(a=>({localRandomAddress:a,comparisonDrawKey:{keyId:sid(10006,key(list([text('M81/decision10'),a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),comparisonRoleId:sid(10005,'assembled/'+txt(a.purposeId.payload).slice('purpose/'.length))}})),comparisonRoles);
}
let cached:Promise<ComparisonDrawMap[]>|undefined;
function maps(){return cached??=(async()=>{const out=[];for(const low of [true,false]){const b=fixture(low),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,10n);out.push(mapFor(r));}console.info('M81 identity-only maps prepared:2, result fields not read');return out;})();}
async function create(low=true,hidden=false,at=10n){const ms=await maps(),b=fixture(low,hidden,ms[low?0:1]),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,at);return {b,r};}
function projection(r:Run){
 const d=decision(r),status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'live resolved choice').toBe(3n);
 const data=rec(f(status,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const signal=(task:CanonicalValue,role:bigint)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===role;});
 const nucleus=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));expect(candidates).toHaveLength(2);expect(ns).toHaveLength(2);
 const A=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-one')))!,B=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')))!;
 expect(A).toBeDefined();expect(B).toBeDefined();
 for(const task of [taskA,taskB]){expect(signal(task,1n)).toHaveLength(1);expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(nucleus(task)).toHaveLength(1);}
 const traces=outputs(snap(r).trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===10n);
 const affect=traces.find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&uint(f(rec(f(t,4n),130n),3n))===80n);
 // Use emitted appraisal and final raw records; the relationship trace proves the intervening handoff.
 const a=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(SHARED_AFFECT_APPRAISAL))).map(v=>items(v,'list')).find(v=>uint(v[1])===10n);
 const relation=traces.find(t=>{const out=f(t,13n);return typeof out!=='boolean'&&out.kind==='list'&&out.items.length===2&&typeof out.items[1]!=='boolean'&&out.items[1].kind==='list'&&key(out.items[1].items[0])===key(text('assembled-relationship-people/0.1/appraisal'));});
 expect(relation,'actual relationship consumer').toBeDefined();
 const before=rec(items(f(relation!,12n),'list')[0],403n),after=rec(items(f(relation!,13n),'list')[0],403n);
 expect(affect,'actual affect->relationship handoff').toBeDefined();expect(f(affect!,13n)).toEqual(before);
 expect(f(after,3n),'relationship output reaches final reason compilation').toEqual(f(raw,3n));
 for(const person of [target,other]){
  const path=relationshipPath(C,person),state=restoreAuthoritativeState(decode(snap(r).state)),prior=state.read(path).value;
  for(const row of relationshipHistory(prior))expect(items(f(relation!,9n),'list')).toContainEqual(items(row,'list')[0]);
 }
 return {d,data,raw,ns,signal,nucleus,A,B,a};
}
function live(r:Run,low:boolean){
 const p=projection(r),state=restoreAuthoritativeState(decode(snap(r).state));
 expect(p.a,'live appraisal').toBeDefined();expect(txt(p.a![5])).toBe('Known');
 expect(p.a![6],'known zero threat').toEqual(list([q(0,1),q(0,1)]));
 for(const person of [target,other]){
  const prior=state.read(relationshipPath(C,person)).value,rows=relationshipHistory(prior);
  expect(rows,'own history liveness').toHaveLength(low?1:0);
  expect(relationshipFold(prior).rupture).toBe(low);
  if(low){const a=items(rows[0],'list');expect(a[2]).toEqual(person);expect(a[4]).toBe(true);expect(a[5]).toBe(true);expect(uint(a[6])).toBe(2n);}
 }
 for(const task of [taskA,taskB]){
  const n=p.nucleus(task)[0],roles=rec(f(n,2n),406n);
  expect(readDistribution(f(n,7n))).toEqual(new Map(Array.from({length:4},(_,i):[bigint,Q]=>[BigInt(i+1)+(low?-2n:0n),Q.of(1n,4n)])));
  expect(f(n,4n)).toEqual({kind:'unsigned',value:4n});expect(signedValue(f(n,5n))).toBe(low?-2n:0n);expect(signedValue(f(n,6n))).toBe(0n);
  expect(f(roles,1n)).toEqual(q(3,8));expect(f(roles,2n)).toEqual(q(low?-1:0,2));expect(f(roles,3n)).toEqual(q(0,1));
  const standing=p.signal(task,3n);expect(standing).toHaveLength(low?1:0);
  if(low){expect(f(standing[0],2n)).toEqual(q(-1,1));const basis=f(rec(f(standing[0],3n),400n),1n);expect(typeof basis!=='boolean'&&basis.kind==='map'&&basis.entries.length>0).toBe(true);}
 }
 expect(probability(p.data,p.A)).toEqual(Q.of(1n,2n));expect(probability(p.data,p.B)).toEqual(Q.of(1n,2n));
 expect(f(p.data,4n)).toEqual(q(1,1));expect(f(p.data,5n)).toEqual(q(low?1:5,2));expect(f(p.data,6n)).toEqual(low?q(1,3):q(5,7));expect(f(p.data,7n)).toEqual(f(p.data,6n));expect(uint(f(p.data,8n))).toBe(low?2n:3n);
 const transcript=outputs(snap(r).trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===10n).flatMap(t=>items(f(t,14n),'list'));
 const ds=items(f(p.data,9n),'list').map(v=>rec(v,422n));expect(ds).toHaveLength(2);
 for(const d of ds){expect(transcript).toContainEqual(f(d,5n));substrateRecord(f(randomDrawRecord(f(d,5n)),2n),113n);expect(uint(f(d,6n))).toBe(uint(f(randomDrawRecord(f(d,5n)),3n))+1n);expect(signedValue(f(d,7n))).toBe(BigInt(uint(f(d,6n)))+(low?-2n:0n));}
 // Require the actual relationship stage to have consumed both original histories.
 const reports=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-relationship-people/0.1/appraisal')));
 expect(reports.length).toBeGreaterThan(0);
 const report=items(reports.at(-1)!,'list').slice(1).map(v=>items(v,'list'));
 for(const person of [target,other])expect(report.find(a=>key(a[2])===key(person))![3]).toEqual(state.read(relationshipPath(C,person)).value??list([]));
 return {p,ds};
}
function coupled(a:ReturnType<typeof live>,b:ReturnType<typeof live>){
 const compact=(v:CanonicalValue)=>{const d=randomDrawRecord(v);return list([f(d,2n),f(d,3n),f(d,4n)]);};
 expect(a.ds.map(d=>compact(f(d,5n)))).toEqual(b.ds.map(d=>compact(f(d,5n))));
 expect(a.ds.map(d=>f(d,6n))).toEqual(b.ds.map(d=>f(d,6n)));
 const at=rec(f(a.p.data,10n),423n),bt=rec(f(b.p.data,10n),423n);expect(f(at,1n)).toEqual(f(bt,1n));
 if(uint(f(at,1n))===2n){expect(f(at,2n)).toEqual(f(bt,2n));expect(compact(f(at,3n))).toEqual(compact(f(bt,3n)));}
 expect(f(a.p.data,1n)).toEqual(f(b.p.data,1n));
 let wins=0;for(let x=1;x<=4;x++)for(let y=1;y<=4;y++)for(let tie=0;tie<2;tie++){const low=x-2>y-2?0:x-2<y-2?1:tie,high=x>y?0:x<y?1:tie;expect(low).toBe(high);if(low===0)wins++;}expect(wins).toBe(16);
}
it('M81 pair: same balance and authoritative dice, different significance and mode',async()=>{
 const a=await create(true),b=await create(false);expect(a.b.s).toEqual(b.b.s);
 const low=live(a.r,true),high=live(b.r,false);coupled(low,high);
 console.info('M81 MATCHED PASS pA=1/2 both; contest1; stake1/3 ->5/7; QuietRoll ->PlayerFacingRoll;2 shared reason draws, identical faces and winner;32/32 enumerated winners agree');
 for(const x of [a,b]){const old=decision(x.r);await finish(x.r);expect(outputs(snap(x.r).outputs,409n)).toContainEqual(old);}
},540000);
it('M81 hidden: same permitted encounters preserve cognition and resolution',async()=>{
 const a=await create(true),b=await create(true,true);const x=live(a.r,true),y=live(b.r,true);expect(x.p.d).toEqual(y.p.d);expect(snap(a.r).state).toEqual(snap(b.r).state);
 expect(x.ds).toEqual(y.ds);await finish(a.r);await finish(b.r);expect(snap(a.r).state).toEqual(snap(b.r).state);
 console.info('M81 HIDDEN PASS matched cognition and actual decision/draw records');
},540000);
it('M81 persistence: exact repeat and restore before decision through terminal',async()=>{
 const a=await create(true,false,9n),b=await create(true,false,9n);exact(a.r,b.r);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 for(const at of [10n,11n]){for(const r of [a.r,b.r,restored])await through(r,at);exact(a.r,b.r);exact(a.r,restored);}
 for(const r of [a.r,b.r,restored])await finish(r);exact(a.r,b.r);exact(a.r,restored);
 console.info('M81 CONTINUATION PASS state/output/trace/save/run identity9->10->11->101');
},540000);
