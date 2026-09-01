import { describe, it, expect } from 'vitest';
import { conceptKey } from '../kernel/canonical';
import { EventClock } from '../kernel/event';
import {
  defaultDecisionScenario,
  defaultDecisionCycleParams,
  defaultSemanticReasonPolarity,
  defaultReasonChannelMapping,
  defaultMotiveChannelMapping,
  defaultIdentityMotiveChannelMapping,
  defaultCommitments,
  dinnerVsWorkDecision,
  decisionOutcomeTables,
  ACTION_KEEP_DINNER_PROMISE,
  COMMITMENT_DINNER_WITH_GLEN,
} from '../model/scenario';
import { runDecisionCycle, CycleParams } from '../model/cycle';
import { CommitmentDef } from '../model/commitment';
import { CharacterState } from '../model/character';
import { bootstrapDinnerIdentity } from '../experiments/identityAsModifier';

/**
 * Phase 2.97 closure audit — Commitment lifecycle (a further review, after
 * the second correction landed `model/commitment.ts`). The reviewer's point:
 * a `CommitmentDef` may legitimately be authored as static content, but the
 * MOTIVE PRESSURE it generates cannot be semantically permanent — it must be
 * conditional on the commitment still being live/applicable, and must
 * disappear once the commitment reaches a terminal state (Fulfilled,
 * Relinquished, Missed, Cancelled). History/memory/identity consequences of
 * having held the commitment are unaffected; only the ongoing
 * `MotiveGenerating` pressure is at stake here.
 *
 * This build deliberately does not add commitment-instance/lifecycle-state
 * machinery (no `CommitmentState`, no Fulfilled/Relinquished enum) — nothing
 * in Experiments A-N needs a commitment that transitions mid-run, and adding
 * that machinery now with no experiment driving it would be exactly the
 * "generalize before an experiment demands it" mistake this project has
 * corrected itself out of before. Instead, `runDecisionCycle`'s `commitments`
 * parameter already IS the lifecycle boundary: it is supplied fresh per
 * call (never carried on `CharacterState`), so "this commitment is
 * currently live" is simply "this commitment's `CommitmentDef` (with
 * nonzero `activeObligationPressure`) is present in the list passed to this
 * call." The obligation this test discharges is proving that boundary
 * actually behaves the way the review describes, rather than asserting it
 * from the source comments alone:
 *
 *   T0 — no commitment authored at all, no identity investment either
 *        -> no Commitment nucleus (the plain absence case)
 *   T1 — DinnerWithGlen commitment made active, on a character who has
 *        genuinely invested identity in keeping it (a real, strong
 *        CommitmentFidelity, via the same `bootstrapDinnerIdentity()`
 *        Experiment H's second correction uses)
 *        -> a Commitment x DinnerWithGlen nucleus appears
 *   T3 — that SAME commitment reaches a terminal state (Fulfilled,
 *        Relinquished, Missed, Cancelled alike — this build does not
 *        distinguish which one ended it, only that it no longer presses),
 *        modeled by no longer supplying it — on the SAME identity-rich
 *        character as T1, so identity strength is not what changed
 *        -> its nucleus is absent again, proving retirement removes the
 *           pressure even though the standing identity that once modified
 *           it is still real and strong (the Activation Rule's "a modifier
 *           cannot create meaning from nothing" wall, reapplied across a
 *           lifecycle transition, not just to a nucleus that was never live)
 *   T4 — a NEW DinnerWithGlen-shaped commitment instance (a fresh
 *        `commitmentKey`, standing in for "dinner next week") becomes
 *        active on that same character
 *        -> a NEW nucleus appears, at a NEW referent, never colliding with
 *           or resurrecting T1/T3's retired one — a recurring obligation is
 *           a sequence of independent concrete instances, never one
 *           immortal pressure replayed under the same key
 */
