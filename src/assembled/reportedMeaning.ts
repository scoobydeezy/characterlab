/** Current reports assess an authenticated historical baseline; no psychological writes. */
import {list,text,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type ActualReadRecord} from '../substrate/state';
import {type ScheduledEvent,type EventEmission,type EventHandlerContext,SchedulerContractError} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataItems as items,dataText as txt,dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {exact} from '../campaign3/embodiedMath';
import {qualifyGoalOutcome,deteriorationOnlyQualification} from '../campaign3/goalOutcomeQualification';
import {goalMeaningPath,readGoalValue,GOAL_MEANING,meaningValue,type GoalMeaningSettings} from './goalMeaning';
import {BODY_OBSERVER} from './bodyIdentifiers';
import {EPISODE} from './memory';
import {sid,pattern} from './skill';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const REPORTED_MEANING='assembled-reported-meaning/0.1',REPORTED_SAMPLE=REPORTED_MEANING+'/sample',REPORTED_FROZEN=REPORTED_MEANING+'/frozen',HISTORICAL_BASELINE=REPORTED_MEANING+'/baseline',REPORTED_VERSION='assembled-character-reported-meaning/0.1-candidate';
export const REPORT_SOURCE=sid(1001,'event/assembled-meaning-report'),REPORT_FREEZE=sid(1001,'event/assembled-meaning-report-freeze'),REPORT_DELIVERY=sid(1001,'event/assembled-meaning-baseline'),REPORT_ASSESS=sid(1001,'event/assembled-reported-assessment');
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const invalid=(s:string):never=>invalidModel('reported meaning '+s);
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','reported meaning '+s);};
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>1000000n)invalid('time');return (v as {value:bigint}).value;};
const label=(v:CanonicalValue)=>{const s=txt(v);if(!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(s))invalid('reporter');return s;};
export function compileReportedMeaning(v:CanonicalValue){const a=items(v,'list');if(!a.length)return undefined;if(a.length!==4||txt(a[0])!==REPORTED_MEANING)invalid('declaration');const anchor=time(a[1]),at=time(a[2]);if(at<=anchor)invalid('ordered times');return Object.freeze({anchor,at,reporter:label(a[3])});}
export type ReportedMeaning=NonNullable<ReturnType<typeof compileReportedMeaning>>;
export function reportSource(v:CanonicalValue,d:ReportedMeaning,g:GoalMeaningSettings){
 const a=items(v,'list');if(a.length!==6||txt(a[0])!==REPORTED_MEANING||label(a[1])!==d.reporter||typeof a[3]!=='boolean'||typeof a[4]!=='boolean')invalid('source');
 const bounds=items(a[2],'list');if(bounds.length!==0&&bounds.length!==2)invalid('interval shape');
 const inside=(v:CanonicalValue)=>{const x=exact(v);if(x.compare(g.bounds.lower)<0||x.compare(g.bounds.upper)>0)invalid('interval bounds');return x;};
 if(bounds.length&&inside(bounds[0]).compare(inside(bounds[1]))>0)invalid('interval order');inside(a[5]);
 return {interval:a[3]&&a[4]?bounds:[],reporter:d.reporter};
}
function baseline(report:CanonicalValue,at:bigint){
 const m=items(report,'list');if(m.length!==8||txt(m[0])!==GOAL_MEANING||!eq(m[1],signed(at)))fail('actual historical report');
 const pair=items(m[4],'list');if(pair.length!==0&&pair.length!==2)fail('historical pair shape');
 for(const slot of pair){const e=items(items(slot,'list')[1],'list');if(txt(e[0])!==EPISODE)fail('historical body evidence');rec(e[2],461n);}
 return list([text(HISTORICAL_BASELINE),m[1],m[2],m[4],m[5],m[7]]);
}
export function createReportedMeaning(d:ReportedMeaning,g:GoalMeaningSettings,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,pending=new Map<string,ScheduledEvent>(),checkpoint=new Map<string,ScheduledEvent>(),used=new Set<bigint>(),unbound=0,sourceUsed=false;
 let sample:CanonicalValue|undefined,frozen:CanonicalValue|undefined,freezeEvent:ScheduledEvent|undefined,reservation:ExperienceReservation|undefined,staged:StagedSemanticExperience[]=[];
 const observer=txt(BODY_OBSERVER.payload),path=goalMeaningPath(C);
 const trace=(event:ScheduledEvent,input:CanonicalValue,outputs:readonly CanonicalValue[],children:readonly ScheduledEvent[],reads:ActualReadRecord[]=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-reported-meaning'),seamVersion:REPORTED_VERSION,recordKind:event.eventTypeId,subjectIds:[id(C),BODY_OBSERVER],sourceRecordIds:sample?[id(items(sample,'list')[1])]:[],registeredReadDomain:reads.map(r=>pattern(r.path)),actualReadRecords:reads,inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:children,invariantResults:[]});
 function plan(parent:ScheduledEvent,emissions:EventEmission[]){unbound++;let bound=false;return {emissions,bind(children:readonly ScheduledEvent[]){if(!active||bound||children.length!==emissions.length)fail('child binding lifecycle');for(const [i,child]of children.entries()){const e=emissions[i],expected={...e,eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[...new Set([parent.eventId,...(e.additionalCausalParentEventIds??[])])].sort((a,b)=>a<b?-1:1)};if(child.eventSequence<=parent.eventSequence||fp(child)!==fp(expected)||pending.has(fp(child)))fail('child association');pending.set(fp(child),structuredClone(child));}bound=true;unbound--;}};}
 const emit=(event:ScheduledEvent,type:typeof REPORT_SOURCE,phase:bigint,payload:CanonicalValue,when=at,parents:bigint[]=[]):EventEmission=>({dueAt:simInstant(when),phase,eventTypeId:type,payload,dependencies:list([]),...(parents.length?{additionalCausalParentEventIds:parents}:{})});
 return {
  eventTypes:()=>[REPORT_SOURCE,REPORT_FREEZE,REPORT_DELIVERY,REPORT_ASSESS],
  begin(instant:bigint){if(active)fail('already active');active=true;at=instant;checkpoint=new Map(pending);used.clear();unbound=0;sourceUsed=false;sample=undefined;frozen=undefined;freezeEvent=undefined;reservation=undefined;staged=[];},
  prepareCommit(){if(!active||unbound||[...pending.values()].some(e=>e.dueAt<=at)||originals.some(e=>e.dueAt===at)&&!sourceUsed)fail('unfinished instant');validateSuccessfulExperienceSettlement(reservation?[reservation]:[],staged);},
  commit(){checkpoint=new Map(pending);},
  close(){pending=new Map(checkpoint);active=false;used.clear();unbound=0;sample=undefined;frozen=undefined;freezeEvent=undefined;reservation=undefined;staged=[];},
  observe(event:ScheduledEvent,outputs:readonly CanonicalValue[]){
   if(event.phase!==50n||txt(event.eventTypeId.payload)!=='event/task-appraisal'||event.dueAt!==d.anchor)return undefined;
   if(!active||event.dueAt!==at||used.has(event.eventId))fail('historical producer lifecycle');
   const reports=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&eq(v.items[0],text(GOAL_MEANING)));if(reports.length!==1)fail('actual historical output');
   const receipt=baseline(reports[0],at);used.add(event.eventId);const p=plan(event,[emit(event,REPORT_DELIVERY,30n,receipt,d.at)]);
   return {...p,report:receipt,trace:(children:readonly ScheduledEvent[])=>trace(event,reports[0],[receipt],children)};
  },
  execute(c:EventHandlerContext<AuthoritativeState>){
   const e=c.event;if(!active||e.dueAt!==at||used.has(e.eventId))fail('event lifecycle');
   const original=eq(e.eventTypeId,REPORT_SOURCE);
   if(original?e.phase!==10n||sourceUsed||!originals.some(o=>fp(o)===fp(e)):!pending.has(fp(e)))fail('unauthenticated event');
   used.add(e.eventId);if(!original)pending.delete(fp(e));
   let outputs:CanonicalValue[]=[],emissions:EventEmission[]=[],reads:ActualReadRecord[]=[],input=e.payload;
   if(original){
    sourceUsed=true;const source=reportSource(e.payload,d,g),occurrence=typedIdentifier(1115,u(c.allocateRuntimeId()));
    if(source.interval.length)sample=list([text(REPORTED_SAMPLE),occurrence,BODY_OBSERVER,signed(at),text(source.reporter),list(source.interval)]);
    reservation=admitObservationLane({observerId:observer,lane:'Current',dueAt:at,emitsCharacterAccessibleEvidence:!!sample},()=>c.allocateRuntimeId()).reservation;
    outputs=sample?[sample]:[];emissions=[emit(e,REPORT_FREEZE,14n,list(outputs))];
   }else if(eq(e.eventTypeId,REPORT_FREEZE)){
    if(e.phase!==14n||!eq(e.payload,list(sample?[sample]:[])))fail('freeze projection');
    let experience:CanonicalValue=list([]);
    if(reservation){const obs=id(items(sample!,'list')[1]).payload;if(typeof obs==='boolean'||obs.kind!=='unsigned')return fail('observation identity');
     const value=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:observer,occurredAt:at,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:observer,observationId:obs.value}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},14n);staged.push(value);experience=preRecognitionSemanticExperienceValue(value.experience);}
    frozen=list([text(REPORTED_FROZEN),signed(at),sample??list([]),experience]);freezeEvent=structuredClone(e);outputs=[frozen];
   }else if(eq(e.eventTypeId,REPORT_DELIVERY)){
    if(e.phase!==30n||at!==d.at)fail('delivery time');
    input=list([e.payload,frozen??list([])]);emissions=[emit(e,REPORT_ASSESS,50n,input,at,freezeEvent?[freezeEvent.eventId]:[])];
   }else if(eq(e.eventTypeId,REPORT_ASSESS)){
    if(e.phase!==50n||at!==d.at)fail('assessment time');
    const a=items(e.payload,'list'),b=items(a[0],'list');if(a.length!==2||b.length!==6||txt(b[0])!==HISTORICAL_BASELINE||!eq(b[1],signed(d.anchor))||!eq(a[1],frozen??list([])))fail('assessment evidence association');
    const prior=stateModel.read(c.state,path);if(!eq(prior.value??list([]),b[2]))fail('changed immutable goal');
    reads=[{accessorId:sid(1028,'accessor/reported-current-goal'),path,presence:prior.presence,value:prior.value,derivedSources:[]}];
    const goals=prior.presence?[readGoalValue(prior.value!,C,g)]:[],pair=items(b[3],'list'),body=pair.length?items(items(pair[0],'list')[1],'list'):undefined,interval=body?rec(f(rec(body[2],461n),5n),462n):undefined;
    const after=sample?items(items(sample,'list')[5],'list'):[],result=(g.law==='BothDirections'?qualifyGoalOutcome:deteriorationOnlyQualification)({state:goals,character:'holder',goal:g.goal,signal:g.signal,now:at,before:interval?{lower:exact(f(interval,1n)),upper:exact(f(interval,2n))}:null,after:after.length?{lower:exact(after[0]),upper:exact(after[1])}:null,domains:new Map([[g.signal,{kind:'MetricInterval',bounds:g.bounds}]])});
    outputs=[list([text(REPORTED_MEANING),signed(at),prior.value??list([]),a[0],frozen??list([]),meaningValue(result)])];
   }else fail('event type');
   const p=plan(e,emissions);return {nextState:c.state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){p.bind(children);return [trace(e,input,outputs,children,reads)];}};
  }
 };
}
