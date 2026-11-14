/** effect-evidence/0.1: body-source adapter, shared belief leaf and episodic payload.
 * No scheduler, save, alternative runtime, latest-sample store or private cognition. */
import {list,text,unsigned,signed,typedIdentifier,rational,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,restoreAuthoritativeState,statePathValue,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent,type EventEmission,type EventHandlerContext} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataField as f,dataRecord as rec,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {epiRecord as r} from '../campaign3/epiCodecs';
import {classifyEpiSample,encodingOperands,applyEpiEvidence} from '../campaign3/epiMath';
import {validateEstimate} from '../campaign3/epiModel';
import {decodeCognitive as decode} from './codecs';
import {BODY_OBSERVER,BODY_DELIVERY,bodyId} from './body';
import {pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import type {ExactRational} from '../substrate/exactMath';

export const EFFECT='effect-evidence/0.1',EFFECT_EPISODE='effect-episode/0.1';
export const EFFECT_OBSERVE=bodyId(1001,'event/effect-observe'),EFFECT_FREEZE=bodyId(1001,'event/effect-freeze'),EFFECT_EVIDENCE=bodyId(1001,'event/effect-evidence'),EFFECT_APPLY=bodyId(1001,'event/effect-apply');
const BELIEF=bodyId(1025,'authority/belief-expectation');
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','effect evidence: '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
export function compileEffect(v:CanonicalValue){const a=items(v,'list');if(a.length!==2||txt(a[0])!==EFFECT)invalidModel('effect declaration');validateSemanticReferent(a[1]);return Object.freeze({proposition:a[1]});}
export type Effect=ReturnType<typeof compileEffect>;
export const effectBeliefPath=(C:CanonicalValue,p:CanonicalValue):StatePath=>({rootStateTypeId:362n,fieldId:2n,selectors:[{kind:'mapKey',key:r(901,[C,p])}]});
export const effectEpisodePath=(C:CanonicalValue,observation:CanonicalValue):StatePath=>({rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:list([text(EFFECT_EPISODE),C,observation])}]});
export function isEffectEpisodePath(p:StatePath){const k=p.selectors[0];return p.rootStateTypeId===346n&&p.fieldId===1n&&k?.kind==='mapKey'&&typeof k.key!=='boolean'&&k.key.kind==='list'&&eq(k.key.items[0],text(EFFECT_EPISODE));}
export function validateEffectEpisode(v:CanonicalValue,C?:CanonicalValue,p?:CanonicalValue){
 const a=items(v,'list');if(a.length!==6||txt(a[0])!==EFFECT_EPISODE)fail('episode shape');
 const acquisition=id(a[1]),s=rec(a[2],900n),e=rec(a[3],227n),encoding=rec(a[4],910n);
 if(acquisition.namespaceId!==1125n||typeof acquisition.payload==='boolean'||acquisition.payload.kind!=='unsigned'||!eq(f(s,2n),BODY_OBSERVER)||!eq(f(s,4n),a[5])||!eq(f(encoding,2n),s))fail('episode association');
 if(p&&!eq(f(s,3n),p))fail('foreign proposition');if(C)validateSemanticReferent(C);
 classifyEpiSample(s);if(!eq(f(e,2n),BODY_OBSERVER)||typeof a[5]==='boolean'||a[5].kind!=='signed'||uint(f(e,3n))!==a[5].value)fail('experience observer/time');
 const support=items(f(e,8n),'set');if(support.length!==1||!eq(f(rec(support[0],216n),1n),BODY_OBSERVER)||!eq(f(rec(support[0],216n),2n),f(s,1n)))fail('experience support');
 for(const field of [4n,5n,6n,7n])if(items(f(e,field),'set').length)fail('foreign experience content');
 const computed=encodingOperands(s,encoding.fields.get(3n));
 for(const [field,value]of [[4n,computed.surprise],[5n,computed.raw],[6n,computed.strength]]as const)if(!eq(f(encoding,field),value))fail('encoding arithmetic');
 return a;
}
export function withEffectBelief(base:ReturnType<typeof compileCampaign2StateModel>,C:CanonicalValue,d:Effect){
 const path=effectBeliefPath(C,d.proposition),matches=(p:StatePath)=>p.rootStateTypeId===362n&&p.fieldId===2n;
 const check=(p:StatePath,v?:CanonicalValue)=>{if(!eq(statePathValue(p),statePathValue(path)))fail('foreign belief path');if(v)validateEstimate(v);};
 const authority=new StateAuthorityRegistry([{pattern:pattern(path),validateValue:(v:CanonicalValue)=>check(path,v),removalAllowed:false}],[{mutationAuthorityId:BELIEF,patterns:[pattern(path)]}]);
 const without=(s:AuthoritativeState)=>new AuthoritativeState(s.entries().filter(e=>!matches(e.path)));
 function validateState(s:AuthoritativeState){base.validateState(without(s));for(const e of s.entries())if(matches(e.path))check(e.path,e.value);}
 return Object.freeze({...base,validateState,validatePath(p:StatePath){if(matches(p))check(p);else base.validatePath(p);},
  restoreState(bytes:Uint8Array){const s=restoreAuthoritativeState(decode(bytes));validateState(s);return s;},
  read(s:AuthoritativeState,p:StatePath){if(!matches(p))return base.read(without(s),p);check(p);const x=s.read(p);if(x.presence)check(p,x.value!);return x;},
  applyPatch(s:AuthoritativeState,patch:StatePatch,owner:Parameters<typeof base.applyPatch>[2],scope?:Parameters<typeof base.applyPatch>[3]){
   const local=patch.operations.filter(o=>matches(o.path));if(local.length&&local.length!==patch.operations.length)fail('mixed belief patch');
   if(local.length){for(const o of local){check(o.path,o.kind==='set'?o.newValue:undefined);if(scope&&(!scope.writableRoots.includes(362n)||!scope.targetPaths.some(p=>eq(statePathValue(p),statePathValue(o.path)))))fail('belief write scope');}const result=applyStatePatch(s,patch,owner,authority);validateState(result.state);return result;}
   const result=base.applyPatch(without(s),patch,owner,scope),state=new AuthoritativeState([...result.state.entries(),...s.entries().filter(e=>matches(e.path))]);validateState(state);return {...result,state};
  }});
}
export function createEffectEvidence(C:CanonicalValue,d:Effect,capacity:ExactRational,stateModel:ReturnType<typeof compileCampaign2StateModel>,model:CanonicalValue,run:CanonicalValue){
 const belief=effectBeliefPath(C,d.proposition);let active=false,at=0n,pending=new Map<string,ScheduledEvent>(),reservations:ExperienceReservation[]=[],staged:StagedSemanticExperience[]=[];
 const eventKey=(e:ScheduledEvent)=>key(scheduledEventValue(e));
 const authenticate=(e:ScheduledEvent)=>{if(!active||e.dueAt!==at||!pending.has(eventKey(e)))fail('unbound generated event');pending.delete(eventKey(e));};
 const plan=(parent:ScheduledEvent,emissions:EventEmission[])=>({emissions,bind(children:readonly ScheduledEvent[]){
  if(!active||children.length!==emissions.length)fail('child count');
  children.forEach((child,i)=>{const expected={...emissions[i],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[parent.eventId]};if(child.eventSequence<=parent.eventSequence||eventKey(child)!==eventKey(expected)||pending.has(eventKey(child)))fail('child association');pending.set(eventKey(child),structuredClone(child));});
 }});
 const emit=(e:ScheduledEvent,phase:bigint,type:typeof EFFECT_OBSERVE,payload:CanonicalValue)=>({dueAt:e.dueAt,phase,eventTypeId:type,payload,dependencies:list([])});
 const trace=(event:ScheduledEvent,out:CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[],patch:StatePatch={operations:[]},diffs:ReturnType<typeof stateModel.applyPatch>['diffs']=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:bodyId(1036,'seam/assembled-effect-evidence'),seamVersion:EFFECT,recordKind:event.eventTypeId,subjectIds:[id(C),BODY_OBSERVER],sourceRecordIds:[],registeredReadDomain:reads.map(x=>pattern(x.path)),actualReadRecords:reads,inputProjection:event.payload,outputProjection:list(out),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults:[]});
 const read=(state:AuthoritativeState,path:StatePath,reads:ActualReadRecord[])=>{const x=stateModel.read(state,path);reads.push({accessorId:bodyId(1028,'accessor/effect-evidence'),path,presence:x.presence,value:x.value,derivedSources:[]});return x.value;};
 return {
  eventTypes:()=>[EFFECT_OBSERVE,EFFECT_FREEZE,EFFECT_EVIDENCE,EFFECT_APPLY],isLearning:(e:ScheduledEvent)=>eq(e.eventTypeId,EFFECT_APPLY),
  begin(instant:bigint){if(active)fail('concurrent instant');active=true;at=instant;pending.clear();reservations=[];staged=[];},
  prepareCommit(){if(pending.size)fail('unfinished children');validateSuccessfulExperienceSettlement(reservations,staged);},
  close(){active=false;pending.clear();reservations=[];staged=[];},
  observeDelivery(event:ScheduledEvent,outputs:readonly CanonicalValue[]){
   if(!active||event.dueAt!==at||event.phase!==110n||!eq(event.eventTypeId,BODY_DELIVERY))fail('delivery origin');
   const payload=items(event.payload,'list');if(payload.length!==3||typeof payload[2]!=='boolean'||outputs.length!==1)fail('delivery envelope');
   const physical=rec(outputs[0],479n);
   return plan(event,payload[2]?[emit(event,120n,EFFECT_OBSERVE,physical)]:[]);
  },
  execute(context:EventHandlerContext<AuthoritativeState>){
   const {event,state}=context;authenticate(event);const occurrence=(ns=1159)=>typedIdentifier(ns,unsigned(context.allocateRuntimeId()));
   const out:CanonicalValue[]=[],reads:ActualReadRecord[]=[];let emissions:EventEmission[]=[],episode:CanonicalValue|undefined;
   if(eq(event.eventTypeId,EFFECT_OBSERVE)&&event.phase===120n){
    const physical=rec(event.payload,479n),measurement=readQ(f(physical,3n)).divide(capacity),ceiling=readQ(f(physical,5n)).equals(capacity);
    const sample=r(900,[occurrence(1115),BODY_OBSERVER,d.proposition,signed(at),qValue(measurement),unsigned(ceiling?2:1),rational(2,1)]);
    const reservation=admitObservationLane({observerId:txt(BODY_OBSERVER.payload),lane:'Consequence',dueAt:at,emitsCharacterAccessibleEvidence:true},()=>context.allocateRuntimeId()).reservation!;
    reservations.push(reservation);out.push(sample);emissions=[emit(event,124n,EFFECT_FREEZE,sample)];
   }else if(eq(event.eventTypeId,EFFECT_FREEZE)&&event.phase===124n){
    const sample=rec(event.payload,900n),reservation=reservations[0];if(!reservation)fail('missing reservation');
    const frozen=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:txt(BODY_OBSERVER.payload),occurredAt:at,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:txt(BODY_OBSERVER.payload),observationId:uint(id(f(sample,1n)).payload)}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},124n);
    staged.push(frozen);const envelope=r(907,[occurrence(),list([sample]),preRecognitionSemanticExperienceValue(frozen.experience)]);out.push(envelope);emissions=[emit(event,130n,EFFECT_EVIDENCE,envelope)];
   }else if(eq(event.eventTypeId,EFFECT_EVIDENCE)&&event.phase===130n){
    const envelope=rec(event.payload,907n),sample=rec(items(f(envelope,2n),'list')[0],900n),prior=read(state,belief,reads);
    const evidence=r(904,[occurrence(),sample,unsigned(classifyEpiSample(sample))]),computed=encodingOperands(sample,prior);
    const fields=new Map<bigint,CanonicalValue>([[1n,occurrence()],[2n,sample],[4n,computed.surprise],[5n,computed.raw],[6n,computed.strength]]);if(prior)fields.set(3n,prior);
    const encoding=r(910,fields);out.push(evidence,encoding);
    episode=list([text(EFFECT_EPISODE),occurrence(1125),sample,f(envelope,3n),encoding,signed(at)]);
    emissions=[emit(event,140n,EFFECT_APPLY,list([evidence,occurrence()]))];
   }else fail('stage/phase');
   const p=plan(event,emissions);
   return {nextState:state,outputs:out,emittedEvents:emissions,traceContributions:[],episode,traceFactory(children:readonly ScheduledEvent[]){p.bind(children);return [trace(event,out,children,reads)];}};
  },
  probe(context:EventHandlerContext<AuthoritativeState>){
   if(!active||context.event.phase!==50n||context.event.dueAt!==at)fail('probe phase');
   const reads:ActualReadRecord[]=[],prior=read(context.state,belief,reads),episodes=context.state.entries().filter(e=>isEffectEpisodePath(e.path)).map(e=>({e,a:validateEffectEpisode(read(context.state,e.path,reads)!,C,d.proposition)})).sort((a,b)=>{const x=f(rec(a.a[2],900n),4n),y=f(rec(b.a[2],900n),4n);if(typeof x==='boolean'||x.kind!=='signed'||typeof y==='boolean'||y.kind!=='signed')return fail('episode time');return x.value>y.value?-1:1;});
   const fields=new Map<bigint,CanonicalValue>([[1n,typedIdentifier(1159,unsigned(context.allocateRuntimeId()))],[2n,r(901,[C,d.proposition])],[3n,unsigned(1)]]);
   if(prior){fields.set(4n,prior);fields.set(5n,f(rec(prior,902n),1n));fields.set(6n,f(rec(prior,902n),2n));}
   if(episodes.length)fields.set(7n,episodes[0].a[4]);
   const output=r(906,fields);return {output,trace:()=>trace(context.event,[output],[],reads)};
  },
  prepare(events:readonly ScheduledEvent[],B0:AuthoritativeState){
   if(events.length!==1||!pending.has(eventKey(events[0])))fail('duplicate/unbound belief target');
   const event=events[0],p=items(event.payload,'list'),reads:ActualReadRecord[]=[],prior=read(B0,belief,reads),result=applyEpiEvidence(prior,p[0],1,1);
   const fields=new Map<bigint,CanonicalValue>([[1n,p[1]],[2n,p[0]],[5n,result.applied],[6n,result.rawMean],[7n,result.rawPrecision]]);if(prior)fields.set(3n,prior);if(result.next)fields.set(4n,result.next);
   const output=r(905,fields),patch:StatePatch={operations:result.applied?[{kind:'set',path:belief,expected:prior?{presence:true,value:prior}:{presence:false},newValue:result.next!}]:[]};let executed=false,done=false,rows:CanonicalValue[]=[];
   return {execute(context:EventHandlerContext<AuthoritativeState>){if(executed||eventKey(context.event)!==eventKey(event))fail('belief execution');authenticate(context.event);executed=true;return {nextState:B0,outputs:[output],emittedEvents:[],traceContributions:[]};},
    finish(state:AuthoritativeState){if(!executed||done)fail('belief completion');done=true;const applied=stateModel.applyPatch(state,patch,BELIEF,{writableRoots:[362n],targetPaths:[belief]});rows=[trace(event,[output],[],reads,patch,applied.diffs)];return applied.state;},
    traces(){if(!done)fail('belief trace before finish');return rows;}};
  }
 };
}
