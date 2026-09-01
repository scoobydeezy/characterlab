/**
 * The glue that turns already-computed Need/accessibility/identity/memory
 * state into typed `RawCognitiveSignal`s (Phase 2.97 Brief §7). Deliberately
 * separate from `reasonNucleus.ts` (pure grouping math, no CharacterState
 * access) and from `cycle.ts` (orchestration) — mirrors how `decision.ts`
 * stays state-agnostic while `cycle.ts` supplies its glue today.
 *
 * SCOPING (Phase 2.97 plan, decisions 5-7): every builder here resolves
 * Motive/Referent attribution EXACTLY, using data this codebase already
 * tracks exactly-keyed — a Need-sourced signal's referent is the option's
 * own `actionDef.subject` (NeedExpectation is exactly keyed by
 * `(subject, needId)`); a memory-sourced signal's evidence basis is exactly
 * the retrieved `MemoryEpisode.experienceId`. `EvidenceBasis` is populated
 * only for the two signal families that already carry a concrete
 * identifier (memory-sourced SituationalEvidence; identity-sourced
 * StandingDisposition, via a synthetic single-element tag) — Need-sourced
 * MotiveGenerating signals get `EMPTY_EVIDENCE_BASIS` since `NeedExpectation`
 * is an aggregated Bayesian scalar with no retained per-experience
 * provenance (decision 6 — not retrofitted this phase).
 *
 * `situationalMemorySignals` and `situationalExpectationNudgeSignals` are
 * two INDEPENDENTLY-derived signal families that legitimately draw on the
 * SAME retrieved memory (`needOutcomes` vs. `predictionErrors`, both
 * populated from the same Experience in `cycle.ts::applyChosenAction`) —
 * calling both against one retrieved memory set is exactly the "real
 * pipeline dual-derivation" case Experiment D/E need (plan decision 7,
 * layer 2), with no special-casing: it falls out of using two real,
 * already-existing fields on `MemoryEpisode`.
 */

import { Rational } from '../kernel/rational';
import { NeedId } from '../kernel/canonical';
import { EvidenceBasis, EMPTY_EVIDENCE_BASIS, evidenceBasisOf } from '../kernel/evidenceOverlap';
import { Option } from './decision';
import { ScoredAction } from './actions';
import { MemoryEpisode, ScoredMemory } from './memory';
import {
  IdentityExpressionChannelId,
  IdentityEvidenceState,
  CHANNEL_ORDER,
  EMPTY_IDENTITY_EVIDENCE,
  identityStrength,
} from './identity';
import { MotiveChannel, ReferentKey, RawCognitiveSignal } from './reasonNucleus';
import { CommitmentDef, commitmentSignals } from './commitment';

export type NeedMotiveChannelMapping = ReadonlyMap<NeedId, MotiveChannel>;
export type IdentityMotiveChannelMapping = Readonly<Record<IdentityExpressionChannelId, readonly MotiveChannel[]>>;

/** Where `REASON_CHANNEL_ACCESSIBILITY`'s associative-accessibility pull
 * lives in the new vocabulary (Phase 2.97 plan, decision 4). */
export const ACCESSIBILITY_MOTIVE_CHANNEL: MotiveChannel = 'Habit';

function subjectReferent(option: Option): ReferentKey {
  return option.actionDef.subject; // ConceptKey is directly assignable to ReferentKey (decision 3)
}

/**
 * MotiveGenerating signals from per-Need contributions (Brief §31): one
 * signal per (Need, Option) with nonzero contribution, referent = the
 * option's own subject, direction = sign of the contribution. An unmapped
 * Need contributes no signal — an authored gap (a Need this scenario has
 * not yet connected to the brief's motive vocabulary), not a bug, mirroring
 * `decision.ts::sumRawBySemanticChannel`'s own unmapped-channel skip.
 */
export function needSignals(option: Option, scored: ScoredAction, mapping: NeedMotiveChannelMapping): RawCognitiveSignal[] {
  const referent = subjectReferent(option);
  const signals: RawCognitiveSignal[] = [];
  for (const c of scored.perNeedContributions) {
    if (c.contribution.isZero()) continue;
    const motiveChannel = mapping.get(c.needId);
    if (!motiveChannel) continue;
    signals.push({
      signalId: `need:${option.actionDef.actionKey}:${c.needId}`,
      optionKey: option.actionDef.actionKey,
      motiveChannel,
      referent,
      sourceRole: 'MotiveGenerating',
      signedStrength: c.contribution,
      basis: EMPTY_EVIDENCE_BASIS,
    });
  }
  return signals;
}

/** MotiveGenerating signal from associative accessibility (Phase 2.9/2.95's
 * existing Hebbian-habit contributor) — `null` when accessibility is
 * exactly zero (no motivational content to emit). */
