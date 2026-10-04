# Campaign 3 pre-entry gap review

**Date:** 2026-09-10
**Reviewer:** external (Claude), independent of the implementing agent
**Scope reviewed:** `AGENTS.md`, `README.md`, North Star, `CHARACTER_ARCHITECTURE.md`, Research Program Brief, Campaign Plan, `docs/formal/*` (index + load-bearing contracts), `docs/planning/*` (ledgers + Campaign 2 completion/adversarial/qualification records), `src/` tree inventory, `reference/src/` tree inventory and `IMPLEMENTATION_README.md`
**Status of this document:** external review opinion. It accepts no contract, allocates nothing, and closes no decision. Where it disagrees with an accepted formal contract, the contract governs until amended through the normal hierarchy.

---

## 0. Headline

The refoundation succeeded at the thing it was for. The epistemic substrate is now genuinely stronger than anything the pre-refoundation build had, and several of the old build's real defects — truth leaking into `SemanticExperience`, visibility standing in for recognition, ambient mutation, partition-sensitive time — are closed rather than papered over.

The risk now is the opposite one. **The program has built exceptional seams and almost no loops.** Campaign 2 delivers ~452 permanently allocated record types across a causal path in which roughly two of the canonical topology's thirteen feedback edges are closed. "The simplest scaffold that produces complex behavior" is a claim about loops, not about record types — complexity in this class of model emerges from feedback, and feedback is the part that has not been built.

Three things follow, and they are the substance of this review:

1. **Campaign 3 cannot do the job the Campaign Plan assigns it.** Its mandatory phenomenon set is a subset of a corpus that covers 4 of the Research Program Brief's 15 required phenomenon families. At least three of its nine mandatory phenomena cannot pass at public level as the scaffold stands, and one has no implementable path at all. Its declared output — "a list of discriminating gaps" that orders Campaign 4+ reduction — will be systematically mis-ranked if produced from that corpus.
2. **Attention and salience have disappeared from the architecture without a verdict**, which is precisely the failure mode the Reference Mechanism Preservation Ledger exists to prevent.
3. **The subtractive method has not started.** After three campaigns there are six reduction verdicts, all substrate-level, and zero psychological ones. Meanwhile the permanent-allocation freeze discipline is quietly making retraction expensive — which puts the program's reproducibility machinery in tension with its stated research method.

Nothing below says the architecture is wrong. Most of it says the machinery built to keep the architecture honest is now measuring the wrong things.

---

## 1. Credit where it is due — what the new approach genuinely bought

This should be stated plainly before the criticism, because a comparison against the old build could otherwise read as nostalgia.

**Real gains over the pre-refoundation implementation:**

| Gain | Old build | New build |
|---|---|---|
| Truth/evidence boundary | `SemanticExperience` embedded full `EffectProvenance`, authoritative `Applied`, and truth-side concept identities (`RET-014`) | Typed `ReadDomain` admission, separate character/omniscient provenance graphs, equality-is-information rule, hashed handles explicitly unsafe |
| Recognition | Did not exist; visibility implied identity | Observer-relative continuant-files and event-files, tracking ≠ classification ≠ recognition, false merge/split permitted and never repaired by truth |
| Ordering | Per-tick string IDs, per-tick sequence | `(DueAt, Phase, EventSequence)`, whole-instant atomicity, terminal failed-run behavior, exact allocator continuation across save/load |
| Mutation | Convention | Exactly one registered authority per writable leaf, mechanically enforced, with `UNDECLARED_WRITABLE_PATH` / `NON_OWNING_AUTHORITY` separation |
| Time | Separately floored intervals, partition-sensitive | Exact retained remainder, explicit re-anchoring, direct-vs-partitioned equality proven |
| Randomness | 64-bit FNV-derived word | Registered `cenc/1` addresses, SHA-256-derived 128-bit candidates, quantified rejection/fallback bias |
| Provenance | Trace as instrumentation | First-divergence reports, structural diffs, aborted-vs-committed separation |

