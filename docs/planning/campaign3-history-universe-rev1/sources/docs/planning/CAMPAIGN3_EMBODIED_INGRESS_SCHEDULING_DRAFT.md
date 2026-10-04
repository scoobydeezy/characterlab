# EMB-001 generative ingress, scheduling and restore

2026-09-10, revision1. **Proposed closure, not shape acceptance or implementation.**
Refines the open host/admission questions in
[observation admission](CAMPAIGN3_EMBODIED_OBSERVATION_ADMISSION_DRAFT.md).
No numeric tags, event members, schema numbers or accepted versions are allocated here.

Follow-on [registration/accessor draft](CAMPAIGN3_EMBODIED_REGISTRATION_ACCESSOR_DRAFT.md)
specifies ordered symbolic layouts and exact direct body bindings after IDN resolution.
It refines the open schema/accessor items here without accepting the whole profile.

## 1. Inspected boundaries

`transitionIngressV04.ts` privately mints runtime-branded capabilities, associates
actual scheduler children with exact producer outputs and registrations, checks full
event equality and consumption, and expires capabilities with their instant. Neither
`admittedInput.ts` nor semantic handlers may mint a token. `requiredProjection.ts`
checks admission before payload selection and subject-state reads. Its supported
registration layouts are closed; a new layout needs explicit compiled dispatch.

`probeExecution.ts` demonstrates fixed-slot private padding and actual child binding.
Its diagnostic source and consequence-phase topology are controls, not the proposed
current-body producer. `scheduler.ts` uses separate event-ID, EventSequence and shared
runtime-occurrence allocators; equal runtime ordinal counts alone do not establish
equal event topology. Existing public cognitive persistence excludes mid-instant
checkpoints. Preserve that restriction for the first EMB profile.

MEC-003/004 and SUB-008/009 preserve decomposition, evidence boundaries, exact trace,
replay and paired interventions. This proposal does not grant a new learning path,
truth-reading motive or imported historical implementation.

## 2. Absence decision proposed for this profile

A scheduled self-sampling opportunity is publicly admitted process context. It is not
a promise that sensation will arrive. UnavailableLevelSample means exactly **this
scheduled computation has no admitted measurement operand**. No present observation
was made, no reserve proposition was asserted, and no negative body evidence exists.

Consequences:

- No evidence-index entry or CharacterEvidenceRef may target UnavailableLevelSample.
- No SEM reservation/envelope is created from this result.
- Only the matching pressure transition may consume it; it emits Unavailable.
- No memory, belief, prediction, surprise, causal attribution, diagnostic-reason or
  learning consumer is registered for it in this profile.
- Permission and availability failures have identical sample/output shapes and no
  body read. Their separate causes stay private model/trace information.
- Missing required data on a supposedly present branch is an error, never absence.

This scope is an explicit proposed absence contract, not an inference from the SEM
API's false flag. A future model that reasons about failed sensing, retains missing
samples or hides sampling opportunities must revisit it. Exact Known(0) remains
positive measurement-based pressure computation and is never replaced by Unavailable.

## 3. Symbolic registration grammar

Use a new separately committed registration version, provisionally named
`embodied-pressure-admission/0.1-draft`. The shared transition-admission singleton
keeps its accepted grammar/version; only a successor's occurrence entries change.
Old V04/V06/V07 rows, output rules, routes and producer tags remain unchanged.

Each new pressure registration contains:

| Field | Exact proposed meaning |
|---|---|
| OwningSeam / SeamVersion | One exact embodied-pressure seam/version, never latest-version dispatch. |
| InputRecordSchema | Exactly present sample or unavailable sample schema, not a union wildcard. |
| ProducerRequirement | Exactly one of the two branches below, matched to InputRecordSchema. |
| ReadDomain | Only the exact immutable IDN roster pattern needed by the accepted subject projection. |
| RequiredProjections | Exactly the IDN instantiation over top-level ObserverId; no alternate roster access. |
| SafeDefinitionBinding | Exact pressure definition/channel/unit and admitted H; no body definition exposed. |
| OutputDefinitions | Exactly one EmbodiedPressureOutput with the declared output occurrence rule. |
| WriteCapability | NoStateWrites only. |
| Ingress | Matching present or unavailable pressure event, phase60, original sample as payload. |

ProducerRequirement is a closed new union:

**PresentWithFrozenSupport** carries exact SamplingProducerDefinitionId,
SamplingSeamVersion, SampleEventType, SamplePhase=10, SampleSchema,
SEMSeamVersion=`semantic-binding/0.1-candidate#SEM-001H`, Lane=Current,
FreezeEventType, FreezePhase=14, FrozenSchema=227/1, and
SupportRule=ExactSingletonSameOpportunity.

