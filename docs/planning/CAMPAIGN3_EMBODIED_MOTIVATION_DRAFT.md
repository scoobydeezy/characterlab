# EMB-001 — Bounded reserve, interoception and pressure

**Status:** first research draft, revision 1, 2026-09-10. Proposed version
`embodied-reserve/0.1-draft`. **NOT SHAPE ACCEPTED; NOT IMPLEMENTABLE.** No numeric
allocation, corpus promotion or new qualification. This draft proposes an exact
first body model and identifies the remaining composition gates rather than calling
the whole BODY→choice path closed.

## 1. Authority and historical intake

North Star §10 permits derived motivational pressures without stored Need meters.
Architecture §7.2–7.3 prefers physiological dynamics through legitimate interoception
for embodied pressure; §3.2 and ordering-phases/2-candidate separate body, evidence,
motivation, choice and execution. Research Brief families12.1/12.2 and the proposed
BODY/MULTISOURCE contrasts define the research target, not biological calibration.

| Mechanism | Disposition in this proposal |
|---|---|
| CTL-001 | Retained stored-meter comparison control; not the default body ontology. |
| MEC-003 | Preserve exact bounded-effect decomposition for replenishment; overflow stays truth-side. |
| MEC-004 | Consume accepted observer-safe SEM boundary; no historical truth-token shortcut. |
| MEC-001/002/006 | Preserve belief, censored-evidence and surprise controls; this draft does not implement learning or call pressure surprise. |
| MEC-005/007, CTL-004 | Retain attention/salience controls; the single-channel first fixture has no capacity contest. |
| MEC-012..020, EXP-009/014 | Preserve source roles, independent motives, redundancy, dice and authorship; receiving extensions must name their changed domain. |
| P3-009/010/011 | Keep constitution, adaptation, identity and evidence distinct; require time partition and ordering controls. |

## 2. Actual substrate inspection

| Inspected contract/source | Finding and implication |
|---|---|
| `state/0.2-candidate`; `STATE_MODEL.md` | Dynamic embodied state is separately time-anchored; each writable leaf needs one registered owner. Existing regulatory-adaptation ownership does not automatically own every future physiological leaf. |
| `src/substrate/time.ts`, `materializeLinear` | Integer/rate-scale materialization carries exact remainder and **rejects** values outside its declared range. It is not a saturating reserve integrator. Do not change it globally or discard remainders to approximate this draft. |
| `src/campaign2/regulatoryReference.ts` | R0 is authored analytical reference; validation checks R0+D. No physical reserve dynamics. This proposal neither reads nor mutates R0/D. |
| `observation/0.1-candidate`; `src/observation/observation.ts` | Measurement is an effect/change; accepted interval cases are point or one-sided bound. Although record204 has two optional endpoints, `classifyInterval` rejects a nondegenerate finite interval. A level bin is therefore a real new observation contract, not merely another201 channel. |
| Qualified diagnostic and carriage contracts | Diagnostic n/Scale is not physical sensation. Existing safe evidence/occurrence infrastructure can be reused only after a successor admits the new measurement meaning and producer. |
| Task motive/plan and reason components incorporated by `TASK_COGNITIVE_SHAPE_MANIFEST.json` | Commitment pressure is constant for an eligible task. Candidate origins and raw keys are task-bound; ReasonNucleusKey includes TaskReferent. An embodied channel cannot be inserted into those keys with a fabricated task. |
| Same task plan contract | An adopted instruction is not an efficacy belief. The existing forecast is not action-conditioned; no handler may derive an action's usefulness by inspecting world effects. |
| `ordering-phases/2-candidate` | Phase0 materialization precedes current observation10; motive60 precedes options70/reasons80; execution110 precedes consequence observation120. No new phase is needed merely for body observation. Exact producer/dependency closure still needs packaging. |

These findings leave three composition blockers: current-level observation and finite
interval admission; a non-task source/referent and candidate-origin extension; and a
legitimate character-relative link from pressure to a relevant action. None is fixed
by an extra enum member alone.

## 3. Proposed physical meaning and scope

Model one **consumable fuel reserve** in an idealized embodied agent. `q` is remaining
fuel amount, `C` storage capacity, and `r` a constant nonnegative consumption rate.
Consumption removes fuel; replenishment adds fuel up to capacity. This is a physical
inventory model, not a claim about human metabolism, hunger, health, reward, sleep,
stress, performance or death. No automatic impairment follows from empty reserve.

The model declares one exact fuel-amount unit U; r has dimension U per canonical
time quantum. U is a proposed semantic unit, with no permanent ID/member yet.
There is no conversion to `unit/fixture-pulse`, no SI assertion, and no OBS↔REG unit
relation. C and r are immutable constitutional/model parameters in the first profile.
The pressure threshold H is a declared source calibration in U, with 0<H≤C, not R0.

