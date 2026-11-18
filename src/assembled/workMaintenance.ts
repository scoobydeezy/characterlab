import {LEGACY_TIME_LIMIT,assertTimeLimit,timeDomainVersion,type TimeLimit} from './timeDomain';
/** assembled-work-maintenance/0.1. Controlled evidence feeds the one workspace. */
import {list,text,unsigned as u,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {receivingRecord as rec} from './codecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText as txt,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {sid,pattern} from './skill';
import {KNOWLEDGE_OWNER} from './strategy';
import {WORKSPACE_OWNER} from './control';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {WorkspaceTask} from '../campaign2/cognitiveTransforms';
export const WORK='assembled-work-maintenance/0.1';
export const WORK_SOURCE=sid(1001,'event/assembled-work-board'),WORK_OBSERVE=sid(1001,'event/assembled-work-observe'),WORK_LEARN=sid(1001,'event/assembled-work-learn');
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const require=(b:boolean,s:string)=>{if(!b)invalidModel('work maintenance '+s);};
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','work maintenance '+s);};
export function compileWorkMaintenance(v:CanonicalValue,tasks:readonly CanonicalValue[]){
 const a=items(v,'list');require(a.length===3&&txt(a[0])===WORK&&typeof a[1]==='boolean','declaration');
 const bindings=items(a[2],'list');require(bindings.length<=5&&new Set(bindings.map(key)).size===bindings.length&&bindings.every(t=>tasks.some(x=>eq(t,x))),'bindings');
 return {support:a[1]===true,bindings:[...bindings]};
}
export type WorkMaintenance=ReturnType<typeof compileWorkMaintenance>;
export function workBoard(v:CanonicalValue,settings:WorkMaintenance){
 const a=items(v,'list');require(a.length===5&&txt(a[0])===WORK&&a.slice(1,4).every(v=>typeof v==='boolean')&&settings.bindings.length>0,'board');
 const cards=items(a[4],'list'),seen=new Set<bigint>();require(cards.length<=settings.bindings.length+1,'card count');
 for(const c of cards){const x=items(c,'list'),n=uint(x[0]);require(x.length===3&&n>=1n&&n<=BigInt(settings.bindings.length+1)&&typeof x[1]==='boolean'&&uint(x[2])<=3n&&!seen.has(n),'card identity/priority');seen.add(n);}
 return {visible:a[1]===true,reminder:a[2]===true,cards};
}
export function workObservation(v:CanonicalValue,at:bigint,occurrence:CanonicalValue,s:WorkMaintenance){
 const b=workBoard(v,s);return list([text(WORK),occurrence,u(at),list(b.visible?b.cards.map(c=>items(c,'list')).filter(c=>c[1]===true).sort((a,b)=>Number(uint(a[0])-uint(b[0]))).map(c=>list([c[0],c[2]])):[]),b.visible&&b.reminder]);
}
export type WorkCard={id:number;priority:number};
/** Original rank/protect/reminder operation; eligibility is supplied by actual goal reads. */
export function selectMaintained(cards:readonly WorkCard[],prior:readonly number[],capacity:number,support:boolean,cue:boolean){
 const protect=support&&prior.includes(1)&&cards.some(c=>c.id===1);
 const ranked=[...cards].sort((a,b)=>(cue&&b.id===1?4:b.priority)-(cue&&a.id===1?4:a.priority)||a.id-b.id).map(c=>c.id);
 const selected=(protect?[1,...ranked.filter(n=>n!==1)]:ranked).slice(0,capacity);
 return {selected,control:capacity===0?0:protect?1:cue&&cards.some(c=>c.id===1)?2:0};
}
export const workKnowledgePath=(C:CanonicalValue):StatePath=>({rootStateTypeId:1000n,fieldId:10n,selectors:[{kind:'mapKey',key:C}]}),workAccessPath=(C:CanonicalValue):StatePath=>({...workKnowledgePath(C),rootStateTypeId:1014n,fieldId:2n});
function observation(v:CanonicalValue,s:WorkMaintenance,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 const a=items(v,'list');require(a.length===5&&txt(a[0])===WORK&&uint(a[2])>=1n&&uint(a[2])<=timeLimit&&typeof a[4]==='boolean','safe observation');
 const occurrence=id(a[1]);require(occurrence.namespaceId===1164n&&typeof occurrence.payload!=='boolean'&&occurrence.payload.kind==='unsigned','occurrence');
 let prev=0n;for(const c of items(a[3],'list')){const x=items(c,'list'),n=uint(x[0]);require(x.length===2&&n>prev&&n<=BigInt(s.bindings.length+1)&&uint(x[1])<=3n,'safe cards');prev=n;}return a;
}
function access(v:CanonicalValue|undefined,s:WorkMaintenance,taskCount:number,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);if(v===undefined)return [];const a=items(v,'list');require(a.length===3&&txt(a[0])===WORK&&uint(a[1])>=1n&&uint(a[1])<=timeLimit,'cache');const ns=items(a[2],'list').map(v=>Number(uint(v)));require(ns.length<=taskCount+1&&new Set(ns).size===ns.length&&ns.every(n=>n>=1&&n<=taskCount+1),'cache identities');return ns;}
export function withWorkMaintenanceState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,s:WorkMaintenance,taskCount:number,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 const paths=[workKnowledgePath(C),workAccessPath(C)],fresh=(p:StatePath)=>p.rootStateTypeId===1000n&&p.fieldId===10n||p.rootStateTypeId===1014n&&p.fieldId===2n;
 const checkPath=(p:StatePath)=>require(paths.some(x=>eq(statePathValue(x),statePathValue(p))),'foreign path');
 const check=(p:StatePath,v:CanonicalValue)=>{checkPath(p);if(p.rootStateTypeId===1000n)observation(v,s,timeLimit);else access(v,s,taskCount,timeLimit);};
 const authority=new StateAuthorityRegistry(paths.map(p=>({pattern:pattern(p),validateValue:(v:CanonicalValue)=>check(p,v),removalAllowed:false})),[{mutationAuthorityId:KNOWLEDGE_OWNER,patterns:[pattern(paths[0])]},{mutationAuthorityId:WORKSPACE_OWNER,patterns:[pattern(paths[1])]}]);
 const without=(state:AuthoritativeState)=>new AuthoritativeState(state.entries().filter(e=>!fresh(e.path)));
 function local(state:AuthoritativeState){for(const e of state.entries().filter(e=>fresh(e.path)))check(e.path,e.value);}
 function validateState(state:AuthoritativeState){base.validateState(without(state));local(state);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(fresh(p))checkPath(p);else base.validatePath(p);},restoreState(bytes:Uint8Array){const state=restoreAuthoritativeState(decode(bytes));validateState(state);return state;},
 read(state:AuthoritativeState,p:StatePath){if(!fresh(p))return base.read(state,p);checkPath(p);const v=state.read(p);if(v.presence)check(p,v.value!);return v;},
 applyPatch(state:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
 const added=p.operations.filter(o=>fresh(o.path));require(!added.length||added.length===p.operations.length,'mixed patch');
 if(added.length){for(const o of added){checkPath(o.path);require(!scope||scope.writableRoots.includes(o.path.rootStateTypeId)&&scope.targetPaths.some(x=>eq(statePathValue(x),statePathValue(o.path))),'scope');}const result=applyStatePatch(state,p,owner,authority);validateState(result.state);return result;}
 const result=base.applyPatch(without(state),p,owner,scope),next=new AuthoritativeState([...result.state.entries(),...state.entries().filter(e=>fresh(e.path))]);local(next);return {...result,state:next};
 }});
}
export function createWorkMaintenance(C:CanonicalValue,s:WorkMaintenance,tasks:readonly (WorkspaceTask&{path:StatePath})[],stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 let active=false,at=0n,unbound=0,selected=false;const used=new Set<bigint>(),pending=new Set<string>();
 const read=(state:AuthoritativeState,p:StatePath)=>{const value=stateModel.read(state,p);return {...value,record:{accessorId:sid(1028,'accessor/work-maintenance'),path:p,presence:value.presence,value:value.value,derivedSources:[]} as ActualReadRecord};};
 function trace(event:ScheduledEvent,input:CanonicalValue,outputs:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[]){
 return traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-work-maintenance'),seamVersion:timeDomainVersion(WORK,timeLimit),recordKind:event.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(x=>pattern(x.path)),actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});}
 function children(parent:ScheduledEvent,emissions:EventEmission[]){let bound=false;unbound++;return (allocated:readonly ScheduledEvent[])=>{if(!active||bound||allocated.length!==emissions.length)fail('child lifecycle');for(const [i,e]of allocated.entries()){const wanted={...emissions[i],eventId:e.eventId,eventSequence:e.eventSequence,causalParentEventIds:[parent.eventId]};if(e.eventId===parent.eventId||e.eventSequence<=parent.eventSequence||fp(e)!==fp(wanted)||pending.has(fp(e)))fail('child mismatch');}for(const e of allocated)pending.add(fp(e));bound=true;unbound--;};}
 const admit=(e:ScheduledEvent,phase:bigint)=>{if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('unbound child');};
 return Object.freeze({
 eventTypes:()=>[WORK_SOURCE,WORK_OBSERVE,WORK_LEARN],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,WORK_LEARN),
 begin(instant:bigint){if(active)fail('active');active=true;at=instant;unbound=0;selected=false;pending.clear();used.clear();},
 close(){active=false;pending.clear();used.clear();unbound=0;selected=false;},
 prepareCommit(){if(!active||pending.size||unbound||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished');},
 execute(context:EventHandlerContext<AuthoritativeState>){const {event,state}=context;let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[];
 if(eq(event.eventTypeId,WORK_SOURCE)){if(!active||event.dueAt!==at||event.phase!==110n||used.size||!originals.some(e=>fp(e)===fp(event)))fail('source');workBoard(event.payload,s);used.add(event.eventId);emissions=[{dueAt:event.dueAt,phase:120n,eventTypeId:WORK_OBSERVE,payload:event.payload,dependencies:list([])}];}
 else if(eq(event.eventTypeId,WORK_OBSERVE)){admit(event,120n);const safe=workObservation(event.payload,at,typedIdentifier(1164,u(context.allocateRuntimeId())),s);outputs=[safe];emissions=[{dueAt:event.dueAt,phase:140n,eventTypeId:WORK_LEARN,payload:safe,dependencies:list([])}];}
 else fail('learning stage required');const bind=children(event,emissions);return {nextState:state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(xs:readonly ScheduledEvent[]){bind(xs);return [trace(event,event.payload,outputs,xs)];}};},
 workspace(event:ScheduledEvent,state:AuthoritativeState,base:CanonicalValue,definition:CanonicalValue){
 if(!active||selected||event.phase!==40n||event.dueAt!==at)fail('selection lifecycle');selected=true;
 const k=read(state,workKnowledgePath(C)),a=read(state,workAccessPath(C)),safe=k.presence?observation(k.value!,s,timeLimit):undefined;
 if(safe&&uint(safe[2])>=at)fail('strictly later source');
 const reads=[k.record,a.record],statuses=tasks.map(t=>{const v=read(state,t.path);reads.push(v.record);return v.value;});
 const eligible=(i:number)=>statuses[i]!==undefined&&uint(f(rec(statuses[i]!,372n),1n))===1n&&tasks[i].activeFrom<=at&&at<tasks[i].deadline;
 const cards:WorkCard[]=safe?items(safe[3],'list').map(v=>items(v,'list')).filter(x=>{const n=Number(uint(x[0]));return n===s.bindings.length+1||eligible(tasks.findIndex(t=>eq(t.key,s.bindings[n-1])));}).map(x=>({id:Number(uint(x[0])),priority:Number(uint(x[1]))})):[];
 const ordinary=tasks.map((t,i)=>({t,i})).filter(x=>!s.bindings.some(t=>eq(t,x.t.key))).sort((a,b)=>a.t.deadline<b.t.deadline?-1:a.t.deadline>b.t.deadline?1:key(a.t.key)<key(b.t.key)?-1:1);
 const byId=new Map(s.bindings.map((t,i)=>[i+1,t]));for(const [j,x]of ordinary.entries()){const n=s.bindings.length+2+j;byId.set(n,x.t.key);if(eligible(x.i))cards.push({id:n,priority:0});}
 const d=rec(definition,378n),capacity=Number(uint(f(d,2n))),reserved=capacity>=2&&f(d,4n)===true?1:0,enabled=f(d,3n)===true;
 const prior=access(a.value,s,tasks.length,timeLimit),choice=selectMaintained(enabled?cards:[],prior,Math.max(0,capacity-reserved),s.support,safe?.[4]===true),selectedTasks=choice.selected.filter(n=>byId.has(n)).map(n=>tasks.find(t=>eq(t.key,byId.get(n)!))!),neutral=choice.selected.filter(n=>!byId.has(n)).length;
 const w=rec(base,381n),output=r(381,[f(w,1n),C,f(w,3n),list(selectedTasks.map(t=>r(379,[t.key,t.specId]))),selectedTasks.length?f(w,5n):r(380,[u(1)])]);
 const report=list([text(WORK),u(at),list(cards.map(c=>list([u(c.id),u(c.priority)]))),list(prior.map(u)),list(choice.selected.map(u)),u(choice.control),k.value??list([]),list(tasks.map((t,i)=>list([t.key,statuses[i]??list([])]))),u(neutral),output]);
 const patch:StatePatch={operations:[{kind:'set',path:workAccessPath(C),expected:a.presence?{presence:true,value:a.value!}:{presence:false},newValue:list([text(WORK),u(at),list(choice.selected.map(u))])}]};
 const result=stateModel.applyPatch(state,patch,WORKSPACE_OWNER,{writableRoots:[1014n],targetPaths:[workAccessPath(C)]});
 return {output,report,neutral,nextState:result.state,trace:()=>trace(event,list([base,k.value??list([])]),[report],[],reads,patch,result.diffs)};
 },
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
 if(events.length!==1)fail('learning multiplicity');const event=events[0];admit(event,140n);observation(event.payload,s,timeLimit);
 const p=workKnowledgePath(C),before=read(B0,p);if(before.presence&&uint(observation(before.value!,s,timeLimit)[2])>=at)fail('observation order');
 const patch:StatePatch={operations:[{kind:'set',path:p,expected:before.presence?{presence:true,value:before.value!}:{presence:false},newValue:event.payload}]};let executed=false,finished=false;let rows:CanonicalValue[]=[];
 return {execute(context:EventHandlerContext<AuthoritativeState>){if(executed||finished||fp(context.event)!==fp(event))fail('learn lifecycle');executed=true;return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},finish(state:AuthoritativeState){if(!executed||finished)fail('learn finish');finished=true;const result=stateModel.applyPatch(state,patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:[p]});rows=[trace(event,event.payload,[],[],[before.record],patch,result.diffs)];return result.state;},traces(){if(!finished)fail('trace before finish');return rows;}};
 }
 });
}
