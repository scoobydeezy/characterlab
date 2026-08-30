/**
 * The cognitive cycle orchestrator — Brief §25's 20-step authoritative
 * transition cycle, Phase 1 + Phase 2 subset. Steps not yet mechanized are
 * listed and explicitly skipped in comments below, rather than silently
 * omitted, so the gap between "full model" and "what this build actually
 * runs" stays visible in the code itself.
 *
 *  1. Advance analytical Need state                     — needs.ts
 *  2. Apply deterministic world input                    — (no exogenous world events beyond the acting character's own chosen Action)
 *  3. Construct base cognitive activation                — buildBaseActivation() below (§16)
 *  4. Solve associative activation                        — activation.ts (§16)
 *  5. Retrieve memories                                    — memory.ts (§17)
 *  6. Generate feasible accessible Actions                — actions.ts: candidateActionsWithAccessibility (precondition AND accessibility ≥ θ_A, top-K_A)
 *  7. Evaluate Actions                                     — actions.ts (Need term only — see actions.ts for why)
 *  8. Produce Action probability distribution              — choice.ts
 *  9. Select Action using deterministic randomness         — choice.ts
 * 10. Apply deterministic/stochastic world outcome         — outcome.ts
 * 11. Measure Need outcomes                                 — experience.ts
 * 12. Create Experience                                      — experience.ts
 * 13. Update Need-satisfaction expectations                  — expectation.ts
 * 14. Update beliefs from observations                       — SKIPPED (Phase 3: needs belief distributions)
 * 15. Create episodic Memory                                  — memory.ts (§17)
 * 16. Update associative structure                            — associations.ts: updateAssociations (§14–15)
 * 17. Recompute derived Values                                — SKIPPED (Phase 4: needs derived Values)
 * 18. Validate invariants                                       — invariants.ts
 * 19. Commit next state                                          — (return value)
 * 20. Emit full causal trace                                      — kernel/trace.ts
 *
 * Idle ticks (runIdleTick, for the UI's "Advance Time" control) still only
 * run step 1 — nothing "happened" for the character to associate, retrieve
 * against, or learn from, so steps 3–5/15–16 are skipped there exactly as
 * they were skipped everywhere in Phase 1. Association atrophy (the decay
 * half of updateAssociations) therefore only advances when an Experience
 * occurs, not on wall/tick time alone — a scoping decision parallel to
 * NeedExpectation's own precision decay, which likewise only recomputes at
 * the next observation. See RESEARCH.md's Phase 2 entry for the tradeoff.
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, ConceptKey, NeedId, asConceptKey } from '../kernel/canonical';
import { TraceBuilder, CognitiveCycleTrace } from '../kernel/trace';
import { EventClock, SimEvent } from '../kernel/event';
import {
  CharacterState,
  advanceAllNeeds,
  getExpectation,
  withExpectation,
  withCurrentTime,
  withAssociations,
  withMemory,
  getIdentityEvidence,
  withIdentityEvidence,
  withDecisionExpression,
} from './character';
import { NeedDef, needDeficit, needUrgency, applyBoundedEffect, BoundedEffectResult, SaturationKind } from './needs';
import { ActionDef, NeedContext, ScoredAction, candidateActionsWithAccessibility, AccessibilityFilterResult, evaluateAction } from './actions';
import { ChoiceParams, buildChoiceDistribution, selectAction, ChoiceDistribution } from './choice';
import { NeedExpectationParams, EvidenceKind, observationPrecision, updateExpectation } from './expectation';
import { Experience, actualNeedResult } from './experience';
import { WorldOutcomeTable, resolveOutcome } from './outcome';
import { checkInvariants, InvariantViolation } from './invariants';
import { ActivationVector, ActivationParams, solveActivation } from './activation';
import { AssociationLearningParams, updateAssociations } from './associations';
import { MemoryCycleParams, NeedOutcomeRecord, PredictionErrorRecord, ScoredMemory, createMemory, addMemory, retrieveTopK } from './memory';
import {
  SalienceParams,
  EffectProvenance,
  NeedImpact,
  SurpriseEvidence,
  SemanticSalienceResult,
  computeSemanticSalience,
  deriveWorldEventDescriptor,
  causallyConnectedFromProvenance,
  subjectRoleSlot,
  surpriseMagnitude,
} from './salience';
import { SemanticExperience, NeedObservation } from './semanticExperience';
import {
  Decision,
  DecisionInfluence,
  DecisionParams,
  DecisionExpression,
  IdentityExpressionRecord,
  resolveDecision,
  REASON_CHANNEL_ACCESSIBILITY,
  SemanticReasonChannelId,
  RawReasonInfluence,
  sumRawBySemanticChannel,
  boundAndFloorChannels,
  boundAllChannels,
  buildConsolidatedInfluences,
} from './decision';
import {
  identityFeedbackRawInfluences,
  updateIdentityEvidence,
  touchedChannels,
  alignment,
  ReasonChannelPolarityTable,
  IdentityExpressionChannelId,
} from './identity';

/**
 * Phase 2.5a — Brief §19/§27's Saturated Satisfaction / Censored Learning.
 * `'naive'` (the default — see scenario.ts::defaultSaturationParams)
 * reproduces every Phase 0-2 finding byte-for-byte: NeedExpectation always
 * learns from the raw (possibly boundary-clipped) realized effect as if it
 * were an exact point observation, exactly as before this phase existed.
 * `'censored'` instead classifies a clipped effect as one-sided evidence
 * (see expectation.ts::EvidenceKind) so it can inform confidence (τ) without
 * being able to pull an established expectation (μ) toward the wrong side
 * of what it actually proves. `kappa` weights the purely descriptive,
 * trace-only Experienced-Reward quantity (Applied + κ·Overflow) — per the
 * brief's explicit caution, this phase does NOT assume Reward feeds back
 * into Need state, Score(a), or learning; it is recorded so a later phase
 * can decide whether the hypothesis is DERIVED, REQUIRES MECHANISM, or
 * DEFERRED against real trace data instead of a guess.
 */
export interface SaturationParams {
  readonly learningMode: 'naive' | 'censored';
  readonly kappa: Rational;
}

