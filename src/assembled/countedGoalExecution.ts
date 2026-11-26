import {list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type ActualReadRecord,type StatePatch,type StatePath} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataItems as items,dataField as f,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {qValue} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import {sid,pattern} from './skill';
import {GOAL_OWNER} from './priority';
import {chosenData} from './choice';
import {COUNT,COUNT_VERSION,COUNT_SOURCE,COUNT_OBSERVE,COUNT_LEARN,COUNT_WORLD,countedSource,countPath,countStatus,countProgress,countWorld,eq,type Counted} from './countedGoal';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','counted goal '+s);},fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
export function createCountedExecution(settings:Counted,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,settlement=false){
 let active=false,at=0n,frame:(readonly CanonicalValue[])[]|undefined,unbound=0,attempted=false;let currentSource:ScheduledEvent|undefined;const pending=new Set<string>(),used=new Set<bigint>(),outcomes=new Map<string,boolean>(),completions=new Map<string,CanonicalValue>();
 const read=(s:AuthoritativeState,p:StatePath,reads:ActualReadRecord[])=>{const v=stateModel.read(s,p);reads.push({accessorId:sid(1028,'accessor/counted-goal'),path:p,presence:v.presence,value:v.value,derivedSources:[]});return v.value;};
 const trace=(e:ScheduledEvent,input:CanonicalValue,outputs:CanonicalValue[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],children:readonly ScheduledEvent[]=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:sid(1036,'seam/assembled-counted-goal'),seamVersion:settlement?'assembled-counted-goal/0.2-candidate':COUNT_VERSION,recordKind:e.eventTypeId,subjectIds:[id(C)],sourceRecordIds:[],registeredReadDomain:reads.map(v=>pattern(v.path)),actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 function patch(s:AuthoritativeState,p:StatePath,v:CanonicalValue,owner:ReturnType<typeof sid>){const old=stateModel.read(s,p),patch:StatePatch={operations:[{kind:'set',path:p,expected:old.presence?{presence:true,value:old.value!}:{presence:false},newValue:v}]},x=stateModel.applyPatch(s,patch,owner,{writableRoots:[p.rootStateTypeId],targetPaths:[p]});return {...x,patch};}
 function admit(e:ScheduledEvent,phase:bigint){if(!active||e.dueAt!==at||e.phase!==phase||!pending.delete(fp(e)))fail('generated origin');}
 function bind(parent:ScheduledEvent,emissions:EventEmission[]){unbound++;let bound=false;return (children:readonly ScheduledEvent[])=>{if(bound||children.length!==emissions.length)fail('child count');for(const [i,e]of children.entries()){const expected={...emissions[i],eventId:e.eventId,eventSequence:e.eventSequence,causalParentEventIds:[parent.eventId]};if(e.eventId===parent.eventId||e.eventSequence<=parent.eventSequence||fp(e)!==fp(expected)||pending.has(fp(e)))fail('child association');pending.add(fp(e));}bound=true;unbound--;};}
 return Object.freeze({
 completion(task:CanonicalValue){const v=completions.get(key(task));return settlement&&v?structuredClone(v):undefined;},
 eventTypes:()=>[COUNT_SOURCE,COUNT_OBSERVE,COUNT_LEARN],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,COUNT_LEARN),
 begin(time:bigint){if(active)fail('already active');active=true;at=time;frame=undefined;currentSource=undefined;unbound=0;attempted=false;outcomes.clear();completions.clear();pending.clear();used.clear();},
 close(){active=false;frame=undefined;currentSource=undefined;unbound=0;outcomes.clear();completions.clear();pending.clear();used.clear();},
 prepareCommit(){if(!active||unbound||pending.size||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished instant');},
 appraise(e:ScheduledEvent,s:AuthoritativeState,input:CanonicalValue){if(!active||e.dueAt!==at||e.phase!==50n||!eq(e.eventTypeId,sid(1001,'event/task-appraisal')))fail('appraisal hook');const reads:ActualReadRecord[]=[],rows:CanonicalValue[]=[];
 const a=rec(input,384n),output=r(384,[f(a,1n),f(a,2n),list(items(f(a,3n),'list').map(v=>{const row=rec(v,383n),bound=settings.find(s=>eq(s.task,f(row,1n)));if(!bound)return v;const progress=countProgress(read(s,countPath(bound.task),reads)),remaining=bound.required-progress.count;rows.push(list([bound.task,u(progress.count),u(bound.required),list(progress.receipts)]));return r(383,[bound.task,remaining>0n?r(382,[u(2),qValue(Q.of(remaining))]):r(382,[u(3)])]);}))]);
 const report=list([text(COUNT+'/appraisal'),u(at),list(rows)]);return {output,report,trace:()=>trace(e,input,[output,report],reads)};},
 execution(e:ScheduledEvent,s:AuthoritativeState,output:CanonicalValue){if(!active||attempted||e.dueAt!==at||e.phase!==110n||!eq(e.eventTypeId,sid(1001,'event/protocol-execution')))fail('execution hook');attempted=true;
 const execution=rec(output,433n),attempt=rec(f(execution,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),choice=chosenData(f(intent,2n)),candidate=f(choice,1n),action=f(rec(candidate,395n),2n);
 const raw=rec(f(rec(f(rec(f(intent,2n),409n),3n),408n),2n),403n),option=items(f(rec(f(raw,2n),398n),3n),'list').find(v=>eq(f(rec(v,397n),1n),candidate)),origins=option?items(f(rec(option,397n),2n),'set'):[];
 const bound=settings.find(s=>eq(s.action,action)&&origins.some(v=>eq(f(rec(v,396n),1n),s.task)));if(!bound)return undefined;if(!frame)fail('counted attempt lacks physical frame');
 const source=frame!.find(v=>eq(v[0],bound.task))!,success=uint(f(execution,3n))!==0n&&source[1]===true,reads:ActualReadRecord[]=[],old=countWorld(read(s,countPath(bound.task,true),reads)),value=list([text(COUNT),u(old.count+(success?1n:0n)),u(at),f(execution,1n)]),x=patch(s,countPath(bound.task,true),value,COUNT_WORLD);outcomes.set(key(bound.task),success);
 return {nextState:x.state,trace:()=>trace(e,settlement?list([output,scheduledEventValue(currentSource!)]):output,[],reads,x.patch,x.diffs)};},
 execute(context:EventHandlerContext<AuthoritativeState>){const {event,state}=context;let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[];
 if(eq(event.eventTypeId,COUNT_SOURCE)){if(!active||frame||event.dueAt!==at||event.phase!==10n||!originals.some(e=>fp(e)===fp(event))||used.has(event.eventId))fail('source origin');frame=countedSource(event.payload,settings);currentSource=structuredClone(event);used.add(event.eventId);emissions=[{dueAt:event.dueAt,phase:120n,eventTypeId:COUNT_OBSERVE,payload:list([]),dependencies:list([])}];}
 else if(eq(event.eventTypeId,COUNT_OBSERVE)){admit(event,120n);if(!frame)fail('no frame');const receipts:CanonicalValue[]=[];
 for(const bound of settings){const occurrence=typedIdentifier(1164,u(context.allocateRuntimeId())),source=frame!.find(v=>eq(v[0],bound.task))!;if(outcomes.has(key(bound.task))&&source[2]===true&&source[3]===true)receipts.push(list([bound.task,occurrence,u(at),bound.mode===1n?true:bound.mode===2n?false:outcomes.get(key(bound.task))!]));}
 const observation=list([text(COUNT+'/observation'),u(at),list(receipts)]);outputs=[observation];emissions=[{dueAt:event.dueAt,phase:140n,eventTypeId:COUNT_LEARN,payload:observation,dependencies:list([])}];}
 else fail('learning requires common stage');
 const binding=bind(event,emissions);return {nextState:state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){binding(children);return [trace(event,event.payload,outputs,[],undefined,undefined,children)];}};
 },
 prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){if(events.length!==1)fail('learning count');const e=events[0];admit(e,140n);const a=items(e.payload,'list');if(a.length!==3||!eq(a[0],text(COUNT+'/observation'))||uint(a[1])!==at)fail('observation association');
 const reads:ActualReadRecord[]=[],updates:{task:CanonicalValue;value:CanonicalValue;status?:CanonicalValue}[]=[];
 for(const v of items(a[2],'list')){const row=items(v,'list'),bound=settings.find(s=>eq(s.task,row[0]))!;if(!bound)fail('receipt task');const status=read(B0,countStatus(bound.task),reads),old=countProgress(read(B0,countPath(bound.task),reads));if(!status||uint(f(rec(status,372n),1n))!==1n||row[3]!==true)continue;
 const receipts=[...old.receipts,list([row[1],u(at)])],value=list([text(COUNT),u(old.count+1n),list(receipts)]);if(old.count+1n>=bound.required)completions.set(key(bound.task),v);updates.push({task:bound.task,value,status:old.count+1n>=bound.required?r(372,[u(2),row[1],signed(at)],4):undefined});}
 let executed=false,finished=false;const rows:CanonicalValue[]=[];
 return {execute(context:EventHandlerContext<AuthoritativeState>){if(executed||finished||fp(e)!==fp(context.event))fail('learning order');executed=true;return {nextState:B0,outputs:[],emittedEvents:[],traceContributions:[]};},
 finish(state:AuthoritativeState){if(!executed||finished)fail('learning completion');finished=true;let current=state;const ops:StatePatch['operations'][number][]=[],diffs:ReturnType<typeof stateModel.applyPatch>['diffs'][number][]=[];
 for(const x of updates){const p=patch(current,countPath(x.task),x.value,GOAL_OWNER);current=p.state;ops.push(...p.patch.operations);diffs.push(...p.diffs);if(x.status){const status=stateModel.read(current,countStatus(x.task)).value;if(!status||uint(f(rec(status,372n),1n))!==1n)fail('same-instant retirement requires declared precedence');const g=patch(current,countStatus(x.task),x.status,GOAL_OWNER);current=g.state;ops.push(...g.patch.operations);diffs.push(...g.diffs);}}
 rows.push(trace(e,e.payload,[],reads,{operations:ops},diffs));return current;},traces(){if(!finished)fail('trace before finish');return rows;}};
 }
 });
}
