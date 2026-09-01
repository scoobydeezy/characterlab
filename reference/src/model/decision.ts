/**
 * Decision resolution, per Phase 2.9 Brief §6-14 ("Decision Authorship,
 * Acquired Identity, and the Role of Dice"). Pure Decision math: takes
 * already-assembled `DecisionInfluence[]` as input and does NOT import
 * `activation.ts`/`actions.ts`/`character.ts` — mirroring how `choice.ts`
 * takes already-scored `ScoredAction[]` rather than reaching into Need
 * state itself. All CharacterState-reading glue (building the Influences
 * from Need urgency, accessibility, and identity consistency) lives in
 * `cycle.ts::runDecisionCycle`.
 *
 * `Decision` is a NEW, parallel front-end to Action selection, not a
 * replacement for `choice.ts`'s softmax pipeline — ordinary autonomous
 * cycles keep choosing among however many accessibility-filtered candidate
 * Actions exist exactly as before. This module is used only for an
 * explicitly-authored small-Option dilemma (typically 2, occasionally 3
 * Options), where each Option is backed 1:1 by an existing `ActionDef` — so
 * an Option's identity IS its `actionDef.actionKey` (no separate branded
 * `OptionId`), and a Decision's id reuses `SimEvent.eventId` directly
 * (`DecisionId`), exactly how `Experience`/`Memory` already reuse
 * `event.eventId` rather than minting a parallel id scheme.
 *
 * PERSONALITY SCOPING NOTE (Phase 2.9 plan, scoping decision 1): the master
 * Brief's latent 7-dimensional personality vector P is NOT implemented
 * anywhere in this codebase yet (`character.ts` says so explicitly), and
 * the master Brief's own Phase Structure assigns P to Phase 3. This module
 * therefore has no personality-sourced DecisionInfluence and no
 * "double-counting" guard against one. Brief §23's warning — "a high-Agency
 * character may be predisposed toward risk-taking, but do not ALSO give
 * Risk-Taker evidence merely because Agency was high; behavior is the
 * mediator" — remains a real constraint whenever Phase 3 adds P and a
 * personality-sourced Influence becomes possible. At that point, such an
 * Influence must flow through the ordinary `DecisionInfluence` /
 * `Alignment` pipeline exactly like every other source (Need urgency,
 * accessibility, identity consistency) — never as a second, separate bonus
 * applied on top of the behavior it already helped produce.
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, ConceptKey, compareCanonical } from '../kernel/canonical';
import { DrawAddress, drawUniform } from '../kernel/random';
import { ActionDef } from './actions';
import {
  Distribution,
  uniformDie,
  convolveAll,
  expectedValue,
  winProbabilities,
} from '../kernel/discreteDistribution';
import { CompiledNucleus, ReasonNucleusCompilationParams } from './diceCompiler';
import { nucleusKeyString } from './reasonNucleus';

/** Which existing system (or the new identity-feedback channel) produced a
 * DecisionInfluence, and — for Need-sourced influences — which Need. This
 * doubles as the `Alignment` polarity table's lookup key in `identity.ts`:
 * a NeedId string names a stable, global semantic category ("what does
 * satisfying Connection mean"), never a per-scenario-instance number, so
 * keying polarity by ReasonChannel stays within Brief §5.1's "no named-
 * entity weights" rule exactly as `salience.ts`'s category/role tables do. */
/**
 * Phase 2.95 — Reason Consolidation. A semantic reason channel represents a
 * coherent human-scale motivational domain (e.g. "keeping my commitments"),
 * not a raw individual psychological signal. Multiple lower-level pressures
 * (Need urgency, identity consistency, accessibility) consolidate into single
 * per-channel strengths BEFORE die calibration, so weak signals can combine
 * meaningfully rather than disappearing individually below the floor.
 */
export type SemanticReasonChannelId =
  | 'commitment'     // Connection need + Dependable/responsible identity
  | 'recognition'    // Achievement/status need + Risk-Taker/ambitious identity
  | 'caretaking'     // Caregiving identity + observed others' needs
  | 'autonomy'       // Authority-defiance identity + novel/opposed pressures
  | 'energetic'      // Energy need + work persistence / novelty seeking
  | 'affiliation';   // Social approach + connection security

