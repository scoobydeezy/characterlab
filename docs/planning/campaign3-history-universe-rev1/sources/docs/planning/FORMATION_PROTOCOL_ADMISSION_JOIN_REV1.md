# Formation protocol admission and owner-result join

2026-09-12. PARTIAL SYMBOLIC DRAFT, no allocation or public activation.
Refines FORMATION_PROTOCOL_ROOT_SYMBOLIC_REV1 under accepted dedicated-root authority.

## Source roles and origin

Accepted ATTENTION_ALLOCATION_TABLE assigns namespace1143 an unsigned shared runtime
ordinal. Actual attentionRuntime allocates through the scheduler, including empty
selection, and view/processing records reference that selection. The containing run
supplies identity scope. QualifiedFormationSource therefore contains the complete
SelectionOccurrenceId and PRJ/IDN-derived CharacterId, not ordinal text, a new source
occurrence, or a duplicate RunId. Character role is the accepted qualified character
role, not namespace-only membership. FormedAt is the actual formation instant, not
selection ordering inferred from ordinal magnitude.

Every admitted producer must use the same authoritative allocator and preserve exact
output ownership. Multiple producers cannot author the same occurrence; same identifier
bytes from another run are not an admitted output of this run. Body selection remains
a required explicit successor producer contract: old532/534 is not widened by this
inventory. Until that contract closes, cross-kind source coverage is not qualified.

## Two protocol hooks, one authority

Propose two closed runtime operations under authority/formation-governance:

| Hook | Authenticated operands | Candidate effect |
|---|---|---|
| AdmitFormationSource | exact completed eligible source output, declared producer/output binding, subject projection and immutable profile | extend AdmittedSources before positive-content eligibility; enforce N |
| ReconcileFormationCommit | complete terminal memory-owner result, exact batch identity and prior protocol state | add successful mappings; derive loss dispositions; preserve enrollment/history |

These are protocol operations, not cognitive TransitionDefinitions by relabeling.
No route/character-learning or character StateFamily is assigned to their writes.
The producer retains WritableStateFamilies={}; ordinary formation still owns its
existing declared memory mutation. The compiler must whitelist these operations and
their exact paths/operand sources, never accept user-supplied callbacks as authority.
Exact descriptor schema and public hook dispatch remain pending.

Enrollment runs after origin and subject admission but before any empty/zero branch
skips formation work. An empty successful instant can therefore update only protocol
membership. Whole-instant failure rolls it back. Positive formation produces candidate
acquisition evidence as already specified; enrollment does not allocate an acquisition.

## Memory-owner result boundary

The ordinary owner resolves the complete formation/retention batch under common B0.
It produces its actual validated candidate patch and a payload-free disposition view
bound to that result. Proposed view: current batch's successfully formed acquisitions
with exact source and original time, plus complete-loss changes for existing acquisitions.
Use existing acquisition identities; no OwnerResultId or second occurrence is proposed.
The binding is transaction-local identity of the validated owner result and declared
producer/consumer association, not merely matching fields on a caller-supplied object.

Governance receives only this bounded metadata projection, never child samples or
an arbitrary survivor list supplied by cognition. Check that new successful identities
match authenticated formation evidence, every loss refers to an existing/new acquisition,
and no true CompleteLoss reverses. The ordinary owner's validation establishes actual
survival; governance owns recording that disposition, not deciding it independently.
The complete owner/protocol candidate pair must validate before either commits.

The scheduler's existing adaptation-settlement/0.2-candidate adapter calls finish()
after all phase140 members, before final invariant checks. Reconciliation can occur
there without reading sibling state during execute() or emitting a phase140 child.
The owner result remains provisional until whole-instant commit: “committed result”
does not require a second later instant. Any late failure discards both candidates.
An empty-formation branch may have no terminal work; enrollment still belongs to the
same instant's protocol candidate and final validation.

## Frozen proposed proof vectors; not public passes

FJ-A exact origin and projected subject required before enrollment; forged copied ID,
foreign run, wrong producer/observer, wrong kind and unprojected character reject.
FJ-B admitted empty source changes domain only; unavailable/no admitted source does
not fabricate enrollment. This requires a precise eligibility matrix per producer.
FJ-C N+1 produces profile rejection without cognition or acquisition allocation.
FJ-D owner success with immediate total loss commits mapping and loss but no target.
FJ-E forged/stale/cross-batch metadata or result from another owner rejects.
FJ-F later partial loss preserves success and live disposition; complete loss is monotone.
FJ-G actual late failure restores domain, successes, memory, allocators, queue and outputs.
FJ-H metadata projection contains no remembered content or character-readable resolver.
FJ-I same batch with changed participant order yields the same final protocol/memory state.
FJ-J restart with canonical root and same committed profile answers protocol queries
without diagnostic/output cache authority. Existing save integrity remains mandatory.

## Remaining concrete shape work

Exact source eligibility for visual/body branches; descriptor/registration fields;
RuntimeProtocol classification in the public compiler; closed owner-result projection;
finite domain/work/output bounds; complete initial state and transition validation;
whole-shape review then separate allocation and canonical codecs. No permanent schema
or code hook is implemented from this draft. The earlier component survivor list remains
a trusted operand test, not proof of FJ-E or public memory-owner authentication.
