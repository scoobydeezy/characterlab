/** Registered scheduler adapter. Only the factory exposes public execution. */
import {canonicalEncode as enc,list,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {skillRecord as r,decodeSkill as decode} from './skillCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {SKILL_VERSION,STAGES,OBSERVER,CHARACTER,TASK,sid,eventId,skillPath,beliefPath,taskPath,stageReads,owner,pattern,type SkillCompiled,compileSkillInputs} from './skillModel';
import {skillRaw,skillReasons,skillDecision,skillExecute,skillObserve,adaptSkill,learnSkill} from './skillMath';
export function createSkillRuntime(model:SkillCompiled,input:Awaited<ReturnType<typeof compileSkillInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 const physical=new Map(input.events.map(e=>[e.dueAt,e.payload]));
 let active=false,expected=new Map<bigint,string>();
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive skill transaction');
  const index=STAGES.findIndex(([n])=>key(event.eventTypeId)===key(eventId(n)));if(index<0)fail('unknown skill stage');const [name,phase]=STAGES[index];if(event.phase!==BigInt(phase))fail('skill phase');
  const fingerprint=key(scheduledEventValue(event));if(name==='appraise'){if(originals.get(event.eventId)!==fingerprint)fail('skill original association');}else{if(expected.get(event.eventId)!==fingerprint)fail('skill generated association');expected.delete(event.eventId);}
  const occurrence=()=>typedIdentifier(1153,u(allocateRuntimeId())),reads:ActualReadRecord[]=[],paths=stageReads(name,model.settings),domain=paths.map(pattern);
  const pk=(p:StatePath)=>key(list([u(p.rootStateTypeId),u(p.fieldId),...p.selectors.map(s=>s.kind==='mapKey'?s.key:false)]));
  const read=(p:StatePath)=>{if(!paths.some(v=>pk(v)===pk(p)))return fail('skill unregistered read');const prior=state.read(p);reads.push({accessorId:sid(1028,'accessor/skill/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[];
  const write=(p:StatePath,prior:CanonicalValue|undefined,value:CanonicalValue)=>{patch={operations:[{kind:'set',path:p,expected:prior?{presence:true,value:prior}:{presence:false},newValue:value}]};const result=applyStatePatch(state,patch,owner(name),model.authority);nextState=result.state;diffs=result.diffs;};
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  let output:CanonicalValue|undefined;
  if(name==='appraise'){const prior=read(beliefPath);output=r(788,[occurrence(),signed(event.dueAt),...(prior?[prior]:[])]);}
  else if(name==='raw'){const task=read(taskPath);output=skillRaw(event.payload,!!task&&uint(f(rec(task,372n),1n))===1n,occurrence());}
  else if(name==='reasons')output=skillReasons(model,event.payload,occurrence());
  else if(name==='decision')output=skillDecision(event.payload,occurrence());
  else if(name==='intent')output=r(792,[occurrence(),event.payload]);
  else if(name==='expression'){const decision=rec(f(rec(event.payload,792n),2n),791n);output=r(793,[occurrence(),event.payload,list(decision.fields.has(4n)?[q(1,1)]:[])]);}
  else if(name==='plan'){const intent=rec(f(rec(event.payload,793n),2n),792n),decision=rec(f(intent,2n),791n),option=decision.fields.get(4n);output=r(794,[occurrence(),event.payload,...(option?[f(rec(option,395n),2n)]:[])]);}
  else if(name==='attempt')output=r(795,[occurrence(),event.payload]);
  else if(name==='execute'){
   const skill=read(skillPath)??fail('missing skill'),belief=model.settings.executionLaw===3?read(beliefPath):undefined,original=physical.get(event.dueAt)??fail('missing physical opportunity');
   output=skillExecute(model.settings,event.payload,original,skill,belief,occurrence());
   const outcome=rec(output,796n),practice=r(798,[occurrence(),f(rec(event.payload,795n),1n),f(outcome,6n),f(outcome,8n),f(outcome,4n)]);outputs.push(practice);emit('observe',output);emit('adapt',practice);
  }else if(name==='observe'){output=skillObserve(event.payload,physical.get(event.dueAt)??fail('missing observer apparatus'),occurrence());emit('learn',output);}
  else if(name==='adapt'){const prior=read(skillPath)??fail('missing skill'),result=adaptSkill(model.settings,prior,event.payload);output=r(799,[occurrence(),event.payload,prior,result.next,result.applied]);if(result.applied)write(skillPath,prior,result.next);}
  else if(name==='learn'){const prior=read(beliefPath),result=learnSkill(model.settings,prior,event.payload),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,event.payload],[3n,result.applied]]);if(prior)fields.set(4n,prior);if(result.next)fields.set(5n,result.next);output=r(800,fields);if(result.applied)write(beliefPath,prior,result.next!);}
  if(output)outputs.push(output);if(index<8){if(!output)fail('skill missing cognitive output');emit(STAGES[index+1][0],output!);}
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('skill child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('skill child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});
   const sourceRecordIds:ReturnType<typeof id>[]=[];if(name!=='appraise'){const value=event.payload;if(typeof value!=='boolean'&&value.kind==='record')sourceRecordIds.push(id(f(value,1n)));}
   const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/skill/'+name),seamVersion:SKILL_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:name==='appraise'?list([]):event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));return [trace];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:model.initial,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:12n,invariants:[state=>{if(expected.size)fail('unconsumed skill children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('skill concurrent settlement');active=true;expected=new Map();try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}

