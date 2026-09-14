# Formation governance canonical root: first symbolic shape

2026-09-12. PARTIAL SYMBOLIC DRAFT. No permanent record, field, namespace or member
allocation. Consumes the accepted canonical-root ruling. Not whole-shape acceptance.

## Proposed minimal carrier

| Symbol | Fields / meaning |
|---|---|
| FormationGovernanceState | Value: one FormationGovernanceValue singleton leaf |
| FormationGovernanceValue | AdmittedSources: map QualifiedFormationSource→FormationAdmission; SuccessfulFormations: map QualifiedFormationSource→FormationSuccess |
| QualifiedFormationSource | Character: accepted qualified CharacterId; Selection: actual SelectionOccurrenceId |
| FormationAdmission | AcquisitionKind: closed EventContinuant / Interoceptive discriminator |
| FormationSuccess | Acquisition: sole AcquisitionOccurrenceId; FormedAt: actual SimInstant; CompleteLoss: exact Boolean |
| FormationGovernanceProfile | MaximumQualifiedSources: immutable finite N |

Character is obtained only through exact authenticated source PRJ/IDN. Selection is
the existing occurrence role, not a new source identity. The actual source producer
and observer are authenticated before constructing this key; no free-standing key
grants a read capability. Whole-source admission must verify that this pair is injective
over the admitted producer domains. If not, extend the symbolic key explicitly before
acceptance; do not compare raw payload labels across unrelated namespaces.

Kind lives once in the admission map. A success entry's kind and subject are supplied
by its exact admission key/entry, not duplicated fields that can disagree. Component
string fields are inspection operands, not this public typed layout. No samples,
encoding factors, graph state, cues, old content or resolvers occur in either map.

Propose a present, complete empty singleton at initialization. Both maps admit empty
values; the singleton is never removed. One leaf makes source/success relationship
validation atomic and avoids broad per-character iterators for an exclusively protocol
reader. No RunId field is duplicated: the root belongs to its containing run state.
N is not mutable state. Exact public bounds and initial-state roles remain packaging
work; component64 is not automatically the chosen N.

## Authority and invariants

Propose authority/formation-governance with only the exact singleton path. No evidence
producer or cognitive writer receives it. A dedicated authenticated runtime hook owns
the protocol patch, with expected-old checks, structural diffs and complete validation.
Classify the path as RuntimeProtocol, a noncognitive category. Do not register it under
route/character-learning merely because its metadata concerns successful learning.
The exact compiler representation of this category/hook is still pending.

AdmittedSources grows monotonically and has at most N entries. SuccessfulFormations
is a subset of it, with unique acquisition occurrences and immutable successful mapping
and FormedAt. Future times reject. CompleteLoss may become true only from the governed
ordinary-memory owner's result; true never becomes false for the same acquisition.
Partial child loss leaves the Boolean false while any individuated child survives.
No protocol-state operation can restore or query those children.

Domain enrollment precedes positive eligibility, so an empty admitted selection consumes
a domain slot but no acquisition. N+1 rejects as profile admission without cognitive
output. Candidate protocol changes and memory changes commit or roll back together.
The protocol hook consumes an explicit owner-result association for success/disposition;
it must not read provisional sibling state or turn a diagnostic output into authority.
Exact result carrier and registration are pending; no terminal child event is proposed.

## Inspection and evidence

Generic state/0.2-candidate supports declared singleton paths, unique authorities,
expected-old patches and read-domain exclusion without psychological classification.
The data-driven state compiler accepts exact registered record grammars and does not
require these generic paths to be episodic memory. The new public model still needs
explicit noncognitive classifier and hook coverage; generic capability is not activation.

[Nineteen tests pass](FORMATION_PROTOCOL_AUTHORITY_TESTS_REV2.json): fourteen metadata
component cases plus five actual generic state tests. The latter exercise wrong-authority
rejection, direct/derived read exclusion, distinct canonical protocol states, canonical
state-value reconstruction without trace/output inputs, and forbidden removal/stale
preconditions. Synthetic path1 and fixture namespaces20001/20002 are not production
allocations. The fixture list is not a candidate public record codec.

Revision1 test receipt is preserved. Revision2 narrows the fixture's empty selector
tuple for TypeScript path/pattern compatibility; no runtime semantics changed.
TypeScript and reference-boundary checks pass.

State-value reconstruction is not SchedulerSave byte loading or full factory restart.
The tests do not prove that an authorized writer cannot maliciously reset state: the
public domain validator must enforce monotonic protocol transitions. Nor do they prove
the memory-owner result join, immutable profile N, trace-independent public continuation
or whole-instant protocol rollback. Those remain required before qualification.

Next: exact qualified-source roles, hook/owner-result join and classifier declaration,
whole symbolic closure, separate allocation, model packaging and public persistence.
