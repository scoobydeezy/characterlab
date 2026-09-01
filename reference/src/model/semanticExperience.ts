/**
 * SemanticExperience — Phase 2.5e's central architectural payoff, formalized
 * as a first-class type rather than left as an implicit shape scattered
 * across `CycleResult`'s several separate fields.
 *
 * Phase 2.5a/b/c/d's real, jointly-earned discovery was not censoring, or
 * salience, or their interaction individually — it was that a coherent
 * object sits between raw world resolution and cognitive learning: what
 * happened, filtered entirely through what a character could have
 * perceived, attended to, and inferred from it. Every one of the four
 * sub-phases was, in retrospect, discovering one field of this object:
 *
 *   - 2.5a discovered `NeedObservation.evidenceKind` (a Need's realized
 *     effect is not always a point measurement — Brief §19/§27).
 *   - 2.5b/2.5c discovered `ConceptEncoding` (causal role, attention, and
 *     salience are all character-relative, derived facts about THIS
 *     Experience — Brief §5-14, §25-27).
 *   - 2.5d proved the boundary is closed: nothing on this type may be
 *     derived from Capacity/Applied/Overflow's Overflow component, which
 *     stays firmly on the world-truth side (`SaturationAnalysisEntry`,
 *     `CycleResult.saturationAnalysis`) and is deliberately absent from
 *     every field below.
 *
 * This is intentionally a pure, immutable snapshot of one Experience — not
 * a computation. `model/cycle.ts::applyChosenAction` builds one whenever
 * `salienceMode === 'derived'` (Phase 2.5e's canonical default — see
 * `scenario.ts`), from data it already computes; nothing here changes what
 * gets computed, only how it is packaged for downstream consumers. Phase 3
 * (belief/appraisal) is the first consumer this formalization is FOR: it
 * should read a character's `SemanticExperience`, never a raw
 * `WorldOutcomeTable`/`RealizedEffect`/`saturationAnalysis` entry — exactly
 * the interface boundary Brief §18's Belief system will need.
 */

import { ConceptKey, NeedId, CanonicalActionKey } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { ConceptCategory } from './types';
import { CausalRole, EffectProvenance, WorldEventDescriptor, SalienceBudgetMode } from './salience';
import { EvidenceKind } from './expectation';

/**
 * One perceived concept's full character-relative encoding — everything
 * `computeSemanticSalience` derived about it, minus the intermediate
 * factors (`baseSalience`, `roleWeight`, `needRelevance`, `raw`) that exist
 * to make `z` explicable but that a downstream consumer (Phase 3) has no
 * need to re-derive from. `SalienceBreakdown` (model/salience.ts) remains
 * the full explain-everything trace shape for research/UI use; this is its
 * consumer-facing projection.
 */
export interface ConceptEncoding {
  readonly concept: ConceptKey;
  readonly category: ConceptCategory;
  readonly role: CausalRole;
  readonly perceived: boolean;
  readonly attention: Rational;
  /** z_i — the final, budget-resolved semantic salience. 0 for every
   * `perceived: false` concept (Brief §27 Perception Exclusion), exactly as
   * `SalienceBreakdown.z` already guarantees. */
  readonly salience: Rational;
}

/**
 * One Need's observation from this Experience, exactly as the character's
 * own Experience could have registered it. Deliberately has no `overflow`
 * field — Overflow is simulator-omniscient world-truth (Phase 2.5a
 * Correction point 3, reaffirmed by Phase 2.5d's Case 1 Observational
 * Equivalence finding) and has no legitimate place on a character-relative
 * type. `applied` is the realized, possibly boundary-clipped effect (what
 * actually happened to the Need); `evidenceKind` and `surprise` are what
 * that realized effect logically permits the character to conclude about
 * the satisfier, per Phase 2.5a's `EvidenceKind` and Phase 2.5c's
 * evidence-aware `surpriseMagnitude`.
 */
export interface NeedObservation {
  readonly needId: NeedId;
  readonly applied: Rational;
  readonly evidenceKind: EvidenceKind;
  /** The raw (unbounded) `surpriseMagnitude` for this Need's evidence
   * against the prior belief that was active going into this Experience —
   * NOT the same number as any `ConceptEncoding.salience`'s surprise
   * input, which is this value after `Rational.boundedResponse` (salience's
   * multiplicative formula needs a bounded modulator; this field reports
   * the underlying fact it was computed from). */
  readonly surprise: Rational;
}

/**
 * The full character-relative record of one Experience — Phase 2.5e's
 * formalized consolidation object. `provenance`/`perceivedEvent` describe
 * what happened and what of it was perceptible at all (the hard 0/1 gate);
 * `conceptEncodings` is what perceiving-and-attending-to it actually
 * yielded per concept; `needObservations` is what it taught about each
 * Need. `budgetMode` records which salience-budget model (Brief §12)
 * produced these `conceptEncodings[].salience` values, since the same raw
 * scores resolve to different `z_i` under 'independent' vs. 'shared' vs.
 * 'hybrid'.
 */
export interface SemanticExperience {
  readonly experienceId: string;
  readonly actor: ConceptKey;
  readonly occurredAt: number;
  readonly action: CanonicalActionKey;
  readonly provenance: EffectProvenance;
  readonly perceivedEvent: WorldEventDescriptor;
  readonly conceptEncodings: readonly ConceptEncoding[];
  readonly needObservations: readonly NeedObservation[];
  readonly budgetMode: SalienceBudgetMode;
}
