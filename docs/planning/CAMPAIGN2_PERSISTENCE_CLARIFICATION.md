# C2-PERSIST-001 — exact Campaign-2 save metadata, revision 2

**Status: SHAPE ACCEPTED 2026-09-06; NOT IMPLEMENTED OR QUALIFIED.**
2026-09-06. Accepted profile `campaign2-persistence/0.1-candidate` beneath existing `save/1-candidate`,
ordering, random and accepted REG/SEM/ADAPT/VAL contracts. This document freezes the exact bounded-profile metadata derivations beneath those contracts.
It adds no save field, canonical record, identity namespace, psychological state or provenance system.

Review disposition: C2-PERSIST-001 revision 2 is SHAPE ACCEPTED and factory pass 2 is
IMPLEMENTATION DESIGN ACCEPTED. No architecture blocker remains identified. The admitted-model
closure wording correction and PERSIST-I are incorporated below. PERSIST-A..I, FCT-A..F and
implementation qualification remain NOT PASSED. Staged implementation may begin; the concrete
first-profile/RulesVersion binding is required before FCT-5 and authoritative activation remains gated.

## 1. Why a clarification is required

[EVENT_ORDERING](../formal/EVENT_ORDERING.md#save-load-boundary) requires analytical anchors/remainders,
random-relevant authoritative IDs and continuing inputs such as ComparisonDrawMap. The canonical
registry assigns these to SchedulerSave/132 fields 8, 9 and 10. Neither source fixes the Campaign-2
traversal or canonical collection layout for these values. The substrate's general continuation
contract proves exact preservation of supplied values, not which values each future model must supply.

`src/substrate/persistence.ts` obtains fields 8/9 through PersistentStateAdapter callbacks and compares
their results on load. Field 10 is a caller-supplied CanonicalValue returned by load. Its load context
does not itself revalidate that value against a Campaign-2 profile. `src/substrate/transition.ts`
defaults the two callbacks to empty lists. Tests demonstrate different models: persistence.test.ts
projects one state anchor and state.randomIds; semantic fixtures return empty lists. Those fixture
choices are not a general semantic authority and cannot choose this profile's metadata.

REG's CharacterReferences map contains LinearAnalyticalAnchor values inside committed registry
definitions, not character state. RandomAddress has explicit root/purpose/subject/draw operands;
random.ts defines no universal scan of state or occurrence IDs. Therefore neither a root scan nor
an all-IDs scan is an accepted derivation. This is the narrow gap; no VAL/IDN/PRJ/EVID/REG/ADAPT
decision or historical ORD-004 verdict is reopened.

## 2. Complete adapter/value inventory

| Existing mechanism | Receiving artifact | Source and fixed responsibility |
|---|---|---|
| StateAdapter.clone | Internal transaction/snapshot copy | Copy the admitted AuthoritativeState representation; preserve exact canonical path/value structure. No additional semantic projection. |
| StateAdapter.validate | Initial/candidate/restored state admission | Apply the admitted root/key/role/value grammars, ADAPT static and REG-at-T checks at their accepted boundaries. No transition mutation-authority permission check on initialization/restore. |
| StateAdapter.canonicalValue | 132 field 5 AuthoritativeState | Existing AuthoritativeState canonical entries/path representation; state-owned data only, canonical ordering and exact value grammar. No REG declaration copied into a new state root. |
| PersistentStateAdapter.restore | Decoded field 5 → authoritative state | Existing structural state decode plus the same admission rules; no new origin/role inference or omitted-root fallback. |
| analyticalAnchors | 132 field 8 | Exact empty list under the no-run-owned-anchor proof in §4; immutable REG declarations are excluded. |
| randomRelevantAuthoritativeIds | 132 field 9 | Exact empty list for the explicitly no-draw profile in §5, conditional on profile admission. |
| SaveContext.continuingRunInputs | 132 field 10 | Not a callback, but equally authority-bearing. Exact empty list in §6; original ordered-input manifest remains separately required on restore. |
| LoadContext.handlers, invariants, schemas and work limit | Restored runtime | Internally compiled from admitted declarations; never serialized callbacks or caller selections. These are factory bindings, not additional save metadata projections. |

Fields 4, 6, 7, 11 and 12 continue to come directly from the quiescent committed scheduler snapshot:
clock, allocators, complete pending events, trace and outputs. Fields 2/3 are computed structural model/run
identities. Schema version field 1 remains save/1-candidate. Nothing in the accepted metadata definitions replaces
those fields, their exact byte/structure comparisons, or the source manifests required by identity.

State projection is fixed by the admitting state schemas, not by whichever roots happen to appear:
reject roots outside the selected model's admitted schema/ownership/read-only declarations. Preserve
admitted absence and read-only families exactly; do not synthesize zero values or empty roots.
Missing required state/value data follows existing StateContractError behavior. Metadata checks below
operate only after canonical model and saved-state validation succeeds.

## 3. Bounded profile and identity commitment

This accepted profile applies only to the first deterministic authored-fact → optional OBS/SEM consequence
→ EVID / ADAPT slice with REG references, admitted PRJ/IDN state and the accepted allocation.
It admits no stochastic transition, ComparisonDrawMap coupling, or state-owned analytical process.
REG's committed references remain model declarations; they are not run-owned analytical continuation. This restriction must be proved
by AdmittedExecutionClosure(M,P), including unexercised declared branches, before
the profile can activate. Unknown components reject; empty outputs are never a fallback for them.

The selected closed OBS/SEM D bridge and EVID/ADAPT rule paths make no random draws. Do not infer
this merely from zero draws in a test trace: the admitted model contract closure and capability inventory
must establish it. Future decision/dice or other stochastic seams need a separately accepted profile
extension; their reference preservation obligations are not retired by this bounded initial slice.

Define AdmittedExecutionClosure(M,P), where M is the exact committed model declarations and
P is campaign2-persistence/0.1-candidate with its fixed profile infrastructure. The closure includes
every admitted transition/seam, every declared branch, every model-owned executable definition
and every fixed substrate operation activated by this profile, including unexercised branches.
Before activation require three independent declaration/capability proofs:

```text
RuntimeAnalyticalAnchors(AdmittedExecutionClosure(M,P)) = {}
RandomConsumers(AdmittedExecutionClosure(M,P)) = {}
ContinuingCouplings(AdmittedExecutionClosure(M,P)) = {}
```

Build support separately establishes that the release can implement every member of that closure.
Additional build-supported contracts absent from M do not enter the closure or change metadata.
These are fixed profile semantics, not a new canonical capability record. None of the three proofs
follows from another or from observing a quiet run. An unsupported model component rejects
preparation; a supported-but-unadmitted build feature is simply outside this model.

Profile choice is identity-bearing because it changes save admission. Accepted commitment rule: the first
factory's exact accepted RulesVersion must normatively include this profile and its derivations.
The first concrete RulesVersion is not yet chosen or accepted. Before FCT-5 admits a first profile,
freeze the normative one-to-one relation for that RulesVersion: exact RulesVersion ↔ exact accepted
semantic bundle ↔ campaign2-persistence/0.1-candidate
as the exact accepted profile. The factory support matrix must bind RulesVersion to one exact
accepted semantic bundle and persistence profile, with no caller flag, default or nearest-version
fallback. This concrete binding is not a prerequisite of persistence shape review. Until that binding
is reviewed, no implementation may select these semantics through an uncommitted default or a
caller flag. No profile registry/ExecutableId/new identity field is proposed. Build support remains
a release capability outside ModelIdentity, as VAL requires.

## 4. AnalyticalAnchors — run-owned continuation only

Conceptual rule: SchedulerSave.AnalyticalAnchors preserves analytical anchors/remainders whose
current anchor state belongs to the running authoritative continuation and cannot be reconstructed
solely from the receiving model declarations. Immutable analytical model configuration remains in
its owning manifest. It is not copied into field 8 as redundant verification metadata.

Receiving field: SchedulerSave/132 field 8. For this profile, RuntimeAnalyticalAnchors(AdmittedExecutionClosure(M,P)) = {}.
The exact value grammar is canonical list([]). Its derivation traverses no state or registry values:
first prove the complete admitted execution closure has no run-owned analytical anchor
producer, then emit that one canonical value. There are no ordering or duplicate elements. This is
an independently justified profile restriction, not a default for unrecognized components.

Adding a declared run-owned analytical process without an accepted profile extension rejects model
preparation. A zero-anchor observation in one run is insufficient. Unsupported roots/processes may
not be hidden by returning empty metadata. There is no callback, arbitrary-root scan or fixture
special case. A future mutable physiological/activity anchor needs an explicit accepted source,
traversal and value grammar under a new profile version before activation.

REG v0.5 CharacterReferences anchors remain exclusively in committed RegulatoryReferenceDefinition.
referenceOperatingPoint(C,V,T) is derived from that declaration and T: no REG state root, mutable
reference occurrence or re-anchoring is introduced. A changed REG anchor changes RegistryIdentity
and ModelIdentity. Restoring an old save against that changed receiving model fails the identity
boundary; field 8 stays list([]) in both models. Saved ADAPT displacement remains in ADAPT state.

Restore still reconstructs complete REG declarations, verifies model identity, compiles the accepted
reference interpreter and checks restored ADAPT state with REG at saved T. Excluding immutable REG
anchors from field 8 neither skips these checks nor permits saved values to override the model.

On save emit exact list([]) after profile and state admission. On load require the field to be present
and exactly list([]). A nonempty list, empty map/set, missing field or other grammar rejects through
SaveContractError at the save boundary; a missing required field found by structural decoding must
be surfaced there before semantic continuation. No missingness default is allowed. These checks
perform no materialization, re-anchoring, allocation, state mutation or scheduler construction.

Revision-1 REG-copy proposal is RETRACTED. Its map representation and equal-anchor de-duplication
controls were unaccepted design proposals, not historical runtime behavior or allocation.

## 5. RandomRelevantAuthoritativeIds — exact accepted derivation

Receiving field: 132 field 9. Profile/declaration-derived, not state-derived. For the profile in §3,
the admitted set of addressable random consumers is empty, so the exact value is canonical list([]).
No ordering or duplicates exist in that empty list. Namespace IDs, observer counters, allocated
occurrence IDs, random seeds and event IDs are not automatically random-address dependencies.
They retain their normal complete state/queue/allocator/run identity storage.

Before either save or restore, profile admission must already have rejected any declared random
consumer/coupling contract outside the admitted execution closure. Returning list([]) for an unsupported
consumer is forbidden. At load field 9 must be exactly list([]), with no accepted alternate empty
map/set or omitted field. Otherwise SaveContractError. There is no scan of roots, traces, outputs
or all TypedIdentifierValues. Future actual RNG consumers require an accepted extension specifying
their exact address-input ownership and metadata projection before activation.

## 6. ContinuingRunInputs — exact accepted mapping

Receiving field: 132 field 10. This bounded profile has no comparison coupling or other additional
continuing input, so its exact value is list([]). Derive it from the admitted profile; do not accept
a free-form CanonicalValue from a public save caller. Field missing, nonempty or alternate empty
collection fails SaveContractError on restore. No missingness default is applied.

The complete original ordered-input manifest is still required externally during restore, as
accepted ADAPT D specifies, and its commitment must match RunIdentity.OrderedInputSequenceDigest.
Field 10 neither duplicates that manifest nor replaces it. Scratch initial-schedule reconstruction
and full pending InputOnly equality remain mandatory. No original initial-state value is required.
RunSeed remains in RunIdentity even when this slice makes no draws; it is not erased or repurposed.
Supporting ComparisonDrawMap or another continuing input later requires a profile extension and
exact commitment/grammar, not reinterpretation of empty field 10.

## 7. Failure ownership and qualification vectors

Invalid/unsupported profile declarations fail model preparation with the existing applicable
configuration/content/state carrier before save interpretation or activation. Once the model is
valid, metadata grammar/equality/continuation mismatches fail SaveContractError. Existing malformed
state and REG invariants retain their accepted admission errors. Build-local implementation mutants
are qualification failures, not new model semantics. No canonical error record is added.

All controls are FROZEN IMPLEMENTATION GATES, NOT PASSED:

| Control | Required evidence |
|---|---|
| PERSIST-A | Prove the complete admitted execution closure contains no run-owned analytical anchor producer and field 8 is exact list([]). Adding a declared run-owned analytical process without a profile extension rejects preparation, even if no anchor would be produced in this run. |
| PERSIST-B | Change a REG CharacterReferences anchor in a valid committed model: RegistryIdentity/ModelIdentity change, while field 8 remains list([]). The old save fails receiving-model identity validation; no saved REG mirror is introduced. Restore under the matching model still checks saved ADAPT displacement at T. |
| PERSIST-C | Tamper field 8 to a nonempty list, empty map/set or omitted field: SaveContractError. Only exact list([]) is admitted. An unsupported analytical declaration fails preparation rather than falling back to the empty list. |
| PERSIST-D | field 9 is exactly the empty list for admitted no-draw components; adding an unsupported random consumer rejects preparation before projection. An all-state-IDs scan mutant is detected. |
| PERSIST-E | field 10 accepts only the exact empty list; nonempty coupling payload cannot silently activate. Omitted original input manifest still fails D restore even with valid empty metadata. |
| PERSIST-F | Save/restore at B preserves untouched state, model-owned REG references and original pending-source equality; metadata derivation never materializes or re-anchors REG. |
| PERSIST-G | Fail every metadata check after structural decode: no scheduler construction/execution, allocator advancement, state mutation or trace/output publication. |
| PERSIST-H | No public callback/profile override selects metadata behavior; an internal alternative derivation is killed by targeted vectors and independent finite comparison. |
| PERSIST-I | A build supports an additional accepted RNG-consuming seam absent from the committed model: field 9 remains list([]). Add that seam to the committed model and bounded-profile preparation rejects, including an unexercised branch. Changing metadata merely because build support changes fails qualification. No new stochastic seam is invented or admitted by this control. |

## 8. Accepted disposition and remaining gates

C2-PERSIST-001 revision 2 is SHAPE ACCEPTED at campaign2-persistence/0.1-candidate.
Fields 8/9/10 are each exact list([]), independently justified by the admitted closure's absence
of run-owned analytical continuation, RNG consumers and continuing coupling inputs. REG remains
model-owned; its changed anchors change RegistryIdentity/ModelIdentity, not field 8.

Factory pass 2 is IMPLEMENTATION DESIGN ACCEPTED. Before FCT-5, freeze the concrete first-model
inventory and exact RulesVersion ↔ semantic bundle ↔ profile relation. No caller profile flag,
default, nearest version or build-dependent substitution is permitted. This is a readiness gate,
not an unresolved persistence shape. Staged implementation is authorized in the accepted order:
FCT-1 codecs/intake → FCT-2 CONTENT/DomainValidator → FCT-3 PRJ/IDN/model/state compilers →
FCT-4 OBS/SEM/EVID/ADAPT/REG runtime integration → concrete profile binding → FCT-5 facade →
FCT-6 independent qualification. VAL-A..W, PERSIST-A..I, FCT-A..F and inherited mutants precede
formal VAL closure; integrated ADAPT gates and PHEN-ADAPT remain later obligations.

No numeric allocation, save-schema change, new identity family or accepted seam reopening is
required. All implementation controls remain NOT PASSED; authoritative activation is NOT YET
AUTHORIZED. Formal C2-PERSIST proof closure remains pending implementation qualification.
