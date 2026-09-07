/** Internal authored-fact composition with optional committed D bridge. Not FCT-4/5 qualification.
 * adaptation-input/0.31-candidate + adaptation-settlement/0.2-candidate.
 */
import {canonicalEncode,text,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type EventHandler} from '../substrate/scheduler';
import {compileOrderedInputProfile,beginAuthoredSourceInstant,AUTHORED_FACT_EVENT,compiledInputSchedule} from './orderedInputs';
import {beginTransitionIngressV04} from './transitionIngressV04';
import {compileAdaptationEvaluator,adaptationExecutionDiffs} from './adaptationEvaluation';
import {compileTraceBinding,TRACE_RULES} from './traceBinding';
import type {compileTransitionAdmissionV06} from './transitionAdmissionV04';
import type {compileAdaptationDomains} from './adaptationDomains';
import type {compileCampaign2StateModel} from './stateModel';
import {dataKey as key} from './canonicalData';
import {dataRecord as rec,dataField as f,dataIdentity as id} from './canonicalData';
import {decodeCampaign2,campaign2Record as r} from './codecs';
import {admittedInputFacts} from './admittedInput';
import type {compileConsequenceBridge} from './consequenceBridge';
import {createCanonicalSave,type prepareCanonicalSave} from '../substrate/persistence';
import type {StructuralIdentity} from '../substrate/identity';

type Compilation=Awaited<ReturnType<ReturnType<typeof compileOrderedInputProfile>['create']>>;
/** Called only by the trusted model compiler after complete model/initial-state checks. */
export function createAdaptationRuntime(inputs:Compilation,initialState:AuthoritativeState,
  shared:ReturnType<typeof compileTransitionAdmissionV06>,evaluator:ReturnType<typeof compileAdaptationEvaluator>,
  domains:ReturnType<typeof compileAdaptationDomains>,stateModel:ReturnType<typeof compileCampaign2StateModel>,maxWork:bigint,bridgeModel?:ReturnType<typeof compileConsequenceBridge>,
  continuation?:Awaited<ReturnType<typeof prepareCanonicalSave<AuthoritativeState>>>){
  const modelIdentity=f(rec(inputs.runIdentity.value,104n),1n),rules=f(rec(modelIdentity,103n),1n);
  const trace=typeof rules!=='boolean'&&rules.kind==='text'&&rules.value===TRACE_RULES?compileTraceBinding(modelIdentity,inputs.runIdentity.value):undefined;
  stateModel.validateState(initialState);domains.validateStatic(initialState);domains.validateReferences(initialState,continuation?.clock??0n);
  const initial=continuation?{events:continuation.queue,allocators:continuation.allocators}:compiledInputSchedule(inputs,canonicalEncode(initialState.canonicalValue()));
  let sources:ReturnType<typeof beginAuthoredSourceInstant>|undefined,ingress:ReturnType<typeof beginTransitionIngressV04>|undefined;
  let bridge:ReturnType<NonNullable<typeof bridgeModel>['begin']>|undefined;
  const clone=(state:AuthoritativeState)=>new AuthoritativeState(state.entries());
  const handlers=new Map<string,EventHandler<AuthoritativeState>>();
  const registerHandler=(eventKey:string,handler:EventHandler<AuthoritativeState>)=>{
    if(handlers.has(eventKey))throw new SchedulerContractError('INVALID_CONFIGURATION','event has multiple fixed runtime adapters');handlers.set(eventKey,handler);
  };
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
    const registration=decodeCampaign2(registered.registration);if(typeof registration==='boolean'||registration.kind!=='record'||registration.schema.typeId!==272n)continue;
    if(!['OutcomeEvaluationTransition','OutcomeLearningEvidenceTransition'].some(name=>registered.transitionKey===key({kind:'typedIdentifier',namespaceId:1009n,payload:text(name)})))throw new SchedulerContractError('INVALID_CONFIGURATION','unsupported V04 runtime adapter');
    const definition=rec(f(registration,3n),271n),schema=rec(f(rec(f(definition,1n),274n),1n),254n),isEvaluation=key(f(schema,1n))===key({kind:'unsigned',value:227n});
    const eventType=id(f(rec(f(registration,4n),276n),1n));
    registerHandler(key(eventType),context=>{
      if(!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','EVID outside live instant');
      const cap=ingress.admit(context.event),occurrence=ingress.allocateEvidIdentity(cap,context),payload=admittedInputFacts(cap).payload;
      const output=isEvaluation?r('OutcomeEvaluation',{OutcomeEvaluationId:occurrence,ConsequenceExperience:payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')}):r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:occurrence,Evaluation:payload,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
      const plan=ingress.completeEvid(cap,[canonicalEncode(output)],{operations:[]},context.state.canonicalValue(),context.state.canonicalValue());
      return {nextState:context.state,outputs:[output],emittedEvents:plan.emissions(),traceContributions:[],traceFactory:children=>{plan.bindAllocatedChildren(children);return trace?[trace.record(context.event,[output],children,registration)]:[];}};
    });
  }
  const scheduler=new DeterministicScheduler({initialState,initialQueue:initial.events,initialAllocators:initial.allocators,
    initialClock:continuation?.clock,initialCommittedTrace:continuation?.committedTrace,initialOutputs:continuation?.outputs,
    maxSettlementWorkPerSimulationInstant:maxWork,
    stateAdapter:{clone,canonicalValue:state=>state.canonicalValue(),validate:state=>{stateModel.validateState(state);domains.validateStatic(state);}},
    handlers,
    adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',
      beforeInstant(state,instant){
        domains.validateStatic(state);domains.validateReferences(state,instant);
        sources=beginAuthoredSourceInstant(inputs,instant);ingress=beginTransitionIngressV04(shared,instant);
        bridge=bridgeModel?.begin(instant);
      },
      prepare(events,state,instant){
        if(!ingress)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','missing live ingress');
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
      beforeCommit(state,instant){domains.validateStatic(state);domains.validateReferences(state,instant);bridge?.finish();ingress!.finish();},
      close(){sources?.close();ingress?.abort();bridge?.abort();sources=undefined;ingress=undefined;bridge=undefined;},
      validateRuntimeEmission(event){if(key(event.eventTypeId)===key(AUTHORED_FACT_EVENT))throw new SchedulerContractError('INPUT_ONLY_EVENT_ORIGIN_VIOLATION','authored facts are compiler-only inputs');},
    },
  });
  // Only quiescent observations/settlement are exposed. No injection, allocator or handler API.
  return Object.freeze({settleNextInstant:()=>scheduler.settleNextInstant(),snapshot:()=>scheduler.exportQuiescentSnapshot(),
    save(modelIdentity:StructuralIdentity<'ModelIdentity'>,runIdentity:StructuralIdentity<'RunIdentity'>){
      return createCanonicalSave({scheduler,modelIdentity,runIdentity,continuingRunInputs:list([]),stateAdapter:{clone,
        canonicalValue:state=>state.canonicalValue(),validate:state=>{stateModel.validateState(state);domains.validateStatic(state);},
        restore:()=>{throw new Error('save adapter cannot restore');},analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])}});
    },
    diagnostic:()=>scheduler.failureDiagnostic});
}
