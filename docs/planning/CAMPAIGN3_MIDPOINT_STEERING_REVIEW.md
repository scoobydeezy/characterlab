# Campaign 3 midpoint steering review

**Date:** 2026-09-14
**Reviewer:** external (Claude), independent of the implementing agent
**Window reviewed:** 2026-09-10 → 2026-09-14 (since `CAMPAIGN3_PRE_ENTRY_GAP_REVIEW.md`)
**Scope:** `AGENTS.md`, Campaign Plan, `CURRENT.md`, `CAMPAIGN3_ENTRY_READINESS.md`, `CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md`, EMB / ATTN / GA packets and checkpoints, `VERDICT_LEDGER.md`, `PHENOMENON_CORPUS.md`, `CAMPAIGN3_DECISION_AND_ESCALATION_POLICY.md`, `src/campaign3/` inventory and selected sources
**Status:** external review opinion. Accepts no contract, allocates nothing, closes no decision.

---

## 0. Headline

**The thinking is now excellent. The economics are not.**

The planning layer absorbed the pre-entry review better than I expected — in several places it corrected me, and it was right to. `CAMPAIGN3_ENTRY_READINESS.md` is a better readiness instrument than the one I proposed. The PERMITTED / ATTENDED / ENCODING STRENGTH / ACCESSIBLE NOW decomposition in the BODY frontier is North-Star-grade work. Two of the three structural gaps I named — no second motive family, no body — have been genuinely closed in bounded scope. A real psychological verdict exists. The first affect→attention feedback edge is in implementation.

But in the same four days:

| Measure | 2026-09-10 | 2026-09-14 |
|---|---|---|
| Highest permanently allocated record type | 452 | **706** |
| Corpus members | 10 | **10** |
| Entries in the verdict ledger | 7 | **7** |
| Planning files in `docs/planning/` | ~330 | **1,141** |

The scaffold grew 56% in permanent allocation and 3.5× in planning artifacts while producing zero new corpus members and zero new verdicts. The single active workstream — General Attention (GA) — has consumed **339 planning files, 5.6 MB, 163 permanent record types, 67 stage templates and seventeen revisions of one identity-role crosswalk in 48 hours**, and every checkpoint ends with the same three sentences: *"Public gates and GA remain OPEN. Continue locally. No owner ruling is pending."*

This is the pattern I flagged on 2026-09-10, now running faster. The correction is not to slow down or to reopen anything. It is to **reorder the next increment**, and the agent's own closure plan already says how.

---

## 1. What has gone genuinely right

Stated first, because the criticism below is about sequencing, not about quality.

**The review was engaged with, not absorbed.** `CAMPAIGN3_PRE_ENTRY_REVIEW_DISPOSITION.md` accepts what was right and pushes back where I was wrong. Four of its corrections are correct and I withdraw those findings:

- "Four of fifteen families" — six families have partial primary coverage, and my own table said so.
- "452 record types" — that was a high record *number*, not an inventory count (~298 schema pairs at the time).
- "Two of thirteen loops" — those were my assembled paths, not a canonical cycle census. Their edge-support table in `CAMPAIGN3_ENTRY_READINESS.md` supersedes mine.
- "REG unimplemented / ADAPT first edge only" — wrong, driven by the stale seam table. `regulatoryReference.ts` is implemented and observer-safe evidence does reach forecast, appraisal and motives.

**The missing experiment was run, properly.** `VER-C3-PRE-IDENTITY-001` is a real verdict entry with every field populated: two already-frozen models differing at one governed Boolean, four matched seed pairs, byte-identical draw records on shared addresses, state equal through t5, divergence at t6 — (1/2, 1/2) PlayerFacingRoll with feedback versus (0, 1) Auto without. And it **falsified its own starting hypothesis**: the suspicion that a zero integer standing modifier meant no effect turned out to be wrong, because standing also enters reason relevance and rescues a weak nonzero base. A verdict that reports a surprise is worth more than ten that confirm.

