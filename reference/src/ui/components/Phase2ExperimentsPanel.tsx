import React, { useState } from 'react';

import { Engine } from '../state/useEngine';
import { asConceptKey } from '../../kernel/canonical';
import { ACTION_VISIT_GLEN, ACTION_VISIT_PRIYA } from '../../model/scenario';

const GLEN_CONCEPT = asConceptKey(ACTION_VISIT_GLEN);
const PRIYA_CONCEPT = asConceptKey(ACTION_VISIT_PRIYA);

function shortLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1];
}

function RepeatRunner({ label, defaultN, onRun }: { label: string; defaultN: number; onRun: (n: number) => void }) {
  const [n, setN] = useState(defaultN);
  return (
    <div className="button-row">
      <label className="control">
        <span className="control__label">Repetitions</span>
        <input type="number" min={1} max={30} value={n} onChange={(e) => setN(parseInt(e.target.value || '1', 10))} style={{ width: '4rem' }} />
      </label>
      <button onClick={() => onRun(n)}>{label}</button>
    </div>
  );
}

/**
 * Phase-2 experiments (Brief §28's "Habit," "Substitution," "Avoidance"
 * plus §17's memory-accessibility demonstration), run as read-only probes
 * from the current state — exactly like the Paired Counterfactual panel:
 * pressing a button never touches Mina's actual timeline, only these
 * panels' own result state.
 */