The Reference Mechanism Preservation Ledger remains the strongest document in the repository. Converting three phase briefs and a 240K-word research log into ~60 disposed line items with an explicit "absence from the new source tree is not a verdict" rule is exactly the right defense, and the Campaign 2 port qualification against `SUB-*`/`MEC-*`/`RET-*` is a real audit, not a checkbox.

The retained dice/identity pipeline came through the reset intact. All five die bands, three resolution modes, zero-base exclusion, weak-motive rescue, aggregate coverage with the collective-redundancy fixture that defeats retired pairwise-max, frozen expression across prevented execution — 270 historical dice cases and 11 identity histories pass differentially against the preserved controls. That was the single largest thing at risk in a ground-zero reset and it survived.

Also worth noting: every blocking item from the 2026-09-01 documentation review has closed. The Campaign Plan exists, the corpus is populated, `RND-001`/`TIME-001` are resolved, the `ModelIdentity` definitions and the `STATE_MODEL` authority table are reconciled, and the `AGENTS.md` Brief-vs-Formal carve-out is written. That is good follow-through.

---

## 2. Gap 1 — Attention and salience have vanished without a verdict

**This is the clearest instance of "we lost something critical" in the old-vs-new comparison.**

The old build's largest single module was `reference/src/model/salience.ts` (35 KB), and it was not incidental. It carried validated findings:

- `MEC-005` — character-relative attention separated from perception, with a residual attention pool
- `MEC-007` — multiplicative semantic salience over base category, event-specific causal role, attention, realized Need relevance, evidence-aware surprise, bounded response
- `RET-001` — flat `z=1` concept tagging **retired**, because it lets tag count and row competition silently determine learning strength
- `EXP-007` / `EXP-015` — same object changing causal role; how many concepts an Experience encodes measurably caps achievable association strength (the documented Habit case where an edge capped at exactly 1/2 flat vs ≈0.0014 derived)

Phase 2.5c specifically closed the last hand-authored input in that pipeline, deriving causal role mechanically from `EffectProvenance` rather than letting a scenario author set it. That was earned work.

**In the new tree, "attention" and "salience" appear nowhere in `src/`.** They appear in `SEAM_LEDGER.md` exactly once — in a note recording that general "salience/reinforcement" is *deferred*. There is no seam row that owns them. They are not blocked; they are absent from the seam inventory entirely, which means no campaign is accountable for them and no gate will notice.

Why this matters more than it looks:

- **The new epistemic pipeline is exhaustive-perception-with-permission-filters, not attention-limited perception.** Observation → classification → tracking → `SemanticExperience` gates on *admissibility*, never on *capacity*. The North Star is explicit that "distance, lighting, occlusion, sensory capability, and attention should normally alter feature-specific sensory evidence." Permission gating implements the first four. Nothing implements attention.
- **It is load-bearing downstream.** North Star §17.1 requires a capacity-limited workspace; §24.3 requires bounded indexed retrieval rather than scanning all memory. Both are attention problems. The current bounded workspace selection rule exists only inside the task cohort and selects from a set of at most two adopted tasks — it has never faced competition.
- **It is load-bearing for scale.** The 10,000-character target in §24 depends on cognition being sparse. Sparseness comes from salience-bounded candidate sets.
- **`RET-001` is currently un-defended.** The retired flat-tagging artifact is retired only in the old build. Nothing in the new architecture would detect its reintroduction, because the new architecture has no encoding-strength mechanism at all yet.

**Recommendation:** open a seam row for `perception/attention/salience` before Campaign 3, even if it stays `unresolved / blocked`. An absent row is invisible; a blocked row is a debt. Then decide explicitly whether `MEC-005`/`MEC-007` port, remain controls, or are retracted — with a verdict, per the ledger's own rule.

---

## 3. Gap 2 — The corpus, not the contracts, is the bottleneck

The Research Program Brief §12 defines 15 required phenomenon families containing roughly 120 named cases. `PHENOMENON_CORPUS.md` holds 10 phenomena. Mapping them:

