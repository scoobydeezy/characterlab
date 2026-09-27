/** Fixed PRJ required field projection. Raw events/payloads cannot enter the runtime method. */
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternCovers,patternMatches,patternsIntersect,type StatePath,type ActualReadRecord,type ProjectionBinding} from '../substrate/state';
import {SchedulerContractError} from '../substrate/scheduler';
import {campaign2SchemaByType as baseSchema,decodeCampaign2 as baseDecode} from './codecs';
import {decodeEmbodied,embodiedSchema} from '../campaign3/embodiedCodecs';
import {embodiedAdmittedInputFacts,type EmbodiedAdmittedInput} from '../campaign3/embodiedAdmission';
import {decodeReceiving,receivingSchema} from '../campaign3/receivingCodecs';
import {receivingAdmittedInputFacts,type ReceivingAdmittedInput} from '../campaign3/receivingAdmission';
import {admittedInputFacts,type AdmittedTransitionInput} from './admittedInput';
import {decodeStatePattern,type compileCampaign2StateModel} from './stateModel';
import {identityRolesCompatible} from './identityRoles';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataItems as items,dataKey as key,invalidModel} from './canonicalData';
import type {compileValDeclarations} from './valDeclarations';
type Content=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
type StateModel=ReturnType<typeof compileCampaign2StateModel>;
const roster={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard' as const,selectorKind:'mapKey' as const}]};
export function compileRequiredProjections(registrationBytes:Uint8Array,requirementBytes:Uint8Array,
  staticBindings:readonly ProjectionBinding[],stateModel:StateModel,content:Content){
  return compileProjection('base',registrationBytes,requirementBytes,staticBindings,stateModel,content);
}
/** EMB's separately admitted layouts use the same PRJ/IDN role/path/read semantics. */
export function compileEmbodiedRequiredProjections(registrationBytes:Uint8Array,requirementBytes:Uint8Array,
  staticBindings:readonly ProjectionBinding[],stateModel:StateModel,content:Content){
  return compileProjection('embodied',registrationBytes,requirementBytes,staticBindings,stateModel,content);
}
/** Receiving workspace retains the same PRJ/IDN algorithm under its actual515 layout. */
export function compileReceivingRequiredProjections(registrationBytes:Uint8Array,requirementBytes:Uint8Array,
  staticBindings:readonly ProjectionBinding[],stateModel:StateModel,content:Content){
  return compileProjection('receiving',registrationBytes,requirementBytes,staticBindings,stateModel,content);
}
function compileProjection(mode:'base'|'embodied'|'receiving',registrationBytes:Uint8Array,requirementBytes:Uint8Array,
  staticBindings:readonly ProjectionBinding[],stateModel:StateModel,content:Content){
  const embodied=mode==='embodied',receiving=mode==='receiving';
  const decodeCampaign2=receiving?decodeReceiving:embodied?decodeEmbodied:baseDecode,campaign2SchemaByType=receiving?receivingSchema:embodied?embodiedSchema:baseSchema;
  const registration=decodeCampaign2(registrationBytes);
  if(typeof registration==='boolean'||registration.kind!=='record'||!(receiving?[515n]:embodied?[465n,469n,470n]:[272n,318n]).includes(registration.schema.typeId))invalidModel('projection requires admitted transition registration');
  const r=registration as Extract<CanonicalValue,{kind:'record'}>,version=r.schema.typeId===272n?271n:319n;
  if(receiving&&(u(f(r,1n))!==1n||key(f(r,9n))!==key(decodeCampaign2(requirementBytes))))invalidModel('receiving PRJ requires exact workspace requirements');
  const definition=receiving?r:rec(f(r,3n),embodied?(r.schema.typeId===465n?466n:r.schema.typeId===469n?471n:472n):version);
  const schema=receiving?rec(f(r,6n),254n):r.schema.typeId===465n?rec(f(definition,1n),254n):rec(f(rec(f(definition,1n),embodied?(r.schema.typeId===469n?473n:474n):version===271n?274n:320n),1n),254n);
  const inputSchema=campaign2SchemaByType(u(f(schema,1n))),readDomain=items(f(definition,receiving?7n:2n),'set').map(decodeStatePattern);
  const accessors=new Set<string>();
  for(const binding of staticBindings){
    if(binding.accessorId.namespaceId!==1028n||accessors.has(key(binding.accessorId)))invalidModel('invalid/duplicate static projection accessor');
    accessors.add(key(binding.accessorId));
    const paths=binding.kind==='direct'?[binding.path]:[binding.projectionPath,...binding.sourcePaths];
    for(const path of paths){
      if(patternMatches(roster,path))invalidModel('IDN forbids static/legacy derived roster access');
      stateModel.validatePath(path);
      if(!readDomain.some(p=>patternMatches(p,path)))invalidModel('static binding outside ReadDomain');
    }
  }
  let rosterCount=0;
  const requirements=items(decodeCampaign2(requirementBytes),'set').map(value=>{
    const q=rec(value,266n),sourceId=u(f(q,1n)),template=decodeStatePattern(f(q,2n)),projectedId=u(f(q,3n)),role=canonicalEncode(f(q,4n)),accessor=id(f(q,5n));
    if(accessor.namespaceId!==1028n||accessors.has(key(accessor)))invalidModel('invalid/duplicate projection accessor');accessors.add(key(accessor));
    const wildcards=template.selectors.filter(s=>s.kind==='wildcard');
    if(wildcards.length!==1||wildcards[0].selectorKind!=='mapKey')invalidModel('required projection needs exactly one map-key wildcard');
    const family=stateModel.family(canonicalEncode(f(q,2n)));
    if(!family||family.keyGrammar?.tag!==1n||family.grammar.kind!=='canonical-record')invalidModel('projection needs declared identity-key/record-value family');
    if(!readDomain.some(p=>patternCovers(p,template)))invalidModel('required projection outside ReadDomain');
    const source=inputSchema.fields.find(x=>x.id===sourceId),targetSchema=campaign2SchemaByType(family.grammar.recordTypeId),target=targetSchema.fields.find(x=>x.id===projectedId);
    if(!source?.required||!target?.required)invalidModel('projection fields must be required');
    const sourceRole=content.recordRole(inputSchema.typeId,sourceId),keyRole=content.mapKeyRole(template.rootStateTypeId,template.fieldId),targetRole=content.recordRole(targetSchema.typeId,projectedId);
    if(!sourceRole||!keyRole||!targetRole||!identityRolesCompatible(sourceRole,keyRole)||!identityRolesCompatible(targetRole,role))invalidModel('incompatible projection roles');
    if(patternsIntersect(template,roster)){
      rosterCount++;
      const outputRole=rec(decodeCampaign2(role),263n),validator=f(outputRole,2n);
      if(source.name!=='ObserverId'||template.rootStateTypeId!==268n||template.fieldId!==1n||template.selectors.length!==1||projectedId!==1n
        ||u(f(outputRole,1n))!==1002n||key(validator)!==key({kind:'typedIdentifier',namespaceId:1021n,payload:{kind:'text',value:'validator/character-qualification'}})
        ||key(accessor)!==key({kind:'typedIdentifier',namespaceId:1028n,payload:{kind:'text',value:'ResolvedCharacterSubject'}}))invalidModel('not the exact IDN subject requirement');
    }
    return {sourceId,template,projectedId,role,accessor};
  });
  const rosterReadable=readDomain.some(p=>patternsIntersect(p,roster));
  if(rosterCount!==(rosterReadable?1:0))invalidModel('IDN roster ReadDomain requires exactly one subject projection');
  const registrationKey=key(registration);
  return Object.freeze({
    construct(admitted:AdmittedTransitionInput|EmbodiedAdmittedInput|ReceivingAdmittedInput,state:AuthoritativeState){
      const input=receiving?receivingAdmittedInputFacts(admitted as ReceivingAdmittedInput):embodied?embodiedAdmittedInputFacts(admitted as EmbodiedAdmittedInput):admittedInputFacts(admitted as AdmittedTransitionInput); // Strictly first, before selector/state operations.
      if(key(decodeCampaign2(input.registration))!==registrationKey)throw new SchedulerContractError('INPUT_NOT_ADMITTED','admitted input belongs to another projection contract');
      const payload=rec(input.payload,inputSchema.typeId),values=new Map<string,CanonicalValue>(),reads:ActualReadRecord[]=[];
      for(const q of requirements){
        const selector=f(payload,q.sourceId),path:StatePath={rootStateTypeId:q.template.rootStateTypeId,fieldId:q.template.fieldId,selectors:q.template.selectors.map(s=>s.kind==='exact'?structuredClone(s.selector):{kind:'mapKey',key:selector})};
        const source=stateModel.read(state,path);
        if(!source.presence)throw new StateContractError('REQUIRED_PROJECTION_VALUE_ABSENT','required projection source is absent');
        const sourceValue=source.value!;
        if(typeof sourceValue==='boolean'||sourceValue.kind!=='record')throw new StateContractError('INVALID_VALUE','required projection source is not record');
        const value=f(sourceValue,q.projectedId);content.validateRole(canonicalEncode(value),q.role);
        values.set(key(q.accessor),value);
        reads.push({accessorId:q.accessor,path,presence:true,value,derivedSources:[source],transformationId:q.accessor});
      }
      // The source state, wrappers and paths remain absent from transition capabilities.
      return Object.freeze({
        projection:Object.freeze({read(accessor:CanonicalValue):CanonicalValue {
          const value=values.get(key(accessor));if(value===undefined)throw new StateContractError('UNKNOWN_ACCESSOR','undeclared projected accessor');return decodeCampaign2(canonicalEncode(value));
        }}),
        actualReadRecords():readonly ActualReadRecord[] {return structuredClone(reads);},
      });
    },
  });
}
