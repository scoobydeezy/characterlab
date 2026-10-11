import {createMemoryExecution,type MemoryPendingFact} from './memoryExecution';
import type {compileMemoryModel} from './memoryModel';
import {INTAKE_EVENT,CARRIAGE_PADDING,type compileMeasurementModel} from './measurementModel';
import {executeMeasurementIntake} from './measurementExecution';
import {scheduledEventValue} from '../substrate/persistence';
/** Internal authored-fact composition with optional committed D bridge. Not FCT-4/5 qualification.
 * adaptation-input/0.31-candidate + adaptation-settlement/0.2-candidate.
 */
import {canonicalEncode,text,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandler} from '../substrate/scheduler';
import {compileOrderedInputProfile,beginAuthoredSourceInstant,beginProbeSourceInstant,PROBE_SOURCE_EVENT,AUTHORED_FACT_EVENT,compiledInputSchedule} from './orderedInputs';
import {beginTransitionIngressV04} from './transitionIngressV04';
import {compileAdaptationEvaluator,adaptationExecutionDiffs} from './adaptationEvaluation';
import {compileTraceBinding,compileProbeTraceBinding,compileMeasurementTraceBinding,compileMemoryBaseTraceBinding,TRACE_RULES} from './traceBinding';
import type {compileProbeExecution} from './probeExecution';
import type {compileTransitionAdmissionV06} from './transitionAdmissionV04';
import type {compileAdaptationDomains} from './adaptationDomains';
import type {compileCampaign2StateModel} from './stateModel';
import {dataKey as key} from './canonicalData';
import {dataRecord as rec,dataField as f,dataIdentity as id} from './canonicalData';
import {decodeCampaign2,campaign2Record as r} from './codecs';
import {admittedInputFacts} from './admittedInput';
import {evidOperands,executeEvid} from './evidExecution';
import type {compileConsequenceBridge} from './consequenceBridge';
import {createCanonicalSave,type prepareCanonicalSave} from '../substrate/persistence';
import type {StructuralIdentity} from '../substrate/identity';