/**
 * Phase 2.5b — Brief §5-14/§25-27's Semantic Salience. `'legacy'` (the
 * default — see scenario.ts::defaultCycleParams) reproduces every
 * Phase 0-2.5a finding byte-for-byte: `applyChosenAction` builds
 * `semanticConcepts`/`experienceActivation` exactly as it always did (flat
 * co-activation weight of 1.0 for the Action/subject/Location/Context).
 * `'derived'` instead runs the full Brief §25 pipeline
 * (salience.ts::computeSemanticSalience) and uses its per-concept z_i as
 * the co-activation weight fed to `associations.ts::updateAssociations`,
 * replacing the flat 1.0 that Phase 2's RESEARCH.md flagged as an
 * authoring artifact (the Habit experiment's W-caps-at-1/2 finding).
 */
export interface CycleParams {
  readonly deltaT: Rational;
  readonly choice: ChoiceParams;
  readonly expectation: NeedExpectationParams;
  readonly activation: ActivationParams;
  readonly associationLearning: AssociationLearningParams;
  readonly memoryParams: MemoryCycleParams;
  readonly saturation: SaturationParams;
  readonly salienceMode: 'legacy' | 'derived';
  readonly salience: SalienceParams;
  /** Phase 2.9 — die-scale thresholds, resolution-mode thresholds, and
   * trait-consolidation constants for `runDecisionCycle`. Unused by
   * `runAutonomousCycle`/`runScriptedExperience` (their own `params.choice`/
   * `params.activation` govern ordinary Action selection, unchanged). */
  readonly decision: DecisionParams;
}

/** What's "in the air" for this cycle beyond Needs and the acting
 * character herself — which Context concepts are currently active (e.g.
 * "is it evening") and which Location the Experience happens at. Optional
 * everywhere it's threaded through; omitting it reproduces exactly the
 * Phase-1 behavior (no context, no location) for existing call sites. */
export interface ExperienceContext {
  readonly activeConcepts: ReadonlySet<ConceptKey>;
  readonly location: ConceptKey | null;
  /** Phase 2.5c — an explicit `EffectProvenance` (model/salience.ts) for
   * this Experience — what actually, causally happened — used only when
   * `salienceMode === 'derived'`. Omitted (the default) means cycle.ts
   * builds the ordinary-Experience provenance itself from
   * actionKey/`chosen.subjectRole`/location/activeConcepts — every existing
   * scenario and test is unaffected without needing to supply one. Callers
   * provide this for events the ordinary single-Action-and-subject shape
   * cannot express (Brief §13 Scenario C/D: an Object or Location becoming
   * the causal `'Cause'` rather than an ordinary participant). Causal role
   * (`deriveWorldEventDescriptor`) and causal connectedness
   * (`causallyConnectedFromProvenance`) are BOTH derived mechanically from
   * this one provenance value — there is no separate override for either,
   * per Phase 2.5c's "role comes from provenance, not from a hand-filled
   * descriptor" correction. */
  readonly worldEventOverride?: EffectProvenance;
}

export const EMPTY_EXPERIENCE_CONTEXT: ExperienceContext = { activeConcepts: new Set(), location: null };

/** Phase 2.5a — the Capacity/Applied/Overflow decomposition and descriptive
 * Experienced-Reward for one Need effect from the just-applied Action's
 * outcome, exposed directly on CycleResult (not just the trace) so UI code
 * can read it the same way it already reads `activation` — see
 * ui/state/useEngine.ts's `lastSaturationAnalysis`. */
export interface SaturationAnalysisEntry {
  readonly needId: NeedId;
  readonly applied: Rational;
  readonly overflow: Rational;
  readonly saturated: SaturationKind;
  readonly reward: Rational;
}

export interface CycleResult {
  readonly nextState: CharacterState;
  readonly experience: Experience;
  readonly chosenAction: CanonicalActionKey;
  readonly distribution: ChoiceDistribution | null; // null for forced/scripted cycles
  readonly scoredActions: readonly ScoredAction[];
  readonly activation: ActivationVector;
  readonly accessibilityFilter: AccessibilityFilterResult | null; // null for scripted cycles (no filtering applied)
  readonly retrievedMemories: readonly ScoredMemory[];
  readonly saturationAnalysis: readonly SaturationAnalysisEntry[];
  /** Phase 2.5b — null when `salienceMode === 'legacy'` (nothing to
   * report: co-activation was the flat 1.0 it always was), populated when
   * `'derived'` with the full per-concept B/R/A/N/S/raw/z breakdown. Kept
   * for research/UI use (the full explain-everything trace); `semanticExperience`
   * below is the consumer-facing consolidation of this same data. */
  readonly semanticSalience: SemanticSalienceResult | null;
  /** Phase 2.5e — this Experience formalized as a `SemanticExperience`
   * (model/semanticExperience.ts): the character-relative record Phase 3
   * should consume, with world-truth Overflow deliberately excluded. Null
   * under the same condition `semanticSalience` is (`salienceMode ===
   * 'legacy'`) — there is no well-defined character-relative encoding to
   * report when co-activation was the flat, non-derived 1.0. */
  readonly semanticExperience: SemanticExperience | null;
  readonly trace: CognitiveCycleTrace;
  readonly invariantViolations: readonly InvariantViolation[];
}

function needContexts(state: CharacterState, trace: TraceBuilder): NeedContext[] {
  const contexts: NeedContext[] = [];
  for (const [needId, def] of state.needDefs) {
    const needState = state.needStates.get(needId);
    if (!needState) continue;
    const deficit = needDeficit(needState.level, def.setPoint);
    const urgency = needUrgency(deficit, def.coreImportance, def.urgencyExponent);
    trace.record(
      'need_urgency',
      {
        needId,
        level: needState.level.toCanonicalString(),
        setPoint: def.setPoint.toCanonicalString(),
        coreImportance: def.coreImportance.toCanonicalString(),
        exponent: def.urgencyExponent,
      },
      { deficit: deficit.toCanonicalString(), urgency: urgency.toCanonicalString() },
    );
    contexts.push({ def, urgency });
  }
  return contexts;
}

