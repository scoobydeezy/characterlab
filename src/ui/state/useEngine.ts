/**
 * React orchestration layer around the deterministic kernel/model. Nothing
 * in kernel/ or model/ knows React exists; this hook is the only place
 * that turns "the user clicked a button" into a cycle invocation and
 * stores the result for the UI to render.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { Rational } from '../../kernel/rational';
import { CanonicalActionKey, NeedId } from '../../kernel/canonical';
import { EventClock } from '../../kernel/event';
import { CognitiveCycleTrace, traceHash } from '../../kernel/trace';
import { CharacterState, getExpectation } from '../../model/character';
import { NeedDef } from '../../model/needs';
import { ActionDef } from '../../model/actions';
import { WorldOutcomeTable, ActionEffect } from '../../model/outcome';
import { ChoiceParams } from '../../model/choice';
import { NeedExpectationParams } from '../../model/expectation';
import { CycleParams, CycleResult, runAutonomousCycle, runIdleTick, runScriptedExperience } from '../../model/cycle';
import { Experience } from '../../model/experience';
import {
  ACTION_BETRAYAL_GLEN,
  ACTION_VISIT_GLEN,
  ACTION_VISIT_PRIYA,
  NEED_CONNECTION,
  PERSON_MINA,
  betrayalAction,
  betrayalOutcomeTable,
  createInitialCharacterState,
  defaultActions,
  defaultCycleParams,
  defaultNeedDefs,
  defaultOutcomeTables,
  defaultScenario,
  defaultWorldFlags,
} from '../../model/scenario';
import { runCounterfactual, CounterfactualResult } from '../../experiments/counterfactual';

export type HistoryKind = 'idle' | 'scripted' | 'autonomous' | 'betrayal';

export interface HistoryEntry {
  readonly seq: number;
  readonly tick: number;
  readonly kind: HistoryKind;
  readonly actionKey?: CanonicalActionKey;
  readonly trace: CognitiveCycleTrace;
  readonly experience?: Experience;
  readonly distribution?: CycleResult['distribution'];
}

export interface DeterminismCheckResult {
  readonly pass: boolean;
  readonly hashA: string;
  readonly hashB: string;
  readonly selectedA: CanonicalActionKey;
  readonly selectedB: CanonicalActionKey;
  readonly checkedAtTick: number;
}

export interface EngineSnapshot {
  readonly seed: string;
  readonly needDefs: ReadonlyMap<NeedId, NeedDef>;
  readonly actionDefs: readonly ActionDef[];
  readonly outcomeTables: ReadonlyMap<CanonicalActionKey, WorldOutcomeTable>;
  readonly choiceParams: ChoiceParams;
  readonly expectationParams: NeedExpectationParams;
  readonly deltaT: Rational;
  readonly worldFlags: ReadonlySet<string>;
  readonly character: CharacterState;
  readonly history: readonly HistoryEntry[];
  readonly determinismCheck: DeterminismCheckResult | null;
  readonly counterfactual: CounterfactualResult | null;
}

const HISTORY_LIMIT = 40;

function buildScenarioDefaults() {
  const config = defaultScenario();
  const needDefs = new Map(defaultNeedDefs().map((d) => [d.needId, d]));
  const actionDefs = defaultActions();
  const outcomeTables = defaultOutcomeTables();
  const character = createInitialCharacterState(config);
  return { config, needDefs, actionDefs, outcomeTables, character };
}

export function useEngine() {
  const clockRef = useRef(new EventClock());
  const seqRef = useRef(0);

  const [snapshot, setSnapshot] = useState<EngineSnapshot>(() => {
    const { config, needDefs, actionDefs, outcomeTables, character } = buildScenarioDefaults();
    return {
      seed: config.seed,
      needDefs,
      actionDefs,
      outcomeTables,
      choiceParams: config.cycleParams.choice,
      expectationParams: config.cycleParams.expectation,
      deltaT: config.cycleParams.deltaT,
      worldFlags: defaultWorldFlags(),
      character,
      history: [],
      determinismCheck: null,
      counterfactual: null,
    };
  });

  const cycleParams = useCallback(
    (s: EngineSnapshot): CycleParams => ({
      deltaT: s.deltaT,
      choice: s.choiceParams,
      expectation: s.expectationParams,
    }),
    [],
  );

  const pushHistory = useCallback((entry: Omit<HistoryEntry, 'seq'>) => {
    seqRef.current += 1;
    const withSeq: HistoryEntry = { ...entry, seq: seqRef.current };
    setSnapshot((prev) => ({
      ...prev,
      history: [withSeq, ...prev.history].slice(0, HISTORY_LIMIT),
    }));
  }, []);

  const advanceTime = useCallback(
    (ticks: number) => {
      setSnapshot((prev) => {
        let state = prev.character;
        let lastTrace: CognitiveCycleTrace | null = null;
        for (let i = 0; i < Math.max(1, Math.floor(ticks)); i++) {
          clockRef.current.advance(1);
          const result = runIdleTick(state, cycleParams(prev), clockRef.current);
          state = result.nextState;
          lastTrace = result.trace;
        }
        if (lastTrace) {
          seqRef.current += 1;
          const entry: HistoryEntry = { seq: seqRef.current, tick: clockRef.current.now(), kind: 'idle', trace: lastTrace };
          return { ...prev, character: state, history: [entry, ...prev.history].slice(0, HISTORY_LIMIT) };
        }
        return { ...prev, character: state };
      });
    },
    [cycleParams],
  );

  const triggerScriptedAction = useCallback(
    (actionKey: CanonicalActionKey) => {
      setSnapshot((prev) => {
        const action =
          actionKey === ACTION_BETRAYAL_GLEN ? betrayalAction() : prev.actionDefs.find((a) => a.actionKey === actionKey);
        const outcomeTable = prev.outcomeTables.get(actionKey);
        if (!action || !outcomeTable) return prev;
        clockRef.current.advance(1);
        const result = runScriptedExperience(PERSON_MINA, prev.character, action, outcomeTable, cycleParams(prev), clockRef.current, prev.seed);
        seqRef.current += 1;
        const entry: HistoryEntry = {
          seq: seqRef.current,
          tick: clockRef.current.now(),
          kind: actionKey === ACTION_BETRAYAL_GLEN ? 'betrayal' : 'scripted',
          actionKey,
          trace: result.trace,
          experience: result.experience,
        };
        return { ...prev, character: result.nextState, history: [entry, ...prev.history].slice(0, HISTORY_LIMIT) };
      });
    },
    [cycleParams],
  );

  const runNScriptedSteps = useCallback(
    (actionKey: CanonicalActionKey, n: number) => {
      for (let i = 0; i < Math.max(1, Math.floor(n)); i++) {
        triggerScriptedAction(actionKey);
      }
    },
    [triggerScriptedAction],
  );

  const runAutonomous = useCallback(() => {
    setSnapshot((prev) => {
      const flags = prev.worldFlags;
      clockRef.current.advance(1);
      let result: CycleResult;
      try {
        result = runAutonomousCycle(
          PERSON_MINA,
          prev.character,
          prev.actionDefs,
          flags,
          prev.outcomeTables,
          cycleParams(prev),
          clockRef.current,
          prev.seed,
        );
      } catch (e) {
        return prev; // no candidates available under current world flags
      }
      seqRef.current += 1;
      const entry: HistoryEntry = {
        seq: seqRef.current,
        tick: clockRef.current.now(),
        kind: 'autonomous',
        actionKey: result.chosenAction,
        trace: result.trace,
        experience: result.experience,
        distribution: result.distribution,
      };
      return { ...prev, character: result.nextState, history: [entry, ...prev.history].slice(0, HISTORY_LIMIT) };
    });
  }, [cycleParams]);

  const runDeterminismCheck = useCallback(() => {
    setSnapshot((prev) => {
      const nextTick = clockRef.current.now() + 1;
      const clockA = new EventClock();
      clockA.advanceTo(nextTick);
      const clockB = new EventClock();
      clockB.advanceTo(nextTick);
      const params = cycleParams(prev);
      let runA: CycleResult, runB: CycleResult;
      try {
        runA = runAutonomousCycle(PERSON_MINA, prev.character, prev.actionDefs, prev.worldFlags, prev.outcomeTables, params, clockA, prev.seed);
        runB = runAutonomousCycle(PERSON_MINA, prev.character, prev.actionDefs, prev.worldFlags, prev.outcomeTables, params, clockB, prev.seed);
      } catch {
        return prev;
      }
      const hashA = traceHash(runA.trace);
      const hashB = traceHash(runB.trace);
      const check: DeterminismCheckResult = {
        pass: hashA === hashB && runA.chosenAction === runB.chosenAction,
        hashA,
        hashB,
        selectedA: runA.chosenAction,
        selectedB: runB.chosenAction,
        checkedAtTick: nextTick,
      };
      return { ...prev, determinismCheck: check };
    });
  }, [cycleParams]);

  const runCounterfactualExperiment = useCallback(
    (steps: number) => {
      setSnapshot((prev) => {
        const glen = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
        const priya = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_PRIYA)!;
        const glenTable = prev.outcomeTables.get(ACTION_VISIT_GLEN)!;
        const priyaTable = prev.outcomeTables.get(ACTION_VISIT_PRIYA)!;
        const result = runCounterfactual(
          PERSON_MINA,
          prev.character,
          NEED_CONNECTION,
          glen,
          glenTable,
          priya,
          priyaTable,
          cycleParams(prev),
          prev.seed,
          Math.max(1, Math.floor(steps)),
        );
        return { ...prev, counterfactual: result };
      });
    },
    [cycleParams],
  );

  const reset = useCallback(() => {
    setSnapshot((prev) => {
      const config = { ...defaultScenario(prev.seed), cycleParams: cycleParams(prev) };
      const character = createInitialCharacterState({ ...config, needDefs: [...prev.needDefs.values()] });
      clockRef.current = new EventClock();
      seqRef.current = 0;
      return { ...prev, character, history: [], determinismCheck: null, counterfactual: null };
    });
  }, [cycleParams]);

  const setSeed = useCallback((seed: string) => {
    setSnapshot((prev) => ({ ...prev, seed }));
  }, []);

  const toggleWorldFlag = useCallback((flag: string) => {
    setSnapshot((prev) => {
      const next = new Set(prev.worldFlags);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return { ...prev, worldFlags: next };
    });
  }, []);

  const updateNeedDef = useCallback((needId: NeedId, patch: Partial<Omit<NeedDef, 'needId' | 'origin'>>) => {
    setSnapshot((prev) => {
      const existing = prev.needDefs.get(needId);
      if (!existing) return prev;
      const next = new Map(prev.needDefs);
      next.set(needId, { ...existing, ...patch });
      return { ...prev, needDefs: next };
    });
  }, []);

  const updateOutcomeEffect = useCallback(
    (actionKey: CanonicalActionKey, needId: NeedId, patch: Partial<Pick<ActionEffect, 'magnitude' | 'noiseHalfWidth'>>) => {
      setSnapshot((prev) => {
        const table = prev.outcomeTables.get(actionKey);
        if (!table) return prev;
        const nextEffects = table.effects.map((e) => (e.needId === needId ? { ...e, ...patch } : e));
        const nextTables = new Map(prev.outcomeTables);
        nextTables.set(actionKey, { ...table, effects: nextEffects });
        return { ...prev, outcomeTables: nextTables };
      });
    },
    [],
  );

  const updateChoiceParams = useCallback((patch: Partial<ChoiceParams>) => {
    setSnapshot((prev) => ({ ...prev, choiceParams: { ...prev.choiceParams, ...patch } }));
  }, []);

  const updateExpectationParams = useCallback((patch: Partial<NeedExpectationParams>) => {
    setSnapshot((prev) => ({ ...prev, expectationParams: { ...prev.expectationParams, ...patch } }));
  }, []);

  const updateDeltaT = useCallback((deltaT: Rational) => {
    setSnapshot((prev) => ({ ...prev, deltaT }));
  }, []);

  const currentTick = () => clockRef.current.now();

  return useMemo(
    () => ({
      snapshot,
      currentTick,
      advanceTime,
      triggerScriptedAction,
      runNScriptedSteps,
      runAutonomous,
      runDeterminismCheck,
      runCounterfactualExperiment,
      reset,
      setSeed,
      toggleWorldFlag,
      updateNeedDef,
      updateOutcomeEffect,
      updateChoiceParams,
      updateExpectationParams,
      updateDeltaT,
      getExpectation: (subject: Parameters<typeof getExpectation>[1], needId: NeedId) => getExpectation(snapshot.character, subject, needId),
    }),
    [
      snapshot,
      advanceTime,
      triggerScriptedAction,
      runNScriptedSteps,
      runAutonomous,
      runDeterminismCheck,
      runCounterfactualExperiment,
      reset,
      setSeed,
      toggleWorldFlag,
      updateNeedDef,
      updateOutcomeEffect,
      updateChoiceParams,
      updateExpectationParams,
      updateDeltaT,
    ],
  );
}

export type Engine = ReturnType<typeof useEngine>;