/**
 * Old-style reason channels (used internally during consolidation, but not
 * as final Influence reasonChannel — kept for backward compatibility with
 * existing polarity tables during phase 2.95 transition).
 */
export type ReasonChannel = string | SemanticReasonChannelId;

export const REASON_CHANNEL_ACCESSIBILITY: ReasonChannel = 'accessibility';
export const REASON_CHANNEL_IDENTITY_CONSISTENCY: ReasonChannel = 'identity_consistency';

export const SEMANTIC_REASON_CHANNELS: readonly SemanticReasonChannelId[] = [
  'commitment',
  'recognition',
  'caretaking',
  'autonomy',
  'energetic',
  'affiliation',
];

/** An Option backed 1:1 by an existing ActionDef — see module comment. */
export interface Option {
  readonly actionDef: ActionDef;
}

export interface Decision {
  readonly decisionId: string;
  readonly actor: ConceptKey;
  readonly options: readonly Option[];
}

/** One signed, named pressure on one Option (Brief §7). `rawStrength` is
 * kept for trace fidelity; `signedStrength` is `Rational.boundedResponse
 * (rawStrength)` — used for die-size lookup and `sign()` — so the die-scale
 * thresholds below mean the same thing regardless of which system produced
 * the raw value (Need contributions have no fixed range; the identity-
 * consistency channel is already bounded by construction). */
export interface DecisionInfluence {
  readonly influenceId: string;
  readonly optionKey: CanonicalActionKey;
  readonly reasonChannel: ReasonChannel;
  readonly source: string;
  readonly rawStrength: Rational;
  readonly signedStrength: Rational;
}

/** Illustrative reference scale (Brief §8): weak/moderate/strong/very-
 * strong/extreme thresholds mapping |signedStrength| to a die size. Below
 * `weak`, an Influence gets no die at all (Brief §7's "one human-scale
 * reason should not silently become several dice" extended to "a
 * negligible reason shouldn't become a die either") — it is dropped
 * entirely: no RNG draw, not counted in `M_o`. Exact thresholds are
 * versioned experimental constants, not final game-balance values. */
export interface DieScaleParams {
  readonly weak: Rational;
  readonly moderate: Rational;
  readonly strong: Rational;
  readonly veryStrong: Rational;
  readonly extreme: Rational;
}

export interface DecisionParams {
  readonly dieScale: DieScaleParams;
  /** θ_roll — Contest below this auto-resolves (no dice). */
  readonly thetaRoll: Rational;
  /** θ_player — AuthorshipPotential at/above this makes a rolled Decision
   * player-facing rather than a QuietRoll. */
  readonly thetaPlayer: Rational;
  /** θ_trait / θ_confidence — named-trait consolidation thresholds
   * (identity.ts::isConsolidated). */
  readonly thetaTrait: Rational;
  readonly thetaConfidence: Rational;
  /** K_I / K_C — identity-strength / identity-confidence half-saturation
   * constants (identity.ts). */
  readonly kI: Rational;
  readonly kC: Rational;
  /** Ablation switch (Phase 2.9 plan, scoping decision 6): when false, no
   * `identity_consistency` Influence is generated, so an identical seeded
   * decision sequence can be re-run without the identity-feedback channel
   * to isolate what it specifically contributes, alongside the ordinary
   * Hebbian-accessibility reinforcement `runDecisionCycle` shares with
   * every other cycle path regardless of this flag. */
  readonly identityFeedbackEnabled: boolean;
  /** Phase 2.97 plan, scoping decision 1: which consolidation pipeline
   * `cycle.ts::runDecisionCycle` uses to decide what gets a die at all.
   * `'legacy'` (default) is the UNCHANGED Phase 2.9/2.95
   * `SemanticReasonChannelId` pipeline above — frozen as the historical
   * baseline `experiments/oldVsNewCompilation.ts` (Experiment M) compares
   * against, and how Phase 2.9/2.95's own behaviors stay provably
   * unregressed. `'reasonNuclei'` routes through
   * `cognitiveSignals.ts`/`diceCompiler.ts` instead — both modes still
   * produce a `DecisionResolution` via the SAME shared
   * `resolveDecisionCore`. */
  readonly compilationMode: 'legacy' | 'reasonNuclei';
  /** Present on every `DecisionParams` value regardless of
   * `compilationMode`, exactly like `dieScale` above is present even when
   * a caller never rolls a single Reason Nucleus — mirrors
   * `CycleParams.salience` being populated even when `salienceMode` is
   * `'legacy'`. Only consulted when `compilationMode === 'reasonNuclei'`. */
  readonly reasonNucleus: ReasonNucleusCompilationParams;
}