/** Step 3: b_{need.x} = U_x for every Need concept; b_c = 1 for every
 * currently-active Context concept; 0 everywhere else (Brief §16's own
 * example is exactly the Need term — this generalizes it to also seed
 * Context concepts, which is what the Habit experiment needs). */
function buildBaseActivation(needCtxs: readonly NeedContext[], activeConcepts: ReadonlySet<ConceptKey>): ActivationVector {
  const b = new Map<ConceptKey, Rational>();
  for (const { def, urgency } of needCtxs) {
    b.set(asConceptKey(def.needId), urgency);
  }
  for (const c of activeConcepts) {
    b.set(c, Rational.ONE);
  }
  return b;
}

/** Steps 3–5, shared by both the autonomous and scripted cycle entry
 * points: build base activation from current Needs + active Context,
 * solve spreading activation over the character's associative graph, then
 * retrieve (and thereby reinforce) the top-K memories against it. */
function computeActivationAndRetrieveMemories(
  state: CharacterState,
  needCtxs: readonly NeedContext[],
  experienceContext: ExperienceContext,
  params: CycleParams,
  tick: number,
  trace: TraceBuilder,
): { activation: ActivationVector; retrieved: ScoredMemory[]; nextMemoryStore: CharacterState['memory'] } {
  const base = buildBaseActivation(needCtxs, experienceContext.activeConcepts);
  const activation = solveActivation(state.associations, params.activation.beta, base);
  trace.record(
    'spreading_activation',
    { beta: params.activation.beta.toCanonicalString(), base: Object.fromEntries([...base].map(([k, v]) => [k, v.toCanonicalString()])) },
    { activation: Object.fromEntries([...activation].map(([k, v]) => [k, v.toCanonicalString()])) as any },
  );

  const { selected, nextStore } = retrieveTopK(state.memory, tick, activation, params.memoryParams, params.memoryParams.retrievalK);
  trace.record(
    'memory_retrieval',
    { retrievalK: params.memoryParams.retrievalK },
    {
      retrieved: selected.map((s) => ({
        memoryId: s.record.memory.memoryId,
        base: s.base.toCanonicalString(),
        associative: s.associative.toCanonicalString(),
        retrieval: s.retrieval.toCanonicalString(),
      })) as any,
    },
  );

  return { activation, retrieved: selected, nextMemoryStore: nextStore };
}

/**
 * Shared tail of the cycle — outcome application through Experience,
 * expectation learning, episodic memory creation, and associative-
 * structure update (steps 10–13, 15–16) plus invariant validation (18) and
 * trace emission (20). Both the autonomous and scripted entry points below
 * funnel into this once "which Action happened" is decided, so the
 * learning math is identical regardless of how the Action was chosen.
 */
