/** Fixed PRJ required field projection. Raw events/payloads cannot enter the runtime method. */
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateContractError,patternCovers,patternMatches,patternsIntersect,type StatePath,type ActualReadRecord,type ProjectionBinding} from '../substrate/state';
import {SchedulerContractError} from '../substrate/scheduler';
import {campaign2SchemaByType,decodeCampaign2} from './codecs';
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
  const registration=decodeCampaign2(registrationBytes);
  if(typeof registration==='boolean'||registration.kind!=='record'||![272n,318n].includes(registration.schema.typeId))invalidModel('projection requires admitted transition registration');
  const r=registration as Extract<CanonicalValue,{kind:'record'}>,version=r.schema.typeId===272n?271n:319n;
  const definition=rec(f(r,3n),version),admission=rec(f(definition,1n),version===271n?274n:320n),schema=rec(f(admission,1n),254n);
  const inputSchema=campaign2SchemaByType(u(f(schema,1n))),readDomain=items(f(definition,2n),'set').map(decodeStatePattern);
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
    construct(admitted:AdmittedTransitionInput,state:AuthoritativeState){
      const input=admittedInputFacts(admitted); // Strictly first: no payload selection or state operation before admission.
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