| Brief §12 family | Corpus coverage | Assessment |
|---|---|---|
| 12.1 Embodiment and regulation | `PHEN-ADAPT-001` | ~1 of 8 cases. No constitutional kinetics, trajectory divergence, delayed consequence, sleep, or intoxication |
| 12.2 Need and motivational ownership | — | **None.** All six required distinctions untested |
| 12.3 Memory and recognition | `PHEN-MEM-001`, `PHEN-SEM-001` | Accessibility mechanics + recognition boundary. No consolidation, reconstruction, affect-biased retrieval, familiar-but-different |
| 12.4 Belief and causal learning | `PHEN-LEARN-001` | Censored-evidence informativeness only. No controllability, attribution, or confidently-wrong belief |
| 12.5 Affect and appraisal | — | **None** |
| 12.6 Cognitive workspace and control | — | **None** |
| 12.7 Goals and prospection | `PHEN-COMMIT-001` (partial) | Lifecycle identity only. No procrastination, strategy switching, delayed gratification, forgotten intention |
| 12.8 Skill and action competence | — | **None** |
| 12.9 Habit, reinforcement, addiction | — | **None** |
| 12.10 Social cognition and person models | — | **None** |
| 12.11 Relationships and attachment | — | **None** |
| 12.12 Identity and disposition | `PHEN-BIO-001` | Reasonable coverage of the feedback loop; no coercion, no trivial-repetition exclusion at public level |
| 12.13 Communication | — | **None** |
| 12.14 Autonomy, interference, execution | `PHEN-DECISION-001` (partial) | Prevented execution covered. No incompetence failure, no observer-witnessed interference |
| 12.15 Longitudinal personhood | — | **None** |

Plus `PHEN-DET-001` (substrate) and `PHEN-EPI-001` (epistemic), which are infrastructure obligations rather than psychological ones, and `PHEN-REASON-001` (reason independence).

**Four of fifteen families have any representation. None is complete.**

The consequence is structural, not cosmetic. Campaign Plan §6 says Campaign 3's output is "a traversability baseline and list of discriminating gaps," and Campaign Plan §7 says reduction order is chosen from that list by invalidation radius and "number and importance of phenomena discriminated." A gap list produced from a corpus with no affect, no social cognition, no skill, no habit and no control **cannot rank those families at all** — they will score zero discriminating phenomena and sort to the bottom. The reduction sequence would then be chosen to optimize the parts of the model that happen to have been built first.

This is the highest-leverage fix available before Campaign 3, and it is cheap relative to seam work: `EXP-001`–`EXP-015` and `P3-001`–`P3-012` already exist in crisp form in the Reference Mechanism Ledger §5–§6. Porting even eight of them into full corpus format would roughly double coverage and give Campaign 3 something that can actually fail.

---

## 4. Gap 3 — The subtractive method has not started, and freezing is making it costly

The North Star's governing target is "the smallest architecture demonstrably equivalent to the ideal reference architecture across the required phenomenon set." §3.1 is emphatic that the preferred experiment is subtractive.

`VERDICT_LEDGER.md` contains six entries in the verdict format:

- `VER-C0-RNG-001` — RETAINED (substrate)
- `VER-C0-TIME-001` — RETAINED (substrate)
- `VER-C0-ORD-001` — DERIVED (substrate)
- `VER-C0-STATE-TRACE-001` — DERIVED (substrate)
- `VER-C0-CONTENT-001` — DERIVED (substrate)
- `VER-C1-OBS-001` — DERIVED (epistemic boundary)

**Zero psychological reduction verdicts.** Everything after entry six is a chronological log of implementation acceptances — `AD-E7`, `VAL-V`, `C2-MEM-PACK-002`, allocation freezes, qualification receipts. Those are valuable, but they are not what the ledger is for, and the ledger's own header fields (declared state/input domain, phenomenon corpus version and coverage argument, equivalence relation or discriminating witness, counterfactuals, known uncovered regions) are not populated for any of them.

Two observations:

