/** reason-sources/0.2: permitted readings join the existing raw source handler. */
import {list,set,map,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type EventHandlerContext,type ScheduledEvent,type EventEmission,SchedulerContractError} from '../substrate/scheduler';
import type {AuthoritativeState} from '../substrate/state';
import {scheduledEventValue} from '../substrate/persistence';
import {traceRecordValue} from '../substrate/trace';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,type ExperienceReservation,type StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataItems as items,dataField as f,dataKey as key,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,ZERO,ONE} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import {sid} from './skill';
import {OBSERVER} from './recognition';
import type {compileStrategy} from './strategy';
export const REASON_EVIDENCE='assembled-reason-evidence/0.1',REASON_EVIDENCE_VERSION='assembled-character-reason-sources/0.2-candidate';
export const REASON_READING=sid(1001,'event/assembled-reason-reading'),REASON_FREEZE=sid(1001,'event/assembled-reason-freeze');
export const REASON_SAMPLE=REASON_EVIDENCE+'/sample',REASON_FROZEN=REASON_EVIDENCE+'/frozen',REASON_PRODUCED=REASON_EVIDENCE+'/produced';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),fp=(e:ScheduledEvent)=>key(scheduledEventValue(e));
const invalid=(s:string):never=>invalidModel('reason evidence: '+s);
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','reason evidence: '+s);};
function unit(v:CanonicalValue,signedUnit=false){const q=readQ(v);if(q.compare(signedUnit?ZERO.subtract(ONE):ZERO)<0||q.compare(ONE)>0)invalid('reading/gain domain');return q;}
export function compileReasonEvidence(value:CanonicalValue,strategy:ReturnType<typeof compileStrategy>,otherLabels:readonly string[]){
 const v=items(value,'list');if(v.length!==2||txt(v[0])!==REASON_EVIDENCE)invalid('declaration');
 const rows=items(v[1],'list');if(rows.length>3)invalid('descriptor capacity');
 const labels=new Set(['primary',...otherLabels]);
 return Object.freeze(rows.map(value=>{const d=items(value,'list');if(d.length!==5)invalid('descriptor shape');
  const label=txt(d[0]);if(!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(label)||labels.has(label))invalid('descriptor label');labels.add(label);
  const task=strategy.find(t=>eq(t.task,d[2]));if(!task||!strategy.some(t=>t.plans.some(p=>eq(p.actionId,d[1]))))invalid('descriptor action/task');
  const channels=items(d[4],'set').map(uint);if(!channels.length||channels.length>2||channels.some(c=>c!==1n&&c!==2n))invalid('descriptor channels');
  return {value,label,action:d[1],task:d[2],gain:unit(d[3],true),channels};
 }));
}
export function reasonReading(value:CanonicalValue){
 const a=items(value,'list');if(a.length!==5||typeof a[2]!=='boolean'||typeof a[3]!=='boolean')invalid('physical reading shape');
 unit(a[0],true);unit(a[1],true);unit(a[4]);return a;
}
export function createReasonEvidence(settings:ReturnType<typeof compileReasonEvidence>,originals:readonly ScheduledEvent[],model:CanonicalValue,run:CanonicalValue){
 let active=false,at=0n,used=false,consumed=false,unbound=false,pending:string|undefined,reservation:ExperienceReservation|undefined,frozen:CanonicalValue|undefined;
 let samples:CanonicalValue[]=[],staged:StagedSemanticExperience[]=[];
 const trace=(event:ScheduledEvent,input:CanonicalValue,outputs:CanonicalValue[],children:readonly ScheduledEvent[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event,seamId:sid(1036,'seam/assembled-reason-evidence'),seamVersion:REASON_EVIDENCE_VERSION,recordKind:event.eventTypeId,subjectIds:[sid(1000,OBSERVER)],sourceRecordIds:[],registeredReadDomain:[],actualReadRecords:[],inputProjection:input,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:children,invariantResults:[]});
 return {
  eventTypes:()=>[REASON_READING,REASON_FREEZE],
  begin(instant:bigint){if(active)fail('already active');active=true;at=instant;used=false;consumed=false;unbound=false;pending=undefined;reservation=undefined;frozen=undefined;samples=[];staged=[];},
  close(){active=false;unbound=false;pending=undefined;reservation=undefined;frozen=undefined;samples=[];staged=[];},
  prepareCommit(){if(!active||unbound||pending||originals.some(e=>e.dueAt===at)&&!used)fail('unfinished instant');validateSuccessfulExperienceSettlement(reservation?[reservation]:[],staged);},
  execute(c:EventHandlerContext<AuthoritativeState>){
   const e=c.event;if(!active||e.dueAt!==at)fail('outside instant');
   let emissions:EventEmission[]=[],outputs:CanonicalValue[]=[];
   if(eq(e.eventTypeId,REASON_READING)){
    if(e.phase!==10n||used||!originals.some(o=>fp(o)===fp(e)))fail('original binding');used=true;
    const a=reasonReading(e.payload),ids=[c.allocateRuntimeId(),c.allocateRuntimeId()];
    samples=[0,1].filter(i=>a[i+2]===true).map(i=>list([text(REASON_SAMPLE),typedIdentifier(1115,u(ids[i])),sid(1000,OBSERVER),signed(at),u(i+1),a[i]]));
    reservation=admitObservationLane({observerId:OBSERVER,lane:'Current',dueAt:at,emitsCharacterAccessibleEvidence:samples.length>0},()=>c.allocateRuntimeId()).reservation;
    outputs=samples;emissions=[{dueAt:e.dueAt,phase:14n,eventTypeId:REASON_FREEZE,payload:list(samples),dependencies:list([])}];
   }else{
    if(!eq(e.eventTypeId,REASON_FREEZE)||e.phase!==14n||pending!==fp(e)||!eq(e.payload,list(samples)))fail('freeze parent binding');pending=undefined;
    let experience:CanonicalValue=list([]);
    if(reservation){const x=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId:OBSERVER,occurredAt:at,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:samples.map(s=>({observerId:OBSERVER,observationId:uint((items(s,'list')[1] as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},14n);staged.push(x);experience=preRecognitionSemanticExperienceValue(x.experience);}
    frozen=list([text(REASON_FROZEN),signed(at),list(samples),experience]);outputs=[frozen];
   }
   unbound=true;let bound=false;
   return {nextState:c.state,outputs,emittedEvents:emissions,traceContributions:[],traceFactory(children:readonly ScheduledEvent[]){
    if(bound||!active||children.length!==emissions.length)fail('child lifecycle');
    children.forEach((child,i)=>{const expected={...emissions[i],eventId:child.eventId,eventSequence:child.eventSequence,causalParentEventIds:[e.eventId]};if(child.eventSequence<=e.eventSequence||fp(child)!==fp(expected))fail('child mismatch');pending=fp(child);});
    bound=true;unbound=false;return [trace(e,e.payload,outputs,children)];
   }};
  },
  raw(event:ScheduledEvent,input:CanonicalValue){
   if(!active||event.dueAt!==at||event.phase!==80n||consumed)fail('raw lifecycle');consumed=true;
   const raw=rec(input,403n);if(raw.schema.schemaVersion!==3n)fail('raw version');
   const descriptions=[...items(f(raw,6n),'list')],signals=[...items(f(raw,3n),'set')],produced:CanonicalValue[]=[],rejected:CanonicalValue[]=[];
   const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
   for(const d of settings){
    const candidate=r(395,[f(rec(d.task,371n),1n),d.action]),support=d.channels.map(channel=>samples.find(s=>uint(items(s,'list')[4])===channel));
    const why=!candidates.some(c=>eq(c,candidate))||!signals.some(s=>eq(f(rec(f(rec(s,402n),1n),401n),2n),d.task))?'NotSelected':!frozen||support.some(s=>!s)?'MissingEvidence':undefined;
    if(why){rejected.push(list([d.value,text(why)]));continue;}
    const admitted=support as CanonicalValue[],strength=d.gain.multiply(admitted.map(s=>readQ(items(s,'list')[5])).reduce((a,b)=>a.compare(b)<0?a:b));
    if(strength.equals(ZERO)){rejected.push(list([d.value,text('Zero')]));continue;}
    const basis=r(400,[map(admitted.map(s=>[r(399,[u(1),r(237,[u(1),items(s,'list')[1]])]),qValue(ONE)]))]);
    const signal=r(402,[r(401,[candidate,d.task,u(1)]),qValue(strength),basis]),description=list([text(d.label),sid(1040,'Commitment'),signal]);
    descriptions.push(description);signals.push(signal);produced.push(list([d.value,description,list(admitted)]));
   }
   const output=r(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n),f(raw,5n),list(descriptions)],3);
   return {output,report:list([text(REASON_PRODUCED),signed(at),frozen??list([]),list(produced),list(rejected)])};
  }
 };
}
