# EMB-001 symbolic consolidation and adversarial review

2026-09-10, revision1. **CURRENT COMPOSED PROPOSAL; WHOLE SHAPE WITHHELD.** This is
the review entry point for the bounded reserve→current evidence→pressure subprofile,
including external replenishment. It does not close BODY+MULTISOURCE or authorize code.

Earlier documents remain rationale/history: [reserve](CAMPAIGN3_EMBODIED_MOTIVATION_DRAFT.md),
[observation](CAMPAIGN3_EMBODIED_OBSERVATION_ADMISSION_DRAFT.md),
[ingress](CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md),
[registration](CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md), and
[replenishment](CAMPAIGN3_EMBODIED_REPLENISHMENT_PROFILE_DRAFT.md).
The explicit corrections below govern the composed **proposal** where those drafts
differ. No accepted contract or historical proof receipt is rewritten.

## 1. Scope boundary and review verdict

This model is an idealized consumable fuel stock with exact linear depletion,
saturating external replenishment, deterministic finite-bin self-observation and
guaranteed-deficit pressure. It stores no Need, reads no authoritative truth in
pressure, learns nothing and chooses no action. It is a useful prerequisite experiment,
not the full proposed BODY phenomenon, physiological realism or a second reason source.

Architecture's interoceptive boundary and provisional derived-pressure preference are
preserved. CTL-001 remains the stored-meter comparison; MEC-003/004 retain decomposition
and the truth cut; MEC-012..020/EXP-009/014 remain receiving/agency obligations outside
this subprofile. Missing those paths blocks a motive-competition verdict, not drafting
this body/evidence subprofile. No whole-corpus or reduction verdict follows.

## 2. Corrections from the composed review

| Finding | Proposed resolution |
|---|---|
| Body bindings appeared in source declarations but were also assumed by replenishment/restore. Their common owner was implicit. | Add one immutable ReserveBodyRegistryDefinition{Bindings}. Source and writer registrations each reference its exact DefinitionId. No copied authoritative maps. |
| A sample schema can match several observers' pressure rows; selecting on schema alone is ambiguous. | Candidate matching includes exact authenticated producer definition, sample O/channel, pressure definition/channel owner, producer version and present/absent branch. Require exactly one match **after** those comparisons. No first-row selection or global single-row assumption. |
| The ingress draft allowed sample event type to vary by branch even though it is an original input. | One fixed InputOnly sampling EventTypeId at10. Availability does not rewrite an already compiled event. Pressure60 has two registered event types, one per input schema; slots11..14 use fixed types and the private carrier union. |
| Several symbolic unions had prose but no inventory entry. | Name EmbodiedSample, PressureResult and LevelChainCarrier explicitly; commit separate tag/payload matrices, with unknown tags and extra fields rejected. Numeric tags remain unallocated. |
| ReadDomain could be mistaken for permission to read any declared body. | Finite source/writer domains bound maximum authority; runtime exact key equality to IDN result or world definition is separately mandatory. Equal-valued cross-body substitution must reject. |
| Sampling metadata may reveal no-operand status but must not become evidence of low fuel. | Preserve unavailable as closed computation metadata, excluded from evidence index/SEM/learning; only its pressure consumer is admitted. Future absence inference requires a new seam. |
| Replenishment result has no occurrence ID although other outputs do. | Keep it trace-only and event-owned, with no generic transition-ingress rule. This is explicit scope, not accidental missing identity allocation. |
| Generic interval grammar alone admits values the sensor cannot produce. | Validate exact bin grid and endpoint rule against the committed channel, in addition to authenticated producer binding. Arbitrary finite intervals cannot enter pressure merely because L<U. |

## 3. Consolidated record/union inventory

Machine companion: `CAMPAIGN3_EMBODIED_SYMBOLIC_INVENTORY_REV1.json`. It inventories
ordered field names and closed symbolic unions, **not final codec types or numbers**.
The draft-specific replacements are:

- ReserveBodyRegistryDefinition: Bindings (canonical set of ReserveBodyBinding, unique C).
- LevelSourceDefinition uses BodyBindingDefinitionId in place of embedded BodyBindings.
- ReserveReplenishmentRegistration adds BodyBindingDefinitionId immediately after
  DefinitionIds. Both resolve the same singleton body registry in this profile.
- EmbodiedPressureOutput.Sample has type EmbodiedSample, the exact present/absent
  records already produced. PressureResult Known requires one rational Value;
  Unavailable forbids a payload. A present sample pairs only with Known and an
  unavailable sample only with Unavailable, including exact arithmetic validation.
- LevelChainCarrier Present requires Sample=EmbodiedLevelObservation and
  ReservedExperienceId; Unavailable requires Sample=UnavailableLevelSample only.
  Neither branch introduces a new observation or carrier occurrence.

Existing wrappers for canonical schema references, state domains/patterns, output
definitions, ingress, identity roles, occurrence rules, NoStateWrites, StatePatch,
StructuralMutationDiff and TraceRecord are reused only under their actual layouts.
The inventory does not silently mint replacements for them. Field-type closure must
identify exact existing schema/version references before any allocation request.

## 4. Identity, unit and version decisions

