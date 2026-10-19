import {validateSemanticReferent,validateReferentOrigin} from '../substrate/referentOrigin';
import {GOVERNED_CONTENT_DEFINITION_NAMESPACE,validateGovernedContentDefinitionId} from '../substrate/contentDefinitionId';
/** Canonical construction over campaign2-allocation/0.2-candidate and val-allocation/0.1-candidate.
 * Structural codecs only: owning contracts separately admit roles, definitions and transitions.
 */
import allocation from '../../docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json';
import valAllocation from '../../docs/formal/VAL_ALLOCATION_TABLE.json';
import {
  canonicalDecode, canonicalEncode, record, typedIdentifier, text, unsigned, list, set,
  RecordSchemaRegistry, type CanonicalValue, type RecordSchema, type TypedIdentifierValue,
} from '../substrate/canonicalEncoding';
import { identitySchemas } from '../substrate/identity';
import { randomSchemas } from '../substrate/random';
import { timeSchemas } from '../substrate/time';
import { schedulerSchemas } from '../substrate/scheduler';
import { persistenceSchemas } from '../substrate/persistence';
import { stateSchemas } from '../substrate/state';
import { traceSchemas } from '../substrate/trace';
import { mutationAuthoritySchemas } from '../substrate/mutationAuthority';
import { contentRegistrySchemas, governedContentRecordSchema, type SemanticRegistryEntry } from '../substrate/contentManifest';
import { observationSchemas,validatePermittedEvidenceRecordClosure } from '../observation/observation';
import { SEMANTIC_RECORD_SCHEMAS, SEMANTIC_TYPED_ID_NAMESPACES } from '../semanticBinding/semanticSchemaRegistry';

export class Campaign2CodecError extends Error {
  constructor(message: string) { super(message); this.name = 'Campaign2CodecError'; }
}
function fail(message: string): never { throw new Campaign2CodecError(message); }
const definitions = structuredClone([...allocation.records, ...valAllocation.records]);
const variants = structuredClone(allocation.unionVariants);
const finiteValues = structuredClone(allocation.finiteValues);
const newSchemas: readonly RecordSchema[] = Object.freeze(definitions.map(r => Object.freeze({
  typeId: BigInt(r.typeId), schemaVersion: BigInt(r.schemaVersion), name: r.name,
  fields: Object.freeze(r.fields.map(f => Object.freeze({id: BigInt(f.id), name: f.name, required: f.required}))),
})));
// Copy schema metadata; do not expose a mutable registry or rely on mutable imported schemas.
const byId = new Map<bigint, RecordSchema>();
for (const s of [
  ...Object.values(identitySchemas), ...Object.values(randomSchemas), ...Object.values(timeSchemas),
  ...Object.values(schedulerSchemas), ...Object.values(persistenceSchemas), ...Object.values(stateSchemas),
  ...Object.values(traceSchemas), ...Object.values(mutationAuthoritySchemas),
  ...Object.values(contentRegistrySchemas), governedContentRecordSchema,
  ...Object.values(observationSchemas), ...SEMANTIC_RECORD_SCHEMAS, ...newSchemas,
]) {
  const copy = Object.freeze({...s, fields: Object.freeze(s.fields.map(f=>Object.freeze({...f})))});
  const previous=byId.get(s.typeId);
  if (previous && JSON.stringify(previous, (_,v)=>typeof v==='bigint'?String(v):v)
    !== JSON.stringify(copy, (_,v)=>typeof v==='bigint'?String(v):v)) fail(`schema collision ${s.typeId}`);
  byId.set(s.typeId,copy);
}
const byName = new Map([...byId.values()].map(s=>[s.name,s]));
const registry = new RecordSchemaRegistry([...byId.values()]);
const namespaces = new Map<string, bigint>([
  ...Object.entries(SEMANTIC_TYPED_ID_NAMESPACES).map(([n,id])=>[n,id] as [string,bigint]),
  ...allocation.namespaces.map(n=>[n.name,BigInt(n.namespace)] as [string,bigint]),
  ['CharacterId',1002n],['ExposureReferentId',1002n],['MutationAuthorityId',1025n],
]);

