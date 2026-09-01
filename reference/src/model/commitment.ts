/**
 * Commitment pressure — a MotiveGenerating source in its own right, NOT a
 * Need (Phase 2.97 closure audit, second architectural correction).
 *
 * BACKGROUND: the closure audit's own Check 1 (see RESEARCH.md's Phase 2.97
 * entry) correctly diagnosed that `CommitmentFidelity` had no live
 * MotiveGenerating source to modify — `defaultIdentityMotiveChannelMapping()`
 * mapped it to the `'Commitment'` MotiveChannel, but no Need in
 * `defaultMotiveChannelMapping()` ever generated pressure there. The FIX at
 * the time (`scenario.ts::NEED_COMMITMENT`, now removed) solved that
 * correctly-diagnosed problem through the wrong semantic layer: a second
 * round of review pointed out that modeling "Mina promised to have dinner
 * with Glen" as a Need — with a set point, a passive decay rate, and a
 * satisfaction magnitude, exactly like hunger or rest — implies a persistent
 * appetite for MAKING promises, satisfied by keeping any one of them, rather
 * than a standing obligation to THIS particular commitment. A Need-shaped
 * Commitment has no principled answer to "what does an unsatisfied
 * Commitment Need even mean for someone with no outstanding commitments,"
 * and — more concretely — it forced every commitment's referent to be its
 * stakeholder (`PERSON_GLEN`) rather than the commitment itself, so two
 * simultaneous commitments both involving Glen could never be told apart as
 * independent reasons.
 *
 * THE CORRECTION: a `CommitmentDef` is authored, static, scenario content —
 * closer in shape to an `ActionDef` than to a `NeedDef` — describing one
 * standing obligation: which Option discharges/preserves it
 * (`fulfillingAction`), who it is owed to (`stakeholder`, recorded for
 * narrative clarity, NOT itself the referent), and how much "this is still
 * outstanding" pressure it exerts (`activeObligationPressure`) for as long as
 * it is authored to exist. Deliberately NO Need-style dynamics — no set
 * point, no passive decay, no satisfaction-magnitude bookkeeping — because an
 * obligation is not an appetite that refills after being met; it is a fact
 * that either presses or (once retired) does not. `commitmentSignals` below
 * is the direct MotiveGenerating analog of `cognitiveSignals.ts::needSignals`,
 * reading this static authored list instead of a computed `ScoredAction`.
 *
 * REFERENT CORRECTION: a commitment's referent is `commitmentKey` — the
 * commitment ITSELF (e.g. "the dinner-with-Glen obligation"), a distinct
 * `ConceptKey` from its `stakeholder` (Glen). This is what lets
 * `Commitment × DinnerWithGlen × Pursue` and a hypothetical
 * `Commitment × CloseTheBakery × Pursue` — both concerning Glen as a
 * stakeholder — exist as two independent Reason Nuclei rather than
 * collapsing onto one shared `Commitment × Glen` reason, exactly the
 * confusion Check 1's Need-shaped fix could not avoid (its only available
 * referent was `ACTION_KEEP_DINNER_PROMISE`'s own subject, Glen).
 *
 * ARCHITECTURAL SIGNIFICANCE: this establishes that `MotiveGenerating`
 * sources are a genuine OPEN family — Need pressure and Commitment pressure
 * are two independent members of it now, with Goal pressure and Value
 * pressure named as likely future members (Brief's own list) — rather than
 * every future motive being silently translated into a synthetic Need just
 * because `needSignals` was the only MotiveGenerating builder that existed
 * yet. Nothing about `reasonNucleus.ts`/`diceCompiler.ts` needed to change to
 * add this second source family: both already consume `RawCognitiveSignal`s
 * generically by `sourceRole`, never by which builder emitted them.
 */

import { ConceptKey, CanonicalActionKey } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { EMPTY_EVIDENCE_BASIS } from '../kernel/evidenceOverlap';
import { Option } from './decision';
import { MotiveChannel, ReferentKey, RawCognitiveSignal } from './reasonNucleus';

