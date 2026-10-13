/**
 * The `SEM-001` acceptance gate, audited item by item.
 *
 * `CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md` closes `SEM-001` on ten numbered conditions. Several are
 * claims about the formal documents rather than about code, and those are the ones most likely to
 * drift: a vector row can be marked `PASS` in prose, a control can be added to the contract without
 * a test, a deferral can quietly disappear. So this file reads the formal documents themselves —
 * through Vite's raw import, with no new dependency — and checks the code against what they say.
 *
 * Each item is discharged in one of three forms, stated per item:
 *
 *   - **Executable here** — the condition is a property of the code and is proved in this file.
 *   - **Executable elsewhere** — the condition is proved by a named test file, and this file asserts
 *     that the file is present in the suite and records which item it discharges. That is
 *     bookkeeping, not proof; the proof is in the named file.
 *   - **Ledger condition** — the condition is a statement the formal documents must make, and this
 *     file asserts the documents make it.
 *
 * The completeness check at the end parses the gate's own numbered list and fails if an item is
 * named in the contract without an entry here, or entered here without being named in the contract.
 */
/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest';
import { INITIAL_EVENT_ROLE_DEFINITIONS } from '../semanticBinding/eventBindings';
import {
  INITIAL_PERCEPTUAL_FACET_DEFINITIONS,
  assertClassificationEmissionTarget,
  type ClassificationEmissionTarget,
} from '../semanticBinding/perceptualClassification';
import { CausalRoleId } from '../semanticBinding/evidenceProvenance';
import {
  SEMANTIC_FINITE_REGISTRIES,
  SEMANTIC_OCCURRENCE_NAMESPACES,
  SEMANTIC_RECORD_SCHEMAS,
  SEMANTIC_TYPED_ID_NAMESPACES,
} from '../semanticBinding/semanticSchemaRegistry';
import { OBSERVATION_LANES } from '../semanticBinding/phaseOrdering';
import { DARIUS, GLEN, MINA, REFERENT, projectAllObservers, stringifyWithBigInts } from './fixtures/phenSem001';
import { NAMED_NEGATIVE_CONTROLS } from './fixtures/namedNegativeControls';

// ---------------------------------------------------------------------------
// The formal documents, and the test files that discharge gate items
// ---------------------------------------------------------------------------

