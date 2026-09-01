import React from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { Slider, Toggle } from './Slider';

/**
 * Phase 2.5a — Brief §16/§19/§27's Saturated Satisfaction / Censored
 * Learning made visible: the live Capacity/Applied/Overflow decomposition
 * for the last Experience, the naive/censored learningMode toggle and κ
 * slider, and the two dedicated experiments (§21's sweep, §22's required
 * counterfactual) that demonstrate WHY the distinction matters. Since
 * Correction 2 (post-2.5c review, RESEARCH.md's Phase 2.5a entry): a
 * clipped observation grows confidence (τ) only when it is genuinely
 * INFORMATIVE (its naive candidate strictly exceeds what was already
 * believed) — an observation merely consistent with the current belief,
 * however many times it repeats, leaves τ untouched. Phase 2.5e re-baseline:
 * 'censored' is now CharacterLab's canonical default
 * (scenario.ts::defaultSaturationParams) — this toggle now defaults ON;
 * 'naive' is retired to a named historical/control condition
 * (legacySaturationParams()), still fully available for the required
 * §21/§22 canonical-vs-superseded comparisons below, but no longer co-equal
 * with 'censored' in ordinary use.
 */
export function SaturationPanel({ engine }: { engine: Engine }) {
  const { snapshot, updateSaturationParams, runSaturatedSatisfactionExperimentUI, runSaturationCounterfactualUI } = engine;
  const { saturationParams, lastSaturationAnalysis, saturatedSatisfactionResult, saturationCounterfactualResult } = snapshot;

  return (
    <section className="panel">
      <h2>Saturated Satisfaction &amp; Censored Learning (Phase 2.5a — §16, §19, §21–22, §27)</h2>
      <p className="panel__hint">
        A satisfier's true effect on a Need can exceed the Need's remaining headroom (Capacity+/Capacity-). What
        actually lands is Applied; the rest is Overflow. 'naive' learning treats Applied as if it were the satisfier's
        exact, uncensored effect; 'censored' (CharacterLab's canonical default since Phase 2.5e's re-baseline) instead
        treats a clipped observation as one-sided evidence that can never pull an established expectation (μ) toward
        the wrong side of what it actually proves, and (since Correction 2) only grows confidence (τ) when the
        observation is genuinely informative — one merely consistent with the current belief leaves τ unchanged.
        'naive' remains available below as a named, retired baseline for the required comparisons, not as an
        equally-valid everyday choice.
      </p>

      <div className="control-grid">
        <Toggle
          label="Censored learning mode (canonical)"
          checked={saturationParams.learningMode === 'censored'}
          onChange={(checked) => updateSaturationParams({ learningMode: checked ? 'censored' : 'naive' })}
          title="'censored' (default since Phase 2.5e — the corrected, canonical rule) vs. 'naive' (Phase 0-2's retired rule, kept as a named historical/control baseline)."
        />
        <Slider
          label="κ (Experienced-Reward overflow weight)"
          value={saturationParams.kappa.toDisplayNumber()}
          min={0}
          max={2}
          step={0.05}
          onChange={(v) => updateSaturationParams({ kappa: Rational.fromDecimal(v) })}
          title="Reward = Applied + κ·Overflow — trace-only this phase; never added to Need state or Score(a)."
        />
      </div>

      {lastSaturationAnalysis.length > 0 && (
        <>
          <h3>Last Experience's saturation analysis</h3>
          <table className="exp-table">
            <thead>
              <tr>
                <th>Need</th>
                <th>Applied</th>
                <th>Overflow</th>
                <th>Saturated</th>
                <th>Reward (trace-only)</th>
              </tr>
            </thead>
            <tbody>
              {lastSaturationAnalysis.map((s) => (
                <tr key={s.needId}>
                  <td>{s.needId}</td>
                  <td>{s.applied.toDisplayNumber().toFixed(4)}</td>
                  <td>{s.overflow.toDisplayNumber().toFixed(4)}</td>
                  <td>
                    <span className={`exp-badge ${s.saturated === 'none' ? 'exp-badge--good' : 'exp-badge--warn'}`}>{s.saturated}</span>
                  </td>
                  <td>{s.reward.toDisplayNumber().toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Sweep experiment — Brief §21</h3>
      <p className="panel__hint">
        Fixes the satisfier (ACTION_VISIT_GLEN's existing +0.40 Connection effect) and sweeps the Need's starting
        Level from 0.1 to 1.0, one fresh-prior probe per level per mode. A single fresh-prior observation has nothing
        established to protect, so naive and censored mu are identical here — the divergence only appears once a real
        prior exists (see the counterfactual below).
      </p>
      <div className="button-row">
        <button onClick={() => runSaturatedSatisfactionExperimentUI()}>Run Saturated Satisfaction sweep</button>
      </div>
      {saturatedSatisfactionResult && (
        <div className="exp-table-wrap">
          <table className="exp-table">
            <thead>
              <tr>
                <th>Level before</th>
                <th>Mode</th>
                <th>μ</th>
                <th>Confidence</th>
                <th>Applied</th>
                <th>Overflow</th>
                <th>Saturated</th>
                <th>Pr(satisfier)</th>
              </tr>
            </thead>
            <tbody>
              {saturatedSatisfactionResult.points.map((p, i) => (
                <tr key={i}>
                  <td>{p.needLevelBefore.toDisplayNumber().toFixed(2)}</td>
                  <td>{p.learningMode}</td>
                  <td>{p.mu.toDisplayNumber().toFixed(4)}</td>
                  <td>{p.confidence.toDisplayNumber().toFixed(4)}</td>
                  <td>{p.applied.toDisplayNumber().toFixed(4)}</td>
                  <td>{p.overflow.toDisplayNumber().toFixed(4)}</td>
                  <td>{p.saturated}</td>
                  <td>{(p.probabilityOfSatisfierAction.toDisplayNumber() * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Counterfactual — Brief §22</h3>
      <p className="panel__hint">
        Timeline A: the satisfier is always experienced while Connection is low (never saturates). Timeline B: MOSTLY
        near the ceiling, with one deliberate dip (Brief §22 says "mostly," not "always" — an always-saturating
        timeline gives neither learning rule any genuine observation to learn the true effect from). Same satisfier,
        same true effect throughout — only exposure timing differs.
      </p>
      <div className="button-row">
        <button onClick={() => runSaturationCounterfactualUI()}>Run Saturation counterfactual</button>
      </div>
      {saturationCounterfactualResult && (
        <div className="exp-result-block">
          <p>
            naiveDivergence = <strong>{saturationCounterfactualResult.naiveDivergence.toDisplayNumber().toFixed(4)}</strong>
            {' · '}censoredDivergence = <strong>{saturationCounterfactualResult.censoredDivergence.toDisplayNumber().toFixed(4)}</strong>
            {' · '}
            <span
              className={
                saturationCounterfactualResult.censoredDivergence.lt(saturationCounterfactualResult.naiveDivergence)
                  ? 'exp-badge exp-badge--good'
                  : 'exp-badge exp-badge--warn'
              }
            >
              {saturationCounterfactualResult.censoredDivergence.lt(saturationCounterfactualResult.naiveDivergence)
                ? 'censoring narrows the artifact, as predicted'
                : 'no narrowing — investigate'}
            </span>
          </p>
          <div className="exp-table-wrap">
            <table className="exp-table">
              <thead>
                <tr>
                  <th>Timeline</th>
                  <th>Mode</th>
                  <th>#</th>
                  <th>Level before</th>
                  <th>μ</th>
                  <th>Applied</th>
                  <th>Overflow</th>
                  <th>Saturated</th>
                </tr>
              </thead>
              <tbody>
                {saturationCounterfactualResult.results.flatMap((r) =>
                  r.steps.map((s) => (
                    <tr key={`${r.timeline}-${r.learningMode}-${s.index}`}>
                      <td>{r.timeline}</td>
                      <td>{r.learningMode}</td>
                      <td>{s.index + 1}</td>
                      <td>{s.needLevelBefore.toDisplayNumber().toFixed(2)}</td>
                      <td>{s.mu.toDisplayNumber().toFixed(4)}</td>
                      <td>{s.applied.toDisplayNumber().toFixed(4)}</td>
                      <td>{s.overflow.toDisplayNumber().toFixed(4)}</td>
                      <td>{s.saturated}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
