# General Attention — resume brief

**This is the GA entry point.** Written 2026-09-14 by the external review agent for the
primary implementation agent, who resumes on or after 2026-09-19.

**Completion annotation, 2026-09-20:** the same primary owner completed steps 2–5
without delegation. All 67 concrete706 bindings, 43 frozen public models, actual
source/owner/feedback/credit paths, rollback and complete-prefix replay are qualified.
See `GENERAL_ATTENTION_QUALIFICATION_2026_09_20.md`, `GA_PUBLIC_QUALIFICATION_REV1.json`
and `VER-C3-GA-001`. Corpus0.29.0 preserves twenty members and advances the bounded
attention fixture. This document's dated instructions below remain historical;
the bounded GA work item is COMPLETE, with broader laws and phenomena still scoped.

**Read this before `GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13.md`.** That checkpoint's
frozen-artifact list and technical steps remain correct, but a great deal changed in the
repository on 2026-09-14 while GA was paused, and its "Resume here" ordering is superseded.

---

## 1. Ownership — steps 2–3 are yours, end to end

**Owner ruling, 2026-09-14: the registration and compiler pass (`GENERAL_ATTENTION_PAUSE_CHECKPOINT`
resume steps 2 and 3) belongs to you, and must not be split across agents.**

The reasoning, recorded so it isn't relitigated: binding 67 templates to exact roots,
fields, selectors, return grammars and `ReadDomain`s across ~100 source files and 163
record types is high-volume consistency work over a graph you already hold. The failure
mode of handing it to a fresh agent is not incapacity — it is that a binding looks
locally reasonable while violating a convention or dependency visible three files away.

Steps 2 and 3 are also coupled to each other: step 2 establishes what a registration
*means*, step 3 establishes how the compiler *interprets* it. Splitting those produces
subtle mismatches that become review debt. One owner carries:

```text
template -> registration -> selector/read grammar -> compiler interpretation -> validation
```

all the way through. If your context is exhausted again before the pass completes, do not
bounce it back mid-pass — rehydrate from the canonical manifests and checkpoints and
re-take ownership of the whole pass.

The external agent's contribution stops at the work-ceiling analysis in §3, which is an
**input** to your pass, not a partial start on it. Nothing in `src/` was modified.

---

## 2. What changed while you were paused — read this before resuming

2026-09-14 was a correction pass followed by five experiments. Nothing you froze was
touched: **no accepted contract, allocation, model byte, digest or historical receipt was
modified, and `src/campaign3/priorConcernFeedback.ts` is unchanged.** But the surrounding
record moved considerably.

### Process changes that affect how you work

| Change | Where |
|---|---|
| `CURRENT.md` is now a one-page state index, **replaced not appended**. Its prior 52 KB chronology is preserved verbatim in `CAMPAIGN3_LOG.md`. | `CURRENT.md`, `CAMPAIGN3_LOG.md` |
| A checkpoint template with **four standing rules**, including a **revision cap of 5** and two mandatory counters. | `CHECKPOINT_TEMPLATE.md` |
| **Threshold rule (binding):** past **50 record types allocated since the last verdict or corpus member**, the next work item must be an experiment or a corpus promotion, not another allocation. | `CURRENT.md`, `CHECKPOINT_TEMPLATE.md` |
| Ordinal discipline: **never skip an ordinal to avoid resemblance to an identifier in another typed namespace.** A gap requires an actual reservation. | `CHECKPOINT_TEMPLATE.md` rule 4 |
| A governing work order supersedes the pause checkpoint's ordering. | `CAMPAIGN3_WORK_ORDER_2026_09_14.md` |

The counters exist because GA allocated 163 record types in 48 hours against zero verdicts
and zero corpus members. That is the pattern the reordering was meant to break. Report both
counters at every checkpoint.

### Substantive changes

- **Corpus is now `corpus/0.28.0`**, 21 members, digest
  `1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902`.
  The ten `0.27.0` members are preserved byte-for-byte; eleven Campaign 3 intake proposals
  were promoted, all eleven **BLOCKED or PARTIAL** (3 PARTIAL, 8 BLOCKED; count corrected
  forward on 2026-09-14 in `CAMPAIGN3_LOG.md`). Brief-family coverage went 6 → 13 of 15.
  Membership asserts an obligation **exists**, not that it passes.
  **`corpus/0.27.0` remains a distinct historical commitment and every verdict resting on
  it keeps that version.** Any new verdict must declare coverage against `0.28.0`.
- **The verdict ledger went 7 → 12 entries** (6 substrate, 6 psychological). New:
  `VER-C3-SALIENCE-001`, `VER-C3-EMB-001`, `VER-C3-ATTN-001`, `VER-C3-CONCERN-001`,
  `VER-C3-CONCERN-002`. A bounded qualification receipt is **not** a verdict; every seam
  from here names its Brief §9 Stage C competitor *before* allocation and terminates in a
  ledger entry, `UNRESOLVED` where the comparison has not run.