const FORMAL_DOCS = import.meta.glob('../../docs/formal/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Readonly<Record<string, string>>;

const TEST_FILES = import.meta.glob('./*.test.ts', {
  query: '?raw', import: 'default', eager: true,
}) as Readonly<Record<string, string>>;

const doc = (name: string): string => {
  const entry = Object.entries(FORMAL_DOCS).find(([path]) => path.endsWith(`/${name}`));
  if (!entry) throw new Error(`formal document ${name} is not present`);
  return entry[1];
};

const VECTORS = doc('CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md');
const DECISIONS = doc('OPEN_DECISIONS.md');

const section = (source: string, from: string, to?: string): string => {
  const start = source.indexOf(from);
  if (start < 0) throw new Error(`section ${from} is absent`);
  const rest = source.slice(start + from.length);
  if (!to) return rest;
  const end = rest.indexOf(to);
  return end < 0 ? rest : rest.slice(0, end);
};

/** The gate's own numbered conditions, parsed from the contract. */
const GATE_CONDITIONS: readonly string[] = Object.freeze(
  [...section(VECTORS, '## Acceptance gate').matchAll(/^(\d+)\.\s+([\s\S]*?)(?=\n\d+\.\s|\n##|$)/gm)]
    .map((match) => match[2].replace(/\s+/g, ' ').trim()),
);

const testFile = (name: string): string => {
  const entry = Object.entries(TEST_FILES).find(([path]) => path.endsWith(`/${name}`));
  if (!entry) throw new Error(`test file ${name} is not present in the suite`);
  return entry[1];
};

const DISCHARGED: number[] = [];
const gateItem = (item: number, title: string, body: () => void): void => {
  DISCHARGED.push(item);
  it(`gate item ${item} — ${title}`, body);
};

describe('SEM-001 acceptance gate audit', () => {
  gateItem(1, 'every vector is PASS', () => {
    // Ledger condition, read from the contract's own table rather than restated here.
    const rows = [...VECTORS.matchAll(/^\|\s*`(CV-SEM-\d+)`\s*\|(.*)\|(.*)\|\s*$/gm)]
      .map((match) => ({ id: match[1], evidence: match[3] }));
    expect(rows.length).toBe(100);

    const notPassing = rows.filter((row) => !row.evidence.includes('`PASS`'));
    expect(notPassing.map((row) => row.id)).toEqual([]);

    // Every vector id appears exactly once: a duplicated row could mask a missing one.
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
  });

  gateItem(2, 'permanent record/enum IDs, role definitions, and facet definitions are registered', () => {
    // Executable here. The frozen `SEM-001I.2` allocation is contiguous, duplicate-free, and
    // exactly the range the registry claims; a renumbering or a gap is a visible failure.
    const typeIds = SEMANTIC_RECORD_SCHEMAS.map((schema) => schema.typeId);
    expect(typeIds).toEqual(Array.from({ length: 50 }, (_value, index) => BigInt(210 + index)));
    expect(new Set(SEMANTIC_RECORD_SCHEMAS.map((schema) => schema.name)).size).toBe(typeIds.length);

    // Typed model identities run 1000..1024 with 1004 deliberately unallocated and not backfilled.
    const typedIds: bigint[] = [...Object.values(SEMANTIC_TYPED_ID_NAMESPACES)]
      .map((value) => value as bigint).sort((a, b) => a < b ? -1 : 1);
    expect(typedIds).toEqual(Array.from({ length: 25 }, (_value, index) => BigInt(1000 + index))
      .filter((value) => value !== 1004n));

    // Occurrence families run 1100..1115 with no overlap into the model-identity range.
    const occurrenceIds = [...Object.values(SEMANTIC_OCCURRENCE_NAMESPACES)].sort((a, b) => a < b ? -1 : 1);
    expect(occurrenceIds).toEqual(Array.from({ length: 16 }, (_value, index) => BigInt(1100 + index)));
    expect(occurrenceIds.filter((value) => typedIds.includes(value))).toEqual([]);

    // Governed role definitions cover the registered finite role vocabulary exactly.
    expect(INITIAL_EVENT_ROLE_DEFINITIONS.map((definition) => definition.eventRoleId).sort())
      .toEqual(SEMANTIC_FINITE_REGISTRIES.EventRole.map((name) => `event-role/${
        name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`).sort());
    for (const definition of INITIAL_EVENT_ROLE_DEFINITIONS) {
      expect(definition.broadReferentDomainValidatorId.length).toBeGreaterThan(0);
      expect(definition.definitionVersion.length).toBeGreaterThan(0);
    }

    // The finite typed facet definitions the fixture uses are registered and exactly typed.
    expect(INITIAL_PERCEPTUAL_FACET_DEFINITIONS.length).toBeGreaterThan(0);
    const registeredFacets = new Set(INITIAL_PERCEPTUAL_FACET_DEFINITIONS.map((d) => d.perceptualFacetId));
    for (const definition of INITIAL_PERCEPTUAL_FACET_DEFINITIONS) {
      expect(definition.perceivedValueType).toBe('boolean');
    }
    const projections = projectAllObservers();
    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      for (const classification of projections.get(observerId)!.classifications) {
        expect(registeredFacets.has(classification.perceptualFacetId)).toBe(true);
      }
    }

    // Registered is not the same as admitted, and the difference is deliberate: Campaign 0 fixed
    // ten causal-role values, and `SEM-001` admits `1..8` and `10` without renumbering `Incidental`
    // or admitting generic `Context` merely because value 9 remains registered.
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole).toHaveLength(10);
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole[8]).toBe('Context');
    expect(SEMANTIC_FINITE_REGISTRIES.CausalRole[9]).toBe('Incidental');
    expect(Object.values(CausalRoleId)).toHaveLength(9);
    expect(Object.values(CausalRoleId)).not.toContain('causal-role/context');
    expect(Object.values(CausalRoleId)).toContain('causal-role/incidental');
    // And the registry document says so, so the omission is a recorded decision rather than a gap.
    expect(doc('EVENT_SEMANTIC_NUMERIC_REGISTRY.md'))
      .toContain('`SEM-001` initially admits `1..8` and `10`');

    // This item is an audit, not an assignment: accepted `SEM-001I.2` already supplies the
    // permanent allocation. The vector document's preamble must agree, or the gate would read as
    // requiring the parent to assign numbers a subdecision has already frozen.
    expect(DECISIONS).toContain('Accepted `SEM-001I.2` — permanent numeric allocation');
    expect(VECTORS).not.toContain('Permanent semantic record IDs remain blocked');
    expect(VECTORS).toContain('The parent gate therefore audits that allocation rather than assigning it.');
  });

  gateItem(3, 'the accepted SEM-001A rules pass their named controls', () => {
    // Executable elsewhere. Each named control is a vector, and item 1 above already requires every
    // vector to be `PASS`; this asserts the specific vectors the item names are the ones present.
    const named: Readonly<Record<string, string>> = {
      'CV-SEM-013': 'allocator, save/load, no reuse, inter-observer independence',
      'CV-SEM-019': 'false continuity',
      'CV-SEM-020': 'false discontinuity',
      'CV-SEM-021': 'binary track transition from observer-side evidence only',
      'CV-SEM-022': 'ordinal opacity',
      'CV-SEM-098': 'inter-observer independence under interleaving',
    };
    for (const id of Object.keys(named)) {
      const row = VECTORS.match(new RegExp(`^\\|\\s*\`${id}\`\\s*\\|(.*)\\|(.*)\\|\\s*$`, 'm'));
      expect(row, `${id} has no row in the vector table`).not.toBeNull();
      expect(row![2]).toContain('`PASS`');
    }
  });

  gateItem(4, 'the event, observation, experience, and recognition phases are registered', () => {
    // Executable here. Both accepted lanes register every named operation at a distinct phase, and
    // the two lanes never collide.
    const required = [
      'Observation', 'TrackingAndSegmentation', 'BindingAndFeatureEvidence', 'Classification',
      'ExperienceFreeze', 'CausalRole', 'RecognitionInputFreeze', 'RecognitionEvaluation',
    ] as const;

    const all: bigint[] = [];
    for (const lane of ['Current', 'Consequence'] as const) {
      const phases = OBSERVATION_LANES[lane].phases;
      for (const operation of required) {
        expect(typeof phases[operation]).toBe('bigint');
        all.push(phases[operation]);
      }
      // Within a lane, the registered order is strictly increasing: observation precedes tracking
      // precedes binding precedes classification precedes the experience freeze, and recognition
      // follows the freeze it reads.
      const ordered = required.map((operation) => phases[operation]);
      expect(ordered).toEqual([...ordered].sort((a, b) => a < b ? -1 : a > b ? 1 : 0));
      expect(new Set(ordered).size).toBe(ordered.length);
    }
    expect(new Set(all).size).toBe(all.length);
  });

  gateItem(5, 'character evidence contains no unobserved truth identity or linkable handle', () => {
    // Executable here, over the complete fixture. Closed vocabulary: every registered truth referent
    // is checked against every character-accessible record of every observer.
    const projections = projectAllObservers();
    const truthIdentities = Object.values(REFERENT).map((referent) => referent.semanticReferentId);

    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      const projection = projections.get(observerId)!;
      const characterSide = stringifyWithBigInts({
        bindings: projection.perceivedBindings,
        classifications: projection.classifications,
        experience: projection.experience,
        transitions: projection.trackTransitions,
      });
      for (const identity of truthIdentities) {
        expect(characterSide, `${observerId} leaks ${identity}`).not.toContain(identity);
      }
      // Nor any handle that would link back to the truth side without copying an identity.
      for (const handle of ['truthEventBindingId', 'worldEventId', 'omniscientAncestry', 'truthTrace']) {
        expect(characterSide).not.toContain(handle);
      }
      // The ancestry the trace side holds is genuinely populated, so the absence above is a
      // separation result rather than an empty graph.
      expect(projection.omniscientAncestry.length).toBe(projection.perceivedBindings.length);
    }
  });

  gateItem(6, 'the complete multi-observer fixture passes consumers and save/load replay', () => {
    // Executable elsewhere: `phenSem001Integration.test.ts` runs all three observers inside the
    // deterministic scheduler, through causal-role derivation, recognition, and the three
    // renderers, across a save/load boundary.
    const source = testFile('phenSem001Integration.test.ts');
    expect(source).toContain('SEM-001` acceptance gate, item 6');
    expect(source).toContain('createCanonicalSave');
    expect(source).toContain('loadCanonicalSave');
  });

  gateItem(7, 'all negative controls report exact first divergence or closure failure', () => {
    // Ledger condition plus a doc/code cross-check. The contract's own list is parsed and compared
    // against the ledger's registered set, so neither side can drift from the other.
    const listed = [...section(VECTORS, 'The named controls:', '## Acceptance gate')
      .matchAll(/^-\s+(?:`([^`]+)`|([^;.\n]+))[;.]$/gm)]
      .map((match) => (match[1] ?? match[2]).trim());

    expect(listed).toHaveLength(31);
    expect([...listed].sort()).toEqual([...NAMED_NEGATIVE_CONTROLS].sort());
    expect(testFile('semanticNegativeControls.test.ts')).toContain('acceptance gate, item 7');
  });

  gateItem(8, 'classification cannot directly enter psychological-pressure seams', () => {
    // Executable here. One permitted target; every psychological and world-truth target refused.
    expect(() => assertClassificationEmissionTarget('semantic-experience-assembly')).not.toThrow();
    const forbidden: readonly ClassificationEmissionTarget[] = [
      'recognition-hypothesis', 'appraisal', 'affect', 'motive', 'pressure',
      'reason', 'identity', 'relationship', 'world-truth',
    ];
    for (const target of forbidden) {
      expect(() => assertClassificationEmissionTarget(target))
        .toThrowError(expect.objectContaining({ code: 'FORBIDDEN_EMISSION_TARGET' }));
    }
  });

  gateItem(9, 'ontology inheritance and affordance closure remain deferred to ONT-001', () => {
    // Ledger condition. The deferral must be recorded as an open decision that owns the general
    // case and explicitly does not block the finite fixture facets `SEM-001` accepts.
    const row = DECISIONS.split('\n').find((line) => line.includes('`ONT-001`') && line.startsWith('|'));
    expect(row, 'ONT-001 has no open-decision row').toBeDefined();
    expect(row!).toContain('inheritance');
    expect(row!).toContain('affordance closure');
    expect(row!).toContain('does not block finite `SEM-001` fixture facets');
  });

  gateItem(10, 'the ledgers record the accepted scope without broadening MATH-006', () => {
    // Ledger condition. `MATH-006` is the observation verdict; the check is that `SEM-001` work has
    // not edited its scope, and that the fixture's use of it is recorded as a citation rather than
    // an extension.
    const mathEntry = section(DECISIONS, '### `MATH-006`', '\n## ');
    expect(mathEntry).toContain('bounded state-change channels');
    expect(mathEntry).toContain('**Reopen:**');
    // No `SEM-001` text has been added to the observation verdict's own entry.
    expect(mathEntry).not.toContain('SEM-001');

    // And the campaign ledger records the fixture citing that accepted seam rather than widening it.
    const row = VECTORS.match(/^\|\s*`CV-SEM-011`\s*\|(.*)\|(.*)\|\s*$/m);
    expect(row).not.toBeNull();
    expect(row![2]).toContain('`PASS`');
    expect(row![2]).toContain('observation/0.1-candidate');
  });
});

describe('SEM-001 gate audit completeness', () => {
  it('audits every condition the gate names, and only those', () => {
    expect(GATE_CONDITIONS).toHaveLength(10);
    expect([...DISCHARGED].sort((a, b) => a - b))
      .toEqual(GATE_CONDITIONS.map((_condition, index) => index + 1));
    expect(new Set(DISCHARGED).size).toBe(DISCHARGED.length);
  });
});
