/** Shared transition-admission/0.4-candidate occurrence lookup, reused unchanged by V06.
 * Looks up an existing required identity field; never allocates or proves freshness.
 */
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {campaign2SchemaByType,decodeCampaign2} from './codecs';
import {dataRecord as rec,dataField as f,dataUnsigned as u,invalidModel} from './canonicalData';
import {identityRolesCompatible} from './identityRoles';
import type {compileValDeclarations} from './valDeclarations';
type Content=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
export function compileOccurrenceIdentities(mapBytes:Uint8Array,content:Content,codec={decode:decodeCampaign2,schema:campaign2SchemaByType}){
  const value=codec.decode(mapBytes);
  if(typeof value==='boolean'||value.kind!=='map')return invalidModel('occurrence rules require canonical map');
  const rules=new Map<string,{fieldId:bigint;role:Uint8Array}>();
  for(const [schemaValue,ruleValue] of value.entries){
    const schemaRef=rec(schemaValue,254n),typeId=u(f(schemaRef,1n)),version=u(f(schemaRef,2n));
    const schema=codec.schema(typeId);
    if(schema.schemaVersion!==version)invalidModel('unadmitted occurrence schema version');
    const rule=rec(ruleValue,278n),fieldId=u(f(rule,1n)),field=schema.fields.find(x=>x.id===fieldId);
    if(!field?.required)invalidModel('occurrence identity must be one required top-level field');
    const role=canonicalEncode(f(rule,2n)),stored=content.recordRole(typeId,fieldId);
    if(!stored||!identityRolesCompatible(stored,role))invalidModel('missing or incompatible occurrence-field role');
    // Role validation also checks that the optional domain validator is actually declared.
    rules.set(`${typeId}/${version}`,{fieldId,role});
  }
  return Object.freeze({
    has(typeId:bigint,version:bigint):boolean {return rules.has(`${typeId}/${version}`);},
    extract(bytes:Uint8Array):CanonicalValue {
      const value=codec.decode(bytes);
      if(typeof value==='boolean'||value.kind!=='record')return invalidModel('occurrence payload requires record');
      const rule=rules.get(`${value.schema.typeId}/${value.schema.schemaVersion}`);
      if(!rule)return invalidModel('missing occurrence identity rule');
      const identity=f(value,rule.fieldId);
      content.validateRole(canonicalEncode(identity),rule.role);
      return codec.decode(canonicalEncode(identity));
    },
    schemaKeys():readonly string[] {return [...rules.keys()];},
  });
}
