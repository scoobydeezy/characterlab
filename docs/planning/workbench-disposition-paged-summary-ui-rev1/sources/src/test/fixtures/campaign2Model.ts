/** Non-authoritative model fragments for compiler controls; no new permanent fixture identities. */
import {canonicalEncode,list,set,text,typedIdentifier,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {createGovernedContentDefinition,compileContentDefinition} from '../../substrate/contentManifest';
import {semanticReferentFromAuthoredContent,semanticReferentFromRuntimeEntity} from '../../substrate/referentOrigin';
import {campaign2Record as r,campaign2SchemaByType} from '../../campaign2/codecs';
import {compileValDeclarations} from '../../campaign2/valDeclarations';
import {contentRegistrySchemas} from '../../substrate/contentManifest';
import {record} from '../../substrate/canonicalEncoding';

export const modelId=(ns:number,payload:string)=>typedIdentifier(ns,text(payload));
export const fixtureContentId=modelId(20,'character/prj-control');
export const fixtureCharacter=semanticReferentFromAuthoredContent(fixtureContentId);
export const fixtureRuntime=semanticReferentFromRuntimeEntity(typedIdentifier(1122n,unsigned(9)));
export const fixtureObserver=modelId(1000,'observer/control');
export const fixtureVariable=modelId(1029,'variable/control');
export const fixtureCharacterRole=r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:modelId(1021,'validator/character-qualification')});
export function recordConstraint(type:number,field:number,role:CanonicalValue){
  return r('CanonicalRoleConstraint',{Position:r('CanonicalRolePosition',{VariantTag:unsigned(1),RecordTypeId:unsigned(type),FieldId:unsigned(field)}),Role:role});
}
export const namespaceRole=(ns:number)=>r('CanonicalIdentityRole',{RequiredNamespace:unsigned(ns)});
export const fixtureRoleConstraints=[
  recordConstraint(267,1,fixtureCharacterRole),recordConstraint(292,1,fixtureCharacterRole),
  recordConstraint(292,2,namespaceRole(1002)),recordConstraint(292,3,namespaceRole(1029)),
  recordConstraint(227,2,namespaceRole(1000)),
  r('CanonicalRoleConstraint',{Position:r('CanonicalRolePosition',{VariantTag:unsigned(2),RootStateTypeId:unsigned(268),FieldId:unsigned(1)}),Role:namespaceRole(1000)}),
];
export function fixtureContentInputs(stableId=fixtureContentId){
  const semanticKind=modelId(1004,'semantic-kind/character');
  const entry=(stable:CanonicalValue,kind:string,version:string,definition:CanonicalValue)=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([
    [1n,stable],[2n,modelId(1023,kind)],[3n,text(version)],[4n,definition],
  ]));
  const entries=canonicalEncode(set([
    entry(semanticKind,'registry/semantic-kind','content-kind/0.1-candidate',r('GovernedContentKindDefinition',{ContentSchema:record(campaign2SchemaByType(254n),new Map([[1n,unsigned(170)],[2n,unsigned(1)]]))})),
    entry(modelId(1021,'validator/character-qualification'),'registry/domain-validator','governed-domain-validator/0.1-candidate',r('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:semanticKind})),
  ]));
  const empty=list([]),definition=createGovernedContentDefinition({stableId,semanticKind,declaredInputs:empty,declaredOutputs:empty,preconditions:empty,worldEffects:empty,unitsDomainsBounds:empty,epistemicVisibility:empty,observationAffordances:empty,lifecycle:empty,referencedRegistryIds:[],referencedContentIds:[],validationInvariants:empty,sourceProvenance:empty,changeHistory:empty,formalSeamMappings:empty});
  const content=canonicalEncode(set([compileContentDefinition(definition).canonicalDefinition]));
  return {content,entries};
}
export async function fixtureContentContext(constraints:readonly CanonicalValue[]=fixtureRoleConstraints){
  const {content,entries}=fixtureContentInputs();
  return compileValDeclarations(entries,canonicalEncode(set(constraints))).compileContent(content,entries);
}