export function strengthToDie(signedStrength: Rational, scale: DieScaleParams): number | null {
  const abs = signedStrength.abs();
  if (abs.gte(scale.extreme)) return 12;
  if (abs.gte(scale.veryStrong)) return 10;
  if (abs.gte(scale.strong)) return 8;
  if (abs.gte(scale.moderate)) return 6;
  if (abs.gte(scale.weak)) return 4;
  return null;
}

function signOf(x: Rational): 1 | -1 {
  return x.isNegative() ? -1 : 1;
}

/**
 * Phase 2.95 — Consolidation of raw pressures into semantic reason channels.
 * Maps raw source + reason to a semantic channel, so multiple weak signals
 * can combine before the floor check (rather than disappearing individually).
 * This type tracks which raw influences contribute to each semantic channel
 * on each option.
 */
export interface RawReasonInfluence {
  readonly source: string;        // 'need_contribution', 'accessibility', 'identity_consistency'
  readonly reasonChannel: string;  // NeedId or REASON_CHANNEL_*
  readonly strength: Rational;     // Pre-boundedResponse raw value
}

/**
 * Sum raw (unbounded) pressures by semantic reason channel — the FIRST half
 * of consolidation, exposed on its own so a caller can fold MORE raw
 * pressure (identity's own feedback contribution — see
 * `identity.ts::identityFeedbackRawInfluences`) into the same per-channel
 * pool before anyone applies `boundedResponse` or the floor check. Channels
 * with no contributing raw influence are simply absent from the result.
 */
export function sumRawBySemanticChannel(
  rawInfluences: readonly RawReasonInfluence[],
  reasonChannelMapping: ReadonlyMap<string, SemanticReasonChannelId>,
): Map<SemanticReasonChannelId, Rational> {
  const byChannel = new Map<SemanticReasonChannelId, Rational>();
  for (const influence of rawInfluences) {
    const semanticChannel = reasonChannelMapping.get(influence.reasonChannel);
    if (!semanticChannel) continue; // Unmapped raw reason is skipped (shouldn't happen with full mapping)
    const current = byChannel.get(semanticChannel) ?? Rational.ZERO;
    byChannel.set(semanticChannel, current.add(influence.strength));
  }
  return byChannel;
}

/**
 * The SECOND half of consolidation: bound each channel's raw sum via
 * `boundedResponse`, then drop any channel that doesn't clear the die
 * floor. This is the step that must run AFTER every raw contributor to a
 * channel (Need/accessibility, and — when enabled — identity's own
 * feedback) has already been summed by `sumRawBySemanticChannel`, so weak
 * signals sharing a channel get one shared chance to clear the floor
 * together rather than each being bounded-and-floored alone.
 */
export function boundAndFloorChannels(
  byChannel: ReadonlyMap<SemanticReasonChannelId, Rational>,
  scale: DieScaleParams,
): Map<SemanticReasonChannelId, Rational> {
  const consolidated = new Map<SemanticReasonChannelId, Rational>();
  for (const [channel, rawSum] of byChannel) {
    const bounded = Rational.boundedResponse(rawSum);
    if (strengthToDie(bounded, scale) !== null) {
      consolidated.set(channel, bounded);
    }
  }
  return consolidated;
}

