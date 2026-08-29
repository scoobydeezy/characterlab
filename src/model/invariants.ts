/**
 * Runtime invariant checks — Brief §6 step "VALIDATE INVARIANTS" and the
 * Phase-1-relevant subset of the §32 proof obligations (quantization bound
 * and bounded-response are checked by unit tests directly against the
 * kernel functions; the invariants below are the ones that depend on
 * *state*, so they run every cycle rather than only in tests).
 */

import { CharacterState } from './character';
import { Rational } from '../kernel/rational';

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

  return violations;
}
