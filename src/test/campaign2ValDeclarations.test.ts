import {describe,it,expect} from 'vitest';
import {compileValDeclarations} from '../campaign2/valDeclarations';
import {campaign2Record,campaign2Schema} from '../campaign2/codecs';
import {canonicalEncode,record,unsigned,text,typedIdentifier,list,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {createGovernedContentDefinition,compileContentDefinition} from '../substrate/contentManifest';
import {semanticReferentFromAuthoredContent,semanticReferentFromRuntimeEntity} from '../substrate/referentOrigin';
import {CanonicalEncodingError} from '../substrate/canonicalEncoding';

const id=(ns:number,s:string)=>typedIdentifier(ns,text(s));
const kind=id(1004,'semantic-kind/character'),validator=id(1021,'validator/character-qualification');
const ref=record(campaign2Schema('CanonicalRecordSchemaRef'),new Map([[1n,unsigned(170)],[2n,unsigned(1)]]));
function entry(stable:CanonicalValue,kind:string,version:string,definition:CanonicalValue){return record(campaign2Schema('SemanticRegistryEntry'),new Map([[1n,stable],[2n,id(1023,kind)],[3n,text(version)],[4n,definition]]));}
const kindEntry=entry(kind,'registry/semantic-kind','content-kind/0.1-candidate',campaign2Record('GovernedContentKindDefinition',{ContentSchema:ref}));
const validatorEntry=entry(validator,'registry/domain-validator','governed-domain-validator/0.1-candidate',campaign2Record('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:kind}));
const role=campaign2Record('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:validator});
const constraint=campaign2Record('CanonicalRoleConstraint',{Position:campaign2Record('CanonicalRolePosition',{VariantTag:unsigned(1),RecordTypeId:unsigned(267),FieldId:unsigned(1)}),Role:role});
const encodeEntries=(entries:CanonicalValue[])=>canonicalEncode(set(entries));
const compile=(entries=[kindEntry,validatorEntry],declarations:CanonicalValue=constraint)=>compileValDeclarations(encodeEntries(entries),canonicalEncode(declarations));
const contentId=id(20,'character/test'); // Local fixture identity, not a permanent origin assignment.
function content(kindValue=kind,refs:CanonicalValue[]=[]){
  const empty=list([]);
  const authored=createGovernedContentDefinition({stableId:contentId,semanticKind:kindValue,declaredInputs:empty,declaredOutputs:empty,preconditions:empty,worldEffects:empty,unitsDomainsBounds:empty,epistemicVisibility:empty,observationAffordances:empty,lifecycle:empty,referencedRegistryIds:[],referencedContentIds:refs as typeof contentId[],validationInvariants:empty,sourceProvenance:empty,changeHistory:empty,formalSeamMappings:empty});
  return compileContentDefinition(authored).canonicalDefinition;
}
describe('FCT-2 closed VAL declaration and CONTENT compilation',()=>{
  it('ORIGIN-B/C/D/E/F: qualifies only exact authored character content after structural validation',async()=>{
    const compiled=await compile().compileContent(encodeEntries([content()]),encodeEntries([kindEntry,validatorEntry]));
    expect(()=>compiled.qualifyCharacter(semanticReferentFromAuthoredContent(contentId))).not.toThrow();
    const runtime=semanticReferentFromRuntimeEntity(typedIdentifier(1122n,unsigned(3)));
    for(const v of [runtime,semanticReferentFromAuthoredContent(id(21,'character/test')),semanticReferentFromAuthoredContent(id(20,'missing'))]){
      expect(()=>compiled.qualifyCharacter(v)).toThrow(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
    }
    expect(()=>compiled.qualifyCharacter(id(1002,'character/test'))).toThrow(CanonicalEncodingError);
    const original=content() as Extract<CanonicalValue,{kind:'record'}>;
    const conflictingFields=new Map(original.fields);conflictingFields.set(10n,list([text('other lifecycle')]));
    const conflict=record(original.schema,conflictingFields);
    await expect(compile().compileContent(encodeEntries([original,conflict]),encodeEntries([kindEntry,validatorEntry]))).rejects.toThrow(/duplicate/);
    // VAL admits only character-kind content in this version: wrong-kind content fails construction.
    await expect(compile().compileContent(encodeEntries([content(id(1004,'semantic-kind/object'))]),encodeEntries([kindEntry,validatorEntry]))).rejects.toThrow(/unsupported content/);
  });
  it('FCT-3: applies declared record roles recursively with PRJ failure ownership',async()=>{
    const compiled=await compile().compileContent(encodeEntries([content()]),encodeEntries([kindEntry,validatorEntry]));
    const bound=campaign2Record('CharacterObserverBindingValue',{CharacterId:semanticReferentFromAuthoredContent(contentId)});
    expect(()=>compiled.validateRecordRoles(canonicalEncode(list([bound])))).not.toThrow();
    for(const identity of [id(1000,'observer/test'),semanticReferentFromRuntimeEntity(typedIdentifier(1122n,unsigned(8)))]){
      const invalid=campaign2Record('CharacterObserverBindingValue',{CharacterId:identity});
      expect(()=>compiled.validateRecordRoles(canonicalEncode(list([invalid])))).toThrow(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
    }
    expect(()=>compile(undefined,list([constraint,constraint]))).toThrow(/duplicate canonical role position/);
    const bad=campaign2Record('CanonicalRoleConstraint',{Position:campaign2Record('CanonicalRolePosition',{VariantTag:unsigned(1),RecordTypeId:unsigned(267),FieldId:unsigned(999)}),Role:role});
    expect(()=>compile(undefined,bad)).toThrow(expect.objectContaining({code:'INVALID_CONFIGURATION'}));
  });
  it('ORIGIN-C: the same runtime origin passes ExposureReferentId and fails CharacterId',async()=>{
    const position=(fieldId:number)=>campaign2Record('CanonicalRolePosition',{VariantTag:unsigned(1),RecordTypeId:unsigned(305),FieldId:unsigned(fieldId)});
    const declarations=list([
      campaign2Record('CanonicalRoleConstraint',{Position:position(1),Role:role}),
      campaign2Record('CanonicalRoleConstraint',{Position:position(2),Role:campaign2Record('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002)})}),
    ]);
    const compiled=await compile(undefined,declarations).compileContent(encodeEntries([content()]),encodeEntries([kindEntry,validatorEntry]));
    const runtime=semanticReferentFromRuntimeEntity(typedIdentifier(1122n,unsigned(9)));
    const fact=(subject:CanonicalValue)=>campaign2Record('RegulatoryExposureFact',{CharacterId:subject,ExposureReferentId:runtime,ActualContactCount:unsigned(1)});
    expect(()=>compiled.validateRecordRoles(canonicalEncode(fact(semanticReferentFromAuthoredContent(contentId))))).not.toThrow();
    expect(()=>compiled.validateRecordRoles(canonicalEncode(fact(runtime)))).toThrow(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  });
  it('admits generic character content with no body, roster or psychological predicate',async()=>{
    const compiled=compile();const result=await compiled.compileContent(encodeEntries([content()]),encodeEntries([kindEntry,validatorEntry]));
    expect(result.canonicalBytes).toEqual(encodeEntries([content()]));
    const bytes=compiled.entryBytes();bytes.fill(0);expect(compiled.entryBytes()).toEqual(encodeEntries([kindEntry,validatorEntry]));
  });
  it('enforces exact referenced/declared coverage at all three role positions',()=>{
    const pattern=record(campaign2Schema('StatePathPattern'),new Map([[1n,unsigned(268)],[2n,unsigned(1)],[3n,list([])]]));
    const projection=campaign2Record('EventDependentProjectedFieldRequirement',{SelectorSourceFieldId:unsigned(2),TargetStatePathTemplate:pattern,ProjectedFieldId:unsigned(1),OutputRole:role,OutputAccessor:id(1028,'ResolvedCharacterSubject')});
    const occurrence=campaign2Record('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:role});
    for(const d of [constraint,projection,occurrence]){expect(()=>compile(undefined,d)).not.toThrow();expect(()=>compile([kindEntry],d)).toThrow(/mismatch/);}
    expect(()=>compile(undefined,list([]))).toThrow(/mismatch/);
    expect(()=>compile(undefined,list([constraint,projection,occurrence]))).not.toThrow();
    expect(()=>compile([],list([]))).not.toThrow();
    expect(()=>compile([validatorEntry])).toThrow(/kind/);
  });
  it('rejects altered declaration operands, unknown entry kinds and unsupported versions',()=>{
    const wrong=entry(validator,'registry/domain-validator','governed-domain-validator/0.1-candidate',campaign2Record('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:id(1004,'semantic-kind/other')}));
    expect(()=>compile([kindEntry,wrong])).toThrow(/identity/);
    expect(()=>compile([kindEntry,entry(validator,'registry/domain-validator','other',campaign2Record('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:kind}))])).toThrow(/version/);
    expect(()=>compile([kindEntry,entry(validator,'registry/unknown','v',campaign2Record('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:kind}))])).toThrow();
    const schema=campaign2Schema('SemanticKindRoleValidatorDefinition');
    const wrongNs=entry(validator,'registry/domain-validator','governed-domain-validator/0.1-candidate',record(schema,new Map([[1n,id(23001,'semantic-kind/character')]])));
    try{compile([kindEntry,wrongNs]);throw Error('expected rejection');}catch(e){expect(e).toMatchObject({code:'INVALID_CONFIGURATION'});}
  });
  it('rejects detached registry declarations and unsupported or cyclic content',async()=>{
    const compiled=compile(),registry=encodeEntries([kindEntry,validatorEntry]);
    await expect(compiled.compileContent(encodeEntries([content(id(23001,'semantic-kind/character'))]),registry)).rejects.toThrow(/unsupported content/);
    await expect(compiled.compileContent(encodeEntries([content()]),encodeEntries([kindEntry]))).rejects.toThrow(/differ/);
    await expect(compiled.compileContent(encodeEntries([content(kind,[contentId])]),registry)).rejects.toThrow(/cycle/);
    await expect(compiled.compileContent(encodeEntries([content(kind,[id(20,'missing')])]),registry)).rejects.toThrow(/unknown content reference/);
  });
  it('empty content has no required kind, but a used kind always requires its definition',async()=>{
    const compiled=compile([],list([]));
    await expect(compiled.compileContent(encodeEntries([]),encodeEntries([]))).resolves.toBeDefined();
    await expect(compiled.compileContent(encodeEntries([content()]),encodeEntries([]))).rejects.toThrow(/unsupported content/);
  });
});
