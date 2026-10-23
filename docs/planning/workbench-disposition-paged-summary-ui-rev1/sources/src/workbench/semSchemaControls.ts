import * as r from '../semanticBinding/semanticSchemaRegistry';
import {compileRegistryManifest} from '../substrate/contentManifest';
import {bytesToHex,canonicalEncode,record,set,text,typedIdentifier,unsigned} from '../substrate/canonicalEncoding';
import {continuantDiagnostic as diagnostic} from './semContinuantControls';
import {digest} from './canonical';

export async function runSemSchemaControls(){
 const evidence=async(value:unknown)=>{const exact=diagnostic(value);return {encoding:'schema-component-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))};};
 const cases:{id:string;vector:string;evidence:Awaited<ReturnType<typeof evidence>>}[]=[];
 const add=async(id:string,vector:string,value:unknown)=>{cases.push({id,vector,evidence:await evidence(value)});};
 const guards:{id:string;vector:string;message:string;evidence:Awaited<ReturnType<typeof evidence>>}[]=[];
 const reject=async(id:string,vector:string,input:unknown,fn:()=>void)=>{let message:string|undefined;try{fn();}catch(e){message=e instanceof Error?e.message:String(e);}if(!message)throw Error('Expected rejection: '+id);guards.push({id,vector,message,evidence:await evidence(input)});};
 await add('record-allocation','CV-SEM-091',{version:r.SEMANTIC_SCHEMA_ALLOCATION_VERSION,schemas:r.SEMANTIC_RECORD_SCHEMAS});
 await add('field-contracts','CV-SEM-092',r.SEMANTIC_RECORD_SCHEMAS.map(s=>({name:s.name,typeId:s.typeId,fields:s.fields})));
 r.validateSemanticRegistryEntryKinds(r.SEMANTIC_UNION_VARIANT_ENTRIES);
 await add('typed-namespaces','CV-SEM-093',{typed:r.SEMANTIC_TYPED_ID_NAMESPACES,occurrence:r.SEMANTIC_OCCURRENCE_NAMESPACES,registryKind:r.UNION_VARIANT_REGISTRY_KIND,entries:r.SEMANTIC_UNION_VARIANT_ENTRIES});
 const unknown=[{...r.SEMANTIC_UNION_VARIANT_ENTRIES[0],registryKind:typedIdentifier(1023n,text('registry/unknown'))}];await reject('unknown-registry-kind','CV-SEM-093',unknown,()=>r.validateSemanticRegistryEntryKinds(unknown));
 const authored=typedIdentifier(r.SEMANTIC_TYPED_ID_NAMESPACES.SemanticReferentId,typedIdentifier(20n,text('person/glen'))),runtime=typedIdentifier(r.SEMANTIC_TYPED_ID_NAMESPACES.SemanticReferentId,typedIdentifier(21n,text('person/glen')));
 await add('finite-registries-and-origin','CV-SEM-094',{registries:r.SEMANTIC_FINITE_REGISTRIES,authored,runtime,authoredHex:bytesToHex(canonicalEncode(authored)),runtimeHex:bytesToHex(canonicalEncode(runtime))});
 for(const c of r.SEMANTIC_UNION_VARIANTS)r.validateSemanticUnionVariant(c.recordTypeId,c.variantTag,c.requiredPayloadFieldIds);
 await add('union-matrix','CV-SEM-095',{variants:r.SEMANTIC_UNION_VARIANTS,entries:r.SEMANTIC_UNION_VARIANT_ENTRIES});
 for(const [id,tag,fields] of [['missing-required',1n,[]],['forbidden-payload',1n,[2n,3n]],['unknown-variant',99n,[]]] as const)await reject(id,'CV-SEM-095',{recordTypeId:230n,variantTag:tag,payloadFields:fields},()=>r.validateSemanticUnionVariant(230n,tag,fields));
 const forward=await compileRegistryManifest(r.SEMANTIC_RECORD_SCHEMAS,r.SEMANTIC_UNION_VARIANT_ENTRIES),reverse=await compileRegistryManifest([...r.SEMANTIC_RECORD_SCHEMAS].reverse(),[...r.SEMANTIC_UNION_VARIANT_ENTRIES].reverse());
 const changed=[...r.SEMANTIC_UNION_VARIANT_ENTRIES],source=changed[0],unionSchema=r.SEMANTIC_RECORD_SCHEMAS.find(s=>s.typeId===259n)!;changed[0]={...source,definition:record(unionSchema,new Map([[1n,unsigned(223)],[2n,unsigned(1)],[3n,set([])],[4n,set([unsigned(2)])]]))};
 const changedManifest=await compileRegistryManifest(r.SEMANTIC_RECORD_SCHEMAS,changed),changedKind=[...r.SEMANTIC_UNION_VARIANT_ENTRIES];changedKind[0]={...changedKind[0],registryKind:typedIdentifier(1023n,text('registry/not-a-union-definition'))};const changedKindManifest=await compileRegistryManifest(r.SEMANTIC_RECORD_SCHEMAS,changedKind);
 const manifests=[['forward',forward],['reverse',reverse],['changed-payload-matrix',changedManifest],['changed-registry-kind',changedKindManifest]].map(([id,m])=>{const manifest=m as typeof forward;return {id:String(id),canonicalHex:bytesToHex(manifest.canonicalBytes),digest:bytesToHex(manifest.digest)};});
 await add('manifest-identity','CV-SEM-095',{changedEntry:changed[0],changedKindEntry:changedKind[0],manifests});
 return {version:'sem-schema-controls/0.1',contract:r.SEMANTIC_SCHEMA_ALLOCATION_VERSION,source:'src/test/semanticSchemaRegistry.test.ts',cases,guards,summary:{schemas:r.SEMANTIC_RECORD_SCHEMAS.length,variants:r.SEMANTIC_UNION_VARIANTS.length,typedNamespaces:Object.keys(r.SEMANTIC_TYPED_ID_NAMESPACES).length,occurrenceNamespaces:Object.keys(r.SEMANTIC_OCCURRENCE_NAMESPACES).length,canonicalOrderEqual:manifests[0].canonicalHex===manifests[1].canonicalHex,digestOrderEqual:manifests[0].digest===manifests[1].digest,matrixChangesIdentity:manifests[0].digest!==manifests[2].digest,kindChangesIdentity:manifests[0].digest!==manifests[3].digest},scope:'Original CV-SEM-091..095 registry recipes. Registry declarations, union validation and manifest compilation only; no lifecycle codec or state-persistence qualification. Changed manifests demonstrate identity sensitivity, not semantic admission of the changed entries. Original authored/runtime origin namespaces20/21 retained. Diagnostic JSON and exact canonical manifest bytes are researcher evidence, not character evidence.'};
}
