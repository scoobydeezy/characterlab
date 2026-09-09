/** measurement-prediction/0.2-candidate. Private M1 associations, exact owned learning and later read. */
import {canonicalEncode as enc,list,set,text,unsigned,rational,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternMatches,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission} from '../substrate/scheduler';
import {checkedAddDuration,simDuration} from '../substrate/time';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue,TRACE_CONTRACT_VERSION} from '../substrate/trace';
import {decodeStatePattern} from './stateModel';
import {predictionRecord as r,clonePrediction} from './predictionCodecs';
import {PREDICTION_VERSION,PREDICTION_APPLICATION_ABLATION,PREDICTION_READ_ABLATION} from './predictionModelReview';
import {MEMORY_VERSION} from './memoryModelSource';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataUnsigned as u,dataText as txt,dataKey as key} from './canonicalData';
import type {compilePredictionModel} from './predictionModel';
type Model=Awaited<ReturnType<typeof compilePredictionModel>>;
export interface PredictionPendingFact {readonly event:ScheduledEvent;readonly producerEventId:bigint;}
const atom=(ns:number,s:string)=>typedIdentifier(ns,text(s));
const names=['event/measurement-prediction-application','event/measurement-prediction-read','event/measurement-prediction-application-padding','event/measurement-prediction-read-padding'] as const;
const eventKey=(e:ScheduledEvent)=>key(scheduledEventValue(e)),name=(e:ScheduledEvent)=>txt(e.eventTypeId.payload);
function fail(message:string):never{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
function stage(message:string):never{throw new SchedulerContractError('PREDICTION_STAGE_VIOLATION',message);}
export function createPredictionExecution(model:Model,modelIdentity:CanonicalValue,runIdentity:CanonicalValue,restored:readonly PredictionPendingFact[]=[]){
 let pending=new Map<string,ScheduledEvent>(),checkpoint=new Map<string,ScheduledEvent>(),active=false,instant=0n,preparedCommit:Map<string,ScheduledEvent>|undefined;
 const targets=new Set<string>();
 const isEvent=(e:ScheduledEvent)=>e.eventTypeId.namespaceId===1001n&&(names as readonly string[]).includes(name(e));
 for(const fact of restored){const e=structuredClone(fact.event);if(!isEvent(e)||![names[1],names[3]].includes(name(e) as typeof names[1])||e.phase!==40n||e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==fact.producerEventId||pending.has(eventKey(e)))fail('restored prediction association');pending.set(eventKey(e),e);}
 const plan=(emissions:EventEmission[],parent:ScheduledEvent)=>{let bound=false;return Object.freeze({emissions:()=>structuredClone(emissions),bindAllocatedChildren(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==emissions.length)stage('prediction child binding lifecycle');bound=true;children.forEach((e,i)=>{const x=emissions[i];if(e.causalParentEventIds.length!==1||e.causalParentEventIds[0]!==parent.eventId||e.dueAt!==x.dueAt||e.phase!==x.phase||key(e.eventTypeId)!==key(x.eventTypeId)||key(e.payload)!==key(x.payload)||key(e.dependencies)!==key(x.dependencies)||pending.has(eventKey(e)))fail('prediction child mismatch');pending.set(eventKey(e),structuredClone(e));});}});};
 function source(payload:CanonicalValue){
  const evidence=rec(payload,342n);model.content.validateRecordRoles(enc(evidence));
  if(txt(f(evidence,3n))!==MEMORY_VERSION)fail('prediction M1 version');
  const carried=rec(f(evidence,2n),337n);
  const observation=rec(f(carried,2n),203n),d=model.definition;
  if(key(f(observation,4n))!==key(f(d,1n))||key(f(observation,3n))!==key(f(d,2n))||key(f(carried,3n))!==key(f(d,3n)))fail('prediction source definition mismatch');
  const interval=rec(f(observation,6n),204n),x=f(interval,2n),precision=f(observation,8n);
  if(f(interval,1n)!==true||f(interval,3n)!==true||key(x)!==key(f(interval,4n))||typeof x==='boolean'||x.kind!=='rational'||x.numerator<0n||x.numerator>10n*x.denominator||(10n*x.numerator)%x.denominator!==0n||key(precision)!==key(rational(1,1))||u(f(observation,7n))!==1n||txt(f(observation,11n))!=='regulatory-diagnostic-probe/0.1-candidate'||txt(f(carried,4n))!=='measurement-evidence-carriage/0.1-candidate')fail('prediction requires admitted exact point domain');
  model.base.measurement.validateOutput(carried);
  return {evidence,observation,x};
 }
 function subject(payload:CanonicalValue,application:boolean,state:AuthoritativeState){
  const registration=application?model.application:model.read,q=rec(items(f(registration,9n),'set')[0],application?343n:266n),domain=items(f(registration,application?5n:6n),'set').map(decodeStatePattern);
  let observer=payload;for(const field of application?items(f(q,1n),'list').map(u):[u(f(q,1n))]){if(typeof observer==='boolean'||observer.kind!=='record')fail('prediction subject path');observer=f(observer,field);}
  model.content.validateRole(enc(observer),enc(r(263,[unsigned(1000)])));
  const template=decodeStatePattern(f(q,2n)),path:StatePath={rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:observer}]};
  if(!domain.some(p=>patternMatches(p,path)))fail('prediction subject outside ReadDomain');
  const result=model.stateModel.read(state,path);if(!result.presence)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','prediction subject roster absent');
  const C=id(f(rec(result.value!,267n),u(f(q,3n)))),accessor=id(f(q,5n));model.content.validateRole(enc(C),enc(f(q,4n)));
  const read:ActualReadRecord={accessorId:accessor,path,presence:true,value:C,derivedSources:[result],transformationId:accessor};return {C,read,domain};
 }
 const preflight=new Map<string,{state:AuthoritativeState;projected:ReturnType<typeof subject>}>();
 return Object.freeze({isEvent,eventTypes:()=>names.map(n=>atom(1001,n)),
  preflightApplication(event:ScheduledEvent,state:AuthoritativeState){if(!active||preparedCommit||event.phase!==140n||!pending.has(eventKey(event))||preflight.has(eventKey(event)))fail('prediction preflight');if(name(event)===names[2]){if(key(event.payload)!==key(list([])))fail('prediction padding');return;}if(name(event)!==names[0])fail('prediction preflight event');source(event.payload);const projected=subject(event.payload,true,state);if(model.applicationEnabled)model.stateModel.validatePath({rootStateTypeId:362n,fieldId:1n,selectors:[{kind:'mapKey',key:r(360,[projected.C,model.definitionId])}]});preflight.set(eventKey(event),{state,projected});},
  begin(at:bigint){if(active)stage('prediction already active');instant=at;targets.clear();preparedCommit=undefined;checkpoint=new Map([...pending].map(([k,e])=>[k,structuredClone(e)]));active=true;},
  prepareCommit(){if(!active||preparedCommit||[...pending.values()].some(e=>e.dueAt<=instant))stage('unconsumed prediction events');preparedCommit=new Map([...pending].map(([k,e])=>[k,structuredClone(e)]));},
  commit(){if(!preparedCommit)stage('prediction commit not prepared');checkpoint=preparedCommit;},
  close(){pending=checkpoint;active=false;targets.clear();preparedCommit=undefined;preflight.clear();},
  pendingFacts():readonly PredictionPendingFact[]{if(active)stage('prediction facts require quiescence');return [...pending.values()].map(e=>({event:structuredClone(e),producerEventId:e.causalParentEventIds[0]}));},
  observeM1(event:ScheduledEvent,output?:CanonicalValue){
   if(!active||event.phase!==130n||name(event)!==(output?'event/measurement-episode-evidence':'event/measurement-episode-evidence-padding'))fail('prediction requires actual M1 producer');
   let due;try{due=checkedAddDuration(event.dueAt,simDuration(1n));}catch(error){throw new SchedulerContractError('INSTANT_OVERFLOW',String(error));}
   const observation=output?source(output).observation:undefined;
   const emission=(n:string,phase:bigint,payload:CanonicalValue,dueAt:ScheduledEvent['dueAt']):EventEmission=>({dueAt,phase,eventTypeId:atom(1001,n),payload,dependencies:list([])});
   return plan([emission(names[output?0:2],140n,output??list([]),event.dueAt),emission(names[output?1:3],40n,observation?r(365,[f(observation,2n),model.definitionId]):list([]),due)],event);
  },
  validatePair(events:readonly ScheduledEvent[]){
   if(!active||events.length!==2)stage('prediction requires exactly one memory/application pair');
   const m=events.find(e=>['event/measurement-episode-formation','event/measurement-episode-formation-padding'].includes(name(e))),p=events.find(e=>[names[0],names[2]].includes(name(e) as typeof names[0]));
   if(!m||!p||m.phase!==140n||p.phase!==140n||m.dueAt!==p.dueAt||m.causalParentEventIds.length!==1||p.causalParentEventIds.length!==1||m.causalParentEventIds[0]!==p.causalParentEventIds[0]||key(m.payload)!==key(p.payload)||(name(m).endsWith('-padding')!==name(p).endsWith('-padding'))||!pending.has(eventKey(p)))stage('unmatched prediction pair');
  },
  execute(event:ScheduledEvent,state:AuthoritativeState,allocator:{allocateRuntimeId():bigint}){
   if(preparedCommit)stage('prediction execution after sealed commit');
   if(!active||!isEvent(event)||!pending.delete(eventKey(event)))fail('unassociated prediction input'); // Before all payload/projection reads.
   const n=name(event),application=n===names[0],padding=n===names[2]||n===names[3];
   if(event.phase!==(n===names[0]||n===names[2]?140n:40n))stage('prediction phase mismatch');
   const reads:ActualReadRecord[]=[],outputs:CanonicalValue[]=[],subjects:TypedIdentifierValue[]=[],sources:TypedIdentifierValue[]=[];
   let patch:StatePatch={operations:[]},diffs:ReturnType<Model['stateModel']['applyPatch']>['diffs']=[],nextState=state,domain:ReturnType<typeof decodeStatePattern>[]=[],version=PREDICTION_VERSION;
   if(padding){if(key(event.payload)!==key(list([])))fail('prediction padding payload');if(n===names[3])allocator.allocateRuntimeId();}
   else {
    const admitted=application?source(event.payload):undefined;
    if(!application){const cue=rec(event.payload,365n);model.content.validateRecordRoles(enc(cue));if(key(f(cue,2n))!==key(model.definitionId))fail('prediction cue target');}
    const prepared=preflight.get(eventKey(event));if(prepared&&prepared.state!==state)fail('prediction preflight B0 mismatch');const projected=prepared?.projected??subject(event.payload,application,state);preflight.delete(eventKey(event));reads.push(projected.read);subjects.push(projected.C);domain=projected.domain;
    if(admitted)sources.push(id(f(admitted.evidence,1n)));
    const enabled=application?model.applicationEnabled:model.readEnabled;
    const ordinal=application?undefined:allocator.allocateRuntimeId();
    if(enabled){
     const q=rec(items(f(application?model.application:model.read,10n),'set')[0],363n),predictionKey=r(360,[projected.C,f(q,2n)]),template=decodeStatePattern(f(q,3n)),path:StatePath={rootStateTypeId:template.rootStateTypeId,fieldId:template.fieldId,selectors:[{kind:'mapKey',key:predictionKey}]};
     if(!domain.some(d=>patternMatches(d,path)))fail('prediction target outside ReadDomain');
     if(application){const k=key(predictionKey);if(targets.has(k))throw new SchedulerContractError('PREDICTION_TARGET_COLLISION','duplicate prediction target');targets.add(k);}
     const prior=model.stateModel.read(state,path);reads.push({accessorId:id(f(q,4n)),path,presence:prior.presence,value:prior.value,derivedSources:[]});
     if(application){
      const ref=characterEvidenceRefValue({kind:'observation',observationId:u(id(f(admitted!.observation,1n)).payload)}),old=prior.presence?rec(prior.value!,361n):undefined,basis=old?items(f(old,2n),'set'):[],count=BigInt(basis.length);
      if(basis.some(v=>key(v)===key(ref)))throw new SchedulerContractError('PREDICTION_OBSERVATION_ALREADY_APPLIED','observation already in prediction support');
      if(count>=u(f(model.definition,4n)))throw new SchedulerContractError('PREDICTION_EVIDENCE_LIMIT_EXCEEDED','prediction support limit');
      const x=admitted!.x,m=old?f(old,1n):rational(0,1);if(typeof m==='boolean'||m.kind!=='rational')fail('prediction prior rational');
      const mean=rational(count*m.numerator*x.denominator+x.numerator*m.denominator,(count+1n)*m.denominator*x.denominator);
      patch={operations:[{kind:'set',path,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:r(361,[mean,set([...basis,ref])])}]};
      const applied=model.stateModel.applyPatch(state,patch,atom(1025,'authority/belief-expectation'),{writableRoots:[362n],targetPaths:[path]});nextState=applied.state;diffs=applied.diffs;
     }else if(prior.presence){const output=r(366,[typedIdentifier(model.readoutNamespace,unsigned(ordinal!)),predictionKey,prior.value!]);model.content.validateRecordRoles(enc(output));if(key(model.occurrences.extract(enc(output)))!==key(f(rec(output,366n),1n)))fail('readout occurrence rule');outputs.push(output);}
    }else version=application?PREDICTION_APPLICATION_ABLATION:PREDICTION_READ_ABLATION;
   }
   return {nextState,outputs,patch:structuredClone(patch),trace(){return traceRecordValue({traceSchemaVersion:TRACE_CONTRACT_VERSION,modelIdentity,runIdentity,event:cloneEvent(event),seamId:atom(1036,'seam/measurement-prediction'),seamVersion:version,recordKind:event.eventTypeId,subjectIds:subjects,sourceRecordIds:sources,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:clonePrediction(event.payload),outputProjection:outputs[0]??list([]),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:[],invariantResults:[]});}};
  },
 });
}
const cloneEvent=(e:ScheduledEvent)=>structuredClone(e);
