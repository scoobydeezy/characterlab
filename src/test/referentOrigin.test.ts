import {describe,it,expect} from 'vitest';
import {canonicalEncode,bytesToHex,list,text,typedIdentifier,unsigned,signed,CanonicalEncodingError,type CanonicalValue} from '../substrate/canonicalEncoding';
import {allocateRuntimeEntityOrigin,semanticReferentFromAuthoredContent,semanticReferentFromRuntimeEntity,semanticReferentKey,semanticReferentValue,validateSemanticReferent} from '../substrate/referentOrigin';
import {decodeCampaign2} from '../campaign2/codecs';
import {eventBindingValue,recognitionResolutionValue} from '../semanticBinding/semanticEvidenceCodecs';
import {EventRoleId,projectEventRoleEvidence} from '../semanticBinding/eventBindings';
import {DeterministicScheduler,type EventHandler} from '../substrate/scheduler';
import {createCanonicalSave,loadCanonicalSave,type PersistentStateAdapter} from '../substrate/persistence';
import {commitManifest,createModelIdentity,createRunIdentity,runSeedFromFriendlyInteger} from '../substrate/identity';
import {simInstant} from '../substrate/time';

const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
describe('referent-origin/0.1-candidate corrected construction',()=>{
  it('ORIGIN-A/B: retains complete typed StableId and separates equal local ordinals',()=>{
    const stable=typedIdentifier(20n,unsigned(7));
    const authored=semanticReferentFromAuthoredContent(stable);
    const runtime=semanticReferentFromRuntimeEntity(typedIdentifier(1122n,unsigned(7)));
    expect(key(authored)).not.toBe(key(runtime));
    expect(authored.payload).toEqual(typedIdentifier(1037n,stable));
    expect(semanticReferentValue(semanticReferentKey(authored))).toEqual(authored);
    expect(key(authored)).not.toBe(key(semanticReferentFromAuthoredContent(typedIdentifier(21n,unsigned(7)))));
  });
  it('ORIGIN-E/H/I: malformed, text-only and fixture-origin substitutions fail structurally',()=>{
    for(const payload of [text('person/glen'),typedIdentifier(20n,text('glen')),typedIdentifier(21n,unsigned(1)),typedIdentifier(999n,unsigned(1)),typedIdentifier(1037n,text('glen')),typedIdentifier(1122n,text('1')),typedIdentifier(1122n,signed(-1))]){
      const v=typedIdentifier(1002n,payload);
      expect(()=>decodeCampaign2(canonicalEncode(v))).toThrow(CanonicalEncodingError);
    }
    expect(()=>validateSemanticReferent(typedIdentifier(1002n,typedIdentifier(1122n,{kind:'unsigned',value:-1n})))).toThrow(CanonicalEncodingError);
    expect(()=>eventBindingValue({eventBindingId:1n,eventRoleId:EventRoleId.Actor,semanticReferent:{semanticReferentId:'person.glen',domainTags:['entity']}})).toThrow(CanonicalEncodingError);
    expect(()=>recognitionResolutionValue({kind:'asserted-candidate',candidateSemanticReferentId:'person.glen'})).toThrow(CanonicalEncodingError);
  });
  it('corrected truth and fallible candidate encodings share grammar without sharing authority',()=>{
    const authored=semanticReferentFromAuthoredContent(typedIdentifier(20n,text('glen')));
    const runtime=semanticReferentFromRuntimeEntity(typedIdentifier(1122n,unsigned(4)));
    for(const value of [authored,runtime]){
      const binding=eventBindingValue({eventBindingId:2n,eventRoleId:EventRoleId.Actor,semanticReferent:{semanticReferentId:semanticReferentKey(value),domainTags:['entity']}});
      const candidate=recognitionResolutionValue({kind:'asserted-candidate',candidateSemanticReferentId:semanticReferentKey(value)});
      expect(()=>decodeCampaign2(canonicalEncode(binding))).not.toThrow();
      expect(()=>decodeCampaign2(canonicalEncode(candidate))).not.toThrow();
    }
  });
  it('ORIGIN-G2: an interleaved allocation shifts ordinals without changing permitted role evidence',()=>{
    function projected(extraEntity:boolean){
      let next=0n;const allocator={allocateRuntimeId:()=>next++};
      if(extraEntity)allocateRuntimeEntityOrigin(allocator);
      const entity=semanticReferentFromRuntimeEntity(allocateRuntimeEntityOrigin(allocator));
      const binding={eventBindingId:allocator.allocateRuntimeId(),eventRoleId:EventRoleId.Actor,semanticReferent:{semanticReferentId:semanticReferentKey(entity),domainTags:['entity']}};
      return {entity,evidence:projectEventRoleEvidence(binding,{observerId:'observer/test',observerTrackSequence:0n},{kind:'coarsen-to-participant'})};
    }
    const first=projected(false),shifted=projected(true);
    expect(key(first.entity)).not.toBe(key(shifted.entity));
    expect(shifted.evidence).toEqual(first.evidence);
  });
  it('ORIGIN-G/G2: shared allocator interleaving and exact canonical save/load continuation',async()=>{
    const adapter:PersistentStateAdapter<CanonicalValue>={clone:structuredClone,validate:canonicalEncode,canonicalValue:v=>v,restore:v=>v,analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
    const eventType=typedIdentifier(20001n,text('origin-fixture/create'));
    const handler:EventHandler<CanonicalValue>=ctx=>{
      const before=typedIdentifier(1100n,unsigned(ctx.allocateRuntimeId()));
      const entity=semanticReferentFromRuntimeEntity(allocateRuntimeEntityOrigin(ctx));
      const after=typedIdentifier(1100n,unsigned(ctx.allocateRuntimeId()));
      return {nextState:list([ctx.state,entity,before,after]),emittedEvents:[],traceContributions:[],outputs:[entity,before,after]};
    };
    const handlers=new Map([[key(eventType),handler]]),initial=list([]);
    const scheduler=new DeterministicScheduler({initialState:initial,stateAdapter:adapter,handlers,maxSettlementWorkPerSimulationInstant:10n});
    for(const dueAt of [1n,2n])scheduler.schedule({dueAt:simInstant(dueAt),phase:10n,eventTypeId:eventType,payload:list([]),dependencies:list([])});
    const manifest=await commitManifest(list([]));
    const modelIdentity=await createModelIdentity({rulesVersion:'rules/origin-regression',contentSchemaVersion:'content/fixture',contentManifest:manifest,parameterSchemaVersion:'parameters/fixture',parameterSet:manifest,numericProfileVersion:'numeric/exact-1',randomAlgorithmVersion:'rng/sha256-addressed-128-v1-candidate',registrySchemaVersion:'registry/fixture',registryManifest:manifest});
    const runIdentity=await createRunIdentity({modelIdentity,initialState:manifest,orderedInputSequence:manifest,runSeed:runSeedFromFriendlyInteger(7n)});
    await scheduler.settleNextInstant();
    const snapshot=scheduler.exportQuiescentSnapshot();
    expect(snapshot.allocators.nextRuntimeId).toBe(3n);
    const save=createCanonicalSave({scheduler,stateAdapter:adapter,modelIdentity,runIdentity,continuingRunInputs:list([])});
    const loaded=await loadCanonicalSave(save,{stateAdapter:adapter,handlers,maxSettlementWorkPerSimulationInstant:10n,expectedModelIdentity:modelIdentity,expectedRunIdentity:runIdentity});
    expect(loaded.scheduler.exportQuiescentSnapshot()).toEqual(snapshot);
    await scheduler.settleNextInstant();await loaded.scheduler.settleNextInstant();
    expect(loaded.scheduler.exportQuiescentSnapshot()).toEqual(scheduler.exportQuiescentSnapshot());
    expect(scheduler.exportQuiescentSnapshot().allocators.nextRuntimeId).toBe(6n);
    const outputs=scheduler.exportQuiescentSnapshot().outputs;
    expect(new Set(outputs.map(key)).size).toBe(6);
  });
});
