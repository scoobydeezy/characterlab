/** Internal V04 generative ingress authority. Owned by one unsettled instant.
 * SEM freeze entry is available only to the fixed SEM adapter, never semantic transition code.
 * Allocation binding is called with the scheduler's actual allocated children, not supplied IDs.
 */
import {canonicalEncode,list,text,typedIdentifier,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import type {StatePatch} from '../substrate/state';
import {decodeCampaign2} from './codecs';
import {adaptationExecutionFacts} from './adaptationEvaluation';

import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataKey as key} from './canonicalData';
import type {compileTransitionAdmissionV04} from './transitionAdmissionV04';
declare const admittedBrand:unique symbol;
export interface AdmittedTransitionInput {readonly [admittedBrand]:true;}
type Facts={event:ScheduledEvent;registration:Uint8Array;transitionKey:string;active:()=>boolean};
const facts=new WeakMap<object,Facts>();
/** Internal ingress authority only; never exported by the model facade. */
function issueAdmittedInput(value:Facts):AdmittedTransitionInput {
  const token=Object.freeze({}) as AdmittedTransitionInput;
  facts.set(token,{...value,event:structuredClone(value.event),registration:value.registration.slice()});return token;
}
/** No selector, state or path operation can precede this runtime brand/liveness check. */
export function admittedInputFacts(token:AdmittedTransitionInput){
  const value=facts.get(token);
  if(!value||!value.active())throw new SchedulerContractError('INPUT_NOT_ADMITTED','missing or expired admitted-input capability');
  return {event:structuredClone(value.event),registration:value.registration.slice(),transitionKey:value.transitionKey,
    payload:structuredClone(value.event.payload) as CanonicalValue};
}

