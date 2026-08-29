/**
 * The cognitive cycle orchestrator — the Phase 1 subset of Brief §25's
 * 20-step authoritative transition cycle. Steps not yet mechanized are
 * listed and explicitly skipped in comments below, rather than silently
 * omitted, so the gap between "full model" and "what Phase 1 actually
 * runs" stays visible in the code itself.
 *
 *  1. Advance analytical Need state                     — needs.ts
 *  2. Apply deterministic world input                    — (no exogenous world events in Phase 1 beyond the acting character's own chosen Action)
 *  3. Construct base cognitive activation                — SKIPPED (Phase 2: needs the associative graph)
 *  4. Solve associative activation                        — SKIPPED (Phase 2)
 *  5. Retrieve memories                                    — SKIPPED (Phase 2)
 *  6. Generate feasible accessible Actions                — actions.ts (precondition only; no accessibility threshold yet)
 *  7. Evaluate Actions                                     — actions.ts (Need term only)
 *  8. Produce Action probability distribution              — choice.ts
 *  9. Select Action using deterministic randomness         — choice.ts
 * 10. Apply deterministic/stochastic world outcome         — outcome.ts
 * 11. Measure Need outcomes                                 — experience.ts
 * 12. Create Experience                                      — experience.ts
 * 13. Update Need-satisfaction expectations                  — expectation.ts
 * 14. Update beliefs from observations                       — SKIPPED (Phase 3)
 * 15. Create episodic Memory                                  — SKIPPED (Phase 2)
 * 16. Update associative structure                            — SKIPPED (Phase 2)
 * 17. Recompute derived Values                                — SKIPPED (Phase 4)
 * 18. Validate invariants                                       — invariants.ts
 * 19. Commit next state                                          — (return value)
 * 20. Emit full causal trace                                      — kernel/trace.ts
 */

import { Rational } from '../kernel/rational';
import { CanonicalActionKey, ConceptKey, NeedId } from '../kernel/canonical';
import { TraceBuilder, CognitiveCycleTrace } from '../kernel/trace';
import { EventClock, SimEvent } from '../kernel/event';
import { CharacterState, advanceAllNeeds, getExpectation, withExpectation, withCurrentTime } from './character';
import { NeedDef, needDeficit, needUrgency } from './needs';
import { ActionDef, NeedContext, ScoredAction, candidateActions, evaluateAction } from './actions';
import { ChoiceParams, buildChoiceDistribution, selectAction, ChoiceDistribution } from './choice';
import { NeedExpectationParams, observationPrecision, updateExpectation } from './expectation';
import { Experience, actualNeedResult } from './experience';
import { WorldOutcomeTable, resolveOutcome } from './outcome';
import { checkInvariants, InvariantViolation } from './invariants';

export interface CycleParams {
  readonly deltaT: Rational;
  readonly choice: ChoiceParams;
  readonly expectation: NeedExpectationParams;
}

export interface CycleResult {
  readonly nextState: CharacterState;
  readonly experience: Experience;
  readonly chosenAction: CanonicalActionKey;
  readonly distribution: ChoiceDistribution | null; // null for forced/scripted cycles
  readonly scoredActions: readonly ScoredAction[];
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

/**
 * Shared tail of the cycle — outcome application through Experience and
 * expectation learning (steps 10–13) plus invariant validation (18) and
 * trace emission (20). Both the autonomous and scripted entry points below
 * funnel into this once "which Action happened" is decided, so the
 * learning math is identical regardless of how the Action was chosen.
 */
function applyChosenAction(
  actor: ConceptKey,
  stateAfterNeedAdvance: CharacterState,
  chosen: ActionDef,
  outcomeTable: WorldOutcomeTable,
  needCtxs: NeedContext[],
  params: CycleParams,
  event: SimEvent,
  trace: TraceBuilder,
  seed: string,
): CycleResult {
  const before = [...stateAfterNeedAdvance.needStates.values()].map((s) => ({ needId: s.needId, level: s.level }));

  const realized = resolveOutcome(outcomeTable, { seed, eventId: event.eventId });

  // Apply realized effects to Need levels (still within this same cycle,
  // after the passive Need advance already applied above).
  let stateAfterOutcome = stateAfterNeedAdvance;
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
    contextConcepts: [],
    location: null,
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
  for (const { def, urgency } of needCtxs) {
    const r = actualNeedResult(experience, def.needId);
    const prior = getExpectation(stateAfterNeedAdvance, chosen.subject, def.needId);
    const rho = observationPrecision(params.expectation, def.coreImportance, urgency);
    const updateResult = updateExpectation(prior, params.expectation, params.deltaT, rho, r, event.occurredAt);
    nextState = withExpectation(nextState, chosen.subject, def.needId, updateResult.next);
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
    distribution: null,
    scoredActions: [],
    trace: trace.build(),
    invariantViolations: violations,
  };
}

/**
 * Full autonomous cycle: the character generates candidates, evaluates
 * them, builds a probability distribution, and selects one via the
 * counter-addressed random oracle. This is "let the character choose."
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

  const candidates = candidateActions(actions, worldFlags);
  trace.record('candidate_actions', { worldFlags: [...worldFlags] }, { candidates: candidates.map((c) => c.actionKey) as any });

  if (candidates.length === 0) {
    throw new RangeError('runAutonomousCycle: no candidate Actions available under current world flags');
  }

  const scored = candidates.map((action) =>
    evaluateAction(action, ctxs, (needId) => getExpectation(advanced, action.subject, needId), params.expectation.kC),
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

  const result = applyChosenAction(actor, advanced, chosen, outcomeTable, ctxs, params, event, trace, seed);
  return { ...result, distribution, scoredActions: scored };
}

export interface IdleTickResult {
  readonly nextState: CharacterState;
  readonly trace: CognitiveCycleTrace;
}

/**
 * Time passing with no Action taken — just step 1 (advance Need state) and
 * step 20 (trace), for the UI's "Advance Time" control. No Experience is
 * created and no expectation learning occurs, since nothing happened for
 * the character to learn from (Brief §11: Experience is tied to an actor's
 * Action).
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
 * but the outcome→Experience→learning tail (steps 10–13, 18, 20) runs
 * identically to the autonomous path.
 */
export function runScriptedExperience(
  actor: ConceptKey,
  state: CharacterState,
  forcedAction: ActionDef,
  outcomeTable: WorldOutcomeTable,
  params: CycleParams,
  clock: EventClock,
  seed: string,
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

  const event = clock.emit('scripted_experience', { actor, action: forcedAction.actionKey });
  const result = applyChosenAction(actor, advanced, forcedAction, outcomeTable, ctxs, params, event, trace, seed);
  return result;
}