export function Phase2ExperimentsPanel({ engine }: { engine: Engine }) {
  const {
    snapshot,
    runHabitExperimentUI,
    runSubstitutionExperimentUI,
    runAvoidanceExperimentUI,
    runMemoryAccessibilityExperimentUI,
  } = engine;
  const { habitResult, substitutionResult, avoidanceResult, memoryAccessibilityResult } = snapshot;

  return (
    <section className="panel">
      <h2>Phase 2 Experiments (§17, §27–29)</h2>

      <h3>Habit — repeated Context→Action co-activation (§28)</h3>
      <p className="panel__hint">
        Forces N evening visits to Glen and tracks W[evening→glen] growth, isolated from Need-satisfaction learning
        via a Need-free "context only" activation probe at the end.
      </p>
      <RepeatRunner label="Run Habit experiment" defaultN={8} onRun={runHabitExperimentUI} />
      {habitResult && (
        <div className="exp-table-wrap">
          <table className="exp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>W[evening→glen]</th>
                <th>Row Σ (evening)</th>
              </tr>
            </thead>
            <tbody>
              {habitResult.steps.map((s) => (
                <tr key={s.index}>
                  <td>{s.index + 1}</td>
                  <td>{s.contextToGlenWeight.toDisplayNumber().toFixed(4)}</td>
                  <td>{s.contextRowSum.toDisplayNumber().toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="panel__hint">
            Context-only activation (Need-free base vector) — glen:{' '}
            {(habitResult.contextOnlyActivation.get(GLEN_CONCEPT)?.toDisplayNumber() ?? 0).toFixed(4)}, priya:{' '}
            {(habitResult.contextOnlyActivation.get(PRIYA_CONCEPT)?.toDisplayNumber() ?? 0).toFixed(4)} — Priya staying
            at 0 confirms the graph never associated her with this Context at all.
          </p>
        </div>
      )}

      <h3>Substitution — does accessibility redirect toward a substitute? (§29)</h3>
      <p className="panel__hint">
        After building up the Habit's learned graph, compares Priya's accessibility with Glen available vs.
        unavailable through the real candidate-generation pipeline — the falsifiable prediction is that the value is
        identical either way (world flags never reach solveActivation), and any substitution effect is precondition-
        filtering alone.
      </p>
      <RepeatRunner label="Run Substitution experiment" defaultN={8} onRun={runSubstitutionExperimentUI} />
      {substitutionResult && (
        <div className="exp-result-block">
          <p>
            Priya accessibility — Glen available: <strong>{substitutionResult.comparison.priyaAccessibilityGlenAvailable.toDisplayNumber().toFixed(4)}</strong>
            {' · '}Glen unavailable: <strong>{substitutionResult.comparison.priyaAccessibilityGlenUnavailable.toDisplayNumber().toFixed(4)}</strong>
            {' · '}
            <span className={substitutionResult.comparison.accessibilityIdenticalRegardlessOfGlen ? 'exp-badge exp-badge--good' : 'exp-badge exp-badge--warn'}>
              {substitutionResult.comparison.accessibilityIdenticalRegardlessOfGlen ? 'identical, as predicted' : 'DIFFERED — investigate'}
            </span>
          </p>
          <p className="panel__hint">
            Candidates with Glen available: {substitutionResult.comparison.glenAvailableCandidates.candidates.map((c) => shortLabel(c.actionKey)).join(', ')}
            <br />
            Candidates with Glen unavailable: {substitutionResult.comparison.glenUnavailableCandidates.candidates.map((c) => shortLabel(c.actionKey)).join(', ')}
            <br />
            Priya independently visited before this run: {substitutionResult.comparison.priyaHasNeverBeenVisited ? 'no' : 'yes'}
          </p>
        </div>
      )}

      <h3>Avoidance — does repeated punishment reduce Pr(action) without Inhibition? (§27–28)</h3>
      <p className="panel__hint">
        Forces N repetitions of Glen's ordinary visit with the authored aversive Rest outcome (scenario.ts's
        aversiveOutcomeTable — tuned so Rest stays off its floor for the first 5 repetitions) and evaluates
        Pr(this action) against Stay Home after each one, using nothing but Phase 1's NeedExpectation mechanism.
      </p>
      <RepeatRunner label="Run Avoidance experiment" defaultN={5} onRun={runAvoidanceExperimentUI} />
      {avoidanceResult && (
        <div className="exp-table-wrap">
          <table className="exp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>μ(Glen, Rest)</th>
                <th>Confidence</th>
                <th>Pr(visit Glen)</th>
              </tr>
            </thead>
            <tbody>
              {avoidanceResult.steps.map((s) => (
                <tr key={s.index}>
                  <td>{s.index + 1}</td>
                  <td>{s.mu.toDisplayNumber().toFixed(4)}</td>
                  <td>{s.confidence.toDisplayNumber().toFixed(4)}</td>
                  <td>{(s.probabilityOfAversiveAction.toDisplayNumber() * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="panel__hint">
            Beyond ~5 repetitions Rest floor-clamps and μ reverts toward 0 — the same boundary-saturation effect
            Phase 1 found at the ceiling, mirrored at the floor. Try 7+ repetitions to see it reappear.
          </p>
        </div>
      )}

      <h3>Memory accessibility — recency, frequency, and decay (§17)</h3>
      <p className="panel__hint">
        A self-contained two-memory timeline (no Needs or associations involved) exercising baseAccessibility and
        retrieval-reinforcement directly against the formulas, using the live memory parameters above.
      </p>
      <div className="button-row">
        <button onClick={() => runMemoryAccessibilityExperimentUI()}>Run Memory Accessibility experiment</button>
      </div>
      {memoryAccessibilityResult && (
        <div className="exp-result-block">
          <p className="panel__hint">
            t=2 (right after B encoded): Base_A={memoryAccessibilityResult.recencyAtEncoding.baseA.toDisplayNumber().toFixed(4)}, Base_B=
            {memoryAccessibilityResult.recencyAtEncoding.baseB.toDisplayNumber().toFixed(4)} (B more accessible purely from recency)
          </p>
          <p className="panel__hint">
            t=10 (idle decay): Base_A={memoryAccessibilityResult.recencyAfterIdle.baseA.toDisplayNumber().toFixed(4)}, Base_B=
            {memoryAccessibilityResult.recencyAfterIdle.baseB.toDisplayNumber().toFixed(4)}
          </p>
          <p className="panel__hint">
            t=20, after reinforcing A at t=10: with reinforcement={memoryAccessibilityResult.reinforcement.baseAWithReinforcement.toDisplayNumber().toFixed(4)},
            without={memoryAccessibilityResult.reinforcement.baseAWithoutReinforcement.toDisplayNumber().toFixed(4)} —{' '}
            <span className={memoryAccessibilityResult.reinforcement.reinforcementIncreasedBase ? 'exp-badge exp-badge--good' : 'exp-badge exp-badge--warn'}>
              {memoryAccessibilityResult.reinforcement.reinforcementIncreasedBase ? 'reinforcement increased accessibility, as predicted' : 'no increase — investigate'}
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