describe('Phase 2.97 closure audit — Commitment lifecycle: pressure is conditional on an active, applicable commitment', () => {
  function reasonNucleiParams(): CycleParams {
    const legacy = defaultDecisionCycleParams();
    return { ...legacy, decision: { ...legacy.decision, compilationMode: 'reasonNuclei' } };
  }

  function commitmentNucleusFor(state: CharacterState, commitments: readonly CommitmentDef[], seed: string) {
    const params = reasonNucleiParams();
    const semanticPolarity = defaultSemanticReasonPolarity();
    const mapping = defaultReasonChannelMapping();
    const clock = new EventClock();
    const decision = dinnerVsWorkDecision(`decision:phase2_97-commitment-lifecycle-${seed}`);
    const outcomeTables = decisionOutcomeTables();

    const result = runDecisionCycle(
      state.characterId,
      state,
      decision,
      outcomeTables,
      params,
      mapping,
      semanticPolarity,
      clock,
      seed,
      undefined,
      undefined,
      defaultMotiveChannelMapping(),
      defaultIdentityMotiveChannelMapping(),
      commitments,
    );

    const keepDinnerPromiseNuclei = result.reasonNucleusTrace!.get(ACTION_KEEP_DINNER_PROMISE) ?? [];
    return keepDinnerPromiseNuclei.find((n) => n.key.motiveChannel === 'Commitment');
  }

  it('T0: with no commitment authored and no identity investment, no Commitment nucleus exists', () => {
    const nucleus = commitmentNucleusFor(defaultDecisionScenario(), [], 'phase2_97-commitment-lifecycle-t0');
    expect(nucleus).toBeUndefined();
  });

  it('T1: once DinnerWithGlen is active on a character genuinely invested in keeping it, a Commitment x DinnerWithGlen nucleus appears', () => {
    const invested = bootstrapDinnerIdentity();
    const commitments = defaultCommitments();
    const nucleus = commitmentNucleusFor(invested, commitments, 'phase2_97-commitment-lifecycle-t1');
    expect(nucleus).toBeDefined();
    expect(nucleus!.key.referent).toBe(COMMITMENT_DINNER_WITH_GLEN);
    expect(nucleus!.baseMotiveStrength.isZero()).toBe(false);
  });

  it('T3: once that commitment is retired, its nucleus is absent again — even though the SAME strong identity that once modified it is still present', () => {
    const invested = bootstrapDinnerIdentity();
    // The lifecycle event itself (T2, "Decision happens, commitment resolves
    // to some terminal state") is not separately modeled by this build (see
    // module doc comment) — what is checked here is its OBSERVABLE
    // consequence: a retired commitment is simply no longer supplied, and
    // the pressure it once generated vanishes with it, EVEN THOUGH the
    // identity built up around it is unaffected. This is the strongest
    // version of the check: it isolates "the commitment retired" as the only
    // variable, ruling out "identity happened to be weak" as an alternative
    // explanation.
    const nucleus = commitmentNucleusFor(invested, [], 'phase2_97-commitment-lifecycle-t3');
    expect(nucleus).toBeUndefined();
  });

  it('T4: a new DinnerWithGlen-shaped commitment instance gets its own referent, independent of the retired one', () => {
    const invested = bootstrapDinnerIdentity();
    const NEXT_DINNER_WITH_GLEN = conceptKey('commitment.dinner_with_glen_next_week');
    const original = defaultCommitments()[0];
    const nextOccurrence: CommitmentDef = { ...original, commitmentKey: NEXT_DINNER_WITH_GLEN };

    const nucleus = commitmentNucleusFor(invested, [nextOccurrence], 'phase2_97-commitment-lifecycle-t4');
    expect(nucleus).toBeDefined();
    expect(nucleus!.key.referent).toBe(NEXT_DINNER_WITH_GLEN);
    // Never resurrects, or is confused with, the original retired commitment's
    // referent — recurring obligations are independent concrete instances,
    // never one immortal pressure replayed under the same key.
    expect(nucleus!.key.referent).not.toBe(COMMITMENT_DINNER_WITH_GLEN);
  });
});
