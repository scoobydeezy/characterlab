/**
 * Acquired Identity, per Phase 2.9 Brief §15-24 ("Identity Expression",
 * "Identity Evidence", "Derived Identity Strength", "Named Acquired
 * Traits", "Identity Feedback Into Future Decisions"). Distinct from — and
 * never mutating — the master Brief's latent personality vector P (§9),
 * which is not implemented in this codebase yet (see model/decision.ts's
 * module comment for the full scoping note). Acquired identity is a
 * separate biographical layer: durable patterns of ACTUAL choices, learned
 * from Decision history, never inferred directly from disposition (Brief
 * §23's "behavior is the mediator").
 *
 * ALIGNMENT — the one genuinely under-specified piece of the brief,
 * resolved here as a single authored `ReasonChannelPolarityTable`: which
 * SEMANTIC REASON CHANNEL (Phase 2.95 — see decision.ts's
 * `SemanticReasonChannelId`) counts as supporting-or-opposing which
 * IdentityExpressionChannel, with what sign. This is a category/role-style
 * table exactly like `salience.ts`'s BASE_SALIENCE/ROLE_WEIGHT — authored
 * once, globally, never re-tuned per named entity — but its concrete
 * entries (which semantic channel means what, narratively) are scenario
 * content, so the table itself is built and supplied by `scenario.ts`
 * (`defaultSemanticReasonPolarity()`) rather than hardcoded here.
 *
 *   TaggedPressure(o, k) = Σ over o's own SEMANTIC reason channels s of
 *                          polarity(s, k) × BoundedSemanticPressure(o, s)
 *   Alignment(o, k) = boundedResponse( TaggedPressure(o, k)
 *                                      − Σ_{o'≠o} TaggedPressure(o', k) )
 *
 * PHASE 2.95 CHANGE (superseding the original Phase 2.9 shape): Alignment
 * used to be computed directly from an Option's already-assembled, already
 * FLOOR-SURVIVING `DecisionInfluence[]` — which meant a Need whose own raw
 * pressure never cleared `thetaInfluenceFloor` was invisible to Alignment
 * too, even though "what did this option's content mean" is a narrative
 * question, not a dice-eligibility one. Alignment now reads from
 * `BoundedSemanticPressure(o, s)` — the per-option, per-semantic-channel
 * value produced by `decision.ts::boundAllChannels` (Need + accessibility
 * raw pressure, summed by channel, THEN `boundedResponse`-squashed, but
 * NEVER floor-filtered) — a dense, always-defined, continuous quantity, so
 * Alignment/IdentityExpression can respond gradually to a channel's raw
 * pressure instead of jumping the instant that pressure happens to cross an
 * arbitrary die-eligibility line. This is what makes target behavior (A)
 * ("gradual identity influence, no giant discontinuities") possible at the
 * EVIDENCE-GENERATION side of the loop; `identityFeedbackRawInfluences`
 * below is the matching change on the FEEDBACK side.
 *
 * This needs only ONE polarity table applied identically to every Option
 * (no separate "support tags" vs. "oppose tags" table) and satisfies the
 * brief's actual requirements: (a) §16's worked example ("Stay Late At Work
 * expresses little when nothing else matters") holds because a low-conflict
 * scenario simply has no work-tagged semantic pressure driving the choice in
 * the first place — TaggedPressure is near zero on both terms; (b) §16's
 * "must inspect... pressures actually opposed by the selected option" is
 * satisfied literally — the subtracted term IS the losing Option's tagged
 * pressure, so if the losing Option carried strong CommitmentFidelity-
 * tagged pressure, Alignment comes out NEGATIVE for the winner, which is
 * exactly the mechanism Experiment J (Contradiction) needs, with no
 * separate machinery; (c) it does not duplicate AuthorshipPotential's job —
 * AuthorshipPotential (Contest × Stake) already gates how much a trivial-
 * but-aligned choice matters (Brief §17's own example), so Alignment only
 * answers "what did this option's content mean," never "did this decision
 * matter." Documented explicitly as "the first reference model" (the
 * brief's own words, §17) — a deliberate, revisable simplification, in the
 * same spirit as `expectation.ts`'s censored-update rule documenting itself
 * as a deliberate simplification rather than the one true answer.
 *
 * NO DOUBLE-COUNTING (Brief §23, preserved exactly under Phase 2.95):
 * identity's own feedback contribution is deliberately EXCLUDED from the
 * `boundedSemanticByOption` map that Alignment/`touchedChannels` consume for
 * EVIDENCE generation — that map is built from Need/accessibility pressure
 * alone (`cycle.ts` keeps two separate maps: one need-only, used for
 * Alignment/evidence; one need+identity, used for dice consolidation — see
 * cycle.ts's own comment). A Decision's own identity-consistency reason is a
 * DERIVED pressure from existing identity, not fresh behavioral evidence, so
 * it must never feed back into the post-hoc Alignment computation that
 * produces MORE identity evidence for the same channel. Only the concrete
 * Need/accessibility-sourced reasons — what the character was actually
 * responding to in the world — count as evidence.
 */