export function applyChosenAction(
  actor: ConceptKey,
  stateAfterNeedAdvance: CharacterState,
  memoryStoreAfterRetrieval: CharacterState['memory'],
  chosen: ActionDef,
  outcomeTable: WorldOutcomeTable,
  needCtxs: NeedContext[],
  experienceContext: ExperienceContext,
  params: CycleParams,
  event: SimEvent,
  trace: TraceBuilder,
  seed: string,
): Omit<CycleResult, 'distribution' | 'scoredActions' | 'activation' | 'accessibilityFilter' | 'retrievedMemories'> {
  const before = [...stateAfterNeedAdvance.needStates.values()].map((s) => ({ needId: s.needId, level: s.level }));

  const realized = resolveOutcome(outcomeTable, { seed, eventId: event.eventId });

  // Apply realized effects to Need levels (still within this same cycle,
  // after the passive Need advance already applied above). Phase 2.5a:
  // the clamp is now `applyBoundedEffect` (needs.ts) so the
  // Capacity/Applied/Overflow decomposition is available to both the
  // saturation trace below and, when learningMode is 'censored', to the
  // expectation update's evidence classification.
  let stateAfterOutcome: CharacterState = { ...stateAfterNeedAdvance, memory: memoryStoreAfterRetrieval };
  const boundedEffects = new Map<NeedId, BoundedEffectResult>();
  for (const eff of realized) {
    const current = stateAfterOutcome.needStates.get(eff.needId);
    if (!current) continue;
    const bounded = applyBoundedEffect(current.level, eff.realized);
    boundedEffects.set(eff.needId, bounded);
    const nextStates = new Map(stateAfterOutcome.needStates);
    nextStates.set(eff.needId, { needId: eff.needId, level: bounded.after });
    stateAfterOutcome = { ...stateAfterOutcome, needStates: nextStates };
  }
  trace.record(
    'world_outcome',
    { action: chosen.actionKey, subject: chosen.subject },
    {
      effects: realized.map((e) => ({
        needId: e.needId,
        magnitude: e.magnitude.toCanonicalString(),
        noiseHalfWidth: e.noiseHalfWidth.toCanonicalString(),
        noiseDraw: e.noiseDraw.toCanonicalString(),
        realized: e.realized.toCanonicalString(),
      })) as any,
    },
  );

  // Phase 2.5a: always compute and trace the Capacity/Applied/Overflow
  // decomposition and the descriptive Experienced-Reward quantity, for
  // every Need this Action's outcome table touched — regardless of
  // learningMode, so the "what would censoring have seen" comparison is
  // always available in the trace even when running in 'naive' mode.
  // Reward = Applied + κ·Overflow — trace-only (Brief §23/§27); never
  // added to Need state or Score(a) this phase. Not assumed necessary: see
  // RESEARCH.md's Phase 2.5a entry for classification.
  const saturationAnalysis: SaturationAnalysisEntry[] = [...boundedEffects].map(([needId, b]) => ({
    needId,
    applied: b.applied,
    overflow: b.overflow,
    saturated: b.saturated,
    reward: b.applied.add(params.saturation.kappa.mul(b.overflow)),
  }));
  trace.record(
    'saturation_analysis',
    { learningMode: params.saturation.learningMode, kappa: params.saturation.kappa.toCanonicalString() },
    {
      perNeed: saturationAnalysis.map((s) => ({
        needId: s.needId,
        applied: s.applied.toCanonicalString(),
        overflow: s.overflow.toCanonicalString(),
        saturated: s.saturated,
        reward: s.reward.toCanonicalString(),
      })) as any,
    },
  );

  const after = [...stateAfterOutcome.needStates.values()].map((s) => ({ needId: s.needId, level: s.level }));

  const experience: Experience = {
    experienceId: event.eventId,
    occurredAt: event.occurredAt,
    actor,
    action: chosen.actionKey,
    participants: [chosen.subject],
    contextConcepts: [...experienceContext.activeConcepts],
    location: experienceContext.location,
    needStateBefore: before,
    needStateAfter: after,
    observations: [],
    semanticTags: [],
  };
  trace.record(
    'experience_created',
    {},
    {
      experienceId: experience.experienceId,
      before: before.map((b) => ({ needId: b.needId, level: b.level.toCanonicalString() })) as any,
      after: after.map((a) => ({ needId: a.needId, level: a.level.toCanonicalString() })) as any,
    },
  );

  // Step 13: update NeedExpectation(subject, n) for every Need the
  // character has, using this Experience's actual result r_n. Needs the
  // Action had no effect table entry for still get an observation with
  // r_n = 0 at the base observation precision — "this action doesn't move
  // this Need" is itself learned information (Brief §12 makes no
  // exception for null effects).
  let nextState = stateAfterOutcome;
  const needOutcomes: NeedOutcomeRecord[] = [];
  const predictionErrors: PredictionErrorRecord[] = [];
  const surpriseEvidenceRecords: SurpriseEvidence[] = [];
  // Phase 2.5e: the per-Need entries of this Experience's SemanticExperience
  // (built below, only when salienceMode === 'derived') — collected in the
  // same loop that already computes everything each entry needs, rather
  // than recomputed separately.
  const needObservationsForSemanticExperience: NeedObservation[] = [];
  for (const { def, urgency } of needCtxs) {
    const r = actualNeedResult(experience, def.needId);
    const prior = getExpectation(stateAfterNeedAdvance, chosen.subject, def.needId);
    const rho = observationPrecision(params.expectation, def.coreImportance, urgency);
    const bounded = boundedEffects.get(def.needId);
    // Phase 2.5c: the OBJECTIVE evidence kind — what kind of observation
    // this actually was — is classified unconditionally from the
    // Capacity/Applied/Overflow decomposition, independent of
    // `params.saturation.learningMode`. Salience's surprise measure always
    // respects this (evidence semantics are a fact about what was
    // observed, not a choice of learning algorithm); the LEARNING update
    // below still only acts on it when `learningMode === 'censored'` —
    // that toggle is about what the learning rule DOES with censored
    // evidence, not about what kind of evidence it objectively was.
    let objectiveEvidenceKind: EvidenceKind = 'point';
    if (bounded?.saturated === 'ceiling') objectiveEvidenceKind = 'lower_bound';
    else if (bounded?.saturated === 'floor') objectiveEvidenceKind = 'upper_bound';
    const learningEvidenceKind: EvidenceKind = params.saturation.learningMode === 'censored' ? objectiveEvidenceKind : 'point';
    const updateResult = updateExpectation(prior, params.expectation, params.deltaT, rho, r, event.occurredAt, learningEvidenceKind);
    nextState = withExpectation(nextState, chosen.subject, def.needId, updateResult.next);
    needOutcomes.push({ needId: def.needId, result: r });
    predictionErrors.push({ subject: chosen.subject, needId: def.needId, error: r.sub(prior.mu) });
    surpriseEvidenceRecords.push({ kind: objectiveEvidenceKind, priorMu: prior.mu, observed: r });
    needObservationsForSemanticExperience.push({
      needId: def.needId,
      applied: r,
      evidenceKind: objectiveEvidenceKind,
      surprise: surpriseMagnitude({ kind: objectiveEvidenceKind, priorMu: prior.mu, observed: r }),
    });
    trace.record(
      'expectation_update',
      {
        subject: chosen.subject,
        needId: def.needId,
        priorMu: prior.mu.toCanonicalString(),
        priorTau: prior.tau.toCanonicalString(),
        actualResult: r.toCanonicalString(),
        observationPrecision: rho.toCanonicalString(),
        alpha: updateResult.alpha.toCanonicalString(),
        evidenceKind: learningEvidenceKind,
        objectiveEvidenceKind,
      },
      {
        mu: updateResult.next.mu.toCanonicalString(),
        tau: updateResult.next.tau.toCanonicalString(),
        censoredRejected: updateResult.censoredRejected,
      },
    );
  }

  // Step 15: create episodic Memory. Semantic concepts are exactly the
  // concepts this Experience actually engaged: the Action itself, its
  // subject, its Location (if any), and whatever Context was active.
  //
  // Phase 2.5b/c: when salienceMode is 'derived', run the full Brief §25
  // pipeline instead of the flat co-activation weight of 1.0 every
  // concept got before this phase existed. semanticConcepts (used for
  // Memory tagging) becomes exactly the descriptor's PERCEIVED concepts —
  // "was this in the character's Experience at all" — while
  // experienceActivation (fed to updateAssociations) uses each concept's
  // derived z_i, so a low-attention/incidental concept can be memory-tagged
  // yet contribute almost nothing to associative learning (success
  // criterion §14.2/§14.7: "association strength is no longer primarily
  // determined by arbitrary tag count").
  let semanticConcepts: ConceptKey[];
  let semanticSalience: SemanticSalienceResult | null = null;
  let semanticExperience: SemanticExperience | null = null;
  const experienceActivation = new Map<ConceptKey, Rational>();

  if (params.salienceMode === 'derived') {
    // Phase 2.5c: build this Experience's EffectProvenance — what actually
    // happened — instead of a hand-authored WorldEventDescriptor.
    // `chosen.subjectRole` (an authored fact about THIS ACTION's semantic
    // argument structure, e.g. Conversation->Participant) decides which
    // provenance slot the subject fills; role and causal-connectedness are
    // then both derived mechanically from that one provenance value.
    const provenance: EffectProvenance =
      experienceContext.worldEventOverride ?? {
        sourceAction: asConceptKey(chosen.actionKey),
        location: experienceContext.location ?? undefined,
        activeContext: experienceContext.activeConcepts,
        ...subjectRoleSlot(chosen.subjectRole, chosen.subject),
      };
    const descriptor = deriveWorldEventDescriptor(provenance);
    const causallyConnected = causallyConnectedFromProvenance(provenance);
    const needImpacts: NeedImpact[] = needOutcomes.map((o) => {
      const ctx = needCtxs.find((c) => c.def.needId === o.needId);
      return { needId: o.needId, delta: o.result, urgency: ctx?.urgency ?? Rational.ZERO };
    });

    semanticSalience = computeSemanticSalience(descriptor, causallyConnected, needImpacts, surpriseEvidenceRecords, params.salience);
    semanticConcepts = semanticSalience.breakdown.filter((b) => b.perceived).map((b) => b.concept);
    for (const b of semanticSalience.breakdown) {
      if (b.perceived) experienceActivation.set(b.concept, b.z);
    }
    trace.record(
      'semantic_salience',
      { budgetMode: semanticSalience.budgetMode },
      {
        breakdown: semanticSalience.breakdown.map((b) => ({
          concept: b.concept,
          category: b.category,
          role: b.role,
          perceived: b.perceived,
          baseSalience: b.baseSalience.toCanonicalString(),
          roleWeight: b.roleWeight.toCanonicalString(),
          attention: b.attention.toCanonicalString(),
          needRelevance: b.needRelevance.toCanonicalString(),
          surprise: b.surprise.toCanonicalString(),
          raw: b.raw.toCanonicalString(),
          z: b.z.toCanonicalString(),
        })) as any,
      },
    );

    // Phase 2.5e: package this Experience as the formalized
    // SemanticExperience (model/semanticExperience.ts) — the consolidated,
    // character-relative view Phase 3 (belief/appraisal) should consume
    // instead of inspecting raw world-resolution data. Built from data
    // already computed above; nothing here is a new computation.
    semanticExperience = {
      experienceId: experience.experienceId,
      actor,
      occurredAt: event.occurredAt,
      action: chosen.actionKey,
      provenance,
      perceivedEvent: descriptor,
      conceptEncodings: semanticSalience.breakdown.map((b) => ({
        concept: b.concept,
        category: b.category,
        role: b.role,
        perceived: b.perceived,
        attention: b.attention,
        salience: b.z,
      })),
      needObservations: needObservationsForSemanticExperience,
      budgetMode: semanticSalience.budgetMode,
    };
  } else {
    semanticConcepts = [asConceptKey(chosen.actionKey), chosen.subject];
    if (experienceContext.location) semanticConcepts.push(experienceContext.location);
    semanticConcepts.push(...experienceContext.activeConcepts);
    for (const c of semanticConcepts) experienceActivation.set(c, Rational.ONE);
  }

  const memoryEpisode = createMemory(
    `memory:${experience.experienceId}`,
    experience.experienceId,
    event.occurredAt,
    semanticConcepts,
    needOutcomes,
    predictionErrors,
    experience.participants,
    experienceContext.location,
    chosen.actionKey,
  );
  nextState = withMemory(nextState, addMemory(nextState.memory, memoryEpisode));
  trace.record('memory_created', {}, { memoryId: memoryEpisode.memoryId, semanticConcepts: semanticConcepts as any });

  // Step 16: update associative structure — the SOLE mutation path for W
  // (Brief §14). `experienceActivation` was already built above: flat
  // z_i=1 for every engaged concept in 'legacy' mode (Phase 0-2.5a's
  // unchanged behavior), or the derived per-concept z_i from
  // computeSemanticSalience in 'derived' mode (Phase 2.5b). Needs are
  // deliberately excluded from this Hebbian co-activation set (see
  // model/associations.ts's module comment).
  const { graph: nextGraph, trace: assocTrace } = updateAssociations(
    nextState.associations,
    experienceActivation,
    params.deltaT,
    params.associationLearning,
  );
  nextState = withAssociations(nextState, nextGraph);
  trace.record(
    'association_update',
    { engagedConcepts: semanticConcepts as any },
    { rows: assocTrace.map((t) => ({ concept: t.concept, overflowed: t.overflowed, rawSum: t.rawSum.toCanonicalString() })) as any },
  );

  nextState = withCurrentTime(nextState, event.occurredAt);

  const violations = checkInvariants(nextState);
  trace.record(
    'invariant_check',
    {},
    { violations: violations.map((v) => v.message) as any, ok: violations.length === 0 },
  );

  return {
    nextState,
    experience,
    chosenAction: chosen.actionKey,
    saturationAnalysis,
    semanticSalience,
    semanticExperience,
    trace: trace.build(),
    invariantViolations: violations,
  };
}

