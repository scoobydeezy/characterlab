# Conditional intent and bounded protocol execution

Status: DRAFT; internal autonomous proposal. No shape acceptance, allocation,
model activation or implementation. Versions: task-arbitration-ingress/0.1-draft
and bounded-protocol-execution/0.1-draft. Depends on the cognitive drafts, the
retained reason/dice contract still to close, accepted ordering, SEM/EVID and ADAPT.

## Actual substrate findings and narrow resolution

TransitionOutputDefinition/277 admits only ExactlyOnePerExecution. The actual V04
validator rejects missing declared outputs. TransitionIngressDefinition/276 likewise
has exactly-once source/consumer semantics. Do not reinterpret either finite value
as optional. TransitionInputProducerV06/321 already has RegisteredTransitionProducer
(tag2, field5); inventing a fourth producer variant for an execution result is
unnecessary. The bounded adaptationTransitions compiler currently requires tag3
AuthoredAdaptationFactProducer, so tag2 is a new receiving profile admission, not
already executable permission. Existing profiles and their checks stay frozen.

Arbitration always produces exactly one DecisionResolution. Its closed alternatives
are NoOptions, NoActiveReasons and Chosen. Only Chosen contains a selected complete
candidate key and the actual resolved arbitration data. Neither absence variant
contains a dummy action. Candidate presence and reason activation remain separately
observable. Both absence variants consume no RNG and emit no intent child.

For Chosen only, schedule one phase90 IntentFormation event carrying that exact live
resolution. IntentFormation admits only the Chosen variant and emits exactly one
ChosenIntent. Thus no output cardinality extension is needed: conditionality belongs
to child production. A new symbolic ChosenIntentIngressDefinition names the event,
phase90, exact input schema and fixed Chosen-only rule. Its owning registration is
separate from276; no generic caller predicate or interpreted expression is admitted.
Its compiler proves the resolution schema's exact variant and selected-key presence.
Its runtime proves exact parent output, generated child binding and single execution.

The absence result still includes the authenticated reason/option context needed to
distinguish why no intent exists. Resolution, intent, expression, plan, attempt and
outcome are separate records and trace events. New occurrence rules belong solely
in279/278. No item-level candidate occurrence or shadow DecisionId is introduced.
The canonical decision occurrence is the Resolution occurrence; later records refer
to or nest that record, rather than inventing another identity for the same choice.

## Plan instruction semantics proposed for the first intact profile

ProtocolActionDefinition has one ordered field, RequestedContactCount: an exact
unsigned value in the closed set{1,2}. Action identity is DefinitionId/1027 narrowed
to the new protocol-action registry kind and schema. The exact two action definitions
must differ in this field. Two rows with identical operational definitions cannot
create two lottery tickets; the profile rejects that duplicate alias case. Candidate
equality remains actor plus action definition, as specified in the option draft.

The instruction means attempt one or two fixture contacts for the derived actor.
It does not mean improve a reading, satisfy a task, obtain a reward, or succeed.
The already adopted task→instruction binding supplies the procedural association.
There is no action-conditioned prediction, efficacy estimate, causal attribution or
world-effect lookup during option generation. Distinct task origins may select the
same action and are unioned into one option as previously specified.

ChosenIntent holds the selected candidate and frozen decision context. Its production
schedules independent DecisionExpression formation at90 and ActionPlan formation
at100. Expression formation completes before any110 outcome. The plan is the exact
selected instruction plus actor; it cannot substitute an alternative after selection.
ActionPlan schedules one Attempt at110. Attempt records the attempted actor/instruction
and requested count, then schedules one Execution at110 in a later event sequence.
Execution cannot change the frozen intent, expression or attempt.

All these steps have empty writable character-state families. Their outputs retain
exact causal sources; no action token is admitted as identity evidence by itself.
Full expression/qualification mathematics and source fields remain a separate DEC
closure obligation. No successful outcome is needed to create a voluntary expression.

## Independent truth-side interference and actual consequence

The first proposed execution model has one immutable truth-side permission parameter,
Permitted. Only Execution may consume it. It is not exposed in the cognitive model
projection, workspace, forecast, raw signal, intent or expression. Compare two model
interventions with identical cognitive operands: Permitted=true completes the requested
count; false completes zero. There is no execution RNG, partial-contact sampling,
skill claim, clipping or inferred ability in this bounded protocol.

