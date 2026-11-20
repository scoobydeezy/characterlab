import {OBSTRUCTION_VERSION,type createExternalObstruction} from './externalObstruction';
import {stressPath,stressAnchor,type StressDeclaration} from './regulatoryStress';
import {bodyId,BODY_SAMPLE,BODY_DELIVERY,BODY_SELECTION,BODY_SELECTION_REPORT,BODY_OWNER,BODY_OBSERVER,BODY_CHANNEL,BODY_DEFINITION} from './bodyIdentifiers';
export {bodyId,BODY_SAMPLE,BODY_DELIVERY,BODY_SELECTION,BODY_SELECTION_REPORT,BODY_OWNER,BODY_OBSERVER,BODY_CHANNEL,BODY_DEFINITION} from './bodyIdentifiers';
import {BODY_CONTEXT,ATTRIBUTION_VERSION,readBodyContext,bindBodyContext} from './retainedAttribution';
import {deliveredPotential,TOLERANCE_VERSION,type ToleranceDeclaration} from './tolerance';
/** assembled-character-interaction/0.1: one physical owner and current evidence lane.
 * This adapter has no scheduler, run, save, RNG or cognition of its own. */
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,ContractReadProjection,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePathPattern,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventHandlerContext,type EventEmission} from '../substrate/scheduler';
import {checkedAddDuration,simDuration} from '../substrate/time';
import {traceRecordValue} from '../substrate/trace';
import {scheduledEventValue} from '../substrate/persistence';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeEmbodied as decode,embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {selectInteroceptiveSamples,consumeInteroceptiveSelection,closeInteroceptiveSelection} from './interoceptiveSelection';
import {exact,atom,materializeReserve,reserveBin} from '../campaign3/embodiedMath';
import {proposeEmbodiedReplenishment} from '../campaign3/embodiedReplenishment';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataIdentity as id,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {ACTION_BODY,ACTION_BODY_EVENT,ACTION_BODY_RECEIPT,ACTION_BODY_RECEIPT_EVENT,DELAYED_BODY_VERSION,selectedBodyEffect,type ActionBodyDeclaration} from './actionBody';
import type {createSkillExecution} from './skillExecution';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
const SEM='semantic-binding/0.1-candidate#SEM-001H';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',s);};
export const CALIBRATED_SENSING='assembled-calibrated-sensing/0.1-candidate';
export const bodyObservationVersion=(d:{readonly calibration?:bigint})=>d.calibration===undefined?'embodied-level-observation/0.1-candidate':'embodied-level-observation/0.2-candidate';
export function calibratedReserve(level:Q,capacity:Q,bias:bigint){
 const offset=capacity.multiply(Q.of(bias,1000n)),shifted=level.add(offset),zero=Q.of(0n);
 return {offset,level:shifted.compare(zero)<0?zero:shifted.compare(capacity)>0?capacity:shifted};
}
export function compileBodyDeclaration(value:CanonicalValue,calibrated=false){
 const a=items(value,'list');if(a.length!==(calibrated?8:7)||txt(a[0])!==(calibrated?'assembled-body/0.2':'assembled-body/0.1')||typeof a[5]!=='boolean'||typeof a[6]!=='boolean')invalidModel('body declaration version/field count/types');
 const bias=calibrated?a[7]:undefined;if(bias!==undefined&&(typeof bias==='boolean'||bias.kind!=='signed'||bias.value< -1000n||bias.value>1000n))invalidModel('body calibration requires signed integer in [-1000,1000]');
 const calibration=calibrated?(bias as {value:bigint}).value:undefined;
 const [capacity,rate,width,threshold]=a.slice(1,5).map(exact),zero=Q.of(0n);
 if(capacity.compare(zero)<=0||rate.compare(zero)<0||width.compare(zero)<=0||width.compare(capacity)>0||capacity.divide(width).denominator!==1n||threshold.compare(zero)<=0||threshold.compare(capacity)>0)invalidModel('body capacity/rate/grid/threshold domain');
 return Object.freeze({capacity,rate,width,threshold,calibration,permitted:a[5] as boolean,available:a[6] as boolean});
}
export type BodyDeclaration=ReturnType<typeof compileBodyDeclaration>&{readonly selectionCapacity?:number;readonly effectEvidence?:boolean;readonly stress?:StressDeclaration};
export const bodyPath=(C:CanonicalValue):StatePath=>({rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]});
const exactPattern=(path:StatePath):StatePathPattern=>({...path,selectors:path.selectors.map(selector=>({kind:'exact',selector}))});
/** Extend the single authoritative state, preserving the inherited validator/owners. */
export function withBodyState(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,d:BodyDeclaration){
 const path=bodyPath(C),pattern=exactPattern(path),pathKey=key(statePathValue(path));
 const stress=d.stress?stressPath(C):undefined,stressKey=stress?key(statePathValue(stress)):undefined;
 const checkPath=(p:StatePath)=>{if(key(statePathValue(p))!==pathKey&&key(statePathValue(p))!==stressKey)fail('body path is not the declared holder');};
 const checkValue=(v:CanonicalValue)=>{const a=rec(decode(enc(v)),454n),at=f(a,2n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<0n)fail('body anchor instant');materializeReserve(exact(f(a,1n)),(at as {value:bigint}).value,d.capacity,d.rate,(at as {value:bigint}).value);};
 const stressPattern=stress?exactPattern(stress):undefined;
 const authority=new StateAuthorityRegistry([{pattern,validateValue:checkValue,removalAllowed:false},...(stressPattern?[{pattern:stressPattern,validateValue:(v:CanonicalValue)=>{stressAnchor(v);},removalAllowed:false}]:[])],[{mutationAuthorityId:BODY_OWNER,patterns:[pattern,...(stressPattern?[stressPattern]:[])]}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>e.path.rootStateTypeId!==455n));
 function validateState(s:AuthoritativeState){base.validateState(without(s));const bodies=s.entries().filter(e=>e.path.rootStateTypeId===455n);if(bodies.length!==(stress?2:1))fail(stress?'required body anchors':'one required body anchor');for(const e of bodies){checkPath(e.path);if(e.path.fieldId===2n)stressAnchor(e.value);else checkValue(e.value);}}
 return Object.freeze({...base,validateState,
  validatePath(p:StatePath){if(p.rootStateTypeId===455n)checkPath(p);else base.validatePath(p);},
  restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},
  read(s:AuthoritativeState,p:StatePath){if(p.rootStateTypeId!==455n)return base.read(s,p);checkPath(p);const v=s.read(p);if(v.presence){if(p.fieldId===2n)stressAnchor(v.value!);else checkValue(v.value!);}return v;},
  applyPatch(s:AuthoritativeState,p:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
   const body=p.operations.filter(o=>o.path.rootStateTypeId===455n);if(body.length&&body.length!==p.operations.length)fail('body writer cannot cross owner families');
   if(body.length){for(const o of body){checkPath(o.path);if(scope&&(!scope.writableRoots.includes(455n)||!scope.targetPaths.some(x=>key(statePathValue(x))===key(statePathValue(o.path)))))fail('body write scope');}const result=applyStatePatch(s,p,owner,authority);validateState(result.state);return result;}
   const result=base.applyPatch(without(s),p,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>e.path.rootStateTypeId===455n)]);validateState(state);return {...result,state};
  },
 });
}
export interface BodyEvidence {sample?:CanonicalValue;experience?:CanonicalValue;selection?:CanonicalValue;settledEvent:ScheduledEvent;}
export function createBodyExecution(d:BodyDeclaration,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue,actionBody?:ActionBodyDeclaration,procedure?:ReturnType<typeof createSkillExecution>,tolerance?:ToleranceDeclaration,contextForBody?:()=>CanonicalValue|undefined,obstruction?:ReturnType<typeof createExternalObstruction>){
 const path=bodyPath(C),roster:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:BODY_OBSERVER}]};
 const names=['tracking','binding','classification','freeze'],internal=names.map(n=>bodyId(1001,'event/assembled-body-'+n));
 const executionParents=new Set<bigint>();const pending=new Map<string,ScheduledEvent>();let committed=new Map<string,ScheduledEvent>();let unboundEffects=0,at=0n,active=false,used=new Set<bigint>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[],current:BodyEvidence|undefined;
 function read(state:AuthoritativeState,p:StatePath,accessor:string){const projection=new ContractReadProjection(state,[exactPattern(p)],{value:{kind:'direct',accessorId:bodyId(1028,accessor),path:p}});const value=projection.read('value');if(value===undefined)fail('required body/IDN projection absent');return {value:value!,reads:projection.actualReadRecords()};}
 function authenticate(e:ScheduledEvent){if(!active||e.dueAt!==at||used.has(e.eventId))fail('body source lifecycle');const expected=key(e.eventTypeId)===key(BODY_SAMPLE)||key(e.eventTypeId)===key(BODY_DELIVERY)?originals.find(o=>o.eventId===e.eventId):pending.get(key(scheduledEventValue(e)));if(!expected||key(scheduledEventValue(expected))!==key(scheduledEventValue(e)))fail('unbound body source/child');used.add(e.eventId);pending.delete(key(scheduledEventValue(e)));}
 return Object.freeze({
  eventTypes:()=>[BODY_SAMPLE,BODY_DELIVERY,...(actionBody?[ACTION_BODY_EVENT,...(actionBody.delayed?[ACTION_BODY_RECEIPT_EVENT]:[])]:[]),...internal,...(d.selectionCapacity===undefined?[]:[BODY_SELECTION])],
  begin(instant:bigint){if(active)fail('body instant already active');at=instant;active=true;used=new Set();pending.clear();for(const [k,e]of committed)pending.set(k,e);executionParents.clear();unboundEffects=0;reservations=[];staged=[];current=undefined;},
  observeExecution(parent:ScheduledEvent,outcome:CanonicalValue){
   if(!actionBody)return undefined;
   if(!active||parent.dueAt!==at||parent.phase!==110n||key(parent.eventTypeId)!==key(bodyId(1001,'event/protocol-execution'))||executionParents.has(parent.eventId))fail('action body execution source lifecycle');
   const effect=selectedBodyEffect(outcome,C,actionBody);if(key(effect.attempt)!==key(parent.payload))fail('action body parent attempt association');executionParents.add(parent.eventId);unboundEffects++;
   const emission:EventEmission={dueAt:parent.dueAt,phase:110n,eventTypeId:ACTION_BODY_EVENT,payload:structuredClone(outcome),dependencies:list([])};let bound=false;
   return {emissions:[emission],bind(children:readonly ScheduledEvent[]){
    if(!active||bound||children.length!==1)fail('action body child multiplicity/lifecycle');const child=children[0],expected={...emission,eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]};
    if(child.eventId===parent.eventId||child.eventSequence<=parent.eventSequence||key(scheduledEventValue(child))!==key(scheduledEventValue(expected))||pending.has(key(scheduledEventValue(child))))fail('action body generated child mismatch');
    pending.set(key(scheduledEventValue(child)),structuredClone(child));bound=true;unboundEffects--;
   }};
  },
  evidence(){if(!active)fail('body evidence outside current instant');return current?structuredClone(current):undefined;},
  execute(context:EventHandlerContext<AuthoritativeState>){
   const {event,state}=context;authenticate(event);
   let outputs:CanonicalValue[]=[],reads:ActualReadRecord[]=[],quantization:CanonicalValue[]=[],patch:StatePatch={operations:[]},nextState=state,diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[],emissions:EventEmission[]=[],domain:StatePathPattern[]=[],sources:ReturnType<typeof id>[]=[];
   const emit=(phase:bigint,type:CanonicalValue,payload:CanonicalValue)=>{emissions=[{dueAt:event.dueAt,phase,eventTypeId:id(type),payload,dependencies:list([])}];};
   if(event.phase===110n){
    const receipt=key(event.eventTypeId)===key(ACTION_BODY_RECEIPT_EVENT),generated=key(event.eventTypeId)===key(ACTION_BODY_EVENT)||receipt;if(!generated&&key(event.eventTypeId)!==key(BODY_DELIVERY)||generated&&!actionBody||receipt&&!actionBody?.delayed)fail('body delivery event');
    const effect=generated?selectedBodyEffect(event.payload,C,actionBody!):undefined,payload=generated?undefined:items(event.payload,'list');
    if(payload&&(payload.length!==(d.effectEvidence?3:2)||d.effectEvidence&&typeof payload[2]!=='boolean'||key(payload[0])!==key(C)))fail('body delivery target');
    const amount=effect?.requested??exact(payload![1]),assessment=effect&&!receipt&&procedure?procedure.assess(context,effect.applied):undefined,block=effect&&!receipt?obstruction?.assess(event,effect):undefined,applies=(assessment?assessment.allowed:effect?.applied)&&!block?.blocked;let physical:CanonicalValue=list([]),toleranceReport:CanonicalValue|undefined;const queued=!!effect&&!receipt&&!!applies&&effect.delay>0n;
    if(receipt&&(!effect!.applied||effect!.delay===0n))fail('invalid delayed body receipt');
    if(queued)emissions=[{dueAt:checkedAddDuration(event.dueAt,simDuration(effect!.delay)),phase:110n,eventTypeId:ACTION_BODY_RECEIPT_EVENT,payload:structuredClone(event.payload),dependencies:list([])}];
    if(assessment){reads=[...assessment.reads];domain=[...assessment.domain];}
    if(!effect||applies&&!queued){
     const prior=read(state,path,'accessor/embodied-reserve-anchor'),anchor=rec(prior.value,454n),anchorAt=f(anchor,2n);if(typeof anchorAt==='boolean'||anchorAt.kind!=='signed')fail('body anchor');
     reads=[...reads,...prior.reads];domain=[...domain,exactPattern(path)];const level=materializeReserve(exact(f(anchor,1n)),(anchorAt as {value:bigint}).value,d.capacity,d.rate,at);
     const effectPotential=effect&&tolerance?deliveredPotential(state,C,tolerance,d.capacity,amount,at):undefined;
     if(effectPotential){reads.push(...effectPotential.reads);domain.push(effectPotential.domain);toleranceReport=effectPotential.output;}
     const proposal=proposeEmbodiedReplenishment(anchor,level,d.capacity,effectPotential?.potential??amount,at,path);patch=proposal.patch;const applied=stateModel.applyPatch(state,patch,BODY_OWNER,{writableRoots:[455n],targetPaths:[path]});nextState=applied.state;diffs=applied.diffs;physical=proposal.output;
    }
    if(effect){sources=[id(effect.outcomeId),id(effect.attemptId)];outputs=[receipt?list([text(ACTION_BODY_RECEIPT),effect.outcomeId,effect.attemptId,effect.action,atom(amount),physical]):list([text(ACTION_BODY),effect.outcomeId,effect.attemptId,effect.action,atom(amount),text(queued?'Queued':applies?'Applied':'Blocked'),physical]),...(assessment?[assessment.output]:[]),...(block?[block.report]:[]),...(toleranceReport?[toleranceReport]:[])];}else outputs=[physical];
   }else if(event.phase===10n){
    if(key(event.eventTypeId)!==key(BODY_SAMPLE))fail('body sample event');const cue=rec(event.payload,459n);if(key(f(cue,1n))!==key(BODY_OBSERVER)||key(f(cue,2n))!==key(BODY_DEFINITION))fail('body observer/channel');
    const binding=read(state,roster,'ResolvedCharacterSubject');if(key(f(rec(binding.value,267n),1n))!==key(C))fail('body IDN target mismatch');reads=[...binding.reads];domain=[exactPattern(roster),exactPattern(path)];
    const occurrence=typedIdentifier(1115,unsigned(context.allocateRuntimeId()));let sample:CanonicalValue,carrier:CanonicalValue;
    if(d.permitted&&d.available){const prior=read(state,path,'accessor/embodied-reserve-anchor'),anchor=rec(prior.value,454n),anchorAt=f(anchor,2n);if(typeof anchorAt==='boolean'||anchorAt.kind!=='signed')fail('body anchor');reads.push(...prior.reads);
     const level=materializeReserve(exact(f(anchor,1n)),(anchorAt as {value:bigint}).value,d.capacity,d.rate,at),calibration=d.calibration===undefined?undefined:calibratedReserve(level,d.capacity,d.calibration),sensed=calibration?.level??level,bin=reserveBin(sensed,d.capacity,d.width);
     sample=r(461,[occurrence,BODY_OBSERVER,BODY_CHANNEL,signed(at),r(462,[atom(bin.lower),atom(bin.upper)]),text(bodyObservationVersion(d))]);quantization=[...(calibration?[list([text(CALIBRATED_SENSING),atom(level),signed(d.calibration!),atom(calibration.offset),atom(sensed)])]:[]),r(484,[atom(sensed),atom(d.capacity),atom(d.width),unsigned(bin.index)])];
     const reservation=admitObservationLane({observerId:txt(BODY_OBSERVER.payload),lane:'Current',dueAt:at,emitsCharacterAccessibleEvidence:true},()=>context.allocateRuntimeId()).reservation!;reservations.push(reservation);carrier=r(482,[unsigned(1),sample,typedIdentifier(1106,unsigned(reservation.experienceId))]);
    }else{sample=r(463,[occurrence,BODY_OBSERVER,BODY_CHANNEL,signed(at),text(bodyObservationVersion(d))]);context.allocateRuntimeId();carrier=r(482,[unsigned(2),sample]);}
    outputs=[sample];emit(11n,internal[0],carrier);
   }else if(event.phase===20n){
    if(d.selectionCapacity===undefined||key(event.eventTypeId)!==key(BODY_SELECTION))fail('body selection event');
    const payload=items(event.payload,'list');if(payload.length!==2&&!(contextForBody&&payload.length===3))fail('body selection payload');
    const selected=selectInteroceptiveSamples([payload[0]],d.selectionCapacity!,bodyObservationVersion(d));
    try{
     const samples=consumeInteroceptiveSelection(selected.view),sample=rec(payload[0],(payload[0] as {schema:{typeId:bigint}}).schema.typeId);
     const report=list([text(BODY_SELECTION_REPORT),signed(at),unsigned(d.selectionCapacity!),f(sample,1n),text(selected.audit[0].disposition),...(payload.length===3?[payload[2]]:[])]);
     const experience=samples.length?rec(payload[1],227n):undefined;
     current={sample:samples[0],experience,selection:report,settledEvent:structuredClone(event)};outputs=[report];sources=[id(f(sample,1n))];
    }finally{closeInteroceptiveSelection(selected.view);}
   }else{
    const index=internal.findIndex(t=>key(t)===key(event.eventTypeId));if(index<0||event.phase!==11n+BigInt(index))fail('body internal phase');const wrapped=contextForBody&&typeof event.payload!=='boolean'&&event.payload.kind==='list'?items(event.payload,'list'):undefined;if(wrapped&&(index!==3||wrapped.length!==3||txt(wrapped[0])!==BODY_CONTEXT))fail('body context carrier');const annex=wrapped?.[2],contextJoin=annex?readBodyContext(annex,at):undefined,carrier=rec(wrapped?wrapped[1]:event.payload,482n),sample=f(carrier,2n),present=(sample as {schema:{typeId:bigint}}).schema.typeId===461n,s=rec(sample,present?461n:463n);sources=[id(f(s,1n))];
    if(index<3){const context=index===2&&present?contextForBody?.():undefined;if(context){const c=readBodyContext(context,at);emit(14n,internal[3],list([text(BODY_CONTEXT),carrier,context]));emissions[0]={...emissions[0],additionalCausalParentEventIds:[c.tracking]};}else emit(event.phase+1n,internal[index+1],carrier);}
    else {let experience:CanonicalValue|undefined;
     if(present){const occurrence=id(f(carrier,3n)),ordinal=occurrence.payload;if(typeof ordinal==='boolean'||ordinal.kind!=='unsigned')fail('body reservation id');const reservation=reservations.find(v=>v.experienceId===(ordinal as {value:bigint}).value);if(!reservation)fail('body missing reservation');
      const observation=id(f(s,1n)).payload;if(typeof observation==='boolean'||observation.kind!=='unsigned')fail('body observation id');const value=assemblePreRecognitionExperience({experienceId:reservation!.experienceId,observerId:txt(BODY_OBSERVER.payload),occurredAt:at,perceptualEventReferentIds:contextJoin?[contextJoin.context]:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:txt(BODY_OBSERVER.payload),observationId:(observation as {value:bigint}).value},...(contextJoin?[{observerId:txt(BODY_OBSERVER.payload),observationId:contextJoin.panel.observation}]:[])].sort((a,b)=>a.observationId<b.observationId?-1:1),transformationVersion:SEM});
      const frozen=freezeAndStageSemanticExperience(reservation!,value,event.phase);staged.push(frozen);experience=preRecognitionSemanticExperienceValue(frozen.experience);outputs=[experience];if(annex)bindBodyContext(annex,experience);
     }if(d.selectionCapacity===undefined)current={sample,experience,settledEvent:structuredClone(event)};else emit(20n,BODY_SELECTION,list([sample,experience??list([]),...(annex?[annex]:[])]));
    }
   }
   return {nextState,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
    if(children.length!==emissions.length)fail('body child multiplicity');for(const [i,child] of children.entries()){const e=emissions[i],expected={...e,eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[...new Set([event.eventId,...(e.additionalCausalParentEventIds??[])])].sort((a,b)=>a<b?-1:1)};if(child.eventSequence<=event.eventSequence||pending.has(key(scheduledEventValue(child)))||key(scheduledEventValue(child))!==key(scheduledEventValue(expected)))fail('body child differs from generated plan');pending.set(key(scheduledEventValue(child)),structuredClone(child));}
    return [traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:bodyId(1036,'seam/assembled-body'),seamVersion:obstruction&&key(event.eventTypeId)===key(ACTION_BODY_EVENT)?OBSTRUCTION_VERSION:d.calibration!==undefined&&event.phase<=20n?CALIBRATED_SENSING:contextForBody&&event.phase<=20n?ATTRIBUTION_VERSION:tolerance&&[ACTION_BODY_EVENT,ACTION_BODY_RECEIPT_EVENT].some(t=>key(t)===key(event.eventTypeId))?TOLERANCE_VERSION:actionBody?.delayed&&[ACTION_BODY_EVENT,ACTION_BODY_RECEIPT_EVENT].some(t=>key(t)===key(event.eventTypeId))?DELAYED_BODY_VERSION:key(event.eventTypeId)===key(ACTION_BODY_EVENT)?(procedure?procedure.contractVersion:'assembled-character-action-body/0.1-candidate'):d.selectionCapacity===undefined?'assembled-character-interaction/0.1-candidate':'assembled-character-attention/0.1-candidate',recordKind:event.eventTypeId,subjectIds:[id(C),BODY_OBSERVER],sourceRecordIds:sources,registeredReadDomain:domain,actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:quantization,statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]})];
   }};
  },
  prepareCommit(){if(!active||unboundEffects||[...pending.values()].some(e=>e.dueAt<=at)||originals.some(e=>e.dueAt===at&&!used.has(e.eventId)))fail('unfinished body instant');validateSuccessfulExperienceSettlement(reservations,staged);},
  commit(){if(!active)fail('body commit outside instant');committed=new Map(pending);},
  close(){active=false;pending.clear();executionParents.clear();unboundEffects=0;current=undefined;reservations=[];staged=[];},
 });
}
