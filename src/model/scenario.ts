/**
 * Default Phase 1 scenario: Mina, a Connection Need, and two candidate
 * relationships (Glen, Priya) plus a always-available baseline Action —
 * enough to run Brief §28's primary Phase-1 experiment ("Mina learns Glen
 * reliably satisfies Connection") and its §29 paired counterfactual
 * (identical setup, Priya instead of Glen).
 *
 * All authored constants here are research knobs, not claims — the UI
 * exposes every one of them as a slider so a user can re-run the
 * experiment under different assumptions rather than trusting these
 * defaults.
 */

import { Rational, ratOf } from '../kernel/rational';
import { needId, conceptKey, canonicalActionKey, NeedId, ConceptKey, CanonicalActionKey } from '../kernel/canonical';
import { NeedDef } from './needs';
import { ActionDef } from './actions';
import { WorldOutcomeTable } from './outcome';
import { CharacterState, createCharacter } from './character';
import { ChoiceParams } from './choice';
import { NeedExpectationParams } from './expectation';
import { CycleParams } from './cycle';
import { EventClock } from '../kernel/event';

export const NEED_CONNECTION: NeedId = needId('need.connection');
export const NEED_REST: NeedId = needId('need.rest');

export const PERSON_MINA: ConceptKey = conceptKey('person.mina');
export const PERSON_GLEN: ConceptKey = conceptKey('person.glen');
export const PERSON_PRIYA: ConceptKey = conceptKey('person.priya');
export const ACTIVITY_STAY_HOME: ConceptKey = conceptKey('activity.stay_home');

export const ACTION_VISIT_GLEN: CanonicalActionKey = canonicalActionKey('action.visit_glen');
export const ACTION_VISIT_PRIYA: CanonicalActionKey = canonicalActionKey('action.visit_priya');
export const ACTION_STAY_HOME: CanonicalActionKey = canonicalActionKey('action.stay_home');
/** Not a candidate in ordinary choice (Mina does not "choose" to be
 * betrayed) — triggered only as a scripted UI event, per Brief §28's
 * "Betrayal: A high-confidence positive expectation receives sharply
 * negative evidence." Shares Glen's `subject` so it lands on the exact
 * same NeedExpectation(person.glen, *) entries ordinary visits built up. */
export const ACTION_BETRAYAL_GLEN: CanonicalActionKey = canonicalActionKey('action.betrayal_glen');

export const WORLD_FLAG_GLEN_AVAILABLE = 'glen_available';
export const WORLD_FLAG_PRIYA_AVAILABLE = 'priya_available';

export interface ScenarioConfig {
  readonly seed: string;
  readonly needDefs: readonly NeedDef[];
  readonly actions: readonly ActionDef[];
  readonly outcomeTables: ReadonlyMap<CanonicalActionKey, WorldOutcomeTable>;
  readonly cycleParams: CycleParams;
}

export function defaultNeedDefs(): NeedDef[] {
  return [
    {
      needId: NEED_CONNECTION,
      origin: 'Core',
      setPoint: ratOf(4, 5), // 0.8
      coreImportance: ratOf(1),
      // Deliberately set equal to Glen's outcome magnitude (see
      // defaultOutcomeTables): this keeps repeated visits from marching the
      // Level into the [0,1] ceiling clamp (Brief §10), which would
      // otherwise attenuate the *observed* r_n on later repetitions and
      // bias learned mu downward for reasons that have nothing to do with
      // the phenomenon under study. A smaller decay is a legitimate and
      // interesting scenario to try from the UI (satiation/ceiling effects
      // are a real, if secondary, research question) — this default just
      // isn't fighting the primary experiment's own instrumentation.
      passiveRate: ratOf(-2, 5), // -0.40 per tick
      urgencyExponent: 2,
    },
    {
      needId: NEED_REST,
      origin: 'Core',
      setPoint: ratOf(7, 10), // 0.7
      coreImportance: ratOf(3, 5), // 0.6 — matters, but less than Connection
      passiveRate: ratOf(-1, 25), // -0.04 per tick
      urgencyExponent: 2,
    },
  ];
}

