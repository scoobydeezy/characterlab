# Canonical State Model

**Status:** accepted Campaign 0 substrate contract, version identifier `state/0.2-candidate` (accepted 2026-09-01)

## State classes

| Class | Examples | Authority rule |
|---|---|---|
| Constitutional | body parameters, developmental constraints | Persistent and versioned; never inferred from display values |
| Developmental | age-linked stage, maturational state | Advanced only by its named transition authority |
| Dynamic embodied | physiology, regulatory state | Current authoritative values with explicit time anchoring |
| Learned persistent | beliefs, expectations, skills, habits, relationships, identity evidence | Mutated only from typed learning/consolidation evidence |
| Character-relative epistemic | encoded experience, recollection, recognition, person models | Contains only information available through permitted observation |
| Active cognitive | workspace, candidate options, reasons, appraisals, intent, pre-attempt snapshot | Event-scoped unless a seam explicitly persists it |
| World truth | actual events, attempts, outcomes | Not character state; readable by the character only through observation seams |
| Trace | authoritative execution/provenance record | Not character knowledge and never a hidden cognitive input |

### Accepted Campaign 1 state obligation — observer-relative perceptual tracks

Amended `SEM-001A` establishes that active perceptual continuant-files are authoritative observer-relative state owned solely by the perception seam. A `PerceptualReferentId` means only that this observer's perception currently treats a perceived person, discrete object, place, spatial region, or other continuant-file as continuous; it asserts neither stable truth identity nor kind. The authoritative state also includes a next-track sequence for each observer. Each sequence advances only on that observer's `NewTrack`, is monotonic, persists across save/load, and never reuses a value. Allocations by another observer cannot alter it.

`PerceptualTrackTransition` is perception-owned provenance for deterministic `NewTrack` or `ContinuesPriorTrack` from observer-side detections and permitted supporting observations. It is not automatically character-accessible semantic evidence. False continuity and false discontinuity remain committed observer-relative history until a separately authorized perceptual mechanism changes future tracking; truth comparison and recognition cannot retroactively repair, merge, or rewrite tracks. Track ordinals are opaque identity and cannot contribute semantic or psychological magnitude.

The record schemas and numeric IDs remain blocked by the parent `SEM-001`. When implemented, the active-track state, per-observer allocator map, transitions, and outputs participate in whole-instant staging, rollback, canonical save/load, and exact replay.

`SEM-001C` establishes a parallel but distinct observer-relative event-file state. `PerceptualEventReferentId` means that this observer's perception currently groups permitted role participation as one continuous occurrence; it does not assert one truth event. Active event-files and each observer's next-event sequence are perception-owned, persisted, never reused, and transactionally restored. False event merges and splits remain committed perceptual history without truth repair. Event-file ordinals are opaque, and neither experience identity nor continuant-file identity may substitute for event-file identity.

## Mutation authority

Every persistent field has exactly one registered mutation authority. Other seams emit typed evidence or requests; they do not write the field directly.

| State family | Proposed sole authority | Status |
|---|---|---|
| immediate belief/expectation evidence | Learning Evidence application | unresolved specification |
| episodic/imprint memory | Memory encoding/consolidation | unresolved specification |
| associations | Consolidation | unresolved specification |
| values | Value learning/consolidation | unresolved specification |
| skills | Procedural adaptation / skill-learning transition | unresolved specification |
| habits | Habit learning/consolidation | unresolved specification |
| person models | Person-model learning/application | unresolved specification |
| relationships | Relationship learning/consolidation | unresolved specification |
| regulatory adaptation, tolerance, sensitization, and accumulated load | Regulatory adaptation transition | unresolved specification |
| self/identity/disposition | Identity/dispositional consolidation | unresolved specification |

“Proposed” is not permission to implement. The seam ledger must replace each unresolved row with a versioned contract before code writes that state.

## 0E — Transition, mutation-authority, and structural-proof substrate

### Canonical state paths

Every authoritative leaf has a canonical typed path:

```text
StatePath = RootStateTypeId / FieldId (/ Selector)*

Selector = TypedEntityId
         | CanonicalMapKey
         | StableListItemId
```

Numeric array position is not a writable identity unless the owning schema explicitly defines position as semantic state. Paths use registered numeric type/field IDs and canonical selector encodings, never property names, reflection order, or display labels.

An ownership pattern is a fixed path prefix plus declared selector wildcards for one structured family. At model construction, the registry expands or proves pattern intersections over the schema. Two mutation authorities whose patterns can match the same concrete writable path are invalid; priority or “most specific wins” resolution is forbidden. Every writable leaf must match exactly one `MutationAuthorityId`.

### Capability-limited reads

