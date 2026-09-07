/** Fixed substrate construction under referent-origin/0.1-candidate.
 * Numeric homes: origin-allocation/0.1-candidate. No resolver or allocator registry.
 */
import {CanonicalEncodingError,canonicalEncode,canonicalDecode,bytesToHex,typedIdentifier,unsigned,RecordSchemaRegistry,
  type CanonicalValue,type TypedIdentifierValue} from './canonicalEncoding';
import {GOVERNED_CONTENT_DEFINITION_NAMESPACE,validateGovernedContentDefinitionId} from './contentDefinitionId';

export const REFERENT_ORIGIN_VERSION='referent-origin/0.1-candidate' as const;
export const ORIGIN_NAMESPACES=Object.freeze({AuthoredContentOriginId:1037n,RuntimeEntityOriginId:1122n});
function id(value:CanonicalValue):TypedIdentifierValue {
  if(typeof value==='boolean'||value.kind!=='typedIdentifier')throw new CanonicalEncodingError('referent origin requires a typed identifier');
  return value;
}
export function validateReferentOrigin(value:CanonicalValue):void {
  const origin=id(value);
  if(origin.namespaceId===1037n)id(origin.payload);
  else if(origin.namespaceId===1122n){
    if(typeof origin.payload==='boolean'||origin.payload.kind!=='unsigned'||origin.payload.value<0n)
      throw new CanonicalEncodingError('runtime origin requires an unsigned ordinal');
  }else throw new CanonicalEncodingError('unknown semantic referent origin namespace');
  canonicalEncode(origin); // Includes canonical validity of the complete authored StableId.
}
export function validateSemanticReferent(value:CanonicalValue):asserts value is TypedIdentifierValue {
  const referent=id(value);
  if(referent.namespaceId!==1002n)throw new CanonicalEncodingError('semantic referent requires namespace 1002');
  validateReferentOrigin(referent.payload);
}
export function semanticReferentFromAuthoredContent(stableId:TypedIdentifierValue):TypedIdentifierValue {
  id(stableId);canonicalEncode(stableId);
  return typedIdentifier(1002n,typedIdentifier(1037n,structuredClone(stableId)));
}
export function semanticReferentFromRuntimeEntity(origin:TypedIdentifierValue):TypedIdentifierValue {
  validateReferentOrigin(origin);
  if(origin.namespaceId!==1122n)throw new CanonicalEncodingError('requires runtime entity origin');
  return typedIdentifier(1002n,structuredClone(origin));
}
/** Internal scheduler capability, never an option on a data-only model factory.
 * Called at entity creation, exactly once; serialization/references never allocate.
 */
export function allocateRuntimeEntityOrigin(allocator:{allocateRuntimeId():bigint}):TypedIdentifierValue {
  const result=typedIdentifier(1122n,unsigned(allocator.allocateRuntimeId()));
  validateReferentOrigin(result);return result;
}

/** Existing SEM in-memory maps use strings. This lossless cenc/1 byte key is a representation
 * of the entire typed identity, never a new identity, local name, or origin inference.
 */
export function semanticReferentKey(value:TypedIdentifierValue):string {
  validateSemanticReferent(value);return bytesToHex(canonicalEncode(value));
}
export function semanticReferentValue(key:string,registry?:RecordSchemaRegistry):TypedIdentifierValue {
  if(typeof key!=='string'||! /^(?:[0-9a-f]{2})+$/.test(key))throw new CanonicalEncodingError('requires complete canonical referent byte key');
  const value=canonicalDecode(Uint8Array.from(key.match(/../g)!,s=>parseInt(s,16)),registry);
  validateSemanticReferent(value);return value;
}

/** Schema admission remains with the owning decoder; this only checks origin families. */
export function validateReferentOriginsInValue(value:CanonicalValue):void {
  if(typeof value==='boolean')return;
  if(value.kind==='typedIdentifier'){
    if(value.namespaceId===GOVERNED_CONTENT_DEFINITION_NAMESPACE)validateGovernedContentDefinitionId(value);
    if(value.namespaceId===1002n)validateSemanticReferent(value);
    if(value.namespaceId===1037n||value.namespaceId===1122n)validateReferentOrigin(value);
    validateReferentOriginsInValue(value.payload);
  }else if(value.kind==='record')for(const v of value.fields.values())validateReferentOriginsInValue(v);
  else if(value.kind==='list'||value.kind==='set')value.items.forEach(validateReferentOriginsInValue);
  else if(value.kind==='map')for(const [k,v] of value.entries){validateReferentOriginsInValue(k);validateReferentOriginsInValue(v);}
}
