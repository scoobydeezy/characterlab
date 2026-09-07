# Campaign-2 ordered-input and adaptation-only checkpoint

2026-09-06. Incremental implementation after acceptance of C2-INPUT-ENC-001.
No canonical activation, integrated factory qualification or global ADAPT/PRJ/IDN/VAL gate PASS.

## Implemented scope

- `campaign2-ordered-input/0.1-candidate`: exact five-position canonical entry list, signed
  DueAt/unsigned Phase, explicit profile selection, complete-list validation before compilation,
  preserved order and repeated entries. This component currently admits only authored facts;
  other initial kinds cannot borrow generic CanonicalValue dependency permission.
- Creation commits the complete manifest and initial state into RunIdentity, then compiles initial
  event IDs/sequences from zero in manifest order, with empty parents. Caller-visible schedule
  copies do not own the internal compiler evidence. No public queue/allocator insertion API.
- Additional D restore validation recomputes the manifest digest, recompiles all admitted original
  entries, and compares exact pending InputOnly events at B, including identities, sequence, time,
  phase, payload, dependencies and parents. Existing save validation is still separately required.
- A private runtime brand identifies compiler results. The fixed source adapter checks the actual
  source against the original compiled schedule before allocating one shared-allocator AAI/1118,
  including for zero count. It copies Fact→Basis and uses actual DueAt. No source certificate,
  replacement EventId or second transition-admission issuer is introduced.
- The shared ingress implementation now accepts V04 and V06 registration schemas. The authored
  producer branch selects exactly one matching AcceptedBasis consumer, retains the actual source
  as parent, and uses the same staged-child association and private admitted-input issuer as EVID.
  V04 singleton bytes/version and V04 record grammar remain unchanged.
- Closed E component resolves matching rules and exact composite target/gate paths from admitted
  facts and committed rules. Whole-batch target collisions precede reads. Evaluations use fresh
  direct projections over one common snapshot, TargetPrior then optional GatePrior, and scalar-only
  CountStepWithBaselineGate. Dispatch/evaluation identities use the shared allocator. Patches are
  staged until the private final barrier; zero magnitude means absence, never a stored zero.
- `adaptation-settlement/0.2-candidate` has an optional trusted internal scheduler adapter. It
  checks retained references before handlers, groups phase-140 work, executes it with ordinary
  event/work accounting, installs the private candidate only after the batch, and checks final
  references plus mandatory ingress before commit. All live capabilities close on success/failure.
  Ordinary scheduler users retain the existing path when this adapter is absent.
- The adaptation-only composition exposes settlement and snapshots, not scheduling or allocation.
  It validates the initial state against the compiler-owned commitment and uses the compiler-owned
  schedule/allocator defaults, rejecting altered caller copies. Runtime source emission is forbidden.

## Evidence and limits

INPUT-ENC-A..J have component controls for layout/tags, kind/schema/subject admission, dependencies,
order, duplicates, absence of caller scheduling fields, deterministic schedule bytes, run-only input
variation and manifest/pending-set mismatch. INPUT-ENC-K has construction/source-brand controls:
invalid trailing input returns no compilation, forged compilation fails, altered/repeated/expired
source execution fails before semantic occurrence allocation. Full create/restore facade proof and
concrete RulesVersion→bundle→input-profile selection remain FCT-5 obligations.

Composed source→V06 controls cover generated-child admission, substituted basis rejection, zero
count with nonempty dispatch/evaluation output, shared occurrence allocation, terminal output closure
and refusal to finish an incomplete instant. Actual scheduler controls exercise positive tolerance
change, byte-identical zero-count state, cross-input no-op collision, magnitude failure and work-limit
failure with complete state/queue/allocator/clock/output rollback.

These are incremental proofs, not complete AD-E/AC gates. Remaining coverage includes all five
families, negative-step removal, frozen-gate permutations and read segments, no-match dispatch,
time-varying retained-reference failures, complete mutation controls, accessor collision composition,
full transition trace/diff adapters, restricted restore continuation, and the both-affected bridge.
The internal runtime currently records actual reads directly; it is not the final FCT-4 trace facade.
An adaptation-only runtime cannot claim the both-affected phenomenon or EVID integration.

The concrete first-model bundle binding is not inferred from a tuple shape, source event or fixture
name. The input component takes an explicit version from its trusted construction caller; the
public data-only factory and its fixed binding remain unimplemented. Arbitrary external model
identities or internal component callbacks are not an activation API.

## New decision boundary

C2-BRIDGE-OBS-001 reproduces an actual mismatch: inherited compilePermittedEvidence returns the
pulse TruthRecordId in SafeSourceReferences; accepted D requires empty references and forbids
substituting a hand-authored result. A scoped versioned projection amendment is prepared in
CAMPAIGN2_BRIDGE_OBSERVATION_DECISION.md. Neither that projection nor a substitute bridge has
been implemented. No accepted measurement, SEM or EVID behavior was changed to hide the mismatch.

## Validation

- Full source suite: **48 files / 373 tests PASS**, including the mismatch reproduction.
- TypeScript/Vite build: **PASS**; reference import-boundary check: **PASS**.
- C2/VAL/origin/content-ID allocation audits: **PASS**, 60/40/43/37 checks.
- No new permanent numeric allocation; frozen allocation bytes and reference source unchanged.

Reference intake retains SUB-003 identity/order and SUB-008 transactional/persistence discipline;
SUB-011 preserves the accepted decisions and records the newly found mismatch explicitly.