/**
 * Full autonomous cycle: build activation, retrieve memories, generate
 * accessibility-filtered candidates, evaluate them, build a probability
 * distribution, and select one via the counter-addressed random oracle.
 * This is "let the character choose."
 */
export function runAutonomousCycle(
  actor: ConceptKey,
  state: CharacterState,
  actions: readonly ActionDef[],
  worldFlags: ReadonlySet<string>,
  outcomeTables: ReadonlyMap<CanonicalActionKey, WorldOutcomeTable>,
  params: CycleParams,
  clock: EventClock,
  seed: string,
  experienceContext: ExperienceContext = EMPTY_EXPERIENCE_CONTEXT,
): CycleResult {
  const trace = new TraceBuilder(`cycle:${clock.now()}`, clock.now());

  const advanced = advanceAllNeeds(state, params.deltaT);
  trace.record(
    'need_advance',
    { deltaT: params.deltaT.toCanonicalString() },
    {
      levels: [...advanced.needStates.values()].map((s) => ({
        needId: s.needId,
        level: s.level.toCanonicalString(),
      })) as any,
    },
  );

  const ctxs = needContexts(advanced, trace);

  const { activation, retrieved, nextMemoryStore } = computeActivationAndRetrieveMemories(
    advanced,
    ctxs,
    experienceContext,
    params,
    clock.now(),
    trace,
  );

  const accessibilityFilter = candidateActionsWithAccessibility(
    actions,
    worldFlags,
    activation,
    params.activation.thetaA,
    params.activation.kA,
  );
  trace.record(
    'candidate_actions',
    { worldFlags: [...worldFlags], thetaA: params.activation.thetaA.toCanonicalString(), kA: params.activation.kA },
    {
      evaluated: accessibilityFilter.evaluated.map((e) => ({
        action: e.actionKey,
        accessibility: e.accessibility.toCanonicalString(),
        passedThreshold: e.passedThreshold,
        selected: e.selected,
      })) as any,
    },
  );

  const candidates = accessibilityFilter.candidates;
  if (candidates.length === 0) {
    throw new RangeError('runAutonomousCycle: no candidate Actions available under current world flags / accessibility threshold');
  }

  const stateForEvaluation = { ...advanced, memory: nextMemoryStore };

  const scored = candidates.map((action) =>
    evaluateAction(action, ctxs, (needId) => getExpectation(stateForEvaluation, action.subject, needId), params.expectation.kC),
  );
  for (const s of scored) {
    trace.record(
      'action_evaluation',
      { action: s.actionKey },
      {
        needTerm: s.needTerm.toCanonicalString(),
        score: s.score.toCanonicalString(),
        boundedScore: s.boundedScore.toCanonicalString(),
      },
    );
  }

  const distribution = buildChoiceDistribution(scored, params.choice);
  trace.record(
    'choice_distribution',
    { epsilon: params.choice.epsilon.toCanonicalString(), gamma: params.choice.gamma },
    { probabilities: distribution.ordered.map((o) => ({ action: o.actionKey, p: o.probability.toCanonicalString() })) as any },
  );

  const event = clock.emit('autonomous_choice', { actor });
  const selection = selectAction(distribution, { seed, eventId: event.eventId, purposeId: 'action_selection', drawIndex: 0 });
  trace.record(
    'action_selection',
    { draw: selection.draw.toCanonicalString() },
    { selected: selection.actionKey, cumulativeAtSelection: selection.cumulativeAtSelection.toCanonicalString() },
  );

  const chosen = candidates.find((c) => c.actionKey === selection.actionKey)!;
  const outcomeTable = outcomeTables.get(chosen.actionKey);
  if (!outcomeTable) throw new RangeError(`No WorldOutcomeTable for Action ${chosen.actionKey}`);

  const result = applyChosenAction(actor, stateForEvaluation, nextMemoryStore, chosen, outcomeTable, ctxs, experienceContext, params, event, trace, seed);
  return { ...result, distribution, scoredActions: scored, activation, accessibilityFilter, retrievedMemories: retrieved };
}

