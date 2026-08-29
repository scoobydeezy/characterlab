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

  return violations;
}
