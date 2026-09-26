/** Authenticated native biology stages; cognitive handlers receive safe records only. */
import {canonicalEncode as enc,list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch,restoreAuthoritativeState,statePathPatternValue,type ActualReadRecord,type StatePatch,type StructuralMutationDiff,type StatePath} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandlerContext,type EventEmission,type ScheduledEvent,type ConformanceInstrumentation} from '../substrate/scheduler';
import {createCanonicalSave,scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {biologyPublicRecord as r,decodeBiologyPublic as decode} from './biologyPublicCodecs';
import {data,value} from './biologyPublicData';
import {VERSION,STAGES,ACTOR,OBSERVER,sid,eventId,path,pattern,owner,reads,writes,split,join,type BiologyCompiled,compileBiologyInputs} from './biologyPublicModel';
import {advanceBiology,emptyPhysicalInput,physicalChallenges,lattice,type BiologyState} from './biologicalDynamics';
import {type Action,type Domain} from './biologicalIntegration';
import {biologicalChoice} from './biologicalChoice';
import {nativeNuclei,sourceKind} from './biologyPublicReasons';
import {observation,experienced,mergeInput,context,maintain,appraise,learn,type Context,type Goals,type Sample,type View,type Appraisal} from './biologyPublicMath';
type Transition=ReturnType<typeof advanceBiology>;
const recordData=<T>(v:CanonicalValue,type:number,field=1)=>value<T>(f(rec(v,BigInt(type)),BigInt(field)));
const appraisalOf=(v:CanonicalValue)=>recordData<Appraisal>(v,1411,3);
export function createBiologyRuntime(model:BiologyCompiled,input:Awaited<ReturnType<typeof compileBiologyInputs>>){
 const originals=new Map(input.events.map(e=>[e.eventId,key(scheduledEventValue(e))]));
 const config=structuredClone(model.config);if(model.law==='NoAdaptation')for(const p of Object.values(config.constitution.channels)){p.toleranceGain=0;p.sensitizationGain=0;p.displacementGain=0;}
 const worldLaw=model.law==='NoRecovery'?'NoRecovery':config.worldLaw;
 let active=false,expected=new Map<bigint,string>(),committed:string[]=[],pending:string[]=[];
 const fail=(why:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',why);};
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),validate:model.validateState,canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:restoreAuthoritativeState,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 async function handler({event,state,allocateRuntimeId}:EventHandlerContext<AuthoritativeState>){
  if(!active)fail('inactive biology transaction');
  const stage=STAGES.find(([n])=>key(event.eventTypeId)===key(eventId(n)));if(!stage||event.phase!==BigInt(stage[1]))fail('biology phase');const name=stage![0],fingerprint=key(scheduledEventValue(event));
  if(name==='passive'){if(originals.get(event.eventId)!==fingerprint)fail('biology original');}else{if(expected.get(event.eventId)!==fingerprint)fail('biology generated');expected.delete(event.eventId);}
  const occurrence=()=>typedIdentifier(1156,u(allocateRuntimeId())),paths=reads(name),domain=paths.map(pattern),actualReads:ActualReadRecord[]=[],pk=(p:StatePath)=>key(statePathPatternValue(pattern(p)));
  const read=(root:number)=>{const p=path(root);if(!paths.some(x=>pk(x)===pk(p)))return fail('biology read domain');const prior=state.read(p);actualReads.push({accessorId:sid(1028,'accessor/biology/'+name),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior.value!;};
  const outputs:CanonicalValue[]=[],emittedEvents:EventEmission[]=[];let nextState=state,patch:StatePatch={operations:[]},diffs:readonly StructuralMutationDiff[]=[],draws:CanonicalValue[]=[];
  const emit=(next:string,payload:CanonicalValue)=>emittedEvents.push({dueAt:event.dueAt,phase:BigInt(STAGES.find(([n])=>n===next)![1]),eventTypeId:eventId(next),payload,dependencies:list([])});
  const write=(root:number,next:CanonicalValue)=>{const p=path(root);if(!writes(name).some(x=>pk(x)===pk(p)))fail('biology write domain');const prior=state.read(p);patch={operations:[{kind:'set',path:p,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:next}]};const applied=applyStatePatch(state,patch,owner(name),model.authority);nextState=applied.state;diffs=applied.diffs;};
  const body=()=>join(recordData<BiologyState>(read(1422),1404),recordData<ReturnType<typeof split>['adaptation']>(read(1423),1405));
  const at=Number(event.dueAt);
  if(name==='passive'){
   const elapsed=advanceBiology(body(),config.constitution,emptyPhysicalInput(),worldLaw,'elapsed');write(1422,r(1404,[data(split(elapsed.state).physical)]));emit('sense',list([]));
  }else if(name==='sense'){
   const frame=input.frames[at-1],signal=observation(body(),config.constitution,frame.sensor,model.law),sensed=r(1409,[occurrence(),OBSERVER,u(at),u(1),data(signal)]),ctx=r(1410,[occurrence(),sensed,data(context(frame))]);outputs.push(sensed,ctx);emit('goals',ctx);
  }else if(name==='goals'){
   const prior=recordData<Goals>(read(1425),1407),ctx=recordData<Context>(event.payload,1410,3);write(1425,r(1407,[data(maintain(prior,ctx))]));emit('appraise',event.payload);
  }else if(name==='appraise'){
   const ctx=rec(event.payload,1410n),signal=recordData<View>(f(ctx,2n),1409,5),safeConfig={controlThreshold:config.controlThreshold,protectionImportance:config.protectionImportance,workImportance:config.workImportance};
   const a=appraise(signal,recordData<Context>(ctx,1410,3),recordData<Goals>(read(1425),1407),recordData<Sample[]>(read(1424),1406),safeConfig,model.law),previous=recordData<number|null>(read(1426),1408);
   write(1426,r(1408,[data(a.affect.threat)]));const out=r(1411,[occurrence(),ctx,data(a)]);outputs.push(out);emit('options',list([out,data(previous)]));
  }else if(name==='options'){
   // Candidate inhibition was evaluated solely from safe appraisal operands.
   emit('reasons',event.payload);
  }else if(name==='reasons'){
   const [a,previous]=items(event.payload,'list'),grounds=appraisalOf(a).grounds;
   const nuclei=nativeNuclei(grounds).map(n=>{const source=r(1412,[occurrence(),f(rec(a,1411n),1n),u(sourceKind(n.ground.domain)),text(n.ground.option),text(n.ground.domain),signed(n.ground.strength)]);const nucleus=r(1413,[occurrence(),source,data(n.numerics)]);outputs.push(source,nucleus);return nucleus;});
   if(nuclei.length>32)fail('biology nucleus bound');emit('decision',list([a,list(nuclei),previous]));
  }else if(name==='decision'){
   const [a,nuclei,previous]=items(event.payload,'list'),ap=appraisalOf(a),choice=await biologicalChoice(ap.options,ap.grounds,at,input.runSeed[0]);
   // The inherited numerical nucleus bytes never escape into public semantic records.
   const {nuclei:privateNuclei,...resolution}=choice;void privateNuclei;
   for(const d of choice.draws){if(committed.includes(d.address)||pending.includes(d.address))fail('biology RNG reuse');pending.push(d.address);}draws=choice.draws.map(data);
   const out=r(1414,[occurrence(),a,nuclei,data(resolution)]);outputs.push(out);emit('intent',list([out,previous]));
  }else if(name==='intent'){
   const [decision,previous]=items(event.payload,'list'),out=r(1415,[occurrence(),decision]);outputs.push(out);emit('expression',list([out,previous]));
  }else if(name==='expression'){
   const [intent,previous]=items(event.payload,'list'),out=r(1416,[occurrence(),intent]);outputs.push(out);emit('attempt',list([out,previous]));
  }else if(name==='attempt'){
   const [expression,previous]=items(event.payload,'list'),out=r(1417,[occurrence(),expression]);outputs.push(out);emit('execution',list([out,previous]));
  }else if(name==='execution'){
   const [attempt,previous]=items(event.payload,'list'),expression=f(rec(attempt,1417n),2n),decision=f(rec(f(rec(expression,1416n),2n),1415n),2n),choice=recordData<{chosen:Action|null}>(decision,1414,4),frame=input.frames[at-1],current=body(),challenge=physicalChallenges(current,config.constitution).execution;
   const executed=choice.chosen&&!frame.interference&&challenge<config.competence?choice.chosen:null,physical=mergeInput(executed?config.catalog[executed]:emptyPhysicalInput(),frame.external),impulse=model.law==='NoAppraisalImpulse'?0:lattice(BigInt(value<number|null>(previous)??0),2n);
   if(impulse)physical.stimuli.push({channel:'stress',exposure:'appraised-threat',dose:impulse,direction:1});
   const transition=advanceBiology(current,config.constitution,physical,worldLaw,'consequence');write(1422,r(1404,[data(split(transition.state).physical)]));
   const out=r(1418,[occurrence(),data({transition,executed,challenge})]);outputs.push(out);emit('observe',list([expression,out]));
  }else if(name==='observe'){
   const [expression,physical]=items(event.payload,'list'),frame=input.frames[at-1],after=observation(body(),config.constitution,frame.consequenceSensor??frame.sensor,model.law),decision=f(rec(f(rec(expression,1416n),2n),1415n),2n),a=appraisalOf(f(rec(decision,1414n),2n)),choice=recordData<{chosen:Action|null}>(decision,1414,4);
   // Always reserve both observer IDs even if delivery is withheld.
   const sensed=r(1409,[occurrence(),OBSERVER,u(at),u(2),data(frame.receipt?after:null)]),receipt=choice.chosen&&frame.receipt?experienced(a.before,after):null,out=r(1419,[occurrence(),OBSERVER,u(at),expression,sensed,data(receipt)]);outputs.push(sensed,out);emit('learn',out);emit('adapt',physical);
  }else if(name==='learn'){
   const outcome=rec(event.payload,1419n),expression=f(outcome,4n),decision=f(rec(f(rec(expression,1416n),2n),1415n),2n),a=rec(f(rec(decision,1414n),2n),1411n),ctx=recordData<Context>(f(a,2n),1410,3),choice=recordData<{chosen:Action|null}>(decision,1414,4),prior=read(1424),history=recordData<Sample[]>(prior,1406),receipt=value<Record<Domain,number|null>|null>(f(outcome,6n));
   const next=r(1406,[data(learn(history,choice.chosen,receipt,at,ctx.cue,model.law))]);write(1424,next);outputs.push(r(1420,[occurrence(),prior,next]));
  }else if(name==='adapt'){
   const prior=read(1423),transition=recordData<{transition:Transition}>(event.payload,1418,2).transition,next=r(1405,[data(split(transition.state).adaptation)]);write(1423,next);outputs.push(r(1421,[occurrence(),prior,next]));
  }
  outputs.forEach(v=>decode(enc(v)));
  return {nextState,outputs,emittedEvents,traceContributions:[],traceFactory:(children:readonly ScheduledEvent[])=>{
   if(children.length!==emittedEvents.length)fail('biology child count');children.forEach((e,i)=>{if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==event.eventId||key(e.payload)!==key(emittedEvents[i].payload))fail('biology child association');expected.set(e.eventId,key(scheduledEventValue(e)));});
   return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model.modelIdentity.value,runIdentity:input.runIdentity.value,event,seamId:sid(1036,'seam/biology/'+name),seamVersion:VERSION,recordKind:event.eventTypeId,subjectIds:[ACTOR],sourceRecordIds:[],registeredReadDomain:domain,actualReadRecords:actualReads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:draws,quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
  }};
 }
 const scheduler=new DeterministicScheduler({initialState:input.state,stateAdapter:adapter,handlers:new Map(STAGES.map(([n])=>[key(eventId(n)),handler])),initialQueue:input.events,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(input.events.length),nextEventSequence:BigInt(input.events.length)},maxSettlementWorkPerSimulationInstant:32n,invariants:[state=>{if(expected.size)fail('biology pending children');model.validateState(state);}]});
 async function settle(instrumentation?:ConformanceInstrumentation){if(active)fail('biology concurrent');if(!scheduler.getPendingQueue().length)return undefined;active=true;expected=new Map();pending=[];try{const result=instrumentation?await scheduler.settleNextInstantForConformance(instrumentation):await scheduler.settleNextInstant();if(result)committed.push(...pending);return result;}finally{active=false;expected.clear();pending=[];}}
 return {settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>({state:scheduler.getState(),clock:scheduler.getClock(),status:scheduler.status,queue:scheduler.getPendingQueue(),allocators:scheduler.getAllocatorState(),trace:scheduler.getCommittedTrace(),outputs:scheduler.getOutputs(),randomAddresses:committed.slice()}),save:()=>createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity:model.modelIdentity,runIdentity:input.runIdentity,continuingRunInputs:list(committed.map(text))}),diagnostic:()=>scheduler.failureDiagnostic};
}
