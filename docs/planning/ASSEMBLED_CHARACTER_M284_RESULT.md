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

## Measured comparison — plan04476483
Two deterministic tests pass on the original M283 acquired operand K1/2,count1 at3.
The saved native execution7 is live and successful under NoRust at difficulty1/2;
its competence, engagement and impairment are read from the actual archived trace.
No new learned history is injected into a running character.

| Rule | Sparse commit history: K used at7 / at8 / at11 | Same history plus unrelated commits |
|---|---|---|
| NoRust | 1/2 / 1/2 / 1/2 | Unchanged by definition |
| Historical HalfAtGap | 1/2 / 1/4 / 1/4 | 1/2 / 1/2 / 1/2 |
| Proposed PeriodicDisuse | 1/4 / 1/4 / 1/8 | Exactly identical |

Sparse times7,8,11 follow acquisition3; dense times4..11 fill the same interval.
Historical rule executes at7 with old1/2, then halves to1/4 at consolidation.
Its dense history never reaches a gap4. This is faithful historical semantics,
classified as a law conflict with procedure-specific elapsed disuse, not a defect.
The proposed computation predicts failure at7 at the same difficulty; it is NOT
a native rust execution result. The NoRust computation matches the captured native one.

Controls: boundary6 retains1/2, boundary7 gives1/4; a separate procedure practiced6
retains1/2 at7. Mature qualifying practice7/8 gives3/8 then1/2 and predicts recovery9.
No-practice/blocked eligibility does not reset the clock. Interference6 gives1/4
with anchor3; cutoff7 still halves to1/8. At cutoff7, interference then mature
practice gives1/8, rather than applying practice before decay.
Zero/absence, saturation, future/out-of-domain time, invalid count and count100 cap
are checked. Twelve future evaluation/practice comparisons agree after canonical
round trips, including before the cutoff and after recovery; these are prototype
tuple checks, not runtime restore. The million-unit computation remains exact with
a250,001-bit denominator. Native performance/trace payload costs are still unqualified.
[Evidence](ASSEMBLED_CHARACTER_M284_EVIDENCE.json) pins the source file/hash and
preserved decoded save hashes. [Checks](ASSEMBLED_CHARACTER_M284_CHECKS.txt).

## Concrete owner decision
Recommend authorizing PeriodicDisuse/0.1 with H4/half as the provisional candidate
for the next native integration milestone, retaining NoRust and exact HalfAtGap
controls. The clock/phase behavior addresses the required disuse distinction;
the numerical rate is only an engineering default, not a fitted or superior law.
NoRust remains the production reference until that ruling. Adoption is not family
acceptance: a new global skill law changes existing outcomes, so native integration
must carry and classify the affected witnesses rather than retune them silently.
Do not close12.8-4 or promote the132-clause index on these kernel results.

One test file, no production/accepted-contract/control changes. No new verdict,
owner, factory, scheduler, reduction or scope amendment. E87/P21/N11/U13 and
8 accepted families remain unchanged. After final checks, stop this package
for that single law decision; no further audit or comparison expansion is needed.

Final verification: two comparison/control tests, types, boundaries, research,
preserved evidence and staged Git-size checks PASS. No failures or reruns.
Measured40.466s;30s packaging allowance gives70.466s/1800s; longest24.427s/600s.
Three artifacts about16KB; all planning limits and source hashes verified. Exact
five-file isolation from00c9b564 preserves production, contracts and prior evidence.
The captured execution uses impairment0; broader impairment controls remain versioned
M119 evidence to carry during native integration, not new M284 qualifications.
No further verification is needed for this proposal package.