Authoring initial physical q is allowed. Authoring learned urgency, belief or history
to bypass the path is not. The first candidate has no independently stored Need state;
stored/hybrid candidates remain later explicit comparisons, not compatibility flags.

## 4. Exact body mathematics

At an anchor `(t_a,q_a)`, 0≤q_a≤C. For t≥t_a without replenishment:

```text
q(t) = max(0, q_a - r*(t-t_a))
```

All operands are exact canonical rationals except canonical integer time. No floating
point, rounded derivative, hidden tick, accumulation of unspent consumption debt or
parameter change occurs. Error bound is zero. Materialization alone is a pure read
of the anchor; it does not reanchor or alter the body. The clamp at zero is physical
exhaustion of this finite stock, not clipping an invalid REG adapted reference.

A committed nonnegative replenishment e at T uses:

```text
Before = q(T)
PotentialEffect = e
Applied = min(e, C-Before)
Overflow = e-Applied
After = Before+Applied
new anchor = (T, After)
```

Only an accepted world/execution event may supply e. An interoceptive record, pressure
or chosen intent cannot replenish the body. Multiple replenishments at one instant
are ordered by the accepted scheduler and each has its own decomposition. Splitting
an event preserves final body amount but need not preserve event/evidence history.
Pure observation/query partitioning must preserve both amount and anchor bytes.

Invalid time reversal, negative e/r, C≤0, invalid initial q, mismatched unit/subject,
unresolved parameter or malformed rational fails before commit. Do not clamp invalid
initial data into range. The symbolic sole owner is `authority/embodied-reserve`;
its state-family/authority membership requires later allocation review. It owns only
this reserve anchor. It owns no regulatory adaptation, competence or learning state.

## 5. Proposed interoceptive level channel

This is a separately versioned **level** producer, not observation/0.1 BoundedStateChange.
The first self-channel requires the observer's accepted IDN mapping to equal the body
subject. The admitted payload receives its CharacterId through PRJ/IDN, never by
parsing an ObserverId or trusting a second caller-supplied character field.

Channel parameters: permission/availability, exact bin width w>0, and capacity C;
require C/w to be a positive integer in this bounded profile. For q<C:

```text
k = floor(q/w)
permitted interval = [k*w, (k+1)*w]
```

For q=C use `[C-w,C]`. Boundaries below C belong to the upper bin. Closed reported
intervals conservatively overlap at endpoints; an interval does not disclose whether
its upper endpoint actually occurred. This deterministic tie law is public model
semantics, not a noisy or calibrated biological sensor claim. Width controls resolution;
do not misuse the older statistical Precision field as a bin-width container.

Permission/availability false emits missing evidence, never q=0. The producer may
read only the anchored body projection and this channel's parameters at the lane
cutoff. It emits no anchor time, rate, overflow, exposure amount, future trajectory,
truth record handle or private subject link. Omniscient actual reads remain trace-side.
Matching intervals and safe support topology must produce matching character outputs
up to opaque occurrence renaming, even when their hidden trajectories differ.

Do not feed finite intervals to an existing203 decoder or label them Point. A new
observation version must define its finite-interval discriminator, schema admission,
consumer ReadDomains and restore validation. SEM current-lane classification and
freeze must admit that observation explicitly. Reuse observer-safe evidence references
and the existing occurrence allocator machinery, not a parallel provenance graph.

## 6. Proposed option-free pressure candidate

Given admitted current interval [L,U] for this self-channel, define:

```text
pressure = max(0, H-U) / H
```

This is a **guaranteed-deficit response candidate**: pressure increases only when the
entire permitted interval lies below H. It is neither an estimate of exact deficit nor
a universal uncertainty policy. A midpoint-sensitive alternative may later compete;
it must not be smuggled into this candidate through hidden q. Missing observation
produces Unavailable pressure, distinct from Known(0); no retained stale value is used.

The producing transition authenticates the current frozen observer experience and
its admitted observation, obtains subject by projection, and reads immutable H only.
It has no body, REG, belief, memory, identity, appraisal or truth read capability.
Output consists semantically of subject, source meaning, Known(p)/Unavailable and
the existing safe observation support. No new per-item identity is needed by default;
one transition output occurrence suffices unless the occurrence inventory proves a
different requirement. Exact record fields and attachment are withheld until the
observation/SEM composition is specified.

This pressure is not yet an option-directed RawCognitiveSignal. To produce one, a
successor must authenticate a character-relative instruction or action-conditioned
expectation linking an accessible action to this concern. World-known replenishment
efficacy is forbidden as a character operand. The thinnest candidate bridge to examine
next is an explicitly adopted instruction to attempt a procedure when this perceived
deficit is present, with no assertion of expected success. It must be independently
intervenable from pressure, publicly admitted and distinct from task commitment.
This draft does not approve that bridge or claim it proves learned relief preference.

