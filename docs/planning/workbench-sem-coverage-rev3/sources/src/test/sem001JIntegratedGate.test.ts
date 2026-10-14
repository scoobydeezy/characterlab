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
import { describe, expect, it } from 'vitest';
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
} from './fixtures/phenSem001';
import type { PerceptualFeatureId } from '../semanticBinding/perceptualClassification';
import {
  CATALOGS, CONSUMED_TRACK, OBSERVE, canonicalChainValue, handlerKey, initialState,
  observeHandler, observerPayload, scheduler,
} from './fixtures/phenSem001Run';

const FORMAL_DOCS = import.meta.glob('../../docs/formal/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Readonly<Record<string, string>>;

/** Every non-test module. Used to prove the document audit never becomes runtime semantics. */
const SOURCE_MODULES = import.meta.glob(['../semanticBinding/*.ts', '../substrate/*.ts', '../observation/*.ts'], {
  query: '?raw', import: 'default', eager: true,
}) as Readonly<Record<string, string>>;

const doc = (name: string): string => {
  const entry = Object.entries(FORMAL_DOCS).find(([path]) => path.endsWith(`/${name}`));
  if (!entry) throw new Error(`formal document ${name} is not present`);
  return entry[1];
};

const VECTORS = doc('CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md');

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

describe('SEM-001J — no authoritative result depends on a symbolic occurrence ID', () => {
  it('refuses a symbolic occurrence identity at the accepted constructor', () => {
    // The constructor takes an allocated ordinal. A symbolic handle in that position is not a
    // near-miss to be coerced; it has no canonical encoding at all.
    expect(() => semanticOccurrenceId('ObservationId', 'observation/mina-1' as never)).toThrow();
    expect(() => semanticOccurrenceId('ObservationId', 12n)).not.toThrow();

    // And the namespace itself is closed, so a symbolic occurrence family cannot be invented
    // alongside the accepted sixteen.
    expect(codeOf(() => semanticOccurrenceId('LegacyObservationHandle' as never, 1n)))
      .toBe('UNKNOWN_SEMANTIC_NAMESPACE');
    expect(codeOf(() => semanticOccurrenceId('ObservationId', -1n)))
      .toBe('INVALID_OCCURRENCE_ORDINAL');
  });

  it('refuses a legacy seam-version string routed at an authoritative field', () => {
    // The fixture's own former labels, which sat in authoritative version fields until this gate
    // migrated them. Routing one at an authoritative record now fails at an exact boundary rather
    // than encoding a record no accepted contract governs.
    const allocator = createRunAllocator();
    const projection = projectObserver({
      observerId: GLEN, truth: truthBindings(), allocator, experienceId: 1n,
    });
    const binding = projection.perceivedBindings[0];

    for (const legacy of ['phen-sem-001/causal-1', 'phen-sem-001/recognition-1', 'perceived-binding/0.1-candidate']) {
      expect(codeOf(() => perceivedBindingEvidenceValue({ ...binding, transformationVersion: legacy })))
        .toBe('UNADMITTED_CONTRACT_VERSION');
    }

    // The record built from the accepted contract version encodes normally, so the refusal above
    // is the version and not the record.
    expect(() => perceivedBindingEvidenceValue(binding)).not.toThrow();

    // The same closure holds on the recognition side.
    const track = projection.tracksByLabel.get(CONSUMED_TRACK[GLEN])!;
    const catalog = CATALOGS[GLEN];
    const resolution = recognizeObserverContinuant({
      projection, perceptualReferentId: track, catalog,
      assertCandidate: catalog[0], nextRuntimeId: allocator.next(),
    })!;
    expect(codeOf(() => recognitionResolutionRecordValue({
      ...resolution, recognitionVersion: 'phen-sem-001/recognition-1',
    }))).toBe('UNADMITTED_CONTRACT_VERSION');
    expect(() => recognitionResolutionRecordValue(resolution)).not.toThrow();
  });

  it('leaves authoritative bytes identical when every fixture scaffolding label is poisoned', () => {
    // Track labels are pure fixture bookkeeping: they name which continuant an affordance follows,
    // and they appear in no accepted record. Poisoning all of them — while holding the permitted
    // observations, the truth event, and every canonical typed occurrence fixed — must change
    // nothing authoritative.
    const baseline = chainFor(GLEN);

    const poisoned = OBSERVER_AFFORDANCES[GLEN].map((affordance) => ({
      ...affordance, trackLabel: `poisoned/${affordance.trackLabel}/xyzzy`,
    }));
    // The fixture keys its controlled feature evidence by the same labels, so the poisoned run
    // carries the identical evidence under the new keys: the permitted observation is unchanged
    // and only the scaffolding name moved.
    const poisonedFeatures = Object.fromEntries(OBSERVER_AFFORDANCES[GLEN].map((affordance) =>
      [`poisoned/${affordance.trackLabel}/xyzzy`, TRACK_FEATURES[affordance.trackLabel] ?? []]));

    const poisonedChain = chainFor(GLEN, {
      affordances: poisoned,
      trackFeatures: poisonedFeatures,
      consumedTrackLabel: `poisoned/${CONSUMED_TRACK[GLEN]}/xyzzy`,
    });

    // The labels really did change...
    expect(poisoned.map((affordance) => affordance.trackLabel))
      .not.toEqual(OBSERVER_AFFORDANCES[GLEN].map((affordance) => affordance.trackLabel));
    // ...and the authoritative bytes did not.
    expect(bytesToHex(canonicalEncode(poisonedChain))).toBe(bytesToHex(canonicalEncode(baseline)));
  });

  it('resolves every identity in the committed chain through its own accepted namespace', () => {
    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      const bindings = identityBindings(chainFor(observerId), '<root>');
      expect(bindings.length).toBeGreaterThan(0);

      for (const binding of bindings) {
        // Closed vocabulary: no identity in an authoritative result sits outside the frozen
        // `SEM-001I.2` allocation.
        expect(ACCEPTED_NAMESPACES.has(binding.namespaceId),
          `namespace ${binding.namespaceId} at ${binding.fieldName} is unaccepted`).toBe(true);

        // And it is the namespace *that field* must draw from. Without this, an occurrence could
        // be re-encoded as a text-payload model identity and pass, because the node would look
        // like a legitimate identity of a different family.
        const expectedName = FIELD_NAMESPACE_ALIASES[binding.fieldName] ?? binding.fieldName;
        const expected = NAMESPACE_BY_NAME.get(expectedName);
        expect(expected, `no accepted namespace for field ${binding.fieldName}`).toBeDefined();
        expect(binding.namespaceId,
          `${binding.fieldName} carries namespace ${binding.namespaceId}, not ${expected}`)
          .toBe(expected);

        // An occurrence identity carries an allocated ordinal, never text.
        if (OCCURRENCE_NAMESPACES.has(binding.namespaceId)) {
          expect(binding.payloadKind,
            `occurrence field ${binding.fieldName} carries ${binding.payloadKind}`).toBe('unsigned');
        }
      }

      // Occurrence identities from several distinct families are present, so the check above is
      // running against a populated chain rather than a degenerate one.
      const occurrenceFamilies = new Set(bindings
        .filter((binding) => OCCURRENCE_NAMESPACES.has(binding.namespaceId))
        .map((binding) => binding.namespaceId));
      expect(occurrenceFamilies.size).toBeGreaterThanOrEqual(5);
    }
  });
});

