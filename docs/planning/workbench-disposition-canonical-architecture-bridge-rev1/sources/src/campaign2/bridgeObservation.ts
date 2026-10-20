/** ADAPT-D provenance cut. The raw candidate never leaves this module as an occurrence. */
import {canonicalEncode,list,record,text,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {ExactRational} from '../substrate/exactMath';
import type {SimInstant} from '../substrate/time';
import {compilePermittedEvidence,permittedEvidenceValue,validatePermittedEvidenceRecordClosure,AUTHORED_FACT_OBSERVATION_VERSION,OBSERVATION_CONTRACT_VERSION,type BoundedEffectTruth,type ObservationChannel} from '../observation/observation';
import {SchedulerContractError} from '../substrate/scheduler';
import {dataKey as key} from './canonicalData';

/** Only raw fields and the fixed version enter the projection; no external operands. */
function project(raw:Extract<CanonicalValue,{kind:'record'}>):CanonicalValue {
  const fields=new Map(raw.fields);fields.set(10n,list([]));fields.set(11n,text(AUTHORED_FACT_OBSERVATION_VERSION));
  return record(raw.schema,fields);
}
export function compileBridgeObservation(truth:BoundedEffectTruth,channel:ObservationChannel,observationId:TypedIdentifierValue,instant:SimInstant):CanonicalValue {
  const raw=compilePermittedEvidence(truth,channel,observationId,instant),one=ExactRational.of(1n);
  if(raw.kind!=='present'||raw.transformationVersion!==OBSERVATION_CONTRACT_VERSION
    ||!raw.measurementInterval.lower?.equals(one)||!raw.measurementInterval.upper?.equals(one)||raw.evidenceKindId!==1n||!raw.precision.equals(one)
    ||raw.perceivedConceptTokens.length||raw.safeSourceReferences.length!==1||key(raw.safeSourceReferences[0])!==key(truth.truthRecordId)
    ||key(raw.observationId)!==key(observationId)||key(raw.observerId)!==key(channel.observerId)||key(raw.subjectId)!==key(channel.subjectId)
    ||key(raw.observationChannelId)!==key(channel.observationChannelId)||raw.occurredAt!==instant)
    throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','unexpected raw bridge measurement');
  const candidate=permittedEvidenceValue(raw) as Extract<CanonicalValue,{kind:'record'}>,projected=project(candidate);
  validatePermittedEvidenceRecordClosure(projected);
  const result=projected as Extract<CanonicalValue,{kind:'record'}>;
  for(let field=1n;field<=9n;field++)if(key(result.fields.get(field)!)!==key(candidate.fields.get(field)!))
    throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','bridge projection changed a measurement field');
  // The sole returned value is the authoritative observer-side occurrence. No raw trace output.
  canonicalEncode(projected);return projected;
}