export interface IdleTickResult {
  readonly nextState: CharacterState;
  readonly trace: CognitiveCycleTrace;
}

/**
 * Time passing with no Action taken — just step 1 (advance Need state) and
 * step 20 (trace), for the UI's "Advance Time" control. No Experience is
 * created and no expectation/association learning occurs, since nothing
 * happened for the character to learn from (Brief §11: Experience is tied
 * to an actor's Action).
 */
export function runIdleTick(state: CharacterState, params: CycleParams, clock: EventClock): IdleTickResult {
  const trace = new TraceBuilder(`idle:${clock.now()}`, clock.now());
  const advanced = advanceAllNeeds(state, params.deltaT);
  trace.record(
    'need_advance',
    { deltaT: params.deltaT.toCanonicalString() },
    {
      levels: [...advanced.needStates.values()].map((s) => ({
        needId: s.needId,
        level: s.level.toCanonicalString(),
      })) as any,
    },
  );
  const event = clock.emit('idle_tick', {});
  const nextState = withCurrentTime(advanced, event.occurredAt);
  return { nextState, trace: trace.build() };
}

/**
 * Scripted (forced) Experience: used to drive the controlled experiments
 * Brief §28–29 call for ("Mina repeatedly experiences Glen satisfying
 * Connection" / paired counterfactual timelines) — the experimenter
 * decides which Action occurs, bypassing candidate generation and choice,
 * but activation/memory (steps 3–5, for trace completeness and
 * reinforcement) and the outcome→Experience→learning→memory→association
 * tail (steps 10–13, 15–16, 18, 20) run identically to the autonomous
 * path.
 */
export function runScriptedExperience(
  actor: ConceptKey,
  state: CharacterState,
  forcedAction: ActionDef,
  outcomeTable: WorldOutcomeTable,
  params: CycleParams,
  clock: EventClock,
  seed: string,
  experienceContext: ExperienceContext = EMPTY_EXPERIENCE_CONTEXT,
): CycleResult {
  const trace = new TraceBuilder(`scripted:${clock.now()}`, clock.now());

  const advanced = advanceAllNeeds(state, params.deltaT);
  trace.record(
    'need_advance',
    { deltaT: params.deltaT.toCanonicalString() },
    {
      levels: [...advanced.needStates.values()].map((s) => ({
        needId: s.needId,
        level: s.level.toCanonicalString(),
      })) as any,
    },
  );

  const ctxs = needContexts(advanced, trace);
  trace.record('scripted_action', { action: forcedAction.actionKey, subject: forcedAction.subject }, {});

  const { activation, retrieved, nextMemoryStore } = computeActivationAndRetrieveMemories(
    advanced,
    ctxs,
    experienceContext,
    params,
    clock.now(),
    trace,
  );

  const event = clock.emit('scripted_experience', { actor, action: forcedAction.actionKey });
  const result = applyChosenAction(actor, advanced, nextMemoryStore, forcedAction, outcomeTable, ctxs, experienceContext, params, event, trace, seed);
  return { ...result, distribution: null, scoredActions: [], activation, accessibilityFilter: null, retrievedMemories: retrieved };
}

