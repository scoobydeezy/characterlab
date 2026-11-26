# M284 — procedure-specific rust proposal
Status: PROPOSED, not adopted or integrated. Production remains0.165/NoRust.
The decision is whether unused competence should decline according to elapsed
time for that procedure, independently of unrelated simulation activity.
Baseline00c9b564; M283 acquired skill and actual later execution are the operand source.
This package supplies a comparison and receiving plan, not Family12.8 acceptance.

## Exact proposal — PeriodicDisuse/0.1
Engineering defaults, no superiority verdict: H=4 integer model-time units and
retained fraction1/2 per complete interval. No conversion to real-world hours.
One fixed rule for the whole successor model; no scenario/member selectors.

Per procedure store (Kanchor, count, anchorAt) under the existing procedural owner.
Kanchor is competence at the saved decay boundary, not necessarily competence now.
No learned initial state; absent procedure has competence0/count0. Learned K is
within[0,1], count1..100; timestamps use the receiving model's existing time domain.
At evaluation t>=anchorAt, n=floor((t-anchorAt)/H), K(t)=Kanchor/2^n exactly.
No rounded floats, sampled ticks, decay queue, new state owner or archive reads.
Queries do not write or restart the clock. Other procedures have independent anchors.

Execution uses K(t)*(1-impairment)>=difficulty with existing engagement rules.
At common140, actual existing attempt-associated interference subtracts1/4/floor0
from K(t). Eligible practice then uses unchanged D3/Ramp gain and saturation.
With practice: store updated competence/count+1 and anchorAt=t.
With interference but no practice: store reduced competence/count unchanged and
anchorAt=oldAnchorAt+n*H, preserving the remaining fraction of the idle interval.
Without either: retain the stored tuple. Mere attempt/success, a denied attempt,
a perceived report, memory loss or unrelated events do not reset the clock.
A practice at the cutoff uses already-rusted competence, then adds practice;
it cannot rescue the earlier execution retroactively. Loss count is not practice count.

Save/restore preserves anchors and exact fractions. Restoring within an idle
interval must preserve its remainder. The last half-life boundary can be derived
without scheduling recurring events, so natural quiescence remains possible.
At the maximum admitted time, denominator size/performance must be checked before
integration acceptance; no silent smaller time domain. The test includes the
existing million-unit bound. This is a bounded staircase model, not smooth decay,
empirical calibration, automaticity, transfer or a claim about real learning rates.

## Controls and required distinctions
NoRust retains competence. Historical longitudinal-public/0.2 HalfAtGap is preserved
exactly: halve once when gap from prior commit>=4, before old interference/practice
but AFTER that instant's execution. Its original linear practice law stays intact;
this package compares no-practice rust operands, and names adopted D3 for recovery.
[Contract](../formal/LONGITUDINAL_PUBLIC_CONTRACT_REV2.md);
[kernel](../../src/campaign3/longitudinalMath.ts).
Do not relabel a difference in phase/clock/equation as an equivalent port.
No new law is installed merely because it produces the required rusty outcome.

## Receiving plan if the owner adopts this candidate
Version the shared model and procedural value/trace contract. Keep prior versions
byte-identical. Extend785's existing owner with the timestamped tuple; execution
derives current competence from that tuple and current exact time. Record actual
anchor read, elapsed intervals, effective competence and execution assessment.
The common140 writer uses the same derivation before interference/D3 updates.
No cognition reads this truth-side tuple as self-belief: normal observed performance
still owns capability beliefs. No side store or Campaign3 runtime dispatch.
Audit all readers of785 before implementation, especially snapshot/validation,
execution, saves, multi-character views and skill-history projections.

Native acceptance still needs actual training -> elapsed disuse -> failed execution
-> qualifying practice -> recovery, liveness, a second procedure, irrelevant event
invariance, hidden/denied report controls, owner/order/rollback and full continuation.
Then carry the affected M119/M152/M283 skill witnesses onto the successor and classify
all law-caused differences; rust cannot silently invalidate the other seven clauses.
Revisit existing incorporation/family mappings affected by a global skill-law change.
No full family acceptance or evidence-index promotion follows from this comparison.

## Authority and obligations
Ledger SKILL/LONG dispositions retain intent/attempt/outcome, skill versus belief,
procedural versus episodic memory and distinct mutation authority. No reduction.
RO-C3-013/017 remain conditional; no new Campaign3 verdict or obligation closure.
[Work order](ASSEMBLED_CHARACTER_WORK_ORDER.md), Milestones and decision gates:
“Alternatives retain controls and require an owner ruling”.
The decision to adopt a genuine new reference law remains pending.
