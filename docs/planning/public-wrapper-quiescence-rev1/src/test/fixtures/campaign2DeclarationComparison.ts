/** Finite, construction-labelled VAL corpus; expected labels do not traverse production declarations. */
import {canonicalEncode as enc,list,set,map,record,unsigned,text,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {compileValDeclarations} from '../../campaign2/valDeclarations';
import {campaign2Record as r,campaign2Schema,decodeCampaign2} from '../../campaign2/codecs';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent,semanticReferentFromRuntimeEntity} from '../../substrate/referentOrigin';
const identifier=(ns:number,name:string)=>typedIdentifier(ns,text(name));
const validator=identifier(1021,'validator/character-qualification');
const wrappers=[
 {name:'root',visited:true,wrap:(v:CanonicalValue)=>v},
 {name:'list',visited:true,wrap:(v:CanonicalValue)=>list([v])},
 {name:'set',visited:true,wrap:(v:CanonicalValue)=>set([v])},
 {name:'map-key',visited:true,wrap:(v:CanonicalValue)=>map([[v,true]])},
 {name:'map-value',visited:true,wrap:(v:CanonicalValue)=>map([[true,v]])},
 {name:'record-field',visited:true,wrap:(v:CanonicalValue)=>record(campaign2Schema('SemanticRegistryEntry'),new Map([[1n,identifier(20,'wrapper')],[2n,identifier(1023,'wrapper')],[3n,text('fixture')],[4n,v]]))},
 {name:'typed-payload',visited:false,wrap:(v:CanonicalValue)=>typedIdentifier(20,v)},
];
const constraint=(role:CanonicalValue)=>r('CanonicalRoleConstraint',{Position:r('CanonicalRolePosition',{VariantTag:unsigned(1),RecordTypeId:unsigned(267),FieldId:unsigned(1)}),Role:role});
export async function compareDeclarationCoverage(){
 const source=firstTraceModel(),registry=items(decodeCampaign2(source.registry),'list')[0],entries=items(registry,'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const kindEntry=entries.find(v=>txt(id(f(rec(v,171n),2n)).payload)==='registry/semantic-kind')!,validatorEntry=entries.find(v=>txt(id(f(rec(v,171n),2n)).payload)==='registry/domain-validator')!;
 const contexts=[{name:'empty',kind:false,validator:false,entries:[]},{name:'kind',kind:true,validator:false,entries:[kindEntry]},
  {name:'validator',kind:false,validator:true,entries:[validatorEntry]},{name:'both',kind:true,validator:true,entries:[kindEntry,validatorEntry]}];
 const roles=[{name:'qualified',qualified:true,valid:true,value:r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:validator})},
  {name:'namespace-only',qualified:false,valid:true,value:r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002)})},
  {name:'wrong-namespace',qualified:true,valid:false,value:r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1000),DomainValidatorId:validator})},
  {name:'unknown-validator',qualified:true,valid:false,value:r('CanonicalIdentityRole',{RequiredNamespace:unsigned(1002),DomainValidatorId:identifier(1021,'validator/unknown')})}];
 const positions=[{name:'constraint',make:constraint},
  {name:'projection',make:(role:CanonicalValue)=>r('EventDependentProjectedFieldRequirement',{SelectorSourceFieldId:unsigned(2),TargetStatePathTemplate:record(campaign2Schema('StatePathPattern'),new Map([[1n,unsigned(268)],[2n,unsigned(1)],[3n,list([])]])),ProjectedFieldId:unsigned(1),OutputRole:role,OutputAccessor:identifier(1028,'ResolvedCharacterSubject')})},
  {name:'occurrence',make:(role:CanonicalValue)=>r('OccurrenceIdentityRule',{IdentityFieldId:unsigned(1),IdentityRole:role})}];
 const cases=[];
 for(const context of contexts)for(const role of roles)for(const position of positions)for(const wrapper of wrappers){
  const reference=wrapper.visited&&role.qualified;
  const valid=(!wrapper.visited||role.valid)&&reference===context.validator&&(!context.validator||context.kind);
  let actual='ACCEPT';try{compileValDeclarations(enc(set(context.entries)),enc(wrapper.wrap(position.make(role.value))));}catch(e){actual=(e as {code?:string}).code??(e as Error).name;}
  const expected=valid?'ACCEPT':'INVALID_CONFIGURATION';cases.push({name:`declaration/${context.name}/${role.name}/${position.name}/${wrapper.name}`,expected,actual,agrees:expected===actual});
 }
 const qualified=roles[0].value,allEntries=enc(set([kindEntry,validatorEntry]));
 for(const [name,declarations,expected] of [
  ['shared-three-positions',list(positions.map(p=>p.make(qualified))),'ACCEPT'],
  ['duplicate-position',list([constraint(qualified),constraint(qualified)]),'INVALID_CONFIGURATION'],
 ] as const){let actual='ACCEPT';try{compileValDeclarations(allEntries,enc(declarations));}catch(e){actual=(e as {code?:string}).code??(e as Error).name;}cases.push({name,expected,actual,agrees:expected===actual});}
 const compiled=await compileValDeclarations(allEntries,enc(list(positions.map(p=>p.make(qualified))))).compileContent(source.content,enc(registry));
 const stable=f(rec(items(decodeCampaign2(source.content),'set')[0],170n),1n);
 const identities=[{name:'authored',valid:true,value:semanticReferentFromAuthoredContent(id(stable))},
  {name:'runtime',valid:false,value:semanticReferentFromRuntimeEntity(typedIdentifier(1122,unsigned(1)))},
  {name:'observer',valid:false,value:identifier(1000,'observer/test')}];
 for(const identity of identities)for(const wrapper of wrappers){
  const expected=identity.valid||!wrapper.visited?'ACCEPT':'CANONICAL_ROLE_VIOLATION';let actual='ACCEPT';
  try{compiled.validateRecordRoles(enc(wrapper.wrap(r('CharacterObserverBindingValue',{CharacterId:identity.value}))));}catch(e){actual=(e as {code?:string}).code??(e as Error).name;}
  cases.push({name:`record/${identity.name}/${wrapper.name}`,expected,actual,agrees:expected===actual});
 }
 return cases;
}



