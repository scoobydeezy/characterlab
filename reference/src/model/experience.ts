/**
 * Experience, per Brief §11 — the atomic learning event. "All systems
 * learn from this shared authoritative Experience. No subsystem gets a
 * private interpretation of what happened."
 */

import { Rational } from '../kernel/rational';
import { ConceptKey, CanonicalActionKey, NeedId } from '../kernel/canonical';
import { NeedLevelSnapshot } from './types';

export interface Experience {
  readonly experienceId: string;
  readonly occurredAt: number;
  readonly actor: ConceptKey;
  readonly action: CanonicalActionKey;
  readonly participants: readonly ConceptKey[];
  readonly contextConcepts: readonly ConceptKey[];
  readonly location: ConceptKey | null;
  readonly needStateBefore: readonly NeedLevelSnapshot[];
  readonly needStateAfter: readonly NeedLevelSnapshot[];
  readonly observations: readonly ConceptKey[];
  readonly semanticTags: readonly ConceptKey[];
}

/**
 * r_n = L_n(after) − L_n(before)
 *
 * The single authoritative "what actually happened to this Need" number
 * every learning subsystem consumes (§11, §12).
 */
export function actualNeedResult(experience: Experience, needId: NeedId): Rational {
  const before = experience.needStateBefore.find((s) => s.needId === needId);
  const after = experience.needStateAfter.find((s) => s.needId === needId);
  if (!before || !after) {
    throw new RangeError(`actualNeedResult: Need ${needId} missing from before/after snapshot`);
  }
  return after.level.sub(before.level);
}