/**
 * One standing obligation. Static, authored scenario content — a character
 * either has this commitment or does not; there is no per-decision
 * computation the way a Need's Level/Deficit/Urgency requires. Kept
 * intentionally minimal (no status/deadline machinery) since no experiment
 * this phase needs a commitment that can be fulfilled, broken, or expire
 * mid-run — that is a legitimate future extension (see module doc's
 * ARCHITECTURAL SIGNIFICANCE paragraph), not a gap this correction needs to
 * fill to close the review's objection.
 */
export interface CommitmentDef {
  /** The referent this commitment's pressure attaches to — the obligation
   * itself, NOT its stakeholder. A fresh `ConceptKey` (e.g.
   * `commitment.dinner_with_glen`), reusing `ReferentKey`'s existing
   * "any ConceptKey is a legitimate referent" rule (Phase 2.97 plan, scoping
   * decision 3) rather than minting a new referent kind. */
  readonly commitmentKey: ConceptKey;
  /** Who this obligation is owed to. Recorded for narrative/authoring
   * clarity and available to any future stakeholder-facing signal source —
   * `commitmentSignal` below does NOT read it when emitting the
   * MotiveGenerating signal itself; the referent is `commitmentKey`, per
   * this module's own REFERENT CORRECTION. */
  readonly stakeholder: ReferentKey;
  /** Which Option's choice discharges or preserves this commitment. Exactly
   * one Option per commitment in this build — a commitment satisfiable by
   * more than one Option is a legitimate future extension, not needed here. */
  readonly fulfillingAction: CanonicalActionKey;
  /** Which MotiveChannel this commitment's pressure lands on. Authored
   * explicitly per commitment (mirroring `NeedMotiveChannelMapping`'s own
   * per-Need explicitness) rather than hardcoded to `'Commitment'`, in case a
   * future scenario ever wants a commitment whose obligation is better
   * classified elsewhere. */
  readonly motiveChannel: MotiveChannel;
  /** The constant "this is still outstanding" pressure this commitment
   * exerts on its `fulfillingAction`, for as long as it is authored into a
   * scenario's commitment list. Deliberately NOT a decaying/refillable
   * Need-style quantity (this module's own BACKGROUND paragraph) — a research
   * knob like every other authored magnitude in `scenario.ts`, not a claim. */
  readonly activeObligationPressure: Rational;
}

/**
 * MotiveGenerating signal from one commitment, for one Option — `null` when
 * this commitment does not concern this Option (`fulfillingAction` mismatch)
 * or its pressure is exactly zero (a retired/authored-inert commitment,
 * available as a future hook for a fulfilled/broken commitment's pressure
 * being set to zero rather than removed from the list — unused by this
 * build, which only ever authors live, nonzero commitments). `EvidenceBasis`
 * is empty, mirroring `needSignals`' own EMPTY_EVIDENCE_BASIS choice (Phase
 * 2.97 plan, decision 6): a `CommitmentDef` is an aggregated authored fact
 * with no per-source-experience provenance to retrieve, exactly like a
 * `NeedExpectation`.
 */
export function commitmentSignal(option: Option, commitment: CommitmentDef): RawCognitiveSignal | null {
  if (commitment.fulfillingAction !== option.actionDef.actionKey) return null;
  if (commitment.activeObligationPressure.isZero()) return null;
  return {
    signalId: `commitment:${commitment.commitmentKey}:${option.actionDef.actionKey}`,
    optionKey: option.actionDef.actionKey,
    motiveChannel: commitment.motiveChannel,
    referent: commitment.commitmentKey,
    sourceRole: 'MotiveGenerating',
    signedStrength: commitment.activeObligationPressure,
    basis: EMPTY_EVIDENCE_BASIS,
  };
}

/** Every commitment's signal for one Option — the one call
 * `cognitiveSignals.ts::allCognitiveSignalsForOption` needs, mirroring how it
 * already calls `needSignals` for the Need-pressure family. */
export function commitmentSignals(option: Option, commitments: readonly CommitmentDef[]): RawCognitiveSignal[] {
  const signals: RawCognitiveSignal[] = [];
  for (const commitment of commitments) {
    const signal = commitmentSignal(option, commitment);
    if (signal) signals.push(signal);
  }
  return signals;
}