/**
 * Dense per-channel `boundedResponse`, over EVERY semantic channel
 * (`SEMANTIC_REASON_CHANNELS`), with NO floor filtering — channels with no
 * raw contribution come back as exactly `Rational.ZERO`, never absent. This
 * is deliberately NOT the same thing `boundAndFloorChannels` produces:
 * Alignment/IdentityExpression (identity.ts) need a continuous, always-
 * defined "what did this option's content mean" signal, not a sparse,
 * dice-eligibility-gated one — see identity.ts's module comment for why
 * gating Alignment on the die floor was what made target behavior (A)
 * ("gradual identity influence, no giant discontinuities") unreachable
 * under the original Phase 2.9 shape.
 */
export function boundAllChannels(byChannel: ReadonlyMap<SemanticReasonChannelId, Rational>): Map<SemanticReasonChannelId, Rational> {
  const out = new Map<SemanticReasonChannelId, Rational>();
  for (const channel of SEMANTIC_REASON_CHANNELS) {
    const raw = byChannel.get(channel) ?? Rational.ZERO;
    out.set(channel, Rational.boundedResponse(raw));
  }
  return out;
}

/**
 * Consolidate raw pressures by semantic reason channel: sum, then bound,
 * then floor-filter — `sumRawBySemanticChannel` composed with
 * `boundAndFloorChannels`. Kept as its own function for callers (and
 * existing tests) that only ever have ONE source of raw pressure to
 * consolidate and don't need to fold in a second raw pool first.
 */
export function consolidateRawInfluences(
  rawInfluences: readonly RawReasonInfluence[],
  reasonChannelMapping: ReadonlyMap<string, SemanticReasonChannelId>,
  scale: DieScaleParams,
): Map<SemanticReasonChannelId, Rational> {
  return boundAndFloorChannels(sumRawBySemanticChannel(rawInfluences, reasonChannelMapping), scale);
}

/**
 * Build DecisionInfluences from consolidated semantic reason channels,
 * creating one influence per surviving consolidated channel per option.
 */
export function buildConsolidatedInfluences(
  optionKey: CanonicalActionKey,
  consolidatedByChannel: ReadonlyMap<SemanticReasonChannelId, Rational>,
  idPrefix: string,
): DecisionInfluence[] {
  const influences: DecisionInfluence[] = [];
  for (const [channel, strength] of consolidatedByChannel) {
    influences.push({
      influenceId: `${idPrefix}:${channel}`,
      optionKey,
      reasonChannel: channel as ReasonChannel,
      source: 'consolidated_reason',
      rawStrength: strength,
      signedStrength: strength, // Already bounded by consolidateRawInfluences
    });
  }
  return influences;
}

export type ResolutionMode = 'Auto' | 'QuietRoll' | 'PlayerFacingRoll';

export interface InfluenceRoll {
  readonly influenceId: string;
  readonly optionKey: CanonicalActionKey;
  readonly faces: number;
  readonly sign: 1 | -1;
  readonly draw: Rational; // u ∈ [0,1) from the counter-addressed oracle
  readonly rollValue: number; // r_i ∈ {1,...,faces}
  readonly signedContribution: number; // c_i = sign · r_i
}

export interface OptionProbability {
  readonly optionKey: CanonicalActionKey;
  readonly probability: Rational;
}

export interface TieBreakDraw {
  readonly candidates: readonly CanonicalActionKey[];
  readonly draw: Rational;
  readonly selected: CanonicalActionKey;
}

export interface DecisionResolution {
  readonly preRollOptionProbabilities: readonly OptionProbability[]; // sums to exactly 1
  readonly margin: Rational; // p1 - p2
  readonly contest: Rational; // 1 - margin
  readonly conflictMass: Rational; // min(M_1, M_2) over the top-2-by-probability options
  readonly stake: Rational; // boundedResponse(conflictMass)
  readonly authorshipPotential: Rational; // contest * stake
  readonly resolutionMode: ResolutionMode;
  /** Legacy-pipeline-only (`resolveDecision`): every surviving
   * `DecisionInfluence` per Option. Empty under
   * `resolveReasonDiceExpressions` (Phase 2.97's Reason Nuclei pipeline) —
   * the equivalent per-reason detail there is the `CompiledNucleus[]` the
   * caller already has (`model/diceCompiler.ts::compileReasonDice`'s own
   * return value), not re-derivable from a `DecisionInfluence` shape. */
  readonly survivingInfluencesByOption: ReadonlyMap<CanonicalActionKey, readonly DecisionInfluence[]>;
  readonly influenceRolls: readonly InfluenceRoll[]; // empty for 'Auto'
  readonly tieBreak: TieBreakDraw | null;
  readonly chosenOption: CanonicalActionKey;
  /** Same value as `chosenOption` in this module — kept as a distinct field
   * matching the brief's own §14/§18 "chosen intent, not physical outcome"
   * vocabulary, so `cycle.ts::runDecisionCycle` can execute a DIFFERENT
   * ActionDef/WorldOutcomeTable (Experiment K's forced-outcome override)
   * while this field still records what was actually decided. */
  readonly chosenIntent: CanonicalActionKey;
}