**4a. "Source substitution" is mutation testing, not competing-model comparison.** The Campaign 2 completion review reports "seventeen source substitutions are detected" as evidence of local necessity. That result proves the test suite is sensitive to changes in the code — a real and useful property, and the substitutions chosen (local-I scaling, extra tickets, standing in meaning, lost aggregate history, protocol truth leakage) are well-designed. But Brief §9.3 Stage C asks for a *competing model*: a different mechanism that could plausibly explain the same phenomenon. Detecting that you broke your own implementation is not evidence that the mechanism is necessary. The completion review is careful to say "local necessity under these controls, not universal RETAINED status" — that caveat is correct and should be preserved, but it also means Stage C/D/E have not run on any psychological distinction.

**4b. Permanent allocation is in tension with cheap retraction.** The correct-forward discipline — record types 210..452 permanently frozen, 446 fingerprints verified, 24 receipts, freeze audits preserving prior sources — is excellent for reproducibility and is exactly right for a research program whose findings must survive being revisited. But the subtractive method requires *ablating* distinctions, and an ablation whose numeric identity is permanently frozen and cross-audited is expensive to perform and psychologically expensive to accept. There is a real risk that the program's reproducibility machinery has made its research method costly enough that it keeps getting deferred to "Campaign 4+."

Worth naming explicitly: the program is currently running the "start big" half of "start big, then pare down" with no scheduled start date for the second half, and the artifact count is growing monotonically.

**Recommendation:** run one genuine ablation before Campaign 3, on something already built, to prove the pipeline works end to end. The obvious candidate is `MEC-018` identity feedback — `PHEN-BIO-001` already specifies an ablation branch ("ablate identity feedback; the future decision effect disappears while history is preserved"), the mechanism is implemented, and the controls exist. A single completed RETAINED verdict with a populated coverage argument would establish that the verdict machinery is executable, which is currently unproven.

---

## 5. Gap 4 — The traversable path is a task-pressure monoculture

Campaign 2's completion gate is met by one causal path:

> adopted task with deadline → predicted channel level → goal-interval discrepancy → concern → task motive → two candidate protocol actions → raw reasons → nuclei → arbitration → intent → frozen expression → plan → attempt → execution → observed consequence → outcome evaluation → learning evidence

Every psychological construct is instantiated in exactly one flavor: one motive family (commitment), one appraisal (interval discrepancy `max(L-m, 0, m-U)`), one affect (a transient concern scalar), two options, one protocol.

The completion review is admirably honest about this — "the task scaffold is a research hypothesis, not a claim that task pressure is a Core Need"; "Need/social sources, action-conditioned efficacy, richer planning, broad semantic ontology, value/habit/relationship/person-model learning ... are not supplied by this bounded task model." That honesty is worth preserving.

But monoculture has a specific cost that is easy to miss: **the machinery built to prevent modifier soup cannot be exercised.**

North Star §5.12 and Brief §16 require aggressive testing for correlated evidence and double counting. `SUB-007` aggregate coverage, `MEC-014` two-stage consolidation, `TRC-004` causal-overlap provenance and the `{1}`/`{2}`/`{1,2}` collective-redundancy fixture all exist specifically to catch one causal fact being counted twice because two systems describe it. That failure mode requires **two genuinely different source families describing the same fact**. With one motive family, it is untestable at public level — and indeed the completion review records exactly this: "Component Avoid and richer coverage are explicitly not public source claims," and `TRC-004` is closed only "in bounded component scope; public multi-source reachability is not inferred."

`PHEN-REASON-001` requires "same referent/different motives; same motive/different referents; positive and negative motive-generating contributions." That needs a second motive family in the public path. `PHEN-COMMIT-001`'s epistemic obligation — "others learn about the commitment only through permitted communication, observation, or records" — needs a social/communication seam that does not exist in any form.

`MEC-013` also records that `ContextModulating`, one of the four historical cognitive-signal source roles, is deferred rather than ported. Three of four roles execute. The fourth is exactly the one whose absence is hardest to notice, because a modulating role only shows up when there is something to modulate.

