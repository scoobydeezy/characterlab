import {canonicalEncode as enc,list,text,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,type ActualReadRecord,type StatePatch,type StructuralMutationDiff} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {chosenData,intentOutput,expressionOutput,planOutput,attemptOutput} from '../campaign2/cognitiveChoice';
import {OPTIONS} from './longitudinalModel';
import {receivingRecord} from './receivingCodecs';
import {VERSION,actor,sid,eventId,path,pattern,owner,reads,writes,stages,historyOwner,historyValue,projectionValue,packed,unpack,type IntegrationCompiled,compileIntegrationInputs} from './valuesIntegrationPublicModel';
import {projectionData} from './valuesPublicModel';
import {valuesNativeChoice,valuesPublicRows} from './valuesPublicMath';
import {appraiseValues,integrationReasons,executeValuesAttempt,advanceValuesWorld,observeValues,settleValuesGoal,hex,type IntegrationFrame,type IntegrationGoal,type IntegrationWorld,type IntegrationObservation} from './valuesIntegration';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
type Context=Omit<IntegrationFrame,'world'|'observation'>;
export function createIntegrationPublicRuntime(model:IntegrationCompiled,input:Awaited<ReturnType<typeof compileIntegrationInputs>>){
 let active=false,expected=new Map<bigint,string>(),pending:string[]=[],committed:string[]=[];
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),sources=new Map(input.frames.map(x=>[x.instant,structuredClone(x)]));
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',s);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive Values integration');const index=stages.findIndex(([n])=>key(eventId(n))===key(event.eventTypeId)),stage=stages[index];if(!stage||event.phase!==BigInt(stage[1]))fail('VI phase');
  const name=stage[0],fingerprint=key(scheduledEventValue(event)),at=Number(event.dueAt);
  if(name==='source'){if(originals.get(event.eventId)!==fingerprint)fail('VI original');}else{if(expected.get(event.eventId)!==fingerprint)fail('VI child');expected.delete(event.eventId);}
  allocateRuntimeId();const domain=reads(model.law,name),actualReadRecords:ActualReadRecord[]=[],outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[];
  const read=(root:number)=>{if(!domain.some(p=>p.rootStateTypeId===BigInt(root)))fail('VI read');const p=path(root),v=state.read(p);actualReadRecords.push({accessorId:sid(1028,'accessor/values-integration/'+name),path:p,presence:v.presence,value:v.value,derivedSources:[]});if(!v.presence)fail('VI missing state');return v.value!;};
  const put=(values:CanonicalValue[])=>{patch={operations:writes(model.law,name).map((p,i)=>({kind:'set' as const,path:p,expected:{presence:true as const,value:state.read(p).value!},newValue:values[i]}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  const view=(instant=at)=>{const o=historyOwner(model.law,read(1516));return model.law==='Refold'?o.view(instant):projectionData(read(1517));};
  // Packet slots contain only safe cognitive operands. World execution is output
  // as a diagnostic, never forwarded to the goal, forecast or learning owners.
  let packet:CanonicalValue[];
  if(name==='source'){
   const {world:_,observation:__,...context}=unpack<IntegrationFrame>(event.payload,1521);packet=[packed(1528,context),...Array.from({length:10},()=>list([]))];
  }else packet=[...items(event.payload,'list')];
  const context=unpack<Context>(packet[0],1528),optional=(i:number)=>items(packet[i],'list')[0]??null;
  const set=(i:number,x:CanonicalValue|null)=>{packet[i]=list(x?[x]:[]);if(x)outputs.push(x);};
  const occ=(ns:number,offset:number)=>typedIdentifier(ns,u(at*100+offset));
  if(name==='appraisal'){
   const before=view(),goal=unpack<IntegrationGoal>(read(1523),1523),forecast=unpack<0|1|null>(read(1524),1524);
   set(1,projectionValue(before));set(2,packed(1525,appraiseValues(before,forecast,goal,context,model.appraisal)));
  }else if(name==='reasons')set(3,integrationReasons({law:model.law,appraisal:model.appraisal,seed:input.runSeed[0]},context,view(),unpack(read(1523),1523)));
  else if(name==='choice'){
   if(optional(3)){const result=await valuesNativeChoice(optional(3)!);outputs.push(result.output);pending.push(...result.addresses);set(4,valuesPublicRows([result.output])[0].resolution);}
  }else if(name==='intent'){
   const resolution=optional(4);if(resolution&&uint(f(rec(f(rec(resolution,409n),4n),419n),1n))===3n)set(5,intentOutput(occ(1136,1),resolution));
  }else if(name==='expression'){if(optional(5))set(6,expressionOutput(occ(1137,2),optional(5)!));}
  else if(name==='plan'){if(optional(5))set(7,planOutput(occ(1139,3),optional(5)!,receivingRecord(391,[u(1)])));}
  else if(name==='attempt'){if(optional(7))set(8,attemptOutput(occ(1140,4),optional(7)!));}
  else if(name==='world'){
   const physical=sources.get(at)!.world,execution=executeValuesAttempt(at,optional(8),physical.permitted),prior=unpack<IntegrationWorld>(read(1522),1522);
   const resolution=optional(4),chosen=resolution?resolutionChoice(resolution):null;
   const after=advanceValuesWorld(prior,at,chosen,!!execution&&uint(f(rec(execution,433n),3n))>0n,physical);put([packed(1522,after)]);if(execution)outputs.push(execution);
  }else if(name==='observation')set(9,packed(1526,observeValues(unpack<IntegrationWorld>(read(1522),1522),sources.get(at)!.observation)));
  else if(name==='goal')put([packed(1523,settleValuesGoal(unpack(read(1523),1523),at,context.command,unpack(optional(9)!,1526)))]);
  else if(name==='consolidate'){
   const o=historyOwner(model.law,read(1516));if(model.law!=='Refold')read(1517);const observation=unpack<IntegrationObservation>(optional(9)!,1526);
   if(observation.receipt)o.admit(observation.receipt);put(model.law==='Refold'?[historyValue(o)]:[historyValue(o),projectionValue(o.view(65))]);
  }else if(name==='forecast'){
   const observation=unpack<IntegrationObservation>(optional(9)!,1526),prior=unpack<0|1|null>(read(1524),1524),forecast=observation.forecast??prior;put([packed(1524,forecast)]);
   const resolution=optional(4),goal=unpack<IntegrationGoal>(read(1523),1523),after=view(65);
   outputs.push(packed(1529,{instant:at,before:projectionData(optional(1)!),after,appraisal:unpack(optional(2)!,1525),chosen:resolution?resolutionChoice(resolution):null,status:resolution?resolutionStatus(resolution):'NoOpportunity',observation,goal,forecast,intent:optional(5)?hex(enc(optional(5)!)):null,expression:optional(6)?hex(enc(optional(6)!)):null,resolution:resolution?hex(enc(resolution)):null}));
  }
  if(index+1<stages.length){const [n,phase]=stages[index+1];emittedEvents.push({dueAt:event.dueAt,phase:BigInt(phase),eventTypeId:eventId(n),payload:list(packet),dependencies:list([])});}
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('VI child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('VI parent');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/values-integration/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[actor],sourceRecordIds:[],registeredReadDomain:domain.map(pattern),actualReadRecords,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(stages.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('VI pending');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('VI concurrent');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();pending=[];try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)committed.push(...pending);return result;}finally{active=false;expected.clear();pending=[];}}
 return guardPublicWrapperSettlement({settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:committed.slice()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(committed.map(text))}),diagnostic:()=>scheduler.failureDiagnostic});
}
function resolutionStatus(resolution:CanonicalValue){const s=uint(f(rec(f(rec(resolution,409n),4n),419n),1n));return s===3n?'Chosen':s===1n?'NoCandidates':'NoReasons';}
function resolutionChoice(resolution:CanonicalValue):'A'|'B'|null {
 if(resolutionStatus(resolution)!=='Chosen')return null;
 return key(f(chosenData(resolution),1n))===key(OPTIONS[0])?'A':'B';
}