**The second motive family is closed.** `MULTISOURCE` ER-A/E/F: a publicly generated embodied source and the existing commitment source competing on the same option, with probability 221/256 versus 1/2 after source removal. That was the unlock for a large amount of already-built correlation machinery, and it took one day.

**Body exists and took the architecturally preferred route.** EMB-001 is a real body variable with kinetics, a deterministic exposure channel and an interoceptive observation channel — not a renamed `R0`. EMB-A/B witness equal levels with different kinetics producing different trajectories; EMB-E/F/H witness hidden aliases resolving identically under matched permitted evidence. Architecture §7.3's preference for interoceptively mediated pressure over stored meters was honored, with `CTL-001` kept as a control rather than quietly adopted.

**Attention came back with its historical mathematics intact.** `attention-selection/0.1-draft` re-expresses MEC-005's residual pool honestly — Cause = 1, Target = 9/10, Incidental = (1/5)/m — with equal-priority, unlimited-capacity and historical-residual controls named as separate models. And the qualification says the right thing about its own limits: *"A hard top-K selector does not establish a continuous salience law."*

**The escalation policy is largely being honored.** `GENERAL_ATTENTION_USE_CONSUMER_RESOLUTION.md` is a **user ruling** dated 2026-09-12 on the use→retention consumer — exactly escalation criterion 3. That is the policy working as designed.

**The affect→attention loop is in implementation.** `priorConcernFeedback.ts` modulates `residualPool = residual × (1 − q)` and `ω_A = 1 + q` from a prior-instant concern, with explicit `DisabledFeedback` and `BaselineWithoutAvailableFeedback` comparator branches. That is the North Star's *"frightened person whose attention narrows around threat"* (§30), built as a loop rather than asserted as a trait. It is the most important structural thing in the repository right now.

---

## 2. The steering problem: the plan says math-first, the execution went allocation-first

This is the finding I would act on today.

`GENERAL_ATTENTION_CLOSURE_PLAN.md` ends with an **Immediate sequence** that is exactly right:

> "Qualify the exact mathematics component first, without identities, canonical records, public ingress or state ownership. Then close the semantic carrier/subject/cue and feedback inventory before choosing persistent layouts. A passing arithmetic kernel does not close any of those expressibility gaps or authorize corpus promotion."

And its closure obligation #2 names the experiment that matters:

> "Separate permission, active selection, continuous allocation, encoding strength, retained importance, current accessibility and retrieval reinforcement. Execute independent/shared/hybrid and retired flat-tag controls on the same safe inputs."

What actually happened in the 48 hours after that plan was written: carrier shape and allocation (163 records, 542..704), registry member shape and allocation (218 members, 67 templates), write-scope correction (705/706), primitive grammar validator, recall partition projections, role crosswalk revisions 1 through 17, eight regressions of production boundaries.

**The four controls in obligation #2 have not been run.** They are pure arithmetic over exact rationals, and the closure plan has already written them out precisely:

- independent: `x / (1 + x)`
- shared: `x / max(B, Σx)` — with the plan's own correction that it is *not* `B·x / max(B, Σx)`
- hybrid: important entries exempt, remaining budget as denominator floor for low entries
- `RET-001` flat tagging, as the retired negative control

Those four can be executed in one file, against the same admitted inputs, with **zero allocation, zero registration, zero model packaging, and no new record types**. The historical evidence to discriminate them already exists as corpus obligations (`EXP-007`, `EXP-015`, and the documented Habit case where a flat tag capped an edge at exactly 1/2 versus ≈0.0014 derived).

That experiment would produce the program's **second psychological verdict**, and it is currently sitting behind an entire public-registration pipeline that it does not depend on.

**Recommendation 1 — run closure obligation #2 as a standalone arithmetic experiment before resuming GA registration work.** The agent's plan already licenses it and already puts it first. The execution simply drifted.

---

## 3. Allocation is outrunning research, and the ratio is now visible

GA's own numbers, from its checkpoints:

