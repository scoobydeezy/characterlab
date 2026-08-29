/**
 * Brief §28–29 Phase-2 experiment: "Substitution — when a habitual target
 * becomes unavailable, does spreading-activation accessibility itself
 * redirect behavior toward a substitute, or does that redirection come
 * entirely from mechanisms Phase 1 already had?"
 *
 * Methodology: run N repeated (scripted) evening visits to Glen from the
 * same starting state used by the Habit experiment, so both
 * NeedExpectation(Glen, Connection) and the Context→Glen association accrue
 * exactly as they do there. Then evaluate the SAME learned state's
 * accessibility-filtered candidate set twice through the real §22 pipeline
 * (`candidateActionsWithAccessibility`) — once with Glen's world flag
 * present, once with it removed — using one shared activation vector
 * computed for both calls.
 *
 * That last point is the whole experiment: `solveActivation`
 * (model/activation.ts) has no world-flags parameter at all — it is a pure
 * function of the character's Needs, active Context concepts, and the
 * learned association graph. World-flag availability only enters the
 * pipeline through `ActionDef.preconditionHolds`, a Phase-1-vintage
 * mechanism candidateActionsWithAccessibility still calls first, unchanged.
 * So the falsifiable prediction is: Priya's own accessibility VALUE must
 * come out bit-for-bit identical whether or not Glen is available, even
 * though Priya's presence in the final *candidate list* is unaffected by
 * Glen's availability either way (her own precondition doesn't reference
 * Glen). What actually changes between the two runs is only whether Glen
 * himself is filtered out before accessibility is even consulted.
 *
 * Expected finding, reported per Brief §36 as DERIVED rather than REQUIRES
 * MECHANISM: any redirection toward a substitute when a habitual target
 * becomes unavailable is fully explained by (a) the precondition filter
 * Phase 1 already had, plus (b) whatever NeedExpectation(Priya, *) Phase 1's
 * independent mechanism has separately learned from Priya's own outcome
 * history (possibly nothing, if Priya has never been visited — see
 * `priyaHasNeverBeenVisited` on the result, which flags exactly that case).
 * Spreading activation and associative accessibility do not implement, and
 * were never asked to implement, "reach for what's still available" —
 * that is a precondition question, not an accessibility question.
 */

import { Rational } from '../kernel/rational';
import { ConceptKey, asConceptKey } from '../kernel/canonical';
import { CharacterState, getExpectation } from '../model/character';
import { ActionDef, AccessibilityFilterResult, candidateActionsWithAccessibility } from '../model/actions';
import { WorldOutcomeTable } from '../model/outcome';
import { CycleParams, ExperienceContext, runScriptedExperience } from '../model/cycle';
import { EventClock } from '../kernel/event';
import { ActivationVector, solveActivation } from '../model/activation';
import { needDeficit, needUrgency } from '../model/needs';

/**
 * Reproduces cognitive-cycle steps 3–4 only (build base activation, solve)
 * against a given state, WITHOUT step 5's memory retrieval — this is a
 * read-only probe for comparison purposes, and running full retrieval here
 * would reinforce memories (mutate retrieval history) for a measurement
 * that isn't supposed to have side effects. model/cycle.ts deliberately
 * keeps its own equivalent (`buildBaseActivation`) private to the module;
 * this local copy is the same three-line formula (Brief §16), not a new
 * mechanism.
 */
function snapshotActivation(
  state: CharacterState,
  activeConcepts: ReadonlySet<ConceptKey>,
  beta: Rational,
): ActivationVector {
  const b = new Map<ConceptKey, Rational>();
  for (const [needId, def] of state.needDefs) {
    const needState = state.needStates.get(needId);
    if (!needState) continue;
    const deficit = needDeficit(needState.level, def.setPoint);
    const urgency = needUrgency(deficit, def.coreImportance, def.urgencyExponent);
    b.set(asConceptKey(needId), urgency);
  }
  for (const c of activeConcepts) b.set(c, Rational.ONE);
  return solveActivation(state.associations, beta, b);
}

