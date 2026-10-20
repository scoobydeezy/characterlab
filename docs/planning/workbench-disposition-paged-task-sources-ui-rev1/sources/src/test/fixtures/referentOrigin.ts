/** Explicit authored identities for the migrated SEM regression corpus.
 * Namespace 20 is a local content StableId fixture, never a referent-origin family.
 * Historical text-only corpus results remain historical evidence, not byte equivalents.
 */
import {typedIdentifier,text} from '../../substrate/canonicalEncoding';
import {semanticReferentKey,semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
export const authoredReferentKey=(name:string)=>semanticReferentKey(semanticReferentFromAuthoredContent(typedIdentifier(20n,text(name))));