**UnavailableOpportunityResult** carries that same exact sampling producer,
version/event/phase, the unavailable schema, settlement event type at14 and
ResultRule=NoPresentEvidenceNoReservation. It does not contain a fake SEM schema
or nullable SEM reference pretending to satisfy the present branch.

Model construction requires exactly one registration per branch and matching safe
definition/subject roles. Wrong branch/schema combinations, extra consumers, wildcard
producers, write capability or route/character-learning mapping reject. New pressure
registrations require matching new codecs and projection-compiler dispatch; a new
record-shaped value is not automatically a supported registration.

The sampling producer also needs a governed **InputOnly source admission**: exact
ordered-input event type/phase10, payload `(ObserverId, ChannelDefinitionId)`, admitted
channel membership and one opportunity per observer per instant. Original source
events have empty dependencies/parents and DueAt strictly after initial clock.
Authoritative ordered-input compilation supplies their scheduler identities. Public
scheduling, cancellation, semantic-handler emission and replay of source bytes cannot
mint another source. Before its IDN selector runs, a source-admission authority must
authenticate the actual original scheduled event and produce its scoped input token.
The exact source-registration codec and PRJ compiler extension remain in the whole
inventory gate; directly passing a raw event to PRJ is explicitly forbidden.

## 4. Transaction-local authentication state machine

Key private bookkeeping by the **actual source event identity**, not a new canonical
opportunity namespace, payload hash or ObservationId chosen by a caller.

```text
OriginalSourceAuthenticated
  → SampleProduced(present or unavailable, exact bytes)
  → LaneSettled(matching frozen SEM or authenticated no-evidence result)
  → PressureChildBound(actual allocated child)
  → PressureInputConsumed
  → PressureOutputValidated
  → InstantCommitted / Aborted
```

Only the trusted fixed adapter reports actual sample output. It stores exact detached
canonical bytes and allocated identity, subject/channel relation and branch. Present
freeze must match the actual reserved experience O/time/identity, its exact singleton
support and source opportunity. An arbitrary equal-looking227, stale observation,
same-observer other opportunity or reference-index lookup cannot substitute.

At phase14, shared ingress selects the one matching committed pressure registration.
It generates one child with the exact retained sample payload; the semantic producer
does not choose downstream IDs. Binding checks actual allocated child type, DueAt,
phase, payload, empty dependencies, EventSequence and sole causal parent (the actual
phase14 event). Transitive ancestry connects that event to sample10; no extra truth
parent is exposed to the pressure function. Validate the entire emission batch before
publishing any association. At60, exact child equality and unconsumed/live association
precede payload access, then PRJ, then pressure execution and output validation.

Duplicate production, settlement, binding, consume or output completion rejects. The
admitted token is private, noncanonical and not serializable. Both success and abort
expire it; unfinished tickets/children/reservations prevent successful settlement.
This is a typed two-branch extension, not a generic user-supplied join predicate.

## 5. First-profile fixed event and occurrence budget

One opportunity has six events, including its original source. All same DueAt:

| Slot | Phase | Present branch | Unavailable branch | Domain runtime ordinal use |
|---|---:|---|---|---|
| sample | 10 | Present sample; reserve experience | Unavailable sample; no reservation | sample ordinal, then experience ordinal or one private padding ordinal |
| tracking slot | 11 | Empty tracking work | Private empty work | none |
| binding slot | 12 | Empty binding work | Private empty work | none |
| classification slot | 13 | Empty classification work | Private empty work | none |
| settlement | 14 | Freeze exact support-only227 | No SEM; settle unavailable branch | none |
| pressure | 60 | Known pressure | Unavailable pressure | one pressure ordinal |

Every slot except60 emits exactly one next-slot child, in listed order, bound to
the scheduler's actual allocation. Slot60 emits no children in this subprofile.
Thus five generated events and EventSequences, three runtime ordinal advances,
one sample and one pressure output occur in either branch. Only the present branch
has one227 and one real experience reservation. Padding never becomes a typed
experience, trace certificate, observation or source reference. There is no separate
truth-output occurrence for a body read: actual-read trace suffices.

The sample and pressure event types may be distinct by schema branch, but their count,
phase and emission order are fixed. Slots11..13 do not invent perceived features or
mutate empty perceptual state. Accepted SEM rules for genuinely nonempty classification
remain unchanged outside this profile. No recognition, learning, EVID or adaptation
child is scheduled by this six-slot proposal.

