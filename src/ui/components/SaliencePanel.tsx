import React from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { SalienceBreakdown } from '../../model/salience';
import { Slider, Toggle } from './Slider';

function BreakdownTable({ rows, title }: { rows: readonly SalienceBreakdown[]; title: string }) {
  return (
    <>
      <h4>{title}</h4>
      <div className="exp-table-wrap">
        <table className="exp-table">
          <thead>
            <tr>
              <th>Concept</th>
              <th>Category</th>
              <th>Role</th>
              <th>Perceived</th>
              <th>B</th>
              <th>R</th>
              <th>A</th>
              <th>N</th>
              <th>S</th>
              <th>Raw</th>
              <th>z</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.concept}>
                <td>{b.concept}</td>
                <td>{b.category}</td>
                <td>{b.role}</td>
                <td>{b.perceived ? 'yes' : 'no'}</td>
                <td>{b.baseSalience.toDisplayNumber().toFixed(3)}</td>
                <td>{b.roleWeight.toDisplayNumber().toFixed(3)}</td>
                <td>{b.attention.toDisplayNumber().toFixed(3)}</td>
                <td>{b.needRelevance.toDisplayNumber().toFixed(3)}</td>
                <td>{b.surprise.toDisplayNumber().toFixed(3)}</td>
                <td>{b.raw.toDisplayNumber().toFixed(4)}</td>
                <td>
                  <strong>{b.z.toDisplayNumber().toFixed(4)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/**
 * Phase 2.5b/c — Brief §5-14/§25-27's Semantic Salience made visible: the
 * legacy/derived mode toggle, the salience-budget model + αN/αS knobs,
 * the last Experience's full per-concept B/R/A/N/S/raw/z breakdown (the
 * exact trace shape Brief §26 asks for), and run-buttons for the six
 * required Brief §13 scenarios (A-F). Since Phase 2.5c, role and attention
 * are both mechanically derived (see model/salience.ts) rather than
 * authored per concept, so this panel has no "unattended" toggle anywhere
 * — Scenario F now shows two variants (one vs. three Incidental concepts)
 * to make derived residual-attention competition visible instead. Phase
 * 2.5e re-baseline: 'derived' is now CharacterLab's canonical default
 * (scenario.ts::defaultCycleParams) — this toggle now defaults ON; 'legacy'
 * is retired to a named historical/control condition
 * (legacyCycleParams()), kept for exactly the required historical/
 * FlatSalienceBaseline-style comparisons, not as a co-equal everyday mode.
 */
export function SaliencePanel({ engine }: { engine: Engine }) {
  const { snapshot, updateSalienceMode, updateSalienceParams, runSemanticSalienceExperimentsUI } = engine;
  const { salienceMode, salienceParams, lastSemanticSalience, semanticSalienceScenarioResult } = snapshot;

  return (
    <section className="panel">
      <h2>Semantic Salience (Phase 2.5b — §5-14, §25-27)</h2>
      <p className="panel__hint">
        What should a Person/Object/Location's encoding strength (z, fed to the association graph) actually be?
        'derived' (CharacterLab's canonical default since Phase 2.5e's re-baseline) computes z from a category prior
        (B), the concept's causal role in THIS event (R — the same Object can be Incidental or Cause),
        attention/perception (A), Need relevance (N), and prediction-error surprise (S): Raw = B·R·A·(1+αN·N)·(1+αS·S),
        then a salience-budget model turns Raw into z. 'legacy' gives every engaged concept a flat weight of 1.0
        instead (Phase 0-2.5a's retired behavior — the Habit experiment's original W-caps-at-1/2 finding was this
        artifact; see RESEARCH.md's Phase 2.5e entry for how that finding was re-baselined) — kept below as a named
        historical/control condition, not an equally-valid everyday choice.
      </p>

      <div className="control-grid">
        <Toggle
          label="Derived salience mode (canonical)"
          checked={salienceMode === 'derived'}
          onChange={(checked) => updateSalienceMode(checked ? 'derived' : 'legacy')}
          title="'derived' (default since Phase 2.5e — the canonical pipeline) vs. 'legacy' (Phase 0-2.5a's retired flat-weight behavior, kept as a named historical/control baseline)."
        />
        <label className="control control--select" title="Brief §12's three candidate budget models.">
          <span className="control__label">Budget model</span>
          <select
            value={salienceParams.budgetMode}
            onChange={(e) => updateSalienceParams({ budgetMode: e.target.value as typeof salienceParams.budgetMode })}
          >
            <option value="independent">A — independent (z=g(Raw))</option>
            <option value="shared">B — shared budget (z=Raw/max(B,ΣRaw))</option>
            <option value="hybrid">C — hybrid (threshold + competition)</option>
          </select>
        </label>
        <Slider
          label="αN (Need-relevance weight)"
          value={salienceParams.alphaN.toDisplayNumber()}
          min={0}
          max={3}
          step={0.1}
          onChange={(v) => updateSalienceParams({ alphaN: Rational.fromDecimal(v) })}
        />
        <Slider
          label="αS (surprise weight)"
          value={salienceParams.alphaS.toDisplayNumber()}
          min={0}
          max={3}
          step={0.1}
          onChange={(v) => updateSalienceParams({ alphaS: Rational.fromDecimal(v) })}
        />
        <Slider
          label="B (shared/hybrid budget)"
          value={salienceParams.budget.toDisplayNumber()}
          min={0}
          max={3}
          step={0.1}
          onChange={(v) => updateSalienceParams({ budget: Rational.fromDecimal(v) })}
        />
        <Slider
          label="Hybrid importance threshold"
          value={salienceParams.hybridThreshold.toDisplayNumber()}
          min={0}
          max={2}
          step={0.05}
          onChange={(v) => updateSalienceParams({ hybridThreshold: Rational.fromDecimal(v) })}
        />
      </div>

      {lastSemanticSalience && <BreakdownTable rows={lastSemanticSalience.breakdown} title="Last Experience's salience breakdown" />}
      {!lastSemanticSalience && (
        <p className="panel__hint">
          No breakdown yet this session — trigger a scripted or autonomous Experience while 'derived' mode is on
          ('legacy' mode never populates this; see saturation panel-style toggles above).
        </p>
      )}

      <h3>Semantic Footprint Experiments — Brief §13 Scenarios A-F</h3>
      <p className="panel__hint">
        Six required controlled scenarios, run directly against the salience pipeline (not a full multi-cycle
        simulation): ordinary interaction, conflict, an Object becoming causal (the falling lamp), a Location becoming
        causal (the hazardous bakery), surprise, and attention gating.
      </p>
      <div className="button-row">
        <button onClick={() => runSemanticSalienceExperimentsUI()}>Run all six scenarios</button>
      </div>

      {semanticSalienceScenarioResult && (
        <div className="exp-result-block">
          <BreakdownTable rows={semanticSalienceScenarioResult.a.result.breakdown} title={semanticSalienceScenarioResult.a.name} />
          <BreakdownTable rows={semanticSalienceScenarioResult.b.result.breakdown} title={semanticSalienceScenarioResult.b.name} />
          <BreakdownTable rows={semanticSalienceScenarioResult.c.result.breakdown} title={semanticSalienceScenarioResult.c.name} />
          <BreakdownTable rows={semanticSalienceScenarioResult.d.result.breakdown} title={semanticSalienceScenarioResult.d.name} />
          <BreakdownTable
            rows={semanticSalienceScenarioResult.e.expected.result.breakdown}
            title={semanticSalienceScenarioResult.e.expected.name}
          />
          <BreakdownTable
            rows={semanticSalienceScenarioResult.e.unexpected.result.breakdown}
            title={semanticSalienceScenarioResult.e.unexpected.name}
          />
          <BreakdownTable
            rows={semanticSalienceScenarioResult.f.withOneIncidental.result.breakdown}
            title={semanticSalienceScenarioResult.f.withOneIncidental.name}
          />
          <BreakdownTable
            rows={semanticSalienceScenarioResult.f.withThreeIncidental.result.breakdown}
            title={semanticSalienceScenarioResult.f.withThreeIncidental.name}
          />
        </div>
      )}
    </section>
  );
}