- 163 record types, 523 field ordinals, 38 finite tag sets, 11 unions, 6 namespaces — permanently frozen
- 67 stage templates, 218 registry members, 165 scalar identity positions, 208 recursive boundaries
- 20 prior allocation tables preserved, 22 more for write scope
- revision **17** of the identity-role crosswalk, in which revisions 16 and 17 are byte-identical in size and five minutes apart, and 17's entire content is *"No scalar identity field changes: 163 records, 165 scalar identity positions and 208 recursive boundaries."*

The behavior this apparatus serves is: perceive a few units under capacity, select some, encode with a footprint, retrieve later under a cue. For comparison, the entire Campaign 2 cognitive path — workspace through appraisal, concern, motive, options, reasons, nuclei, arbitration, intent, expression, plan, attempt, execution, consequence, learning evidence — took 76 record types (377..452).

**GA has spent 2.1× Campaign 2's whole cognitive allocation on one seam, and has not qualified it.**

Two things follow.

**3a. A revision counter in the teens is a signal, not a virtue.** REV17 of a crosswalk that reports no change means the closure criterion is not discriminating. When a document reaches roughly revision 5 without a disposition change, that is the moment to ask whether the artifact is load-bearing or whether it has become a ritual. Most of the GA crosswalk revisions appear to be re-derivations triggered by upstream edits — which is what a generated artifact should be, not a reviewed one. Consider generating the crosswalk from the manifests and reviewing only the diff.

**3b. Scale plausibility is a North Star requirement, not a later concern.** §24 targets ~10,000 simulated characters. 706 record types for a model that cannot yet express nine of fifteen phenomenon families is not obviously on that trajectory. This does not mean stop allocating — §3.1 explicitly prefers legibility before minimum object count, and the reference architecture is *supposed* to be overcomplete. But it does mean the allocation curve should be a tracked number with an owner looking at it, and right now nothing reports it.

**Recommendation 2 — add two counters to `CURRENT.md` and update them at every checkpoint: highest allocated record type, and records allocated since the last corpus member or verdict.** If the second number exceeds roughly 50, that is the trigger to stop specifying and run an experiment.

---

## 4. The corpus is still the bottleneck, and it is now self-inflicted

`PHENOMENON_CORPUS.md` has not been modified since **2026-09-08**. Corpus is `0.27.0`, ten members, same digest. Meanwhile:

- eleven fully-fielded intake proposals exist in `CAMPAIGN3_CORPUS_INTAKE_DRAFT.md` (BODY, MULTISOURCE, ATTENTION, AFFECT, WORKSPACE, BELIEF, SOCIAL, SKILL, HABIT, RELATIONSHIP, LONGITUDINAL)
- they have been audited twice (`CAMPAIGN3_PRE_ENTRY_AUDIT.json`, `CAMPAIGN3_DISCOVERY_AUDIT_REV2.json`)
- BODY, MULTISOURCE and ATTENTION now have **executed partial evidence** recorded against them in `CAMPAIGN3_POST_EMB_COVERAGE.md`

And they are still "local intake labels, not allocated members."

The stated reason is that promotion needs "corpus review and an intentional successor manifest." That is correct process, but it is gated on nothing external — it is a ready artifact waiting behind GA. And I think there is a category error underneath it:

> **Corpus membership is a statement that an obligation exists, not that it passes.**

Every GA checkpoint reports "frozen corpus 0.27.0 remains unchanged" as if stability were the goal. For a campaign whose declared output is *"a traversability baseline and list of discriminating gaps"* (Campaign Plan §6), holding the gaps outside the governed manifest keeps the denominator artificially small. The consequence is precisely the one `CAMPAIGN3_ENTRY_READINESS.md` warns against in its own closing section: *"An absent fixture has UNKNOWN discriminating power, not zero importance."* Right now that principle is written in a planning document while the manifest that Campaign 4 will actually rank from still says ten.

**Recommendation 3 — publish corpus `0.28.0` with all eleven proposals as members, carrying honest `BLOCKED` / `PARTIAL` / `NOT RUN` status.** Nothing about that claims a pass. It makes the gap list governed rather than advisory, and it is the prerequisite for any legitimate Campaign 4 ranking. This is a half-day of work that has been ready for three days.

