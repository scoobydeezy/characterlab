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
import { CharacterState, advanceAllNeeds, getExpectation, withExpectation, withCurrentTime, withAssociations, withMemory } from './character';
import { NeedDef, needDeficit, needUrgency } from './needs';
import { ActionDef, NeedContext, ScoredAction, candidateActionsWithAccessibility, AccessibilityFilterResult, evaluateAction } from './actions';
import { ChoiceParams, buildChoiceDistribution, selectAction, ChoiceDistribution } from './choice';
import { NeedExpectationParams, observationPrecision, updateExpectation } from './expectation';
import { Experience, actualNeedResult } from './experience';
import { WorldOutcomeTable, resolveOutcome } from './outcome';
import { checkInvariants, InvariantViolation } from './invariants';
import { ActivationVector, ActivationParams, solveActivation } from './activation';
import { AssociationLearningParams, updateAssociations } from './associations';
import { MemoryCycleParams, NeedOutcomeRecord, PredictionErrorRecord, ScoredMemory, createMemory, addMemory, retrieveTopK } from './memory';

export interface CycleParams {
  readonly deltaT: Rational;
  readonly choice: ChoiceParams;
  readonly expectation: NeedExpectationParams;
  readonly activation: ActivationParams;
  readonly associationLearning: AssociationLearningParams;
  readonly memoryParams: MemoryCycleParams;
}

/** What's "in the air" for this cycle beyond Needs and the acting
 * character herself — which Context concepts are currently active (e.g.
 * "is it evening") and which Location the Experience happens at. Optional
 * everywhere it's threaded through; omitting it reproduces exactly the
 * Phase-1 behavior (no context, no location) for existing call sites. */
export interface ExperienceContext {
  readonly activeConcepts: ReadonlySet<ConceptKey>;
  readonly location: ConceptKey | null;
}

export const EMPTY_EXPERIENCE_CONTEXT: ExperienceContext = { activeConcepts: new Set(), location: null };

export interface CycleResult {
  readonly nextState: CharacterState;
  readonly experience: Experience;
  readonly chosenAction: CanonicalActionKey;
  readonly distribution: ChoiceDistribution | null; // null for forced/scripted cycles
  readonly scoredActions: readonly ScoredAction[];
  readonly activation: ActivationVector;
  readonly accessibilityFilter: AccessibilityFilterResult | null; // null for scripted cycles (no filtering applied)
  readonly retrievedMemories: readonly ScoredMemory[];
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
function applyChosenAction(
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
  // after the passive Need advance already applied above).
  let stateAfterOutcome: CharacterState = { ...stateAfterNeedAdvance, memory: memoryStoreAfterRetrieval };
  for (const eff of realized) {
    const current = stateAfterOutcome.needStates.get(eff.needId);
    if (!current) continue;
    const raw = current.level.add(eff.realized).clamp(Rational.ZERO, Rational.ONE);
    const nextStates = new Map(stateAfterOutcome.needStates);
    nextStates.set(eff.needId, { needId: eff.needId, level: raw });
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
  for (const { def, urgency } of needCtxs) {
    const r = actualNeedResult(experience, def.needId);
    const prior = getExpectation(stateAfterNeedAdvance, chosen.subject, def.needId);
    const rho = observationPrecision(params.expectation, def.coreImportance, urgency);
    const updateResult = updateExpectation(prior, params.expectation, params.deltaT, rho, r, event.occurredAt);
    nextState = withExpectation(nextState, chosen.subject, def.needId, updateResult.next);
    needOutcomes.push({ needId: def.needId, result: r });
    predictionErrors.push({ subject: chosen.subject, needId: def.needId, error: r.sub(prior.mu) });
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
      },
      {
        mu: updateResult.next.mu.toCanonicalString(),
        tau: updateResult.next.tau.toCanonicalString(),
      },
    );
  }

  // Step 15: create episodic Memory. Semantic concepts are exactly the
  // concepts this Experience actually engaged: the Action itself, its
  // subject, its Location (if any), and whatever Context was active.
  const semanticConcepts: ConceptKey[] = [asConceptKey(chosen.actionKey), chosen.subject];
  if (experienceContext.location) semanticConcepts.push(experienceContext.location);
  semanticConcepts.push(...experienceContext.activeConcepts);

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
  // (Brief §14). z_i = 1 for exactly the concepts this Experience engaged;
  // 0 elsewhere. Needs are deliberately excluded from this Hebbian
  // co-activation set (see model/associations.ts's module comment).
  const experienceActivation = new Map<ConceptKey, Rational>();
  for (const c of semanticConcepts) experienceActivation.set(c, Rational.ONE);
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
