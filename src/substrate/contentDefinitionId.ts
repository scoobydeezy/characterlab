/** content-definition-id/0.1-candidate; content-id-allocation/0.1-candidate.
 * Authored identity only. No allocator, registry or runtime resolution capability.
 */
import {CanonicalEncodingError,typedIdentifier,text,type CanonicalValue,type TypedIdentifierValue} from './canonicalEncoding';
export const GOVERNED_CONTENT_DEFINITION_NAMESPACE=1038n;
export function validateGovernedContentDefinitionId(value:CanonicalValue):asserts value is TypedIdentifierValue {
  if(typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==GOVERNED_CONTENT_DEFINITION_NAMESPACE
    ||typeof value.payload==='boolean'||value.payload.kind!=='text')
    throw new CanonicalEncodingError('requires GovernedContentDefinitionId with text payload');
  const key=value.payload.value;
  if(!key||key!==key.normalize('NFC')||new TextDecoder().decode(new TextEncoder().encode(key))!==key)
    throw new CanonicalEncodingError('content identity requires nonempty canonical UTF-8 NFC text');
}
export function governedContentDefinitionId(key:string):TypedIdentifierValue {
  const value=typedIdentifier(GOVERNED_CONTENT_DEFINITION_NAMESPACE,text(key));
  validateGovernedContentDefinitionId(value);return value;
}
