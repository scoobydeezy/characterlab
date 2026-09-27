import {it,expect} from 'vitest';
import {canonicalEncode,list,set,record,map,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstModelCandidate,candidatePattern,candidateId,namespaceRole,recordRole} from '../campaign2/firstModelCandidate';
import {compileBoundedModelDeclarations,compileCampaign2Registry,decodeCampaign2Registry,compileCampaign2Parameters,REGISTRY_PROFILE,PARAMETER_PROFILE} from '../campaign2/modelPackaging';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {orderingParametersValue} from '../substrate/scheduler';
import {campaign2SchemaByType} from '../campaign2/codecs';
import {statePathPatternValue} from '../substrate/state';
import {AuthoritativeState} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {compileOrderedInputProfile,AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {compileAdaptationEvaluator} from '../campaign2/adaptationEvaluation';
import {createAdaptationRuntime} from '../campaign2/adaptationRuntime';
import {signed} from '../substrate/canonicalEncoding';
const enc=canonicalEncode;
const slots=()=>items(decodeCampaign2(firstModelCandidate().registry),'list').slice();
const change=(slot:number,value:CanonicalValue)=>{const s=slots();s[slot]=value;return enc(list(s));};
it('materializes all five candidate rules from the six-slot snapshot and computes real identities',async()=>{
  const source=firstModelCandidate(),m=await compileBoundedModelDeclarations(source);
  expect(m.adaptation.ruleCount).toBe(5);expect(m.admission.registrations()).toHaveLength(4);expect(m.parameters.maxWork).toBe(100n);
  expect(m.registryManifest.canonicalBytes).toEqual(source.registry);expect(m.parameterSet.canonicalBytes).toEqual(source.parameters);
  const other=firstModelCandidate();other.parameters=enc(list([orderingParametersValue(101n)]));
  const second=await compileBoundedModelDeclarations(other);expect(second.modelIdentity.canonicalBytes).not.toEqual(m.modelIdentity.canonicalBytes);
});
it('MODEL-PACK-B/E: rejects wrong shapes, descriptors and compatibility fields',async()=>{
  for(const value of [set(slots()),list(slots().slice(0,5)),list([...slots(),set([])]),list([set([]),...slots().slice(1)])])expect(()=>decodeCampaign2Registry(REGISTRY_PROFILE,enc(value))).toThrow();
  const s=slots(),carrier=items(s[0],'set').slice(),index=carrier.findIndex(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===172n&&key(f(v,1n))===key(unsigned(155)));
  const descriptor=rec(carrier[index],172n);carrier[index]=record(descriptor.schema,new Map([...descriptor.fields,[3n,text('CallerOwnership')]]));
  expect(()=>decodeCampaign2Registry(REGISTRY_PROFILE,change(0,set(carrier)))).toThrow(/trusted inventory/);
  for(const value of [list([]),list([record(campaign2SchemaByType(133n),new Map([[1n,unsigned(0)]]))]),list([orderingParametersValue(1n),set([])])])expect(()=>compileCampaign2Parameters(PARAMETER_PROFILE,enc(value))).toThrow();
  for(const field of ['rulesVersion','registrySchemaVersion','parameterSchemaVersion','contentSchemaVersion'])await expect(compileBoundedModelDeclarations({...firstModelCandidate(),[field]:'foreign'})).rejects.toThrow(/bundle/);
});
it('MODEL-PACK-G: writable/read-only families and grammars compile across slots',async()=>{
  const source=firstModelCandidate(),s=slots(),grammars=items(s[4],'set');
  await expect(compileCampaign2Registry(REGISTRY_PROFILE,change(4,set(grammars.slice(1))),source.content)).rejects.toThrow(/grammar/);
  const p={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard' as const,selectorKind:'mapKey' as const}]};
  const ro=r('ReadOnlyStateFamilyDefinition',{Pattern:statePathPatternValue(p),ValueGrammar:record(campaign2SchemaByType(152n),new Map([[1n,unsigned(3)],[2n,unsigned(267)]]))});
  await expect(compileCampaign2Registry(REGISTRY_PROFILE,change(3,set([ro])),source.content)).rejects.toThrow(/grammar/);
  const orphan=r('StateKeyGrammarDefinition',{Pattern:statePathPatternValue(p),KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(1)})});
  await expect(compileCampaign2Registry(REGISTRY_PROFILE,change(4,set([...grammars,orphan])),source.content)).rejects.toThrow(/grammar/);
  const overlap=r('ReadOnlyStateFamilyDefinition',{Pattern:statePathPatternValue(candidatePattern(0)),ValueGrammar:record(campaign2SchemaByType(152n),new Map([[1n,unsigned(3)],[2n,unsigned(297)]]))});
  await expect(compileCampaign2Registry(REGISTRY_PROFILE,change(3,set([overlap])),source.content)).rejects.toThrow(/overlap/);
});
it('MODEL-PACK-H: VAL collects nested occurrence roles in slot zero even without slot-five validator references',async()=>{
  const s=slots(),source=firstModelCandidate();
  const charRole=r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:candidateId(1021,'validator/character-qualification')});
  s[5]=set(items(s[5],'set').map(v=>{const c=rec(v,265n),role=rec(f(c,2n),263n);return role.fields.has(2n)?record(c.schema,new Map([...c.fields,[2n,namespaceRole(1002)]])):v;}));
  let changed=false;
  function nested(v:CanonicalValue):CanonicalValue{
    if(typeof v==='boolean')return v;
    if(v.kind==='record'){
      if(v.schema.typeId===278n&&!changed){changed=true;return record(v.schema,new Map([...v.fields,[2n,charRole]]));}
      return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,nested(x)])));
    }
    if(v.kind==='set')return set(v.items.map(nested));if(v.kind==='list')return list(v.items.map(nested));if(v.kind==='map')return map(v.entries.map(([k,x])=>[nested(k),nested(x)]));return v;
  }
  s[0]=nested(s[0]);expect(changed).toBe(true);
  // VAL/cross-slot preparation only: this synthetic role is not accepted by EVID occurrence admission.
  await expect(compileCampaign2Registry(REGISTRY_PROFILE,enc(list(s)),source.content)).resolves.toBeDefined();
  s[0]=set(items(s[0],'set').filter(v=>!(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(candidateId(1021,'validator/character-qualification')))));
  await expect(compileCampaign2Registry(REGISTRY_PROFILE,enc(list(s)),source.content)).rejects.toThrow(/validator mismatch/);
});
it('MODEL-PACK-C: all compiler components and version fields use the original snapshot',async()=>{
  const original=firstModelCandidate(),baseline=await compileBoundedModelDeclarations(original),source=firstModelCandidate();
  const promise=compileBoundedModelDeclarations(source);
  source.registry.fill(0);source.content.fill(0);source.parameters.fill(0);source.rulesVersion='changed';
  const result=await promise;expect(result.modelIdentity.canonicalBytes).toEqual(baseline.modelIdentity.canonicalBytes);
  await expect(compileBoundedModelDeclarations({...firstModelCandidate(),modelIdentity:baseline.modelIdentity} as Parameters<typeof compileBoundedModelDeclarations>[0])).rejects.toThrow(/source field/);
});
it('MODEL-PACK-D: candidate runtime consumes the committed work limit and executes both bases',async()=>{
  const build=async(limit:bigint)=>{
    const source=firstModelCandidate();source.parameters=enc(list([orderingParametersValue(limit)]));
    const m=await compileBoundedModelDeclarations(source),initial=new AuthoritativeState([]),character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
    const facts=[r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(2)}),r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:candidateId(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(3)})];
    const inputs=await compileOrderedInputProfile(m.profiles.orderedInput,m.compiled.content,m.domains).create(enc(list(facts.map((Fact,i)=>list([signed(i+2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact}),list([])])))),enc(initial.canonicalValue()),m.modelIdentity,new Uint8Array(32));
    const evaluator=compileAdaptationEvaluator(m.adaptation,m.domains,m.compiled.stateModel);
    return createAdaptationRuntime(inputs,initial,m.admission,evaluator,m.domains,m.compiled.stateModel,m.parameters.maxWork,m.bridge);
  };
  const run=await build(100n),first=(await run.settleNextInstant())!,second=(await run.settleNextInstant())!;
  expect(first.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===325n)).toHaveLength(4);
  expect(second.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===325n)).toHaveLength(1);
  expect(first.state.canonicalValue()).not.toEqual(second.state.canonicalValue());
  const bounded=await build(8n),before=bounded.snapshot();await expect(bounded.settleNextInstant()).rejects.toThrow();
  expect(bounded.snapshot().allocators).toEqual(before.allocators);expect(bounded.snapshot().outputs).toEqual(before.outputs);
});
