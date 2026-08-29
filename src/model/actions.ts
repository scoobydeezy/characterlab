/**
 * Actions and Action evaluation — Phase 1 subset of Brief §22–23.
 *
 * Phase 1 has no associative graph (Phase 2), so candidate generation here
 * is simplified from the full §22 pipeline: an Action is a candidate iff
 * its world precondition holds. Accessibility-threshold filtering and
 * top-K_A selection are reintroduced in Phase 2 once spreading activation
 * exists to produce an accessibility score to threshold against.
 *
 * Action evaluation (§23) is genuinely partial here, not a simplification
 * of convenience: the Value, Personality, Social, and Context terms each
 * require a mechanism (derived Values §21, latent personality §9, belief/
 * appraisal §18–19, Context representation) that Phase 1 explicitly has
 * not built yet. Score(a) below is ONLY the Need term. This is a scoping
 * fact worth stating loudly because it changes what the Phase-1 experiment
 * results mean: Phase 1 can only show that Need-satisfaction learning
 * alone reproduces attachment-like preference. Whether Value/Personality/
 * Social/Context terms are *necessary* for other phenomena is exactly what
 * later phases test (Brief §36 architectural-implication findings).
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, NeedId } from '../kernel/canonical';
import { ExpectationSubject } from './types';
import { NeedExpectation, confidence } from './expectation';
import { NeedDef } from './needs';

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

/** §22.1–3 simplified for Phase 1: precondition true ⇒ candidate. */
export function candidateActions(
  actions: readonly ActionDef[],
  worldFlags: ReadonlySet<string>,
): ActionDef[] {
  return actions.filter((a) => a.preconditionHolds(worldFlags));
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
