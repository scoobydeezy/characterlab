/** Shared goal criterion: counted work, perceived progress and independent retirement. */
import {list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {dataField as f,dataItems as items,dataKey as key,dataText as txt,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {decodeCognitive,receivingRecord as rec} from './codecs';
import {sid,pattern} from './skill';
import {GOAL_OWNER} from './priority';
import type {Strategy} from './strategy';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const COUNT='assembled-counted-goal/0.1',COUNT_VERSION=COUNT+'-candidate';
export const COUNT_SOURCE=sid(1001,'event/assembled-counted-source'),COUNT_OBSERVE=sid(1001,'event/assembled-counted-observe'),COUNT_LEARN=sid(1001,'event/assembled-counted-learn'),COUNT_WORLD=sid(1025,'authority/physical-counted-work');
export const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const require=(b:boolean,s:string)=>{if(!b)invalidModel('counted goal '+s);};
export function compileCounted(v:CanonicalValue,routes:Strategy){
 const a=items(v,'list');require(a.length===2&&txt(a[0])===COUNT,'declaration');const rows=items(a[1],'list');require(rows.length<=routes.length,'capacity');
 const tasks=new Set<string>(),actions=new Set<string>();return rows.map(v=>{const x=items(v,'list');require(x.length===4,'binding');const route=routes.find(r=>eq(r.task,x[0])),plan=route?.plans.find(p=>eq(p.instructionId,x[1]));require(!!plan,'governed instruction');
 const required=uint(x[2]),mode=uint(x[3]);require(required>=1n&&required<=100n&&mode<=2n,'required/mode domain');require(!tasks.has(key(x[0]))&&!actions.has(key(plan!.actionId)),'distinct task/action');tasks.add(key(x[0]));actions.add(key(plan!.actionId));return {task:x[0],instruction:x[1],action:plan!.actionId,required,mode};});
}
export type Counted=ReturnType<typeof compileCounted>;
export const countPath=(task:CanonicalValue,world=false):StatePath=>({rootStateTypeId:world?1611n:373n,fieldId:world?1n:31n,selectors:[{kind:'mapKey',key:task}]});
export const countStatus=(task:CanonicalValue):StatePath=>({...countPath(task),fieldId:1n});
export function countedSource(v:CanonicalValue,settings:Counted){
 const a=items(v,'list');require(a.length===2&&txt(a[0])===COUNT,'source');const rows=items(a[1],'list'),seen=new Set<string>();require(rows.length===settings.length,'complete source');
 return rows.map(v=>{const x=items(v,'list');require(x.length===4&&settings.some(s=>eq(s.task,x[0]))&&!seen.has(key(x[0])),'source task');seen.add(key(x[0]));for(const flag of x.slice(1))require(typeof flag==='boolean','source Boolean');return x;});
}
export function countProgress(v?:CanonicalValue){if(!v)return {count:0n,receipts:[] as CanonicalValue[]};const a=items(v,'list');require(a.length===3&&txt(a[0])===COUNT,'progress');const count=uint(a[1]),receipts=items(a[2],'list');require(count===BigInt(receipts.length)&&count<=100n,'count/receipts');let last=0n;const seen=new Set<string>();for(const v of receipts){const r=items(v,'list');require(r.length===2&&id(r[0]).namespaceId===1164n,'receipt');require(uint(id(r[0]).payload)>0n,'positive receipt occurrence');const at=uint(r[1]);require(at>last&&at<=1000000n&&!seen.has(key(r[0])),'fresh receipt');last=at;seen.add(key(r[0]));}return {count,receipts};}
export function countWorld(v?:CanonicalValue){if(!v)return {count:0n,at:0n};const a=items(v,'list');require(a.length===4&&txt(a[0])===COUNT,'physical work');const count=uint(a[1]),at=uint(a[2]);require(count<=100n&&at>=1n&&at<=1000000n&&id(a[3]).namespaceId===1141n,'physical domain');uint(id(a[3]).payload);return {count,at};}
export function withCountedState(base:ReturnType<typeof compileCampaign2StateModel>,settings:Counted){
 const paths=settings.flatMap(s=>[countPath(s.task),countPath(s.task,true)]),fresh=(p:StatePath)=>p.rootStateTypeId===1611n||p.rootStateTypeId===373n&&p.fieldId===31n;
 const check=(p:StatePath)=>require(paths.some(v=>eq(statePathValue(v),statePathValue(p))),'foreign path'),validate=(p:StatePath,v:CanonicalValue)=>p.rootStateTypeId===1611n?countWorld(v):countProgress(v);
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:(v:CanonicalValue)=>validate(p,v),removalAllowed:false})),[{mutationAuthorityId:GOAL_OWNER,patterns:paths.filter(p=>p.rootStateTypeId===373n).map(pattern)},{mutationAuthorityId:COUNT_WORLD,patterns:paths.filter(p=>p.rootStateTypeId===1611n).map(pattern)}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function local(s:AuthoritativeState){for(const e of s.entries().filter(e=>fresh(e.path))){check(e.path);validate(e.path,e.value);if(e.path.rootStateTypeId===373n)require(s.read({...e.path,fieldId:1n}).presence,'progress requires adopted goal');}for(const bound of settings){const status=s.read(countStatus(bound.task)).value;if(status&&rec(status,372n).schema.schemaVersion===4n){const p=countProgress(s.read(countPath(bound.task)).value),last=p.receipts.at(-1);require(p.count>=bound.required&&!!last&&eq(items(last!,'list')[0],f(rec(status,372n),2n))&&uint(items(last!,'list')[1])===(f(rec(status,372n),3n) as {value:bigint}).value,'fulfillment requires sufficient received count');}}}
 function validateState(s:AuthoritativeState){base.validateState(without(s));local(s);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))check(p);else base.validatePath(p);},restoreState(b:Uint8Array){const s=restoreAuthoritativeState(decodeCognitive(b));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);check(p);const v=s.read(p);if(v.presence)validate(p,v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
 const own=p.operations.filter(o=>fresh(o.path));require(!own.length||own.length===p.operations.length,'mixed patch');
 if(own.length){for(const o of own){check(o.path);require(o.kind==='set','set only');require(!scope||scope.writableRoots.includes(o.path.rootStateTypeId)&&scope.targetPaths.some(v=>eq(statePathValue(v),statePathValue(o.path))),'scope');if(o.kind==='set'){const before=s.read(o.path).value;if(o.path.rootStateTypeId===1611n){const b=countWorld(before),n=countWorld(o.newValue);require(n.at>b.at&&n.count>=b.count&&n.count<=b.count+1n,'physical monotonicity');}else{const b=countProgress(before),n=countProgress(o.newValue);require(n.count===b.count+1n&&eq(list(n.receipts.slice(0,-1)),list(b.receipts)),'append one fresh receipt');}}}
 const r=applyStatePatch(s,p,owner,authority);local(r.state);return r;}
 const r=base.applyPatch(without(s),p,owner,scope),next=new AuthoritativeState([...r.state.entries(),...s.entries().filter(e=>fresh(e.path))]);local(next);return {...r,state:next};
 }});
}