export function accessibilitySignal(option: Option, accessibility: Rational): RawCognitiveSignal | null {
  if (accessibility.isZero()) return null;
  return {
    signalId: `accessibility:${option.actionDef.actionKey}`,
    optionKey: option.actionDef.actionKey,
    motiveChannel: ACCESSIBILITY_MOTIVE_CHANNEL,
    referent: subjectReferent(option),
    sourceRole: 'MotiveGenerating',
    signedStrength: accessibility,
    basis: EMPTY_EVIDENCE_BASIS,
  };
}

/**
 * StandingDisposition signals (Brief §46-47): one per (IdentityChannel,
 * mapped MotiveChannel) with nonzero `identityStrength`, referent = the
 * option's own subject (decision 5). A channel mapped to more than one
 * MotiveChannel (e.g. `NoveltySeeking` -> [Recreation, Novelty]) legitimately
 * emits one signal per mapped channel, all sharing the SAME synthetic
 * `identity:<channel>` EvidenceBasis tag — the brief's own licensed "one
 * fact, multiple legitimate motives" case (§48), achieved by emission-time
 * exactness rather than a runtime fractional-projection engine. This is a
 * standing signal only — by itself it can never create a nucleus (Brief
 * §41's "a modifier cannot create meaning from nothing": `diceCompiler.ts`
 * requires a nonzero MotiveGenerating sum in the SAME nucleus group before
 * one is considered to exist at all).
 *
 * Phase 2.97 closure audit, second correction: for the `'Commitment'`
 * MotiveChannel specifically, "the option's own subject" is no longer the
 * right referent — `model/commitment.ts`'s whole point is that a
 * commitment's referent is the obligation itself (`commitmentKey`), not its
 * stakeholder. This function's own emission at `subjectReferent(option)` for
 * any identity channel mapped to `'Commitment'` (CommitmentFidelity,
 * RuleAdherence) is therefore now a structurally DEAD group — no
 * MotiveGenerating signal ever shares that exact (Option, 'Commitment',
 * subject) triple anymore, so it consolidates to `B_n = 0` and forms no
 * nucleus (Brief §41), exactly the same harmless dead-group shape Experiment
 * H's own `'Caregiving'` case already demonstrates for a channel with no
 * live MotiveGenerating source at all. The REAL Commitment-channel Standing
 * signal comes from `commitmentStandingIdentitySignals` below, correctly
 * re-referented to each commitment's own `commitmentKey`.
 */
export function standingIdentitySignals(
  option: Option,
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  kI: Rational,
  mapping: IdentityMotiveChannelMapping,
): RawCognitiveSignal[] {
  const referent = subjectReferent(option);
  const signals: RawCognitiveSignal[] = [];
  for (const channel of CHANNEL_ORDER) {
    const evidence = evidenceByChannel.get(channel) ?? EMPTY_IDENTITY_EVIDENCE;
    const strength = identityStrength(evidence, kI);
    if (strength.isZero()) continue;
    const motiveChannels = mapping[channel] ?? [];
    if (motiveChannels.length === 0) continue;
    const basis: EvidenceBasis = evidenceBasisOf([[`identity:${channel}`, Rational.ONE]]);
    for (const motiveChannel of motiveChannels) {
      signals.push({
        signalId: `identity:${channel}:${motiveChannel}:${option.actionDef.actionKey}`,
        optionKey: option.actionDef.actionKey,
        motiveChannel,
        referent,
        sourceRole: 'StandingDisposition',
        signedStrength: strength,
        basis,
      });
    }
  }
  return signals;
}

/**
 * StandingDisposition signals for identity channels that modify a
 * COMMITMENT's own nucleus (Phase 2.97 closure audit, second correction).
 * Structurally identical to `standingIdentitySignals` above — same identity
 * strength lookup, same zero-strength skip, same synthetic `identity:<channel>`
 * EvidenceBasis tag — except referented to `commitment.commitmentKey` instead
 * of the option's subject, and filtered to identity channels whose mapping
 * includes THIS commitment's own `motiveChannel` (almost always
 * `'Commitment'`, but read from the `CommitmentDef` rather than hardcoded, so
 * this stays correct if a future commitment is ever authored on a different
 * channel). One signal per (IdentityChannel, CommitmentDef) — a commitment
 * mapped to a channel more than one identity channel also maps to (e.g. both
 * CommitmentFidelity and RuleAdherence, per
 * `defaultIdentityMotiveChannelMapping()`) legitimately gets a standing pull
 * from each, exactly the brief's own "one fact, multiple legitimate motives"
 * shape `standingIdentitySignals` already licenses.
 */