**Recommendation:** the cheapest second source family is probably an embodied one (a bounded physiological deficit producing a competing motive), because it also opens Gap 5. The second cheapest is a relationship/social source, because it opens Brief §12.10/§12.11 and `PHEN-COMMIT-001`'s epistemic obligation at the same time. Either one converts a large amount of already-built correlation machinery from component-scope to public-scope.

---

## 6. Gap 5 — The biology half of the mandate has no implementation and no phenomenon that would notice

The stated goal is architecture representing "pieces of human psychology **and biology**." Current state:

- `SEAM_LEDGER.md` row 1: `time/development/body materialization | none | unresolved | blocked`
- `REG-001` regulatory reference: SHAPE ACCEPTED at `regulatory-reference/0.5-candidate`, "canonical implementation **NOT YET AUTHORIZED**"
- `STATE_MODEL.md` classes `Constitutional` and `Dynamic embodied` exist; no seam writes them
- No physiology of any kind: no energy, hydration, sleep debt, injury, pain, circadian phase
- Interoception exists only as a `regulatory-diagnostic-probe`
- Needs derived from embodied state: absent. The old build's `needs.ts` bounded meters are `CTL-001` (control), and nothing replaced them

**A specific concern about ADAPT.** `ADAPT-001` consumed 31 documented revisions, six consolidation passes, an F packaging cycle, and the largest single share of `docs/planning/`. What it delivers is regulatory adaptation — tolerance, sensitization, accumulated load — driven by an authored actual-fact pulse, writing four addressable leaf families, with:

- no regulatory dynamics beneath it (REG is shape-accepted, unimplemented), and
- no motivational consequence above it (`Reg → Intero → Motives` does not exist).

It is a correctly-plumbed pipe with nothing flowing through it in either direction. `PHEN-ADAPT-001` passes, and what it proves — hidden exposure updates adaptation and never leaks into cognition — is genuinely worth proving. But the behavioral payoff of tolerance and sensitization cannot be evaluated until both neighbours exist, and North Star §13 is explicit that satiation, habituation, tolerance and sensitization must remain *causally distinct even when they produce superficially similar behavior*. Right now only one of the four exists, so the distinction that matters has not been tested.

The same applies to `PHEN-BIO-001`, which despite its name tests **biography**, not biology (`MEC-017`, `MEC-018`, `EXP-011`, `EXP-012` — stochastic choices authoring later decision boundaries). This is a good phenomenon and correctly specified. But it means the corpus contains no biological phenomenon at all, and the naming makes that easy to overlook when reading the Campaign 3 mandatory list.

**Recommendation:** rename or alias `PHEN-BIO-001` to `PHEN-BIOG-001` before Campaign 3, and treat the empty biology slot as a named debt rather than an accident of naming.

---

## 7. Gap 6 — Two of thirteen feedback loops are closed

This is the finding I would weight highest for the stated research goal.

The canonical topology in `CHARACTER_ARCHITECTURE.md` §3.2 contains these closed causal loops:

| # | Loop | Status |
|---|---|---|
| 1 | `Affect → Percept` (later salience / retrieval bias) | **absent** |
| 2 | `Affect → Appraisal` (later appraisal bias) | **absent** |
| 3 | `Affect → Control` (control load) | **absent** |
| 4 | `Control → Appraisal` (regulation / reappraisal) | **absent** |
| 5 | `Appraisal → Reg` (named regulatory impulse) | **absent** — `ORD-005` open |
| 6 | `Workspace ↔ Control` | nominal only (two adopted tasks, no competition) |
| 7 | `Consolidation → Disp → Effective → Appraisal` | **absent** — no Effective Disposition exists |
| 8 | `IdentityEvidence → Consolidation → Self → standing modifier → Arbitration` | **closed** (bounded) |
| 9 | `AdaptTransition → RegAdapt → Reg → Intero → Motives` | half — first edge only |
| 10 | `LearningEvidence → Beliefs/Expect → Prospection/OptionGen` | partial — bounded forecast only |
| 11 | `Outcome → Phys → …` | **absent** |
| 12 | `Consolidation → Habits → OptionGen` | **absent** |
| 13 | `AdaptTransition → Skill → ActionPlan/Attempt` | **absent** |

