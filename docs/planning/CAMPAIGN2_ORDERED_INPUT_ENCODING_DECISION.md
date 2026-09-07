# Campaign-2 ordered-input entry encoding

2026-09-06. **ACCEPTED: first-profile canonical entry layout.**
Label: `C2-INPUT-ENC-001`. Accepted at `campaign2-ordered-input/0.1-candidate`. No allocation; implementation authorized.

## Inspected authority and substrate

Accepted ADAPT D, ADAPT_001_FACT_INGRESS_DRAFT.md §InputOnly bootstrap/restore, requires the
complete original ordered input manifest. Its list order controls initial EventId/EventSequence
allocation. Each entry contains DueAt, Phase, EventTypeId, Payload and Dependencies. IDs and
causal parents are allocated by the compiler; callers cannot supply a queue or schedule sources.
Creation and restore must commit/check the same exact manifest against OrderedInputSequenceDigest.

CAMPAIGN2_FACTORY_DESIGN.md §3 permits host API packaging of existing canonical artifacts and
forbids another canonical manifest wrapper. It does not specify the value layout of one unscheduled
input entry. C2-PERSIST-001 requires the complete original manifest separately on restore, retaining
the same commitment and input-only pending-set equality; it supplies no entry codec.

| Existing surface | Finding |
|---|---|
| src/substrate/scheduler.ts EventEmission | Host interface with the five relevant values plus optional additional parents. It is not a canonical record or a manifest-entry decoder. |
| src/substrate/persistence.ts scheduledEventValue/restoreEvent | Type 130/1 already includes EventId, EventSequence and CausalParentEventIds. DueAt is canonical signed integer; Phase is unsigned. It encodes scheduled work, not caller-supplied unscheduled inputs. |
| docs/formal/CANONICAL_RECORD_REGISTRY.md and frozen C2/VAL/origin/content-ID allocations | No unscheduled EventEmission/OrderedInputEntry record or schema allocation was found. |
| src/substrate/identity.ts | commitManifest accepts a canonical value; RunIdentity commits its digest. Generic encodability does not choose the admitting first-profile entry layout. |
| Campaign-0 identity/persistence controls and phenSem001Run | Ordered-input commitments include generic fixture values or an empty list, not an authoritative Campaign-2 five-field bootstrap grammar. |

The five operands are fully expressible. This is a canonical packaging choice, not an architectural
or mathematical blocker. Choosing record IDs, map keys or tuple order locally would choose new
RunIdentity bytes and a restore language that the inspected authority has not explicitly fixed.
Type 130 cannot be reused by accepting caller IDs, synthesizing placeholder IDs or deleting its
required fields. Fixture encodings cannot silently acquire production meaning.

## Accepted resolution

Retain the outer canonical ordered list, with every entry a fixed five-item canonical list:

```text
OrderedInputManifest = list<Entry>
Entry = list([
    signed(DueAt),
    unsigned(Phase),
    EventTypeId,
    Payload,
    Dependencies
])
```

This uses existing cenc/1 tags and the exact scalar representations of type 130 fields 2/3/5/6/7.
No new canonical record, namespace, identity, registry, wrapper, save field or numeric allocation.
List order is authoritative and retained exactly; identical input entries are allowed as distinct
authored occurrences, and must not be sorted or deduplicated. Entry arity is exactly five.

EventTypeId uses the existing admitted family and exact first-model event inventory. Payload uses
that event's exact admitted schema. DueAt satisfies existing SimInstant bounds; phase is registered
and schedulable. Authored adaptation sources additionally retain D's strict positive DueAt, phase
110, type-304 payload, empty-list dependencies and compiler-only origin. Other admitted initial
event types retain their own dependency/time rules; this encoding grants no new scheduling rights.

The compiler allocates all initial EventIds/EventSequences in manifest order from accepted defaults,
with no parents. The exact original list bytes determine OrderedInputSequenceDigest. Restore
requires that same list and recompiles the scratch initial schedule for D's pending-set comparison.
No replay, cancellation permission, source certificate or runtime scheduling API is introduced.

Record this as the first Campaign-2 input-profile interpretation beneath accepted D and factory
design; bind its exact version with the concrete RulesVersion/bundle/profile before FCT-5. Do not
narrow generic commitManifest or reinterpret historical input/coupling records.

## Controls to freeze before implementation

- Reject wrong list/arity, wrong scalar tags, caller IDs/parents, unknown event kinds and payloads.
- Preserve exact order and repeated entries; permutation changes commitment and initial allocation.
- Enforce authored-source D constraints without granting initial or runtime access to consumer types.
- Equal complete input bytes compile byte-identical initial schedules; changed source payload changes
  RunIdentity, without accepting a supplied digest as authority.
- Restore rejects a different original manifest and any mismatched input-only pending subset.
- No source capability is minted before manifest/RunIdentity and event admission succeeds.

These encoding controls are proposed, NOT PASSED. Existing FCT-G..L component passes remain accepted.

## Work completed while isolating this decision

Composed PRJ/IDN controls now combine static/dynamic uniqueness, grammar coverage, read-only/writable
separation, role compatibility and recursive key failures in one admitted contract. ADAPT's domain
and timeless-state compiler and V06 declaration/rule refinements have component tests. The shared
transition registry now admits the two exact registration versions under the unchanged V04 singleton;
it derives the V06 output schema closure without pretending V04 cardinality validates V06 results.

The next authored-source bootstrap must choose this layout before it can authenticate actual
InputOnly creation and connect D to the existing admitted-input authority. No second ADAPT admission
capability or provenance mechanism has been created. Full source/bridge adapters, E evaluation,
phase-140 settlement, create/restore and integrated qualification remain pending.

Validation of the completed component work: 46 source test files / 367 tests PASS;
TypeScript/Vite build PASS. All four allocation audits PASS (60/40/43/37 checks).
These results do not qualify the proposed input encoding or V06 runtime admission.
Reference source and frozen allocation bytes remain unchanged.

## Acceptance clarification — 2026-09-06

The accepted RulesVersion/semantic bundle selects this exact profile before decoding; shape,
event kind and fixtures never select the profile. Concrete binding remains required before FCT-5.
Positions 0..4 and arity five are frozen; no alternate map, record or extension field. A future
extension needs a new accepted version. Dependencies are event/profile-owned: authored facts
require exact list([]); no other initial event activates without an explicit owned grammar.
Initial parents are empty. Changes to authored counts change RunIdentity, not ModelIdentity.

INPUT-ENC-A..K freeze respectively: exact list/arity; scalar tags; kind/schema admission;
dependency grammar; order; repeated occurrences; no caller scheduling identities/parents;
deterministic schedule bytes; RunIdentity-only payload variation; restore manifest mismatch;
whole-manifest admission before source authority. All start NOT PASSED pending implementation.

Reference intake: SUB-003 and SUB-008 retain accepted identity/order/persistence ports; SUB-011
retains the preceding decision history. No historical character mechanism is introduced.

Implementation checkpoint — 2026-09-06: profile/component controls and source-to-V06/adaptation-only composition are recorded in CAMPAIGN2_INPUT_ADAPTATION_IMPLEMENTATION.md (48 files / 373 tests, build and four allocation audits PASS). The preceding NOT PASSED list records the pre-implementation state; it does not assert integrated factory qualification. New bridge provenance decision is separate C2-BRIDGE-OBS-001.
