// Generated native SEM-001J executable helpers. Document-ledger readers are excluded.
/**
 * `SEM-001J` — the integrated phenomenon gate.
 *
 * `SEM-001I.3` was accepted with a carried condition: the integrated gate must not run the symbolic
 * oracle and then serialize its result canonically. It must migrate the remaining `SEM-001B..H`
 * in-memory occurrence boundaries onto the accepted typed IDs and the codec/state machinery, and
 * *no authoritative `PHEN-SEM-001` result may depend on a symbolic string occurrence ID*.
 *
 * A statement in an acceptance record cannot discharge that. This file proves it, in four
 * independent ways that fail for different reasons:
 *
 *   1. the accepted constructors refuse a symbolic occurrence identity outright;
 *   2. a legacy version string routed at an authoritative field is refused at an exact boundary;
 *   3. poisoning every fixture scaffolding string leaves the authoritative bytes identical;
 *   4. every identity in the committed canonical chain resolves through one accepted namespace,
 *      and every occurrence payload in it is an allocated ordinal rather than text.
 *
 * Together those separate two populations that were previously entangled: symbolic strings are
 * test scaffolding, and accepted typed canonical identities are authoritative execution. Symbolic
 * shapes may still exist in helper code — what matters is that they cannot reach a result.
 */
/// <reference types="vite/client" />

import {
  bytesToHex, canonicalEncode, text,
  type CanonicalValue,
} from '../substrate/canonicalEncoding';
import {
  SEMANTIC_OCCURRENCE_NAMESPACES,
  SEMANTIC_TYPED_ID_NAMESPACES,
} from '../semanticBinding/semanticSchemaRegistry';
import { semanticOccurrenceId, semanticRecordValue } from '../semanticBinding/semanticCodecs';
import { EventRoleId } from '../semanticBinding/eventBindings';
import { compilePerceivedBindings } from '../semanticBinding/perceptualEventFiles';
import { assertClassificationEmissionTarget } from '../semanticBinding/perceptualClassification';
import { list } from '../substrate/canonicalEncoding';
import { simInstant } from '../substrate/time';
import {
  eventRoleEvidenceValue,
  perceivedBindingEvidenceValue,
  preRecognitionSemanticExperienceValue,
  recognitionResolutionRecordValue,
} from '../semanticBinding/semanticEvidenceCodecs';
import { CausalRoleId } from '../semanticBinding/evidenceProvenance';
import { SEMANTIC_FINITE_REGISTRIES } from '../semanticBinding/semanticSchemaRegistry';
import {
  DARIUS, GLEN, MINA, MULTI_ROLE_AFFORDANCES, MULTI_ROLE_BINDING_REQUESTS,
  OBSERVER_AFFORDANCES, REPEATED_ROLE_AFFORDANCES, REPEATED_ROLE_BINDING_REQUESTS, TRACK_FEATURES,
  createRunAllocator, deriveObserverCausalRoles, projectObserver, recognizeObserverContinuant,
  truthBindings, type ObserverId, type ObserverRoleAffordance,
} from '../test/fixtures/phenSem001';
import type { PerceptualFeatureId } from '../semanticBinding/perceptualClassification';
import {
  CATALOGS, CONSUMED_TRACK, OBSERVE, canonicalChainValue, handlerKey, initialState,
  observeHandler, observerPayload, scheduler,
} from '../test/fixtures/phenSem001Run';

const codeOf = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    const code = (error as { readonly code?: unknown }).code;
    if (typeof code === 'string') return code;
    throw error;
  }
  throw new Error('expected a contract failure, but the construction was admitted');
};

// ---------------------------------------------------------------------------
// One integrated run, encoded canonically
// ---------------------------------------------------------------------------

/**
 * The whole chain for one observer, as the committed canonical value. `affordances` and
 * `trackFeatures` are threaded so the poison control can rewrite the fixture's own scaffolding
 * labels without touching anything authoritative.
 */
function chainFor(observerId: ObserverId, options: {
  readonly affordances?: readonly ObserverRoleAffordance[];
  readonly trackFeatures?: Readonly<Record<string, readonly PerceptualFeatureId[]>>;
  readonly consumedTrackLabel?: string;
} = {}): CanonicalValue {
  const allocator = createRunAllocator();
  const truth = truthBindings();
  const projection = projectObserver({
    observerId, truth, allocator, experienceId: 1n,
    affordances: options.affordances,
    trackFeatures: options.trackFeatures,
  });
  const consumedTrack = projection.tracksByLabel.get(
    options.consumedTrackLabel ?? CONSUMED_TRACK[observerId])!;
  const causal = deriveObserverCausalRoles(projection, consumedTrack, allocator.next());
  const catalog = CATALOGS[observerId];
  const resolution = recognizeObserverContinuant({
    projection, perceptualReferentId: consumedTrack, catalog,
    assertCandidate: catalog[0], nextRuntimeId: allocator.next(),
  });
  return canonicalChainValue({ truth, experience: projection.experience, causal, resolution });
}