function optionDistribution(
  survivingInfluences: readonly DecisionInfluence[],
  scale: DieScaleParams,
): Distribution {
  const dice = survivingInfluences.map((inf) => {
    const faces = strengthToDie(inf.signedStrength, scale)!; // caller has already filtered nulls
    return uniformDie(faces, signOf(inf.signedStrength));
  });
  return convolveAll(dice);
}

/** M_o = Σ_i |ExpectedContribution_i| — computed from each surviving
 * Influence's actual signed die distribution (via `expectedValue`, not a
 * hand-derived `(faces+1)/2`), so it stays correct for free if a later
 * phase ever makes a die non-uniform. */
function motivationalMass(survivingInfluences: readonly DecisionInfluence[], scale: DieScaleParams): Rational {
  return survivingInfluences.reduce((acc, inf) => {
    const faces = strengthToDie(inf.signedStrength, scale)!;
    const die = uniformDie(faces, signOf(inf.signedStrength));
    return acc.add(expectedValue(die).abs());
  }, Rational.ZERO);
}

/** Extract a face value r ∈ {1,...,faces} from a uniform draw u ∈ [0,1),
 * via exact bigint floor division (u.p/u.q truncates toward zero, which
 * equals floor for the non-negative u the counter-addressed oracle always
 * produces) — same "exact math, explicit edge case, no throw" discipline
 * `choice.ts::selectAction` already uses for its own boundary case. */
function drawFace(u: Rational, faces: number): number {
  const scaled = u.mul(Rational.of(BigInt(faces), 1n));
  const floor = scaled.p / scaled.q; // u ∈ [0,1) ⇒ scaled ∈ [0,faces) ⇒ non-negative ⇒ truncation == floor
  const face = Number(floor) + 1;
  return face > faces ? faces : face < 1 ? 1 : face; // guard the u→1 boundary exactly like selectAction's fallback
}

/**
 * Phase 2.97 plan, scoping decision 2 — the one real refactor of existing
 * code. `resolveDecision`'s Contest/Stake/AuthorshipPotential/rolling logic
 * is exactly the "exact discrete-distribution math" Brief §34 requires
 * Phase 2.97 to reuse "unless incompatibility demonstrated"; nothing about
 * Reason Nuclei is a probability-math change. `CoreReason` is the one
 * generalization that lets BOTH pipelines share this logic: something a
 * Decision's Option can roll, already reduced to a `faces`/`sign`/`addend`/
 * `distribution` quadruple — for the legacy pipeline `addend` is always 0
 * (a `DecisionInfluence` never had a modifier) and `distribution` is the
 * plain signed die `resolveDecision`'s wrapper below always built; for the
 * Reason Nuclei pipeline `faces`/`addend`/`distribution` come straight off
 * a `CompiledNucleus` (`model/diceCompiler.ts`), whose `distribution`
 * already encodes Brief §63's `Polarity_n · (Die_n + M_n)`. Rolling still
 * only needs `faces`/`sign`/`addend` (the actual random draw is over the
 * unsigned die alone, exactly as `resolveDecision` always did) —
 * `distribution` is consulted only for the PRE-ROLL win-probability/
 * motivational-mass computation.
 */