Roughly two of thirteen. The old build, for all its epistemic sins, closed more: need → expectation → score → choice → outcome → need; association → accessibility → choice → co-activation → association; identity → standing modifier → decision → expression → identity.

Why this is the central issue rather than one gap among several:

The North Star's success criteria are almost entirely statements about loops. "Affect that can alter later salience, retrieval, appraisal or control without directly commanding action" (§32.15). "Changes where future uncertainty occurs because that identity changed" (§32.28). "Develops routines, boredom, comfort, habits or addiction through ordinary learning dynamics" (§32.34). The torture-test archetypes in §30 — stress eater, brave despite fear, recovering addict, person who knows what they should do but gives in when exhausted — are *all* loop phenomena. None can be produced by a feed-forward pipeline of any width.

And the paring-down thesis depends on it. A scaffold that is nearly feed-forward will need many mechanisms to produce varied behavior, because each behavior must be built rather than emerge. A scaffold with the loops closed can be much smaller and still produce more. **Closing loops is how you get to "simplest possible"; adding seams is how you get away from it.** The current trajectory — 452 record types, two loops — is pointed the wrong way for the stated objective, and the fact that each individual seam is well-specified makes this harder to see, not easier.

The single highest-value structural change available is probably loop 5 plus loops 1–3: resolve `ORD-005`, let appraisal queue a named regulatory impulse, let regulatory state reach interoception, and let affect bias the next cycle's salience. That is one open decision and one thin transition family, and it converts the architecture from a pipeline into a system.

---

## 8. Gap 7 — Affect is one scalar, and the North Star forbids exactly that

The current appraisal/affect candidate (`CAMPAIGN2_GOAL_APPRAISAL_RESEARCH_TARGET.md`) is:

- appraisal = predicted goal discrepancy, direction Below/Within/Above plus exact distance `max(L-m, 0, m-U)`
- affect = "a separately typed transient concern derived from that appraisal and declared importance"

The document's own discipline is excellent — "do not call the raw distance 'fear' without the additional threat/control semantics fear needs," "no persistent affect field is earned merely by constructing a transient conclusion." That is the right instinct and should not be weakened.

But Brief §12.5 explicitly requires "affect that cannot be reduced to one regulatory axis," North Star §5.3 names twelve distinct affects, and §4's compilation example is `strong anticipated harm + high confidence of exposure + low perceived control → THREAT APPRAISAL → FEAR`. That requires appraisal factorization along at least likelihood / severity / vulnerability / control (`P3-004`, currently CANDIDATE + CORPUS, untouched).

One scalar cannot discriminate fear from frustration from embarrassment, and §5.4's requirement that "two characters may experience similar fear and choose opposite responses" is untestable when there is one affect dimension and one motive family.

The risk is not that the current candidate is wrong — it is a reasonable thin first implementation. The risk is that Campaign 3 runs, reports PASS on its mandatory set, and the record shows a traversable scaffold with a one-dimensional affect that has no outgoing feedback edges, which then becomes the baseline that Campaign 4+ reductions are measured against.

---

## 9. Gap 8 — Method and legibility risks

These are process observations rather than architecture gaps, but they affect whether the architecture gaps get caught.

**9a. Self-review has substantially replaced falsification.** Every verdict since roughly 2026-09-06 is labelled "agent self-review under autonomous-work authorization," explicitly "not external review." The labelling is honest and correct. But the review content is almost entirely about mechanism plumbing — codec ownership, preflight ordering, rollback completeness, admission gates, allocator continuation — and almost never about whether the character behaves like a person. Reading the Campaign 2 adversarial review end to end, I count zero adversarial questions of the form "does this produce plausible behavior," and many of the form "does this leak state." Both matter. Only one is being asked.

