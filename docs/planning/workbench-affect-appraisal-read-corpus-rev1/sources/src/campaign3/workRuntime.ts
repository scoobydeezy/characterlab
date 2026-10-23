/** Registered scheduler adapter. Only the factory exposes public execution. */
import {canonicalEncode as enc,list,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {workRecord as r,decodeWork as decode} from './workCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {WORK_VERSION,STAGES,OBSERVER,CHARACTER,TASKS,wid,eventId,journalPath,cachePath,taskPath,stageReads,owner,pattern,type WorkCompiled,compileWorkInputs} from './workModel';
import {observeWork,workspaceOutput} from './workSelection';
import {workRaw,workReasons,workDecision} from './workMath';
export function createWorkRuntime(model:WorkCompiled,input:Awaited<ReturnType<typeof compileWorkInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 let active=false,expected=new Map<bigint,string>();
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive workspace transaction');
  const index=STAGES.findIndex(([n])=>key(event.eventTypeId)===key(eventId(n)));if(index<0)fail('unknown workspace stage');const [name,phase]=STAGES[index];if(event.phase!==BigInt(phase))fail('workspace phase');
  const fingerprint=key(scheduledEventValue(event));if(['workspace','world','deadline'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('workspace original association');}else{if(expected.get(event.eventId)!==fingerprint)fail('workspace generated association');expected.delete(event.eventId);}
  const occurrence=()=>typedIdentifier(1152,u(allocateRuntimeId())),reads:ActualReadRecord[]=[],paths=stageReads(name,model.settings),domain=paths.map(pattern);
  const pk=(p:StatePath)=>key(list([u(p.rootStateTypeId),u(p.fieldId),...p.selectors.map(s=>s.kind==='mapKey'?s.key:false)]));
  const read=(p:StatePath)=>{if(!paths.some(v=>pk(v)===pk(p)))return fail('workspace unregistered read');const prior=state.read(p);reads.push({accessorId:wid(1028,'accessor/work/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[];
  const write=(p:StatePath,prior:CanonicalValue|undefined,value:CanonicalValue)=>{patch={operations:[{kind:'set',path:p,expected:prior?{presence:true,value:prior}:{presence:false},newValue:value}]};const result=applyStatePatch(state,patch,owner(name),model.authority);nextState=result.state;diffs=result.diffs;};
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  let output:CanonicalValue|undefined;
  if(name==='workspace'){
   const journal=read(journalPath),frames=journal?items(f(rec(journal,780n),1n),'list'):[],statuses=TASKS.map(t=>read(taskPath(t))??fail('missing adopted task')),cached=model.settings.candidate===1?read(cachePath):undefined;
   output=workspaceOutput(model.settings,event.dueAt,occurrence(),frames,statuses,cached?items(f(rec(cached,781n),1n),'list').map(v=>Number(uint(v))):[]);
   if(model.settings.candidate===1)write(cachePath,cached,r(781,[f(rec(output,773n),4n)]));
  }else if(name==='raw')output=workRaw(event.payload,occurrence());
  else if(name==='reasons')output=workReasons(model,event.payload,occurrence());
  else if(name==='decision'){output=await workDecision(model,event.payload,event.dueAt,occurrence(),input.runSeed);randomDrawRecords=[...items(f(rec(output,776n),6n),'list')];}
  else if(name==='intent')output=r(777,[occurrence(),event.payload]);
  else if(name==='world')emit('observe',event.payload);
  else if(name==='observe'){output=observeWork(event.payload,occurrence());emit('append',output);}
  else if(name==='append'){const prior=read(journalPath),frames=prior?items(f(rec(prior,780n),1n),'list'):[];write(journalPath,prior,r(780,[list([...frames,event.payload])]));}
  else if(name==='deadline'){const p=taskPath(event.payload),prior=read(p);if(prior&&uint(f(rec(prior,372n),1n))===1n)write(p,prior,old(372,[u(3)]));}
  if(output)outputs.push(output);if(index<4){if(!output)fail('workspace missing cognitive output');emit(STAGES[index+1][0],output!);}
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('workspace child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('workspace child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   const sourceRecordIds:ReturnType<typeof id>[]=[];if(!['workspace','world','observe','deadline'].includes(name)){const value=event.payload;if(typeof value!=='boolean'&&value.kind==='record')sourceRecordIds.push(id(f(value,1n)));}
   const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:wid(1036,'seam/work/'+name),seamVersion:WORK_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));return [trace];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:model.initial,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:10n,invariants:[state=>{if(expected.size)fail('unconsumed workspace children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('workspace concurrent settlement');active=true;expected=new Map();try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}
