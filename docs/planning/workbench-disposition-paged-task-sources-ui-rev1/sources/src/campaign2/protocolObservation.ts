/** protocol-consequence-observation/0.1-candidate. Actual execution owns the truth
 * identity; only the projected observer-safe record leaves this module. */
import {list,record,text,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import type {SimInstant} from '../substrate/time';
import {compilePermittedEvidence,permittedEvidenceValue,validatePermittedEvidenceRecordClosure,PROTOCOL_OBSERVATION_VERSION,type ObservationChannel} from '../observation/observation';
import {dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataUnsigned as u,invalidModel} from './canonicalData';

export function compileProtocolObservation(outcome:CanonicalValue,channel:ObservationChannel,observationId:TypedIdentifierValue,at:SimInstant){
 const execution=rec(outcome,433n),attempt=rec(f(execution,2n),432n),plan=rec(f(attempt,2n),431n),requested=u(f(plan,3n)),completed=u(f(execution,3n)),truthId=id(f(execution,1n));
 if((requested!==1n&&requested!==2n)||(completed!==0n&&completed!==requested)||truthId.namespaceId!==1141n||typeof truthId.payload==='boolean'||truthId.payload.kind!=='unsigned')invalidModel('protocol execution view source');
 if(channel.polarityId!==1n||channel.measurementModeId!==1n||channel.missingnessRuleId!==1n||!channel.precision.equals(Q.of(1n))||channel.visibleProvenanceSlotIds.length||channel.experimentalControlId!==undefined||channel.unitId.namespaceId!==1039n||key(channel.unitId.payload)!==key(text('unit/fixture-pulse')))invalidModel('protocol channel outside fixed profile');
 const raw=compilePermittedEvidence({before:Q.of(0n),potentialEffect:Q.of(completed),applied:Q.of(completed),overflow:Q.of(0n),after:Q.of(completed),minimum:Q.of(0n),maximum:Q.of(2n),provenance:{slots:new Map()},truthRecordId:truthId},channel,observationId,at);
 if(raw.kind!=='present'||raw.safeSourceReferences.length!==1||key(raw.safeSourceReferences[0])!==key(truthId)||raw.perceivedConceptTokens.length||!raw.measurementInterval.lower?.equals(Q.of(completed))||(completed===2n?raw.measurementInterval.upper!==undefined:!raw.measurementInterval.upper?.equals(Q.of(completed))))invalidModel('unexpected generic protocol observation');
 const candidate=rec(permittedEvidenceValue(raw),203n),fields=new Map(candidate.fields);fields.set(10n,list([]));fields.set(11n,text(PROTOCOL_OBSERVATION_VERSION));
 const safe=record(candidate.schema,fields);validatePermittedEvidenceRecordClosure(safe);return safe;
}