// ---------------------------------------------------------------------------
// 4. The document audit is a conformance tool, never runtime semantics
// ---------------------------------------------------------------------------

describe('SEM-001J — documents are an audit target, not a semantic interpreter', () => {
  it('keeps every formal-document read inside the test tree', () => {
    // Authoritative behaviour comes from the governed registries, codecs, and contracts committed
    // to `ModelIdentity`. No module that can run inside a transition reads explanatory prose.
    expect(Object.keys(SOURCE_MODULES).length).toBeGreaterThan(10);
    for (const [path, source] of Object.entries(SOURCE_MODULES)) {
      expect(source, `${path} reads the formal documents`).not.toContain('docs/formal');
      expect(source, `${path} globs files at runtime`).not.toContain('import.meta.glob');
    }
  });

  it('reads documents only for identifiers, statuses, and cross-ledger consistency', () => {
    // The audit's own subject matter: vector ids and their status, named decisions, gate entries.
    // None of it is parsed into a rule that anything executes.
    const auditSource = Object.entries(import.meta.glob('./sem001AcceptanceGate.test.ts', {
      query: '?raw', import: 'default', eager: true,
    }) as Record<string, string>)[0][1];

    // It asserts about documents; it never turns document text into a validator, a registry entry,
    // a phase, or an identifier the runtime would use.
    for (const forbidden of ['new Function', 'eval(', 'JSON.parse(VECTORS', 'JSON.parse(DECISIONS']) {
      expect(auditSource).not.toContain(forbidden);
    }
    expect(auditSource).toContain('Ledger condition');
  });
});