function commitmentStandingIdentitySignals(
  option: Option,
  commitments: readonly CommitmentDef[],
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  kI: Rational,
  mapping: IdentityMotiveChannelMapping,
): RawCognitiveSignal[] {
  const signals: RawCognitiveSignal[] = [];
  for (const commitment of commitments) {
    if (commitment.fulfillingAction !== option.actionDef.actionKey) continue;
    for (const channel of CHANNEL_ORDER) {
      const motiveChannels = mapping[channel] ?? [];
      if (!motiveChannels.includes(commitment.motiveChannel)) continue;
      const evidence = evidenceByChannel.get(channel) ?? EMPTY_IDENTITY_EVIDENCE;
      const strength = identityStrength(evidence, kI);
      if (strength.isZero()) continue;
      const basis: EvidenceBasis = evidenceBasisOf([[`identity:${channel}`, Rational.ONE]]);
      signals.push({
        signalId: `identity:${channel}:${commitment.motiveChannel}:${commitment.commitmentKey}:${option.actionDef.actionKey}`,
        optionKey: option.actionDef.actionKey,
        motiveChannel: commitment.motiveChannel,
        referent: commitment.commitmentKey,
        sourceRole: 'StandingDisposition',
        signedStrength: strength,
        basis,
      });
    }
  }
  return signals;
}

/** A retrieved memory is relevant to an Option if it engaged that Option's
 * own subject as a participant, or is literally a memory of having taken
 * this Option's own Action before. */
function memoryIsRelevant(episode: ScoredMemory['record']['memory'], option: Option): boolean {
  return episode.participants.includes(option.actionDef.subject) || episode.action === option.actionDef.actionKey;
}

/**
 * Phase 2.97 closure audit, Check 3 (review agent finding — "presence in an
 * Experience is not equivalent to psychological centrality"): the
 * referent(s) a memory's outcome should attribute to, and each one's
 * attribution weight. `NeedOutcomeRecord` itself carries no subject (it is
 * a whole-Experience-level realized effect, `{needId, result}` only) — the
 * PRE-FIX code closed that gap by attributing wholly to the option's own
 * subject, silently treating every OTHER participant as equally (i.e.
 * zero-vs-one, not weighted) irrelevant. The fix consumes
 * `MemoryEpisode.conceptSalience` (Phase 2.5b/c's already-computed
 * character-relative salience, threaded onto the memory record by
 * `cycle.ts` — see that field's own doc comment).
 *
 * Weights are each participant's salience NORMALIZED against the total
 * salience of every participant with any — an earlier, un-normalized draft
 * of this function (using raw salience directly as the weight) was
 * actually run against the full suite and DID break Experiments D/E/J:
 * their single-participant memories' subject concept legitimately has
 * salience z < 1 (attention/perception, a different quantity from "which
 * referent among several present ones does this outcome belong to"), so
 * using it directly as an absolute weight silently shrank every already-
 * calibrated situational contribution. Normalizing means a
 * single-participant memory —
 * the "easy case," still the only case this scenario's real pipeline ever
 * produces — ALWAYS gets weight exactly 1 regardless of that participant's
 * own absolute salience score, exactly preserving the pre-fix behavior;
 * only a GENUINELY multi-participant memory ever splits weight across
 * referents, proportional to their relative salience (a highly-salient
 * Glen contributes more than a merely-present Priya from the SAME memory).
 * Falls back to the pre-fix "attribute wholly to the option's own subject,
 * weight 1" behavior only when NO participant has any salience data at all
 * (`salienceMode: 'legacy'` memories, and any fixture built before this
 * field existed, both leave `conceptSalience` empty).
 */
function attributedReferents(episode: MemoryEpisode, option: Option): readonly { readonly referent: ReferentKey; readonly weight: Rational }[] {
  const salient = episode.participants
    .map((p) => ({ referent: p as ReferentKey, salience: episode.conceptSalience.get(p) ?? Rational.ZERO }))
    .filter((e) => !e.salience.isZero());
  if (salient.length === 0) return [{ referent: subjectReferent(option), weight: Rational.ONE }];
  const totalSalience = salient.reduce((acc, e) => acc.add(e.salience), Rational.ZERO);
  return salient.map((e) => ({ referent: e.referent, weight: e.salience.div(totalSalience) }));
}

/**
 * SituationalEvidence signals from a retrieved memory's realized Need
 * outcomes (Brief §32, "recent supportive/unsupportive history"): one
 * signal per (memory, NeedOutcome, attributed referent) with nonzero,
 * mapped, nonzero-weighted result — see `attributedReferents` above for how
 * referent attribution and its weight are now derived. EvidenceBasis is
 * exactly `{[episode.experienceId]: 1}` — directly off existing
 * `MemoryEpisode` data, no retrofit (decision 6); the correlation
 * consolidator only cares about provenance identity, not attribution
 * weight, so every referent's signal from the same memory legitimately
 * shares one basis.
 */
