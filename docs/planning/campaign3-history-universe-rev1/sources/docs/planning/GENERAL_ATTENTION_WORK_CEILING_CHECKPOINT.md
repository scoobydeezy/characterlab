# General Attention work-ceiling checkpoint

**Disposition:** LOCAL DISPOSITION — no owner ruling required. GA remains OPEN.
**Stage (Brief §9):** A — make the seam exist (analysis supporting registration closure)
**Date:** 2026-09-14. Resume step 4 of `GENERAL_ATTENTION_PAUSE_CHECKPOINT_2026_09_13`.

## Counters

| Counter | Value |
|---|---|
| Highest allocated record type | 706 |
| Allocated since last verdict/corpus member | **0** |

Nothing was allocated by this analysis.

## What changed

`GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json` carries `wholeModelWorkCeiling: null`, and the
pause checkpoint warns that "67 templates is not an event-count ceiling." The GA-local
bound is now derived rather than assumed: **80 stage invocations and 58 outputs** in one
instant, against 67 templates. See `GA_WORK_CEILING_REV1.json` and
`scripts/derive-ga-work-ceiling.mjs`.

## Why the naive count is wrong

Three structures, each of which a per-template count misses:

- **The 18 conditional edges are disjoint from the 48 `next` edges.** A graph built from
  `next` alone reports 26 roots; the merged 66-edge graph has **12**. That error both
  misplaces the roots and undercounts fan-out.
- **Two stages are joins.** `retained-attribution` and `significance-join` each declare
  "exactly one join" and each take **3 parent completions to 1 invocation**. Summing per
  parent overcounts by 4.
- **Two stages are replacements.** `prior-concern-visual-encoding` and
  `prior-concern-event-rank` "Replace X iff …" and are mutually exclusive with the stage
  they replace, so they are never additive.

## Findings

- The gap is **13 events**, driven by repeated rank and owner invocations exactly as the
  checkpoint predicted. Nine stages run more than once; `ordinary-memory-formation`,
  `event-presentation-owner` and `event-presentation-dispatch` each reach **4**.
- **Phase 130 is the peak at 25 invocations**, phase 140 next at 19. A per-phase budget
  must be sized on those two, not on an average across the eighteen phases.
- **The prior-concern replacement lane is work-neutral** — identical event and output
  totals, differing only in which stages are inactive. The concern feedback path does not
  enlarge the work budget. Worth having established *before* registration binds it.

## Handoff

This analysis is an **input** to the registration/compiler pass, which is owned end-to-end
by the primary implementation agent from 2026-09-19. It is not a partial start on that
pass; nothing in `src/` was modified. The consolidated handoff is
[`GENERAL_ATTENTION_RESUME_BRIEF.md`](GENERAL_ATTENTION_RESUME_BRIEF.md).

## Stage C competitor

Not applicable — this is a derivation from an accepted topology, not a mechanism
comparison. It introduces no candidate and no psychological claim.

## North Star transfer

Serves §24 scale plausibility and the Brief's determinism obligations: a work ceiling is
what lets the scheduler reject an over-budget instant deterministically instead of
discovering it at runtime. No §30 archetype is claimed.

## Next gate

Add the inherited addend. **80 is a lower bound, not the ceiling.** Still required:
inherited Campaign 2 cognitive stages, measurement-prediction stages, EMB receiving
stages, any inherited stage repeated by GA fan-out (counted at *GA* multiplicity, not the
inherited manifest's), and runtime slot accounting, which is a separate budget and cannot
be derived from this graph. **Do not freeze a ModelIdentity or a work budget against 80.**

## Owner decision pending

No. `CAMPAIGN3_PENDING_OWNER_DECISIONS.md` has zero open items.
