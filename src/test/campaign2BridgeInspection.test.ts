/** Reproduction of C2-BRIDGE-OBS-001, not a passing both-affected bridge. */
import {it,expect} from 'vitest';
import {typedIdentifier,text,unsigned,canonicalEncode,list,record,rational,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational} from '../substrate/exactMath';
import {simInstant} from '../substrate/time';
import {compilePermittedEvidence,permittedEvidenceValue,validatePermittedEvidenceRecordClosure,observationChannelValue,type ObservationChannel} from '../observation/observation';
import {compileBridgeObservation} from '../campaign2/bridgeObservation';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {compileConsequenceBridge} from '../campaign2/consequenceBridge';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {contentRegistrySchemas} from '../substrate/contentManifest';

it('reproduces the inherited truth handle in ADAPT D’s exact fixed-pulse measurement',()=>{
  const q=(n:bigint)=>ExactRational.of(n),fixture=(name:string)=>typedIdentifier(20,text(name));
  const channel:ObservationChannel={observationChannelId:fixture('channel/pulse'),observerId:typedIdentifier(1000,text('observer/control')),
    subjectId:fixture('subject/pulse'),modalityId:fixture('modality/pulse'),unitId:fixture('unit/pulse'),
    polarityId:1n,measurementModeId:1n,precision:q(1n),visibleProvenanceSlotIds:[],missingnessRuleId:1n};
  const truth={before:q(0n),potentialEffect:q(1n),applied:q(1n),overflow:q(0n),after:q(1n),minimum:q(0n),maximum:q(2n),
    provenance:{slots:new Map()},truthRecordId:typedIdentifier(1121,unsigned(7))};
  const observed=compilePermittedEvidence(truth,channel,typedIdentifier(1115,unsigned(8)),simInstant(2n));
  expect(observed.kind).toBe('present');if(observed.kind!=='present')throw Error('not present');
  expect(observed.measurementInterval.lower?.equals(q(1n))).toBe(true);expect(observed.measurementInterval.upper?.equals(q(1n))).toBe(true);
  expect(observed.evidenceKindId).toBe(1n);expect(observed.perceivedConceptTokens).toEqual([]);
  expect(observed.safeSourceReferences).toEqual([truth.truthRecordId]); // Incompatible with D's required [].
  const changed=compilePermittedEvidence({...truth,truthRecordId:typedIdentifier(1121,unsigned(99))},channel,typedIdentifier(1115,unsigned(8)),simInstant(2n));
  expect(canonicalEncode(permittedEvidenceValue(observed))).not.toEqual(canonicalEncode(permittedEvidenceValue(changed)));
});

it('bridge staging rejects lookalikes, altered children and orphan reservations',()=>{
  const id=(ns:number,s:string)=>typedIdentifier(ns,text(s)),channelId=id(1005,'channel/pulse');
  const channel:ObservationChannel={observationChannelId:channelId,observerId:id(1000,'observer/control'),subjectId:id(20,'subject/control'),modalityId:id(1006,'modality/pulse'),unitId:typedIdentifier(1039,text('unit/fixture-pulse')),polarityId:1n,measurementModeId:1n,precision:ExactRational.of(1n),visibleProvenanceSlotIds:[],missingnessRuleId:1n};
  const declaration=(channels:ObservationChannel[])=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,id(1027,'definition/authored-fact-consequence-bridge')],[2n,id(1023,'registry/authored-fact-consequence-bridge')],[3n,text('adaptation-input/0.31-candidate')],[4n,r('AuthoredFactConsequenceBridgeDefinition',{Channels:map(channels.map(c=>[c.observationChannelId,observationChannelValue(c)]))})]]));
  expect(()=>compileConsequenceBridge(canonicalEncode(declaration([])))).toThrow();
  expect(()=>compileConsequenceBridge(canonicalEncode(declaration([channel,{...channel,observationChannelId:id(1005,'channel/duplicate-observer')}])))).toThrow();
  const model=compileConsequenceBridge(canonicalEncode(declaration([channel]))),bridge=model.begin(2n);let allocated=0n;
  const allocator={allocateRuntimeId:()=>allocated++},source={eventId:0n,eventSequence:0n,dueAt:simInstant(2n),phase:110n,eventTypeId:AUTHORED_FACT_EVENT,payload:list([]),dependencies:list([]),causalParentEventIds:[]};
  expect(()=>bridge.source({...source,phase:120n},allocator)).toThrow();expect(allocated).toBe(0n);
  const plan=bridge.source(source,allocator),child={...plan.emissions()[0],eventId:1n,eventSequence:1n,causalParentEventIds:[0n]};
  expect(()=>bridge.execute(child,allocator)).toThrow();expect(allocated).toBe(1n);
  expect(()=>plan.bindAllocatedChildren([{...child,causalParentEventIds:[99n]}])).toThrow();
  plan.bindAllocatedChildren([child]);expect(()=>bridge.execute({...child,payload:list([])},allocator)).toThrow();expect(allocated).toBe(1n);
  const result=bridge.execute(child,allocator);expect(result.outputs).toHaveLength(1);expect(allocated).toBe(3n);
  expect(()=>bridge.execute(child,allocator)).toThrow();expect(()=>bridge.finish()).toThrow();
  bridge.abort();expect(()=>result.plan.bindAllocatedChildren([])).toThrow();
});