import { Rational } from '../kernel/rational';
import { quantize, D } from '../kernel/lattice';
import { Vec, Matrix, quadraticForm } from '../kernel/linalg';
import { CanonicalActionKey } from '../kernel/canonical';
import { ReasonChannel, RawReasonInfluence, SemanticReasonChannelId } from './decision';

export type IdentityExpressionChannelId =
  | 'AuthorityDefiance'
  | 'Caregiving'
  | 'CommitmentFidelity'
  | 'NoveltySeeking'
  | 'RiskAcceptance'
  | 'RuleAdherence'
  | 'SelfProtection'
  | 'SelfSacrifice'
  | 'SocialApproach'
  | 'WorkPersistence';

/** The single canonical (alphabetical) ordering every trait's w_j/Q_j
 * vector/matrix is dense over — matching `activation.ts`'s
 * `graph.concepts` fixed-universe discipline. */
export const CHANNEL_ORDER: readonly IdentityExpressionChannelId[] = [
  'AuthorityDefiance',
  'Caregiving',
  'CommitmentFidelity',
  'NoveltySeeking',
  'RiskAcceptance',
  'RuleAdherence',
  'SelfProtection',
  'SelfSacrifice',
  'SocialApproach',
  'WorkPersistence',
];

/** Keyed by `ReasonChannel` (which includes `SemanticReasonChannelId` —
 * Phase 2.95's only polarity-table shape now that raw Need/accessibility
 * pressure is always consolidated into a semantic channel before Alignment
 * ever sees it — see decision.ts's `ReasonChannel = string |
 * SemanticReasonChannelId`). */
export type ReasonChannelPolarityTable = Readonly<
  Record<ReasonChannel, Readonly<Partial<Record<IdentityExpressionChannelId, -1 | 1>>>>
>;

/** Per-option, per-semantic-channel BOUNDED (but NOT floor-filtered) raw
 * pressure — `decision.ts::boundAllChannels`'s output, dense over
 * `SEMANTIC_REASON_CHANNELS`. This is what Alignment/`touchedChannels`
 * consume; see module comment for why it must be the un-floored form. */
export type BoundedSemanticPressure = ReadonlyMap<CanonicalActionKey, ReadonlyMap<SemanticReasonChannelId, Rational>>;

function taggedPressure(
  boundedByChannel: ReadonlyMap<SemanticReasonChannelId, Rational> | undefined,
  channel: IdentityExpressionChannelId,
  polarityTable: ReasonChannelPolarityTable,
): Rational {
  if (!boundedByChannel) return Rational.ZERO;
  let acc = Rational.ZERO;
  for (const [semanticChannel, strength] of boundedByChannel) {
    const polarity = polarityTable[semanticChannel]?.[channel];
    if (!polarity) continue;
    acc = acc.add(strength.mul(Rational.fromInt(polarity)));
  }
  return acc;
}

/** Alignment(o,k) — see module comment for the full derivation. */
export function alignment(
  optionKey: CanonicalActionKey,
  channel: IdentityExpressionChannelId,
  boundedSemanticByOption: BoundedSemanticPressure,
  polarityTable: ReasonChannelPolarityTable,
): Rational {
  const ownPressure = taggedPressure(boundedSemanticByOption.get(optionKey), channel, polarityTable);
  let othersPressure = Rational.ZERO;
  for (const [key, byChannel] of boundedSemanticByOption) {
    if (key === optionKey) continue;
    othersPressure = othersPressure.add(taggedPressure(byChannel, channel, polarityTable));
  }
  return Rational.boundedResponse(ownPressure.sub(othersPressure));
}

/** Which channels this polarity table actually connects to any option's
 * NONZERO semantic pressure — used so a Decision only produces
 * `IdentityExpressionRecord`s (and evidence updates) for channels it
 * genuinely touched, rather than 10 mostly-zero records every time (Brief
 * §15: "A selected Option may express one or more semantic identity
 * tendencies," not necessarily all of them). `boundedSemanticByOption` is
 * dense (every semantic channel present, many at exactly zero), so a zero
 * entry must NOT count as "touched." */
export function touchedChannels(
  boundedSemanticByOption: BoundedSemanticPressure,
  polarityTable: ReasonChannelPolarityTable,
): IdentityExpressionChannelId[] {
  const touched = new Set<IdentityExpressionChannelId>();
  for (const byChannel of boundedSemanticByOption.values()) {
    for (const [semanticChannel, strength] of byChannel) {
      if (strength.isZero()) continue;
      const entry = polarityTable[semanticChannel];
      if (!entry) continue;
      for (const channel of Object.keys(entry) as IdentityExpressionChannelId[]) {
        touched.add(channel);
      }
    }
  }
  return CHANNEL_ORDER.filter((c) => touched.has(c));
}

