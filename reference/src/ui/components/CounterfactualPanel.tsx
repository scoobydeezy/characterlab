import React, { useState } from 'react';
import { Engine } from '../state/useEngine';

/**
 * Brief §29 Counterfactual Requirement, run on demand: identical initial
 * state/seed/timing, Glen vs. Priya as the sole difference. Renders the
 * per-step μ and Need-level trajectories side by side so the divergence is
 * traceable, not just asserted.
 */
export function CounterfactualPanel({ engine }: { engine: Engine }) {
  const { snapshot, runCounterfactualExperiment } = engine;
  const [steps, setSteps] = useState(20);
  const result = snapshot.counterfactual;

  return (
    <section className="panel">
      <h2>Paired Counterfactual — Glen vs. Priya (§29)</h2>
      <p className="panel__hint">
        Two independent timelines from the current state: N repeated Connection Experiences with Glen vs. the same N
        with Priya. Same seed, same Δt, same starting point — only the subject differs.
      </p>
      <div className="button-row">
        <label className="control">
          <span className="control__label">Steps</span>
          <input type="number" min={1} max={60} value={steps} onChange={(e) => setSteps(parseInt(e.target.value || '1', 10))} style={{ width: '4rem' }} />
        </label>
        <button onClick={() => runCounterfactualExperiment(steps)}>Run counterfactual</button>
      </div>
      {result && (
        <div className="counterfactual-table-wrap">
          <table className="counterfactual-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Connection (Glen)</th>
                <th>μ (Glen)</th>
                <th>Connection (Priya)</th>
                <th>μ (Priya)</th>
              </tr>
            </thead>
            <tbody>
              {result.comparison.map((c) => (
                <tr key={c.index}>
                  <td>{c.index + 1}</td>
                  <td>{c.needLevelA.toDisplayNumber().toFixed(3)}</td>
                  <td>{c.muA.toDisplayNumber().toFixed(3)}</td>
                  <td>{c.needLevelB.toDisplayNumber().toFixed(3)}</td>
                  <td>{c.muB.toDisplayNumber().toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