---

## 5. `CURRENT.md` has become the thing it was meant to replace

The orienting document I recommended now contains, in 52 KB:

- **one** markdown heading
- **21** blocks labelled "Current checkpoint", "Latest checkpoint", "Latest executable checkpoint", "Latest source integration", "Earlier checkpoint", "Previous source integration", "Prior design checkpoint" — at least five of which claim to be the current one
- **33** occurrences of "remains OPEN" / "no owner ruling pending"

This is the stale-seam-table failure recurring one level up, and faster. A reader — human or a fresh agent — cannot determine current state from it.

**Recommendation 4 — `CURRENT.md` becomes a one-page table and nothing else:** one row per seam, columns `seam | version | status | next gate | owner decision pending?`. Move every chronological block to `CAMPAIGN3_LOG.md`. The rule should be that `CURRENT.md` is *replaced* at each checkpoint, never appended to. Append-only is right for the verdict ledger and wrong for a state index.

---

## 6. The fixture is drifting toward a psychophysics lab

`src/campaign3/` now contains `trialPanelPerception`, `panelWindowPerception`, `positionSceneSource`, `positionSceneOpportunity`, `markerWindowTracking`, `observedMarkerTracking`, `transactionalMarkerTracking`, `windowMarkerTransaction`, `windowPanelTransaction`, `canonicalVisualSelection`, `spatialEvidenceBinding`, `spatialContextAllocation`, `selectedSpatialEncoding`, `positiveSpatialCandidate`, plus `nineSweepMarker` and `tenSweepMarker` tests and referenced glyph/position fixtures.

That is a visual-search / change-detection paradigm. It is a legitimate way to get clean capacity and encoding contrasts, and the destination — encoding footprint → later cued retrieval — is correctly aimed at `PHEN-MEM-001`, `EXP-006` and `EXP-015`. So this is not a wrong turn.

The concern is that the apparatus is now large enough to be its own world, and **nothing in the GA packet states which North Star §30 archetype it stands in for, or what the transfer argument is.** The torture tests are "person who remembers a betrayal for fifty years," "angry person who disproportionately retrieves prior insults," "frightened person whose attention narrows around threat." Panels, markers and sweeps are a long way from any of those, and a validated attention law over glyph positions is only valuable if some required phenomenon can exercise it.

**Recommendation 5 — add one paragraph to the GA packet naming the §30 archetype the fixture is a stand-in for and the transfer argument to it.** If that paragraph is hard to write, the fixture is larger than the research question needs, and shrinking it is cheaper than closing it.

---

## 7. One escalation drift worth a decision

The escalation policy's criterion 3 lists, verbatim, the mechanisms that require an owner ruling:

> "Escalate when the choice introduces a substantive new psychological causal edge... Examples: **affect → retrieval**; **cognitive use → retention reinforcement**; standing preference → outcome significance; learned causal belief → future prediction."

Two of those four are now in the tree:

- **cognitive use → retention reinforcement** (`useProtectedRetention.ts`, `retainedAttributionUse.ts`) — correctly escalated; user ruling recorded 2026-09-12. This is the policy working.
- **affect → attention/encoding allocation** (`priorConcernFeedback.ts`, the delayed-feedback join) — resolved locally. `ATTENTION_FEEDBACK_JOIN_REVIEW_REV1.md` closes: *"This is a design requirement to resolve autonomously, not a request for a new user decision."*

The reasoning behind the second is defensible on its face — the *registration and join details* are plainly local, and the contract is scrupulous that transient `TaskConcern` is not general affect. But the thing being committed is the **first affect-shaped feedback edge into cognition in the entire program**, and its mathematics (`residualPool × (1−q)`, `ω_A = 1+q`) will anchor every later affect model. That is criterion 3's first named example, and criterion 4 applies too: getting the shape of this edge wrong is the kind of thing that forces a later rewrite.