Only one new occurrence family is proposed: PressureOccurrenceId. Sample identities
reuse1115; SEM reuses1106. Scheduler identities own source and trace-only result
occurrences. New body/state/interval/definition/carrier records have no arbitrary
occurrence identities. New record types and member payloads are all unallocated.

Existing identity families remain the address spaces for ObserverId, qualified
CharacterId, DefinitionId, event, transition, seam, accessor, mutation authority and
observation unit. Required **new symbolic members** include the reserve anchor accessor,
reserve sole owner, fixed sampling/chain/pressure/replenishment event kinds, source/
pressure/writer registrations, definition kinds and exact supported seam/profile
versions. Their complete payload list is still a blocker; descriptive words in this
packet are not permanent registry members.

Propose the local fuel token spelling `unit/embodied-fuel-stock` under a future
versioned fixed-token contract. It is **not accepted or allocated** by this proposal.
Its scalar dimension is the amount of the idealized consumable resource. No mass,
energy, SI, REG, fixture-pulse equivalence or conversion law is implied. Both body and
sensor must use this exact same token in the proposed profile. No DomainValidator or
unit registry is needed for a fixed member; namespace and exact-member checks stay
separate, as in the accepted singleton control. Old profiles retain their closed set.

Each draft seam/version remains proposed. In particular, body materialization,
level observation, pressure admission/production, replenishment and profile/trace/
persistence dispatch need one explicit version-to-schema matrix; do not select the
newest definition or execute a draft version string.

## 5. Composed invariants

1. Only the writer can set an anchor. Its expected prior is the exact staged old
   anchor, its path matches the authenticated world target, and all writes are atomic.
2. Sampling authenticates original source, resolves IDN once, checks channel/body
   binding, and reads exactly one anchor only on permitted+available branches.
3. Materialization is pure exact arithmetic; it does not write a rounded q cache.
4. Present samples support exactly one authenticated current SEM. Missing samples
   create no SEM, index entry or negative body proposition.
5. Pressure admission carries exact sample bytes, not a reference-based payload lookup.
   It independently projects the same subject and receives no anchor or truth handle.
6. Pressure writes no persistent state and has no learning/adaptation route mapping.
7. Sampling at T precedes replenishment at T; only later sampling sees that delivery.
8. For S samples/R deliveries, domain events=6S+R, generated events=5S and runtime
   ordinal advances=3S. Absent branches consume private reservation padding.
9. Only whole-instant saves are admitted. Both original pending-input subsets must
   match; no trace/serialized token authenticates an internal child after restore.
10. Same permitted interval/H yields the same pressure value. Full record equality
    additionally requires matched identity/time/channel/support allocation; never
    confuse semantic equality with cryptographic equality of different models/records.

## 6. Validation ownership and fail-closed behavior

| Boundary | Obligations |
|---|---|
| Model construction | Exact schemas/versions, unique definitions/body keys, role compatibility, unit/capacity/rate/bin/threshold domain, supported registration dispatch, one matched consumer per branch/channel, sole writable owner. |
| Source admission | Exact original scheduled source, input kind, channel/definition membership, source single-use before selectors/reads. |
| PRJ/IDN | Existing role/path/missing-value ordering; no alternate roster access. |
| Body read/write | Exact target path and binding; anchor presence/value/time; declared read trace and owner; WRT patch/precondition/value checks. |
| Observation | Exact permitted grid interval and transformation; no forbidden body/provenance payload. |
| SEM/ingress | Actual produced sample and same-opportunity reservation/freeze; exact child association, branch, liveness and single use. |
| Pressure/output | Exact channel/O match and input bytes; Known/Unavailable consistency; exact p=max(0,H-U)/H; allocated output identity. |
| Trace/commit/restore | Fixed phase/output/read/patch topology, no unfinished tickets, complete rollback and pending-source/model equality. |

No boundary converts malformed data into absence or valid zero. Final typed failure
codes are **not yet frozen**. Reuse actual existing failure classes where semantics
match; define new codes only where the owning stage needs a distinct failure. Generic
INVALID_MODEL prose alone is insufficient to claim final canonical failure behavior.

## 7. Evidence and remaining blockers

Existing results are deliberately narrow: nine SEM component checks, three projection
isolation tests and six state tests pass in their prior receipts. Arithmetic examples
were checked separately. None executes the new source, finite-level codec, same-body
dispatch, branch budget, writer or public restore. All EMB/EOBS/EING/EREG/EREP vectors
remain NOT PASSED; repeated preservation checks do not promote them.

Whole shape is withheld on these concrete items:

| Gate | Required closure |
|---|---|
| SYM-1 codec types | Every ordered field's exact canonical type, requiredness, existing schema/version reference, union matrix and canonical collection ordering. |
| SYM-2 vocabulary/dispatch | Complete symbolic member and version matrix, source/root admission dispatch, VAL predicates and exact typed failures. Fuel token acceptance remains explicit. |
| SYM-3 profile witness | Exact bounded authored definitions/inputs, expected complete trace/output/allocator/restore vectors, with no hidden source or subject default. |

These are implementation-independent decisions that can be resolved in the next
draft pass. No new human preference is needed to continue preparing them. After those
are closed, review the whole composed shape before separate numeric allocation and
model packaging. Action knowledge, non-task reason identity and cross-family receiving
remain additional work before BODY+MULTISOURCE, not silently deferred qualification.
