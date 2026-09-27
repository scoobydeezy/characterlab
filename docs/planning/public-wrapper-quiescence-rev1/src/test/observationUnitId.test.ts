import {it,expect} from 'vitest';
import {canonicalEncode,typedIdentifier,text,unsigned,record,map,set,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {observationUnitId,validateObservationUnitId} from '../substrate/observationUnitId';
import {observationChannelValue,restoreObservationChannel,type ObservationChannel} from '../observation/observation';
import {ExactRational} from '../substrate/exactMath';
import {campaign2Record as r} from '../campaign2/codecs';
import {compileConsequenceBridge,compileFirstCampaign2Bridge} from '../campaign2/consequenceBridge';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {simInstant} from '../substrate/time';
import {fixtureContentContext,fixtureRoleConstraints,fixtureCharacterRole,recordConstraint,namespaceRole} from './fixtures/campaign2Model';
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
const channel=(unitId=observationUnitId('unit/fixture-pulse')):ObservationChannel=>({
  observationChannelId:id(1005,'channel/pulse'),observerId:id(1000,'observer/control'),subjectId:id(20,'subject/control'),
  modalityId:id(1006,'modality/pulse'),unitId,polarityId:1n,measurementModeId:1n,precision:ExactRational.of(1n),visibleProvenanceSlotIds:[],missingnessRuleId:1n,
});
const declaration=(unit=observationUnitId('unit/fixture-pulse'))=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([
  [1n,id(1027,'definition/authored-fact-consequence-bridge')],[2n,id(1023,'registry/authored-fact-consequence-bridge')],
  [3n,text('adaptation-input/0.31-candidate')],[4n,r('AuthoredFactConsequenceBridgeDefinition',{Channels:map([[channel(unit).observationChannelId,observationChannelValue(channel(unit))]])})],
]));
it('OBS-UNIT-B: rejects empty, non-NFC, invalid UTF-8 and non-text payloads without normalization',()=>{
  for(const value of ['', 'e\u0301','\ud800'])expect(()=>observationUnitId(value)).toThrow();
  expect(()=>validateObservationUnitId(typedIdentifier(1039,unsigned(1)))).toThrow();
  expect(observationUnitId('unit/fixture-pulse')).toEqual(id(1039,'unit/fixture-pulse'));
});
it('OBS-UNIT-A/C/D/E: structural identity, singleton admission and generic OBS remain separate',()=>{
  expect(()=>compileConsequenceBridge(canonicalEncode(declaration()))).not.toThrow();
  for(const ns of [20,21,1005,1006,1029,1038]){
    const alternate=id(ns,'unit/fixture-pulse');
    expect(()=>compileConsequenceBridge(canonicalEncode(declaration(alternate)))).toThrow(/ObservationUnitId/);
    expect(restoreObservationChannel(observationChannelValue(channel(alternate))).unitId).toEqual(alternate);
  }
  for(const name of ['meters','dose','reward','anything-else','UNIT/FIXTURE-PULSE','unit/fixture-pulse ']){
    const alternate=observationUnitId(name);expect(()=>validateObservationUnitId(alternate)).not.toThrow();
    expect(()=>compileConsequenceBridge(canonicalEncode(declaration(alternate)))).toThrow(/exact unit/);
  }
});
it('OBS-UNIT-A/C/E: first-profile role is required, namespace-only, and distinct from member admission',async()=>{
  const good=await fixtureContentContext([...fixtureRoleConstraints,recordConstraint(201,5,namespaceRole(1039))]);
  const bytes=canonicalEncode(declaration());expect(()=>compileFirstCampaign2Bridge(bytes,good)).not.toThrow();
  const missing=await fixtureContentContext();
  expect(()=>compileFirstCampaign2Bridge(bytes,missing)).toThrow(/namespace-only/);
  const wrong=await fixtureContentContext([...fixtureRoleConstraints,recordConstraint(201,5,namespaceRole(1029))]);
  expect(()=>compileFirstCampaign2Bridge(bytes,wrong)).toThrow(/namespace-only/);
  const validated=await fixtureContentContext([...fixtureRoleConstraints,recordConstraint(201,5,fixtureCharacterRole)]);
  expect(()=>compileFirstCampaign2Bridge(bytes,validated)).toThrow(/namespace-only/);
  const other=canonicalEncode(declaration(observationUnitId('meters')));
  expect(()=>good.validateRecordRoles(other)).not.toThrow();
  expect(()=>compileFirstCampaign2Bridge(other,good)).toThrow(/exact unit/);
});
it('OBS-UNIT-G: the channel unit changes actual registry/model commitment and invalid members still reject',async()=>{
  const empty=await commitManifest(set([]));
  const model=async(value:CanonicalValue)=>createModelIdentity({rulesVersion:'test/unit-commitment',contentSchemaVersion:'test',contentManifest:empty,parameterSchemaVersion:'test',parameterSet:empty,numericProfileVersion:'test',randomAlgorithmVersion:'test',registrySchemaVersion:'test',registryManifest:await commitManifest(set([value]))});
  const good=declaration(),bad=declaration(observationUnitId('meters'));
  expect((await model(good)).canonicalBytes).not.toEqual((await model(bad)).canonicalBytes);
  expect(()=>compileConsequenceBridge(canonicalEncode(bad))).toThrow();
});
it('OBS-UNIT-F/I: bridge captures its channel and has no source-unit or conversion operand',()=>{
  const bytes=canonicalEncode(declaration()),bridge=compileConsequenceBridge(bytes);bytes.fill(0);
  const run=(payload:CanonicalValue)=>{
    let next=0n;const ctx=bridge.begin(2n),allocator={allocateRuntimeId:()=>next++};
    const source={eventId:0n,eventSequence:0n,dueAt:simInstant(2n),phase:110n,eventTypeId:AUTHORED_FACT_EVENT,payload,dependencies:list([]),causalParentEventIds:[]};
    const plan=ctx.source(source,allocator),child={...plan.emissions()[0],eventId:1n,eventSequence:1n,causalParentEventIds:[0n]};
    plan.bindAllocatedChildren([child]);const result=ctx.execute(child,allocator);ctx.abort();
    return {emission:canonicalEncode(child.payload),observation:canonicalEncode(result.outputs[0])};
  };
  // Internal bridge is downstream of source admission; it never interprets source payload fields.
  expect(run(list([]))).toEqual(run(list([observationUnitId('meters'),unsigned(9000)])));
});