export function campaign2Schema(name: string): RecordSchema {
  return byName.get(name) ?? fail(`unknown schema ${name}`);
}
export function campaign2Schemas(): readonly RecordSchema[] { return newSchemas; }
/** Complete trusted descriptor inventory; descriptors never supply decoder authority. */
export function campaign2SupportedSchemas():readonly RecordSchema[] {return structuredClone([...byId.values()].sort((a,b)=>a.typeId<b.typeId?-1:1));}

type RecordValue = Extract<CanonicalValue,{kind:'record'}>;
function isRecord(v: CanonicalValue): v is RecordValue { return typeof v!=='boolean' && v.kind==='record'; }
function numberValue(v: CanonicalValue | undefined): bigint | undefined {
  return v && typeof v!=='boolean' && v.kind==='unsigned' ? v.value : undefined;
}
function typeCheck(v: CanonicalValue, type: string, position: string): void {
  const bad=()=>fail(`${position} requires ${type}`);
  if(type==='u'||type==='i'||type==='text') {
    if(typeof v==='boolean'||v.kind!==({u:'unsigned',i:'signed',text:'text'} as const)[type]) bad();
    return;
  }
  if(type.startsWith('set<')) {
    if(typeof v==='boolean'||v.kind!=='set') return bad();
    for(const item of v.items) typeCheck(item,type.slice(4,-1),position);
    return;
  }
  if(type.startsWith('map<')) {
    if(typeof v==='boolean'||v.kind!=='map') return bad();
    const inner=type.slice(4,-1); let depth=0,split=-1;
    for(let i=0;i<inner.length;i++) { if(inner[i]==='<')depth++; if(inner[i]==='>')depth--; if(inner[i]===';'&&depth===0){split=i;break;} }
    if(split<0) return bad();
    for(const [k,value] of v.entries) {typeCheck(k,inner.slice(0,split),position);typeCheck(value,inner.slice(split+1),position);}
    return;
  }
  if(type==='FactUnion'||type==='AdaptationLeafValue') {
    const ids=type==='FactUnion'?[305n,306n]:[297n,298n,299n,300n,301n];
    if(!isRecord(v)||!ids.includes(v.schema.typeId)||v.schema.schemaVersion!==1n) bad();
    return;
  }
  const ns=namespaces.get(type);
  if(ns!==undefined) {
    if(typeof v==='boolean'||v.kind!=='typedIdentifier')return bad();
    // The physical atom is structural. RequiredNamespace belongs to CanonicalIdentityRole,
    // evaluated after StateKeyGrammar where applicable, with CANONICAL_ROLE_VIOLATION.
    // Payload validity follows the identity's actual family, checked recursively below.
    return;
  }
  const schema=byName.get(type) ?? fail(`unresolved field type ${type}`);
  if(!isRecord(v)||v.schema.typeId!==schema.typeId||v.schema.schemaVersion!==schema.schemaVersion) bad();
}
function validate(value: CanonicalValue): void {
  if(typeof value!=='boolean'&&value.kind==='record'&&[202n,203n].includes(value.schema.typeId))validatePermittedEvidenceRecordClosure(value);
  if(typeof value==='boolean')return;
  if(value.kind==='record') {
    const schema=byId.get(value.schema.typeId);
    if(!schema||schema.schemaVersion!==value.schema.schemaVersion) fail('unknown record schema');
    const definition=definitions.find(r=>BigInt(r.typeId)===schema.typeId);
    if(definition) {
      for(const f of definition.fields) {
        const v=value.fields.get(BigInt(f.id));
        if(v!==undefined) {
          typeCheck(v,f.type,`${schema.name}.${f.name}`);
          const options=finiteValues.filter(x=>x.position===`${schema.name}.${f.name}`);
          if(options.length&&!options.some(x=>BigInt(x.value)===numberValue(v))) fail('unknown finite field value');
          if(f.name==='TransformationVersion') {
            const expected=[269,270].includes(definition.typeId)?'character-learning-evidence/0.5-candidate':'adaptation-input/0.31-candidate';
            if(typeof v==='boolean'||v.kind!=='text'||v.value!==expected) fail('unadmitted transformation version');
          }
        }
      }
      const layouts=variants.filter(u=>u.typeId===definition.typeId);
      if(layouts.length) {
        const layout=layouts.find(u=>BigInt(u.tag)===numberValue(value.fields.get(1n)));
        if(!layout || layout.requiredFields.some(id=>!value.fields.has(BigInt(id)))
          || layout.forbiddenFields.some(id=>value.fields.has(BigInt(id)))) fail('illegal union layout');
      }
    }
    for(const v of value.fields.values())validate(v);
  } else if(value.kind==='list'||value.kind==='set') for(const item of value.items)validate(item);
  else if(value.kind==='map') for(const [k,v] of value.entries){validate(k);validate(v);}
  else if(value.kind==='typedIdentifier'){
    if(value.namespaceId===GOVERNED_CONTENT_DEFINITION_NAMESPACE)validateGovernedContentDefinitionId(value);
    const own=allocation.namespaces.find(n=>BigInt(n.namespace)===value.namespaceId);
    if(own){
      if(typeof value.payload==='boolean'||value.payload.kind!==(own.payload==='text'?'text':'unsigned'))fail('wrong identity payload grammar');
      if(value.payload.kind==='text'&&(!value.payload.value||value.payload.value!==value.payload.value.normalize('NFC')))fail('identity must be nonempty NFC');
    }
    if(value.namespaceId===1002n)validateSemanticReferent(value);
    if(value.namespaceId===1037n||value.namespaceId===1122n)validateReferentOrigin(value);
    validate(value.payload);
  }
}

