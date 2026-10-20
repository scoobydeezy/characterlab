import {compileMeasurementModel} from './measurementModel';
import {measurementEvidenceModelSource} from './measurementModelSource';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import type {TypedIdentifierValue} from '../substrate/canonicalEncoding';
/** Exact frozen memory-model admission; no caller-selected semantics or packet import. */
import {canonicalEncode,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {compileValDeclarations} from './valDeclarations';
import {compileCampaign2StateModel} from './stateModel';
import {memoryModelSource,memoryWrapperDeclarations,MEMORY_RULES,MEMORY_REGISTRY,MEMORY_PROFILES,MEMORY_BUNDLE,MEMORY_VERSION,MEMORY_RECALL_ABLATION} from './memoryModelSource';
import {decodeMemory,memorySupportedSchemas} from './memoryCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as ident,dataText as txt,dataKey as key,invalidModel} from './canonicalData';
import type {Campaign2ModelSource} from './factory';
const sourceFields=['rulesVersion','contentSchemaVersion','registrySchemaVersion','parameterSchemaVersion','numericProfileVersion','randomAlgorithmVersion','content','registry','parameters'] as const;
export function snapshotMemorySource(input:Campaign2ModelSource):Campaign2ModelSource {
 if(!input||typeof input!=='object'||Object.getPrototypeOf(input)!==Object.prototype)invalidModel('plain memory source required');
 const ds=Object.getOwnPropertyDescriptors(input);
 if(Reflect.ownKeys(ds).length!==sourceFields.length||sourceFields.some(k=>!Object.hasOwn(ds,k)))invalidModel('unknown/missing memory source field');
 const result:Record<string,string|Uint8Array>={};
 for(const k of sourceFields){const d=ds[k];if(!('value'in d))invalidModel('source accessor forbidden');const v:unknown=d.value;
  if(['content','registry','parameters'].includes(k)){
   if(!(v instanceof Uint8Array)||Object.getPrototypeOf(v)!==Uint8Array.prototype||Reflect.ownKeys(v).some(x=>typeof x!=='string'||!/^(0|[1-9][0-9]*)$/.test(x)))invalidModel('plain bytes required');
   const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(v),copy=new Uint8Array(length);Uint8Array.prototype.set.call(copy,v);result[k]=copy;
  }else{if(typeof v!=='string')invalidModel('explicit version required');result[k]=v;}
 }
 return result as unknown as Campaign2ModelSource;
}
export async function compileMemoryModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);
 if(source.rulesVersion!==MEMORY_RULES||source.registrySchemaVersion!==MEMORY_REGISTRY)invalidModel('exact memory profile required');
 const slots=items(decodeMemory(source.registry),'list');if(slots.length!==6)invalidModel('six slots required');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const find=(name:string)=>{const vs=rows.filter(v=>key(f(rec(v,171n),1n))===key({kind:'typedIdentifier',namespaceId:BigInt(name.startsWith('definition/')?1027:1009),payload:{kind:'text',value:name}}));if(vs.length!==1)invalidModel('required memory row '+name);return rec(vs[0],171n);};
 const probe=rec(f(find('definition/regulatory-diagnostic-probe'),4n),331n),a=f(probe,4n),p=f(probe,5n);if(typeof a!=='boolean'||typeof p!=='boolean')invalidModel('probe booleans required');
 const fw=f(find('MemoryFormationTransition'),4n),rw=rec(f(find('MeasurementRecallTransition'),4n),358n);
 if(typeof fw==='boolean'||fw.kind!=='record'||![356n,357n].includes(fw.schema.typeId))invalidModel('formation wrapper required');
 const recallVersion=txt(f(rec(f(rw,1n),353n),2n));if(![MEMORY_VERSION,MEMORY_RECALL_ABLATION].includes(recallVersion))invalidModel('recall version');
 const w=memoryWrapperDeclarations(),F=fw.schema.typeId===357n,R=recallVersion===MEMORY_VERSION;
 const all=memorySupportedSchemas(),codec={decode:decodeMemory,schema:(type:bigint)=>{const s=all.find(s=>s.typeId===type);if(!s)invalidModel('unknown memory schema');return s;}};
 const val=rows.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(txt(ident(f(rec(v,171n),2n)).payload)));
 // VAL stages 2/3 precede DomainValidator/role closure (stage 4), including
 // on malformed specimens. Use the same closed CONTENT interpreter with only
 // kind declarations; no role predicate or runtime authority is introduced.
 const kinds=val.filter(v=>txt(ident(f(rec(v,171n),2n)).payload)==='registry/semantic-kind');
 await compileValDeclarations(canonicalEncode(set(kinds)),canonicalEncode(set([])),codec)
  .compileContent(source.content,canonicalEncode(slots[0]));
 // Declared-but-unexercised roles are checked before exact specimen narrowing.
 // The latter still precedes ModelIdentity creation and runtime publication.
 const declarations=compileValDeclarations(canonicalEncode(set(val)),source.registry,codec);
 const expected=memoryModelSource(a,p,F?w.formation:w.formationAblated,R?w.recall:w.recallAblated);
 for(const k of sourceFields){const x=source[k],y=expected[k];if(typeof y==='string'?x!==y:key(decodeMemory(x as Uint8Array))!==key(decodeMemory(y)))invalidModel('memory source differs from frozen declarations: '+k);}
 const content=await declarations.compileContent(source.content,canonicalEncode(slots[0]));
 content.validateRecordRoles(source.registry);
 const structuralState=compileCampaign2StateModel(canonicalEncode(slots[2]),canonicalEncode(slots[3]),canonicalEncode(slots[4]),content,codec);
 const base=await compileMeasurementModel(measurementEvidenceModelSource(a,p));
 function episodeValue(path:StatePath,value:CanonicalValue){
  if(path.rootStateTypeId!==346n)return;
  const selector=path.selectors[0];if(selector?.kind!=='mapKey')invalidModel('episode key required');
  const k=rec(selector.key,344n),episode=rec(value,345n),evidence=rec(f(episode,1n),342n),source=rec(f(evidence,2n),337n);
  if(key(f(k,2n))!==key(f(source,1n))||txt(f(evidence,3n))!==MEMORY_VERSION)invalidModel('episode evidence/key relation');
  base.measurement.validateOutput(source);
 }
 const validateState=(state:AuthoritativeState)=>{structuralState.validateState(state);for(const e of state.entries())episodeValue(e.path,e.value);};
 const stateModel=Object.freeze({...structuralState,validateState,restoreState(bytes:Uint8Array){const state=structuralState.restoreState(bytes);validateState(state);return state;},read(state:AuthoritativeState,path:StatePath){const value=structuralState.read(state,path);if(value.presence)episodeValue(path,value.value!);return value;},applyPatch(state:AuthoritativeState,patch:StatePatch,authority:TypedIdentifierValue){const result=structuralState.applyPatch(state,patch,authority);validateState(result.state);return result;}});
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(decodeMemory(source.content)),parameterSet:await commitManifest(decodeMemory(source.parameters)),registryManifest:await commitManifest(decodeMemory(source.registry))});
 return Object.freeze({source,modelIdentity,content,stateModel,base,profiles:MEMORY_PROFILES,semanticBundle:MEMORY_BUNDLE,formationEnabled:F,recallEnabled:R});
}
