import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,map,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathPatternValue} from '../substrate/state';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {compileCampaign2Registry} from '../campaign2/modelPackaging';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileAdaptationDomains} from '../campaign2/adaptationDomains';
import {compileAdaptationTransitions} from '../campaign2/adaptationTransitions';
import {compileTransitionAdmissionV06} from '../campaign2/transitionAdmissionV04';
import {compileAdaptationEvaluator} from '../campaign2/adaptationEvaluation';
import {compileFirstCampaign2Bridge} from '../campaign2/consequenceBridge';
import {createAdaptationRuntime} from '../campaign2/adaptationRuntime';
import {compileRequiredProjections} from '../campaign2/requiredProjection';
import {compileOrderedInputProfile,ORDERED_INPUT_PROFILE,AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt,dataIdentity as ident} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {withRoster} from './fixtures/campaign2RosterModel';
import * as schedulerModule from '../substrate/scheduler';
import * as ingressModule from '../campaign2/transitionIngressV04';

const observer=id(1000,'observer/bridge-subject'),stableA=governedContentDefinitionId('character/bridge-subject'),stableB=governedContentDefinitionId('character/roster-other');
const A=semanticReferentFromAuthoredContent(stableA),B=semanticReferentFromAuthoredContent(stableB);
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return record(v.schema,new Map([...v.fields,[n,x]]));};
async function fixture(){
 const source=withRoster(),content=items(decodeCampaign2(source.content),'set')[0];source.content=enc(set([content,replace(content,1n,stableB)]));
 const slots=[...items(decodeCampaign2(source.registry),'list')];slots[0]=set(items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(id(1029,'variable/fixture-regulation')))return v;
  const registration=rec(f(v,4n),283n),reference=rec(f(registration,2n),282n),anchors=f(reference,1n);if(typeof anchors==='boolean'||anchors.kind!=='map')throw Error('fixture');
  return replace(v,4n,replace(registration,2n,replace(reference,1n,map([...anchors.entries,[r('RegulatoryCharacterReferenceKey',{CharacterId:B}),anchors.entries[0][1]]]))));
 }));source.registry=enc(list(slots));
 const compiled=await compileCampaign2Registry(source.registrySchemaVersion,source.registry,source.content);
 const group=(kind:string)=>compiled.entries().filter(v=>txt(ident(f(rec(v,171n),2n)).payload)===kind),one=(kind:string)=>{const values=group(kind);expect(values).toHaveLength(1);return enc(values[0]);};
 const reg=compileRegulatoryReferences(enc(set(group('registry/regulatory-variable'))),compiled.content);
 const domains=compileAdaptationDomains(enc(set(['registry/campaign2-state-family','registry/adaptation-leaf-family','registry/load-domain','registry/procedure'].flatMap(group))),compiled.stateModel,reg,compiled.content);
 const entries=group('registry/transition-registration'),v04=entries.filter(v=>txt(f(rec(v,171n),3n))==='transition-admission/0.4-candidate'),v06=entries.filter(v=>txt(f(rec(v,171n),3n))==='transition-admission-extension/0.6-candidate');
 const adaptation=compileAdaptationTransitions(enc(set(v06)),enc(set(group('registry/adaptation-rule'))),one('registry/authored-adaptation-facts'),one('registry/adaptation-settlement'),domains,reg,compiled.content);
 const admission=compileTransitionAdmissionV06(enc(set(v04)),one('registry/transition-admission'),compiled.content,adaptation),bridge=compileFirstCampaign2Bridge(one('registry/authored-fact-consequence-bridge'),compiled.content);
 // A generic component-harness identity, never an admitted bounded factory profile.
 const modelIdentity=await createModelIdentity({rulesVersion:'test/generic-evid-roster',contentSchemaVersion:source.contentSchemaVersion,contentManifest:compiled.content,registrySchemaVersion:source.registrySchemaVersion,registryManifest:await commitManifest(decodeCampaign2(source.registry)),parameterSchemaVersion:source.parameterSchemaVersion,parameterSet:await commitManifest(decodeCampaign2(source.parameters)),numericProfileVersion:source.numericProfileVersion,randomAlgorithmVersion:source.randomAlgorithmVersion});
 return {source,compiled,domains,adaptation,admission,bridge,modelIdentity,v04};
}

