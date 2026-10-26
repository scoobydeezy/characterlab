/** assembled-character-model/0.1-candidate. One fixed composition and scheduler.
 * Bounded port of the reachable cognitive wiring in C2 adaptationRuntime; no optional
 * model selection, authored-fact/consequence bridge branch (the generated protocol bridge remains) or imported continuation. */
import {canonicalEncode,text,list,type CanonicalValue} from '../substrate/canonicalEncoding';
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
import {dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id} from '../campaign2/canonicalData';
import {decodeCampaign2} from '../campaign2/codecs';
import {admittedInputFacts} from '../campaign2/admittedInput';
import {evidOperands,executeEvid} from '../campaign2/evidExecution';
import {compileCognitiveIngress} from './ingress';
import {createCognitiveExecution} from './execution';
import {compileCharacterTraceBinding} from './traceBinding';
import {createEpisodicExtension} from './memory';
import {createBodyExecution,BODY_SAMPLE,BODY_DELIVERY,BODY_SELECTION} from './body';
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
 const body=model.body?createBodyExecution(model.body,component.tasks[0].character,stateModel,inputs.bodyEvents,modelIdentity,inputs.runIdentity.value):undefined;
 const episodes=model.memory?createEpisodicExtension(component.tasks[0].character,model.body!,stateModel,modelIdentity,inputs.runIdentity.value):undefined;
 const cognitive=createCognitiveExecution(model,component,inputs,()=>body?.evidence());
 const probeModel=base.probe,measurement=base.measurement,domains=base.domains,shared=bindings.admission,evaluator=bindings.evaluator;
 const memoryRuntime=createMemoryExecution(memory,measurement.validateOutput,modelIdentity,inputs.runIdentity.value,[]);
 const predictionRuntime=createPredictionExecution(prediction,modelIdentity,inputs.runIdentity.value,[]);
 const trace=compileCharacterTraceBinding(modelIdentity,inputs.runIdentity.value,probeModel);
 stateModel.validateState(initialState);domains.validateStatic(initialState);domains.validateReferences(initialState,0n);
 const initial=inputs.initial;
 const taskRuntime=createTaskExecution(task,modelIdentity,inputs.runIdentity.value,initial.deadlines.map(event=>({event})));
 let ingress:ReturnType<typeof beginTransitionIngressV04>|undefined;
 let probe:ReturnType<typeof probeModel.begin>|undefined,probeSource:ReturnType<typeof beginProbeSourceInstant>|undefined;
  let carriagePadding:import('../substrate/scheduler').ScheduledEvent|undefined,probeInstant=false,runtimeCount=0,childCount=0;
  const counted=(allocator:{allocateRuntimeId():bigint})=>({allocateRuntimeId(){if(probeInstant)runtimeCount++;return allocator.allocateRuntimeId();}});
  const clone=(state:AuthoritativeState)=>new AuthoritativeState(state.entries());
  const handlers=new Map<string,EventHandler<AuthoritativeState>>();
  const registerHandler=(eventKey:string,handler:EventHandler<AuthoritativeState>)=>{
    if(handlers.has(eventKey))throw new SchedulerContractError('INVALID_CONFIGURATION','event has multiple fixed runtime adapters');handlers.set(eventKey,handler);
  };
  for(const eventType of episodes?.eventTypes()??[])registerHandler(key(eventType),context=>episodes!.execute(context));
  for(const eventType of body?.eventTypes()??[])registerHandler(key(eventType),context=>{
   const result=body!.execute(context),extra=episodes&&key(context.event.eventTypeId)===key(BODY_SELECTION)?episodes.observeSelection(context.event,body!.evidence()):undefined;
   if(!extra)return result;
   const own=result.emittedEvents.length;return {...result,emittedEvents:[...result.emittedEvents,...extra.emissions],traceFactory(children:readonly ScheduledEvent[]){const trace=result.traceFactory(children.slice(0,own));extra.bind(children.slice(own));return [...trace,extra.trace(children.slice(own))];}};
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
  for(const eventType of cognitive.eventTypes()??[])registerHandler(key(eventType),async context=>{
   if(!ingress)throw new SchedulerContractError('INPUT_NOT_ADMITTED','cognitive outside live ingress');
   const result=await cognitive.execute(context.event,context.state,context),own=result.emissions();
   const extra=typeof result.output!=='boolean'&&result.output.kind==='record'&&result.output.schema.typeId===307n?ingress.observeProtocolSource(context.event,canonicalEncode(result.output)):undefined;
   return {nextState:context.state,outputs:[result.output,...result.additionalOutputs],emittedEvents:[...own,...(extra?.emissions()??[])],traceContributions:[],traceFactory:children=>{result.bindAllocatedChildren(children.slice(0,own.length));extra?.bindAllocatedChildren(children.slice(own.length));return [result.trace(children)];}};
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
        domains.validateStatic(state);domains.validateReferences(state,instant);
        probeInstant=false;runtimeCount=0;childCount=0;carriagePadding=undefined;memoryRuntime.begin(instant);predictionRuntime.begin(instant);taskRuntime.begin(instant);cognitive.begin(instant);body?.begin(instant);episodes?.begin(instant);
        ingress=beginTransitionIngressV04(shared,instant);

        probe=probeModel.begin(instant);probeSource=beginProbeSourceInstant(inputs.base,instant);
      },
      prepare(events,state,instant){
        if(!ingress)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','missing live ingress');
        function inheritedStage(events:readonly ScheduledEvent[]){
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
        if(clocks.length>2||slots.length!==(hasPair?1:0))bad('task stage slot multiplicity');
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
        if(identityEvents.length!==1||automatic.length!==1||rest.some(e=>e!==automatic[0]&&key(e.eventTypeId)!==key(TASK_DEADLINE_EVENT)))bad('chosen stage requires A + I with optional deadlines only');
        // Source and target admission for I precedes prepareGroup, which admits
        // every inherited target before it opens the ADAPT B0 read capability.
        const paths=cognitive.preflightIdentity(identityEvent,state);if(paths.some(p=>p.rootStateTypeId!==415n))bad('identity target overlaps inherited owners');
        const inherited=prepareGroup(rest);cognitive.sealIdentityPreflight();
        let cursor=0,finished=false,result:ReturnType<NonNullable<typeof cognitive>['identityCandidate']>|undefined,identityTrace:CanonicalValue|undefined;
        return {execute(context:EventHandlerContext<AuthoritativeState>){if(finished||cursor>=events.length||key(scheduledEventValue(context.event))!==key(scheduledEventValue(events[cursor++])))bad('cognitive common-stage execution order');
         if(key(context.event.eventTypeId)===key(cognitive.identityEventType())){result=cognitive.identityCandidate(context.event,state);return {nextState:state,outputs:[],emittedEvents:[],traceContributions:[]};}return inherited.execute(context);},
         finish(){if(finished||cursor!==events.length||!result)bad('incomplete cognitive common stage');finished=true;const inheritedState=inherited.finish(),applied=stateModel.applyPatch(inheritedState,result!.patch,result!.authority,{writableRoots:[415n],targetPaths:paths});identityTrace=result!.trace(applied.diffs);return applied.state;},
         finalizeTrace(){if(!finished||!identityTrace)bad('cognitive trace before WRT completion');const rows=inherited.finalizeTrace();let i=0;return events.map(e=>e===identityEvent?identityTrace!:rows[i++]);}};
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
        finalizeTrace(){if(!finished)throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','episodic trace before completion');const old=priorStage?.finalizeTrace()??[],added=episodeStage.traces();let i=0,j=0;return events.map(e=>episodes!.isFormation(e)?added[j++]:old[i++]);}};
      },
      beforeCommit(state,instant){domains.validateStatic(state);domains.validateReferences(state,instant);probe?.finish();body?.prepareCommit();episodes?.prepareCommit();ingress!.finish();if(probeInstant&&(runtimeCount!==7||childCount!==14||carriagePadding))throw new SchedulerContractError('TRANSITION_INGRESS_VIOLATION','carriage/memory budget closure');taskRuntime.prepareCommit(state);predictionRuntime.prepareCommit();cognitive.prepareCommit();memoryRuntime.commit();episodes?.commit();predictionRuntime.commit();taskRuntime.commit();cognitive.commit();},
      close(){episodes?.close();body?.close();memoryRuntime.close();predictionRuntime.close();taskRuntime.close();cognitive.close();ingress?.abort();probe?.abort();probeSource?.close();ingress=undefined;probe=undefined;probeSource=undefined;},
      validateRuntimeEmission(event){if(key(event.eventTypeId)===key(BODY_SAMPLE)||key(event.eventTypeId)===key(BODY_DELIVERY)||key(event.eventTypeId)===key(AUTHORED_FACT_EVENT)||key(event.eventTypeId)===key(PROBE_SOURCE_EVENT)||key(event.eventTypeId)===key(DELIBERATION_EVENT)||key(event.eventTypeId)===key(TASK_DEADLINE_EVENT))throw new SchedulerContractError('INPUT_ONLY_EVENT_ORIGIN_VIOLATION','sources are compiler-only inputs');},
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