A transition never receives the complete authoritative state:

```text
Transition(
  ContractReadProjection,
  Event
) -> TransitionResult
```

The registered seam contract declares a `ReadDomain` of state-path patterns. The engine constructs a typed immutable projection containing only that domain. Forbidden state is structurally unavailable. Typed accessors record the canonical concrete paths and values actually read. The trace therefore distinguishes:

- registered possible reads;
- actual reads performed; and
- writes proposed by the result.

Derived values supplied in a projection include their source paths and transformation/version identity. A projection may redact or aggregate truth only through the registered producing seam; it may not smuggle an unavailable source value alongside the permitted result.

### Staged transition result

```text
TransitionResult = (
  SeamId,
  SeamVersion,
  MutationAuthorityId,
  ActualReadRecords[],
  StatePatch,
  EmittedEvents[],
  SemanticOutputs[],
  TraceProvenance
)

PatchOperation =
  Set(StatePath, ExpectedOldPresenceAndValue, NewValue)
  Remove(StatePath, ExpectedOldValue)
```

`Set` with expected absence creates a keyed value. Patch operations sort by canonical encoded path. Duplicate paths, ancestor/descendant overlaps within one patch, noncanonical order, mutable aliases, or a precondition that does not structurally match staged state fail deterministically. Replacing an ordered aggregate is one explicit `Set`; implementations may not disguise multiple order-sensitive mutations as an unordered collection of operations.

Before staging, the engine verifies:

1. seam and contract versions are registered;
2. every actual read belongs to `ReadDomain`;
3. every patch path is owned by `MutationAuthorityId`;
4. expected old values match the current staged state structurally;
5. new values satisfy type, domain, registry, and invariant constraints;
6. emitted events use registered schemas and legal ordering; and
7. no output contains an undeclared authoritative dependency.

Valid patches apply only to the instant's staged state. Committed state changes only after the whole-instant transaction succeeds. An aborted instant must compare structurally equal to its pre-instant state, scheduler, and allocator snapshot.

Exact structural diffs are derived from patch operations and verified against pre/post staged structures. Hashes may accelerate comparison but never prove equality or authorize a write.

## Evidence-route separation

Character learning evidence and automatic adaptation input are different typed routes:

- **Character learning evidence** contains only perceived or legitimately inferred information and may feed beliefs, expectations, memories, person models, relationships, values, habits, or identity through their registered authorities.
- **Automatic adaptation input** may contain actual physiological exposure, recovery history, or practice that the character cannot explicitly know. It may feed only the registered regulatory or procedural adaptation authority.

No record crosses between these routes implicitly. If one event legitimately affects both, the observation seam and the truth-side adaptation seam emit separate records with distinct provenance.

Under accepted `SEM-001G`, character-accessible evidence is not a state category or a universal property on a record. A consuming transition may treat an observer-safe record as evidence only when its registered typed `ReadDomain` admits the record's exact reference kind, schema, and producing epistemic seam and all same-observer, time/window, modality, feature, carrier, and applicability checks pass. Character provenance is built from those explicit references; it cannot query the omniscient trace graph. Later interpretations may cite admitted evidence but cannot rewrite or become properties of the source record. Evidence quality remains proposition-local and may later use governed exact mathematics without creating one global visibility or confidence scalar.

Accepted `SEM-001H` makes `ExperienceId` reservation transaction-local until successful instant settlement. No evidence means no reservation. Every surviving reservation corresponds to exactly one immutable envelope frozen at phase 14/124; causal-role and recognition records are separate companions/consumers and never reopen it. Current and consequence envelopes retain distinct identities even when they share continuant/event-file identities. Phase-110 authoritative outcome truth reaches character learning only through the phase-120..127 consequence lane and phase-130 perceived-outcome evaluation; separately governed truth-side adaptation remains a different state route.

## Snapshot rule

Outcome evaluation reads a frozen pre-attempt snapshot containing the chosen intent, relevant expectations/beliefs, prospection, decision expression, and declared state projections. It must not reconstruct “what the character expected” from state already changed by the outcome.

## Identity and copying

State identity uses stable typed IDs and canonical registries. Copies used for counterfactuals are deep authoritative snapshots. Shared mutable aliases between variants are forbidden. Derived caches must either be absent from equality or be reproducible and validated from authoritative state.

## Candidate acceptance gate

The ownership-overlap, uncovered-path, illegal read/write, stale precondition, patch-order, exact-diff, deep-copy, and whole-instant rollback vectors in [Campaign 0 Conformance Vectors](CONFORMANCE_VECTORS.md) pass. Acceptance covers only the enforcement machinery; each proposed psychological state-family authority in the table still requires its own seam contract.