## 7. Temporal, state and persistence envelope

At T, phase0 provides body materialization from the retained anchor for current-lane
observation10; SEM freezes at14 and pressure is generated at60. A phase110 replenishment
cannot change that already frozen current observation or pressure. It may produce a
separately admitted consequence observation120; any next motive probe is at later T.
No phase60 re-entry from a same-instant consequence and no same-event belief read/write
is required. Phase51/52 affect/regulatory impulses are outside this profile.

Body writes and all generated observations/pressure/occurrence allocation are staged
under whole-instant rollback. Observation and pressure declare WritableStateFamilies={};
every persistent learning family may remain byte-identical while pressure changes.
The body anchor is authoritative physical state and persists with its parameter binding.
Derived materializations and pressure are not a second authoritative cache. Save/restore
must reproduce the next query, pending inputs, exact outputs and allocator state with
the complete model/RulesVersion commitment. Read domains, input origin, transition
definitions, trace schema, event/output counts and restore admission remain packaging
gates; this paragraph is not a substitute for their exact inventory.

## 8. Proposed adversarial vectors — NOT PASSED

The following numbers are **fixture arithmetic only**, not permanent numeric IDs or
biological calibration. Use C=100U, H=60U and time units as canonical quanta.

| Vector | Required witness / failure alternative |
|---|---|
| EMB-A kinetics | q_a=80 at0; r=1 versus2. At10 amounts70 versus60 despite equal initial q. Constant-current-level control fails. |
| EMB-B partition | r=1/3, q_a=80. Query at1 then2 then3 versus3 directly gives79 with unchanged anchor. Rounded-per-query and discarded-remainder controls fail. |
| EMB-C depletion | q_a=2,r=1: q(3)=0; add5 at3, then q(4)=4. Hidden consumption-debt carryover fails. |
| EMB-D bounded refill | Before95, e5 versus9 produces After100 in both, Overflow0 versus4. Matching level-channel evidence cannot disclose overflow. |
| EMB-E bin alias | q41 versus49, w20 gives[40,60] and p0. Direct-q pressure gives different positive values and must be rejected. |
| EMB-F resolution | q45: w20 gives[40,60],p0; w10 gives[40,50],p1/6. Equal truth can produce different pressure through the channel alone. |
| EMB-G ties | w20: q0→[0,20], q20→[20,40], q100→[80,100]. Invalid width0 and nonintegral C/w reject. |
| EMB-H missing | Denied/unavailable channel yields Unavailable, never Known(0) or pressure1. No unauthorized body read or evidence emission. |
| EMB-I identity | Wrong observer/body mapping rejects; opaque ID spelling and another observer's allocations cannot change p. |
| EMB-J timing | Pre110 and post110 reserve differ; frozen current-lane pressure stays unchanged. Later admitted observation can affect next-instant pressure only. |
| EMB-K ownership | Pressure/observation produce no character-learning patch; negative e and forged writes reject with complete state/output/allocator rollback. |
| EMB-L restore | Prefix restore before/after depletion and replenishment reproduces body, evidence and subsequent pressure; changed parameter/model commitments reject. |
| EMB-M receiving | Genuine task and body origins share an action without fake TaskReferent, duplicate option or erased independent ground. BLOCKED pending receiving contract. |
| EMB-N action knowledge | Removing/changing adopted action knowledge changes candidate access/association without changing physical pressure. Hidden world efficacy cannot rescue missing knowledge. BLOCKED pending bridge. |
| EMB-O overlap | Shared observer-safe support versus independent grounds exercise distinct receiving alternatives. No world-ID overlap join; cross-family law remains open. |

Passing arithmetic checks cannot pass these public runtime vectors. A four-contrast
BODY fixture needs A/E/F plus the actual source/choice integration; this document
cannot claim a second publicly executable motive family.

## 9. Self-review and next closure work

The stock model has no recovery kinetics beyond replenishment, no constitutive
adaptation and no acquired pressure history. It can discriminate constant-level and
hidden-truth shortcuts, but cannot establish general Need necessity, hysteresis,
addiction, human interoceptive accuracy or physiological performance. Its conservative
pressure rule deliberately ignores possible deficit within an ambiguous bin; that
is a testable candidate weakness, not a required character invariant.

Close in order: review this physical/sensor/pressure target; specify finite-level
observation plus SEM consumer/projection admission; specify non-task instruction/source
and candidate/reason-key extension; review explicit cross-family receiving comparisons;
compose exact record/occurrence, state, scheduling, trace and persistence inventories;
then shape review, separate allocation/model gates and implementation. No frozen
Campaign2 contract is widened in place. Attention contracts can develop alongside
this work, but are not a prerequisite for this single-channel domain.