type Model=ReturnType<typeof compileTransitionAdmissionV04>;
function fail(code:'INPUT_NOT_ADMITTED'|'TRANSITION_OUTPUT_VIOLATION'|'TRANSITION_INGRESS_VIOLATION',message:string):never {throw new SchedulerContractError(code,message);}
export function validateEvidRegistrations(model:Model){
  const registrations=model.registrations().map(r=>({...r,value:(()=>{const v=model.decode(r.registration);if(typeof v==='boolean'||v.kind!=='record'||![272n,318n,341n].includes(v.schema.typeId))throw new SchedulerContractError('INVALID_CONFIGURATION','unknown registration version');return v;})()}));
  const evalKey=key(typedIdentifier(1009,text('OutcomeEvaluationTransition'))),learnKey=key(typedIdentifier(1009,text('OutcomeLearningEvidenceTransition')));
  for(const r of registrations.filter(r=>[evalKey,learnKey].includes(r.transitionKey))){
    const d=rec(f(r.value,3n),271n),a=rec(f(d,1n),274n),p=rec(f(a,2n),275n),ingress=rec(f(r.value,4n),276n),isEval=r.transitionKey===evalKey;
    const reads=f(d,2n),outputs=f(d,3n);
    if(key(f(r.value,1n))!==key(typedIdentifier(1036,text('seam/character-learning-evidence')))||key(f(r.value,2n))!==key(text('character-learning-evidence/0.5-candidate'))
      ||typeof reads==='boolean'||reads.kind!=='set'||reads.items.length!==0||typeof outputs==='boolean'||outputs.kind!=='set'||outputs.items.length!==1
      ||u(f(rec(f(rec(outputs.items[0],277n),1n),254n),1n))!==(isEval?269n:270n)||u(f(rec(f(a,1n),254n),1n))!==(isEval?227n:269n)
      ||u(f(ingress,3n))!==130n||model.routeKeyForTransition(r.transitionKey)!==key(typedIdentifier(1026,text('route/character-learning')))
      ||(isEval?(u(f(p,1n))!==1n||u(f(p,4n))!==2n):(u(f(p,1n))!==2n||key(f(p,5n))!==evalKey)))
      throw new SchedulerContractError('INVALID_CONFIGURATION','EVID specialization must retain exact consequence, zero-read, output and route closure');
  }
}
export function beginTransitionIngressV04(model:Model,instant:bigint){
  simInstant(instant);let active=true;validateEvidRegistrations(model);
  const evalKey=key(typedIdentifier(1009,text('OutcomeEvaluationTransition'))),learnKey=key(typedIdentifier(1009,text('OutcomeLearningEvidenceTransition')));
  const registrations=model.registrations().map(r=>({...r,value:(()=>{const v=model.decode(r.registration);if(typeof v==='boolean'||v.kind!=='record'||![272n,318n,341n].includes(v.schema.typeId))throw new SchedulerContractError('INVALID_CONFIGURATION','unknown registration version');return v;})()}));
  const generated=new Map<bigint,{event:ScheduledEvent;transitionKey:string;registration:Uint8Array;consumed:boolean}>();
  const producers=new Set<bigint>(),pending=new Set<object>();
  const executions=new Map<AdmittedTransitionInput,{complete:boolean;identities:Map<string,CanonicalValue>}>();
  function live(){if(!active)fail('INPUT_NOT_ADMITTED','instant ingress authority is closed');}
  function stage(source:ScheduledEvent,outputs:readonly CanonicalValue[],producerKey:string|undefined,authored=false,measurement=false,protocol=false){
    live();if(source.dueAt!==instant)fail('TRANSITION_OUTPUT_VIOLATION','source belongs to another instant');
    if(producers.has(source.eventId))fail('TRANSITION_OUTPUT_VIOLATION','producer execution observed twice');
    const identities=new Set<string>();
    const sources=outputs.map(value=>{
      const bytes=canonicalEncode(value),identity=key(model.occurrenceIdentity(bytes));
      if(identities.has(identity))fail('TRANSITION_OUTPUT_VIOLATION','repeated source occurrence');identities.add(identity);
      return {value:model.decode(bytes),identity};
    }).sort((a,b)=>a.identity<b.identity?-1:a.identity>b.identity?1:0);
    const plans:{emission:EventEmission;transitionKey:string;registration:Uint8Array}[]=[];
    for(const sourceOutput of sources)for(const r of registrations.slice().sort((a,b)=>a.transitionKey<b.transitionKey?-1:a.transitionKey>b.transitionKey?1:0)){
      const v06=r.value.schema.typeId===318n,v07=r.value.schema.typeId===341n,definition=rec(f(r.value,3n),v07?340n:v06?319n:271n),admission=rec(f(definition,1n),v07?339n:v06?320n:274n),producer=rec(f(admission,2n),v07?338n:v06?321n:275n),schema=rec(f(admission,1n),254n);
      const output=sourceOutput.value;if(typeof output==='boolean'||output.kind!=='record')fail('TRANSITION_OUTPUT_VIOLATION','source must be record');
      if(output.schema.typeId!==u(f(schema,1n))||output.schema.schemaVersion!==u(f(schema,2n)))continue;
      if(measurement){
        if(!v07||source.phase!==u(f(producer,4n))||key(source.eventTypeId)!==key(f(producer,3n))||key(f(output,11n))!==key(f(producer,2n)))continue;
      }else if(v07){continue;}else if(authored){
        if(!v06||u(f(producer,1n))!==3n||key(f(producer,6n))!==key(typedIdentifier(1027n,text('definition/authored-adaptation-facts'))))continue;
        const basis=f(rec(output,307n),2n);
        if(typeof basis==='boolean'||basis.kind!=='record'||basis.schema.typeId!==(u(f(rec(f(r.value,5n),317n),1n))===1n?305n:306n))continue;
      }else if(producerKey===undefined){
        if(u(f(producer,1n))!==1n||source.phase!==(u(f(producer,4n))===1n?14n:124n))continue;
      }else if(u(f(producer,1n))!==2n||key(f(producer,5n))!==producerKey)continue;
      const ingress=rec(f(r.value,4n),276n);
      plans.push({transitionKey:r.transitionKey,registration:r.registration,emission:{dueAt:source.dueAt,phase:u(f(ingress,3n)),eventTypeId:id(f(ingress,1n)),payload:output,dependencies:list([])}});
    }
    if((authored||measurement||protocol)&&plans.length!==1)fail('TRANSITION_INGRESS_VIOLATION','source output requires exactly one matching basis consumer');
    producers.add(source.eventId);const ticket={};pending.add(ticket);
    return Object.freeze({
      emissions:()=>plans.map(p=>structuredClone(p.emission)),
      bindAllocatedChildren(children:readonly ScheduledEvent[]):void {
        live();if(!pending.has(ticket)||children.length!==plans.length)fail('TRANSITION_INGRESS_VIOLATION','missing or duplicate generated children');
        // Validate the complete topology before publishing any association.
        const ids=new Set<bigint>();
        children.forEach((child,i)=>{
          const p=plans[i].emission;
          if(ids.has(child.eventId)||generated.has(child.eventId)||child.eventId===source.eventId||child.eventSequence<=source.eventSequence
            ||child.dueAt!==p.dueAt||child.phase!==p.phase||key(child.eventTypeId)!==key(p.eventTypeId)||key(child.payload)!==key(p.payload)
            ||key(child.dependencies)!==key(list([]))||child.causalParentEventIds.length!==1||child.causalParentEventIds[0]!==source.eventId)
            fail('TRANSITION_INGRESS_VIOLATION','wrong generated-child topology');
          ids.add(child.eventId);
        });
        children.forEach((event,i)=>generated.set(event.eventId,{event:structuredClone(event),transitionKey:plans[i].transitionKey,registration:plans[i].registration,consumed:false}));
        pending.delete(ticket);
      },
    });
  }
  return Object.freeze({
    /** Must be called at the actual accepted SEM freeze, after its reservation/envelope checks. */
    observeSemanticFreeze(source:ScheduledEvent,actualFrozenOutputs:readonly Uint8Array[]){
      live();if(![14n,124n].includes(source.phase))fail('TRANSITION_OUTPUT_VIOLATION','not an accepted SEM freeze phase');
      const outputs=actualFrozenOutputs.map(decodeCampaign2);
      for(const output of outputs)rec(output,227n);
      return stage(structuredClone(source),outputs,undefined);
    },
    /** Fixed source adapter only, after compiler-owned actual R execution. */
    observeAuthoredSource(source:ScheduledEvent,actualOutput:Uint8Array){
      live();const output=rec(decodeCampaign2(actualOutput),307n);
      if(source.phase!==110n||key(source.eventTypeId)!==key(typedIdentifier(1001n,text('event/authored-adaptation-fact')))
        ||key(f(output,2n))!==key(f(rec(source.payload,304n),1n))||key(f(output,4n))!==key(text('adaptation-input/0.31-candidate')))
        fail('TRANSITION_OUTPUT_VIOLATION','authored source/output mismatch');
      const at=f(output,3n);if(typeof at==='boolean'||at.kind!=='signed'||at.value!==source.dueAt)fail('TRANSITION_OUTPUT_VIOLATION','AAI occurrence time differs');
      if(id(f(output,1n)).namespaceId!==1118n)fail('TRANSITION_OUTPUT_VIOLATION','wrong AAI occurrence identity');
      return stage(structuredClone(source),[output],undefined,true);
    },
    /** Fixed protocol bridge only. No generic registered-producer injection surface. */
    observeProtocolSource(source:ScheduledEvent,actualOutput:Uint8Array){
      live();if(source.phase!==110n||key(source.eventTypeId)!==key(typedIdentifier(1001,text('event/protocol-actual-fact'))))fail('TRANSITION_OUTPUT_VIOLATION','wrong protocol actual-fact event');
      const output=rec(model.decode(actualOutput),307n),outcome=rec(source.payload,433n),attempt=rec(f(outcome,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),resolution=rec(f(intent,2n),409n),result=rec(f(resolution,4n),419n);
      if(u(f(result,1n))!==3n)fail('TRANSITION_OUTPUT_VIOLATION','protocol source without chosen resolution');
      const candidate=rec(f(rec(f(result,2n),420n),1n),395n),C=f(candidate,1n),basis=rec(f(output,2n),305n),at=f(output,3n);
      if(key(f(basis,1n))!==key(C)||key(f(basis,2n))!==key(C)||key(f(basis,3n))!==key(f(outcome,3n))||key(f(output,4n))!==key(text('bounded-protocol-execution/0.1-candidate'))||typeof at==='boolean'||at.kind!=='signed'||at.value!==source.dueAt||id(f(output,1n)).namespaceId!==1118n)fail('TRANSITION_OUTPUT_VIOLATION','protocol actual-fact projection mismatch');
      return stage(structuredClone(source),[output],key(typedIdentifier(1009,text('ProtocolActualFactBridgeTransition'))),false,false,true);
    },
    /** Trusted observer-side adapter only, after actual permitted production is validated. */
    observeMeasurement(source:ScheduledEvent,actualOutput:Uint8Array){
      live();const output=rec(model.decode(actualOutput),203n);
      if(source.phase!==120n||key(source.eventTypeId)!==key(typedIdentifier(1001,text('event/regulatory-diagnostic-probe-observation'))))fail('TRANSITION_OUTPUT_VIOLATION','wrong measurement producer event');
      return stage(structuredClone(source),[output],undefined,false,true);
    },
    admit(event:ScheduledEvent):AdmittedTransitionInput {
      live();const relation=generated.get(event.eventId);
      if(!relation||relation.consumed)fail('INPUT_NOT_ADMITTED','event lacks an unconsumed generated ingress relation');
      const expected=relation.event;
      if(event.dueAt!==expected.dueAt||event.phase!==expected.phase||event.eventSequence!==expected.eventSequence
        ||key(event.eventTypeId)!==key(expected.eventTypeId)||key(event.payload)!==key(expected.payload)||key(event.dependencies)!==key(expected.dependencies)
        ||event.causalParentEventIds.length!==1||event.causalParentEventIds[0]!==expected.causalParentEventIds[0])fail('INPUT_NOT_ADMITTED','event differs from actual generated child');
      relation.consumed=true;
      const token=issueAdmittedInput({event,registration:relation.registration,transitionKey:relation.transitionKey,active:()=>active});
      executions.set(token,{complete:false,identities:new Map()});return token;
    },
    /** Fixed EVID adapter capability. No caller-chosen ordinal or namespace. */
    allocateEvidIdentity(token:AdmittedTransitionInput,allocator:{allocateRuntimeId():bigint}):CanonicalValue {
      const admitted=admittedInputFacts(token),execution=executions.get(token);
      if(!execution||execution.complete)fail('INPUT_NOT_ADMITTED','capability belongs to another/finished execution');
      if(![evalKey,learnKey].includes(admitted.transitionKey))fail('INPUT_NOT_ADMITTED','not an admitted EVID execution');
      const registration=rec(decodeCampaign2(admitted.registration),272n),definition=rec(f(registration,3n),271n);
      const outputs=f(definition,3n);if(typeof outputs==='boolean'||outputs.kind!=='set'||outputs.items.length!==1)fail('TRANSITION_OUTPUT_VIOLATION','not an EVID singleton');
      const schema=rec(f(rec(outputs.items[0],277n),1n),254n),type=u(f(schema,1n));
      if(type!==269n&&type!==270n)fail('TRANSITION_OUTPUT_VIOLATION','not an EVID output schema');
      if(execution.identities.size)fail('TRANSITION_OUTPUT_VIOLATION','EVID execution allocated twice');
      const identity=typedIdentifier(type===269n?1116n:1117n,unsigned(allocator.allocateRuntimeId()));
      execution.identities.set(`${type}/1`,identity);return decodeCampaign2(canonicalEncode(identity));
    },
    completeEvid(token:AdmittedTransitionInput,outputBytes:readonly Uint8Array[],patch:StatePatch={operations:[]},originalState?:CanonicalValue,returnedState?:CanonicalValue){
      const admitted=admittedInputFacts(token),execution=executions.get(token);
      if(!execution||execution.complete)fail('INPUT_NOT_ADMITTED','unknown or completed execution');
      if(![evalKey,learnKey].includes(admitted.transitionKey))fail('INPUT_NOT_ADMITTED','not an admitted EVID execution');
      if(patch.operations.length!==0||(originalState===undefined)!==(returnedState===undefined)
        ||(originalState!==undefined&&returnedState!==undefined&&key(originalState)!==key(returnedState)))
        throw new SchedulerContractError('TRANSITION_WRITE_FORBIDDEN','NoStateWrites forbids patch operations or structural state replacement');
      const transition=registrations.find(r=>r.transitionKey===admitted.transitionKey)!;
      const outputs=model.validateOutputs(decodeCampaign2(Uint8Array.from(admitted.transitionKey.match(/../g)!,x=>parseInt(x,16))),outputBytes);
      for(const output of outputs){
        if(typeof output==='boolean'||output.kind!=='record')fail('TRANSITION_OUTPUT_VIOLATION','expected EVID record');
        const allocated=execution.identities.get(`${output.schema.typeId}/${output.schema.schemaVersion}`);
        if(!allocated||key(model.occurrenceIdentity(canonicalEncode(output)))!==key(allocated))fail('TRANSITION_OUTPUT_VIOLATION','output identity was not allocated by this execution');
        if(key(f(output,2n))!==key(admitted.payload))fail('TRANSITION_OUTPUT_VIOLATION','EVID nested source differs from admitted input');
      }
      execution.complete=true;return stage(admitted.event,outputs,transition.transitionKey);
    },
    allocateMeasurementIdentity(token:AdmittedTransitionInput,allocator:{allocateRuntimeId():bigint}){
      const a=admittedInputFacts(token),execution=executions.get(token);
      if(!execution||execution.complete||execution.identities.size||a.transitionKey!==key(typedIdentifier(1009,text('MeasurementEvidenceIntakeTransition'))))fail('INPUT_NOT_ADMITTED','not a fresh carriage execution');
      rec(model.decode(a.registration),341n);const identity=typedIdentifier(1124,unsigned(allocator.allocateRuntimeId()));execution.identities.set('337/1',identity);return identity;
    },
    completeMeasurement(token:AdmittedTransitionInput,outputBytes:Uint8Array){
      const a=admittedInputFacts(token),execution=executions.get(token);
      if(!execution||execution.complete||a.transitionKey!==key(typedIdentifier(1009,text('MeasurementEvidenceIntakeTransition'))))fail('INPUT_NOT_ADMITTED','not a live carriage execution');
      const outputs=model.validateOutputs(typedIdentifier(1009,text('MeasurementEvidenceIntakeTransition')),[outputBytes]);
      const output=rec(outputs[0],337n),allocated=execution.identities.get('337/1');
      if(!allocated||key(f(output,1n))!==key(allocated)||key(f(output,2n))!==key(a.payload))fail('TRANSITION_OUTPUT_VIOLATION','carriage output allocation/source mismatch');
      execution.complete=true;return stage(a.event,outputs,a.transitionKey);
    },
    completeAdaptation(result:object){
      const closed=adaptationExecutionFacts(result),admitted=admittedInputFacts(closed.token),execution=executions.get(closed.token);
      if(!execution||execution.complete)fail('INPUT_NOT_ADMITTED','ADAPT result belongs to another or finished ingress execution');
      rec(decodeCampaign2(admitted.registration),318n);
      for(const output of closed.outputs)model.occurrenceIdentity(canonicalEncode(output));
      execution.complete=true;return stage(admitted.event,closed.outputs,admitted.transitionKey);
    },
    finish():void {
      live();if(pending.size||[...generated.values()].some(v=>!v.consumed)||[...executions.values()].some(v=>!v.complete))fail('TRANSITION_INGRESS_VIOLATION','unsettled mandatory ingress/execution');active=false;
    },
    abort():void {active=false;generated.clear();pending.clear();executions.clear();},
  });
}