An ExecutionOutcome records its occurrence, exact Attempt and CompletedContactCount.
The completed count is either zero or RequestedContactCount. The truth-side record is
not a character input. It may be traced omnisciently and consumed only by the separately
registered actual-fact and observation bridges. No action-specific success Boolean
is forwarded to OutcomeEvaluation or learning evidence.

The actual-fact bridge emits one AutomaticAdaptationInput/307 with existing Exposure
body305: ExposureReferent=actor and Count=CompletedContactCount, with CharacterId=actor.
The fixture's self exposure is explicit; it does not imply a physical-object ontology.
OccurredAt is the actual110 instant; TransformationVersion names this successor.
The occurrence remains existing namespace1118 under its one accepted identity rule.
The accepted ADAPT fact contract explicitly admits actual zero count and requires one
input even for zero (ADAPT_001_FACT_INGRESS_DRAFT, accepted D surface). Therefore the
blocked branch also emits exactly one307 with count0; it does not suppress rule
resolution or evaluation allocation. Nonzero count is the actual completed count,
never the requested count. Zero does not claim a contact occurred.

The new first intact input profile excludes original authored adaptation facts. Its
ADAPT registration names this registered actual-fact producer with321/tag2. Historical
authored-fact profiles retain their original tag3 source. This avoids broadening one
producer field into an undeclared union or admitting generated304 as original input.
The consumer's rule mathematics, domains, target accessors and automatic-adaptation
route remain unchanged; only exact receiving producer admission changes.

The observation bridge uses actual CompletedContactCount as its bounded effect,
with before0, potential=completed, applied=completed, overflow0, after=completed and
bounds[0,2]. Here potential is the post-interference physical effect before bounding,
not the actor's requested action count. The actual observation validator requires
applied=clamp(potential, bounds-before); requested>0/applied0 with these bounds would
be invalid truth. Attempt retains requested count separately. Do not encode blocked
execution as capacity overflow or change bounded-effect arithmetic to accommodate it.
Do not reuse the predecessor bridge's hard-coded effect1 source. Reuse the accepted
observation/SEM consequence stages120..124, observer permissions, separate truth and
character provenance, conditional reservation and frozen experience. The existing
unit/fixture-pulse namespace1039 remains only its identity discriminator. EVID130
consumes only the resulting safe consequence experience under its settled contract.
Measurement prediction still comes from the separate diagnostic probe/carriage path;
this protocol does not relabel a contact observation as a regulatory measurement.

## Ordering, limits, replay and failure

The route is40→50→50→60→70→80→90→100→110→120..124→130→140.
Independent expression90→qualification130→identity application140 needs its own
accepted character-learning registration before activation. Prediction and task
application remain their accepted140 owners. Identity reads for this decision occur
before its own140 update; any learned feedback is only available in a later instant.
No current-lane belief write or ORD-001 decision is required by this proposal.

Conditional branches legitimately differ in event/output counts. There is no blanket
claim that absent choice, choice, blocked execution and permitted execution have equal
runtime ordinals. Every branch must nevertheless have a finite derived work bound,
exact output/child coverage, deterministic allocator behavior and complete replay.
Do not introduce dummy no-intent/attempt records solely to preserve count equality.

The full model must prohibit ambiguous simultaneous protocol/probe physical roots or
specify their ordering explicitly. Current single physical-source rules do not already
authorize a same-instant probe and generated protocol execution. Separate-instant
scenes are sufficient for the first witness. Expired task filtering at40 and existing
private deadlines140 remain independent of whether arbitration chooses anything.

Freeze proposed IP-A..L as NOT PASSED: no-options; available/no-active-reasons; exact
chosen-only ingress; duplicate action aliases; same-action origin union; intent/plan/
attempt identity preservation; independent interference; completed versus requested
adaptation; observer suppression; exclusion of world truth from EVID/cognition;
conditional-work/occurrence accounting; all-stage rollback and full-prefix replay.

## Review boundaries and deliberately deferred surfaces

MEC-011 availability and MEC-019 intent/execution are PORT/CONTROL obligations.
This is a fixture execution protocol, not a reduction of skill, body, control,
affordances or environment. Later competence-dependent execution, multi-actor actions,
targets/arguments, communication, partial success, action-effect belief learning and
causal outcome attribution need their own seams. The whole intent/protocol shape is
withheld pending expression/qualification closure, source
registrations, role inventory, trace/output closure and successor model work accounting.