const ACCEPTED_NAMESPACES: ReadonlySet<bigint> = new Set<bigint>([
  ...Object.values(SEMANTIC_TYPED_ID_NAMESPACES).map((value) => value as bigint),
  ...Object.values(SEMANTIC_OCCURRENCE_NAMESPACES),
]);
const OCCURRENCE_NAMESPACES: ReadonlySet<bigint> = new Set(Object.values(SEMANTIC_OCCURRENCE_NAMESPACES));

/**
 * Which accepted namespace each identity-bearing field must draw from.
 *
 * The allocation names a field after its namespace wherever it can, so the default is the field's
 * own name. These five are the exceptions, and writing them down is the point: the binding from
 * field to namespace becomes auditable instead of implied. A check that only verified "occurrence
 * namespaces carry ordinals" would pass a symbolic string smuggled through a namespace whose
 * payload is legitimately text — which is exactly the shape the carried condition forbids.
 */
const FIELD_NAMESPACE_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  ClassificationRuleId: 'PerceptualClassificationRuleId',
  EventClassificationRuleId: 'PerceptualEventClassificationRuleId',
  CandidateSemanticReferentId: 'SemanticReferentId',
  SupportingFeatureObservationIds: 'FeatureObservationId',
  EvaluatedRecognitionCueEvidenceIds: 'RecognitionCueEvidenceId',
  RevisesRecognitionResolutionId: 'RecognitionResolutionId',
});

const NAMESPACE_BY_NAME: ReadonlyMap<string, bigint> = new Map<string, bigint>([
  ...Object.entries(SEMANTIC_TYPED_ID_NAMESPACES).map(([name, id]) => [name, id as bigint] as const),
  ...Object.entries(SEMANTIC_OCCURRENCE_NAMESPACES).map(([name, id]) => [name, id] as const),
]);

interface IdentityBinding {
  /** The record field the identity sits at, or its containing set/list field. */
  readonly fieldName: string;
  readonly namespaceId: bigint;
  readonly payloadKind: string;
}

/** Every typed identity in a canonical value, paired with the field it was found at. */
function identityBindings(
  value: CanonicalValue,
  fieldName: string,
  found: IdentityBinding[] = [],
): readonly IdentityBinding[] {
  if (typeof value === 'boolean') return found;
  switch (value.kind) {
    case 'typedIdentifier':
      found.push({
        fieldName,
        namespaceId: value.namespaceId,
        payloadKind: typeof value.payload === 'boolean' ? 'boolean' : value.payload.kind,
      });
      return found;
    case 'list': case 'set':
      // Elements inherit the field their collection sits at.
      for (const item of value.items) identityBindings(item, fieldName, found);
      return found;
    case 'map':
      for (const [key, entry] of value.entries) {
        identityBindings(key, fieldName, found);
        identityBindings(entry, fieldName, found);
      }
      return found;
    case 'record':
      for (const [id, field] of value.fields) {
        const name = value.schema.fields.find((candidate) => candidate.id === id)?.name ?? '<unallocated>';
        identityBindings(field, name, found);
      }
      return found;
    default:
      return found;
  }
}

// ---------------------------------------------------------------------------
// 1. Elimination of the old symbolic-authority path
// ---------------------------------------------------------------------------

function recordTypeIds(value: CanonicalValue, found: Set<bigint> = new Set()): ReadonlySet<bigint> {
  if (typeof value === 'boolean') return found;
  switch (value.kind) {
    case 'record':
      found.add(value.schema.typeId);
      for (const field of value.fields.values()) recordTypeIds(field, found);
      return found;
    case 'list': case 'set':
      for (const item of value.items) recordTypeIds(item, found);
      return found;
    case 'map':
      for (const [key, entry] of value.entries) { recordTypeIds(key, found); recordTypeIds(entry, found); }
      return found;
    case 'typedIdentifier':
      return recordTypeIds(value.payload, found);
    default:
      return found;
  }
}


export {chainFor,identityBindings,recordTypeIds,ACCEPTED_NAMESPACES,OCCURRENCE_NAMESPACES,FIELD_NAMESPACE_ALIASES,NAMESPACE_BY_NAME};
export const originalSource={path:'src/test/sem001JIntegratedGate.test.ts',sha256:'15c5859489270bd197a28801c3bcebccdb68559f37075f7328f96f6d64c3bb2f'} as const;
