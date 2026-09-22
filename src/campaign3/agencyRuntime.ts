/** agency-public/0.1-candidate: registered owners, causal lifecycle and selective witnesses. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ONE,readQ,compileReasonNuclei,appendIdentityContribution} from '../campaign2/cognitiveMath';
import {rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {createCognitiveRandomSession,arbitrationOutput} from '../campaign2/cognitiveArbitration';
import {intentOutput,expressionOutput,planOutput,attemptOutput,chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {biographyContext} from './longitudinalMath';
import {agencyRecord as r,decodeAgency as decode} from './agencyCodecs';
import {VERSION,STAGES,OBSERVERS,BLOCKERS,ACTOR,sid,eventId,historyPath,personPath,index,localEpisode,localActor,pattern,owner,reads,writes,type AgencyCompiled,compileAgencyInputs} from './agencyModel';
import {agencyKnowledge} from './agencyMath';
export function createAgencyRuntime(model:AgencyCompiled,input:Awaited<ReturnType<typeof compileAgencyInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))])),world=new Map(input.events.map(e=>[e.dueAt,rec(e.payload,973n)])),random=createCognitiveRandomSession(input.runSeed);let active=false,expected=new Map<bigint,string>();const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive agency transaction');const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage)fail('agency stage');const [name,phase]=stage!;if(event.phase!==BigInt(phase))fail('agency phase');const fingerprint=key(scheduledEventValue(event));if(['context','probe-a','probe-b','report'].includes(name)){if(originals.get(event.eventId)!==fingerprint)fail('agency original');}else{if(expected.get(event.eventId)!==fingerprint)fail('agency generated');expected.delete(event.eventId);}
  const occurrence=(ns=1163)=>typedIdentifier(ns,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p))),read=(p:StatePath)=>{if(!paths.some(x=>pk(x)===pk(p)))return fail('agency read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/agency/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],randomDrawRecords:CanonicalValue[]=[],quantizationOperations:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])}),write=(changes:{path:StatePath;prior:CanonicalValue|undefined;next:CanonicalValue}[])=>{if(changes.some(c=>!writes(name).some(p=>pk(p)===pk(c.path))))fail('agency write domain');patch={operations:changes.map(c=>({kind:'set' as const,path:c.path,expected:c.prior?{presence:true as const,value:c.prior}:{presence:false as const},newValue:c.next}))};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  if(name==='context') {
   if(uint(f(rec(event.payload,973n),2n))===1n) emit('raw',biographyContext(event.dueAt,occurrence));
  } else if(name==='raw') {
   const result=rawSignalOutput(occurrence(1133),event.payload,false,ONE,()=>undefined);quantizationOperations=result.quantizationOperations;outputs.push(result.output);emit('reasons',result.output);
  } else if(name==='reasons') {
   const out=old(408,[occurrence(1134),event.payload,list(compileReasonNuclei(items(f(rec(event.payload,403n),3n),'set'),f(model.content,4n)))]);outputs.push(out);emit('decision',out);
  } else if(name==='decision') {
   const root=typedIdentifier(1135,u(event.dueAt)),out=await arbitrationOutput(root,event.dueAt,event.payload,old(440,[q(1,2),q(1,2)]),random.forResolution(root,event.payload));outputs.push(out);
   if(uint(f(rec(f(rec(out,409n),4n),419n),1n))!==3n)fail('agency chosen action required');
   const data=chosenData(out);randomDrawRecords=items(f(data,9n),'list').map(v=>f(rec(v,422n),5n));const tie=rec(f(data,10n),423n);if(uint(f(tie,1n))===2n)randomDrawRecords.push(f(tie,3n));emit('intent',out);
  } else if(name==='intent') {
   const intent=intentOutput(occurrence(1136),event.payload);outputs.push(intent);emit('expression',intent);
  } else if(name==='expression') {
   const expression=expressionOutput(occurrence(1137),event.payload);outputs.push(expression);emit('plan',expression);
  } else if(name==='plan') {
   const expression=rec(event.payload,426n),out=planOutput(occurrence(1139),f(expression,2n),old(391,[u(1)]));outputs.push(out);emit('attempt',list([out,expression]));
  } else if(name==='attempt') {
   const pair=items(event.payload,'list'),out=attemptOutput(occurrence(1140),pair[0]),attempt=r(988,[occurrence(),signed(event.dueAt),f(world.get(event.dueAt)!,3n),out,pair[1]]);outputs.push(out,attempt);emit('execution',attempt);
  } else if(name==='execution') {
   const original=world.get(event.dueAt)!,block=Number(uint(f(original,5n))),competent=f(original,4n)===true,out=r(974,[occurrence(),signed(event.dueAt),event.payload,competent,list(block?[BLOCKERS[block-1]]:[]),competent&&block===0]);
   outputs.push(out);emit('history',out);emit('observe-a',out);emit('observe-b',out);
  } else if(name==='report') {
   emit('observe-a',event.payload);emit('observe-b',event.payload);
  } else if(name.startsWith('observe')) {
   const i=index(name),original=world.get(event.dueAt)!,kind=uint(f(original,2n)),episode=Number(uint(f(original,3n))),ep=localEpisode(i,episode),ids=[occurrence(),occurrence()],observations:CanonicalValue[]=[];
   const access=(field:bigint)=>items(f(original,field),'set').some(v=>uint(v)===BigInt(i+1));
   if(kind===1n) {
    const truth=rec(event.payload,974n),block=Number(uint(f(original,5n)));
    if(access(6n)) observations.push(r(975,[ids[0],OBSERVERS[i],signed(event.dueAt),ep,u(1),f(truth,6n),sid(1027,`visible/agency/${i}/outcome/${episode}`),list([])]));
    if(block&&(access(7n)||model.law===4)) observations.push(r(975,[ids[1],OBSERVERS[i],signed(event.dueAt),ep,u(2),true,sid(1027,`visible/agency/${i}/block/${episode}`),list([localActor(i,block)])]));
   } else if(access(10n)) observations.push(r(975,[ids[0],OBSERVERS[i],signed(event.dueAt),ep,u(3),f(original,9n),sid(1027,`visible/agency/${i}/receipt/${uint(f(original,8n))}`),list([])]));
   outputs.push(...observations);emit(i===0?'evidence-a':'evidence-b',list(observations));
  } else if(name.startsWith('evidence')) {
   const i=index(name),observations=items(event.payload,'list');
   if(observations.some(o=>key(f(rec(o,975n),2n))!==key(OBSERVERS[i])))fail('agency foreign observation');
   const admitted=model.law===3?[]:observations.filter(o=>uint(f(rec(o,975n),5n))!==1n),out=r(976,[occurrence(),OBSERVERS[i],list(admitted)]);outputs.push(out);emit(i===0?'update-a':'update-b',out);
  } else if(name.startsWith('probe')) {
   const i=index(name),prior=read(personPath(i))??r(979,[list([])]);outputs.push(r(981,[occurrence(),signed(event.dueAt),OBSERVERS[i],prior]));
  } else if(name.startsWith('update')) {
   const i=index(name),prior=read(personPath(i)),before=prior??r(979,[list([])]),next=agencyKnowledge(before,event.payload,i,model.law);
   if(key(next)!==key(before))write([{path:personPath(i),prior,next}]);outputs.push(r(982,[occurrence(),OBSERVERS[i],event.payload,before,next]));
  } else if(name==='history') {
   const truth=rec(event.payload,974n),prior=read(historyPath),before=prior??r(983,[list([])]),entries=items(f(rec(before,983n),1n),'list');
   const expression=f(rec(f(truth,3n),988n),5n),next=r(983,[list([...entries,...(model.law===5&&f(truth,6n)===false?[]:[r(985,[signed(event.dueAt),expression,truth])])])]);
   if(key(next)!==key(before))write([{path:historyPath,prior,next}]);outputs.push(r(986,[occurrence(),before,next]));
  } else fail('agency unhandled stage');
  outputs.forEach(v=>decode(enc(v)));return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{if(children.length!==emittedEvents.length)fail('agency child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('agency child association');expected.set(e.eventId,key(scheduledEventValue(e)));});return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/agency/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords,quantizationOperations,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];}};
 }
 const scheduler=new DeterministicScheduler({initialState:new AuthoritativeState([]),stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('agency pending children');model.validateState(state);random.prepareCommit();}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('agency concurrent settlement');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();random.begin();try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)random.commit();return result;}finally{active=false;expected.clear();random.close();}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:random.committedAddressKeys()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(random.committedAddressKeys().map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
