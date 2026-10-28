/** assembled-character-priority/0.1-candidate: importance is retained, urgency is current. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {exact} from '../campaign3/embodiedMath';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const PRIORITY='assembled-goal-priority/0.1',PRIORITY_OBS='assembled-priority-observation/0.1',PRIORITY_MOTIVE='assembled-priority-motive/0.1';
export const PRIORITY_DISPLAY=sid(1001,'event/assembled-priority-display'),PRIORITY_OBSERVE=sid(1001,'event/assembled-priority-observe'),PRIORITY_EVIDENCE=sid(1001,'event/assembled-priority-evidence'),PRIORITY_LEARN=sid(1001,'event/assembled-priority-learn');
export const GOAL_OWNER=sid(1025,'authority/prospective-commitments');
export const importancePath=(task:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:3n,selectors:[{kind:'mapKey',key:task}]});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('priority '+s);};
export function unit(v:CanonicalValue){require(typeof v!=='boolean'&&v.kind==='rational','exact rational required');const x=exact(v);require(x.compare(Q.of(0n))>=0&&x.compare(Q.of(1n))<=0,'unit domain');return x;}
export function optionalUnit(v:CanonicalValue){const a=items(v,'list');require(a.length<=1,'optional unit');return a.length?unit(a[0]):undefined;}
export function compilePriority(v:CanonicalValue){const a=items(v,'list');require(a.length===1&&txt(a[0])===PRIORITY,'declaration');return true as const;}
export function priorityDisplay(v:CanonicalValue,at:bigint,tasks:readonly CanonicalValue[]){const a=items(v,'list');require(a.length===2&&txt(a[0])===PRIORITY,'display');const rows=items(a[1],'list'),seen=new Set<string>();require(rows.length<=tasks.length,'display size');for(const row of rows){const x=items(row,'list');require(x.length===5&&tasks.some(t=>key(t)===key(x[0]))&&!seen.has(key(x[0])),'display task');seen.add(key(x[0]));const adoption=optionalUnit(x[1]);optionalUnit(x[3]);require(typeof x[2]==='boolean'&&typeof x[4]==='boolean'&&(adoption===undefined||at===1n),'adoption time/visibility');}return rows;}
export function importanceValue(v:CanonicalValue){const a=items(v,'list');require(a.length===4&&txt(a[0])===PRIORITY&&uint(a[3])===1n,'importance');const I=unit(a[1]),occ=id(a[2]);require(occ.namespaceId===1164n&&typeof occ.payload!=='boolean'&&occ.payload.kind==='unsigned','importance support');return {I,support:a[2]};}
export const factoredPriority=(I:Q|undefined,U:Q|undefined)=>I===undefined||U===undefined?Q.of(0n):I.multiply(Q.of(1n).add(U)).divide(Q.of(2n));
export function withPriorityState(base:ReturnType<typeof compileCampaign2StateModel>,tasks:readonly CanonicalValue[]){
 const paths=tasks.map(importancePath),fresh=(p:StatePath)=>p.rootStateTypeId===373n&&p.fieldId===3n,checkPath=(p:StatePath)=>require(paths.some(x=>key(statePathValue(x))===key(statePathValue(p))),'foreign path');
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:importanceValue,removalAllowed:false})),[{mutationAuthorityId:GOAL_OWNER,patterns:paths.map(pattern)}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function validateState(s:AuthoritativeState){base.validateState(without(s));for(const e of s.entries().filter(e=>fresh(e.path))){checkPath(e.path);importanceValue(e.value);require(s.read({...e.path,fieldId:1n}).presence,'importance without adopted goal');}}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)importanceValue(v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed owned field patch');if(added.length){for(const o of added){checkPath(o.path);require(o.kind==='set'&&!s.read(o.path).presence,'importance is immutable');require(!scope||scope.writableRoots.includes(373n)&&scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path))),'write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>fresh(e.path))]);validateState(state);return {...result,state};}});
}