// ---------------------------------------------------------------------------
// 3. registered ≠ admitted, recorded as an invariant
// ---------------------------------------------------------------------------

describe('SEM-001J — registered is not admitted', () => {
  it('records the distinction as a principle and proves the CausalRole instance', () => {
    // The general principle, recorded so a later implementation cannot read "registered" as
    // "legal everywhere". No new mechanism: admission still comes from the receiving rule,
    // read-domain, or domain contract.
    // The normative sentences, not merely the heading: an inverted principle under the same
    // heading would otherwise pass. Compared with line wrapping and blockquote markers flattened,
    // so reflowing the paragraph is not a failure while changing what it says is.
    const flattened = VECTORS.replace(/\n>?\s*/g, ' ');
    expect(flattened).toContain(
      'A registered semantic value is not thereby a value admitted by a given seam, read-domain, or domain contract.');
    expect(flattened).toContain('admission is decided by the exact receiving rule');
    expect(flattened).toContain('may not infer that "registered" means "legal everywhere"');

    // The instance. Campaign 0 registered ten causal-role values; `SEM-001`'s causal-role domain
    // admits nine of them, and `Incidental` keeps value 10 rather than sliding into the gap.
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole).toHaveLength(10);
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole.indexOf('Context')).toBe(8);
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole.indexOf('Incidental')).toBe(9);
    expect(Object.values(CausalRoleId)).not.toContain('causal-role/context');
    expect(Object.values(CausalRoleId)).toContain('causal-role/incidental');

    // A registered-but-unadmitted value has no admitted encoding either: it is absent from the
    // domain the seam derives over, so nothing can emit it.
    expect(Object.values(CausalRoleId)).toHaveLength(9);
  });
});

// ---------------------------------------------------------------------------
// 2. Every parent vector retired, with named integrated evidence
// ---------------------------------------------------------------------------