**9b. The Seam Ledger's own top table is stale and contradicts its tail.** The header still reads "initial refoundation index," and rows including `cognition/appraisal/affect/regulation | none | unresolved | blocked`, `options → reasons/appraisal/arbitration | none | blocked`, and `encoding ↔ memory/recognition | none | unresolved | blocked` directly contradict the tail's `task-cognitive-path/0.1-candidate` QUALIFIED and the accepted memory qualification. An agent — or a person — resuming from the top of a 1,820-line file gets a materially wrong picture of what is built. Given `AGENTS.md` names this ledger as the active seam-status authority, this is worth a same-day fix.

**9c. Semantic names have been replaced by allocation numbers.** Recent entries read: "Immutable instructions use373/2 field2; lifecycle owns field1, not the root... Common140 admission and target preflight finish before any prior read... actual307 is not character learning evidence... Public64/65 and actual27/26 boundaries execute." A reader cannot tell what `actual307` *is*. The North Star demands "maximum causal legibility before minimum object count," and this is the opposite: the objects are legible only through the allocation tables. This has a direct research cost — it makes review, and therefore falsification, harder, and it makes the corpus and verdict ledgers harder to reconcile against the phenomena they are supposed to serve. A glossary mapping every allocated number in active use to its semantic name would cost an hour and pay for itself immediately.

**9d. Document mass is now itself a risk.** `docs/` holds 607 files and ~25 MB, of which 504 are planning artifacts, many in `REV1`..`REV6` chains. The correct-forward discipline is right, but the working set has outgrown the ability of any single reader to hold it. Consider a `docs/planning/CURRENT.md` that names, for each seam, exactly which document is authoritative right now — with everything else explicitly historical.

**9e. There is no researcher-facing inspection surface.** The old build had a trace viewer, counterfactual panels, calibration sweeps and a live determinism check, and its own README argues that the fast "read the trace, change a slider, re-run, read the trace again" loop was the *reason* the architecture was chosen (`SUB-013`). The new tree has `index.html` and a 377-byte `main.ts`. `TRC-003` (privacy-safe trace projections) is P1 OPEN, and the Campaign 2 review lists "a privacy-safe researcher UI" among what the bounded model does not supply. The only current way to assess whether a character behaves plausibly is to read JSON receipts — which is very likely a contributing cause of 9a. Restoring even a minimal trace viewer over the new contracts would change what kinds of problems get noticed.

---

## 10. Campaign 3 entry readiness — concrete predictions

The Campaign Plan §6 mandatory set, assessed against what exists:

| Phenomenon | Prediction | Basis |
|---|---|---|
| `PHEN-DET-001` | **PASS** | Substrate accepted; replay, save/load, first-divergence all pass |
| `PHEN-ADAPT-001` | **PASS** (already) | 1.11.0 PASS at corpus 0.27.0 |
| `PHEN-EPI-001` | **PASS** | Hidden-Overflow boundary and observational equivalence proven |
| `PHEN-SEM-001` | **PASS** (already) | `SEM-001J` closed the parent |
| `PHEN-LEARN-001` | **AT RISK** | Requires four censored-evidence cases against an established `(mean, precision)` estimate. The only belief-like state is a bounded exact-mean forecast; `MEC-001`/`MEC-002` remain CONTROL/CANDIDATE. `MATH-004` (covariance under quantization) is P1 OPEN |
| `PHEN-MEM-001` | **CANNOT PASS** | Requires ≥2 imprints, equal semantic match, distinct retrieval histories, bounded `topK`, decay, canonical tie-break, selective reinforcement. `MEASUREMENT_EPISODIC_MEMORY.md` states plainly: "General retrieval/decay/top-K, salience/reinforcement, belief, expectation, appraisal/reward/value remain deferred" |
| `PHEN-REASON-001` | **COMPONENT ONLY** | Requires same-motive/different-referent and different-motive/same-referent contrasts and positive/negative contributions. One motive family exists; completion review states "Component Avoid and richer coverage are explicitly not public source claims" |
| `PHEN-DECISION-001` | **LIKELY PASS** | All five die bands, three modes, exact distributions, frozen expression across prevented execution all execute |
| `PHEN-BIO-001` | **PARTIAL** | Empty-history feedback and the 64/65 boundary are genuine public witnesses; "broad biography, coercion/cost and seed-space sufficiency remain corpus obligations" and general `DEC-001` is OPEN |
| `PHEN-COMMIT-001` | **CANNOT PASS** epistemic obligation | Requires "others learn about the commitment only through permitted communication, observation, or records." No social or communication seam exists in any form. `ORD-002` (multi-character ordering) is P1 OPEN, so multi-character fixtures cannot be built |

