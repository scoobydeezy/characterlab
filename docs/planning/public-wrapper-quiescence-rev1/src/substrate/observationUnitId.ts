/** observation-unit-identity/0.1-candidate; observation-unit-allocation/0.1-candidate.
 * Structural identity only. Exact member admission belongs to the bridge profile.
 */
import {CanonicalEncodingError,typedIdentifier,text,type CanonicalValue,type TypedIdentifierValue} from './canonicalEncoding';
export const OBSERVATION_UNIT_NAMESPACE=1039n;
export function validateObservationUnitId(value:CanonicalValue):asserts value is TypedIdentifierValue {
  if(typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==OBSERVATION_UNIT_NAMESPACE
    ||typeof value.payload==='boolean'||value.payload.kind!=='text')
    throw new CanonicalEncodingError('requires ObservationUnitId with text payload');
  const key=value.payload.value;
  if(!key||key!==key.normalize('NFC')||new TextDecoder().decode(new TextEncoder().encode(key))!==key)
    throw new CanonicalEncodingError('observation unit requires nonempty canonical UTF-8 NFC text');
}
export function observationUnitId(key:string):TypedIdentifierValue {
  const value=typedIdentifier(OBSERVATION_UNIT_NAMESPACE,text(key));
  validateObservationUnitId(value);return value;
}