export function defaultActions(): ActionDef[] {
  return [
    {
      actionKey: ACTION_VISIT_GLEN,
      displayName: 'Visit Glen',
      subject: PERSON_GLEN,
      preconditionHolds: (flags) => flags.has(WORLD_FLAG_GLEN_AVAILABLE),
    },
    {
      actionKey: ACTION_VISIT_PRIYA,
      displayName: 'Visit Priya',
      subject: PERSON_PRIYA,
      preconditionHolds: (flags) => flags.has(WORLD_FLAG_PRIYA_AVAILABLE),
    },
    {
      actionKey: ACTION_STAY_HOME,
      displayName: 'Stay Home',
      subject: ACTIVITY_STAY_HOME,
      preconditionHolds: () => true,
    },
  ];
}

export function betrayalAction(): ActionDef {
  return {
    actionKey: ACTION_BETRAYAL_GLEN,
    displayName: 'Betrayal (Glen)',
    subject: PERSON_GLEN,
    preconditionHolds: () => true,
  };
}

export function betrayalOutcomeTable(): WorldOutcomeTable {
  return {
    actionKey: ACTION_BETRAYAL_GLEN,
    effects: [{ needId: NEED_CONNECTION, magnitude: ratOf(-9, 10), noiseHalfWidth: ratOf(0) }], // -0.90, no noise: a single sharp, unambiguous betrayal
  };
}

export function defaultOutcomeTables(): Map<CanonicalActionKey, WorldOutcomeTable> {
  const m = new Map<CanonicalActionKey, WorldOutcomeTable>();
  m.set(ACTION_VISIT_GLEN, {
    actionKey: ACTION_VISIT_GLEN,
    effects: [
      { needId: NEED_CONNECTION, magnitude: ratOf(2, 5), noiseHalfWidth: ratOf(1, 20) }, // 0.40 ± 0.05
      { needId: NEED_REST, magnitude: ratOf(-1, 20), noiseHalfWidth: ratOf(1, 50) }, // -0.02 ± 0.02 (visiting is a little tiring)
    ],
  });
  m.set(ACTION_VISIT_PRIYA, {
    actionKey: ACTION_VISIT_PRIYA,
    effects: [
      { needId: NEED_CONNECTION, magnitude: ratOf(3, 20), noiseHalfWidth: ratOf(1, 20) }, // 0.15 ± 0.05 — weaker than Glen, initially
      { needId: NEED_REST, magnitude: ratOf(1, 50), noiseHalfWidth: ratOf(1, 100) }, // +0.02 — low-key, restful
    ],
  });
  m.set(ACTION_STAY_HOME, {
    actionKey: ACTION_STAY_HOME,
    effects: [{ needId: NEED_REST, magnitude: ratOf(1, 10), noiseHalfWidth: ratOf(1, 50) }], // +0.10 ± 0.02
  });
  m.set(ACTION_BETRAYAL_GLEN, betrayalOutcomeTable());
  return m;
}

export function defaultChoiceParams(): ChoiceParams {
  return { epsilon: ratOf(1, 2), gamma: 3 };
}

export function defaultExpectationParams(): NeedExpectationParams {
  return {
    lambdaQ: ratOf(1, 50), // slow passive precision decay
    rho0: ratOf(2),
    sigma: ratOf(1),
    rhoMin: ratOf(1, 10),
    rhoMax: ratOf(20),
    kC: ratOf(3),
  };
}

export function defaultCycleParams(): CycleParams {
  return {
    deltaT: ratOf(1),
    choice: defaultChoiceParams(),
    expectation: defaultExpectationParams(),
  };
}

export function defaultScenario(seed = 'characterlab-default-seed'): ScenarioConfig {
  return {
    seed,
    needDefs: defaultNeedDefs(),
    actions: defaultActions(),
    outcomeTables: defaultOutcomeTables(),
    cycleParams: defaultCycleParams(),
  };
}

export function createInitialCharacterState(config: ScenarioConfig): CharacterState {
  const initialLevels = new Map<NeedId, Rational>([
    [NEED_CONNECTION, ratOf(1, 2)], // starts moderately unsatisfied
    [NEED_REST, ratOf(6, 10)],
  ]);
  return createCharacter(PERSON_MINA, config.needDefs, initialLevels);
}

export function defaultWorldFlags(): Set<string> {
  return new Set([WORLD_FLAG_GLEN_AVAILABLE, WORLD_FLAG_PRIYA_AVAILABLE]);
}

export function createEventClock(): EventClock {
  return new EventClock();
}
