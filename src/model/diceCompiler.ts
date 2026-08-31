/**
 * Base/Standing/Situational compilation, Reason Activation, and dice —
 * Phase 2.97 Brief §34-50 ("Base Die," "Standing Modifier," "Situational
 * Modifier," "Reason Activation," "Avoid Double-Counting During
 * Activation," "Final Reason Dice Expression"). Pure compilation math:
 * consumes `RawCognitiveSignal[]` (already built by `cognitiveSignals.ts`
 * from real CharacterState) and produces `CompiledNucleus[]` — a base die
 * convolved with an integer modifier, ready to hand to
 * `decision.ts::resolveReasonDiceExpressions`, which reuses the untouched
 * Phase 2.9 Contest/Stake/AuthorshipPotential/rolling core.
 *
 * THE ACTIVATION RULE, restated precisely (Brief §41-43): a nucleus EXISTS
 * only if its consolidated MotiveGenerating sum `B_n` is nonzero — no
 * amount of Standing/Situational pressure can manufacture a nucleus where
 * `B_n = 0` (Experiment H). A nucleus that exists becomes DICE-ACTIVE only
 * if `R_n = |B_n| + |StandingNet| + |SituationalNet| >= thetaReason`; an
 * active nucleus whose OWN `B_n` magnitude is below the base-die scale's
 * lowest bracket still gets the floor die (d4) — the die-scale floor is a
 * floor for already-active nuclei, not a second, independent gate that
 * could override activation (Experiment I: a weak-but-genuine motive,
 * rescued to real dice-eligibility by a relevant standing modifier, must
 * still get a real die). `R_n` is activation-only and never feeds back into
 * `B_n` itself — Standing/Situational sums stay in their own modifier
 * slots, never secretly inflating the base motive they modify (Brief §44's
 * anti-double-counting rule, the direct analogue of Phase 2.95's two-map
 * principle).
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey } from '../kernel/canonical';
import { Distribution, uniformDie, pointMass, convolve, negate } from '../kernel/discreteDistribution';
import { SignedContribution, ConsolidatedContribution, consolidateCorrelated, sumEffective } from '../kernel/evidenceOverlap';
import {
  RawCognitiveSignal,
  ReasonNucleusKey,
  ReasonNucleusTriple,
  groupSignalsByTriple,
  resolvedNucleusKey,
  nucleusKeyString,
  compareNucleusKeys,
} from './reasonNucleus';

export interface BaseDieThresholds {
  readonly d4: Rational;
  readonly d6: Rational;
  readonly d8: Rational;
  readonly d10: Rational;
  readonly d12: Rational;
}

/** Versioned, separately-calibrated from `decision.ts::strengthToDie`
 * (Phase 2.97 plan, decision 8) — modifiers here are additive integers on
 * top of this die, not another scaled die, so the two scales are not
 * interchangeable even though they share a shape. `null` below `d4` means
 * "this signal's own base-motive magnitude alone does not clear even the
 * smallest die" — `compileOneTriple` below still floors an ACTIVE nucleus
 * to d4 regardless (see module comment). */
export function strengthToBaseDie(baseMotiveStrength: Rational, thresholds: BaseDieThresholds): number | null {
  const abs = baseMotiveStrength.abs();
  if (abs.gte(thresholds.d12)) return 12;
  if (abs.gte(thresholds.d10)) return 10;
  if (abs.gte(thresholds.d8)) return 8;
  if (abs.gte(thresholds.d6)) return 6;
  if (abs.gte(thresholds.d4)) return 4;
  return null;
}

/** The brief's initial controlled set of Modifier Families (§49) — this
 * build's `situationalMemorySignals`/`situationalExpectationNudgeSignals`
 * (cognitiveSignals.ts) do not distinguish which of `LearnedReliability`/
 * `RecentExperience` their SituationalEvidence belongs to (both are simply
 * `SourceRole: 'SituationalEvidence'`, the brief's own vocabulary), so both
 * consolidate under `RecentExperience`, the more general of the two —
 * `LearnedReliability`/`CurrentContext` are declared for forward
 * compatibility (a future signal source may want the finer split) but
 * unused by any builder this phase, per plan scoping decision 10's
 * "declared, deferred hook" pattern. */
export type ModifierFamilyId = 'StandingIdentity' | 'LearnedReliability' | 'RecentExperience' | 'CurrentContext';