/**
 * Phase 2.9 — Decision Authorship, Acquired Identity, and the Role of Dice
 * (Brief §6-24). A NEW, parallel front-end to Action selection (plan
 * scoping decision 2): steps 1–5 run exactly as `runAutonomousCycle`
 * (unmodified `advanceAllNeeds`/`needContexts`/`computeActivationAndRetrieveMemories`),
 * but instead of accessibility-filtered candidates feeding a softmax over
 * however many Actions exist, a small AUTHORED `Decision` (2-3 `Option`s,
 * each 1:1 backed by an `ActionDef`) is resolved via exact discrete
 * probability calculus and — when Contest clears `params.decision.thetaRoll`
 * — actual dice, addressed through the same counter-addressed RNG oracle
 * every other draw in this codebase uses. The winning Option's chosen
 * INTENT is recorded as a `DecisionExpression` (biographical evidence)
 * regardless of what physically executes; `forcedOutcomeOverride` lets
 * Experiment K substitute a different physical outcome while the recorded
 * intent still reflects what was actually decided (Brief §14/§18).
 *
 * `params.activation.thetaA`/`kA` are NOT consulted on this path — a
 * Decision's Option set is authored/fixed, not accessibility-filtered; only
 * `params.activation.beta` (the spreading-activation solve) is shared with
 * the ordinary `runAutonomousCycle` path.
 */