I would expect you to approve it — it is well-designed, it has proper disabled/unavailable comparator branches, and §11.5 and §30 both support it. But it should be an explicit approval on the record, not a local disposition, because it is precedent.

**Recommendation 6 — ratify (or amend) the concern→attention feedback edge explicitly before GA closes.** Specifically: that a scalar concern in [0,1] may narrow the residual pool multiplicatively and scale focal weight, that this modulates encoding allocation but not role eligibility or K, and that the disabled branch stays a permanent comparator.

---

## 8. Are we following the North Star?

Direct answer, clause by clause.

**Yes, and strongly:**

- §5.1–5.12 invariants — every new seam preserves the separations; the epistemic discipline has not slipped once under pressure
- §3 no-LLM-oracle, determinism, exact mathematics — held completely
- §7.3 body via interoception rather than stored meters — honored, with the meter kept as a control
- §12 / §13 keeping satiation, habituation, tolerance and sensitization distinct — the four-question decomposition (PERMITTED / ATTENDED / ENCODING STRENGTH / ACCESSIBLE NOW) is the right frame and is explicitly written down
- §17.1 capacity-limited workspace — now a real bounded selector rather than an assertion
- §11.5 / §30 affect biasing attention — in implementation with proper controls
- §5.5 / §10 motivation from multiple grounds — second family closed
- Brief §11.2 preserve competing implementations — done consistently; comparators are named, not deleted

**Drifting:**

- **§29 primitive minimization** — 706 record types, nine of fifteen families inexpressible. §3.1 licenses overcompleteness, so this is a watch item rather than a violation, but nothing currently tracks the curve.
- **§3.1 "maximum causal legibility before minimum object count"** — legibility is regressing, not improving. `CURRENT.md` is the evidence.
- **Brief §9 Stage A → E** — GA is 48 hours of Stage A. Stages C (competing model), D (replay same corpus) and E (verdict) have not been reached on any Campaign 3 seam. EMB and ATTN both stopped at bounded qualification without a verdict entry.
- **§24 scale** — unexamined since Campaign 0.

**The one-sentence version:** the architecture is being built correctly and is not being built economically, and the agent's own closure plan already contains the fix.

---

## 9. Recommended next increment

In order. Nothing here reopens a frozen byte or rewrites history.

1. **Run GA closure obligation #2 as pure arithmetic** — independent `x/(1+x)`, shared `x/max(B,Σx)`, hybrid, and `RET-001` flat tagging, on the same admitted inputs, no allocation. Record a verdict. *(The agent's own plan puts this first.)*
2. **Publish corpus `0.28.0`** with all eleven intake proposals as members carrying honest `BLOCKED` / `PARTIAL` status.
3. **Write verdict entries for EMB and ATTN** in the ledger's own format. Both have executed evidence and declared domains; neither has a verdict. `VER-C3-PRE-IDENTITY-001` is the template and it is a good one.
4. **Rebuild `CURRENT.md` as a one-page replaced-not-appended state table**; move chronology to `CAMPAIGN3_LOG.md`.
5. **Ratify the concern→attention feedback edge explicitly.**
6. **Add the allocation counters** (highest record type; records since last verdict or corpus member) to the checkpoint template.
7. *Then* resume GA registration and model closure.

Items 1–5 are roughly two days of work and would take the program from seven verdicts and ten corpus members to something like ten verdicts and twenty-one corpus members — which is the state Campaign 4 actually needs in order to rank reductions honestly.

---

## 10. The framing, unchanged from four days ago

The program is still optimizing the layer it is best at. The specification discipline is genuinely world-class and the recent design work — the four attention questions, the BODY contrast set, the residual-pool re-derivation, the falsified standing-modifier hypothesis — is the best material in the repository.

But **a seam that is specified, allocated, registered and never compared produces no research.** The last four days produced 254 permanent record types and zero verdicts. The four days before that produced one verdict, and it is the most interesting artifact in the project.

Ship experiments at the cadence you ship allocations.
