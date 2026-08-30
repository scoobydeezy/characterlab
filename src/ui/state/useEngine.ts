/**
 * React orchestration layer around the deterministic kernel/model. Nothing
 * in kernel/ or model/ knows React exists; this hook is the only place
 * that turns "the user clicked a button" into a cycle invocation and
 * stores the result for the UI to render.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { Rational, ratOf } from '../../kernel/rational';
import { CanonicalActionKey, NeedId } from '../../kernel/canonical';
import { EventClock } from '../../kernel/event';
import { CognitiveCycleTrace, traceHash } from '../../kernel/trace';
import { CharacterState, getExpectation } from '../../model/character';
import { NeedDef } from '../../model/needs';
import { ActionDef, AccessibilityFilterResult } from '../../model/actions';
import { WorldOutcomeTable, ActionEffect } from '../../model/outcome';
import { ChoiceParams } from '../../model/choice';
import { NeedExpectationParams } from '../../model/expectation';
import { ActivationParams, ActivationVector } from '../../model/activation';
import { AssociationLearningParams } from '../../model/associations';
import { MemoryCycleParams, ScoredMemory } from '../../model/memory';
import { CycleParams, CycleResult, ExperienceContext, SaturationAnalysisEntry, SaturationParams, runAutonomousCycle, runIdleTick, runScriptedExperience } from '../../model/cycle';
import { DecisionParams } from '../../model/decision';
import { runExperimentA_ResidualUncertainty, ExperimentAResult, runExperimentB_ObviousChoice, ExperimentBResult, runExperimentC_TrivialUncertainty, ExperimentCResult, runExperimentD_MeaningfulConflict, ExperimentDResult, runExperimentK_IntentVersusOutcome, ExperimentKResult } from '../../experiments/decisionResolution';
import { runExperimentE_TraitAcquisition, ExperimentEResult, runExperimentG_IdentityFeedback, ExperimentGResult, runExperimentH_SelfStabilization, ExperimentHResult, runExperimentI_IdentityFaultLine, ExperimentIResult, runExperimentJ_Contradiction, ExperimentJResult } from '../../experiments/identityFormation';
import { runExperimentF_SeedDivergence, SeedDivergenceResult } from '../../experiments/seedDivergence';
import {
  runExperimentGradualIdentityInfluence,
  ExperimentGradualIdentityInfluenceResult,
  runExperimentWeakSignalCombination,
  ExperimentWeakSignalCombinationResult,
  runExperimentRealFaultLine,
  ExperimentRealFaultLineResult,
  runExperimentTransformationWithFeedback,
  ExperimentTransformationWithFeedbackResult,
  runExperimentCanonicalAcquisitionWithFeedback,
  ExperimentCanonicalAcquisitionWithFeedbackResult,
} from '../../experiments/reasonConsolidation';
import { SalienceParams, SemanticSalienceResult } from '../../model/salience';
import { Experience } from '../../model/experience';
import {
  ACTION_BETRAYAL_GLEN,
  ACTION_STAY_HOME,
  ACTION_VISIT_GLEN,
  ACTION_VISIT_PRIYA,
  NEED_CONNECTION,
  NEED_REST,
  PERSON_MINA,
  WORLD_FLAG_GLEN_AVAILABLE,
  aversiveOutcomeTable,
  betrayalAction,
  betrayalOutcomeTable,
  conceptUniverse,
  createInitialCharacterState,
  defaultActions,
  defaultActivationParams,
  defaultAssociationLearningParams,
  defaultCycleParams,
  defaultDecisionParams,
  defaultExperienceContext,
  defaultMemoryParams,
  defaultNeedDefs,
  defaultOutcomeTables,
  defaultSaturationParams,
  defaultSalienceParams,
  defaultScenario,
  defaultWorldFlags,
} from '../../model/scenario';
import { runCounterfactual, CounterfactualResult } from '../../experiments/counterfactual';
import { runHabitExperiment, HabitExperimentResult } from '../../experiments/habit';
import { runSubstitutionExperiment, SubstitutionResult } from '../../experiments/substitution';
import { runAvoidanceExperiment, AvoidanceResult } from '../../experiments/avoidance';
import { runMemoryAccessibilityExperiment, MemoryAccessibilityResult } from '../../experiments/memoryAccessibility';
import { runSaturatedSatisfactionExperiment, SaturatedSatisfactionResult } from '../../experiments/saturatedSatisfaction';
import { runSaturationCounterfactual, SaturationCounterfactualResult } from '../../experiments/saturationCounterfactual';
import { runAllSemanticSalienceScenarios } from '../../experiments/semanticSalience';

/** Aggregate result shape for the UI's "run all six scenarios" button —
 * mirrors runAllSemanticSalienceScenarios's own return shape. */
