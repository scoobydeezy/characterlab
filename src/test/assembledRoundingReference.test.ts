import {REASON_SOURCES} from '../assembled/reasons';
import {CONTEXT_EVIDENCE} from '../assembled/reasonEvidence';
/** M104 plan97b6ef28: unchanged M81 personal breaches, seed0, full calendar.
 * Only model/registry0.84 versus0.85 differs; no source/calibration amendment. */
import {it,expect} from 'vitest';
import {fixture,target,other} from './fixtures/assembledDecisionSignificance';
import {snap,through,finish} from './fixtures/assembledAffectReceiving';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {ROUNDING_RULES,ROUNDING_REGISTRY,WITNESS_RULES,WITNESS_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {receivingRecord as rec,randomDrawRecord,decodeCognitive as decode} from '../assembled/codecs';
import {comparisonRoles} from '../assembled/comparison';
import {ROUNDING_SPAN,STANDING_ROUNDING_VERSION} from '../assembled/standingRounding';
import {relationshipPath,relationshipHistory,relationshipFold} from '../assembled/relationship';
import {restoreAuthoritativeState} from '../substrate/state';
import {ComparisonDrawMap,type RandomAddress} from '../substrate/random';
import {list,text,signed,rational as q,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {sid} from '../assembled/skill';
import {C} from './fixtures/campaign2Cognitive';
const frame=(run:Run)=>{
 const d=outputs(snap(run).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;
 expect(d).toBeDefined();const status=rec(f(d,4n),419n);expect(uint(f(status,1n))).toBe(3n);
 const context=rec(f(d,3n),408n),data=rec(f(status,2n),420n);
 return {d,data,raw:rec(f(context,2n),403n),ns:items(f(context,3n),'list').map(v=>rec(v,407n)),ds:items(f(data,9n),'list').map(v=>rec(v,422n))};
};
function mapping(run:Run){
 // Only occurrence/subject identities determine coupling, never scores or winners.
 const p=frame(run),root=id(f(p.d,1n)),addresses:RandomAddress[]=p.ns.map(n=>{
  const k=rec(f(n,1n),404n),a=rec(f(k,1n),395n);
  return {causalRootId:root,purposeId:sid(1042,'purpose/task-reason-face'),drawIndex:0n,subjectBindings:[
   {subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(a,1n))},
   {subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(a,2n))},
   {subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]};
 });
 expect(addresses).toHaveLength(2);
 addresses.push({causalRootId:root,purposeId:sid(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[addresses[0].subjectBindings[0]]});
 return new ComparisonDrawMap(addresses.map(a=>({localRandomAddress:a,comparisonDrawKey:{
  keyId:sid(10006,key(list([text('M104/integer10'),a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),
  comparisonRoleId:sid(10005,'assembled/'+txt(a.purposeId.payload).slice(8))}})),comparisonRoles);
}
async function create(candidate:boolean,map?:ComparisonDrawMap){
 const b=fixture(true,false,map),slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(44);
 const s={...b.s,registry:enc(list([...slots,list([text(REASON_SOURCES),list([])]),list([text(CONTEXT_EVIDENCE),list([])])])),rulesVersion:candidate?ROUNDING_RULES:WITNESS_RULES,registrySchemaVersion:candidate?ROUNDING_REGISTRY:WITNESS_REGISTRY};
 const run=await createCharacterRun(await prepareCharacterModel(s),b.d);await through(run,10n);return run;
}
function live(run:Run,candidate:boolean){
 const p=frame(run),state=restoreAuthoritativeState(decode(snap(run).state));
 expect(p.ns).toHaveLength(2);expect(p.ds).toHaveLength(2);
 const traces=outputs(snap(run).trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===10n);
 const relation=traces.find(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'&&v.items.length===2&&typeof v.items[1]!=='boolean'&&v.items[1].kind==='list'&&key(v.items[1].items[0])===key(text('assembled-relationship-people/0.1/appraisal'));});
 expect(relation,'relationship source actually consumed').toBeDefined();
 const afterRelationship=rec(items(f(relation!,13n),'list')[0],403n);
 const receiving=traces.find(t=>key(f(t,5n))===key(sid(1036,'seam/assembled-reason-sources'))&&key(f(t,13n))===key(p.raw));
 expect(receiving,'source stage consumes actual relationship output').toBeDefined();
 const receivingInput=items(f(receiving!,12n),'list');
 expect(f(rec(receivingInput[0],403n),3n)).toEqual(f(afterRelationship,3n));
 expect(items(receivingInput[2],'list')[0]).toEqual(text('assembled-priority-motive/0.1'));
 const beforeSources=items(f(afterRelationship,3n),'set').map(v=>rec(v,402n));
 for(const v of items(f(p.raw,3n),'set')){
  const signal=rec(v,402n),prior=beforeSources.find(x=>key(f(x,1n))===key(f(signal,1n)));
  expect(prior).toBeDefined();expect(f(signal,2n)).toEqual(f(prior!,2n));
  if(uint(f(rec(f(signal,1n),401n),3n))!==1n)expect(signal).toEqual(prior);
 }
 for(const person of [target,other]){
  const value=state.read(relationshipPath(C,person)).value,history=relationshipHistory(value);
  expect(history).toHaveLength(1);expect(relationshipFold(value).rupture).toBe(true);
  expect(items(f(relation!,9n),'list')).toContainEqual(items(history[0],'list')[0]);
 }
 const sources=items(f(p.raw,3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n);
 expect(sources).toHaveLength(2);for(const v of sources)expect(f(rec(v,402n),2n)).toEqual(q(-1,1));
 for(const n of p.ns){
  const roles=rec(f(n,2n),406n);expect(f(roles,1n)).toEqual(q(3,8));expect(f(roles,2n)).toEqual(q(-1,2));
  expect(uint(f(n,4n))).toBe(4n);expect(f(n,5n)).toEqual(signed(-2));expect(f(n,6n)).toEqual(signed(0));
  if(candidate){expect(n.schema.schemaVersion).toBe(3n);expect(f(n,9n)).toEqual(signed(-2));expect(uint(f(n,10n))).toBe(0n);}
 }
 expect(items(f(p.data,2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([q(1,2),q(1,2)]);
 expect(f(p.data,4n)).toEqual(q(1,1));expect(f(p.data,5n)).toEqual(q(1,2));
 expect(f(p.data,6n)).toEqual(q(1,3));expect(f(p.data,7n)).toEqual(q(1,3));expect(uint(f(p.data,8n))).toBe(2n);
 for(const d of p.ds){expect(signedValue(f(d,7n))).toBe(uint(f(d,6n))-2n);if(candidate){expect(items(f(d,9n),'list')).toHaveLength(0);expect(f(d,10n)).toEqual(signed(-2));}}
 const trace=traces.find(t=>key(f(t,13n))===key(p.d))!;expect(trace).toBeDefined();
 const draws=items(f(trace,14n),'list').map(randomDrawRecord);
 expect(draws.slice(0,2)).toEqual(p.ds.map(d=>randomDrawRecord(f(d,5n))));
 expect(draws.every(d=>uint(f(d,4n))!==ROUNDING_SPAN)).toBe(true);
 if(candidate)expect(f(trace,6n)).toEqual(text(STANDING_ROUNDING_VERSION));
 const executed=outputs(snap(run).outputs,433n).map(o=>{
  const attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);
  return f(intent,2n);
 });
 expect(executed.some(d=>key(d)===key(p.d)),'actual execution consumes decision').toBe(true);
 return p;
}
const drawSemantic=(v:CanonicalValue)=>{const d=randomDrawRecord(v);return list([f(d,2n),f(d,3n),f(d,4n)]);};
it('M104 integer relationship standing preserves coupled decision semantics on0.85',async()=>{
 const setupOld=await create(false),setupNew=await create(true),oldMap=mapping(setupOld),newMap=mapping(setupNew);
 const old=await create(false,oldMap),fresh=await create(true,newMap),a=live(old,false),b=live(fresh,true);
 expect(a.raw).toEqual(b.raw);
 expect(a.ns.map(n=>Array.from({length:8},(_,i)=>f(n,BigInt(i+1))))).toEqual(b.ns.map(n=>Array.from({length:8},(_,i)=>f(n,BigInt(i+1)))));
 for(const i of [1n,2n,3n,4n,5n,6n,7n,8n])expect(f(a.data,i)).toEqual(f(b.data,i));
 expect(a.ds.map(d=>drawSemantic(f(d,5n)))).toEqual(b.ds.map(d=>drawSemantic(f(d,5n))));
 expect(a.ds.map(d=>[f(d,6n),f(d,7n)])).toEqual(b.ds.map(d=>[f(d,6n),f(d,7n)]));
 const at=rec(f(a.data,10n),423n),bt=rec(f(b.data,10n),423n);expect(f(at,1n)).toEqual(f(bt,1n));
 if(uint(f(at,1n))===2n){expect(drawSemantic(f(at,3n))).toEqual(drawSemantic(f(bt,3n)));expect(f(at,4n)).toEqual(f(bt,4n));}
 for(const run of [setupOld,setupNew,old,fresh])await finish(run);
 console.info('M104 PASS actual two relationship histories -> standing-1/2 -> integer-2;0.84/0.85 raw+all old nucleus fields+probabilities+mode+coupled score/winner equal;2 matched face draws;zero rounding draws;all4 calendars exhausted101');
},570000);
