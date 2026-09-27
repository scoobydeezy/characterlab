import {schemas,probeRecord,decodeProbeReview} from './probeCodecs';
export {probeSupportedSchemas,probeCanonicalRecord,decodeProbeReview} from './probeCodecs';
/** Review construction only: accepted probe packaging. No run factory or scheduler activation. */
import allocation from '../../docs/formal/REGULATORY_PROBE_ALLOCATION_TABLE.json';
import {canonicalDecode,canonicalEncode,RecordSchemaRegistry,record,list,set,text,unsigned,typedIdentifier,type CanonicalValue,type RecordSchema} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {campaign2SupportedSchemas,campaign2SchemaByType,campaign2Record,decodeCampaign2} from './codecs';
import {firstTraceModel} from './firstTraceModel';
import {recordRole} from './firstModelCandidate';
import {compileBoundedModelDeclarations,BOUNDED_SEMANTIC_BUNDLE} from './modelPackaging';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel} from './canonicalData';

export const PROBE_RULES='rules/campaign2-regulatory-probe/0.1-candidate';
export const PROBE_REGISTRY='campaign2-probe-registry/0.1-candidate';
export const PROBE_VERSION='regulatory-diagnostic-probe/0.1-candidate';
export const PROBE_PROFILES=Object.freeze({orderedInput:'campaign2-probe-ordered-input/0.1-candidate',persistence:'campaign2-probe-persistence/0.1-candidate',trace:'campaign2-probe-trace-binding/0.1-candidate'});
export const PROBE_BUNDLE=Object.freeze([...BOUNDED_SEMANTIC_BUNDLE,'trace/0.2-candidate','campaign2-trace-binding/0.1-candidate',PROBE_VERSION,PROBE_PROFILES.trace]);
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s));
function entry(stable:CanonicalValue,kind:string,version:string,definition:CanonicalValue){return record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,stable],[2n,id(1023,kind)],[3n,text(version)],[4n,definition]]));}
export function probeProfiles(rules:string,registryVersion:string,profiles:typeof PROBE_PROFILES=PROBE_PROFILES){
 if(rules!==PROBE_RULES||registryVersion!==PROBE_REGISTRY||Object.keys(profiles).sort().join()!==Object.keys(PROBE_PROFILES).sort().join()
  ||Object.entries(PROBE_PROFILES).some(([k,v])=>profiles[k as keyof typeof profiles]!==v))invalidModel('probe requires exact whole-profile bindings');
 return Object.freeze({...PROBE_PROFILES});
}
export function probeModelReviewSource(available=true,permitted=true){
 if(typeof available!=='boolean'||typeof permitted!=='boolean')invalidModel('probe permissions require booleans');
 const base=firstTraceModel(),slots=items(decodeCampaign2(base.registry),'list');
 return build(base,slots,available,permitted);
}
function build(base:ReturnType<typeof firstTraceModel>,slots:readonly CanonicalValue[],available:boolean,permitted:boolean){
 const carrier=items(slots[0],'set');
 const bridge=carrier.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).find(v=>key(f(rec(v,171n),1n))===key(id(1027,'definition/authored-fact-consequence-bridge')))!;
 const channelMap=f(rec(f(rec(bridge,171n),4n),309n),1n);
 if(typeof channelMap==='boolean'||channelMap.kind!=='map')invalidModel('missing base channel');
 const oldChannel=rec(channelMap.entries[0][1],201n),character=f(oldChannel,3n),observer=f(oldChannel,2n);
 const descriptors=schemas.map(s=>record(contentRegistrySchemas.recordSchemaDescriptor,new Map([[1n,unsigned(s.typeId)],[2n,unsigned(1)],[3n,text(s.name)],[4n,list(s.fields.map(f=>record(contentRegistrySchemas.recordFieldDescriptor,new Map([[1n,unsigned(f.id)],[2n,text(f.name)],[3n,f.required]]))))]])));
 const unions=allocation.unionVariantEntries.map(e=>entry(typedIdentifier(1024,list(e.stableId.payload.items.map(v=>unsigned(v.value)))),e.registryKind.payload,e.definitionVersion,
  record(campaign2SchemaByType(259n),new Map(e.definition.fields.map(v=>[BigInt(v.id),v.kind==='unsigned'?unsigned(v.value!):set(v.values!.map(unsigned))])))));
 const channel=probeRecord(332,[id(1005,'channel/regulatory-diagnostic-probe'),observer,character,id(1006,'modality/diagnostic-regulatory-probe'),id(1039,'unit/diagnostic-regulatory-level')]);
 const definition=entry(id(1027,'definition/regulatory-diagnostic-probe'),'registry/regulatory-diagnostic-probe',PROBE_VERSION,probeRecord(331,[character,id(1029,'variable/fixture-regulation'),channel,available,permitted]));
 const roles=allocation.roles.map(r=>recordRole(r.recordTypeId,r.fieldId,campaign2Record('CanonicalIdentityRole',{RequiredNamespace:unsigned(r.requiredNamespace),...('domainValidatorId' in r?{DomainValidatorId:id(1021,r.domainValidatorId!)}:{})})));
 return {...base,rulesVersion:PROBE_RULES,registrySchemaVersion:PROBE_REGISTRY,registry:canonicalEncode(list([set([...carrier,...descriptors,...unions,definition]),...slots.slice(1,5),set([...items(slots[5],'set'),...roles])]))};
}
/** Exact first-specimen language, with only the two committed control booleans varying. */
export async function compileProbeModelReview(source:Parameters<typeof compileBoundedModelDeclarations>[0]){
 const snapshot={...source,content:source.content.slice(),parameters:source.parameters.slice(),registry:source.registry.slice()};
 const profiles=probeProfiles(snapshot.rulesVersion,snapshot.registrySchemaVersion);
 const slots=items(decodeProbeReview(snapshot.registry),'list');if(slots.length!==6)invalidModel('probe registry requires positions 0..5');
 const definitions=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(id(1027,'definition/regulatory-diagnostic-probe')));
 if(definitions.length!==1)invalidModel('probe requires one definition');
 const d=rec(f(rec(definitions[0],171n),4n),331n),a=f(d,4n),p=f(d,5n);
 if(typeof a!=='boolean'||typeof p!=='boolean')invalidModel('probe permission grammar');
 const expected=probeModelReviewSource(a,p);
 for(const field of Object.keys(expected) as (keyof typeof expected)[]){
  const x=snapshot[field],y=expected[field];
  if(typeof y==='string'?x!==y:key(decodeProbeReview(x as Uint8Array))!==key(decodeProbeReview(y)))invalidModel('probe specimen mismatch: '+field);
 }
 // Validate all inherited declarations through their unchanged compiler, not through probe fallback.
 await compileBoundedModelDeclarations(firstTraceModel());
 const modelIdentity=await createModelIdentity({...snapshot,contentManifest:await commitManifest(decodeProbeReview(snapshot.content)),parameterSet:await commitManifest(decodeProbeReview(snapshot.parameters)),registryManifest:await commitManifest(decodeProbeReview(snapshot.registry))});
 return {source:snapshot,modelIdentity,profiles,semanticBundle:PROBE_BUNDLE};
}