describe('SEM-001J — the parent vector set is retired', () => {
  it('has zero pending CV-SEM rows at acceptance', () => {
    const rows = [...VECTORS.matchAll(/^\|\s*`(CV-SEM-\d+)`\s*\|(.*)\|(.*)\|\s*$/gm)]
      .map((match) => ({ id: match[1], evidence: match[3] }));
    expect(rows).toHaveLength(100);
    expect(rows.filter((row) => /pending|TODO|blocked/i.test(row.evidence)).map((row) => row.id))
      .toEqual([]);
    expect(rows.filter((row) => !row.evidence.includes('`PASS`')).map((row) => row.id)).toEqual([]);
  });

  it('names the integrated evidence that closed each formerly pending vector', () => {
    // The set that was still pending when this gate opened. Each must now name the `SEM-001J`
    // evidence that closed it, so the acceptance record shows which test discharged which parent
    // obligation rather than asserting the set is closed in aggregate.
    const formerlyPending = [
      1, 2, 3, 7, 8, 9, 10, 11, 12, 14, 15, 17, 18,
    ].map((value) => `CV-SEM-${String(value).padStart(3, '0')}`);

    const table = VECTORS.slice(VECTORS.indexOf('## `SEM-001J` integrated evidence'));
    expect(table.length).toBeGreaterThan(0);
    for (const id of formerlyPending) {
      const row = table.match(new RegExp(`^\\|\\s*\`${id}\`\\s*\\|(.*)\\|\\s*$`, 'm'));
      expect(row, `${id} has no integrated-evidence row`).not.toBeNull();
      expect(row![1].trim().length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. The whole chain, and the shortcuts that must fail inside it
// ---------------------------------------------------------------------------

/** Every canonical record type present anywhere in a value. */
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

describe('SEM-001J — the complete causal path is visible in one run', () => {
  it('carries every stage of the chain as an accepted canonical record', () => {
    // The path the gate closes, stage by stage, in the bytes actually committed for Glen — the
    // observer whose projection exercises preservation, coarsening, and non-resolution at once.
    const present = recordTypeIds(chainFor(GLEN));
    const stage: readonly (readonly [bigint, string])[] = [
      [210n, 'WorldEventTruth — the truth event'],
      [211n, 'EventBinding — its role bindings'],
      [216n, 'SupportingObservationId — permitted observation'],
      [212n, 'PerceptualReferentId — fallible tracking'],
      [213n, 'PerceptualEventReferentId — segmentation'],
      [223n, 'EventRoleEvidence — the permitted role projection'],
      [224n, 'PerceivedBindingEvidence — binding evidence'],
      [225n, 'PerceptualClassificationEvidence — classification'],
      [227n, 'PreRecognitionSemanticExperience — the immutable experience'],
      [237n, 'CharacterEvidenceRef — observer-safe provenance'],
      [240n, 'CausalRoleEvidence — character-relative causal roles'],
      [235n, 'RecognitionResolution — the resolution variant'],
      [236n, 'RecognitionResolutionRecord — the appended resolution'],
    ];
    for (const [typeId, description] of stage) {
      expect(present.has(typeId), `missing stage: ${description} (type ${typeId})`).toBe(true);
    }

    // The remaining stages — canonical state, trace, save/load, exact replay — are the integrated
    // run's own claim, discharged in `phenSem001Integration.test.ts` over this same chain.
    expect(present.has(241n) || present.has(242n)).toBe(false);
  });

  it('refuses each integrated shortcut at its first actual illegal boundary', () => {
    const allocator = createRunAllocator();
    const truth = truthBindings();
    const projection = projectObserver({
      observerId: GLEN, truth, allocator, experienceId: 1n,
    });
    const actorBinding = projection.perceivedBindings.find(
      (value) => value.eventRoleEvidence.kind === 'exact')!;
    // A binding *request*: the compiled evidence carries its own allocated `perceivedBindingId`,
    // which is not an input field. Leaving it on would make the request illegal for a second
    // reason and the first divergence would be that, not the leak under test.
    const { perceivedBindingId: _allocated, ...bindingRequest } = projection.perceivedBindings[0];

    // 1. Truth identity leak — refused at the perceived-binding boundary, before allocation.
    expect(codeOf(() => compilePerceivedBindings([{
      ...bindingRequest, semanticReferentId: truth[1].semanticReferent.semanticReferentId,
    } as never], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');
    // The same request without the leak compiles, so the refusal is the leaked field.
    expect(() => compilePerceivedBindings([bindingRequest], 100n)).not.toThrow();

    // 2. Truth-role overexposure — the unresolved variant forbids the role field, so a projection
    // that claims not to have resolved a role cannot smuggle one alongside.
    expect(codeOf(() => eventRoleEvidenceValue(
      { kind: 'unresolved', eventRoleId: EventRoleId.Actor } as never)))
      .toBe('ILLEGAL_UNION_LAYOUT');

    // 3. Referent-keyed collapse — one continuant in two roles stays two canonical records.
    const multiRole = projectObserver({
      observerId: MINA, truth: truthBindings(MULTI_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(), experienceId: 1n, affordances: MULTI_ROLE_AFFORDANCES,
    });
    const shared = multiRole.tracksByLabel.get('shared/person')!;
    const sharedRecords = multiRole.perceivedBindings
      .filter((value) => value.perceptualReferentId.observerTrackSequence === shared.observerTrackSequence)
      .map((value) => bytesToHex(canonicalEncode(perceivedBindingEvidenceValue(value))));
    expect(sharedRecords).toHaveLength(2);
    expect(new Set(sharedRecords).size).toBe(2);

    // 4. Role-keyed collapse — two continuants in one repeatable role stay two canonical records.
    const repeated = projectObserver({
      observerId: MINA, truth: truthBindings(REPEATED_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(), experienceId: 1n, affordances: REPEATED_ROLE_AFFORDANCES,
    });
    const companions = repeated.perceivedBindings.filter((value) =>
      value.eventRoleEvidence.kind === 'exact'
      && value.eventRoleEvidence.eventRoleId === EventRoleId.Companion);
    expect(new Set(companions.map((value) =>
      bytesToHex(canonicalEncode(perceivedBindingEvidenceValue(value))))).size).toBe(2);

    // 5. Event-only collapse — the event-file is not the experience, and two experiences over one
    // event-file remain two canonical records with distinct `ExperienceId` occurrences.
    const second = projectObserver({
      observerId: GLEN, truth, allocator: createRunAllocator(), experienceId: 2n,
    });
    expect(bytesToHex(canonicalEncode(preRecognitionSemanticExperienceValue(second.experience))))
      .not.toBe(bytesToHex(canonicalEncode(preRecognitionSemanticExperienceValue(projection.experience))));
    expect(second.experience.perceptualEventReferentIds)
      .toEqual(projection.experience.perceptualEventReferentIds);

    // 6. Classification into psychology — refused at the receiving seam.
    expect(codeOf(() => assertClassificationEmissionTarget('pressure')))
      .toBe('FORBIDDEN_EMISSION_TARGET');

    // 7. Hidden-truth causal influence — the causal record's basis is observer-side, and a truth
    // linkage field on the evidence it would read is refused by its own named code.
    expect(codeOf(() => compilePerceivedBindings([{
      ...bindingRequest, truthEventBindingId: truth[0].eventBindingId,
    } as never], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');

    // 8. Character traversal of omniscient ancestry — the ancestry graph names truth bindings the
    // canonical chain never carries, so there is no field to traverse from.
    expect(projection.omniscientAncestry.length).toBeGreaterThan(0);
    const chainText = JSON.stringify(chainFor(GLEN), (_key, value: unknown) =>
      typeof value === 'bigint' ? value.toString() : value);
    for (const edge of projection.omniscientAncestry) {
      expect(chainText).not.toContain(String(edge.truthEventBindingId));
    }

    // 9. Noncanonical or invalid evidence — an unregistered field cannot be constructed at all.
    expect(codeOf(() => semanticRecordValue('PerceivedBindingEvidence', {
      PerceivedBindingId: semanticOccurrenceId('PerceivedBindingId', 1n),
      NarrativeGloss: text('she swung the pipe'),
    }))).toBe('UNKNOWN_SEMANTIC_FIELD');

    // 10. Legacy symbolic authoritative ID use — proved four ways above; re-asserted here as the
    // integrated shortcut it would be.
    expect(codeOf(() => perceivedBindingEvidenceValue({
      ...actorBinding, transformationVersion: 'phen-sem-001/causal-1',
    }))).toBe('UNADMITTED_CONTRACT_VERSION');
  });

  it('aborts the complete integrated instant, keeping nothing the run produced', async () => {
    // 11. Whole-instant failure, over the full fixture. The handler allocates occurrences, compiles
    // bindings, derives causal roles, recognises a continuant, renders, and contributes trace and
    // outputs — and then fails settlement.
    const state = initialState();
    const failing = new Map([[handlerKey(OBSERVE), observeHandler({ failAtSettlement: true })]]);
    const instance = scheduler(state, failing);
    instance.schedule({
      dueAt: simInstant(1n), phase: 10n, eventTypeId: OBSERVE,
      payload: observerPayload(GLEN, 1n), dependencies: list([]),
    });

    const beforeState = instance.getState();
    const beforeAllocators = instance.getAllocatorState();
    const beforeSnapshot = instance.exportQuiescentSnapshot();

    await expect(instance.settleNextInstant())
      .rejects.toThrow(/injected integrated-instant commit failure/);

    expect(instance.getState()).toEqual(beforeState);
    expect(instance.getState().continuantFiles.nextTrackSequenceByObserver.size).toBe(0);
    expect(instance.getAllocatorState()).toEqual(beforeAllocators);
    const afterSnapshot = instance.exportQuiescentSnapshot();
    expect(afterSnapshot.committedTrace).toEqual(beforeSnapshot.committedTrace);
    expect(afterSnapshot.outputs).toEqual(beforeSnapshot.outputs);
  });
});

// ---------------------------------------------------------------------------
// Acceptance disposition
// ---------------------------------------------------------------------------

describe('SEM-001J — the acceptance record states the disposition it claims', () => {
  it('records acceptance, closure, and the exact scope of what closure proves', () => {
    const decisions = doc('OPEN_DECISIONS.md').replace(/\n>?\s*/g, ' ');

    // The disposition itself.
    expect(decisions).toContain(
      'Accepted `SEM-001J` — integrated phenomenon gate; parent `SEM-001` closed (2026-09-04)');
    expect(decisions).toContain(
      'Accepted contract: `semantic-binding/0.1-candidate` as the Campaign 1 event-semantic baseline. '
      + '`PHEN-SEM-001` passes. The parent `SEM-001` is closed.');

    // The sentence that keeps closure from being read as an allocation event.
    expect(decisions).toContain(
      '`SEM-001` closure allocates and reinterprets no permanent identifier accepted by `SEM-001I.2`; '
      + 'it proves that the frozen allocation participates correctly in the complete integrated semantic path.');

    // The scope statement. Each later seam is named, so closure cannot be read as claiming it.
    for (const later of [
      'continuous perception', 'graded perceptual confidence', 'general ontology inference',
      'action-schema recognition', 'memory encoding', 'belief learning', 'appraisal',
      'social cognition',
    ]) {
      expect(decisions, `closure scope does not exclude ${later}`).toContain(later);
    }
    expect(decisions).toContain('Each remains a later seam, and none is authorized by this acceptance.');

    // And the register no longer lists `SEM-001` as blocking.
    expect(decisions).toContain('**`SEM-001` is closed** (2026-09-04)');
    expect(decisions).not.toContain('| `SEM-001` event semantic binding and recognition boundary | `P0` |');
  });
});