export function runDecisionCycle(
  actor: ConceptKey,
  state: CharacterState,
  decision: Decision,
  outcomeTables: ReadonlyMap<CanonicalActionKey, WorldOutcomeTable>,
  params: CycleParams,
  reasonChannelMapping: ReadonlyMap<string, SemanticReasonChannelId>,
  semanticReasonPolarity: ReasonChannelPolarityTable,
  clock: EventClock,
  seed: string,
  experienceContext: ExperienceContext = EMPTY_EXPERIENCE_CONTEXT,
  forcedOutcomeOverride?: { readonly actionDef: ActionDef; readonly outcomeTable: WorldOutcomeTable },
): CycleResult & { readonly decisionExpression: DecisionExpression } {
  const trace = new TraceBuilder(`decision:${clock.now()}`, clock.now());

  const advanced = advanceAllNeeds(state, params.deltaT);
  trace.record(
    'need_advance',
    { deltaT: params.deltaT.toCanonicalString() },
    {
      levels: [...advanced.needStates.values()].map((s) => ({
        needId: s.needId,
        level: s.level.toCanonicalString(),
      })) as any,
    },
  );

  const ctxs = needContexts(advanced, trace);

  const { activation, retrieved, nextMemoryStore } = computeActivationAndRetrieveMemories(
    advanced,
    ctxs,
    experienceContext,
    params,
    clock.now(),
    trace,
  );

  const stateForEvaluation = { ...advanced, memory: nextMemoryStore };

  // Phase 2.95 — Reason Consolidation, with identity genuinely IN the pool.
  //
  // Step 1: collect each Option's raw (unbounded) Need/accessibility
  // pressure, and separately sum it per semantic channel — NOT yet bounded,
  // NOT yet floor-checked. `boundedNeedAccessByOption` is the same sum run
  // through `boundAllChannels` (dense, bounded, but NOT floor-filtered) —
  // this is what identity.ts's Alignment/touchedChannels consume for
  // EVIDENCE generation, deliberately excluding identity's own feedback
  // (Brief §23's no-double-counting rule: a Decision's identity-consistency
  // reason is derived from existing identity, not fresh behavioral
  // evidence, so it must never feed the computation that produces MORE
  // evidence for the same channel).
  const rawNeedAccessByOption = new Map<CanonicalActionKey, RawReasonInfluence[]>();
  const rawSumByOption = new Map<CanonicalActionKey, Map<SemanticReasonChannelId, Rational>>();
  const boundedNeedAccessByOption = new Map<CanonicalActionKey, Map<SemanticReasonChannelId, Rational>>();
  for (const option of decision.options) {
    const scored = evaluateAction(
      option.actionDef,
      ctxs,
      (needId) => getExpectation(stateForEvaluation, option.actionDef.subject, needId),
      params.expectation.kC,
    );

    const rawInfluences: RawReasonInfluence[] = [];
    for (const c of scored.perNeedContributions) {
      rawInfluences.push({
        source: 'need_contribution',
        reasonChannel: c.needId,
        strength: c.contribution,
      });
    }
    const accessibility = activation.get(asConceptKey(option.actionDef.actionKey)) ?? Rational.ZERO;
    rawInfluences.push({
      source: 'accessibility',
      reasonChannel: REASON_CHANNEL_ACCESSIBILITY,
      strength: accessibility,
    });

    const rawSum = sumRawBySemanticChannel(rawInfluences, reasonChannelMapping);
    rawNeedAccessByOption.set(option.actionDef.actionKey, rawInfluences);
    rawSumByOption.set(option.actionDef.actionKey, rawSum);
    boundedNeedAccessByOption.set(option.actionDef.actionKey, boundAllChannels(rawSum));

    trace.record(
      'decision_influences_raw_needs_accessibility',
      { optionKey: option.actionDef.actionKey },
      {
        rawInfluences: rawInfluences.map((r) => ({
          source: r.source,
          reasonChannel: r.reasonChannel,
          strength: r.strength.toCanonicalString(),
        })) as any,
      },
    );
  }

  // Step 2: when identity feedback is enabled, decompose each Option's
  // identity pull into ONE raw contribution PER semantic channel (Alignment
  // computed from `boundedNeedAccessByOption` above — never including
  // identity's own contribution) and fold each into the SAME raw pool as
  // that option's own Need/accessibility pressure on that channel, BEFORE
  // the shared bound-and-floor step. This is the actual Phase 2.95
  // mechanism: a weak Need signal and a weak identity signal sharing a
  // semantic channel now get ONE shared chance to clear the floor together,
  // rather than identity being a second, independently-floored influence
  // that can never rescue (or be rescued by) a Need signal too weak on its
  // own — see identity.ts's module comment for the full derivation.
  const influencesByOption = new Map<CanonicalActionKey, DecisionInfluence[]>();
  for (const option of decision.options) {
    const key = option.actionDef.actionKey;
    let fullRaw = rawNeedAccessByOption.get(key)!;
    if (params.decision.identityFeedbackEnabled) {
      const identityRaw = identityFeedbackRawInfluences(
        key,
        boundedNeedAccessByOption,
        state.identityEvidence,
        semanticReasonPolarity,
        params.decision.kI,
      );
      fullRaw = [...fullRaw, ...identityRaw];
    }
    const consolidated = boundAndFloorChannels(sumRawBySemanticChannel(fullRaw, reasonChannelMapping), params.decision.dieScale);
    influencesByOption.set(key, buildConsolidatedInfluences(key, consolidated, key));
  }
  trace.record(
    'decision_influences_consolidated',
    { decisionId: decision.decisionId },
    {
      byOption: decision.options.map((o) => ({
        option: o.actionDef.actionKey,
        influences: influencesByOption.get(o.actionDef.actionKey)!.map((i) => ({
          influenceId: i.influenceId,
          reasonChannel: i.reasonChannel,
          rawStrength: i.rawStrength.toCanonicalString(),
          signedStrength: i.signedStrength.toCanonicalString(),
        })),
      })) as any,
    },
  );

  const resolution = resolveDecision(decision, influencesByOption, params.decision, seed);
  trace.record(
    'decision_resolution',
    { decisionId: decision.decisionId, thetaRoll: params.decision.thetaRoll.toCanonicalString(), thetaPlayer: params.decision.thetaPlayer.toCanonicalString() },
    {
      preRollOptionProbabilities: resolution.preRollOptionProbabilities.map((p) => ({
        option: p.optionKey,
        probability: p.probability.toCanonicalString(),
      })) as any,
      margin: resolution.margin.toCanonicalString(),
      contest: resolution.contest.toCanonicalString(),
      conflictMass: resolution.conflictMass.toCanonicalString(),
      stake: resolution.stake.toCanonicalString(),
      authorshipPotential: resolution.authorshipPotential.toCanonicalString(),
      resolutionMode: resolution.resolutionMode,
      influenceRolls: resolution.influenceRolls.map((r) => ({
        influenceId: r.influenceId,
        option: r.optionKey,
        faces: r.faces,
        sign: r.sign,
        rollValue: r.rollValue,
        signedContribution: r.signedContribution,
      })) as any,
      tieBreak: resolution.tieBreak
        ? {
            candidates: resolution.tieBreak.candidates,
            draw: resolution.tieBreak.draw.toCanonicalString(),
            selected: resolution.tieBreak.selected,
          }
        : null,
      chosenOption: resolution.chosenOption,
    } as any,
  );

  // Identity EXPRESSION (Brief §15-18, the evidence-producing half): reads
  // ONLY `boundedNeedAccessByOption` (Need/accessibility, never identity's
  // own feedback — the no-double-counting rule) and the SAME semantic
  // polarity table used for feedback, so "what did this option's content
  // mean" is a dense, continuous function of the option's own semantic
  // pressure, not something gated by die-eligibility.
  const winner = resolution.chosenOption;
  const channels = touchedChannels(boundedNeedAccessByOption, semanticReasonPolarity);
  const identityExpressions: IdentityExpressionRecord[] = channels.map((channel) => {
    const align = alignment(winner, channel, boundedNeedAccessByOption, semanticReasonPolarity);
    return { channel, alignment: align, expressionStrength: align.mul(resolution.authorshipPotential) };
  });
  trace.record(
    'identity_expression',
    { decisionId: decision.decisionId, chosenOption: winner },
    {
      expressions: identityExpressions.map((e) => ({
        channel: e.channel,
        alignment: e.alignment.toCanonicalString(),
        expressionStrength: e.expressionStrength.toCanonicalString(),
      })) as any,
    },
  );

  // Fold identity expressions into identityEvidence (Brief §19) before the
  // shared tail executes, so `applyChosenAction`'s returned nextState
  // already carries this Decision's identity update.
  let stateWithIdentity = stateForEvaluation;
  for (const expr of identityExpressions) {
    const channel = expr.channel as IdentityExpressionChannelId;
    const prior = getIdentityEvidence(stateWithIdentity, channel);
    const next = updateIdentityEvidence(prior, expr.expressionStrength);
    stateWithIdentity = withIdentityEvidence(stateWithIdentity, channel, next);
  }

  const decisionExpression: DecisionExpression = {
    decisionId: decision.decisionId,
    actor,
    occurredAt: clock.now(),
    chosenOption: resolution.chosenOption,
    resolutionMode: resolution.resolutionMode,
    preRollOptionProbabilities: resolution.preRollOptionProbabilities,
    margin: resolution.margin,
    contest: resolution.contest,
    stake: resolution.stake,
    authorshipPotential: resolution.authorshipPotential,
    influenceRolls: resolution.influenceRolls,
    identityExpressions,
    chosenIntent: resolution.chosenIntent,
  };
  stateWithIdentity = withDecisionExpression(stateWithIdentity, decisionExpression);
  trace.record(
    'decision_expression_recorded',
    {},
    { decisionId: decisionExpression.decisionId, chosenIntent: decisionExpression.chosenIntent },
  );

  // Execute: the winning Option's own ActionDef/WorldOutcomeTable, UNLESS
  // Experiment K's forced-outcome override is supplied — the
  // DecisionExpression above already recorded the chosen INTENT regardless
  // of what physically executes (Brief §14/§18's intent/outcome split).
  const winnerOption = decision.options.find((o) => o.actionDef.actionKey === winner);
  if (!winnerOption) throw new RangeError(`runDecisionCycle: resolved winner ${winner} is not one of this Decision's Options`);
  const executedAction = forcedOutcomeOverride?.actionDef ?? winnerOption.actionDef;
  const executedOutcomeTable = forcedOutcomeOverride?.outcomeTable ?? outcomeTables.get(winner);
  if (!executedOutcomeTable) throw new RangeError(`runDecisionCycle: no WorldOutcomeTable for ${winner}`);

  const event = clock.emit('decision_choice', { actor, decisionId: decision.decisionId });
  const result = applyChosenAction(
    actor,
    stateWithIdentity,
    stateWithIdentity.memory,
    executedAction,
    executedOutcomeTable,
    ctxs,
    experienceContext,
    params,
    event,
    trace,
    seed,
  );

  return {
    ...result,
    distribution: null,
    scoredActions: [],
    activation,
    accessibilityFilter: null,
    retrievedMemories: retrieved,
    decisionExpression,
  };
}
