import {createSocialWitness,SW_SOURCE} from './socialWitness';
import {CURRENT_SEM_SOURCE} from './semanticLanes';
import {createWorkMaintenance,WORK_SOURCE} from './workMaintenance';
import {createEffectEvidence} from './effectEvidence';
import {createCommitmentWitness,W_SOURCE} from './commitmentWitness';
import {createCommitmentTaskExecution} from './taskSettlement';
import {createCommitmentLifecycle,COMMITMENT_REQUEST} from './commitment';
import {createReasonEvidence,REASON_READING} from './reasonEvidence';
import {createRuminationExecution} from './rumination';
import {createFatigueExecution} from './fatigue';
import {createActionMemory} from './actionMemory';
import {createPositionExecution} from './positionExecution';
import {createGoalMeaning,GOAL_ADOPT,GOAL_EXPIRE} from './goalMeaning';
import {createReappraisalExecution,REAPPRAISAL_SOURCE} from './reappraisal';
import {INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from './interferenceExpectation';
import {createCausalExecution,CAUSAL_SOURCE,CAUSAL_CONTEXT} from './causalAttribution';
import {createValuesExecution,VALUES_CONTEXT} from './values';
import {KNOWLEDGE_OWNER} from './strategy';
/** assembled-character-model/0.1-candidate. One fixed composition and scheduler.
 * Bounded port of the reachable cognitive wiring in C2 adaptationRuntime; no optional
 * model selection, authored consequence bridge branch or imported continuation.
 * The protocol bridge remains;0.109 adds authenticated actual exposure to the same evaluator. */
import {canonicalEncode,text,list,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {DeterministicScheduler,SchedulerContractError,type ScheduledEvent,type EventHandlerContext,type EventHandler} from '../substrate/scheduler';
import {scheduledEventValue,createCanonicalSave} from '../substrate/persistence';
import type {StructuralIdentity} from '../substrate/identity';
import {compileCampaign2Parameters} from '../campaign2/modelPackaging';
import {createMemoryExecution} from '../campaign2/memoryExecution';
import {createPredictionExecution} from '../campaign2/predictionExecution';
import {createTaskExecution} from '../campaign2/taskExecution';
import {taskInitialSchedule,TASK_DEADLINE_EVENT} from '../campaign2/taskBootstrap';
import {INTAKE_EVENT,CARRIAGE_PADDING} from '../campaign2/measurementModel';
import {executeMeasurementIntake} from '../campaign2/measurementExecution';
import {compileOrderedInputProfile,beginProbeSourceInstant,PROBE_SOURCE_EVENT,AUTHORED_FACT_EVENT,DELIBERATION_EVENT} from '../campaign2/orderedInputs';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {adaptationExecutionDiffs} from '../campaign2/adaptationEvaluation';
import {dataItems as items,dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {decodeCampaign2} from '../campaign2/codecs';
import {admittedInputFacts} from '../campaign2/admittedInput';
import {evidOperands,executeEvid} from '../campaign2/evidExecution';
import {compileCognitiveIngress} from './ingress';
import {createCognitiveExecution} from './execution';
import {compileCharacterTraceBinding} from './traceBinding';
import {prepareEpisodicRetention} from './retention';
import {createEpisodicExtension} from './memory';
import {createRelationshipExecution} from './relationshipExecution';
import {REL_SOURCE} from './relationship';
import {createSocialExecution} from './socialExecution';
import {SOCIAL_SOURCE} from './social';
import {createCommunicationExecution} from './communicationExecution';
import {COMM_SOURCE} from './communication';
import {createControlExecution} from './controlExecution';
import {CONTROL_SOURCE} from './control';
import {createHabitExecution} from './habitExecution';
import {HABIT_SOURCE} from './habit';
import {createPerformanceExecution} from './performanceExecution';
import {PERFORMANCE_SETTING} from './performance';
import {createHorizonExecution} from './horizonExecution';
import {HORIZON_DISPLAY} from './horizon';
import {createPriorityExecution} from './priorityExecution';
import {PRIORITY_DISPLAY} from './priority';
import {createStrategyExecution} from './strategyExecution';
import {DISPLAY} from './strategy';
import {createSkillExecution} from './skillExecution';
import {PRACTICE_SETTING,PRACTICE} from './skill';
import {ACTION_BODY_EVENT} from './actionBody';
import {createBodyExecution,BODY_OBSERVER,BODY_SAMPLE,BODY_DELIVERY,BODY_SELECTION} from './body';
import type {compileCharacterInputs} from './inputs';
import type {compileCharacterModel} from './model';
import type {compileCharacterState} from './state';

export function createCharacterRuntime(model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,initialState:AuthoritativeState){
 const base=component.prior.base,bindings=compileCognitiveIngress(model,component),stateModel=component.stateModel,content=model.content;
 const memory=Object.freeze({...component.prior.memoryComponent,stateModel,content});
 const prediction=Object.freeze({...component.prior,stateModel,content,memoryComponent:memory});
 const task=Object.freeze({base,content,stateModel,tasks:component.tasks,measurement:component.measurement,deadline:component.deadline,predictionComponent:prediction});
 const maxWork=compileCampaign2Parameters(model.source.parameterSchemaVersion,model.source.parameters).maxWork;
 const modelIdentity=model.modelIdentity.value;
 const effects=model.effectEvidence?createEffectEvidence(component.tasks[0].character,model.effectEvidence,model.body!.capacity,stateModel,modelIdentity,inputs.runIdentity.value):undefined;
 const reasonEvidence=model.reasonEvidence?createReasonEvidence(model.reasonEvidence,inputs.reasonEvidenceEvents,modelIdentity,inputs.runIdentity.value,txt(BODY_OBSERVER.payload),model.contextReasons):undefined;
 const position=model.positionEnabled?createPositionExecution(stateModel,inputs.positionEvents,modelIdentity,inputs.runIdentity.value,model.positionMemory,model.mitigationEnabled):undefined;
 const procedure=model.skill?createSkillExecution(component.tasks[0].character,stateModel,inputs.skillEvents,modelIdentity,inputs.runIdentity.value,model.procedures,model.actionBody,model.skillInterference):undefined;
 const body=model.body?createBodyExecution(model.body,component.tasks[0].character,stateModel,inputs.bodyEvents,modelIdentity,inputs.runIdentity.value,model.actionBody,procedure,model.tolerance,model.retainedAttribution?()=>position!.contextForBody():undefined):undefined;
 if(model.affectMemory&&inputs.socialEvents.length>(model.affectMemory.acquisitionPresentation?31:32))throw new SchedulerContractError('INPUT_NOT_ADMITTED','affect memory presentation capacity including acquisition');
 const episodes=model.memory?createEpisodicExtension(component.tasks[0].character,model.body!,stateModel,modelIdentity,inputs.runIdentity.value,model.retention?.recallDelay,model.retrieval,model.workspace,model.socialMemory,model.affectMemory,()=>reappraisal?.completedAffect(),model.encoding,model.memoryUse,model.bodyMemoryUse,model.positionMemory,model.retainedAttribution,model.significanceEnabled,!!model.actionMemory,model.effectEvidence?.proposition,model.familiarity,model.recollection,model.vivid,model.positionUse,model.positionPresentation,model.rehearsal):undefined;
 const causal=model.causalEnabled?createCausalExecution(component.tasks[0].character,model.strategy!,stateModel,inputs.causalEvents,modelIdentity,inputs.runIdentity.value,model.interferenceEnabled,model.causalOpportunities,model.timeLimit):undefined;
 const values=model.values?createValuesExecution(component.tasks[0].character,model.values,stateModel,inputs.valuesEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit):undefined;
 const performance=model.performance?createPerformanceExecution(component.tasks[0].character,model.strategy!,stateModel,inputs.performanceEvents,modelIdentity,inputs.runIdentity.value,model.actionBody!,model.expectationEnabled,values,model.timeLimit):undefined;
 const strategy=model.strategy?createStrategyExecution(component.tasks[0].character,model.strategy,stateModel,inputs.strategyEvents,modelIdentity,inputs.runIdentity.value,performance,model.timeLimit):undefined;
 const horizon=model.horizon?createHorizonExecution(component.tasks[0].character,component.tasks.map(t=>t.key),stateModel,inputs.horizonEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit):undefined;
 const meaning=model.goalMeaning?createGoalMeaning(component.tasks[0].character,model.goalMeaning,stateModel,inputs.goalEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit):undefined;
 const spatialMeaning=model.spatialMeaning?createGoalMeaning(component.tasks[0].character,model.spatialMeaning,stateModel,inputs.goalEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit,model.positionUse):undefined;
 const priorityCore=model.priority?createPriorityExecution(component.tasks[0].character,component.tasks.map(t=>t.key),stateModel,inputs.priorityEvents,modelIdentity,inputs.runIdentity.value,horizon,model.commitmentAdoption?{tasks:component.tasks,strategy:model.strategy!}:undefined,model.timeLimit):undefined;
 const habit=model.habit?createHabitExecution(component.tasks[0].character,model.habit,model.strategy!,stateModel,inputs.habitEvents,modelIdentity,inputs.runIdentity.value,model.actionBody!,model.deliveryReward,model.timeLimit):undefined;
 const rumination=model.rumination?createRuminationExecution(component.tasks[0].character,model.rumination,stateModel,inputs.ruminationEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit):undefined;
 const controlBase=model.control?createControlExecution(component.tasks[0].character,model.habit!,stateModel,inputs.controlEvents,modelIdentity,inputs.runIdentity.value,model.workspaceLimit,model.fatigue,rumination?{settings:model.rumination!,instruction:rumination.instruction}:undefined,model.timeLimit):undefined;
 const fatiguedControl=controlBase&&model.fatigue?createFatigueExecution(component.tasks[0].character,stateModel,inputs.fatigueEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit).extend(controlBase):controlBase;
 const control=rumination?rumination.extend(fatiguedControl!):fatiguedControl;
 const communicationBase=model.communication?createCommunicationExecution(component.tasks[0].character,model.communication,stateModel,inputs.communicationEvents,modelIdentity,inputs.runIdentity.value,model.delayedBody,model.timeLimit):undefined;
 const witnessedCommunication=model.commitmentWitness?createCommitmentWitness(component.tasks[0].character,component.tasks.map(t=>t.key),model.communication!.recipients,stateModel,inputs.commitmentEvents.filter(e=>key(e.eventTypeId)===key(W_SOURCE)),modelIdentity,inputs.runIdentity.value,model.timeLimit).extend(communicationBase!):communicationBase;
 const communication=model.socialWitness?createSocialWitness(component.tasks[0].character,model.socialWitness,stateModel,inputs.commitmentEvents.filter(e=>key(e.eventTypeId)===key(SW_SOURCE)),inputs.socialWitnessFirstOccurrence,modelIdentity,inputs.runIdentity.value).extend(witnessedCommunication!):witnessedCommunication;
 const relationship=model.relationship?createRelationshipExecution(component.tasks[0].character,model.relationship,stateModel,inputs.relationshipEvents,modelIdentity,inputs.runIdentity.value,model.encounterEnabled,model.attachment,inputs.attachmentEvents,model.loss,model.timeLimit):undefined;
 const social=model.social?createSocialExecution(component.tasks[0].character,model.social,stateModel,inputs.socialEvents,modelIdentity,inputs.runIdentity.value,model.recognition,model.encounterEnabled?relationship:undefined,model.socialMemory,model.encoding,model.memoryUse?(event,operands,report)=>episodes!.qualifyUse(event,operands,report):undefined,model.attachment,!!model.loss,!!model.embarrassment,model.timeLimit):undefined;
 const reservePriority=priorityCore?(meaning?meaning.extend(priorityCore):priorityCore):undefined;
 const lifecyclePriority=reservePriority?(spatialMeaning?spatialMeaning.extend(reservePriority):reservePriority):undefined;
 const priority=model.commitmentLifecycle?createCommitmentLifecycle(component.tasks[0].character,component.tasks,stateModel,inputs.commitmentEvents.filter(e=>key(e.eventTypeId)===key(COMMITMENT_REQUEST)),modelIdentity,inputs.runIdentity.value,model.timeLimit).extend(lifecyclePriority!):lifecyclePriority;
 const reappraisal=model.reappraisal?createReappraisalExecution(model.reappraisal,component.tasks[0].character,stateModel,inputs.reappraisalEvents,modelIdentity,inputs.runIdentity.value,()=>position?.mitigationEvidence(),model.timeLimit):undefined;
 let currentPosition:ReturnType<ReturnType<typeof createPositionExecution>['execute']>['memoryEvidence'];
 const actionMemory=model.actionMemory?createActionMemory(component.tasks[0].character,model.actionMemory,model.strategy!,model.spatialMeaning!,stateModel,modelIdentity,inputs.runIdentity.value,()=>currentPosition):undefined;
 const workMaintenance=model.workMaintenance?.bindings.length?createWorkMaintenance(component.tasks[0].character,model.workMaintenance,component.tasks,stateModel,inputs.workEvents,modelIdentity,inputs.runIdentity.value,model.timeLimit):undefined;
 const cognitive=createCognitiveExecution(model,component,inputs,()=>body?.evidence(),()=>episodes?.currentRecalls()??[],strategy,priority,habit,control,social,relationship,values,causal,reappraisal,model.bodyMemoryUse?(event,operands,report)=>episodes!.qualifyUse(event,operands,report):undefined,meaning,model.significanceEnabled?(event,workspace,attribution,report)=>episodes!.qualifySignificance(event,workspace,attribution,report):undefined,spatialMeaning,actionMemory,reasonEvidence,workMaintenance,model.timeLimit);
 const probeModel=base.probe,measurement=base.measurement,domains=base.domains,shared=bindings.admission,evaluator=bindings.evaluator;
 const memoryRuntime=createMemoryExecution(memory,measurement.validateOutput,modelIdentity,inputs.runIdentity.value,[]);
 const predictionRuntime=createPredictionExecution(prediction,modelIdentity,inputs.runIdentity.value,[]);
 const trace=compileCharacterTraceBinding(modelIdentity,inputs.runIdentity.value,probeModel);
 stateModel.validateState(initialState);domains.validateStatic(initialState);domains.validateReferences(initialState,0n);
 const initial=inputs.initial;
 const taskRuntime=(model.commitmentLifecycle?createCommitmentTaskExecution:createTaskExecution)(task,modelIdentity,inputs.runIdentity.value,initial.deadlines.map(event=>({event})));
 let ingress:ReturnType<typeof beginTransitionIngressV04>|undefined;
 let consequence:ReturnType<typeof base.bridge.begin>|undefined;
 let exposureSource:ReturnType<NonNullable<typeof inputs.hiddenExposure>['begin']>|undefined;
 let probe:ReturnType<typeof probeModel.begin>|undefined,probeSource:ReturnType<typeof beginProbeSourceInstant>|undefined;
  let carriagePadding:import('../substrate/scheduler').ScheduledEvent|undefined,probeInstant=false,runtimeCount=0,childCount=0;
  const counted=(allocator:{allocateRuntimeId():bigint})=>({allocateRuntimeId(){if(probeInstant)runtimeCount++;return allocator.allocateRuntimeId();}});
  const clone=(state:AuthoritativeState)=>new AuthoritativeState(state.entries());
  const handlers=new Map<string,EventHandler<AuthoritativeState>>();
  const registerHandler=(eventKey:string,handler:EventHandler<AuthoritativeState>)=>{
    if(handlers.has(eventKey))throw new SchedulerContractError('INVALID_CONFIGURATION','event has multiple fixed runtime adapters');handlers.set(eventKey,handler);
  };
  for(const eventType of workMaintenance?.eventTypes()??[])registerHandler(key(eventType),context=>workMaintenance!.execute(context));
  for(const eventType of effects?.eventTypes()??[])registerHandler(key(eventType),context=>{if(effects!.isLearning(context.event))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','effect belief requires prepared stage');const result=effects!.execute(context),extra=result.episode?episodes!.observeEffect(context.event,result.episode):undefined,own=result.emittedEvents.length;return {...result,emittedEvents:[...result.emittedEvents,...(extra?.emissions??[])],traceFactory(children:readonly ScheduledEvent[]){extra?.bind(children.slice(own));return result.traceFactory(children.slice(0,own)).map(row=>{const t=rec(row,160n);return record(t.schema,new Map([...t.fields].map(([k,v])=>[k,k===18n?list(children.map(scheduledEventValue)):v])));});}};});
  for(const eventType of reasonEvidence?.eventTypes()??[])registerHandler(key(eventType),context=>reasonEvidence!.execute(context));
  for(const eventType of position?.eventTypes()??[])registerHandler(key(eventType),context=>{const result=position!.execute(context);const extra=result.memoryEvidence?episodes!.observePosition(context.event,result.memoryEvidence,()=>context.allocateRuntimeId(),actionMemory?.capture(context.state,result.memoryEvidence)):undefined;if(result.memoryEvidence&&extra?.emissions.length)currentPosition=result.memoryEvidence;if(!extra)return result;const own=result.emittedEvents.length;return {...result,outputs:[...result.outputs,...extra.outputs],emittedEvents:[...result.emittedEvents,...extra.emissions],traceFactory(children:readonly ScheduledEvent[]){const trace=result.traceFactory(children.slice(0,own)),tail=children.slice(own);extra.bind(tail);return [...trace,extra.trace(tail)];}};});
  for(const eventType of relationship?.eventTypes()??[])registerHandler(key(eventType),context=>relationship!.execute(context));
  for(const eventType of social?.eventTypes()??[])registerHandler(key(eventType),context=>{
   const result=social!.execute(context),e=result.memoryEvidence;
   const plans=[e?episodes?.observeSocial(context.event,e.observation,e.experience,context.state,()=>context.allocateRuntimeId(),e.encoding):undefined,
    episodes?.observeAppearance(context.event,result.appearanceEvidence,context.state,()=>context.allocateRuntimeId(),!(e&&e.encoding?.positive&&items(items(e.observation,'list')[6],'list').length===1))].filter((p):p is NonNullable<typeof p>=>!!p);
   if(!plans.length)return result;const own=result.emittedEvents.length;
   return {...result,outputs:[...result.outputs,...plans.flatMap(p=>p.outputs)],emittedEvents:[...result.emittedEvents,...plans.flatMap(p=>p.emissions)],traceFactory(children:readonly ScheduledEvent[]){
    const traces=result.traceFactory(children.slice(0,own));let offset=own;
    for(const p of plans){const tail=children.slice(offset,offset+p.emissions.length);offset+=p.emissions.length;p.bind(tail);traces.push(p.trace(tail));}return traces;
   }};
  });
  for(const eventType of communication?.eventTypes()??[])registerHandler(key(eventType),context=>communication!.execute(context));
  for(const eventType of control?.eventTypes()??[])registerHandler(key(eventType),context=>control!.execute(context));
  for(const eventType of habit?.eventTypes()??[])registerHandler(key(eventType),context=>habit!.execute(context));
  for(const eventType of performance?.eventTypes()??[])registerHandler(key(eventType),context=>performance!.execute(context));
  for(const eventType of horizon?.eventTypes()??[])registerHandler(key(eventType),context=>horizon!.execute(context));
  for(const eventType of priority?.eventTypes()??[])registerHandler(key(eventType),context=>priority!.execute(context));
  for(const eventType of strategy?.eventTypes()??[])registerHandler(key(eventType),context=>strategy!.execute(context));
  for(const eventType of episodes?.eventTypes()??[])registerHandler(key(eventType),context=>episodes!.execute(context));
  if(procedure){registerHandler(key(PRACTICE_SETTING),context=>procedure.execute(context));registerHandler(key(PRACTICE),()=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','practice requires prepared stage');});}
  for(const eventType of body?.eventTypes()??[])registerHandler(key(eventType),context=>{
   const result=body!.execute(context),observed=effects&&key(context.event.eventTypeId)===key(BODY_DELIVERY)?effects.observeDelivery(context.event,result.outputs):undefined;
   if(observed){const own=result.emittedEvents.length;return {...result,emittedEvents:[...result.emittedEvents,...observed.emissions],traceFactory(children:readonly ScheduledEvent[]){observed.bind(children.slice(own));const rows=result.traceFactory(children.slice(0,own));return rows.map(row=>{const t=rec(row,160n);return record(t.schema,new Map([...t.fields].map(([k,v])=>[k,k===18n?list(children.map(scheduledEventValue)):k===6n?text('effect-evidence/0.1'):v])));});}};}
   const extra=episodes&&key(context.event.eventTypeId)===key(BODY_SELECTION)?episodes.observeSelection(context.event,body!.evidence()):undefined;
   const practice=procedure&&key(context.event.eventTypeId)===key(ACTION_BODY_EVENT)?procedure.observeEffect(context.event,result.outputs):undefined;
   const feedback=performance&&key(context.event.eventTypeId)===key(ACTION_BODY_EVENT)?performance.observeEffect(context.event,result.outputs):undefined;
   const habitFeedback=habit&&key(context.event.eventTypeId)===key(ACTION_BODY_EVENT)?habit.observeEffect(context.event,result.outputs):undefined;
   const message=communication&&key(context.event.eventTypeId)===key(ACTION_BODY_EVENT)?communication.observeEffect(context.event,result.outputs):undefined;
   if(!extra&&!practice&&!feedback&&!habitFeedback&&!message)return result;
   const own=result.emittedEvents.length,extraEvents=extra?.emissions??[];return {...result,outputs:[...result.outputs,...(habitFeedback?.outputs??[]),...(message?.outputs??[])],emittedEvents:[...result.emittedEvents,...extraEvents,...(practice?.emissions??[]),...(feedback?.emissions??[]),...(habitFeedback?.emissions??[]),...(message?.emissions??[])],traceFactory(children:readonly ScheduledEvent[]){const trace=result.traceFactory(children.slice(0,own)),middle=children.slice(own,own+extraEvents.length),tail=children.slice(own+extraEvents.length,own+extraEvents.length+(practice?.emissions.length??0)),feedbackStart=own+extraEvents.length+(practice?.emissions.length??0),feedbackChildren=children.slice(feedbackStart,feedbackStart+(feedback?.emissions.length??0)),habitStart=feedbackStart+(feedback?.emissions.length??0),habitChildren=children.slice(habitStart,habitStart+(habitFeedback?.emissions.length??0)),messageChildren=children.slice(habitStart+(habitFeedback?.emissions.length??0));extra?.bind(middle);practice?.bind(tail);feedback?.bind(feedbackChildren);habitFeedback?.bind(habitChildren);message?.bind(messageChildren);return [...trace,...(extra?[extra.trace(middle)]:[]),...(practice?[practice.trace(tail)]:[]),...(feedback?[feedback.trace(feedbackChildren)]:[]),...(habitFeedback?[habitFeedback.trace(habitChildren)]:[]),...(message?[message.trace(messageChildren)]:[])];}};
  });
  if(model.hiddenExposure)registerHandler(key(AUTHORED_FACT_EVENT),context=>{
   if(!exposureSource||!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','exposure outside admitted instant');
   const output=exposureSource.execute(context.event,context),plan=ingress.observeAuthoredSource(context.event,canonicalEncode(output)),pulse=consequence?.source(context.event,context),own=plan.emissions();
   return {nextState:context.state,outputs:[output],emittedEvents:[...own,...(pulse?.emissions()??[])],traceContributions:[],traceFactory:children=>{plan.bindAllocatedChildren(children.slice(0,own.length));pulse?.bindAllocatedChildren(children.slice(own.length));return [trace.record(context.event,[output],children)];}};
  });
  if(model.adaptBoundary)for(const eventType of base.bridge.eventTypes())registerHandler(key(eventType),context=>{
   if(!consequence||!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','consequence outside live instant');
   const result=consequence.execute(context.event,context),own=result.plan.emissions(),learning=result.freeze?ingress.observeSemanticFreeze(context.event,[canonicalEncode(result.freeze)]):undefined;
   return {nextState:context.state,outputs:result.outputs,emittedEvents:[...own,...(learning?.emissions()??[])],traceContributions:[],traceFactory:children=>{result.plan.bindAllocatedChildren(children.slice(0,own.length));learning?.bindAllocatedChildren(children.slice(own.length));return [trace.record(context.event,result.outputs,children)];}};
  });
  for(const eventType of probeModel.eventTypes()??[])registerHandler(key(eventType),context=>{
   if(!probe||!ingress||!probeSource)throw new SchedulerContractError('INPUT_NOT_ADMITTED','probe outside live instant');
   if(key(context.event.eventTypeId)===key(PROBE_SOURCE_EVENT)){probeSource.admit(context.event);probeInstant=true;}
   const result=probe.execute(context.event,context.state,counted(context)),plan=result.freeze?ingress.observeSemanticFreeze(context.event,[canonicalEncode(result.freeze)]):undefined;
   const emissions=result.plan.emissions();
   const carriageSlot=context.event.phase===120n;
   let carriagePlan:ReturnType<NonNullable<typeof ingress>['observeMeasurement']>|undefined;
   if(carriageSlot&&probeModel.permitted){if(result.outputs.length!==1)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','missing diagnostic observation');measurement.validateInput(result.outputs[0]);carriagePlan=ingress.observeMeasurement(context.event,canonicalEncode(result.outputs[0]));}
   else if(carriageSlot&&result.outputs.length)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','suppressed producer emitted evidence');
   const extra=carriagePlan?.emissions()??(carriageSlot?[{dueAt:context.event.dueAt,phase:130n,eventTypeId:CARRIAGE_PADDING,payload:list([]),dependencies:list([])}]:[]);
   if(carriageSlot&&(emissions.length!==1||extra.length!==1))throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','carriage slot multiplicity');
   return {nextState:context.state,outputs:result.outputs,emittedEvents:[...emissions,...extra,...(plan?.emissions()??[])],traceContributions:[],traceFactory:children=>{
    result.plan.bindAllocatedChildren(children.slice(0,emissions.length));
    if(probeInstant)childCount+=children.length;
    if(carriagePlan)carriagePlan.bindAllocatedChildren(children.slice(emissions.length,emissions.length+1));
    else if(carriageSlot){if(carriagePadding)throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','duplicate padding');carriagePadding=structuredClone(children[emissions.length]);}
    plan?.bindAllocatedChildren(children.slice(emissions.length+extra.length));
    return trace?[trace.record(context.event,result.outputs,children,undefined,{readDomain:context.event.phase===110n?[probeModel.pattern]:[],actualReadRecords:result.reads,patch:{operations:[]},diffs:[]})]:[];
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
      return {nextState:context.state,outputs:[output],emittedEvents:plan.emissions(),traceContributions:[],traceFactory:children=>{plan.bindAllocatedChildren(children);if(probeInstant)childCount+=children.length;return trace?[trace.record(context.event,[output],children,registration)]:[];}};
    });
  }
  if(measurement){
   registerHandler(key(INTAKE_EVENT),context=>{
    if(!ingress||!probeInstant)throw new SchedulerContractError('INPUT_NOT_ADMITTED','carriage outside probe instant');
    const cap=ingress.admit(context.event),payload=admittedInputFacts(cap).payload;measurement.validateInput(payload);
    const occurrence=ingress.allocateMeasurementIdentity(cap,counted(context));
    const output=executeMeasurementIntake(payload,measurement.unit,occurrence);
    const terminal=ingress.completeMeasurement(cap,canonicalEncode(output));
    const memoryPlan=memoryRuntime.observeIntake(context.event,output);
    return {nextState:context.state,outputs:[output],emittedEvents:memoryPlan?.emissions()??terminal.emissions(),traceContributions:[],traceFactory:children=>{terminal.bindAllocatedChildren(memoryPlan?[]:children);memoryPlan?.bindAllocatedChildren(children);childCount+=children.length;return trace?[trace.record(context.event,[output],children,shared.decode(measurement.registration))]:[];}};
   });
   registerHandler(key(CARRIAGE_PADDING),context=>{
    if(!carriagePadding||key(scheduledEventValue(context.event))!==key(scheduledEventValue(carriagePadding)))throw new SchedulerContractError('INPUT_NOT_ADMITTED','unassociated carriage padding');
    carriagePadding=undefined;counted(context).allocateRuntimeId();
    const memoryPlan=memoryRuntime.observeIntake(context.event);
    return {nextState:context.state,outputs:[],emittedEvents:memoryPlan?.emissions()??[],traceContributions:[],traceFactory:children=>{memoryPlan?.bindAllocatedChildren(children);childCount+=children.length;return trace?[trace.record(context.event,[],children)]:[];}};
   });
  }
  for(const eventType of memoryRuntime.eventTypes()??[])registerHandler(key(eventType),context=>{
    const result=memoryRuntime.execute(context.event,context.state,counted(context));
    const isM1=['event/measurement-episode-evidence','event/measurement-episode-evidence-padding'].some(n=>key(context.event.eventTypeId)===key({kind:'typedIdentifier',namespaceId:1001n,payload:text(n)}));
    const extra=isM1?predictionRuntime.observeM1(context.event,result.outputs[0]):undefined,old=result.plan.emissions(),extraEvents=extra?.emissions()??[],prospective=isM1?taskRuntime.observeM1(context.event,result.outputs[0]):undefined;
    return {nextState:result.nextState,outputs:result.outputs,emittedEvents:[...old,...extraEvents,...(prospective?.emissions()??[])],traceContributions:[],traceFactory:children=>{result.plan.bindAllocatedChildren(children.slice(0,old.length));extra?.bindAllocatedChildren(children.slice(old.length,old.length+extraEvents.length));prospective?.bindAllocatedChildren(children.slice(old.length+extraEvents.length));if(probeInstant)childCount+=children.length;return [result.trace(children)];}};
  });
  for(const eventType of predictionRuntime.eventTypes()??[])registerHandler(key(eventType),context=>{
    const result=predictionRuntime.execute(context.event,context.state,counted(context));
    return {nextState:result.nextState,outputs:result.outputs,emittedEvents:[],traceContributions:[],traceFactory:()=>[result.trace()]};
  });
  for(const eventType of taskRuntime.eventTypes()??[])registerHandler(key(eventType),()=>{throw new SchedulerContractError('TASK_STAGE_VIOLATION','task requires prepared stage');});
  if(reappraisal)for(const eventType of reappraisal.eventTypes())registerHandler(key(eventType),context=>reappraisal.execute(context));
  if(causal)for(const eventType of causal.eventTypes())registerHandler(key(eventType),context=>causal.execute(context));
  if(values)registerHandler(key(VALUES_CONTEXT),context=>({nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[values.context(context.event)]}));
  if(model.selfBeliefEnabled)registerHandler(key(cognitive.selfContextType()),context=>({nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[cognitive.executeSelfContext(context.event)]}));
  if(model.eligibilityEnabled)registerHandler(key(cognitive.contextEventType()),context=>({nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[cognitive.executeContext(context.event)]}));
  for(const eventType of cognitive.eventTypes()??[])registerHandler(key(eventType),async context=>{
   if(!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','cognitive outside live ingress');
   const result=await cognitive.execute(context.event,context.state,context),own=result.emissions();
   const extra=typeof result.output!=='boolean'&&result.output.kind==='record'&&result.output.schema.typeId===307n?ingress.observeProtocolSource(context.event,canonicalEncode(result.output)):undefined;
   const extraEvents=extra?.emissions()??[],strategyPlan=result.strategyPlan,reappraisalPlan=typeof result.output!=='boolean'&&result.output.kind==='record'&&result.output.schema.typeId===433n?reappraisal?.complete(context.event,result.output):undefined,effect=!reappraisalPlan&&typeof result.output!=='boolean'&&result.output.kind==='record'&&result.output.schema.typeId===433n?body?.observeExecution(context.event,result.output):undefined;
   const rehearsalPlan=episodes?.observeRehearsal(context.event,result.additionalOutputs);
   const expression=typeof result.output!=='boolean'&&result.output.kind==='record'&&result.output.schema.typeId===426n?communication?.expression(context.event,context.state,result.output):undefined;
   const effectProbe=effects&&context.event.phase===50n&&txt(context.event.eventTypeId.payload)==='event/task-appraisal'?effects.probe(context):undefined;
   return {nextState:result.nextState??context.state,outputs:[result.output,...result.additionalOutputs,...(effectProbe?[effectProbe.output]:[]),...(expression?[expression.report]:[]),...(rehearsalPlan?[rehearsalPlan.report]:[])],emittedEvents:[...own,...extraEvents,...(effect?.emissions??[]),...(strategyPlan?.emissions??[]),...(reappraisalPlan?.emissions??[]),...(rehearsalPlan?.emissions??[])],traceContributions:[],traceFactory:children=>{
    result.bindAllocatedChildren(children.slice(0,own.length));extra?.bindAllocatedChildren(children.slice(own.length,own.length+extraEvents.length));const effectEnd=own.length+extraEvents.length+(effect?.emissions.length??0);effect?.bind(children.slice(own.length+extraEvents.length,effectEnd));const strategyEnd=effectEnd+(strategyPlan?.emissions.length??0);strategyPlan?.bind(children.slice(effectEnd,strategyEnd));const reappraisalEnd=strategyEnd+(reappraisalPlan?.emissions.length??0);reappraisalPlan?.bind(children.slice(strategyEnd,reappraisalEnd));rehearsalPlan?.bind(children.slice(reappraisalEnd));
    const original=rec(result.trace(children),160n);return [effect?record(original.schema,new Map([...original.fields].map(([n,v])=>[n,n===6n?text('assembled-character-protocol-body-source/0.1-candidate'):v]))):original,...result.controlTraces(children),...(effectProbe?[effectProbe.trace()]:[]),...(expression?[expression.trace(children)]:[]),...(strategyPlan?[strategyPlan.trace(children.slice(effectEnd,strategyEnd))]:[]),...(reappraisalPlan?[reappraisalPlan.trace(children.slice(strategyEnd,reappraisalEnd))]:[]),...(rehearsalPlan?[rehearsalPlan.trace(children.slice(reappraisalEnd))]:[])];
   }};
  });
  for(const eventType of cognitive.protocolEventTypes()??[])registerHandler(key(eventType),context=>{
   if(!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','protocol outside live ingress');
   const result=cognitive.executeProtocol(context.event,context),own=result.plan.emissions(),extra=result.freeze?ingress.observeSemanticFreeze(context.event,[canonicalEncode(result.freeze)]):undefined;
   return {nextState:context.state,outputs:result.outputs,emittedEvents:[...own,...(extra?.emissions()??[])],traceContributions:[],traceFactory:children=>{result.plan.bindAllocatedChildren(children.slice(0,own.length));extra?.bindAllocatedChildren(children.slice(own.length));return [result.trace(children)];}};
  });
  registerHandler(key(cognitive.identityEventType()),()=>{throw new SchedulerContractError('COGNITIVE_STAGE_VIOLATION','identity requires common prepared stage');});
  const scheduler=new DeterministicScheduler({initialState,initialQueue:initial.events,initialAllocators:initial.allocators,

    maxSettlementWorkPerSimulationInstant:maxWork,
    stateAdapter:{clone,canonicalValue:state=>state.canonicalValue(),validate:state=>{stateModel.validateState(state);domains.validateStatic(state);}},
    handlers,
    adaptationSettlement:{version:'adaptation-settlement/0.2-candidate',
      beforeInstant(state,instant){
        domains.validateStatic(state);domains.validateReferences(state,instant);workMaintenance?.begin(instant);reappraisal?.begin(instant);position?.begin(instant);reasonEvidence?.begin(instant);effects?.begin(instant);currentPosition=undefined;
        probeInstant=false;runtimeCount=0;childCount=0;carriagePadding=undefined;memoryRuntime.begin(instant);predictionRuntime.begin(instant);taskRuntime.begin(instant);cognitive.begin(instant);body?.begin(instant);episodes?.begin(instant);procedure?.begin(instant);strategy?.begin(instant);priority?.begin(instant);horizon?.begin(instant);performance?.begin(instant);values?.begin(instant);causal?.begin(instant);habit?.begin(instant);control?.begin(instant);communication?.begin(instant);social?.begin(instant);relationship?.begin(instant);
        ingress=beginTransitionIngressV04(shared,instant);

        consequence=model.adaptBoundary?base.bridge.begin(instant):undefined;exposureSource=inputs.hiddenExposure?.begin(instant);probe=probeModel.begin(instant);probeSource=inputs.beginProbe(instant);
      },
      prepare(events,state,instant){
        if(!ingress)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','missing live ingress');
        const workAll=events,workEvents=events.filter(e=>workMaintenance?.isLearning(e)),workStage=workEvents.length?workMaintenance!.prepare(workEvents,state):undefined;
        events=events.filter(e=>!workMaintenance?.isLearning(e));
        function withoutWork(){
        const reappraisalAll=events,reappraisalEvents=events.filter(e=>reappraisal?.isLearning(e)),reappraisalStage=reappraisalEvents.length?reappraisal!.prepare(reappraisalEvents,state):undefined;
        events=events.filter(e=>!reappraisal?.isLearning(e));
        function withoutReappraisal(){
        const causalAll=events,causalEvents=events.filter(e=>causal?.isLearning(e));
        const causalStage=causalEvents.length?causal!.prepare(causalEvents,state):undefined;
        events=events.filter(e=>!causal?.isLearning(e));
        function withoutCausal(){
        const relationshipAll=events,relationshipEvents=events.filter(e=>relationship?.isLearning(e));
        const relationshipStage=relationshipEvents.length?relationship!.prepare(relationshipEvents,state):undefined;
        events=events.filter(e=>!relationship?.isLearning(e));
        function withoutRelationship(){
        const socialAll=events,socialEvents=events.filter(e=>social?.isLearning(e));
        const socialStage=socialEvents.length?social!.prepare(socialEvents,state):undefined;
        events=events.filter(e=>!social?.isLearning(e));
        function withoutSocial(){
        const communicationAll=events,communicationEvents=events.filter(e=>communication?.isLearning(e));
        const communicationStage=communicationEvents.length?communication!.prepare(communicationEvents,state):undefined;
        events=events.filter(e=>!communication?.isLearning(e));
        function withoutCommunication(){
        const controlAll=events,controlEvents=events.filter(e=>control?.isLearning(e));
        const controlStage=controlEvents.length?control!.prepare(controlEvents,state):undefined;
        events=events.filter(e=>!control?.isLearning(e));
        function withoutControl(){
        const habitAll=events,habitEvents=events.filter(e=>habit?.isLearning(e));
        const habitStage=habitEvents.length?habit!.prepare(habitEvents,state):undefined;
        events=events.filter(e=>!habit?.isLearning(e));
        function withoutHabit(){
        const performanceAll=events,performanceEvents=events.filter(e=>performance?.isLearning(e));
        const performanceStage=performanceEvents.length?performance!.prepare(performanceEvents,state):undefined;
        events=events.filter(e=>!performance?.isLearning(e));
        function withoutPerformance(){
        const horizonAll=events,horizonEvents=events.filter(e=>horizon?.isLearning(e));
        const horizonStage=horizonEvents.length?horizon!.prepare(horizonEvents,state):undefined;
        events=events.filter(e=>!horizon?.isLearning(e));
        function withoutHorizon(){
        const priorityAll=events,priorityEvents=events.filter(e=>priority?.isLearning(e));
        const priorityStage=priorityEvents.length?priority!.prepare(priorityEvents,state):undefined;
        events=events.filter(e=>!priority?.isLearning(e));
        function withoutPriority(){
        const strategyAll=events,learningEvents=events.filter(e=>strategy?.isLearning(e));
        const learningStage=learningEvents.length?strategy!.prepare(learningEvents,state):undefined;
        events=events.filter(e=>!strategy?.isLearning(e));
        function withoutStrategy(){
        const allEvents=events,practiceEvents=events.filter(e=>procedure?.isPractice(e));
        const practiceStage=practiceEvents.length?procedure!.prepare(practiceEvents,state):undefined;
        events=events.filter(e=>!procedure?.isPractice(e));
        function joinedStage(){
        function inheritedStage(events:readonly ScheduledEvent[]): {execute(context:EventHandlerContext<AuthoritativeState>): {nextState:AuthoritativeState;outputs:readonly CanonicalValue[];emittedEvents:readonly import('../substrate/scheduler').EventEmission[];traceContributions:readonly CanonicalValue[]};finish():AuthoritativeState;finalizeTrace():readonly CanonicalValue[]}{
         const effectEvents=events.filter(e=>effects?.isLearning(e));
         if(effectEvents.length){
          const next=effects!.prepare(effectEvents,state),rest=events.filter(e=>!effects!.isLearning(e)),previous=rest.length?inheritedStage(rest):undefined;
          let cursor=0,finished=false;
          return {execute(context){if(finished||cursor>=events.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(events[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','effect shared stage order');return effects!.isLearning(context.event)?next.execute(context):previous!.execute(context);},
           finish(){if(finished||cursor!==events.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete effect stage');finished=true;return next.finish(previous?.finish()??state);},
           finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','effect trace before completion');const rows=[...(previous?.finalizeTrace()??[]),...next.traces()];return events.flatMap(e=>rows.filter(t=>key(f(rec(f(rec(t,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
         }
        cognitive.validateParticipants(events);
        function prepareGroup(events:readonly ScheduledEvent[]){
        function inherited(events:readonly ScheduledEvent[]){
        if(events.some(e=>memoryRuntime.isEvent(e)||predictionRuntime.isEvent(e))){
          predictionRuntime.validatePair(events);
          let index=0,finished=false,executing=false,memoryResult:ReturnType<typeof memoryRuntime.execute>|undefined,predictionResult:ReturnType<typeof predictionRuntime.execute>|undefined;
          const traces:(()=>CanonicalValue)[]=[];
          return {execute(context:EventHandlerContext<AuthoritativeState>){
            if(finished||executing||index>=events.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(events[index])))throw new SchedulerContractError('PREDICTION_STAGE_VIOLATION','prediction pair execution lifecycle');
            executing=true;try{
              if(memoryRuntime.isEvent(context.event)){memoryResult=memoryRuntime.execute(context.event,state,counted(context));memoryResult.plan.bindAllocatedChildren([]);if(memoryResult.outputs.length)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','formation pair member emitted semantic output');traces.push(()=>memoryResult!.trace([]));}
              else{predictionResult=predictionRuntime.execute(context.event,state,counted(context));if(predictionResult.outputs.length)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','prediction application emitted semantic output');traces.push(()=>predictionResult!.trace());}
              index++;return {nextState:state,outputs:[],emittedEvents:[],traceContributions:[]};
            }finally{executing=false;}
          },finish(){
            if(finished||executing||index!==events.length||!memoryResult||!predictionResult)throw new SchedulerContractError('PREDICTION_STAGE_VIOLATION','incomplete prediction pair');finished=true;
            // Both evaluated against B0. Applying the separately authorized belief
            // patch to the memory candidate cannot overwrite the episode patch.
            return predictionResult.patch.operations.length?stateModel.applyPatch(memoryResult.nextState,predictionResult.patch,{kind:'typedIdentifier',namespaceId:1025n,payload:text('authority/belief-expectation')},{writableRoots:[362n],targetPaths:predictionResult.patch.operations.map(o=>o.path)}).state:memoryResult.nextState;
          },finalizeTrace(){if(!finished)throw new SchedulerContractError('PREDICTION_STAGE_VIOLATION','prediction trace before completion');return traces.map(make=>make());}};
        }
        for(const event of events)if(!shared.registrationForEvent(event.eventTypeId))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','undeclared phase-140 event');
        const tokens=events.map(event=>ingress!.admit(event)),batch=evaluator.prepare(tokens,instant).begin(state);let index=0;
        let completed:ReturnType<typeof batch.finish>|undefined;
        return {
          execute(context:EventHandlerContext<AuthoritativeState>){
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
        }

        const prospective=events.filter(e=>taskRuntime.isEvent(e)),baseEvents=events.filter(e=>!taskRuntime.isEvent(e)),slots=prospective.filter(e=>key(e.eventTypeId)!==key(TASK_DEADLINE_EVENT)),clocks=prospective.filter(e=>key(e.eventTypeId)===key(TASK_DEADLINE_EVENT));
        const hasPair=baseEvents.some(e=>memoryRuntime.isEvent(e)||predictionRuntime.isEvent(e));
        const bad=(message:string):never=>{throw new SchedulerContractError('TASK_STAGE_VIOLATION',message);};
        if(clocks.length>component.tasks.length||slots.length!==(hasPair?1:0))bad('task stage slot multiplicity');
        if(hasPair){predictionRuntime.validatePair(baseEvents);const p=baseEvents.find(e=>predictionRuntime.isEvent(e))!,s=slots[0];if(s.causalParentEventIds.length!==1||s.causalParentEventIds[0]!==p.causalParentEventIds[0]||key(s.payload)!==key(p.payload)||(key(s.eventTypeId)===key({kind:'typedIdentifier',namespaceId:1001n,payload:text('event/task-measurement-settlement-padding')}))!==(key(p.eventTypeId)===key({kind:'typedIdentifier',namespaceId:1001n,payload:text('event/measurement-prediction-application-padding')})))bad('task S does not match P');}
        // Source/subject/target admission precedes every group's prior evaluation.
        for(const event of events){if(taskRuntime.isEvent(event))taskRuntime.preflight(event,state);else if(memoryRuntime.isEvent(event))memoryRuntime.preflightFormation(event,state);else if(predictionRuntime.isEvent(event))predictionRuntime.preflightApplication(event,state);}
        const baseStage=baseEvents.length?inherited(baseEvents):undefined;
        taskRuntime.sealPreflight();
        let cursor=0,finished=false,executing=false;const results:ReturnType<typeof taskRuntime.execute>[]=[],traceOrder:{task?:ReturnType<typeof taskRuntime.execute>}[]=[];
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||executing||cursor>=events.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(events[cursor])))bad('task stage execution lifecycle');executing=true;try{cursor++;if(taskRuntime.isEvent(context.event)){const result=taskRuntime.execute(context.event,state);results.push(result);traceOrder.push({task:result});return {nextState:state,outputs:[],emittedEvents:[],traceContributions:[]};}traceOrder.push({});return baseStage!.execute(context);}finally{executing=false;}},
          finish(){if(finished||executing||cursor!==events.length)bad('incomplete task stage');finished=true;let candidate=baseStage?.finish()??state;for(const result of results)candidate=stateModel.applyPatch(candidate,result.patch,{kind:'typedIdentifier',namespaceId:1025n,payload:text('authority/prospective-commitments')},{writableRoots:[373n],targetPaths:result.patch.operations.map(o=>o.path)}).state;return candidate;},
          finalizeTrace(){if(!finished)bad('task trace before finish');const baseTrace=baseStage?.finalizeTrace()??[];let i=0;const values=traceOrder.map(x=>x.task?x.task.trace():baseTrace[i++]);if(i!==baseTrace.length||values.some(x=>x===undefined))bad('task trace accounting');return values;}};
        }
        const identityEvents=events.filter(e=>key(e.eventTypeId)===key(cognitive.identityEventType()));
        if(!identityEvents.length)return prepareGroup(events);
        const bad=(message:string):never=>{throw new SchedulerContractError('COGNITIVE_STAGE_VIOLATION',message);};
        const identityEvent=identityEvents[0],rest=events.filter(e=>e!==identityEvent),automatic=rest.filter(e=>!!shared.registrationForEvent(e.eventTypeId));
        if(identityEvents.length!==1||automatic.length!==cognitive.automaticParticipantCount()||rest.some(e=>e!==automatic[0]&&key(e.eventTypeId)!==key(TASK_DEADLINE_EVENT)))bad('chosen stage requires A + I with optional deadlines only');
        // Source and target admission for I precedes prepareGroup, which admits
        // every inherited target before it opens the ADAPT B0 read capability.
        const paths=cognitive.preflightIdentity(identityEvent,state);if(paths.some(p=>p.rootStateTypeId!==415n))bad('identity target overlaps inherited owners');
        cognitive.selfPreflight(identityEvent);
        const inherited=rest.length?prepareGroup(rest):{execute(_context:EventHandlerContext<AuthoritativeState>):never{return bad('unexpected inherited event');},finish:()=>state,finalizeTrace:()=>[] as CanonicalValue[]};cognitive.sealIdentityPreflight();
        const selfCandidate=cognitive.selfCandidate(identityEvent,state),formationCandidate=cognitive.formationCandidate(identityEvent,state);
        let cursor=0,finished=false,result:ReturnType<NonNullable<typeof cognitive>['identityCandidate']>|undefined,identityTrace:CanonicalValue|undefined,selfTrace:CanonicalValue|undefined,formationTrace:CanonicalValue|undefined;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(events[cursor++])))bad('cognitive common-stage execution order');
         if(key(context.event.eventTypeId)===key(cognitive.identityEventType())){result=cognitive.identityCandidate(context.event,state);return {nextState:state,outputs:formationCandidate?[formationCandidate.report]:[],emittedEvents:[],traceContributions:[]};}return inherited.execute(context);},
         finish(){if(finished||cursor!==events.length||!result)bad('incomplete cognitive common stage');finished=true;const inheritedState=inherited.finish(),applied=stateModel.applyPatch(inheritedState,result!.patch,result!.authority,{writableRoots:[415n],targetPaths:paths});identityTrace=result!.trace(applied.diffs);let candidate=applied.state;if(selfCandidate){const learned=stateModel.applyPatch(candidate,selfCandidate.patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:selfCandidate.patch.operations.map(o=>o.path)});selfTrace=selfCandidate.trace(learned.diffs);candidate=learned.state;}if(formationCandidate){const formed=stateModel.applyPatch(candidate,formationCandidate.patch,formationCandidate.authority,{writableRoots:[1503n],targetPaths:formationCandidate.patch.operations.map(o=>o.path)});formationTrace=formationCandidate.trace(formed.diffs);candidate=formed.state;}return candidate;},
         finalizeTrace(){if(!finished||!identityTrace)bad('cognitive trace before WRT completion');const rows=inherited.finalizeTrace();let i=0;return events.flatMap(e=>e===identityEvent?[identityTrace!,...(selfTrace?[selfTrace]:[]),...(formationTrace?[formationTrace]:[])]:[rows[i++]]);}};
        }
        const added=events.filter(e=>episodes?.isFormation(e));
        if(!added.length)return inheritedStage(events);
        // Authenticate all new targets against common B0 BEFORE inherited evaluation.
        const episodeStage=episodes!.prepare(added,state),rest=events.filter(e=>!episodes!.isFormation(e));
        const priorStage=rest.length?inheritedStage(rest):undefined;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){
         if(finished||cursor>=events.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(events[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','shared episodic stage order');
         return episodes!.isFormation(context.event)?episodeStage.execute(context):priorStage!.execute(context);
        },finish(){if(finished||cursor!==events.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete shared episodic stage');finished=true;return episodeStage.finish(priorStage?.finish()??state);},
        finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','episodic trace before completion');const rows=[...(priorStage?.finalizeTrace()??[]),...episodeStage.traces()];return events.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const stage=joinedStage();
        const retention=model.retention?prepareEpisodicRetention(events,state,component.tasks[0].character,model.retention,stateModel,modelIdentity,inputs.runIdentity.value,model.memoryUse,model.memoryUse?event=>episodes!.preparedPresentation(event):undefined,model.significanceEnabled):undefined;
        const retained=retention?{execute(context:EventHandlerContext<AuthoritativeState>){const result=stage.execute(context);return context.event.eventId===retention.anchor.eventId?{...result,outputs:[...result.outputs,retention.audit]}:result;},
         finish(){return retention.finish(stage.finish());},
         finalizeTrace(){const rows=stage.finalizeTrace();let attached=false;return rows.flatMap(row=>{const anchor=key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:retention.anchor.eventId});if(anchor&&!attached){attached=true;return [row,retention.trace()];}return [row];});}}:stage;
        if(!practiceStage)return retained;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=allEvents.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(allEvents[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','procedural common stage order');return procedure!.isPractice(context.event)?practiceStage.execute(context):retained.execute(context);},
         finish(){if(finished||cursor!==allEvents.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete procedural common stage');finished=true;return practiceStage.finish(retained.finish());},
         finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','procedural trace before finish');const rows=[...retained.finalizeTrace(),...practiceStage.traces()];return allEvents.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const old=withoutStrategy();if(!learningStage)return old;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=strategyAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(strategyAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','strategy common stage order');return strategy!.isLearning(context.event)?learningStage.execute(context):old.execute(context);},finish(){if(finished||cursor!==strategyAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete strategy stage');finished=true;return learningStage.finish(old.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','strategy trace before finish');const rows=[...old.finalizeTrace(),...learningStage.traces()];return strategyAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const prior=withoutPriority();if(!priorityStage)return prior;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=priorityAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(priorityAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','priority common stage order');return priority!.isLearning(context.event)?priorityStage.execute(context):prior.execute(context);},finish(){if(finished||cursor!==priorityAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete priority stage');finished=true;return priorityStage.finish(prior.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','priority trace before finish');const rows=[...prior.finalizeTrace(),...priorityStage.traces()];return priorityAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutHorizon();if(!horizonStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=horizonAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(horizonAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','horizon common stage order');return horizon!.isLearning(context.event)?horizonStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==horizonAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete horizon stage');finished=true;return horizonStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','horizon trace before finish');const rows=[...inner.finalizeTrace(),...horizonStage.traces()];return horizonAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutPerformance();if(!performanceStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=performanceAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(performanceAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','performance common stage order');return performance!.isLearning(context.event)?performanceStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==performanceAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete performance stage');finished=true;return performanceStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','performance trace before finish');const rows=[...inner.finalizeTrace(),...performanceStage.traces()];return performanceAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutHabit();if(!habitStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=habitAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(habitAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','habit common stage order');return habit!.isLearning(context.event)?habitStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==habitAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete habit stage');finished=true;return habitStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','habit trace before finish');const rows=[...inner.finalizeTrace(),...habitStage.traces()];return habitAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutControl();if(!controlStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=controlAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(controlAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','control common stage order');return control!.isLearning(context.event)?controlStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==controlAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete control stage');finished=true;return controlStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','control trace before finish');const rows=[...inner.finalizeTrace(),...controlStage.traces()];return controlAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutCommunication();if(!communicationStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=communicationAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(communicationAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','communication common stage order');return communication!.isLearning(context.event)?communicationStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==communicationAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete communication stage');finished=true;return communicationStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','communication trace before finish');const rows=[...inner.finalizeTrace(),...communicationStage.traces()];return communicationAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutSocial();if(!socialStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=socialAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(socialAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','social common stage order');return social!.isLearning(context.event)?socialStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==socialAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete social stage');finished=true;return socialStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','social trace before finish');const rows=[...inner.finalizeTrace(),...socialStage.traces()];return socialAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=withoutRelationship();if(!relationshipStage)return inner;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=relationshipAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(relationshipAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','relationship common stage order');return relationship!.isLearning(context.event)?relationshipStage.execute(context):inner.execute(context);},finish(){if(finished||cursor!==relationshipAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete relationship stage');finished=true;return relationshipStage.finish(inner.finish());},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','relationship trace before finish');const rows=[...inner.finalizeTrace(),...relationshipStage.traces()];return relationshipAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=events.length?withoutCausal():undefined;if(!causalStage)return inner!;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=causalAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(causalAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','causal common stage order');return causal!.isLearning(context.event)?causalStage.execute(context):inner!.execute(context);},finish(){if(finished||cursor!==causalAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete causal stage');finished=true;return causalStage.finish(inner?.finish()??state);},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','causal trace before finish');const rows=[...(inner?.finalizeTrace()??[]),...causalStage.traces()];return causalAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=events.length?withoutReappraisal():undefined;if(!reappraisalStage)return inner!;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=reappraisalAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(reappraisalAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','reappraisal common stage order');return reappraisal!.isLearning(context.event)?reappraisalStage.execute(context):inner!.execute(context);},finish(){if(finished||cursor!==reappraisalAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','incomplete reappraisal stage');finished=true;return reappraisalStage.finish(inner?.finish()??state);},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','reappraisal trace before finish');const rows=[...(inner?.finalizeTrace()??[]),...reappraisalStage.traces()];return reappraisalAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
        }
        const inner=events.length?withoutWork():undefined;if(!workStage)return inner!;
        let cursor=0,finished=false;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=workAll.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(workAll[cursor++])))throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','work common order');return workMaintenance!.isLearning(context.event)?workStage.execute(context):inner!.execute(context);},finish(){if(finished||cursor!==workAll.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','work unfinished');finished=true;return workStage.finish(inner?.finish()??state);},finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','work trace');const rows=[...(inner?.finalizeTrace()??[]),...workStage.traces()];return workAll.flatMap(e=>rows.filter(row=>key(f(rec(f(rec(row,160n),4n),130n),1n))===key({kind:'unsigned',value:e.eventId})));}};
      },
      beforeCommit(state,instant){domains.validateStatic(state);domains.validateReferences(state,instant);probe?.finish();consequence?.finish();workMaintenance?.prepareCommit();position?.prepareCommit();reasonEvidence?.prepareCommit();effects?.prepareCommit();reappraisal?.prepareCommit();relationship?.prepareCommit();social?.prepareCommit();communication?.prepareCommit();control?.prepareCommit();habit?.prepareCommit();performance?.prepareCommit();values?.prepareCommit();causal?.prepareCommit();horizon?.prepareCommit();priority?.prepareCommit();strategy?.prepareCommit();procedure?.prepareCommit();body?.prepareCommit();episodes?.prepareCommit();ingress!.finish();if(probeInstant&&(runtimeCount!==7||childCount!==14||carriagePadding))throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','carriage/memory budget closure');taskRuntime.prepareCommit(state);predictionRuntime.prepareCommit();cognitive.prepareCommit();memoryRuntime.commit();episodes?.commit();body?.commit();predictionRuntime.commit();taskRuntime.commit();cognitive.commit();},
      close(){consequence?.abort();consequence=undefined;exposureSource?.close();exposureSource=undefined;currentPosition=undefined;workMaintenance?.close();position?.close();reasonEvidence?.close();effects?.close();reappraisal?.close();relationship?.close();social?.close();communication?.close();control?.close();habit?.close();performance?.close();values?.close();causal?.close();horizon?.close();priority?.close();strategy?.close();procedure?.close();episodes?.close();body?.close();memoryRuntime.close();predictionRuntime.close();taskRuntime.close();cognitive.close();ingress?.abort();probe?.abort();probeSource?.close();ingress=undefined;probe=undefined;probeSource=undefined;},
      validateRuntimeEmission(event){if(key(event.eventTypeId)===key(CURRENT_SEM_SOURCE)||key(event.eventTypeId)===key(WORK_SOURCE)||key(event.eventTypeId)===key(COMMITMENT_REQUEST)||key(event.eventTypeId)===key(REASON_READING)||[GOAL_ADOPT,GOAL_EXPIRE].some(e=>key(e)===key(event.eventTypeId))||key(event.eventTypeId)===key(REAPPRAISAL_SOURCE)||key(event.eventTypeId)===key(INTERFERENCE_SOURCE)||key(event.eventTypeId)===key(INTERFERENCE_CONTEXT)||key(event.eventTypeId)===key(CAUSAL_SOURCE)||key(event.eventTypeId)===key(CAUSAL_CONTEXT)||key(event.eventTypeId)===key(VALUES_CONTEXT)||key(event.eventTypeId)===key(REL_SOURCE)||key(event.eventTypeId)===key(SOCIAL_SOURCE)||key(event.eventTypeId)===key(COMM_SOURCE)||key(event.eventTypeId)===key(CONTROL_SOURCE)||key(event.eventTypeId)===key(HABIT_SOURCE)||key(event.eventTypeId)===key(PERFORMANCE_SETTING)||key(event.eventTypeId)===key(HORIZON_DISPLAY)||key(event.eventTypeId)===key(PRIORITY_DISPLAY)||key(event.eventTypeId)===key(DISPLAY)||key(event.eventTypeId)===key(PRACTICE_SETTING)||key(event.eventTypeId)===key(BODY_SAMPLE)||key(event.eventTypeId)===key(BODY_DELIVERY)||key(event.eventTypeId)===key(AUTHORED_FACT_EVENT)||key(event.eventTypeId)===key(PROBE_SOURCE_EVENT)||key(event.eventTypeId)===key(DELIBERATION_EVENT)||key(event.eventTypeId)===key(TASK_DEADLINE_EVENT))throw new SchedulerContractError('INPUT_ONLY_EVENT_ORIGIN_VIOLATION','sources are compiler-only inputs');},
    },
  });
  // Only quiescent observations/settlement are exposed. No injection, allocator or handler API.
  return Object.freeze({taskPendingFacts:()=>taskRuntime.pendingFacts()??[],memoryPendingFacts:()=>memoryRuntime.pendingFacts()??[],predictionPendingFacts:()=>predictionRuntime.pendingFacts()??[],settleNextInstant:()=>scheduler.settleNextInstant(),snapshot:()=>scheduler.exportQuiescentSnapshot(),
    save(modelIdentity:StructuralIdentity<'ModelIdentity'>,runIdentity:StructuralIdentity<'RunIdentity'>){
      return createCanonicalSave({scheduler,modelIdentity,runIdentity,continuingRunInputs:list([]),stateAdapter:{clone,
        canonicalValue:state=>state.canonicalValue(),validate:state=>{stateModel.validateState(state);domains.validateStatic(state);},
        restore:()=>{throw new Error('save adapter cannot restore');},analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:state=>cognitive.randomRelevantAuthoritativeIds(state)}});
    },
    committedRandomAddressKeys:()=>cognitive.committedRandomAddressKeys(),diagnostic:()=>scheduler.failureDiagnostic});
}