// ---------------------------------------------------------------------------
// Identity Evidence (Brief §19-20)
// ---------------------------------------------------------------------------

export interface IdentityEvidenceState {
  readonly support: Rational;
  readonly opposition: Rational;
}

export const EMPTY_IDENTITY_EVIDENCE: IdentityEvidenceState = { support: Rational.ZERO, opposition: Rational.ZERO };

/** Support' = Support + max(0,e_k), Opposition' = Opposition + max(0,-e_k)
 * — Brief §19. No temporal decay this phase (brief's own explicit scoping:
 * "If future experiments demonstrate that identity evidence must fade,
 * that becomes a separate mechanism"). Quantized onto the lattice at
 * commit, same discipline every other persisted Rational in this codebase
 * already follows. */
export function updateIdentityEvidence(state: IdentityEvidenceState, e_k: Rational): IdentityEvidenceState {
  const supportRaw = state.support.add(e_k.max(Rational.ZERO));
  const oppositionRaw = state.opposition.add(e_k.neg().max(Rational.ZERO));
  const { value: support } = quantize(supportRaw, D);
  const { value: opposition } = quantize(oppositionRaw, D);
  return { support, opposition };
}

/** IdentityStrength_k = (Support-Opposition)/(K_I+Support+Opposition) —
 * Brief §20. Bounded in (-1,1) for finite evidence since K_I > 0. */
export function identityStrength(evidence: IdentityEvidenceState, kI: Rational): Rational {
  const total = evidence.support.add(evidence.opposition).add(kI);
  return evidence.support.sub(evidence.opposition).div(total);
}

/** IdentityConfidence_k = (Support+Opposition)/(K_C+Support+Opposition) —
 * Brief §20. Bounded in [0,1). */
export function identityConfidence(evidence: IdentityEvidenceState, kC: Rational): Rational {
  const evidenceSum = evidence.support.add(evidence.opposition);
  return evidenceSum.div(evidenceSum.add(kC));
}

export function identityStrengthVector(
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  kI: Rational,
): Vec {
  return CHANNEL_ORDER.map((c) => identityStrength(evidenceByChannel.get(c) ?? EMPTY_IDENTITY_EVIDENCE, kI));
}

// ---------------------------------------------------------------------------
// Named Acquired Traits (Brief §21)
// ---------------------------------------------------------------------------

/** T_j = boundedResponse(b_j + w_j^T·I + I^T·Q_j·I) — Brief §21, the same
 * quadratic-projection shape the master Brief §9.1 specifies for
 * personality trait labels, applied here to the IdentityStrength vector
 * instead. `w`/`Q` are dense over `CHANNEL_ORDER`. A simple single-channel
 * trait (e.g. Dependable) has an all-zero Q and a single 1 in `w` at its
 * one load-bearing channel's index; a compound trait (e.g. Caretaker) can
 * combine several. Named traits are NOT independent state — the
 * authoritative state remains `IdentityEvidenceState`; the trait is a
 * semantic label recognizing a pattern already present there (Brief §21
 * "Important"). */
export interface IdentityTrait {
  readonly traitId: string;
  readonly b: Rational;
  readonly w: Vec;
  readonly Q: Matrix;
}

export function projectTrait(trait: IdentityTrait, I: Vec): Rational {
  return Rational.boundedResponse(quadraticForm(trait.b, trait.w, trait.Q, I));
}

/** A trait "may be considered consolidated" (Brief §21) when its projected
 * value clears θ_trait AND its confidence clears θ_confidence. A compound
 * trait's confidence is the MINIMUM confidence among the channels it
 * actually depends on (nonzero w_j or a nonzero Q_j row/column) — the
 * trait cannot be more confident than its least-evidenced necessary
 * component; a channel the trait doesn't reference at all doesn't gate it. */
export function isConsolidated(
  trait: IdentityTrait,
  I: Vec,
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  kC: Rational,
  thetaTrait: Rational,
  thetaConfidence: Rational,
): boolean {
  const value = projectTrait(trait, I);
  const relevantChannels = CHANNEL_ORDER.filter(
    (_, idx) => !trait.w[idx].isZero() || trait.Q[idx].some((q) => !q.isZero()),
  );
  const confidences = relevantChannels.map((c) => identityConfidence(evidenceByChannel.get(c) ?? EMPTY_IDENTITY_EVIDENCE, kC));
  const confidence = confidences.length === 0 ? Rational.ZERO : confidences.reduce((a, b) => a.min(b));
  return value.gte(thetaTrait) && confidence.gte(thetaConfidence);
}

