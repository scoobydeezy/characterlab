import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode as enc,rational,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {compileMultisourceJoin as compile,executeMultisourceJoin as execute,type MultisourceJoinDeclaration,type MultisourceJoinProfile} from '../campaign3/multisourceSourceJoin';
import {createLocalReserveSource,type LocalReserveSource} from '../campaign3/localReserveSource';
import {receivingRecord as r} from '../campaign3/receivingCodecs';
import {def,id,taskKey,O,C,initialReceiving} from './receivingFixtures';
const q=(n:number)=>Q.of(BigInt(n));
function declaration():MultisourceJoinDeclaration{return {observer:O,holder:C,taskKey,taskSpec:id(1027,'definition/task-a'),taskInstruction:id(1027,'definition/task-instruction-two'),action:id(1027,'definition/protocol-contact-two'),bodyInstruction:id(1027,'definition/embodied-response-a'),workspaceId:id(1027,'definition/task-workspace'),workspaceDefinition:record((def('task-workspace') as Extract<CanonicalValue,{kind:'record'}>).schema,new Map((def('task-workspace') as Extract<CanonicalValue,{kind:'record'}>).fields).set(2n,unsigned(1)).set(3n,true).set(4n,false)),concernDefinition:def('task-concern'),motiveDefinition:r(392,[rational(1,4),true]),activeFrom:0n,deadline:100n,channels:['A','B','C'].map(k=>({channel:'channel/'+k,signal:'interoceptive-signal/'+k})),capacity:3,body:{signal:'interoceptive-signal/A',threshold:q(60)},task:{signal:'interoceptive-signal/A',threshold:q(60),direction:'FavorBelow'}};}
function source(amount=20,swapped=false){return createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(0),amount:q(amount),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+(swapped?({A:'B',B:'A',C:'C'}[k]):k),width:q(10),available:true,permitted:true})));}
const run=(d=declaration(),state=initialReceiving(),s=source(),at=45n)=>{let n=0n;return execute(compile(d),state,s,at,()=>n++);};
const altered=(root:bigint,field:bigint,value:CanonicalValue|undefined)=>new AuthoritativeState(initialReceiving().entries().flatMap(e=>e.path.rootStateTypeId===root&&e.path.fieldId===field?value===undefined?[]:[{...e,value}]:[e]));
it('produces both paths internally from four exact adoption/mapping reads without changing state',()=>{
 const state=initialReceiving(),before=enc(state.canonicalValue()),out=run(declaration(),state);
 expect(out.reads.map(x=>[x.path.rootStateTypeId,x.path.fieldId])).toEqual([[268n,1n],[373n,1n],[373n,2n],[487n,1n]]);
 expect(enc(state.canonicalValue())).toEqual(before);expect(out.result.at).toBe(45n);expect(out.sourceAudit.at).toBe(45n);
 expect(out.result.body.kind).toBe('Known');expect(out.result.task.kind).toBe('Known');expect(out.result.taskBase).not.toBeNull();
 expect(out.sourceAudit.staged).not.toBeNull();
});
it('rejects missing or foreign self mapping before any allocation',()=>{
 for(const state of[altered(268n,1n,undefined),altered(268n,1n,r(267,[id(1003,'character/foreign')]))]){
  let n=0;expect(()=>execute(compile(declaration()),state,source(),45n,()=>BigInt(n++))).toThrow('SELF');expect(n).toBe(0);
 }
});
it('rejects absent adoption, absent/rebound task plan and absent body adoption',()=>{
 expect(()=>run(declaration(),initialReceiving(['a'],false))).toThrow('INACTIVE_TASK');
 expect(()=>run(declaration(),altered(373n,1n,r(372,[unsigned(3)])))).toThrow('INACTIVE_TASK');
 expect(()=>run(declaration(),altered(373n,2n,undefined))).toThrow('TASK_PLAN');
 expect(()=>run(declaration(),altered(373n,2n,r(390,[id(1027,'definition/task-instruction-one')])))).toThrow('TASK_PLAN');
 expect(()=>run(declaration(),initialReceiving([]))).toThrow('BODY_PLAN');
});
it('uses one declared interval and rejects times before adoption or at deadline',()=>{
 const d={...declaration(),activeFrom:40n};expect(()=>run(d,initialReceiving(),source(),39n)).toThrow('TIME');expect(()=>run(d,initialReceiving(),source(),100n)).toThrow('TIME');expect(run(d).at).toBe(45n);
});
it('preserves actual Base-off control with both instructions still adopted',()=>{
 const out=run({...declaration(),motiveDefinition:r(392,[rational(1,4),false])});expect(out.result.taskBase).toBeNull();expect(out.result.task.kind).toBe('Known');expect(out.result.body.kind).toBe('Known');
});
it('rejects forged compilation/source and mismatched observer-side source mapping',()=>{
 expect(()=>execute({kind:'MultisourceJoinProfile'} as MultisourceJoinProfile,initialReceiving(),source(),45n,()=>0n)).toThrow('UNCOMPILED');
 expect(()=>run(declaration(),initialReceiving(),{kind:'LocalReserveSource'} as LocalReserveSource)).toThrow('invalid local source');
 expect(()=>run(declaration(),initialReceiving(),source(20,true))).toThrow('SOURCE_MAPPING');
});
it('detects repeated allocation across task and observation paths',()=>{
 let n=0;expect(()=>execute(compile(declaration()),initialReceiving(),source(),45n,()=>BigInt(n++%6))).toThrow('ALLOCATION');
});
it('compiled criteria and channel mappings are detached from the caller',()=>{
 const d=declaration(),p=compile(d),expected=run(d);(d.channels[0] as {signal:string}).signal='interoceptive-signal/other';(d.task as {threshold:Q}).threshold=q(5);
 let n=0n;expect(execute(p,initialReceiving(),source(),45n,()=>n++)).toEqual(expected);
});
it('same originals and allocation sequence reproduce all component bytes/values',()=>{expect(run()).toEqual(run());expect(run(declaration(),initialReceiving(),source(21))).toEqual(run(declaration(),initialReceiving(),source(29)));});
it('capacity exclusion is preserved in the source join',()=>{const out=run({...declaration(),capacity:0});expect(out.result.body.kind).toBe('Unavailable');expect(out.result.task.kind).toBe('Unavailable');expect(out.result.taskBase).not.toBeNull();});
it('rejects invalid static profile before issuing a capability',()=>{
 expect(()=>compile({...declaration(),deadline:0n})).toThrow('WINDOW');
 expect(()=>compile({...declaration(),capacity:4})).toThrow('CHANNELS');
 expect(()=>compile({...declaration(),channels:[declaration().channels[0],declaration().channels[0],declaration().channels[2]]})).toThrow('MAPPING');
 expect(()=>compile({...declaration(),body:{signal:'interoceptive-signal/A',threshold:q(0)}})).toThrow('THRESHOLD');
 expect(()=>compile({...declaration(),motiveDefinition:r(392,[rational(2,1),true])})).toThrow('PARAMETER');
});
