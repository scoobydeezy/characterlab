/** local-reserve-sample-bridge-component/0.1-candidate; trusted source transaction only. */
import {canonicalEncode,text,unsigned,signed,rational,typedIdentifier,type TypedIdentifierValue,type CanonicalValue} from '../substrate/canonicalEncoding';
import {embodiedRecord} from './embodiedCodecs';
import {observeLocalReserveChannels,type LocalReserveSource} from './localReserveSource';
import {admitObservationLane,freezeAndStageSemanticExperience,OBSERVATION_LANES,type ObservationLane} from '../semanticBinding/phaseOrdering';
export const LOCAL_RESERVE_OBSERVATION_VERSION='local-reserve-level-observation/0.1-candidate';
export function observeLocalReserveRecords(source:LocalReserveSource,observer:TypedIdentifierValue,at:bigint,channels:readonly string[],allocate:()=>bigint){
 if(!observer||observer.kind!=='typedIdentifier'||observer.namespaceId!==1000n||typeof observer.payload!=='object'||observer.payload.kind!=='text'||!observer.payload.value)throw Error('LOCAL_OBSERVATION_OBSERVER');
 canonicalEncode(observer);
 observer=typedIdentifier(1000,text(observer.payload.value));
 const safe=observeLocalReserveChannels(source,at,channels),used=new Set<bigint>();
 const samples=safe.map(sample=>{
  const ordinal=allocate();if(typeof ordinal!=='bigint'||ordinal<0n||used.has(ordinal))throw Error('LOCAL_OBSERVATION_ALLOCATION');used.add(ordinal);
  const header=[typedIdentifier(1115,unsigned(ordinal)),observer,typedIdentifier(1005,text(sample.channel)),signed(at)];
  return sample.kind==='Present'?embodiedRecord(461,[...header,embodiedRecord(462,[rational(sample.lower.numerator,sample.lower.denominator),rational(sample.upper.numerator,sample.upper.denominator)]),text(LOCAL_RESERVE_OBSERVATION_VERSION)]):embodiedRecord(463,[...header,text(LOCAL_RESERVE_OBSERVATION_VERSION)]);
 });
 return {observer,at,declarations:safe.map(s=>({channel:typedIdentifier(1005,text(s.channel)),signal:s.signal})),samples};
}
/** local-reserve-opportunity-component/0.1-candidate; body-only branch, trusted lane. */
export function observeLocalReserveOpportunity(source:LocalReserveSource,observer:TypedIdentifierValue,at:bigint,channels:readonly string[],lane:ObservationLane,allocate:()=>bigint){
 if(lane!=='Current'&&lane!=='Consequence')throw Error('LOCAL_OBSERVATION_LANE');
 const batch=observeLocalReserveRecords(source,observer,at,channels,allocate);
 const observerId=(batch.observer.payload as {kind:'text';value:string}).value;
 const present=batch.samples.filter((s):s is Extract<CanonicalValue,{kind:'record'}>=>typeof s!=='boolean'&&s.kind==='record'&&s.schema.typeId===461n);
 const reservation=admitObservationLane({observerId,lane,dueAt:at,emitsCharacterAccessibleEvidence:present.length>0},allocate).reservation;
 if(!reservation)return {...batch,opportunityId:null,staged:null};
 const supportingObservationIds=present.map(s=>{const id=s.fields.get(1n) as TypedIdentifierValue;return {observerId,observationId:(id.payload as {kind:'unsigned';value:bigint}).value};});
 const staged=freezeAndStageSemanticExperience(reservation,{experienceId:reservation.experienceId,observerId,occurredAt:at,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds,transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'},OBSERVATION_LANES[lane].phases.ExperienceFreeze);
 return {...batch,opportunityId:reservation.experienceId,staged};
}
