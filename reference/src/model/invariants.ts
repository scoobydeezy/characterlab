/**
 * Runtime invariant checks — Brief §6 step "VALIDATE INVARIANTS" and the
 * Phase-1-relevant subset of the §32 proof obligations (quantization bound
 * and bounded-response are checked by unit tests directly against the
 * kernel functions; the invariants below are the ones that depend on
 * *state*, so they run every cycle rather than only in tests).
 */

import { CharacterState } from './character';
import { Rational } from '../kernel/rational';
import { rowSum, getWeight } from './associations';
import { identityStrength, identityConfidence } from './identity';

/** Phase 2.9 constants used ONLY to sanity-check stored evidence against
 * the bound formulas' own shape (any K_I/K_C > 0 gives the same bounds) —
 * not the scenario's actual authored K_I/K_C, which invariants.ts has no
 * access to and does not need for a pure "is this even in range" check. */
const INVARIANT_CHECK_K = Rational.ONE;

export interface InvariantViolation {
  readonly code: string;
  readonly message: string;
}

export function checkInvariants(state: CharacterState): InvariantViolation[] {
  const violations: InvariantViolation[] = [];

  for (const [needId, needState] of state.needStates) {
    if (needState.level.lt(Rational.ZERO) || needState.level.gt(Rational.ONE)) {
      violations.push({
        code: 'need_level_out_of_bounds',
        message: `Need ${needId} level ${needState.level.toString()} is outside [0,1]`,
      });
    }
  }

  for (const [key, exp] of state.expectations) {
    if (exp.tau.isNegative()) {
      violations.push({
        code: 'negative_precision',
        message: `Expectation ${key} has negative precision τ=${exp.tau.toString()}`,
      });
    }
  }

  // Brief §14/§32 "Association invariant": W_ij >= 0 and Σ_j W_ij <= 1 for
  // every row, after every legal mutation. Checked directly against live
  // state every cycle, not just in unit tests against updateAssociations
  // in isolation — this is what would catch a future bug in any new
  // caller that bypassed updateAssociations.
  for (const i of state.associations.concepts) {
    const sum = rowSum(state.associations, i);
    if (sum.gt(Rational.ONE)) {
      violations.push({
        code: 'association_row_oversum',
        message: `Association row ${i} sums to ${sum.toString()}, exceeding 1`,
      });
    }
    for (const j of state.associations.concepts) {
      if (getWeight(state.associations, i, j).isNegative()) {
        violations.push({ code: 'association_negative_weight', message: `W[${i}][${j}] is negative` });
      }
    }
  }

  // Phase 2.9 — IdentityEvidenceState non-negativity and the derived-bound
  // formulas' own shape, checked every cycle exactly like the association
  // invariants above (a guard against a future bug in the update
  // arithmetic, not a claim that the math needs proving here — that's
  // test/phase2_9Identity.test.ts's job). §35's "no legal transition
  // mutates the 7-dim latent personality vector" obligation is vacuously
  // satisfied and not checked here: that vector does not exist in this
  // codebase (see model/decision.ts's module comment).
  for (const [channel, evidence] of state.identityEvidence) {
    if (evidence.support.isNegative()) {
      violations.push({ code: 'identity_support_negative', message: `Identity channel ${channel} has negative Support=${evidence.support.toString()}` });
    }
    if (evidence.opposition.isNegative()) {
      violations.push({ code: 'identity_opposition_negative', message: `Identity channel ${channel} has negative Opposition=${evidence.opposition.toString()}` });
    }
    const strength = identityStrength(evidence, INVARIANT_CHECK_K);
    const negativeOne = Rational.ZERO.sub(Rational.ONE);
    if (!(strength.gt(negativeOne) && strength.lt(Rational.ONE))) {
      violations.push({ code: 'identity_strength_out_of_bounds', message: `Identity channel ${channel} strength ${strength.toString()} is outside (-1,1)` });
    }
    const conf = identityConfidence(evidence, INVARIANT_CHECK_K);
    if (!(conf.gte(Rational.ZERO) && conf.lt(Rational.ONE))) {
      violations.push({ code: 'identity_confidence_out_of_bounds', message: `Identity channel ${channel} confidence ${conf.toString()} is outside [0,1)` });
    }
  }

  return violations;
}
