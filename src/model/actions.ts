/**
 * Actions and Action evaluation — Brief §22–23, Phase 1 + Phase 2.
 *
 * Candidate generation is now the real §22 pipeline: an Action is a
 * candidate iff (1) its world precondition holds AND (2) its own concept's
 * spreading-activation accessibility (§16, model/activation.ts) exceeds
 * authored threshold θ_A, and (3) it survives canonical top-K_A selection.
 * `candidateActions` (precondition-only) is kept for tests/back-compat and
 * as the honest Phase-1 baseline to compare against.
 *
 * Action evaluation (§23) is still genuinely partial: the Value,
 * Personality, Social, and Context terms each require a mechanism (derived
 * Values §21, latent personality §9, belief/appraisal §18–19, Context
 * representation) that this build has not built yet. Score(a) below is
 * ONLY the Need term — Brief §23 is explicit that "Association and memory
 * scores are not added again" in evaluation, so Phase 2's accessibility
 * affects *which* Actions are considered, never how desirable a considered
 * Action seems. This is a scoping fact worth stating loudly because it
 * changes what results mean: this build can only show that Need-
 * satisfaction learning plus associative accessibility reproduce certain
 * phenomena. Whether Value/Personality/Social/Context terms are
 * *necessary* for others is exactly what later phases test (§36).
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, NeedId, asConceptKey, compareCanonical } from '../kernel/canonical';
import { ExpectationSubject } from './types';
import { NeedExpectation, confidence } from './expectation';
import { NeedDef } from './needs';
import { ActivationVector } from './activation';

export interface ActionDef {
  readonly actionKey: CanonicalActionKey;
  readonly displayName: string;
  /** The concept this Action's outcome is learned against in
   * NeedExpectation — e.g. `person.glen` for "spend time with Glen." */
  readonly subject: ExpectationSubject;
  /** World precondition — Phase 1 preconditions are simple booleans
   * (e.g. "is Glen available"), authored directly rather than derived from
   * simulated world state, since CharacterLab's world model is out of
   * scope (Brief §2: CharacterLab studies the character, not the world). */
  readonly preconditionHolds: (worldFlags: ReadonlySet<string>) => boolean;
}

export interface ScoredAction {
  readonly actionKey: CanonicalActionKey;
  readonly needTerm: Rational; // N_a
  readonly score: Rational; // Score(a) — Need term only in Phase 1
  readonly boundedScore: Rational; // S̄_a = Score/(1+|Score|)
  readonly perNeedContributions: readonly {
    readonly needId: NeedId;
    readonly urgency: Rational;
    readonly confidence: Rational;
    readonly mu: Rational;
    readonly contribution: Rational;
  }[];
}

/** §22.1–3 simplified for Phase 1: precondition true ⇒ candidate. Kept as
 * the "Need-satisfaction learning alone" baseline — see
 * experiments/substitution.ts, which runs the SAME scenario through both
 * this and candidateActionsWithAccessibility to isolate what accessibility
 * filtering actually changes. */
export function candidateActions(
  actions: readonly ActionDef[],
  worldFlags: ReadonlySet<string>,
): ActionDef[] {
  return actions.filter((a) => a.preconditionHolds(worldFlags));
}

export interface AccessibilityFilterResult {
  readonly candidates: ActionDef[];
  /** Every Action whose precondition held, with its accessibility and
   * whether it passed the threshold/top-K cut — kept for the UI and trace
   * so "why wasn't X a candidate" is always answerable (§30). */
  readonly evaluated: readonly {
    readonly actionKey: CanonicalActionKey;
    readonly accessibility: Rational;
    readonly passedThreshold: boolean;
    readonly selected: boolean;
  }[];
}

/**
 * Full §22 pipeline: precondition AND accessibility(action's own concept)
 * ≥ θ_A, then canonical top-K_A selection among those that pass. Ties at
 * the K_A boundary break by CanonicalActionKey ascending (§6).
 */
export function candidateActionsWithAccessibility(
  actions: readonly ActionDef[],
  worldFlags: ReadonlySet<string>,
  activation: ActivationVector,
  thetaA: Rational,
  kA: number,
): AccessibilityFilterResult {
  const feasible = actions.filter((a) => a.preconditionHolds(worldFlags));
  const withAccessibility = feasible.map((a) => ({
    action: a,
    accessibility: activation.get(asConceptKey(a.actionKey)) ?? Rational.ZERO,
  }));
  const passing = withAccessibility.filter((e) => e.accessibility.gte(thetaA));
  const ranked = [...passing].sort((x, y) => {
    const cmp = y.accessibility.compare(x.accessibility); // descending
    if (cmp !== 0) return cmp;
    return compareCanonical(x.action.actionKey, y.action.actionKey);
  });
  const selected = ranked.slice(0, Math.max(0, kA));
  const selectedKeys = new Set(selected.map((e) => e.action.actionKey));

  const evaluated = withAccessibility.map((e) => ({
    actionKey: e.action.actionKey,
    accessibility: e.accessibility,
    passedThreshold: e.accessibility.gte(thetaA),
    selected: selectedKeys.has(e.action.actionKey),
  }));

  return { candidates: selected.map((e) => e.action), evaluated };
}

export interface NeedContext {
  readonly def: NeedDef;
  readonly urgency: Rational;
}

/**
 * N_a = Σ_n U_n · C_{subject,n} · μ_{subject,n}   (§23 Need term)
 *
 * `expectationsForSubject` supplies, for each Need the character currently
 * has, the learned NeedExpectation of this Action's subject against that
 * Need (defaulting to μ=0, τ=0 ⇒ contribution 0 for anything never
 * experienced — see model/expectation.ts).
 */
export function evaluateAction(
  action: ActionDef,
  needContexts: readonly NeedContext[],
  expectationsForSubject: (needId: NeedId) => NeedExpectation,
  kC: Rational,
): ScoredAction {
  const perNeedContributions = needContexts.map(({ def, urgency }) => {
    const exp = expectationsForSubject(def.needId);
    const c = confidence(exp.tau, kC);
    const contribution = urgency.mul(c).mul(exp.mu);
    return { needId: def.needId, urgency, confidence: c, mu: exp.mu, contribution };
  });

  const needTerm = perNeedContributions.reduce((acc, c) => acc.add(c.contribution), Rational.ZERO);
  const score = needTerm; // Phase 1: Score(a) = N_a only.
  const boundedScore = Rational.boundedResponse(score);

  return {
    actionKey: action.actionKey,
    needTerm,
    score,
    boundedScore,
    perNeedContributions,
  };
}