/** Bytes are the public intake boundary: decoding does not execute caller getters or callbacks. */
const typedArrayTag=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),Symbol.toStringTag)!.get!;
export function decodeCampaign2(bytes: Uint8Array): CanonicalValue {
  if(typedArrayTag.call(bytes)!=='Uint8Array')fail('canonical intake requires Uint8Array bytes');
  // Brand first, then native typed-array copying: no caller slice/iterator/species hooks.
  const detached=new Uint8Array(bytes);
  const value=canonicalDecode(detached,registry);
  validate(value);
  return value;
}
/** Internal construction helper. Round-trip against trusted schemas defeats caller schema overrides. */
export function encodeCampaign2(value: CanonicalValue): Uint8Array {
  const bytes=canonicalEncode(value);
  decodeCampaign2(bytes);
  return bytes;
}
export function campaign2Record(name: string, fields: Readonly<Record<string,CanonicalValue>>): CanonicalValue {
  const schema=campaign2Schema(name);
  if(!definitions.some(d=>BigInt(d.typeId)===schema.typeId)) fail('constructor requires Campaign-2/VAL schema');
  const values=new Map<bigint,CanonicalValue>();
  for(const [name,v] of Object.entries(fields)) {
    const f=schema.fields.find(f=>f.name===name)??fail(`unknown field ${name}`);
    values.set(f.id,v);
  }
  return decodeCampaign2(canonicalEncode(record(schema,values)));
}
export function campaign2Identifier(name: string, payload: string | bigint): TypedIdentifierValue {
  const definition=allocation.namespaces.find(n=>n.name===name)??fail(`unknown identity ${name}`);
  if((definition.payload==='text')!==(typeof payload==='string'))fail('wrong identity payload grammar');
  if(typeof payload==='string'&&(!payload||payload!==payload.normalize('NFC')))fail('identity must be nonempty NFC');
  if(typeof payload==='bigint'&&payload<0n)fail('negative occurrence ordinal');
  return typedIdentifier(definition.namespace,typeof payload==='string'?text(payload):unsigned(payload));
}
/** Detached schema lookup for construction-time role/field validation. */
export function campaign2SchemaByType(typeId:bigint):RecordSchema {
  const found=byId.get(typeId)??fail(`unknown record type ${typeId}`);
  return structuredClone(found);
}
export function campaign2UnionEntries(): readonly SemanticRegistryEntry[] {
  const schema=campaign2Schema('UnionVariantDefinition');
  return variants.map(u=>({
    stableId:typedIdentifier(1024n,list([unsigned(u.typeId),unsigned(u.tag)])),
    registryKind:typedIdentifier(1023n,text('registry/union-variant-definition')),
    definitionVersion:'union-variant/1',
    definition:record(schema,new Map([[1n,unsigned(u.typeId)],[2n,unsigned(u.tag)],
      [3n,set(u.requiredFields.map(unsigned))],[4n,set(u.forbiddenFields.map(unsigned))]])),
  }));
}