**Summary: four clear passes, one likely, two partial/component-only, two that cannot pass.** Two of the failures (`PHEN-MEM-001`, `PHEN-COMMIT-001` epistemic) are structural rather than tunable.

Running Campaign 3 as scoped will therefore produce a mixed result whose interpretation is ambiguous: it will look like the scaffold partially failed, when in fact the scaffold was never built to contain what those phenomena test. That ambiguity is worth avoiding, because it will be recorded in the corpus and will contaminate later reopen decisions.

---

## 11. Recommended sequence before Campaign 3

Ordered by leverage per unit of effort.

**Immediate, low cost:**

1. **Fix the Seam Ledger top table** (9b). Half a day. Currently actively misleading.
2. **Publish a number→name glossary** for allocated records/namespaces in active use (9c). An hour.
3. **Rename `PHEN-BIO-001` → `PHEN-BIOG-001`** and record the empty biology slot as a named debt (§6).
4. **Open a seam row for perception/attention/salience**, even as `unresolved / blocked`, and record explicit dispositions for `MEC-005`/`MEC-007`/`RET-001` (§2). Absence is invisible; debt is tracked.
5. **Run the Campaign 3 readiness matrix formally** (§10) and either rescope Campaign 3's mandatory set to what can actually discriminate, or accept the two structural failures in advance and record why.

**Before entering Campaign 3:**

6. **Port 6–10 more phenomena into the corpus** from `EXP-*`/`P3-*` (§3). Prioritize by which families would change Campaign 4+ reduction ordering most: affect/appraisal (12.5), workspace/control (12.6), social cognition (12.10), skill (12.8). This is the single highest-leverage item on the list.
7. **Complete one genuine ablation with a populated verdict** (§4) — `MEC-018` identity feedback is the obvious candidate since `PHEN-BIO-001` already specifies the branch. Proves the verdict machinery executes.
8. **Add a second motive source family** (§5). An embodied deficit source also opens §6; a social source also opens `PHEN-COMMIT-001`'s epistemic obligation and Brief §12.10–12.11. Either converts a large amount of built correlation machinery from component to public scope.

**Before Campaign 4:**

9. **Close loop 5 and loops 1–3** (§7): resolve `ORD-005`, let appraisal queue a named regulatory impulse, let regulatory state reach interoception and motives, let affect bias next-cycle salience. This is the change most likely to make the scaffold behave like a person rather than a pipeline, and it is the prerequisite for the paring-down thesis being testable at all.
10. **Restore a minimal researcher inspection surface** over the new contracts (9e), gated by `TRC-003`.

---

## 12. One framing worth carrying forward

The program has been optimizing for a property — *nothing is authoritative unless it is exactly specified, permanently allocated, and mechanically proven* — that is genuinely necessary and genuinely rare, and it has achieved it to a degree most research codebases never reach.

But that property is a **precondition** for the research, not the research. The research question is which distinctions a person actually needs, and that question is answered by ablating things and watching behavior change, against a corpus rich enough for the change to be visible. Right now the corpus is thin, the loops are open, the verdict ledger is empty of psychological findings, and the review process is asking plumbing questions.

The suggested correction is not to slow down the specification discipline. It is to spend the next increment on **corpus breadth and loop closure rather than seam depth**, so that the very good machinery already built has something worth measuring.
