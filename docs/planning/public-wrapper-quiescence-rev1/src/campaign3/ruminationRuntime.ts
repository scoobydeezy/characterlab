/** habit-public/0.1-candidate transactional execution and consequence learning. */
import {canonicalEncode as enc,list,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,ZERO,qValue,readQ,choiceAlignment} from '../campaign2/cognitiveMath';
import {habitRecord} from './habitCodecs';
import {ruminationRecord as cr,decodeRumination as decode} from './ruminationCodecs';
const r=(n:number,v:readonly CanonicalValue[]|ReadonlyMap<bigint,CanonicalValue>)=>n>=1320?cr(n,v):habitRecord(n,v);
import {RUMINATION_VERSION,STAGES,OBSERVER,CHARACTER,OPTIONS,TASK,sid,eventId,historyPath,beliefPath,cachePath,goalPath,workspacePath,concernPath,stageReads,stageWrites,owner,pattern,type RuminationCompiled,compileRuminationInputs} from './ruminationModel';
import {ExactRational as Q} from '../substrate/exactMath';
import {receivingRecord as old} from './receivingCodecs';
import {map} from '../substrate/canonicalEncoding';
import {ruminationSummary,ruminationOptions,ruminationRaw,ruminationReasons,ruminationDecision,ruminationObserve,appendRumination} from './ruminationMath';
export function createRuminationRuntime(model:RuminationCompiled,input:Awaited<ReturnType<typeof compileRuminationInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),physical=new Map(input.events.map(e=>[e.dueAt,e.payload]));let active=false,expected=new Map<bigint,string>();const ruminations=new Map<bigint,{instruction:CanonicalValue;evaluation:CanonicalValue}>();
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
   const original=rec(event.payload,1313n),src=rec(f(original,1n),818n),belief=read(beliefPath),journal=read(historyPath)!,goal=rec(read(goalPath)!,1314n),prior=rec(read(workspacePath)!,1316n),activeGoal=f(goal,1n)===true,visible=f(original,6n)===true;
   const concern=rec(read(concernPath)!,1329n),evidence=items(f(concern,1n),'list'),last=evidence.length?rec(evidence[evidence.length-1],1328n):undefined,unresolved=!!last&&uint(items(f(last,3n),'list')[0])===1n,interrupt=visible&&f(original,10n)===true,lastAt=last?f(last,2n):undefined,age=lastAt&&typeof lastAt!=='boolean'&&lastAt.kind==='signed'?event.dueAt-lastAt.value:0n;
   const access=unresolved&&!interrupt&&(model.settings.candidate===1||model.settings.candidate===4&&age%2n===1n),occupied=access||model.settings.candidate===3&&unresolved;
   const maintained=activeGoal&&(visible&&f(original,3n)===true||f(prior,1n)===true&&f(original,4n)===true),card=visible&&f(original,5n)===true,effective=activeGoal&&maintained,inhibited=uint(f(src,2n))===2n&&effective&&!card&&!occupied;
   const next=cr(1316,[maintained,card,occupied,access]);if(key(next)!==key(prior))write(workspacePath,prior,next);
   const summary=ruminationSummary({candidate:1,law:model.settings.law},journal),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,f(src,1n)],[3n,f(src,6n)],[4n,f(src,2n)],[5n,f(rec(summary,824n),f(src,6n)===true?2n:1n)]]);if(belief)fields.set(6n,belief);
   output=cr(1318,[r(826,fields),activeGoal,effective,card,inhibited,concern,access,interrupt,occupied]);ruminations.set(event.dueAt,{instruction:f(original,2n),evaluation:output});
  }
  else if(name==='options'){
   const c=rec(event.payload,1318n),app=rec(f(c,1n),826n),mode=uint(f(app,4n)),admitted=readQ(f(app,5n)).compare(Q.of(1n,2n))>=0,options=mode===1n?[OPTIONS[0]]:mode===3n?[OPTIONS[1]]:admitted&&f(c,5n)!==true?OPTIONS:[OPTIONS[1]];
   output=r(827,[occurrence(),app,list(options)]);
  }
  else if(name==='raw'){
   const base=rec(ruminationRaw(event.payload,occurrence()),1320n),o=rec(event.payload,827n),app=rec(f(o,2n),826n),c=rec(ruminations.get(event.dueAt)!.evaluation,1318n),signals=[...items(f(base,3n),'list')];
   if(uint(f(app,4n))===2n&&f(c,3n)===true)signals.push(old(402,[old(401,[OPTIONS[1],TASK,u(1)]),qValue(ONE),old(400,[map([])])]));output=r(1320,[f(base,1n),event.payload,list(signals)]);
  }
  else if(name==='reasons')output=ruminationReasons(model,event.payload,occurrence());
  else if(name==='decision'){output=await ruminationDecision(event.payload,event.dueAt,occurrence(),input.runSeed);randomDrawRecords=[...items(f(rec(output,1322n),6n),'list')];}
  else if(name==='intent')output=r(1323,[occurrence(),event.payload]);
  else if(name==='expression'){const chosen=f(rec(f(rec(event.payload,1323n),2n),1322n),7n);output=r(1324,[occurrence(),event.payload,list(OPTIONS.map(o=>qValue(choiceAlignment(chosen,new Map(OPTIONS.map(x=>[key(x),key(x)===key(o)?ONE:ZERO]))))))]);}
  else if(name==='plan'){const decision=rec(f(rec(f(rec(event.payload,1324n),2n),1323n),2n),1322n);output=r(1325,[occurrence(),event.payload,f(rec(f(decision,7n),395n),2n)]);}
  else if(name==='attempt')output=r(1326,[occurrence(),event.payload]);
  else if(name==='execute'){const plan=rec(f(rec(event.payload,1326n),2n),1325n),src=rec(f(rec(physical.get(event.dueAt)!,1313n),1n),818n),performed=key(f(plan,3n))===key(f(rec(OPTIONS[0],395n),2n));output=r(1327,[occurrence(),event.payload,performed,f(src,3n)]);}
  else if(name==='observe'){output=ruminationObserve(event.payload,f(rec(physical.get(event.dueAt)!,1313n),1n),occurrence());for(const n of ['history','belief','cache'])emit(n,output);const source=rec(physical.get(event.dueAt)!,1313n),code=uint(f(source,7n)),admitted=f(source,8n)===true&&f(source,9n)===true&&code!==0n,observation=cr(1328,[occurrence(),f(rec(f(source,1n),818n),1n),list(admitted?[u(code)]:[])]);outputs.push(observation);emit('concern',observation);}
  else if(name==='history'){const prior=read(historyPath)!,result=model.settings.candidate===5&&f(rec(ruminations.get(event.dueAt)!.evaluation,1318n),5n)===true?{next:r(820,[list([])]),applied:true}:appendRumination(prior,event.payload);output=r(837,[occurrence(),event.payload,result.applied,prior,result.next]);if(result.applied)write(historyPath,prior,result.next);}
  else if(name==='belief'){const prior=read(beliefPath),obs=rec(event.payload,836n),value=obs.fields.get(5n),next=value===undefined?prior:r(822,[value,f(obs,1n)]),fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,event.payload],[3n,value!==undefined]]);if(prior)fields.set(4n,prior);if(next)fields.set(5n,next);output=r(838,fields);if(value!==undefined)write(beliefPath,prior,next!);}
  else if(name==='concern'){const prior=read(concernPath)!,obs=rec(event.payload,1328n),xs=items(f(rec(prior,1329n),1n),'list'),present=items(f(obs,3n),'list').length===1,next=present?cr(1329,[list([...xs,obs])]):prior;output=cr(1331,[obs,prior,next]);if(present)write(concernPath,prior,next);}
  else {const prior=rec(read(goalPath)!,1314n),instruction=uint(ruminations.get(event.dueAt)!.instruction),next=instruction===0n?prior:cr(1314,[instruction===1n]);occurrence();output=cr(1319,[prior,next]);if(key(prior)!==key(next))write(goalPath,prior,next);}
  decode(enc(output!));outputs.push(output!);if(index<10)emit(STAGES[index+1][0],output!);
  const source=rec(physical.get(event.dueAt)!,1313n),op=rec(f(source,1n),818n);
  const safeInput=name==='appraise'?list([f(op,1n),f(op,2n),f(op,6n),f(source,2n),f(source,6n)===true&&f(source,3n)===true,f(source,4n),f(source,6n)===true&&f(source,5n)===true,f(source,6n)===true&&f(source,10n)===true]):['raw','history','cache'].includes(name)?list([event.payload,ruminations.get(event.dueAt)!.evaluation,ruminations.get(event.dueAt)!.instruction]):event.payload;

  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('habit child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('habit child binding');expected.set(e.eventId,key(scheduledEventValue(e)));});const sourceRecordIds:ReturnType<typeof id>[]=[];if(!['appraise','options'].includes(name)&&typeof event.payload!=='boolean'&&event.payload.kind==='record')sourceRecordIds.push(id(f(event.payload,1n)));const trace=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/habit/'+name),seamVersion:RUMINATION_VERSION,recordKind:event.eventTypeId,subjectIds:[OBSERVER,CHARACTER],sourceRecordIds,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:safeInput,outputProjection:list(outputs),randomDrawRecords,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});decode(enc(trace));return [trace];}};
 }
 const scheduler=new DeterministicScheduler({initialState:model.initial,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:15n,invariants:[state=>{if(expected.size)fail('unconsumed habit children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('habit concurrent settlement');active=true;expected=new Map();ruminations.clear();try{return instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();}finally{active=false;expected.clear();ruminations.clear();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list([])}),diagnostic:()=>scheduler.failureDiagnostic};
}