export interface ModifierFamilyDefinition {
  readonly familyId: ModifierFamilyId;
  /** Rational strength worth exactly one integer modifier point — a
   * calibration constant (Brief's "Modifier Calibration Research"),
   * measured empirically in `experiments/calibrationSweeps.ts`, not
   * guessed. */
  readonly unit: Rational;
  /** Integer cap (Brief §49's `MaxMagnitude`) — a modifier never grows
   * without bound regardless of how much consolidated strength feeds it. */
  readonly maxMagnitude: number;
}

/** Rounds a consolidated Rational strength to an integer modifier point,
 * truncating toward zero (never overshoots what the consolidated evidence
 * actually supports — the same rounding convention `decision.ts::drawFace`
 * already uses for its own boundary case) and clamping to
 * `±maxMagnitude`. */
export function strengthToIntegerModifier(strength: Rational, family: ModifierFamilyDefinition): number {
  if (family.unit.isZero()) return 0;
  const scaled = strength.div(family.unit);
  let n = Number(scaled.p / scaled.q); // BigInt division truncates toward zero
  if (n > family.maxMagnitude) n = family.maxMagnitude;
  if (n < -family.maxMagnitude) n = -family.maxMagnitude;
  return n;
}

export interface ReasonNucleusCompilationParams {
  readonly thresholds: BaseDieThresholds;
  readonly modifierFamilies: ReadonlyMap<ModifierFamilyId, ModifierFamilyDefinition>;
  /** θ_reason — R_n at/above this makes an existing (B_n != 0) nucleus
   * dice-active. */
  readonly thetaReason: Rational;
}

export interface CompiledNucleus {
  readonly key: ReasonNucleusKey;
  readonly baseMotiveStrength: Rational; // B_n — consolidated MotiveGenerating net, signed
  readonly reasonRelevance: Rational; // R_n — activation-only, never fed back into B_n
  readonly baseDie: number; // always present for a returned (i.e. active) nucleus
  readonly standingModifier: number;
  readonly situationalModifier: number;
  readonly finalModifier: number; // standingModifier + situationalModifier
  readonly distribution: Distribution; // convolve(uniformDie(baseDie, sign(B_n)), pointMass(finalModifier))
  readonly sourceSignals: readonly RawCognitiveSignal[];
  /** Every MotiveGenerating/Standing/Situational contribution's correlation
   * trace (Brief §64's REASON-header "reproducible" requirement) —
   * concatenated across the three roles' independently-consolidated,
   * sign-partitioned contribution lists (Brief §58-59). */
  readonly correlationTrace: readonly ConsolidatedContribution[];
}

/** Brief §58-59: consolidate a role's contributions WITHIN signed sets
 * (positive support and negative modulation are never allowed to cancel
 * before the correlation discount is applied) via the Reference Correlation
 * Consolidator, then net the two partitions' discounted sums, and finally
 * apply `Rational.boundedResponse` to that net — the same "sum raw
 * contributions, THEN bound" discipline `decision.ts::boundAndFloorChannels`/
 * `identity.ts::identityConsistency` already use throughout this codebase,
 * so a triple's raw signal magnitudes (which, unlike legacy's already-
 * per-Influence-bounded shape, are NOT individually pre-bounded — a raw
 * Need contribution has no fixed range) land in the same interpretable
 * (-1,1) regime the die/modifier calibration thresholds are authored
 * against. Returns both the net (bounded) signed strength and the full
 * (both-partitions) trace for display. */
function consolidateSigned(signals: readonly RawCognitiveSignal[]): { net: Rational; trace: ConsolidatedContribution[] } {
  const toContribution = (s: RawCognitiveSignal): SignedContribution => ({
    id: s.signalId,
    magnitude: s.signedStrength.abs(),
    basis: s.basis,
  });
  const positive = signals.filter((s) => !s.signedStrength.isNegative() && !s.signedStrength.isZero()).map(toContribution);
  const negative = signals.filter((s) => s.signedStrength.isNegative()).map(toContribution);
  const posConsolidated = consolidateCorrelated(positive);
  const negConsolidated = consolidateCorrelated(negative);
  const rawNet = sumEffective(posConsolidated).sub(sumEffective(negConsolidated));
  return { net: Rational.boundedResponse(rawNet), trace: [...posConsolidated, ...negConsolidated] };
}