it('BRIDGE-OBS projection preserves the measurement, cuts truth equality, and has strict version closure',()=>{
  const q=(n:bigint)=>ExactRational.of(n),fixture=(name:string)=>typedIdentifier(20,text(name));
  const channel:ObservationChannel={observationChannelId:fixture('channel/pulse'),observerId:typedIdentifier(1000,text('observer/control')),subjectId:fixture('subject/pulse'),modalityId:fixture('modality/pulse'),unitId:fixture('unit/pulse'),polarityId:1n,measurementModeId:1n,precision:q(1n),visibleProvenanceSlotIds:[],missingnessRuleId:1n};
  const truth={before:q(0n),potentialEffect:q(1n),applied:q(1n),overflow:q(0n),after:q(1n),minimum:q(0n),maximum:q(2n),provenance:{slots:new Map()},truthRecordId:typedIdentifier(1121,unsigned(7))};
  const observationId=typedIdentifier(1115,unsigned(8)),at=simInstant(2n),raw=permittedEvidenceValue(compilePermittedEvidence(truth,channel,observationId,at)) as Extract<CanonicalValue,{kind:'record'}>;
  const projected=compileBridgeObservation(truth,channel,observationId,at) as Extract<CanonicalValue,{kind:'record'}>;
  for(let f=1n;f<=9n;f++)expect(canonicalEncode(projected.fields.get(f)!)).toEqual(canonicalEncode(raw.fields.get(f)!));
  expect(projected.fields.get(10n)).toEqual(list([]));expect(projected.fields.get(11n)).toEqual(text('authored-fact-observation/0.1-candidate'));
  expect(decodeCampaign2(canonicalEncode(projected))).toEqual(projected);
  expect(canonicalEncode(compileBridgeObservation({...truth,truthRecordId:typedIdentifier(1121,unsigned(99))},channel,observationId,at))).toEqual(canonicalEncode(projected));
  for(const [field,value] of [[7n,unsigned(2)],[8n,rational(2n,1n)],[9n,list([unsigned(1)])],[10n,list([truth.truthRecordId])],[10n,list([fixture('opaque/replacement')])],[11n,text('unregistered/1')]] as const){
    const changed=record(projected.schema,new Map([...projected.fields,[field,value]]));
    expect(()=>validatePermittedEvidenceRecordClosure(changed)).toThrow();expect(()=>decodeCampaign2(canonicalEncode(changed))).toThrow();
  }
  expect(()=>compileBridgeObservation(truth,{...channel,precision:q(2n)},observationId,at)).toThrow(/unexpected raw/);
  // Legacy compiler/control bytes are still the old truth-linked candidate; never returned by bridge.
  expect(canonicalEncode(permittedEvidenceValue(compilePermittedEvidence(truth,channel,observationId,at)))).toEqual(canonicalEncode(raw));
});