export interface CoreReason {
  readonly id: string; // InfluenceId equivalent — canonical roll-address/tie-break key
  readonly optionKey: CanonicalActionKey;
  readonly faces: number;
  readonly sign: 1 | -1;
  readonly addend: number; // integer added to the die's raw face before `sign` is applied to the whole sum (0 for legacy)
  readonly distribution: Distribution; // the reason's full, already-signed contribution distribution
}

/**
 * The shared resolution core (Phase 2.97 plan, decision 2): exact pre-roll
 * probabilities, Margin/Contest, ConflictMass/Stake, AuthorshipPotential,
 * resolution-mode classification, and — for a rolled Decision — the actual
 * dice via the counter-addressed oracle, addressed per Brief §8 as
 * `RNG(Seed, DecisionId, InfluenceId, Purpose=DecisionRoll)`, mapped onto
 * `DrawAddress{seed,eventId,purposeId,drawIndex}` exactly as before:
 * `eventId = decisionId`, `purposeId = 'decision_roll'`, `drawIndex` = the
 * reason's canonical ordinal position among ALL of this Decision's reasons
 * (sorted by `compareCanonical` over `id`). Returns everything
 * `DecisionResolution` needs EXCEPT `survivingInfluencesByOption`, which is
 * a legacy-`DecisionInfluence`-shaped field only `resolveDecision`'s own
 * wrapper below can meaningfully populate.
 */
