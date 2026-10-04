# EMB-001 observation and pressure admission

2026-09-10, revision 1. **PROPOSAL ONLY; whole shape withheld.** Companion to
[reserve draft](CAMPAIGN3_EMBODIED_MOTIVATION_DRAFT.md). Proposed seam identifier
`embodied-level-observation/0.1-draft`; this is not an executable version or allocation.

Follow-on [ingress/scheduling proposal](CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md)
now specifies the proposed absence interpretation, two-branch authentication grammar,
six-slot local budget and committed-boundary restore rule. It refines the open items
below without promoting them to accepted semantics or passed runtime controls.

## 1. Inspection result and representation choice

`src/observation/observation.ts` admits203/1 only with point or one-sided measurement
intervals. `measurement-evidence-carriage/0.1-candidate` embeds exact203 and unit in
CognitiveMeasurementEvidence; it does not grant a general observation-payload resolver.
`src/semanticBinding/evidenceProvenance.ts` resolves only observer-safe metadata, and
227 supporting observations identify observations without carrying their content.

`src/campaign2/requiredProjection.ts` selects a required top-level admitted input field
and enforces the exact IDN roster requirement. It does not traverse an arbitrary
nested observation. The current compiler admits specific registration/schema versions;
a successor compiler must dispatch new registration layouts explicitly while retaining
the accepted projection semantics. No existing profile can execute these proposals.

Choose distinct symbolic **EmbodiedLevelObservation** and **UnavailableLevelSample**
records with top-level ObserverId. The first carries a finite level interval, the
second carries no measurement. Both are outputs of a registered current-lane sampling
opportunity; only the present form is observation evidence supporting SEM. Reuse the
existing ObservationId family1115, as present203 and missing202 already do; no new
observation-identity family or truth-derived ID. Record/schema allocation remains open.

Keep203/204,201 channel modes, existing evidence-kind tags, CognitiveMeasurementEvidence
and the diagnostic V07 profile unchanged. A finite interval is not a Point and a level
is not a measured effect. Do not extend a decoder based on runtime field inspection.

Historical intake: MEC-003/004 preserves bounded truth decomposition and its epistemic
cut; MEC-002/006 remains censored-learning/surprise control, not pressure semantics;
MEC-005/007 stays attention comparison debt. The new payload is not a port of historical
authoritative Applied into character knowledge.

## 2. Proposed symbolic schemas

Listed order is a proposed field order, not permanent numeric allocation.

| Record | Ordered fields |
|---|---|
| EmbodiedLevelObservation | ObservationId, ObserverId, ObservationChannelId, OccurredAt, FiniteLevelInterval, TransformationVersion |
| FiniteLevelInterval | Lower, Upper |
| UnavailableLevelSample | ObservationId, ObserverId, ObservationChannelId, OccurredAt, TransformationVersion |
| EmbodiedPressureOutput | PressureOccurrenceId, CharacterId, Sample, PressureResult, TransformationVersion |
| PressureResult | Version-governed union: Known(exact rational) or Unavailable(no value) |

Sample is the exact admitted present/unavailable record, embedded without reallocation
or reinterpretation. Output CharacterId is obtained by projection and is needed for
subject-addressed use; it is not copied into the observation. The pressure output
does not duplicate O, time, interval, source list or observation identity beside Sample.
One new pressure occurrence family is proposed because a pressure computation is a
different occurrence from observation. No occurrence IDs for intervals or union items.

FiniteLevelInterval is a new finite-only grammar with exact rational 0≤L<U≤C. Its
meaning and unit come from the exact committed channel definition selected at admission.
No old Precision field is repurposed. The new channel definition binds its observer,
unit, modality, capacity and bin width; the pressure definition separately binds H,
the same channel/unit and the allowed producing version. The pressure function sees
only its safe H projection, projected character, admitted Sample and output ID.
It cannot resolve arbitrary channel definitions, body parameters or world data.

The first model has one channel and one reserve per bound character. There is no
extra BodyId or target identity to become a hidden correlation key. The safe meaning
of this channel is explicitly self fuel level, not recognition of an external body.
Neither IDN nor this profile claims that all characters generally have bodies.