export interface SubstitutionComparison {
  readonly priyaActionKey: string;
  readonly priyaAccessibilityGlenAvailable: Rational;
  readonly priyaAccessibilityGlenUnavailable: Rational;
  /** The falsifiable claim this experiment checks. */
  readonly accessibilityIdenticalRegardlessOfGlen: boolean;
  readonly glenAvailableCandidates: AccessibilityFilterResult;
  readonly glenUnavailableCandidates: AccessibilityFilterResult;
  /** Whether Phase 1's independent mechanism has anything at all learned
   * about Priya to offer as a substitution driver — if this is true, any
   * observed "preference" for Priya over baseline once Glen is gone cannot
   * be attributed to Need-satisfaction learning either, sharpening the
   * negative result: nothing in this build implements substitution as its
   * own phenomenon; it is a byproduct of precondition filtering alone. */
  readonly priyaHasNeverBeenVisited: boolean;
}

export interface SubstitutionResult {
  readonly finalState: CharacterState;
  readonly comparison: SubstitutionComparison;
}

export function runSubstitutionExperiment(
  actor: ConceptKey,
  initialState: CharacterState,
  actions: readonly ActionDef[],
  glenAction: ActionDef,
  priyaAction: ActionDef,
  glenOutcome: WorldOutcomeTable,
  params: CycleParams,
  seed: string,
  repetitions: number,
  experienceContext: ExperienceContext,
  worldFlagsGlenAvailable: ReadonlySet<string>,
  worldFlagsGlenUnavailable: ReadonlySet<string>,
): SubstitutionResult {
  const clock = new EventClock();
  let state = initialState;
  for (let i = 0; i < repetitions; i++) {
    clock.advance(1);
    const result = runScriptedExperience(actor, state, glenAction, glenOutcome, params, clock, seed, experienceContext);
    state = result.nextState;
  }

  const activation = snapshotActivation(state, experienceContext.activeConcepts, params.activation.beta);

  const glenAvailableCandidates = candidateActionsWithAccessibility(
    actions,
    worldFlagsGlenAvailable,
    activation,
    params.activation.thetaA,
    params.activation.kA,
  );
  const glenUnavailableCandidates = candidateActionsWithAccessibility(
    actions,
    worldFlagsGlenUnavailable,
    activation,
    params.activation.thetaA,
    params.activation.kA,
  );

  const priyaAvailable = glenAvailableCandidates.evaluated.find((e) => e.actionKey === priyaAction.actionKey);
  const priyaUnavailable = glenUnavailableCandidates.evaluated.find((e) => e.actionKey === priyaAction.actionKey);
  if (!priyaAvailable || !priyaUnavailable) {
    throw new RangeError(
      'runSubstitutionExperiment: priyaAction must satisfy its own precondition under both world-flag sets, or this comparison is not apples-to-apples',
    );
  }

  const priyaExpectation = getExpectation(state, priyaAction.subject, [...state.needDefs.keys()][0]);
  // "Never visited" is really "never observed for ANY Need" — τ stays at
  // its prior-only floor for every Need simultaneously in that case, so
  // checking one Need's confidence-free prior state is representative
  // (initialExpectation's mu=0,tau=0 is what every Need starts at, and
  // nothing but an actual outcome involving Priya as subject ever changes
  // that for any of them).
  const priyaHasNeverBeenVisited = priyaExpectation.tau.equals(Rational.ZERO) && priyaExpectation.mu.equals(Rational.ZERO);

  return {
    finalState: state,
    comparison: {
      priyaActionKey: priyaAction.actionKey,
      priyaAccessibilityGlenAvailable: priyaAvailable.accessibility,
      priyaAccessibilityGlenUnavailable: priyaUnavailable.accessibility,
      accessibilityIdenticalRegardlessOfGlen: priyaAvailable.accessibility.equals(priyaUnavailable.accessibility),
      glenAvailableCandidates,
      glenUnavailableCandidates,
      priyaHasNeverBeenVisited,
    },
  };
}