function resolveDecisionCore(
  decision: Decision,
  reasonsByOption: ReadonlyMap<CanonicalActionKey, readonly CoreReason[]>,
  thetaRoll: Rational,
  thetaPlayer: Rational,
  seed: string,
): Omit<DecisionResolution, 'survivingInfluencesByOption'> {
  if (decision.options.length === 0) {
    throw new RangeError('resolveDecisionCore: a Decision needs at least one Option');
  }

  const distByOption = new Map<CanonicalActionKey, Distribution>();
  for (const opt of decision.options) {
    const reasons = reasonsByOption.get(opt.actionDef.actionKey) ?? [];
    distByOption.set(opt.actionDef.actionKey, convolveAll(reasons.map((r) => r.distribution)));
  }

  const winProbs = winProbabilities(
    decision.options.map((o) => ({ id: o.actionDef.actionKey as string, dist: distByOption.get(o.actionDef.actionKey)! })),
  );
  const preRollOptionProbabilities: OptionProbability[] = decision.options.map((o) => ({
    optionKey: o.actionDef.actionKey,
    probability: winProbs.get(o.actionDef.actionKey as string) ?? Rational.ZERO,
  }));

  // Rank by descending probability, ties broken by canonical ActionKey —
  // the same pair (p1, p2) is used for BOTH Margin/Contest and ConflictMass
  // (scoping decision 7), so the two metrics never describe different
  // option-pairs when there are 3+ Options.
  const ranked = [...preRollOptionProbabilities].sort((a, b) => {
    const cmp = b.probability.compare(a.probability);
    return cmp !== 0 ? cmp : compareCanonical(a.optionKey, b.optionKey);
  });
  const p1 = ranked[0].probability;
  const p2 = ranked.length > 1 ? ranked[1].probability : Rational.ZERO;
  const margin = p1.sub(p2);
  const contest = Rational.ONE.sub(margin);

  const massOf = (optionKey: CanonicalActionKey) =>
    (reasonsByOption.get(optionKey) ?? []).reduce((acc, r) => acc.add(expectedValue(r.distribution).abs()), Rational.ZERO);
  const mLead1 = massOf(ranked[0].optionKey);
  const mLead2 = ranked.length > 1 ? massOf(ranked[1].optionKey) : Rational.ZERO;
  const conflictMass = mLead1.min(mLead2);
  const stake = Rational.boundedResponse(conflictMass);
  const authorshipPotential = contest.mul(stake);

  let resolutionMode: ResolutionMode;
  if (contest.lt(thetaRoll)) {
    resolutionMode = 'Auto';
  } else if (authorshipPotential.gte(thetaPlayer)) {
    resolutionMode = 'PlayerFacingRoll';
  } else {
    resolutionMode = 'QuietRoll';
  }

  if (resolutionMode === 'Auto') {
    // Highest pre-roll probability wins outright — no dice thrown.
    const winner = ranked[0].optionKey;
    return {
      preRollOptionProbabilities,
      margin,
      contest,
      conflictMass,
      stake,
      authorshipPotential,
      resolutionMode,
      influenceRolls: [],
      tieBreak: null,
      chosenOption: winner,
      chosenIntent: winner,
    };
  }

  // Roll every reason's die, addressed by its canonical ordinal position
  // among ALL of this Decision's reasons.
  const allReasons = [...reasonsByOption.values()].flat();
  const orderedIds = [...allReasons.map((r) => r.id)].sort(compareCanonical);
  const drawIndexOf = new Map(orderedIds.map((id, idx) => [id, idx]));

  const influenceRolls: InfluenceRoll[] = [];
  const rollScoreByOption = new Map<CanonicalActionKey, number>();
  for (const opt of decision.options) {
    rollScoreByOption.set(opt.actionDef.actionKey, 0);
  }
  for (const r of allReasons) {
    const addr: DrawAddress = { seed, eventId: decision.decisionId, purposeId: 'decision_roll', drawIndex: drawIndexOf.get(r.id)! };
    const u = drawUniform(addr);
    const rollValue = drawFace(u, r.faces);
    const signedContribution = r.sign * (rollValue + r.addend);
    influenceRolls.push({ influenceId: r.id, optionKey: r.optionKey, faces: r.faces, sign: r.sign, draw: u, rollValue, signedContribution });
    rollScoreByOption.set(r.optionKey, (rollScoreByOption.get(r.optionKey) ?? 0) + signedContribution);
  }

  const maxScore = Math.max(...decision.options.map((o) => rollScoreByOption.get(o.actionDef.actionKey)!));
  const topOptions = decision.options
    .map((o) => o.actionDef.actionKey)
    .filter((key) => rollScoreByOption.get(key) === maxScore)
    .sort(compareCanonical);

  let winner: CanonicalActionKey;
  let tieBreak: TieBreakDraw | null = null;
  if (topOptions.length === 1) {
    winner = topOptions[0];
  } else {
    // Deterministic tie-resolution draw (Brief §8): a uniform pick among
    // the tied leaders, addressed once per Decision — structurally
    // identical to choice.ts::selectAction's cumulative-draw loop, just
    // over the (small) set of tied CanonicalActionKeys instead of every
    // candidate Action.
    const addr: DrawAddress = { seed, eventId: decision.decisionId, purposeId: 'decision_tie_break', drawIndex: 0 };
    const u = drawUniform(addr);
    const share = Rational.ONE.div(Rational.of(BigInt(topOptions.length), 1n));
    let cumulative = Rational.ZERO;
    winner = topOptions[topOptions.length - 1];
    for (const key of topOptions) {
      cumulative = cumulative.add(share);
      if (u.lt(cumulative)) {
        winner = key;
        break;
      }
    }
    tieBreak = { candidates: topOptions, draw: u, selected: winner };
  }

  return {
    preRollOptionProbabilities,
    margin,
    contest,
    conflictMass,
    stake,
    authorshipPotential,
    resolutionMode,
    influenceRolls,
    tieBreak,
    chosenOption: winner,
    chosenIntent: winner,
  };
}

/**
 * Resolve a Decision under the legacy (Phase 2.9/2.95) `DecisionInfluence`
 * pipeline — UNCHANGED behavior, now a thin wrapper over
 * `resolveDecisionCore` (Phase 2.97 plan, decision 2). Every existing
 * caller/test keeps its exact prior signature and output; this is the
 * "historical baseline" Experiment M (`experiments/oldVsNewCompilation.ts`)
 * compares the new Reason Nuclei pipeline against.
 */
