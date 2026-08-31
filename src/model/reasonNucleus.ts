/**
 * Reason Nuclei — Phase 2.97 Brief §10-29 ("Reason Nuclei," "Motive
 * Attribution," "Referent Attribution," "Joint Semantic Projection," "The
 * Central Consolidation Rule"). Pure grouping/identity math: takes already-
 * classified `RawCognitiveSignal`s (built by `model/cognitiveSignals.ts`
 * from real CharacterState) and groups them into nuclei by EXACT key match
 * — it does not itself read Need/identity/memory state, mirroring how
 * `decision.ts` stays state-agnostic while `cycle.ts` supplies the glue.
 *
 * SCOPING (Phase 2.97 plan, decision 5): every signal source this phase's
 * `cognitiveSignals.ts` produces attributes Motive and Referent EXACTLY —
 * one motive channel, one referent, per emitted signal — rather than the
 * general fractional/continuous `M_s(k)`/`A_s(e)` the brief describes for
 * an ambiguous source. `dominantReferent` below implements the brief's
 * general continuous case (§27-29) for forward compatibility and is
 * unit-tested against synthetic ambiguous input, but no signal source in
 * this build calls it — documented as a deliberate deferral, not a gap.
 */

import { ConceptKey, CanonicalActionKey, compareCanonical } from '../kernel/canonical';
import { Rational } from '../kernel/rational';
import { EvidenceBasis } from '../kernel/evidenceOverlap';

/** The brief's own controlled vocabulary (§10), plus one justified 11th
 * entry — see the Phase 2.97 plan's scoping decision 4 for why `'Habit'`
 * exists: `REASON_CHANNEL_ACCESSIBILITY`'s associative-accessibility pull
 * is a real, already-validated Phase 2.9/2.95 motive-generating
 * contributor with no honest home among the brief's original 10, and
 * dropping it would silently regress seed-divergence/biography-authorship
 * behavior the phase gate requires to survive. */
export type MotiveChannel =
  | 'Achievement'
  | 'Autonomy'
  | 'Caregiving'
  | 'Commitment'
  | 'Connection'
  | 'Habit'
  | 'Novelty'
  | 'Recognition'
  | 'Recreation'
  | 'Rest'
  | 'Safety';

/** Canonical (alphabetical) ordering — matches `identity.ts::CHANNEL_ORDER`'s
 * fixed-universe discipline. */
export const MOTIVE_CHANNEL_ORDER: readonly MotiveChannel[] = [
  'Achievement',
  'Autonomy',
  'Caregiving',
  'Commitment',
  'Connection',
  'Habit',
  'Novelty',
  'Recognition',
  'Recreation',
  'Rest',
  'Safety',
];

/** Referent identity is reused, not newly minted (plan scoping decision 3):
 * the brief's `Person:Glen`/`Activity:Work` style keys are exactly the
 * `ConceptKey`s already declared in `scenario.ts`. `'Self'`/`'None'` are
 * the two sentinel cases the brief names explicitly (§8). */
export type ReferentKey = ConceptKey | 'Self' | 'None';

export const REFERENT_SELF: ReferentKey = 'Self';
export const REFERENT_NONE: ReferentKey = 'None';

/** Direction is derived from sign, never authored (plan scoping decision
 * 4) — `Preserve`/`Reject` are illustrative in the brief but no experiment
 * A-N requires them. */
export type MotiveDirection = 'Pursue' | 'Avoid';

/** Which psychological question this signal answers (Brief §30-33):
 * `MotiveGenerating` — why does this motive exist at all (contributes to
 * B_n); `StandingDisposition` — why does this person characteristically
 * respond more/less to it (a standing modifier); `SituationalEvidence` —
 * why is it stronger/weaker right now (a situational modifier).
 * `ContextModulating` is deliberately not implemented this phase (plan
 * scoping decision 10 — no signal source in this scenario models fatigue/
 * intoxication/time-pressure; adding the role with nothing to emit it
 * would be dead code). */
export type SourceRole = 'MotiveGenerating' | 'StandingDisposition' | 'SituationalEvidence';

/** The (Option, MotiveChannel, Referent) triple a signal contributes
 * pressure to — everything the Central Consolidation Rule (Brief §12)
 * needs to decide "is this the same reason" EXCEPT direction. Direction is
 * deliberately NOT part of a signal's own identity: a signal's sign
 * records whether it strengthens or weakens the reason it belongs to (a
 * negative situational modifier — "we argued this morning" — still belongs
 * to a POSITIVE "Connection through Glen" nucleus; it does not spawn a
 * separate "Avoid Glen" nucleus by itself). Only the net sign of a triple's
 * MotiveGenerating signals decides whether the resulting nucleus is a
 * Pursue or an Avoid reason at all (`resolvedNucleusKey`, called from
 * `diceCompiler.ts` once B_n is known) — see that module for the full
 * Base/Standing/Situational separation this split enables. */
export interface ReasonNucleusTriple {
  readonly optionKey: CanonicalActionKey;
  readonly motiveChannel: MotiveChannel;
  readonly referent: ReferentKey;
}

export function tripleKeyString(t: ReasonNucleusTriple): string {
  return `${t.optionKey}::${t.motiveChannel}::${t.referent}`;
}