## 3. Subject and capability admission

Both sample schemas have a required, role-constrained top-level ObserverId. Declare
the accepted IDN requirement separately for each pressure input registration:

```text
selector = admitted Sample.ObserverId
target = CharacterObserverBindingState.Bindings[selector]
projected field = CharacterObserverBindingValue.CharacterId
accessor = ResolvedCharacterSubject
```

The compiler checks canonical roles and the exact input schema; runtime checks
generative admission before accessing the selector or roster. The trusted sampling
profile must independently use that bound subject for its body read. A mismatched
body subject rejects; no optional resolution, reverse map or second roster read path.

The full projection wrapper records the actual roster read under PRJ instrumentation.
The pure pressure function receives only the projected CharacterId. Its absence of
state access must not be reported as zero total projection reads. Write domains remain
empty for sampling/pressure; the body's separately owned physical evolution is not
a pressure write.

## 4. Present branch: authenticated SEM support without payload lookup

1. A model-admitted current-lane opportunity at10 samples the already materialized
   body at its strict entry cutoff and allocates one observation identity.
2. A permitted, available result produces exactly one EmbodiedLevelObservation.
   The SEM adapter carries its observation identity as support, using accepted
   current-lane reservation/classification/freeze semantics through14.
3. At freeze, the host proves the exact observation is an actual transaction-local
   output of the declared producer, has the same O/time/channel, and is the exact
   support of the reserved frozen227. This first single-channel profile requires
   that one support, not any matching observation found in a trace or store.
4. A separately versioned generative admission extension delivers that **exact
   observation payload** to phase60, with the frozen SEM prerequisite authenticated
   host-side. The input remains the observation itself, so PRJ uses its top-level O.

This is a conjunctive producer/SEM-support admission condition, not an existing V04
FrozenSemanticExperienceProducer branch masquerading as a different schema. The exact
extension record grammar, host binding and child closure remain to be specified before
whole shape acceptance. V04/V07 producer grammars are not widened in place.

Reuse CharacterEvidenceRef's observation branch and1115 role for **present** support.
Add the new exact schema/producer pair to this consumer's admitted metadata catalogue
only in a successor. Having kind=observation does not authorize every observation
schema, cross-observer reference or payload lookup. Old consumers continue to reject
the new pair. The sample's exact bytes travel by authenticated handoff, not through
the metadata index, trace, content hash or an arbitrary callback.

No self-body perceptual track, event pattern, identity recognition, causal attribution
or learned relief claim is manufactured merely to obtain a nonempty SemanticExperience.
The existing support-only shape is expressible: `probeExecution.ts` already constructs
such an experience in the consequence lane. A direct current-lane component probe
also passes assembly, phase14 freeze and settlement with one support and empty semantic
collections. See `CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json`: nine checks, including
empty/cross-observer support, wrong phase/reservation and duplicate/orphan rejection.
This confirms shape expressibility only; it does not authenticate the proposed new
observation producer, decode a new schema or qualify a public EMB run.

## 5. Unavailable branch and branch-neutral allocation

The same sampling opportunity emits exactly one UnavailableLevelSample when permission
or availability fails. It reveals neither failure reason nor measured value. No body
projection is read on this branch. It is an opportunity result, not a present evidence
reference and not support for a fabricated227. Pressure returns Unavailable, not zero,
maximum pressure or a stale reading. If even the existence of a scheduled self-sampling
opportunity were private in a future profile, this disclosure would need fresh review.

Unavailable is proposed as processing/opportunity metadata, not evidence that the
reserve has any particular level or that an external event failed to occur. The
existing lane API's `emitsCharacterAccessibleEvidence=false` behavior alone does not
approve that classification. The new profile must explicitly close this absence
semantics before it can use a no-SEM branch; a consumer may not learn from sample
absence by interpreting it as negative body evidence.

Admission of this branch authenticates actual production from the declared opportunity;
it does not require a nonexistent frozen experience. Both branches resolve the same
subject requirement and emit one pressure result. The input occurrence rule extracts
each sample's required ObservationId; the output rule extracts PressureOccurrenceId.
No branch reuses either as an event ID or allocates an extra observation identity.