it('FCT-C1: shared production EVID is invariant under valid A/B/absent rosters with fixed X and allocation',async()=>{
 const m=await fixture(),results=[],mutationStage=(globalThis as unknown as {process:{env:Record<string,string|undefined>}}).process.env.CHARACTERLAB_FCT_C_PROJECTION_MUTANT,expectProjectionRejection=mutationStage==='evaluation'||mutationStage==='learning';
 for(const subject of [A,B,undefined]){
  const state=new AuthoritativeState(subject?[{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]},value:r('CharacterObserverBindingValue',{CharacterId:subject})}]:[]);
  m.compiled.stateModel.validateState(state);const before=enc(state.canonicalValue());
  const ordered=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:A,ExposureReferentId:A,ActualContactCount:unsigned(0)})}),list([])])]));
  const inputs=await compileOrderedInputProfile(ORDERED_INPUT_PROFILE,m.compiled.content,m.domains).create(ordered,before,m.modelIdentity,new Uint8Array(32));
  const original=schedulerModule.DeterministicScheduler,originalIngress=ingressModule.beginTransitionIngressV04,observed:CanonicalValue[][]=[],patches:unknown[]=[],rosterReads:unknown[]=[],handlerFailures:string[]=[];
  const schedulerSpy=vi.spyOn(schedulerModule,'DeterministicScheduler').mockImplementation(((config:schedulerModule.SchedulerConfiguration<AuthoritativeState>)=>{
   const handlers=new Map([...config.handlers].map(([name,handler])=>[name,async(context:schedulerModule.EventHandlerContext<AuthoritativeState>)=>{
    try{const result=await handler(context);if(context.event.phase===130n)observed.push([...result.traceContributions]);return result;}catch(error){if(context.event.phase===130n)handlerFailures.push((error as {code:string}).code);throw error;}
   }]));return new original({...config,handlers});
  }) as never);
  const ingressSpy=vi.spyOn(ingressModule,'beginTransitionIngressV04').mockImplementation((...args)=>{const ingress=originalIngress(...args);return {...ingress,completeEvid(...args){patches.push(structuredClone(args[2]));return ingress.completeEvid(...args);}};});
  const originalRead=AuthoritativeState.prototype.read,readSpy=vi.spyOn(AuthoritativeState.prototype,'read').mockImplementation(function(this:AuthoritativeState,path){if(path.rootStateTypeId===268n)rosterReads.push(path);return originalRead.call(this,path);});
  try{
   const runtime=createAdaptationRuntime(inputs,state,m.admission,compileAdaptationEvaluator(m.adaptation,m.domains,m.compiled.stateModel),m.domains,m.compiled.stateModel,100n,m.bridge),initialAllocators=runtime.snapshot().allocators;
   if(expectProjectionRejection){
    const beforeSnapshot=runtime.snapshot();let failure:unknown;try{await runtime.settleNextInstant();}catch(error){failure=error;}expect((failure as {code?:string})?.code,String(failure)).toBe('TRANSITION_FAILURE');expect(handlerFailures).toEqual(['ILLEGAL_READ']);
    const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(before);
    for(const field of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[field]).toEqual(beforeSnapshot[field]);
    expect(rosterReads).toEqual([]);expect(patches).toEqual(mutationStage==='learning'?[{operations:[]}]:[]);expect(observed).toEqual(mutationStage==='learning'?[[]]:[]);continue;
   }
   await runtime.settleNextInstant();const snapshot=runtime.snapshot();
   const ofType=(type:bigint)=>{const values=snapshot.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);expect(values).toHaveLength(1);return enc(values[0]);};
   expect(observed).toEqual([[],[]]);expect(patches).toEqual([{operations:[]},{operations:[]}]);expect(rosterReads).toEqual([]);expect(enc(snapshot.state.canonicalValue())).toEqual(before);
   results.push({x:ofType(227n),e:ofType(269n),l:ofType(270n),initialAllocators,finalAllocators:snapshot.allocators,registrations:enc(set(m.v04))});
  }finally{readSpy.mockRestore();ingressSpy.mockRestore();schedulerSpy.mockRestore();}
 }
 if(!expectProjectionRejection){expect(results).toHaveLength(3);expect(results[1]).toEqual(results[0]);expect(results[2]).toEqual(results[0]);}
});

it('FCT-C2: exact accepted IDN subject requirement is rejected by the EVID empty ReadDomain',async()=>{
 const m=await fixture(),registration=f(rec(m.v04.find(v=>key(f(rec(v,171n),1n))===key(id(1009,'OutcomeEvaluationTransition')))!,171n),4n);
 const requirement=r('EventDependentProjectedFieldRequirement',{SelectorSourceFieldId:unsigned(2),TargetStatePathTemplate:statePathPatternValue({rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]}),ProjectedFieldId:unsigned(1),OutputRole:decodeCampaign2(m.compiled.content.recordRole(267n,1n)!),OutputAccessor:id(1028,'ResolvedCharacterSubject')});
 expect(()=>compileRequiredProjections(enc(registration),enc(set([requirement])),[],m.compiled.stateModel,m.compiled.content)).toThrowError(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
 expect(()=>compileRequiredProjections(enc(registration),enc(set([requirement])),[],m.compiled.stateModel,m.compiled.content)).toThrow('required projection outside ReadDomain');
});