Sampling needs the cutoff-specific derived body read from its reserve anchor; it
does not materialize by reanchoring. Pre-existing phase0 semantics provide the truth
cutoff. The budget excludes separately scheduled replenishment or future choice work;
a composed profile must redo the full budget rather than claim six events for the
whole BODY→choice path. One opportunity per observer at T avoids accidental same-lane
reservation ambiguity; distinct observers still obey canonical scheduler order.

## 6. Read, output and rollback closure

Sampling first authenticates InputOnly origin and resolves the accepted subject.
Both branches record that IDN projection read. Only permitted+available sampling
invokes the declared body accessor. The inaccessible branch must not speculatively
materialize/read the reserve and then redact it. Body source operands and consumer-safe
channel parameters stay distinct. Pressure separately records its own IDN projection
read; its pure semantic function sees Sample, H, CharacterId and allocated output ID.

Validate exact source/output schema and role, version/channel, canonical interval,
occurrence allocation, pressure Known/Unavailable branch and exact arithmetic. A
forged valid interval is still rejected without production binding. Every sample,
SEM and pressure output and all runtime/event/sequence allocation remain staged.
A failure at any later stage restores the whole pre-instant state, queue, allocators
and committed trace under the substrate rollback rule. No pressure or absent-sample
counter persists. Existing physical state changes at the same instant also roll back.

## 7. Restore boundary

Only complete committed instants may be saved. Mid-instant sample buffers, SEM
reservations, generated children and ingress tokens are outside the save format.
All six slots finish at the same DueAt, so no future pressure child is pending at
an accepted save boundary. A save containing one is invalid, not a request to rebuild
its token from trace. A future delayed-pressure profile would require a new contract.

Restore checks the exact RulesVersion/model, codecs, original input manifest, body
anchors/parameter bindings, canonical state/output invariants and allocator states.
Scratch initial compilation derives the original InputOnly opportunities remaining
beyond the committed boundary; pending source-event bytes must match exactly, including
event identity/sequence, time, payload, parents and dependencies. Scratch allocation
does not mint live IDs. Other permitted input families require their own corresponding
pending-source check; do not silently discard future replenishment inputs.

Past records remain exact historical bytes. Validating their schema/roles is not
recomputing them from current reserve, H or sensor width. Trace history never mints
a live capability. Continuing from restore creates fresh instant-local ingress only
when an authenticated pending source actually executes. Persisted allocator state
must preserve consumed private padding positions as well as visible occurrences.

## 8. Proposed proof matrix — NOT PASSED

| ID | Required distinguishing control |
|---|---|
| EING-A | Extra/missing/duplicate branch registration or wrong schema/version fails construction. |
| EING-B | Forged original source, cancellation, replay scheduling or changed channel fails source admission before selector/body reads. |
| EING-C | Genuine sample plus unrelated genuine SEM fails the same-opportunity join. |
| EING-D | Correct support identity plus altered sample bytes fails exact production binding. |
| EING-E | Absent sample cannot create evidence-index entry,227, belief update or Known(0). |
| EING-F | Availability-false and permission-false generate identical unavailable sample/result bytes at matched allocation, with no body read. |
| EING-G | Present failure never falls back to Unavailable or padding. |
| EING-H | All event/runtime/sequence budgets match; skip-padding mutant changes the next allocated identity and is detected. |
| EING-I | Wrong child parent/type/phase/time/payload/sequence or duplicated child fails before capability publication. |
| EING-J | Token reuse, cross-instant use, mid-instant save and forged saved internal child reject. |
| EING-K | Fail after sample, SEM, child binding, projection, pressure or final validation; all committed state, queue, trace and allocators roll back. |
| EING-L | Restore before/after a completed opportunity preserves later output bytes; missing/extra/changed original pending source rejects. |
| EING-M | Changed H/channel/model cannot reinterpret saved output; history does not authenticate new production. |
| EING-N | Wrong-observer interleaving and speculative read-then-redact mutants fail exact subject/read boundaries. |

## 9. Self-review and remaining gates

The state machine supplies causation and liveness, not scalar authenticity by itself:
the fixed producer must still implement the admitted physical/sensor law. Closed schema
validation is insufficient evidence that those bytes were actually produced. Likewise,
the nine earlier SEM component checks prove only support-only expressibility, not this
new source's authentication, absence semantics or branch-neutral public execution.

This proposal chooses the bounded absence interpretation and exact local six-slot
budget; neither is accepted yet. Remaining whole-shape work: source/pressure registration
codec layouts; canonical roles and occurrence inventory; exact body accessor contract
and model integration; trace mappings and persistence validation dispatch; then separate
allocation and profile gates. Non-task action knowledge, candidate/reason identity and
cross-family consolidation remain separate unresolved source-composition work.