type Compilation=Awaited<ReturnType<ReturnType<typeof compileOrderedInputProfile>['create']>>;
/** Called only by the trusted model compiler after complete model/initial-state checks. */
export function createAdaptationRuntime(inputs:Compilation,initialState:AuthoritativeState,
  shared:ReturnType<typeof compileTransitionAdmissionV06>,evaluator:ReturnType<typeof compileAdaptationEvaluator>,
  domains:ReturnType<typeof compileAdaptationDomains>,stateModel:ReturnType<typeof compileCampaign2StateModel>,maxWork:bigint,bridgeModel?:ReturnType<typeof compileConsequenceBridge>,
  continuation?:Awaited<ReturnType<typeof prepareCanonicalSave<AuthoritativeState>>>,probeModel?:ReturnType<typeof compileProbeExecution>,measurement?:Awaited<ReturnType<typeof compileMeasurementModel>>['measurement'],memory?:Awaited<ReturnType<typeof compileMemoryModel>>,memoryPending:readonly MemoryPendingFact[]=[]){
  const modelIdentity=f(rec(inputs.runIdentity.value,104n),1n),rules=f(rec(modelIdentity,103n),1n);
  const memoryRuntime=memory&&measurement?createMemoryExecution(memory,measurement.validateOutput,modelIdentity,inputs.runIdentity.value,memoryPending):undefined;
  const trace=memory&&probeModel?compileMemoryBaseTraceBinding(modelIdentity,inputs.runIdentity.value,probeModel):measurement&&probeModel?compileMeasurementTraceBinding(modelIdentity,inputs.runIdentity.value,probeModel):probeModel?compileProbeTraceBinding(modelIdentity,inputs.runIdentity.value,probeModel):typeof rules!=='boolean'&&rules.kind==='text'&&rules.value===TRACE_RULES?compileTraceBinding(modelIdentity,inputs.runIdentity.value):undefined;
  stateModel.validateState(initialState);domains.validateStatic(initialState);domains.validateReferences(initialState,continuation?.clock??0n);
  const initial=continuation?{events:continuation.queue,allocators:continuation.allocators}:compiledInputSchedule(inputs,canonicalEncode(initialState.canonicalValue()));
  let sources:ReturnType<typeof beginAuthoredSourceInstant>|undefined,ingress:ReturnType<typeof beginTransitionIngressV04>|undefined;
  let bridge:ReturnType<NonNullable<typeof bridgeModel>['begin']>|undefined;
  let probe:ReturnType<NonNullable<typeof probeModel>['begin']>|undefined,probeSource:ReturnType<typeof beginProbeSourceInstant>|undefined;
  let carriagePadding:import('../substrate/scheduler').ScheduledEvent|undefined,probeInstant=false,runtimeCount=0,childCount=0;
  const counted=(allocator:{allocateRuntimeId():bigint})=>({allocateRuntimeId(){if(measurement&&probeInstant)runtimeCount++;return allocator.allocateRuntimeId();}});
  const clone=(state:AuthoritativeState)=>new AuthoritativeState(state.entries());
  const handlers=new Map<string,EventHandler<AuthoritativeState>>();
  const registerHandler=(eventKey:string,handler:EventHandler<AuthoritativeState>)=>{
    if(handlers.has(eventKey))throw new SchedulerContractError('INVALID_CONFIGURATION','event has multiple fixed runtime adapters');handlers.set(eventKey,handler);
  };
  for(const eventType of probeModel?.eventTypes()??[])registerHandler(key(eventType),context=>{
   if(!probe||!ingress||!probeSource)throw new SchedulerContractError('INPUT_NOT_ADMITTED','probe outside live instant');
   if(key(context.event.eventTypeId)===key(PROBE_SOURCE_EVENT)){probeSource.admit(context.event);probeInstant=true;}
   const result=probe.execute(context.event,context.state,counted(context)),plan=result.freeze?ingress.observeSemanticFreeze(context.event,[canonicalEncode(result.freeze)]):undefined;
   const emissions=result.plan.emissions();
   const carriageSlot=!!measurement&&context.event.phase===120n;
   let carriagePlan:ReturnType<NonNullable<typeof ingress>['observeMeasurement']>|undefined;
   if(carriageSlot&&probeModel!.permitted){if(result.outputs.length!==1)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','missing diagnostic observation');measurement!.validateInput(result.outputs[0]);carriagePlan=ingress.observeMeasurement(context.event,canonicalEncode(result.outputs[0]));}
   else if(carriageSlot&&result.outputs.length)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','suppressed producer emitted evidence');
   const extra=carriagePlan?.emissions()??(carriageSlot?[{dueAt:context.event.dueAt,phase:130n,eventTypeId:CARRIAGE_PADDING,payload:list([]),dependencies:list([])}]:[]);
   if(carriageSlot&&(emissions.length!==1||extra.length!==1))throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','carriage slot multiplicity');
   return {nextState:context.state,outputs:result.outputs,emittedEvents:[...emissions,...extra,...(plan?.emissions()??[])],traceContributions:[],traceFactory:children=>{
    result.plan.bindAllocatedChildren(children.slice(0,emissions.length));
    if(measurement&&probeInstant)childCount+=children.length;
    if(carriagePlan)carriagePlan.bindAllocatedChildren(children.slice(emissions.length,emissions.length+1));
    else if(carriageSlot){if(carriagePadding)throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','duplicate padding');carriagePadding=structuredClone(children[emissions.length]);}
    plan?.bindAllocatedChildren(children.slice(emissions.length+extra.length));
    return trace?[trace.record(context.event,result.outputs,children,undefined,{readDomain:context.event.phase===110n?[probeModel!.pattern]:[],actualReadRecords:result.reads,patch:{operations:[]},diffs:[]})]:[];
   }};
  });
  registerHandler(key(AUTHORED_FACT_EVENT),context=>{
    if(!sources||!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','source outside live instant');
    const output=sources.execute(context.event,context),branch=bridge?.source(context.event,context),plan=ingress.observeAuthoredSource(context.event,canonicalEncode(output));
    const bridgeEmissions=branch?.emissions()??[];
    return {nextState:context.state,outputs:[output],emittedEvents:[...bridgeEmissions,...plan.emissions()],traceContributions:[],traceFactory:children=>{
      branch?.bindAllocatedChildren(children.slice(0,bridgeEmissions.length));plan.bindAllocatedChildren(children.slice(bridgeEmissions.length));return trace?[trace.record(context.event,[output],children)]:[];
    }};
  });
  for(const eventType of bridgeModel?.eventTypes()??[])registerHandler(key(eventType),context=>{
    if(!bridge||!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','bridge outside live instant');
    const result=bridge.execute(context.event,context),plan=result.freeze?ingress.observeSemanticFreeze(context.event,[canonicalEncode(result.freeze)]):undefined;
    const bridgeEmissions=result.plan.emissions();
    return {nextState:context.state,outputs:result.outputs,emittedEvents:[...bridgeEmissions,...(plan?.emissions()??[])],traceContributions:[],traceFactory:children=>{
      result.plan.bindAllocatedChildren(children.slice(0,bridgeEmissions.length));
      if(plan)plan.bindAllocatedChildren(children.slice(bridgeEmissions.length));else if(children.length!==bridgeEmissions.length)throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','extra bridge child');return trace?[trace.record(context.event,result.outputs,children)]:[];
    }};
  });
  for(const registered of shared.registrations()){
    const registration=shared.decode(registered.registration);if(typeof registration==='boolean'||registration.kind!=='record'||registration.schema.typeId!==272n)continue;
    if(!['OutcomeEvaluationTransition','OutcomeLearningEvidenceTransition'].some(name=>registered.transitionKey===key({kind:'typedIdentifier',namespaceId:1009n,payload:text(name)})))throw new SchedulerContractError('INVALID_CONFIGURATION','unsupported V04 runtime adapter');
    const definition=rec(f(registration,3n),271n),schema=rec(f(rec(f(definition,1n),274n),1n),254n),isEvaluation=key(f(schema,1n))===key({kind:'unsigned',value:227n});
    const eventType=id(f(rec(f(registration,4n),276n),1n));
    registerHandler(key(eventType),context=>{
      if(!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','EVID outside live instant');
      const cap=ingress.admit(context.event),occurrence=ingress.allocateEvidIdentity(cap,counted(context)),payload=admittedInputFacts(cap).payload;
      const output=executeEvid(evidOperands(isEvaluation,payload,occurrence));
      const plan=ingress.completeEvid(cap,[canonicalEncode(output)],{operations:[]},context.state.canonicalValue(),context.state.canonicalValue());
      return {nextState:context.state,outputs:[output],emittedEvents:plan.emissions(),traceContributions:[],traceFactory:children=>{plan.bindAllocatedChildren(children);if(measurement&&probeInstant)childCount+=children.length;return trace?[trace.record(context.event,[output],children,registration)]:[];}};
    });
  }
  if(measurement){
   registerHandler(key(INTAKE_EVENT),context=>{
    if(!ingress||!probeInstant)throw new SchedulerContractError('INPUT_NOT_ADMITTED','carriage outside probe instant');
    const cap=ingress.admit(context.event),payload=admittedInputFacts(cap).payload;measurement.validateInput(payload);
    const occurrence=ingress.allocateMeasurementIdentity(cap,counted(context));
    const output=executeMeasurementIntake(payload,measurement.unit,occurrence);
    const terminal=ingress.completeMeasurement(cap,canonicalEncode(output));
    const memoryPlan=memoryRuntime?.observeIntake(context.event,output);
    return {nextState:context.state,outputs:[output],emittedEvents:memoryPlan?.emissions()??terminal.emissions(),traceContributions:[],traceFactory:children=>{terminal.bindAllocatedChildren(memoryPlan?[]:children);memoryPlan?.bindAllocatedChildren(children);childCount+=children.length;return trace?[trace.record(context.event,[output],children,shared.decode(measurement.registration))]:[];}};
   });
   registerHandler(key(CARRIAGE_PADDING),context=>{
    if(!carriagePadding||key(scheduledEventValue(context.event))!==key(scheduledEventValue(carriagePadding)))throw new SchedulerContractError('INPUT_NOT_ADMITTED','unassociated carriage padding');
    carriagePadding=undefined;counted(context).allocateRuntimeId();
    const memoryPlan=memoryRuntime?.observeIntake(context.event);
    return {nextState:context.state,outputs:[],emittedEvents:memoryPlan?.emissions()??[],traceContributions:[],traceFactory:children=>{memoryPlan?.bindAllocatedChildren(children);childCount+=children.length;return trace?[trace.record(context.event,[],children)]:[];}};
   });
  }
  for(const eventType of memoryRuntime?.eventTypes()??[])registerHandler(key(eventType),context=>{
    const result=memoryRuntime!.execute(context.event,context.state,counted(context));
    return {nextState:result.nextState,outputs:result.outputs,emittedEvents:result.plan.emissions(),traceContributions:[],traceFactory:children=>{result.plan.bindAllocatedChildren(children);if(probeInstant)childCount+=children.length;return [result.trace(children)];}};
  });
  const scheduler=new DeterministicScheduler({initialState,initialQueue:initial.events,initialAllocators:initial.allocators,
    initialClock:continuation?.clock,initialCommittedTrace:continuation?.committedTrace,initialOutputs:continuation?.outputs,
    maxSettlementWorkPerSimulationInstant:maxWork,
    stateAdapter:{clone,canonicalValue:state=>state.canonicalValue(),validate:state=>{stateModel.validateState(state);domains.validateStatic(state);}},
    handlers,
    adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',
      beforeInstant(state,instant){
        domains.validateStatic(state);domains.validateReferences(state,instant);
        probeInstant=false;runtimeCount=0;childCount=0;carriagePadding=undefined;memoryRuntime?.begin(instant);
        sources=beginAuthoredSourceInstant(inputs,instant);ingress=beginTransitionIngressV04(shared,instant);
        bridge=bridgeModel?.begin(instant);
        probe=probeModel?.begin(instant);probeSource=probeModel?beginProbeSourceInstant(inputs,instant):undefined;
      },
      prepare(events,state,instant){
        if(!ingress)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','missing live ingress');
        if(memoryRuntime&&events.some(e=>memoryRuntime.isEvent(e))){
          if(events.length!==1||!memoryRuntime.isEvent(events[0]))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','mixed memory/ADAPT stage');
          let result:ReturnType<typeof memoryRuntime.execute>|undefined;
          return {execute(context){result=memoryRuntime.execute(context.event,state,counted(context));result.plan.bindAllocatedChildren([]);return {nextState:state,outputs:result.outputs,emittedEvents:[],traceContributions:[]};},finish(){if(!result)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','missing memory execution');return result.nextState;},finalizeTrace(){return result?[result.trace([])]:[];}};
        }
        for(const event of events)if(!shared.registrationForEvent(event.eventTypeId))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','undeclared phase-140 event');
        const tokens=events.map(event=>ingress!.admit(event)),batch=evaluator.prepare(tokens,instant).begin(state);let index=0;
        let completed:ReturnType<typeof batch.finish>|undefined;
        return {
          execute(context){
            const result=batch.execute(tokens[index++],context);
            return {nextState:context.state,outputs:result.outputs,emittedEvents:[],traceContributions:trace?[]:result.actualReads};
          },
          finish(){
            const result=batch.finish();
            completed=result;
            for(const execution of result.executions){const terminal=ingress!.completeAdaptation(execution);terminal.bindAllocatedChildren([]);}
            return result.state;
          },
          finalizeTrace(){
            if(!trace)return [];
            if(!completed)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','trace before completed batch');
            return completed.executions.map(e=>trace.record(e.event,e.outputs,[],decodeCampaign2(shared.registrationForEvent(e.event.eventTypeId)!),{readDomain:e.readDomain,actualReadRecords:e.actualReadRecords,patch:e.patch,diffs:adaptationExecutionDiffs(e)}));
          },
        };
      },
      beforeCommit(state,instant){domains.validateStatic(state);domains.validateReferences(state,instant);bridge?.finish();probe?.finish();ingress!.finish();if(measurement&&probeInstant&&(runtimeCount!==(memory?7:6)||childCount!==(memory?11:8)||carriagePadding))throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','carriage/memory budget closure');memoryRuntime?.commit();},
      close(){memoryRuntime?.close();sources?.close();ingress?.abort();bridge?.abort();probe?.abort();probeSource?.close();sources=undefined;ingress=undefined;bridge=undefined;probe=undefined;probeSource=undefined;},
      validateRuntimeEmission(event){if(key(event.eventTypeId)===key(AUTHORED_FACT_EVENT)||key(event.eventTypeId)===key(PROBE_SOURCE_EVENT))throw new SchedulerContractError('INPUT_ONLY_EVENT_ORIGIN_VIOLATION','sources are compiler-only inputs');},
    },
  });
  // Only quiescent observations/settlement are exposed. No injection, allocator or handler API.
  return Object.freeze({memoryPendingFacts:()=>memoryRuntime?.pendingFacts()??[],settleNextInstant:()=>scheduler.settleNextInstant(),snapshot:()=>scheduler.exportQuiescentSnapshot(),
    save(modelIdentity:StructuralIdentity<'ModelIdentity'>,runIdentity:StructuralIdentity<'RunIdentity'>){
      return createCanonicalSave({scheduler,modelIdentity,runIdentity,continuingRunInputs:list([]),stateAdapter:{clone,
        canonicalValue:state=>state.canonicalValue(),validate:state=>{stateModel.validateState(state);domains.validateStatic(state);},
        restore:()=>{throw new Error('save adapter cannot restore');},analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])}});
    },
    diagnostic:()=>scheduler.failureDiagnostic});
}
