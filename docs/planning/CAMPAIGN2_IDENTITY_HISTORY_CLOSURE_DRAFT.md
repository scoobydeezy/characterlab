# Bounded identity history representation

Status: DRAFT, internal closure proposal. This refines the state proposal in
CAMPAIGN2_TASK_REASON_IDENTITY_DRAFT revision2 without accepting or allocating it.

## Avoid duplicate authorities and recursive historical payloads

Do not store both mutable Support/Opposition counters and an independently mutable
expression log. Do not nest a full Qualification→Expression→ReasonContext containing
the previous identity history into each new history entry: that would recursively
duplicate old state and undermine the claimed64-entry bound.

Propose these symbolic ordered records:

* TaskIdentityKey: CharacterId, IdentityChannelId.
* TaskIdentityContribution: QualificationOccurrenceId, DecisionResolutionOccurrenceId,
  OccurredAt, SignedContribution.
* TaskIdentityEvidence: Contributions, an ordered list of TaskIdentityContribution.
* TaskIdentityState: Evidence, a canonical map TaskIdentityKey→TaskIdentityEvidence.

The two occurrence references reuse actual output identities from the live qualifier
and its exact expression source. They are not separately allocated provenance aliases.
OccurredAt and SignedContribution are exact admitted output projections. State source
authenticity is established when writing and again by complete-prefix restore; a
standalone well-formed arbitrary summary is not an admitted contribution.

Only the fixed CommitmentFidelity channel is admitted in this first profile. The
identity-channel family/member is symbolic pending namespace inventory. This is a
semantic axis discriminator, not an authored character trait or strength flag.
The key's CharacterId uses the accepted semantic referent qualifier. Identity has
one new separately owned root/leaf/authority; none of their numbers is chosen here.

Reuse the existing Campaign2StateFamilyId/1031 member identity-disposition. Actual
firstModelCandidate inspection shows that logical family is already present with
empty storage. In this successor only, materialize that row with the new root and
one symbolic leaf/identity-evidence member in1032, owned by the new symbolic
authority/task-identity-evidence member in1025. Do not allocate a second logical
identity family or leave a contradictory empty row beside the physical declaration.
The old model's empty identity-disposition row remains frozen. This storage addition
does not imply that identity and general dispositional adaptation share a mechanism.

The list has1..64 entries. An absent key denotes empty identity; an explicitly empty
entry rejects. Times are positive and strictly increasing, because at most one subject
choice is admitted per instant. Qualification and resolution references are separately
unique throughout the list. Contribution e is exact, nonzero and in[-1,1]. No sorting
by opaque occurrence number may substitute for chronological application order.

The first witness requires the entire identity map absent in S0. A successor allowing
prehistory would need its own provenance/admission contract. Profile controls disabling
the identity source may retain existing state without reading or deleting it.

## Exact derived statistics

Fold the list in recorded order, starting Support=Opposition=0. For every e:

    Support = RoundEven(1000000*(Support+max(0,e)))/1000000
    Opposition = RoundEven(1000000*(Opposition+max(0,-e)))/1000000

This preserves the actual historical per-application quantization, including ties.
Do not quantize the final sum once: rounding is attached to each application and
can depend on the existing lattice integer's parity at an exact half-step.
Then I=(Support-Opposition)/(K+Support+Opposition), with model K>0.

Support and Opposition are derived outputs of this fold, not separately stored fields.
This is a representation choice, not a reduction of identity evidence to a trait flag.
State queries retain the full canonical source path/value and name the fold/version
in derived-value provenance. A consumer gets no general expression archive handle.

A nonzero e that rounds to no increment remains in history. It consumes one slot and
cannot later be reapplied merely because I stayed unchanged. The source basis contains
the actual qualification references of all entries with unit membership weights.
The raw standing source remains I per matching task nucleus, as required by Phase2.97.

## Application ordering and ownership

The qualifier always schedules one identity-application child at140, including an
authentic ZeroAuthorship/NoExpressedChannel rejection. The rejected branch resolves
no write target and reads no identity prior. An eligible branch resolves the exact
subject/channel key from its authenticated source before any prior read, then appends
one entry. Repeated identity, non-increasing time or a65th entry rejects atomically.

Integrate this as a separate bounded prepared-stage participant, not an ADAPT patch
or an unguarded ordinary140 handler. Existing memory/prediction/task/ADAPT preflight,
conflict detection and completion guards still apply. Multiple identity children for
one subject/instant reject before priors, even if one would be rejected/no-write:
one expression per admitted cognitive root is the owning cardinality invariant.
All prospective writers validate complete candidates before publishing any state,
private binding, allocator, random address, trace or output. Partial execution cannot
leave committed identity or consumed qualification references behind.

A rejected qualification's application produces no state patch and no extra semantic
output; its genuine no-write transition remains traceable. An eligible application
also emits no semantic output. Evidence existed at130; this step is persistent learning.
The applied result and exact diff belong to the shared transition trace, not another
identity-evidence record with a duplicate occurrence.

## Persistence and random relevance

Full-prefix restore reexecutes the generated choices, qualifier and applications and
compares exact retained entries, folds, state bytes, output/trace bytes, allocators
and queue. Reordered history, substituted source IDs, edited e or omitted rounded-zero
entry must reject, even if the edited history happens to yield the same strength.

The retained DecisionResolutionOccurrenceIds are causal roots of possible random
draws. They are therefore real inputs to the successor random-relevant-authoritative-ID
projection. The projection also needs exact actor/task/action subject identity coverage
from the retained IDN, task and plan state. Specify its canonical traversal in final
persistence packaging; do not call all historical IDs irrelevant because the oracle
is reconstructed from prefix. No existing no-RNG PERSIST qualification is widened.

## Proposed IH-A..L, NOT PASSED

Empty S0; exact positive/negative accumulation; half-even parity across successive
entries; raw-sum-once mutant; same-strength altered history; duplicate qualification;
duplicate resolution; non-increasing time;64/65 boundary; rounded-zero retention;
rejected application performs no read/write; whole-stage rollback and prefix replay.

Whole shape still requires complete source/output/registration schemas, namespace/
role inventory and the joined prepared-stage and persistence profiles. This document
chooses a finite nonrecursive representation without allocating or implementing it.
