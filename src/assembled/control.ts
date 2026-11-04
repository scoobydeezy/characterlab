import {reappraisalPath,framePath,reappraisalKnowledge,reappraisalFrame,FRAME_OWNER} from './reappraisal';
import {KNOWLEDGE_OWNER} from './strategy';
/** assembled-character-control/0.1: retained goal, maintained access, one capacity. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const CONTROL='assembled-control/0.1',CONTROL_VIEW='assembled-control-view/0.1',CONTROL_OPTIONS='assembled-control-options/0.1';
export const CONTROL_SOURCE=sid(1001,'event/assembled-control-source'),CONTROL_OBSERVE=sid(1001,'event/assembled-control-observe'),CONTROL_UPDATE=sid(1001,'event/assembled-control-update');
export const GOAL_OWNER=sid(1025,'authority/prospective-commitments'),WORKSPACE_OWNER=sid(1025,'authority/workspace');
export const controlGoalPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:4n,selectors:[{kind:'mapKey',key:C}]}),maintenancePath=(C:CanonicalValue):StatePath=>({...controlGoalPath(C),rootStateTypeId:1014n,fieldId:1n});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('control '+s);};
export function compileControl(v:CanonicalValue){const a=items(v,'list');require(a.length===1&&txt(a[0])===CONTROL,'declaration');return true;}
export function controlSetting(v:CanonicalValue){const a=items(v,'list');require(a.length===6&&txt(a[0])===CONTROL&&uint(a[1])<=2n&&a.slice(2).every(v=>typeof v==='boolean'),'source');return {instruction:uint(a[1]),reminder:a[2]===true,support:a[3]===true,card:a[4]===true,visible:a[5]===true};}
export function controlValue(v:CanonicalValue|undefined,goal:boolean){if(v===undefined)return {active:false,maintained:false,at:0n,status:0n};const a=items(v,'list');require(a.length===3&&txt(a[0])===CONTROL&&uint(a[2])>=1n&&uint(a[2])<=100n&&(goal?[1n,2n].includes(uint(a[1])):typeof a[1]==='boolean'),'state value');return {active:goal&&uint(a[1])===1n,maintained:!goal&&a[1]===true,at:uint(a[2]),status:goal?uint(a[1]):0n};}
/** Same SpareSlot predicate as control-public/0.2, after mapping actual shared load. */
export function controlAllocation(capacity:number,used:number,active:boolean,prior:boolean,reminder:boolean,support:boolean,card:boolean,capacityLimit:5|32=5){
 require(Number.isSafeInteger(capacity)&&capacity>=0&&capacity<=capacityLimit&&Number.isSafeInteger(used)&&used>=0&&used<=capacity,'capacity');
 const maintained=active&&(reminder||prior&&support)&&used<capacity,selectedCard=card&&used+Number(maintained)<capacity,reserved=Number(maintained)+Number(selectedCard);
 return {maintained,card:selectedCard,reserved,spare:capacity-used-reserved};
}
export function withControlState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,reappraisal=false){
 const paths=[controlGoalPath(C),maintenancePath(C),...(reappraisal?[reappraisalPath(C),framePath(C)]:[])],fresh=(p:StatePath)=>reappraisal&&(p.rootStateTypeId===1031n||p.rootStateTypeId===1000n&&p.fieldId===8n)||p.rootStateTypeId===1014n||p.rootStateTypeId===373n&&p.fieldId===4n,goal=(p:StatePath)=>p.rootStateTypeId===373n;
 const checkPath=(p:StatePath)=>require(paths.some(x=>key(statePathValue(x))===key(statePathValue(p))),'foreign path');
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);if(p.rootStateTypeId===1031n)reappraisalFrame(v);else if(p.rootStateTypeId===1000n)reappraisalKnowledge(v,C);else controlValue(v,goal(p));};
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:(v:CanonicalValue)=>check(p,v),removalAllowed:false})),paths.map((p,i)=>({mutationAuthorityId:i===3?FRAME_OWNER:i===2?KNOWLEDGE_OWNER:i?WORKSPACE_OWNER:GOAL_OWNER,patterns:[pattern(p)]})));
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!fresh(e.path)));
 function validateState(s:AuthoritativeState){base.validateState(without(s));for(const e of s.entries().filter(e=>fresh(e.path)))check(e.path,e.value);if(reappraisal){const k=reappraisalKnowledge(s.read(reappraisalPath(C)).value,C),fr=reappraisalFrame(s.read(framePath(C)).value);require(fr.sources.every(id=>k.sources.some(x=>key(x)===key(id))),'frame evidence retained');}}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},read(s:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed owned patch');if(added.length){for(const o of added){checkPath(o.path);require(o.kind==='set','replacement only');if(o.kind==='set'){check(o.path,o.newValue);if(o.path.rootStateTypeId===1000n){const old=reappraisalKnowledge(s.read(o.path).value,C),next=reappraisalKnowledge(o.newValue,C);require(next.rows.length===old.rows.length+1&&key(list(next.rows.slice(0,old.rows.length)))===key(list(old.rows)),'reappraisal append only');}else if(o.path.rootStateTypeId===1031n)require(reappraisalFrame(o.newValue).at>reappraisalFrame(s.read(o.path).value).at,'frame time');else {const old=controlValue(s.read(o.path).value,goal(o.path)),next=controlValue(o.newValue,goal(o.path));require(next.at>old.at,'state update order');if(goal(o.path))require(old.status===0n&&next.status===1n||old.status===1n&&next.status===2n,'goal lifecycle');}}require(!scope||scope.writableRoots.includes(o.path.rootStateTypeId)&&scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path))),'write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>fresh(e.path))]);validateState(state);return {...result,state};}});
}