export function resolveDecision(
  decision: Decision,
  influencesByOption: ReadonlyMap<CanonicalActionKey, readonly DecisionInfluence[]>,
  params: DecisionParams,
  seed: string,
): DecisionResolution {
  const survivingInfluencesByOption = new Map<CanonicalActionKey, DecisionInfluence[]>();
  const reasonsByOption = new Map<CanonicalActionKey, CoreReason[]>();
  for (const opt of decision.options) {
    const all = influencesByOption.get(opt.actionDef.actionKey) ?? [];
    const surviving = all.filter((inf) => strengthToDie(inf.signedStrength, params.dieScale) !== null);
    survivingInfluencesByOption.set(opt.actionDef.actionKey, surviving);
    const reasons: CoreReason[] = surviving.map((inf) => {
      const faces = strengthToDie(inf.signedStrength, params.dieScale)!;
      const sign = signOf(inf.signedStrength);
      return { id: inf.influenceId, optionKey: opt.actionDef.actionKey, faces, sign, addend: 0, distribution: uniformDie(faces, sign) };
    });
    reasonsByOption.set(opt.actionDef.actionKey, reasons);
  }

  const core = resolveDecisionCore(decision, reasonsByOption, params.thetaRoll, params.thetaPlayer, seed);
  return { ...core, survivingInfluencesByOption };
}

/**
 * Resolve a Decision under Phase 2.97's Reason Nuclei pipeline: each
 * Option's `CompiledNucleus[]` (`model/diceCompiler.ts::compileReasonDice`)
 * already carries its own base die, integer modifier, and fully-signed
 * `Polarity_n · (Die_n + M_n)` distribution — this function only adapts
 * that into `CoreReason`s and calls the SAME shared core `resolveDecision`
 * uses, so Margin/Contest/Stake/AuthorshipPotential/rolling/tie-break
 * behavior is byte-for-byte the same math regardless of which compiler
 * produced the reasons (Brief §34/§37's "dice remain causally intrinsic;
 * reuse existing exact discrete-distribution math" requirement).
 */
export function resolveReasonDiceExpressions(
  decision: Decision,
  compiledByOption: ReadonlyMap<CanonicalActionKey, readonly CompiledNucleus[]>,
  thetaRoll: Rational,
  thetaPlayer: Rational,
  seed: string,
): DecisionResolution {
  const reasonsByOption = new Map<CanonicalActionKey, CoreReason[]>();
  for (const opt of decision.options) {
    const nuclei = compiledByOption.get(opt.actionDef.actionKey) ?? [];
    const reasons: CoreReason[] = nuclei.map((n) => ({
      id: nucleusKeyString(n.key),
      optionKey: opt.actionDef.actionKey,
      faces: n.baseDie,
      sign: n.key.direction === 'Avoid' ? -1 : 1,
      addend: n.finalModifier,
      distribution: n.distribution,
    }));
    reasonsByOption.set(opt.actionDef.actionKey, reasons);
  }

  const core = resolveDecisionCore(decision, reasonsByOption, thetaRoll, thetaPlayer, seed);
  return { ...core, survivingInfluencesByOption: new Map() };
}

/** One IdentityExpressionChannel's alignment/expression-strength for a
 * resolved Decision — kept here (not in identity.ts) purely to avoid a
 * circular import: `DecisionExpression` embeds this shape, and
 * `identity.ts` needs `DecisionExpression`'s sibling types (`Option`,
 * `DecisionInfluence`) to compute Alignment, so `identity.ts` imports FROM
 * `decision.ts`, never the reverse. */
export interface IdentityExpressionRecord {
  readonly channel: string;
  readonly alignment: Rational; // ∈ [-1,1]
  readonly expressionStrength: Rational; // alignment × authorshipPotential
}

/** The brief's §18 DecisionExpression record — immutable biographical
 * evidence, distinct from the later physical WorldOutcome (Brief §14). */
export interface DecisionExpression {
  readonly decisionId: string;
  readonly actor: ConceptKey;
  readonly occurredAt: number;
  readonly chosenOption: CanonicalActionKey;
  readonly resolutionMode: ResolutionMode;
  readonly preRollOptionProbabilities: readonly OptionProbability[];
  readonly margin: Rational;
  readonly contest: Rational;
  readonly stake: Rational;
  readonly authorshipPotential: Rational;
  readonly influenceRolls: readonly InfluenceRoll[];
  readonly identityExpressions: readonly IdentityExpressionRecord[];
  readonly chosenIntent: CanonicalActionKey;
}