export function situationalMemorySignals(
  option: Option,
  retrieved: readonly ScoredMemory[],
  mapping: NeedMotiveChannelMapping,
): RawCognitiveSignal[] {
  const signals: RawCognitiveSignal[] = [];
  for (const scored of retrieved) {
    const episode = scored.record.memory;
    if (!memoryIsRelevant(episode, option)) continue;
    const basis: EvidenceBasis = evidenceBasisOf([[episode.experienceId, Rational.ONE]]);
    const referents = attributedReferents(episode, option);
    for (const outcome of episode.needOutcomes) {
      if (outcome.result.isZero()) continue;
      const motiveChannel = mapping.get(outcome.needId);
      if (!motiveChannel) continue;
      for (const { referent, weight } of referents) {
        const signedStrength = outcome.result.mul(weight);
        if (signedStrength.isZero()) continue;
        signals.push({
          signalId: `memory:${episode.memoryId}:${outcome.needId}:${option.actionDef.actionKey}:${referent}`,
          optionKey: option.actionDef.actionKey,
          motiveChannel,
          referent,
          sourceRole: 'SituationalEvidence',
          signedStrength,
          basis,
        });
      }
    }
  }
  return signals;
}

/**
 * A SECOND, independently-derived SituationalEvidence family from the same
 * retrieved memories' `predictionErrors` (Brief §32's "derived expectation"
 * case) — sharing the SAME `{[episode.experienceId]: 1}` EvidenceBasis as
 * `situationalMemorySignals` whenever both fields are populated from the
 * same underlying Experience, which `cycle.ts::applyChosenAction` already
 * does for every ordinary memory. This is what gives Experiment D/E's
 * "correlated vs. independent evidence" comparison a REAL, not merely
 * hand-authored, dual-derivation case (Phase 2.97 plan, decision 7, layer 2).
 */
export function situationalExpectationNudgeSignals(
  option: Option,
  retrieved: readonly ScoredMemory[],
  mapping: NeedMotiveChannelMapping,
): RawCognitiveSignal[] {
  const referent = subjectReferent(option);
  const signals: RawCognitiveSignal[] = [];
  for (const scored of retrieved) {
    const episode = scored.record.memory;
    if (!memoryIsRelevant(episode, option)) continue;
    const basis: EvidenceBasis = evidenceBasisOf([[episode.experienceId, Rational.ONE]]);
    for (const pe of episode.predictionErrors) {
      if (pe.subject !== option.actionDef.subject) continue;
      if (pe.error.isZero()) continue;
      const motiveChannel = mapping.get(pe.needId);
      if (!motiveChannel) continue;
      signals.push({
        signalId: `memory-nudge:${episode.memoryId}:${pe.needId}:${option.actionDef.actionKey}`,
        optionKey: option.actionDef.actionKey,
        motiveChannel,
        referent,
        sourceRole: 'SituationalEvidence',
        signedStrength: pe.error,
        basis,
      });
    }
  }
  return signals;
}

/** Every builder above, run for one Option against already-computed state —
 * the one call site `cycle.ts::runDecisionCycle` needs per Option under
 * `compilationMode: 'reasonNuclei'`. `commitments` defaults to empty: most
 * Decisions in this codebase involve no standing obligation at all, and an
 * empty list is exactly "no commitment-sourced pressure this Option," never
 * a different code path (mirrors `retrieved`'s own empty-array-is-fine
 * shape). See `model/commitment.ts` for why Commitment pressure is a
 * SEPARATE MotiveGenerating source family from Need pressure, not another
 * entry in `needMapping`. */
export function allCognitiveSignalsForOption(
  option: Option,
  scored: ScoredAction,
  accessibility: Rational,
  retrieved: readonly ScoredMemory[],
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  kI: Rational,
  needMapping: NeedMotiveChannelMapping,
  identityMapping: IdentityMotiveChannelMapping,
  commitments: readonly CommitmentDef[] = [],
): RawCognitiveSignal[] {
  const accessibilitySig = accessibilitySignal(option, accessibility);
  return [
    ...needSignals(option, scored, needMapping),
    ...(accessibilitySig ? [accessibilitySig] : []),
    ...standingIdentitySignals(option, evidenceByChannel, kI, identityMapping),
    ...situationalMemorySignals(option, retrieved, needMapping),
    ...situationalExpectationNudgeSignals(option, retrieved, needMapping),
    ...commitmentSignals(option, commitments),
    ...commitmentStandingIdentitySignals(option, commitments, evidenceByChannel, kI, identityMapping),
  ];
}