// ---------------------------------------------------------------------------
// Identity Feedback Into Future Decisions (Brief §22, Phase 2.95 revision)
// ---------------------------------------------------------------------------

/** Per-IdentityExpressionChannel pull on one Option: IdentityStrength_k ×
 * Alignment(o,k), for every channel with nonzero strength AND nonzero
 * alignment. Shared by `identityConsistency` (which sums these into one
 * scalar, kept for trace/display purposes) and
 * `identityFeedbackRawInfluences` (which instead keeps them separate, one
 * per semantic channel, so each can join that channel's own
 * Need/accessibility raw pressure BEFORE the shared floor check — the
 * actual Phase 2.95 mechanism). */
function perChannelIdentityPull(
  optionKey: CanonicalActionKey,
  boundedSemanticByOption: BoundedSemanticPressure,
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  polarityTable: ReasonChannelPolarityTable,
  kI: Rational,
): Array<{ readonly channel: IdentityExpressionChannelId; readonly pull: Rational }> {
  const out: Array<{ channel: IdentityExpressionChannelId; pull: Rational }> = [];
  for (const channel of CHANNEL_ORDER) {
    const evidence = evidenceByChannel.get(channel) ?? EMPTY_IDENTITY_EVIDENCE;
    const strength = identityStrength(evidence, kI);
    if (strength.isZero()) continue;
    const align = alignment(optionKey, channel, boundedSemanticByOption, polarityTable);
    const pull = strength.mul(align);
    if (pull.isZero()) continue;
    out.push({ channel, pull });
  }
  return out;
}

/**
 * IdentityConsistency(o) = boundedResponse( Σ_k IdentityStrength_k ·
 * Alignment(o,k) ) — Brief §22's original scalar formulation. Kept for
 * trace/display purposes (DecisionPanel shows "how much does identity pull
 * toward this option, all told"); the actual decision-influencing pathway
 * is `identityFeedbackRawInfluences` below, which decomposes this exact
 * same per-channel computation instead of pre-summing it.
 */
export function identityConsistency(
  optionKey: CanonicalActionKey,
  boundedSemanticByOption: BoundedSemanticPressure,
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  polarityTable: ReasonChannelPolarityTable,
  kI: Rational,
): Rational {
  const acc = perChannelIdentityPull(optionKey, boundedSemanticByOption, evidenceByChannel, polarityTable, kI).reduce(
    (a, { pull }) => a.add(pull),
    Rational.ZERO,
  );
  return Rational.boundedResponse(acc);
}

/**
 * PHASE 2.95 — the actual identity-feedback mechanism. Rather than folding
 * IdentityStrength × Alignment into ONE separate `DecisionInfluence` per
 * Option (Phase 2.9's original shape, which meant identity's contribution
 * could never combine with a same-topic Need signal that was individually
 * too weak to clear the floor — exactly the "floor-rescue impossibility"
 * the Phase 2.95 review identified), each identity channel's pull is
 * tagged with the reason channel `identity:<channel>` — which
 * `scenario.ts::defaultReasonChannelMapping()` maps to that channel's own
 * "home" semantic channel (e.g. `identity:CommitmentFidelity` →
 * `'commitment'`, the SAME semantic channel `need.connection` maps to) —
 * and returned as ordinary `RawReasonInfluence`s. `cycle.ts` folds these
 * into the SAME raw pool as this option's Need/accessibility pressure
 * BEFORE `consolidateRawInfluences` sums-then-bounds-then-floors by
 * channel, so a weak Need signal and a weak identity signal on the same
 * semantic channel can now combine into a channel that clears the floor
 * together — Brief §22's "identity strengthens a reason" made literal,
 * rather than "identity is always its own separate, all-or-nothing reason."
 *
 * This also explains why identity can never DICTATE the Action (Brief §22):
 * each per-channel pull is itself bounded in [-1,1] (IdentityStrength ∈
 * (-1,1) times Alignment ∈ [-1,1]), while a Need's own raw contribution has
 * no fixed range — a strong, well-established Need pressure summed with a
 * bounded identity term and then re-bounded by `boundedResponse` still
 * lands close to what the Need alone would have produced; identity's
 * marginal share shrinks, rather than grows, as the competing raw pressure
 * gets larger.
 */
export function identityFeedbackRawInfluences(
  optionKey: CanonicalActionKey,
  boundedSemanticByOption: BoundedSemanticPressure,
  evidenceByChannel: ReadonlyMap<IdentityExpressionChannelId, IdentityEvidenceState>,
  polarityTable: ReasonChannelPolarityTable,
  kI: Rational,
): RawReasonInfluence[] {
  return perChannelIdentityPull(optionKey, boundedSemanticByOption, evidenceByChannel, polarityTable, kI).map(({ channel, pull }) => ({
    source: 'identity_consistency',
    reasonChannel: `identity:${channel}`,
    strength: pull,
  }));
}