- **`GENERAL_ATTENTION_CLOSURE_PLAN` obligation #2 is discharged.** The independent /
  shared / hybrid / retired-flat comparison ran as pure arithmetic. `RET-001` is
  **RETRACTED** on its declared domain, now on a live witness. The three derived laws are
  **UNRESOLVED** and mutually distinguishable, so no merger is available. Note the finding
  that corrected a plausible misreading: the ~`1/n` per-edge dependence is **not** the
  `RET-001` defect — all four laws show it. The defect is **budget saturation**.
- **Two owner rulings landed on the concern feedback edge.** See §4.

---

## 3. Work-ceiling analysis — input to your pass

Your checkpoint warned "67 templates is not an event-count ceiling" without saying what
is. `GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json` carries `wholeModelWorkCeiling: null`. It is
now derived. Receipt: `GA_WORK_CEILING_REV1.json`; script:
`scripts/derive-ga-work-ceiling.mjs`; detail: `GENERAL_ATTENTION_WORK_CEILING_CHECKPOINT.md`.

```text
merged invocation graph = 48 `next` edges + 18 conditional edges   (disjoint sets)
merged graph roots                              12   (not 26)
GA-local maximum work                           80   (not 67)
GA-local outputs                                58
phase 130 peak                                  25
phase 140 peak                                  19
stages invoked more than once                    9
  ordinary-memory-formation                     x4
  event-presentation-owner                      x4
  event-presentation-dispatch                   x4
retained-attribution        3 parents -> 1 join
significance-join           3 parents -> 1 join
two replacement stages are substitutive, not additive
prior-concern replacement lane is work-neutral
80 is a LOWER BOUND only
  inherited C2 cognitive / prediction / EMB receiving stages remain outside it
  runtime slot accounting remains outside it
DO NOT freeze a ModelIdentity or work budget against 80
```

Three things a per-template count gets wrong, each of which you will hit during
registration:

1. **The 18 conditional edges are entirely disjoint from the 48 `next` edges.** Building
   the graph from `next` alone reports 26 roots and misclassifies every gated child as an
   externally scheduled root. The external agent made exactly this error on its first pass
   and caught it only because both joins then reported zero parents.
2. **Two stages are joins** — gates reading "exactly one join". Each takes 3 parent
   completions to 1 invocation; per-parent summation overcounts by 4.
3. **Two stages are replacements** — gates reading "Replace X iff …" — mutually exclusive
   with the stage they replace, never additive.

The **work-neutrality of the prior-concern replacement lane** is worth having before you
bind it: identical event and output totals in both lanes, differing only in which stages
are inactive. The concern feedback path does not enlarge the work budget.

**Still owed for a genuine whole-model ceiling:** inherited Campaign 2 cognitive stages,
measurement-prediction stages, EMB receiving stages, any inherited stage repeated by GA
fan-out — counted at **GA** multiplicity, not the inherited manifest's — and runtime slot
accounting, which is a separate budget this graph cannot yield.

---

## 4. The concern feedback edge — settled, with one narrow blocker

Two owner rulings, both recorded in full in `CAMPAIGN3_PENDING_OWNER_DECISIONS.md`
(**zero open items**).

**`OD-C3-001` — RATIFIED WITH SCOPE AMENDMENT.** A lawful prior-instant transient concern
may feed back into later attention/encoding allocation. The ratified precedent is a
**transient character-state → attention feedback seam**. It does **not** qualify
`TaskConcern` as the general Affect representation — `PHEN-AFFECT-001` still owes the
factorized threat work. Keep `EnabledKnown`, `BaselineWithoutAvailableFeedback` and
`DisabledFeedback` **distinct**; do not collapse the latter two into `q = 0`. The first
candidate modifies continuous encoding allocation only; eligibility and `K` are unchanged.

**`OD-C3-002` — design direction.** Neither candidate is the law; both are retained
comparators. The architectural content: **encoding suppression and retrieval amplification
are separate effects and need not share one transfer function.** A and B both conflated
them. Candidate C decouples them and satisfies all seven constraints; it is still
**UNRESOLVED as a law**. C6 was **amended to be fixture-relative** — there is no single
generic recency crossover.

**Known family property, not a defect:** `ω_A ≤ 2` across the whole candidate family,
because `R = f(g·q) ≤ 1` for every gain. A uniquely attains it, and only by driving
incidental encoding to zero. Raising the gain to 100 does not help. **Reopen condition, not
a work item:** if a required phenomenon needs a fixture crossover `≥ 2`, the response bound
itself becomes a comparator. Do not implement a higher-bound family speculatively.

**The GA blocker is narrow — read it precisely:**