function compileOneTriple(groupSignals: readonly RawCognitiveSignal[], params: ReasonNucleusCompilationParams): CompiledNucleus | null {
  const triple: ReasonNucleusTriple = {
    optionKey: groupSignals[0].optionKey,
    motiveChannel: groupSignals[0].motiveChannel,
    referent: groupSignals[0].referent,
  };
  const motiveGenerating = groupSignals.filter((s) => s.sourceRole === 'MotiveGenerating');
  const standing = groupSignals.filter((s) => s.sourceRole === 'StandingDisposition');
  const situational = groupSignals.filter((s) => s.sourceRole === 'SituationalEvidence');

  const { net: baseMotiveStrength, trace: baseTrace } = consolidateSigned(motiveGenerating);
  // Brief §41: "A modifier cannot create meaning from nothing" — a nucleus
  // exists only if B_n != 0, checked BEFORE any Standing/Situational
  // pressure is even consulted (Experiment H).
  if (baseMotiveStrength.isZero()) return null;

  const key = resolvedNucleusKey(triple, baseMotiveStrength);

  const { net: standingNet, trace: standingTrace } = consolidateSigned(standing);
  const { net: situationalNet, trace: situationalTrace } = consolidateSigned(situational);

  const standingFamily = params.modifierFamilies.get('StandingIdentity');
  const situationalFamily = params.modifierFamilies.get('RecentExperience');
  const standingModifier = standingFamily ? strengthToIntegerModifier(standingNet, standingFamily) : 0;
  const situationalModifier = situationalFamily ? strengthToIntegerModifier(situationalNet, situationalFamily) : 0;
  const finalModifier = standingModifier + situationalModifier;

  // R_n — activation-only; B_n itself is NEVER incremented by standing/
  // situational pressure (Brief §44).
  const reasonRelevance = baseMotiveStrength.abs().add(standingNet.abs()).add(situationalNet.abs());
  if (reasonRelevance.lt(params.thetaReason)) return null;

  // The die-scale floor is a floor for an ALREADY-ACTIVE nucleus, not an
  // independent second gate — Experiment I's weak-motive rescue needs a
  // genuinely weak B_n (below strengthToBaseDie's own d4 bracket) to still
  // receive a real d4 once R_n clears thetaReason via standing/situational
  // rescue.
  const baseDie = strengthToBaseDie(baseMotiveStrength, params.thresholds) ?? 4;
  // Brief §63: R_n = Polarity_n * (Die_n + M_n) — Die and Modifier convolve
  // in their natural unsigned orientation FIRST, and Polarity applies to
  // the whole sum via `negate`, not folded into the die alone (see
  // `kernel/discreteDistribution.ts::negate`'s doc comment for why this
  // ordering matters for how a modifier's own sign behaves on an Avoid
  // nucleus).
  const magnitudeDistribution = convolve(uniformDie(baseDie, 1), pointMass(BigInt(finalModifier)));
  const distribution = key.direction === 'Avoid' ? negate(magnitudeDistribution) : magnitudeDistribution;

  return {
    key,
    baseMotiveStrength,
    reasonRelevance,
    baseDie,
    standingModifier,
    situationalModifier,
    finalModifier,
    distribution,
    sourceSignals: groupSignals,
    correlationTrace: [...baseTrace, ...standingTrace, ...situationalTrace],
  };
}

/**
 * Top-level entry point: RawCognitiveSignal[] (per option) -> active
 * CompiledNucleus[] (per option), canonically ordered. Throws if the
 * (structurally impossible, given `groupSignalsByTriple`'s exact-match
 * grouping) "one nucleus, one die" invariant (Brief §66) is ever violated —
 * kept as an explicit compiler-correctness assertion, not deferred to
 * `invariants.ts`, since a violation here means a signal-emission or
 * grouping bug, not a fact about runtime CharacterState.
 */
export function compileReasonDice(
  signalsByOption: ReadonlyMap<CanonicalActionKey, readonly RawCognitiveSignal[]>,
  params: ReasonNucleusCompilationParams,
): ReadonlyMap<CanonicalActionKey, readonly CompiledNucleus[]> {
  const result = new Map<CanonicalActionKey, readonly CompiledNucleus[]>();
  for (const [optionKey, signals] of signalsByOption) {
    const groups = groupSignalsByTriple(signals);
    const compiled: CompiledNucleus[] = [];
    const seenKeys = new Set<string>();
    for (const groupSignals of groups.values()) {
      const nucleus = compileOneTriple(groupSignals, params);
      if (!nucleus) continue;
      const keyStr = nucleusKeyString(nucleus.key);
      if (seenKeys.has(keyStr)) {
        throw new RangeError(
          `compileReasonDice: duplicate active ReasonNucleusKey ${keyStr} for option ${optionKey} — one nucleus must produce at most one die (Brief §66)`,
        );
      }
      seenKeys.add(keyStr);
      compiled.push(nucleus);
    }
    compiled.sort((a, b) => compareNucleusKeys(a.key, b.key));
    result.set(optionKey, compiled);
  }
  return result;
}
