import {ACTION_BODY,ACTION_BODY_EVENT} from './actionBody';
export const ITEM_EXECUTION='item-location/0.2',SENSOR_BINDING='item-location/0.3';
/** Data-defined physical locations; one owner inside the assembled state. */
import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataItems as items,dataKey as key,dataIdentity as id,dataText as txt,dataRecord as rec,dataField as f,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import {decodeCognitive} from './codecs';
import {sid,pattern} from './skill';
import {protocolAttemptAction} from './protocolPermission';
export const ITEM_WORLD='item-location/0.1',ITEM_PROBE='item-location-probe/0.1';
export const ITEM_SOURCE=sid(1001,'event/item-location-source'),ITEM_OWNER=sid(1025,'authority/item-location'),ITEM_ACCESSOR=sid(1028,'accessor/item-location');
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const require=(b:boolean,s:string)=>{if(!b)invalidModel('item location '+s);};
export const itemPath=(item:CanonicalValue):StatePath=>({rootStateTypeId:1600n,fieldId:1n,selectors:[{kind:'mapKey',key:item}]});
export function compileItemWorld(v:CanonicalValue,actions:readonly CanonicalValue[],tasks:readonly CanonicalValue[],sensorBinding=false){
 const a=items(v,'list');require(a.length===5&&(txt(a[0])===ITEM_WORLD||sensorBinding&&txt(a[0])===SENSOR_BINDING),'declaration');
 const domain=(v:CanonicalValue,ns:bigint)=>{const rows=items(v,'set');require(rows.length>=1&&rows.length<=1024&&new Set(rows.map(key)).size===rows.length,'domain capacity/duplicates');for(const row of rows){const i=id(row);require(i.namespaceId===ns&&typeof i.payload!=='boolean'&&i.payload.kind==='text'&&i.payload.value.length>0&&i.payload.value.length<=128,'nominal item/place identity');}return rows;};
 const objects=domain(a[1],1601n),places=domain(a[2],1602n),rows=items(a[3],'list'),seen=new Set<string>();require(rows.length>=1&&rows.length<=actions.length,'move capacity');
 const moves=rows.map(v=>{const r=items(v,'list');require(r.length===3&&actions.some(x=>eq(x,r[0]))&&objects.some(x=>eq(x,r[1]))&&places.some(x=>eq(x,r[2]))&&!seen.has(key(r[0])),'move action/item/place');seen.add(key(r[0]));return {action:r[0],item:r[1],place:r[2]};});
 const c=items(a[4],'list'),unbound=sensorBinding&&txt(a[0])===SENSOR_BINDING&&c.length===0;require(unbound||c.length===3&&tasks.some(x=>eq(x,c[0]))&&objects.some(x=>eq(x,c[1]))&&places.some(x=>eq(x,c[2])),'criterion task/item/place');
 return {objects,places,moves,task:unbound?undefined:c[0],item:unbound?undefined:c[1],destination:unbound?undefined:c[2]};
}
export type ItemWorld=ReturnType<typeof compileItemWorld>;
export function itemLocationSource(v:CanonicalValue,s:ItemWorld){const a=items(v,'list');require(a.length===3&&txt(a[0])===ITEM_WORLD&&s.objects.some(x=>eq(x,a[1]))&&s.places.some(x=>eq(x,a[2])),'source item/place');return {item:a[1],place:a[2]};}
export function itemAuthority(s:ItemWorld){return new StateAuthorityRegistry(s.objects.map(item=>({pattern:pattern(itemPath(item)),validateValue:(v:CanonicalValue)=>require(s.places.some(p=>eq(p,v)),'place value'),removalAllowed:false})),[{mutationAuthorityId:ITEM_OWNER,patterns:s.objects.map(item=>pattern(itemPath(item)))}]);}
export function withItemWorldState(base:ReturnType<typeof compileCampaign2StateModel>,s:ItemWorld){
 const fresh=(p:StatePath)=>p.rootStateTypeId===1600n,without=(state:AuthoritativeState)=>new AuthoritativeState(state.entries().filter(e=>!fresh(e.path))),authority=itemAuthority(s);
 const checkPath=(p:StatePath)=>require(s.objects.some(item=>eq(statePathValue(p),statePathValue(itemPath(item)))),'foreign path');
 const local=(state:AuthoritativeState)=>{const rows=state.entries().filter(e=>fresh(e.path));require(rows.length===s.objects.length,'complete location state');for(const row of rows){checkPath(row.path);require(s.places.some(p=>eq(p,row.value)),'unknown place');}};
 const validateState=(state:AuthoritativeState)=>{base.validateState(without(state));local(state);};
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const state=restoreAuthoritativeState(decodeCognitive(bytes));validateState(state);return state;},
 read(state:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(state,p);checkPath(p);const v=state.read(p);require(v.presence&&s.places.some(x=>eq(x,v.value!)),'missing/unknown location');return v;},
 applyPatch(state:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
 const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed patch');if(added.length){for(const o of added){checkPath(o.path);require(!scope||scope.writableRoots.includes(1600n)&&scope.targetPaths.some(x=>eq(statePathValue(x),statePathValue(o.path))),'write scope');}const result=applyStatePatch(state,p,owner,authority);validateState(result.state);return result;}
 const result=base.applyPatch(without(state),p,owner,scope),next=new AuthoritativeState([...result.state.entries(),...state.entries().filter(e=>fresh(e.path))]);local(next);return {...result,state:next};
 }});
}
export function createItemWorld(s:ItemWorld,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,competentItems=false){
 let active=false,at=0n;const used=new Set<bigint>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','item location '+why);};
 function move(event:ScheduledEvent,state:AuthoritativeState,item:CanonicalValue,place:CanonicalValue,input:CanonicalValue,source?:CanonicalValue){
  const path=itemPath(item),prior=stateModel.read(state,path),reads:ActualReadRecord[]=[{accessorId:ITEM_ACCESSOR,path,presence:prior.presence,value:prior.value,derivedSources:[]}];
  const patch:StatePatch={operations:eq(prior.value!,place)?[]:[{kind:'set',path,expected:{presence:true,value:prior.value!},newValue:place}]};
  const result=patch.operations.length?stateModel.applyPatch(state,patch,ITEM_OWNER,{writableRoots:[1600n],targetPaths:[path]}):{state,diffs:[]};
  return {nextState:result.state,trace:()=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/item-location'),seamVersion:competentItems?ITEM_EXECUTION:ITEM_WORLD,recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:source?[id(source)]:[],registeredReadDomain:[pattern(path)],actualReadRecords:reads,inputProjection:list([input,item,place]),outputProjection:list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:result.diffs,emittedEvents:[],invariantResults:[]})};
 }
 return Object.freeze({
 begin(instant:bigint){if(active)fail('already active');active=true;at=instant;used.clear();},close(){active=false;used.clear();},prepareCommit(){if(!active||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unconsumed source');},
 execution(event:ScheduledEvent,state:AuthoritativeState,output:CanonicalValue){if(competentItems)fail('legacy execution disabled');if(!active||event.dueAt!==at||event.phase!==110n||!eq(event.eventTypeId,sid(1001,'event/protocol-execution')))fail('execution origin');const o=rec(output,433n),action=protocolAttemptAction(f(o,2n)),binding=s.moves.find(m=>eq(m.action,action));return binding&&uint(f(o,3n))>0n?move(event,state,binding.item,binding.place,output,f(o,1n)):undefined;},
 /** Called only after the body owner authenticated and completed this event. */
 effect(event:ScheduledEvent,state:AuthoritativeState,outputs:readonly CanonicalValue[]){
  if(!competentItems||!active||event.dueAt!==at||event.phase!==110n||!eq(event.eventTypeId,ACTION_BODY_EVENT)||used.has(event.eventId))fail('effect origin/version/duplicate');
  const o=rec(event.payload,433n),attempt=rec(f(o,2n),432n),action=protocolAttemptAction(attempt),rows=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&eq(v.items[0],text(ACTION_BODY)));
  if(rows.length!==1)fail('one completed physical assessment required');const a=items(rows[0],'list');
  if(a.length!==7||!eq(a[1],f(o,1n))||!eq(a[2],f(attempt,1n))||!eq(a[3],action)||typeof a[4]==='boolean'||a[4].kind!=='rational'||a[4].numerator<0n)fail('physical assessment association');
  const status=txt(a[5]),count=uint(f(o,3n));if(!['Applied','Queued','Blocked','Withheld'].includes(status)||status==='Withheld'&&count!==0n||['Applied','Queued'].includes(status)&&count===0n)fail('physical assessment disposition');
  used.add(event.eventId);const binding=s.moves.find(m=>eq(m.action,action));
  return binding&&count>0n&&['Applied','Queued'].includes(status)?move(event,state,binding.item,binding.place,list([o,rows[0]]),f(o,1n)):undefined;
 },
 execute(context:EventHandlerContext<AuthoritativeState>){const e=context.event;if(!active||e.dueAt!==at||e.phase!==100n||!eq(e.eventTypeId,ITEM_SOURCE)||used.has(e.eventId)||!originals.some(x=>key(scheduledEventValue(x))===key(scheduledEventValue(e))))fail('unbound source');used.add(e.eventId);const b=itemLocationSource(e.payload,s),result=move(e,context.state,b.item,b.place,e.payload);return {nextState:result.nextState,outputs:[],emittedEvents:[],traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){if(children.length)fail('source children');return [result.trace()];}};}
 });
}