> GA **may** qualify the **existence** of the concern → allocation feedback seam once its
> public source, join and path are proven. Only a broader GA verdict that **relies on the
> specific modulation law** must cite `VER-C3-CONCERN-002` and remains unsettled.

Unrelated GA results are not held up by the numerical law. And qualifying this feedback
candidate does **not** give `PHEN-ATTN-001` a whole PASS — its encoding-footprint clause
and later retrieval probe remain BLOCKED on their own seams, per `VER-C3-ATTN-001`.

---

## 5. Your resume sequence

Steps 2–5 from the pause checkpoint, unchanged in content:

2. **Exact registration/model compilation using `706`, not `704`.** Bind each of the 67
   reviewed templates to its permanent members, actual component version, definitions,
   input/output schemas, full `ReadDomain`, PRJ requirement and exact write authorization.
   The fixed scope helper is necessary but does not prove whole registration admission.
3. **Close remaining definition/content instances**, canonical role declarations and domain
   validators, model-specific accessors, state roots and actual output ownership/slots.
   The goal predicate must additionally prove goal/spec/content/referent/holder coupling.
   The accessor surface is proposed in `GA_ACCESSOR_CLOSURE_REV1.md`; its compiler and its
   wrong-subject, absent-cue, wrong-root, tampered-derived-result and rollback controls are
   **OPEN** and are part of your pass.
4. **Materialize exact cohort models and compute the whole-model work ceiling** — now
   starting from the 80/58 GA-local bound in §3 plus the inherited addend, rather than from
   a guess.
5. **Execute public source/subject/owner joins, rollback/replay and corpus promotion**
   before closing GA. Corpus promotion now targets `0.28.0`.

---

### First implementation checkpoint: registration/compiler closure

Preparation added 2026-09-14; this makes steps 2–3 above reviewable, without adding a
contract or starting implementation. Keep both steps with their single owner.

- **Start:** inspect the current worktree and frozen manifests, then locate the actual
  compiler admission boundary and its existing tests. Preserve other agents’ changes.
  Reuse the accepted inventories; generate and diff any derived binding crosswalk.
- **Deliver:** all 67 templates bound through 706 with the exact component, schema,
  read/projection, write, accessor and output definitions required by steps 2–3.
  Report any unresolved binding explicitly; codec or helper coverage cannot fill it.
- **Prove admission:** exercise the actual compiler with valid bindings and the frozen
  wrong-subject, absent-cue, wrong-root and tampered-derived-result controls. Keep
  runtime rollback evidence separately identified if execution awaits cohort models.
- **Validate:** run focused tests for the changed admission path during development;
  at checkpoint run `npm test` and `npm run build`. Preserve frozen commitments and
  report public versus component evidence separately. Test sensitivity does not replace
  the named Stage C model comparisons.
- **Exit:** registration/compiler bindings are evidenced, remaining execution controls
  are named, and step 4 has the inherited-work and slot-accounting inputs it still needs.
  Do not infer a whole-model ceiling, freeze ModelIdentity against 80, or declare GA PASS.

Record the result in the existing log and replace CURRENT using the checkpoint template
(counters currently **706 / 0**). Follow the existing escalation policy: routine bindings
are local work; a genuine ontology, epistemic-authority or unsupported causal-mechanism
fork needs a decision. This checklist creates no additional approval gate.

## 6. What is settled and must not be reopened

- Every frozen artifact in the pause checkpoint's preservation list: the 163-record carrier
  allocation (`542..704`), registry members, the `705`/`706` write-scope correction, and
  all twenty-plus preserved allocation tables.
- `corpus/0.27.0` and `corpus/0.28.0` digests, and every verdict's declared coverage.
- The `OD-C3-001` and `OD-C3-002` rulings, including the amended C6.
- `RET-001` stays retired. `MEC-005` `CONTROL+CONTRACT`; `MEC-007`/`CTL-004` `CONTROL`;
  `MEC-008`/`MEC-009` `CONTROL`; `MEC-010` `CONTROL+CORPUS`.
- Candidates A, B and C are all retained comparators. None is the law.

## 7. Rehydration order

1. This brief
2. `CURRENT.md` — state table and counters
3. `CAMPAIGN3_WORK_ORDER_2026_09_14.md` — items 1–5 complete, you are item 6
4. `CAMPAIGN3_PENDING_OWNER_DECISIONS.md` — both rulings in full, zero open
5. `CHECKPOINT_TEMPLATE.md` — the four rules you report under
6. `GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13.md` — frozen artifacts and technical steps
7. `GA_ACCESSOR_CLOSURE_REV1.md`, `GA_WORK_CEILING_REV1.json` — direct inputs to your pass
8. `CAMPAIGN3_LOG.md` — your own prior chronology, if you need it

General Attention's planned bounded pass is **COMPLETE** as of 2026-09-20.
No owner decision is pending; see the completion annotation above.