The whole profile must reserve equal observer-visible allocation budgets and release
the phase60 child only after the lane settles. Missing branches use existing private
padding discipline where needed, never fake semantic evidence. A malformed present
sample, failed SEM binding or missing consumer registration is an error, not an
Unavailable fallback. Exact event counts and padding identities are still a packaging
blocker; equal final output counts alone do not prove allocation noninterference.

## 6. Pressure, timing and route ownership

Known pressure is exactly max(0,H-U)/H from the present sample. Only that interval
and immutable H are magnitude operands. ObservationId, channel spelling, subject
spelling, sample frequency, hidden body q and failure reason cannot modify pressure.
Unavailable stays a typed absence; no observation is manufactured to represent it.

The pressure output is transient motivation at60, not OutcomeEvaluation or
CharacterLearningEvidence. It has no route/character-learning mapping. The accepted
consequence SEM→OutcomeEvaluation→CharacterLearningEvidence route remains unchanged;
later retention or learning from this new observation requires its own explicit
consumer admission. The existence of current evidence does not create a new learning
production path or automatically admit a finite interval to old learners.

All outputs are transaction-local until instant commit. Post110 replenishment cannot
revise an already frozen current sample or pressure. This first subprofile defines
current sampling only; consequence-level observation, persistence of pressure, stale
evidence fallback, belief lookup, attention competition and affect feedback are deferred.
Historical sample bytes survive archive/restore as produced, never recomputed from
current body, current bin width or a new H. Restore must authenticate complete model,
schema/producer, original scheduled inputs and exact pending binding closure; no trace
certificate or observation ID alone may mint a live admission capability.

## 7. Adversarial review vectors — all NOT PASSED

| ID | Distinct rejection or preservation obligation |
|---|---|
| EOBS-A | Nondegenerate finite interval rejects through old203/204; succeeds only through the new committed schema/producer. |
| EOBS-B | Level versus effect meanings cannot be exchanged despite equal endpoint bytes. |
| EOBS-C | Caller-authored payload, observation ID, version string or copied trace cannot mint producer/SEM binding. |
| EOBS-D | Correct observation paired with another same-observer frozen experience rejects; support identity alone cannot substitute altered payload bytes. |
| EOBS-E | Wrong observer or unmapped subject rejects before handler; no static or nested alternate roster access. |
| EOBS-F | Pressure sees exact detached sample and H, no payload resolver, body handle, registry object or truth ancestry. |
| EOBS-G | New observation reference is rejected by old evidence consumers; no global ReadDomain widening. |
| EOBS-H | Missing result has no SEM evidence/support and gives Unavailable; Known(0) remains distinct. |
| EOBS-I | Permission/availability-false branches read no body and reveal no distinct reason. |
| EOBS-J | Matched interval/support yields equal pressure despite hidden q, rate, overflow and inaccessible facts. |
| EOBS-K | Duplicate registration/delivery, reused occurrence, stale event or altered admitted payload rejects atomically. |
| EOBS-L | Present/unavailable profile branches use equal relevant allocation budgets without fake227 or leaked padding. |
| EOBS-M | Projection reads are traced accurately; sampling/pressure writes no persistent learning state. |
| EOBS-N | Same-instant post110 changes cannot reach the earlier sample; restore preserves exact historical payloads. |
| EOBS-O | A support-only SEM is admitted honestly or remains blocked; no invented tracking/classification to satisfy shape. |

## 8. Disposition and remaining work

This proposal resolves the representation direction: distinct finite-level schema,
existing observation identity, exact payload carriage and unchanged top-level subject
projection. It does **not** yet close the observation seam. Next specify the new
producer's binding to the component-expressible support-only SEM, freeze conjunctive
admission grammar and complete scheduling/
padding/occurrence/restore tables. Pressure output role/definition membership and
versioned codecs then require whole shape and separate allocation gates.

The next source investigation remains non-task instruction/candidate/reason identity.
Even accepted observation admission would not establish action efficacy knowledge,
learned preference, cross-family consolidation or a second publicly executable motive.
