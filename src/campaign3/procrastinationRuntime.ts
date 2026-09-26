/** habit-public/0.1-candidate transactional execution and consequence learning. */
import {canonicalEncode as enc,list,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,qValue,readQ,choiceAlignment} from '../campaign2/cognitiveMath';
import {habitRecord} from './habitCodecs';
import {procrastinationRecord as cr,decodeProcrastination as decode} from './procrastinationCodecs';
const r=(n:number,v:readonly CanonicalValue[]|ReadonlyMap<bigint,CanonicalValue>)=>n>=1362?cr(n,v):habitRecord(n,v);
import {PROCRASTINATION_VERSION,STAGES,OBSERVER,CHARACTER,OPTIONS,TASK,LEISURE,sid,eventId,historyPath,beliefPath,cachePath,goalPath,workspacePath,forecastPath,stageReads,stageWrites,owner,pattern,type ProcrastinationCompiled,compileProcrastinationInputs} from './procrastinationModel';
import {ExactRational as Q} from '../substrate/exactMath';
import {receivingRecord as old} from './receivingCodecs';
import {map} from '../substrate/canonicalEncoding';
import {procrastinationSummary,procrastinationOptions,procrastinationRaw,procrastinationReasons,procrastinationDecision,procrastinationObserve,appendProcrastination} from './procrastinationMath';
export function createProcrastinationRuntime(model:ProcrastinationCompiled,input:Awaited<ReturnType<typeof compileProcrastinationInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),physical=new Map(input.events.map(e=>[e.dueAt,e.payload]));let active=false,expected=new Map<bigint,string>();const procrastinations=new Map<bigint,{instruction:CanonicalValue;evaluation:CanonicalValue}>();
 const fail=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
 // Cross-leaf cache equality is a committed-instant invariant, not an intermediate patch invariant.
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:(s:AuthoritativeState)=>{decode(enc(s.canonicalValue()));},canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive habit transaction');const index=STAGES.findIndex(([n])=>key(event.eventTypeId)===key(eventId(n)));if(index<0)fail('unknown habit stage');const [name,phase]=STAGES[index];if(event.phase!==BigInt(phase))fail('habit phase');const fingerprint=key(scheduledEventValue(event));if(name==='appraise'){if(originals.get(event.eventId)!==fingerprint)fail('habit original association');}else{if(expected.get(event.eventId)!==fingerprint)fail('habit generated association');expected.delete(event.eventId);}
  const occurrence=()=>typedIdentifier(1155,u(allocateRuntimeId())),reads:ActualReadRecord[]=[],paths=stageReads(name,model.settings),domain=paths.map(pattern),pk=(p:StatePath)=>key(list([u(p.rootStateTypeId),u(p.fieldId),...p.selectors.map(s=>s.kind==='mapKey'?s.key:false)]));
  const read=(p:StatePath)=>{if(!paths.some(v=>pk(v)===pk(p)))return fail('habit unregistered read');const prior=state.read(p);reads.push({accessorId:sid(1028,'accessor/habit/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[];
  const write=(p:StatePath,prior:CanonicalValue|undefined,value:CanonicalValue)=>{if(!stageWrites(name,model.settings).some(x=>pk(x)===pk(p)))fail('habit unregistered write');patch={operations:[{kind:'set',path:p,expected:prior?{presence:true,value:prior}:{presence:false},newValue:value}]};const result=applyStatePatch(state,patch,owner(name),model.authority);nextState=result.state;diffs=result.diffs;};
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  let output:CanonicalValue;
  if(name==='appraise'){
   const original=rec(event.payload,1355n),src=rec(f(original,1n),818n),belief=read(beliefPath),journal=read(historyPath)!,goal=rec(read(goalPath)!,1356n),prior=rec(read(workspacePath)!,1358n),activeGoal=f(goal,1n)===true,visible=f(original,6n)===true;
   const forecast=rec(read(forecastPath)!,1371n),evidence=items(f(forecast,1n),'list'),last=evidence.length?rec(evidence[evidence.length-1],1370n):undefined,known=!!last,future=last?items(f(last,3n),'list')[0]===true:false,discounted=model.settings.candidate===3||model.settings.candidate!==2&&known&&future&&event.dueAt<6n;
   const maintained=activeGoal&&(visible&&f(original,3n)===true||f(prior,1n)===true&&f(original,4n)===true),immediate=visible&&f(original,5n)===true,feasible=visible&&f(src,6n)===true,value=discounted?Q.of(1n,4n):ONE;
   const next=cr(1358,[maintained,immediate,discounted,known]);if(key(next)!==key(prior))write(workspacePath,prior,next);
   const fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,f(src,1n)],[3n,feasible],[4n,f(src,2n)],[5n,qValue(value)]]);
   output=cr(1360,[r(1375,fields),activeGoal,maintained,immediate,feasible,forecast,discounted,known,u(known?(future?2:1):0)]);procrastinations.set(event.dueAt,{instruction:f(original,2n),evaluation:output});
  }
  else if(name==='options'){
   const c=rec(event.payload,1360n),app=rec(f(c,1n),1375n),options=f(c,2n)===true&&f(c,3n)===true&&f(c,5n)===true?OPTIONS:[OPTIONS[1]];
   output=r(1376,[occurrence(),app,list(options)]);
  }
  else if(name==='raw'){
   const o=rec(event.payload,1376n),app=rec(f(o,2n),1375n),c=rec(procrastinations.get(event.dueAt)!.evaluation,1360n),present=items(f(o,3n),'list').some(x=>key(x)===key(OPTIONS[0])),signals:CanonicalValue[]=[];
   if(present)signals.push(old(402,[old(401,[OPTIONS[0],TASK,u(1)]),f(app,5n),old(400,[map([])])]));
   if(f(c,4n)===true&&model.settings.candidate!==4)signals.push(old(402,[old(401,[OPTIONS[1],LEISURE,u(1)]),qValue(ONE),old(400,[map([])])]));output=r(1362,[occurrence(),event.payload,list(signals)]);
  }
  else if(name==='reasons')output=procrastinationReasons(model,event.payload,occurrence());
  else if(name==='decision'){output=await procrastinationDecision(event.payload,event.dueAt,occurrence(),input.runSeed);randomDrawRecords=[...items(f(rec(output,1364n),6n),'list')];}
  else if(name==='intent')output=r(1365,[occurrence(),event.payload]);
  else if(name==='expression'){const chosen=f(rec(f(rec(event.payload,1365n),2n),1364n),7n);output=r(1366,[occurrence(),event.payload,list(OPTIONS.map(o=>qValue(choiceAlignment(chosen,new Map(OPTIONS.map(x=>[key(x),key(x)===key(o)?ONE:ZERO]))))))]);}
  else if(name==='plan'){const decision=rec(f(rec(f(rec(event.payload,1366n),2n),1365n),2n),1364n);output=r(1367,[occurrence(),event.payload,f(rec(f(decision,7n),395n),2n)]);}
  else if(name==='attempt')output=r(1368,[occurrence(),event.payload]);
  else if(name==='execute'){const plan=rec(f(rec(event.payload,1368n),2n),1367n),src=rec(f(rec(physical.get(event.dueAt)!,1355n),1n),818n),performed=key(f(plan,3n))===key(f(rec(OPTIONS[0],395n),2n))&&f(rec(physical.get(event.dueAt)!,1355n),10n)===true&&f(rec(physical.get(event.dueAt)!,1355n),11n)!==true;output=r(1369,[occurrence(),event.payload,performed,f(src,3n)]);}
  else if(name==='observe'){output=procrastinationObserve(event.payload,f(rec(physical.get(event.dueAt)!,1355n),1n),occurrence());for(const n of ['history','belief','cache'])emit(n,output);const source=rec(physical.get(event.dueAt)!,1355n),code=uint(f(source,7n)),admitted=f(source,8n)===true&&f(source,9n)===true&&code!==0n,observation=cr(1370,[occurrence(),f(rec(f(source,1n),818n),1n),list(admitted?[code===2n]:[])]);outputs.push(observation);emit('forecast',observation);}
  else if(name==='history'){const prior=read(historyPath)!,result=appendProcrastination(prior,event.payload);output=r(837,[occurrence(),event.payload,result.applied,prior,result.next]);if(result.applied)write(historyPath,prior,result.next);}
  else if(name==='belief'){const prior=read(beliefPath),obs=rec(event.payload,836n),value=obs.fields.get(5n),next=value===undefined?prior:r(822,[value,f(obs,1n)]),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,event.payload],[3n,value!==undefined]]);if(prior)fields.set(4n,prior);if(next)fields.set(5n,next);output=r(838,fields);if(value!==undefined)write(beliefPath,prior,next!);}
  else if(name==='forecast'){const prior=read(forecastPath)!,obs=rec(event.payload,1370n),xs=items(f(rec(prior,1371n),1n),'list'),present=items(f(obs,3n),'list').length===1,next=present?cr(1371,[list([...xs,obs])]):prior;output=cr(1373,[obs,prior,next]);if(present)write(forecastPath,prior,next);}
  else {const prior=rec(read(goalPath)!,1356n),instruction=uint(procrastinations.get(event.dueAt)!.instruction),obs=rec(event.payload,836n);let status=uint(f(prior,2n)),progress=uint(f(prior,4n));if(instruction===1n)status=1n;else if(instruction===2n){if(status!==1n)fail('cancel inactive goal');status=3n;}else if(status===1n){if(f(obs,4n)===true&&obs.fields.get(5n)===true)progress=progress<3n?progress+1n:3n;if(progress===3n)status=2n;else if(event.dueAt>=6n)status=4n;}const next=cr(1356,[status===1n,u(status),f(prior,3n),u(progress)]);occurrence();output=cr(1361,[prior,next]);if(key(prior)!==key(next))write(goalPath,prior,next);}

  decode(enc(output!));outputs.push(output!);if(index<10)emit(STAGES[index+1][0],output!);
  const source=rec(physical.get(event.dueAt)!,1355n),op=rec(f(source,1n),818n);
  const safeInput=name==='appraise'?list([f(op,1n),f(op,2n),f(op,6n),f(source,2n),f(source,6n)===true&&f(source,3n)===true,f(source,4n),f(source,6n)===true&&f(source,5n)===true]):['raw','history','cache'].includes(name)?list([event.payload,procrastinations.get(event.dueAt)!.evaluation,procrastinations.get(event.dueAt)!.instruction]):event.payload;

  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('habit child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('habit child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});const sourceRecordIds:ReturnType<typeof id>[]=[];if(!['appraise','options'].includes(name)&&typeof event.payload!=='boolean'&&event.payload.kind==='record')sourceRecordIds.push(id(f(event.payload,1n)));const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/habit/'+name),seamVersion:PROCRASTINATION_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:safeInput,outputProjection:list(outputs),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));return [trace];}};
 }
 const scheduler=new DeterministicScheduler({initialState:model.initial,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:15n,invariants:[state=>{if(expected.size)fail('unconsumed habit children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('habit concurrent settlement');active=true;expected=new Map();procrastinations.clear();try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();procrastinations.clear();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}