export type SemanticSalienceScenarioSuite = ReturnType<typeof runAllSemanticSalienceScenarios>;

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
  readonly activationParams: ActivationParams;
  readonly associationLearningParams: AssociationLearningParams;
  readonly memoryParams: MemoryCycleParams;
  readonly saturationParams: SaturationParams;
  readonly salienceMode: 'legacy' | 'derived';
  readonly salienceParams: SalienceParams;
  /** Phase 2.9 — present on every snapshot regardless of whether a
   * Decision has ever been run, mirroring `saturationParams`/
   * `salienceParams` already being unconditionally present. */
  readonly decisionParams: DecisionParams;
  readonly deltaT: Rational;
  readonly worldFlags: ReadonlySet<string>;
  readonly eveningActive: boolean;
  readonly character: CharacterState;
  readonly history: readonly HistoryEntry[];
  readonly determinismCheck: DeterminismCheckResult | null;
  readonly counterfactual: CounterfactualResult | null;
  readonly lastActivation: ActivationVector | null;
  readonly lastAccessibilityFilter: AccessibilityFilterResult | null;
  readonly lastRetrievedMemories: readonly ScoredMemory[];
  readonly lastSaturationAnalysis: readonly SaturationAnalysisEntry[];
  readonly lastSemanticSalience: SemanticSalienceResult | null;
  readonly semanticSalienceScenarioResult: SemanticSalienceScenarioSuite | null;
  readonly habitResult: HabitExperimentResult | null;
  readonly substitutionResult: SubstitutionResult | null;
  readonly avoidanceResult: AvoidanceResult | null;
  readonly memoryAccessibilityResult: MemoryAccessibilityResult | null;
  readonly saturatedSatisfactionResult: SaturatedSatisfactionResult | null;
  readonly saturationCounterfactualResult: SaturationCounterfactualResult | null;
  /** Phase 2.9 — Brief §30's required Decision/Identity experiment suite.
   * Optional, absent until the corresponding button is pressed (mirrors
   * `lastSemanticSalience`-style optional-until-run fields elsewhere in this
   * snapshot, kept `?:` rather than `| null` since there is no meaningful
   * "explicitly cleared" state distinct from "never run"). */
  readonly expAResult?: ExperimentAResult;
  readonly expBResult?: ExperimentBResult;
  readonly expCResult?: ExperimentCResult;
  readonly expDResult?: ExperimentDResult;
  readonly expKResult?: ExperimentKResult;
  readonly expEResult?: ExperimentEResult;
  readonly expGResult?: ExperimentGResult;
  readonly expHResult?: ExperimentHResult;
  readonly expIResult?: ExperimentIResult;
  readonly expJResult?: ExperimentJResult;
  readonly expFResult?: SeedDivergenceResult;
  /** Phase 2.95 — the external review's five reason-consolidation target
   * behaviors (experiments/reasonConsolidation.ts), same optional-until-run
   * convention as the Phase 2.9 experiment fields above. */
  readonly targetAResult?: ExperimentGradualIdentityInfluenceResult;
  readonly targetBResult?: ExperimentWeakSignalCombinationResult;
  readonly targetCResult?: ExperimentRealFaultLineResult;
  readonly targetDResult?: ExperimentTransformationWithFeedbackResult;
  readonly targetEResult?: ExperimentCanonicalAcquisitionWithFeedbackResult;
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
      activationParams: config.cycleParams.activation,
      associationLearningParams: config.cycleParams.associationLearning,
      memoryParams: config.cycleParams.memoryParams,
      saturationParams: config.cycleParams.saturation,
      salienceMode: config.cycleParams.salienceMode,
      salienceParams: config.cycleParams.salience,
      decisionParams: config.cycleParams.decision,
      deltaT: config.cycleParams.deltaT,
      worldFlags: defaultWorldFlags(),
      eveningActive: false,
      character,
      history: [],
      determinismCheck: null,
      counterfactual: null,
      lastActivation: null,
      lastAccessibilityFilter: null,
      lastRetrievedMemories: [],
      lastSaturationAnalysis: [],
      lastSemanticSalience: null,
      semanticSalienceScenarioResult: null,
      habitResult: null,
      substitutionResult: null,
      avoidanceResult: null,
      memoryAccessibilityResult: null,
      saturatedSatisfactionResult: null,
      saturationCounterfactualResult: null,
    };
  });

  const cycleParams = useCallback(
    (s: EngineSnapshot): CycleParams => ({
      deltaT: s.deltaT,
      choice: s.choiceParams,
      expectation: s.expectationParams,
      activation: s.activationParams,
      associationLearning: s.associationLearningParams,
      memoryParams: s.memoryParams,
      saturation: s.saturationParams,
      salienceMode: s.salienceMode,
      salience: s.salienceParams,
      decision: s.decisionParams,
    }),
    [],
  );

  const experienceContext = useCallback((s: EngineSnapshot): ExperienceContext => defaultExperienceContext(s.eveningActive), []);

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
        const result = runScriptedExperience(
          PERSON_MINA,
          prev.character,
          action,
          outcomeTable,
          cycleParams(prev),
          clockRef.current,
          prev.seed,
          experienceContext(prev),
        );
        seqRef.current += 1;
        const entry: HistoryEntry = {
          seq: seqRef.current,
          tick: clockRef.current.now(),
          kind: actionKey === ACTION_BETRAYAL_GLEN ? 'betrayal' : 'scripted',
          actionKey,
          trace: result.trace,
          experience: result.experience,
        };
        return {
          ...prev,
          character: result.nextState,
          history: [entry, ...prev.history].slice(0, HISTORY_LIMIT),
          lastActivation: result.activation,
          lastRetrievedMemories: result.retrievedMemories,
          lastSaturationAnalysis: result.saturationAnalysis,
          lastSemanticSalience: result.semanticSalience,
        };
      });
    },
    [cycleParams, experienceContext],
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
          experienceContext(prev),
        );
      } catch (e) {
        return prev; // no candidates available under current world flags / accessibility threshold
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
      return {
        ...prev,
        character: result.nextState,
        history: [entry, ...prev.history].slice(0, HISTORY_LIMIT),
        lastActivation: result.activation,
        lastAccessibilityFilter: result.accessibilityFilter,
        lastRetrievedMemories: result.retrievedMemories,
        lastSaturationAnalysis: result.saturationAnalysis,
        lastSemanticSalience: result.semanticSalience,
      };
    });
  }, [cycleParams, experienceContext]);

  const runDeterminismCheck = useCallback(() => {
    setSnapshot((prev) => {
      const nextTick = clockRef.current.now() + 1;
      const clockA = new EventClock();
      clockA.advanceTo(nextTick);
      const clockB = new EventClock();
      clockB.advanceTo(nextTick);
      const params = cycleParams(prev);
      const ctx = experienceContext(prev);
      let runA: CycleResult, runB: CycleResult;
      try {
        runA = runAutonomousCycle(PERSON_MINA, prev.character, prev.actionDefs, prev.worldFlags, prev.outcomeTables, params, clockA, prev.seed, ctx);
        runB = runAutonomousCycle(PERSON_MINA, prev.character, prev.actionDefs, prev.worldFlags, prev.outcomeTables, params, clockB, prev.seed, ctx);
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
  }, [cycleParams, experienceContext]);

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

  /**
   * The four Phase-2 experiments below are read-only probes, exactly like
   * runCounterfactualExperiment above: they explore "what would happen
   * from here" starting at the CURRENT visible character state, but never
   * assign a result back into `character` — the main timeline is
   * untouched. Habit and Substitution force `eveningActive: true` for
   * their own run regardless of the live toggle, since both experiments'
   * entire point depends on the evening Context being active (see their
   * own module docs) — leaving them at the mercy of a toggle the user
   * might have forgotten to flip would make "nothing happened" the most
   * likely outcome of pressing the button.
   */
  const runHabitExperimentUI = useCallback(
    (repetitions: number) => {
      setSnapshot((prev) => {
        const glen = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
        const glenOutcome = prev.outcomeTables.get(ACTION_VISIT_GLEN)!;
        const result = runHabitExperiment(
          PERSON_MINA,
          prev.character,
          glen,
          glenOutcome,
          cycleParams(prev),
          prev.seed,
          Math.max(1, Math.floor(repetitions)),
        );
        return { ...prev, habitResult: result };
      });
    },
    [cycleParams],
  );

  const runSubstitutionExperimentUI = useCallback(
    (repetitions: number) => {
      setSnapshot((prev) => {
        const glen = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
        const priya = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_PRIYA)!;
        const glenOutcome = prev.outcomeTables.get(ACTION_VISIT_GLEN)!;
        const worldFlagsGlenAvailable = new Set([...prev.worldFlags, WORLD_FLAG_GLEN_AVAILABLE]);
        const worldFlagsGlenUnavailable = new Set([...prev.worldFlags].filter((f) => f !== WORLD_FLAG_GLEN_AVAILABLE));
        const result = runSubstitutionExperiment(
          PERSON_MINA,
          prev.character,
          prev.actionDefs,
          glen,
          priya,
          glenOutcome,
          cycleParams(prev),
          prev.seed,
          Math.max(1, Math.floor(repetitions)),
          defaultExperienceContext(true),
          worldFlagsGlenAvailable,
          worldFlagsGlenUnavailable,
        );
        return { ...prev, substitutionResult: result };
      });
    },
    [cycleParams],
  );

  const runAvoidanceExperimentUI = useCallback(
    (repetitions: number) => {
      setSnapshot((prev) => {
        const glen = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
        const stayHome = prev.actionDefs.find((a) => a.actionKey === ACTION_STAY_HOME)!;
        const result = runAvoidanceExperiment(
          PERSON_MINA,
          prev.character,
          glen,
          aversiveOutcomeTable(),
          stayHome,
          NEED_REST,
          cycleParams(prev),
          prev.seed,
          Math.max(1, Math.floor(repetitions)),
        );
        return { ...prev, avoidanceResult: result };
      });
    },
    [cycleParams],
  );

  const runMemoryAccessibilityExperimentUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, memoryAccessibilityResult: runMemoryAccessibilityExperiment(prev.memoryParams) }));
  }, []);

  /**
   * Phase 2.5a — Brief §21's sweep: fixed satisfier (ACTION_VISIT_GLEN's
   * existing +0.40 Connection effect — the same "true effect" Phase 0-2
   * already established, not a new authored number), Need-before Level
   * swept across the boundary. Read-only probe, exactly like the four
   * Phase-2 experiments above.
   */
  const runSaturatedSatisfactionExperimentUI = useCallback(() => {
    setSnapshot((prev) => {
      const glen = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
      const stayHome = prev.actionDefs.find((a) => a.actionKey === ACTION_STAY_HOME)!;
      const glenOutcome = prev.outcomeTables.get(ACTION_VISIT_GLEN)!;
      const levels = [ratOf(1, 10), ratOf(4, 10), ratOf(7, 10), ratOf(9, 10), ratOf(1)];
      const result = runSaturatedSatisfactionExperiment(
        PERSON_MINA,
        prev.character,
        glen,
        glenOutcome,
        stayHome,
        NEED_CONNECTION,
        levels,
        cycleParams(prev),
        prev.seed,
      );
      return { ...prev, saturatedSatisfactionResult: result };
    });
  }, [cycleParams]);

  /**
   * Phase 2.5a — Brief §22's required counterfactual: Timeline A (mostly
   * low Connection) vs. Timeline B (mostly near-saturation, with one
   * deliberate dip — see saturationCounterfactual.ts's module comment for
   * why "mostly, not always" matters), same satisfier, same true effect.
   */
  const runSaturationCounterfactualUI = useCallback(() => {
    setSnapshot((prev) => {
      const glen = prev.actionDefs.find((a) => a.actionKey === ACTION_VISIT_GLEN)!;
      const glenOutcome = prev.outcomeTables.get(ACTION_VISIT_GLEN)!;
      const timelineA = [ratOf(1, 10), ratOf(15, 100), ratOf(1, 10), ratOf(2, 10), ratOf(1, 10), ratOf(15, 100)];
      const timelineB = [ratOf(17, 20), ratOf(9, 10), ratOf(17, 20), ratOf(1, 2), ratOf(22, 25), ratOf(17, 20)];
      const result = runSaturationCounterfactual(
        PERSON_MINA,
        prev.character,
        glen,
        glenOutcome,
        NEED_CONNECTION,
        timelineA,
        timelineB,
        cycleParams(prev),
        prev.seed,
      );
      return { ...prev, saturationCounterfactualResult: result };
    });
  }, [cycleParams]);

  /** Phase 2.5b — Brief §13's six required Semantic Footprint scenarios,
   * run directly against `computeSemanticSalience` (see
   * experiments/semanticSalience.ts's module comment for why these are
   * standalone salience computations rather than full cycles). */
  const runSemanticSalienceExperimentsUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, semanticSalienceScenarioResult: runAllSemanticSalienceScenarios(prev.salienceParams) }));
  }, []);

  /**
   * Phase 2.9 — Brief §30's eleven required Decision/Identity/Seed-
   * divergence experiments (Experiments A-K). Every one of these, like the
   * Phase-2 and Phase-2.5a experiments above, is a self-contained read-only
   * probe: each function below builds its own `defaultDecisionScenario()`
   * baseline internally and takes no arguments from the live engine
   * snapshot (unlike e.g. `runHabitExperimentUI`, which probes from the
   * CURRENT visible character state) — so these never touch `character`,
   * `worldFlags`, or any other live snapshot field, only their own
   * dedicated result slot.
   */
  const runExperimentAUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expAResult: runExperimentA_ResidualUncertainty() }));
  }, []);

  const runExperimentBUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expBResult: runExperimentB_ObviousChoice() }));
  }, []);

  const runExperimentCUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expCResult: runExperimentC_TrivialUncertainty() }));
  }, []);

  const runExperimentDUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expDResult: runExperimentD_MeaningfulConflict() }));
  }, []);

  const runExperimentKUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expKResult: runExperimentK_IntentVersusOutcome() }));
  }, []);

  const runExperimentEUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expEResult: runExperimentE_TraitAcquisition() }));
  }, []);

  const runExperimentGUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expGResult: runExperimentG_IdentityFeedback() }));
  }, []);

  const runExperimentHUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expHResult: runExperimentH_SelfStabilization() }));
  }, []);

  const runExperimentIUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expIResult: runExperimentI_IdentityFaultLine() }));
  }, []);

  const runExperimentJUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expJResult: runExperimentJ_Contradiction() }));
  }, []);

  const runExperimentFUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, expFResult: runExperimentF_SeedDivergence() }));
  }, []);

  /**
   * Phase 2.95 — the external review's five reason-consolidation target
   * behaviors. Same self-contained-read-only-probe shape as the Phase 2.9
   * experiments above: each function builds its own scenario/state
   * internally and only ever touches its own dedicated result slot.
   */
  const runTargetAUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, targetAResult: runExperimentGradualIdentityInfluence() }));
  }, []);

  const runTargetBUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, targetBResult: runExperimentWeakSignalCombination() }));
  }, []);

  const runTargetCUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, targetCResult: runExperimentRealFaultLine() }));
  }, []);

  const runTargetDUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, targetDResult: runExperimentTransformationWithFeedback() }));
  }, []);

  const runTargetEUI = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, targetEResult: runExperimentCanonicalAcquisitionWithFeedback() }));
  }, []);

  const reset = useCallback(() => {
    setSnapshot((prev) => {
      const config = { ...defaultScenario(prev.seed), cycleParams: cycleParams(prev) };
      const character = createInitialCharacterState({ ...config, needDefs: [...prev.needDefs.values()] });
      clockRef.current = new EventClock();
      seqRef.current = 0;
      return {
        ...prev,
        character,
        history: [],
        determinismCheck: null,
        counterfactual: null,
        lastActivation: null,
        lastAccessibilityFilter: null,
        lastRetrievedMemories: [],
        lastSaturationAnalysis: [],
        lastSemanticSalience: null,
        semanticSalienceScenarioResult: null,
        habitResult: null,
        substitutionResult: null,
        avoidanceResult: null,
        memoryAccessibilityResult: null,
        saturatedSatisfactionResult: null,
        saturationCounterfactualResult: null,
      };
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

  const toggleEvening = useCallback(() => {
    setSnapshot((prev) => ({ ...prev, eveningActive: !prev.eveningActive }));
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

  const updateActivationParams = useCallback((patch: Partial<ActivationParams>) => {
    setSnapshot((prev) => ({ ...prev, activationParams: { ...prev.activationParams, ...patch } }));
  }, []);

  const updateAssociationLearningParams = useCallback((patch: Partial<AssociationLearningParams>) => {
    setSnapshot((prev) => ({ ...prev, associationLearningParams: { ...prev.associationLearningParams, ...patch } }));
  }, []);

  const updateMemoryParams = useCallback((patch: Partial<MemoryCycleParams>) => {
    setSnapshot((prev) => ({ ...prev, memoryParams: { ...prev.memoryParams, ...patch } }));
  }, []);

  const updateSaturationParams = useCallback((patch: Partial<SaturationParams>) => {
    setSnapshot((prev) => ({ ...prev, saturationParams: { ...prev.saturationParams, ...patch } }));
  }, []);

  const updateDecisionParams = useCallback((patch: Partial<DecisionParams>) => {
    setSnapshot((prev) => ({ ...prev, decisionParams: { ...prev.decisionParams, ...patch } }));
  }, []);

  const updateSalienceParams = useCallback((patch: Partial<SalienceParams>) => {
    setSnapshot((prev) => ({ ...prev, salienceParams: { ...prev.salienceParams, ...patch } }));
  }, []);

  const updateSalienceMode = useCallback((mode: 'legacy' | 'derived') => {
    setSnapshot((prev) => ({ ...prev, salienceMode: mode }));
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
      runHabitExperimentUI,
      runSubstitutionExperimentUI,
      runAvoidanceExperimentUI,
      runMemoryAccessibilityExperimentUI,
      runSaturatedSatisfactionExperimentUI,
      runSaturationCounterfactualUI,
      runSemanticSalienceExperimentsUI,
      runExperimentAUI,
      runExperimentBUI,
      runExperimentCUI,
      runExperimentDUI,
      runExperimentKUI,
      runExperimentEUI,
      runExperimentGUI,
      runExperimentHUI,
      runExperimentIUI,
      runExperimentJUI,
      runExperimentFUI,
      runTargetAUI,
      runTargetBUI,
      runTargetCUI,
      runTargetDUI,
      runTargetEUI,
      reset,
      setSeed,
      toggleWorldFlag,
      toggleEvening,
      updateNeedDef,
      updateOutcomeEffect,
      updateChoiceParams,
      updateExpectationParams,
      updateActivationParams,
      updateAssociationLearningParams,
      updateMemoryParams,
      updateSaturationParams,
      updateDecisionParams,
      updateSalienceParams,
      updateSalienceMode,
      updateDeltaT,
      conceptUniverse: conceptUniverse(),
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
      runHabitExperimentUI,
      runSubstitutionExperimentUI,
      runAvoidanceExperimentUI,
      runMemoryAccessibilityExperimentUI,
      runSaturatedSatisfactionExperimentUI,
      runSaturationCounterfactualUI,
      runSemanticSalienceExperimentsUI,
      runExperimentAUI,
      runExperimentBUI,
      runExperimentCUI,
      runExperimentDUI,
      runExperimentKUI,
      runExperimentEUI,
      runExperimentGUI,
      runExperimentHUI,
      runExperimentIUI,
      runExperimentJUI,
      runExperimentFUI,
      runTargetAUI,
      runTargetBUI,
      runTargetCUI,
      runTargetDUI,
      runTargetEUI,
      reset,
      setSeed,
      toggleWorldFlag,
      toggleEvening,
      updateNeedDef,
      updateOutcomeEffect,
      updateChoiceParams,
      updateExpectationParams,
      updateActivationParams,
      updateAssociationLearningParams,
      updateMemoryParams,
      updateSaturationParams,
      updateDecisionParams,
      updateSalienceParams,
      updateSalienceMode,
      updateDeltaT,
    ],
  );
}

export type Engine = ReturnType<typeof useEngine>;