export function tripleOf(signal: RawCognitiveSignal): ReasonNucleusTriple {
  return { optionKey: signal.optionKey, motiveChannel: signal.motiveChannel, referent: signal.referent };
}

/** Groups signals by exact (Option, MotiveChannel, Referent) match — same
 * entity does not imply same reason (a different motiveChannel keeps two
 * Glen-referent signals apart, Experiment B); same motive does not imply
 * same entity (a different referent keeps two Connection-motive signals
 * apart, Experiment C). Direction is resolved per-group afterward, in
 * `diceCompiler.ts`, once each group's MotiveGenerating signals are known. */
export function groupSignalsByTriple(signals: readonly RawCognitiveSignal[]): Map<string, RawCognitiveSignal[]> {
  const groups = new Map<string, RawCognitiveSignal[]>();
  for (const signal of signals) {
    const key = tripleKeyString(tripleOf(signal));
    const existing = groups.get(key);
    if (existing) existing.push(signal);
    else groups.set(key, [signal]);
  }
  return groups;
}

export interface ReasonNucleusKey extends ReasonNucleusTriple {
  readonly direction: MotiveDirection;
}

/** Canonical, sortable string form of a nucleus key — used both as the
 * "one nucleus, one die" invariant's identity check and, unchanged, as the
 * dice-roll `InfluenceId` and trace id (Phase 2.97 plan, decision 2). Field
 * order matches Brief §61's canonical-ordering requirement (`MotiveChannel,
 * ReferentKey, MotiveDirection` — `optionKey` is prepended since nuclei are
 * grouped per-option first). */
export function nucleusKeyString(k: ReasonNucleusKey): string {
  return `${tripleKeyString(k)}::${k.direction}`;
}

export function compareNucleusKeys(a: ReasonNucleusKey, b: ReasonNucleusKey): -1 | 0 | 1 {
  return compareCanonical(nucleusKeyString(a), nucleusKeyString(b));
}

/** One deterministically-classified unit of psychological pressure (Brief
 * §7's `RawCognitiveSignal`, minus the general continuous `MotiveAttribution[]`/
 * `ReferentAttribution[]` arrays — see module comment's scoping note: this
 * build's signal sources always resolve to exactly one motive channel and
 * one referent per emitted signal, so there is nothing to store a
 * per-channel/per-referent attribution VECTOR for). `signedStrength`'s sign
 * records whether this particular signal strengthens (+) or weakens (-)
 * the reason it belongs to — see `ReasonNucleusTriple`'s doc comment for
 * why this is NOT the same thing as the nucleus's own `MotiveDirection`. */
export interface RawCognitiveSignal {
  readonly signalId: string;
  readonly optionKey: CanonicalActionKey;
  readonly motiveChannel: MotiveChannel;
  readonly referent: ReferentKey;
  readonly sourceRole: SourceRole;
  readonly signedStrength: Rational;
  readonly basis: EvidenceBasis;
}

/** Resolve a triple's final `ReasonNucleusKey` once its net
 * `baseMotiveStrength` (B_n — the consolidated MotiveGenerating sum,
 * `diceCompiler.ts`'s job to compute) is known: positive/zero -> Pursue,
 * negative -> Avoid. Zero is an arbitrary but deterministic tie-break for a
 * boundary `diceCompiler.ts` never actually keeps (B_n = 0 means the
 * nucleus does not exist at all — Brief §41 — so no zero-strength key is
 * ever retained downstream). */
export function resolvedNucleusKey(triple: ReasonNucleusTriple, baseMotiveStrength: Rational): ReasonNucleusKey {
  return { ...triple, direction: baseMotiveStrength.isNegative() ? 'Avoid' : 'Pursue' };
}

/**
 * General continuous dominant-referent selection (Brief §27-29): `e* =
 * argmax_e A_s(e)`, canonical tie-break, required to clear `thetaReferent`
 * and (if more than one candidate) lead the runner-up by `thetaDominance`.
 * Returns `null` (not `'None'`) when no referent clears the bar — the
 * caller decides what a null dominant referent means for its own signal
 * (Brief §29: fall back to `Referent=None`, project fractionally into
 * multiple nuclei, or exclude the signal from referent-specific
 * modification). Implemented for forward compatibility (plan scoping
 * decision 5) — unused by any signal source in this build, since every
 * current source's attribution is already exact.
 */
export function dominantReferent(
  attribution: ReadonlyMap<ReferentKey, Rational>,
  thetaReferent: Rational,
  thetaDominance: Rational,
): ReferentKey | null {
  if (attribution.size === 0) return null;
  const ranked = [...attribution.entries()].sort((a, b) => {
    const cmp = b[1].compare(a[1]); // descending attribution
    return cmp !== 0 ? cmp : compareCanonical(String(a[0]), String(b[0]));
  });
  const [topReferent, topValue] = ranked[0];
  if (topValue.lt(thetaReferent)) return null;
  if (ranked.length > 1) {
    const [, secondValue] = ranked[1];
    if (topValue.sub(secondValue).lt(thetaDominance)) return null;
  }
  return topReferent;
}
