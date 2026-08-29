import React from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { Slider } from './Slider';

export function ModelParamsPanel({ engine }: { engine: Engine }) {
  const { snapshot, updateChoiceParams, updateExpectationParams, updateDeltaT, setSeed, reset, advanceTime } = engine;

  return (
    <section className="panel">
      <h2>Model Parameters &amp; Controls</h2>

      <div className="control-grid">
        <label className="control">
          <span className="control__label">Seed (R)</span>
          <input type="text" value={snapshot.seed} onChange={(e) => setSeed(e.target.value)} />
        </label>
        <Slider label="Δt per tick" value={snapshot.deltaT.toDisplayNumber()} min={0.1} max={5} step={0.1} onChange={(v) => updateDeltaT(Rational.fromDecimal(v))} />
      </div>

      <div className="button-row">
        <button onClick={() => advanceTime(1)}>Advance Time ×1 (decay only, no Experience)</button>
        <button onClick={() => advanceTime(5)}>Advance Time ×5</button>
        <button className="button--danger" onClick={() => reset()}>
          Reset character
        </button>
      </div>

      <h3>Choice (§24)</h3>
      <div className="control-grid">
        <Slider label="ε" value={snapshot.choiceParams.epsilon.toDisplayNumber()} min={0.01} max={2} step={0.01} onChange={(v) => updateChoiceParams({ epsilon: Rational.fromDecimal(v) })} />
        <Slider
          label="γ (sharpness)"
          value={snapshot.choiceParams.gamma}
          min={1}
          max={8}
          step={1}
          formatValue={(v) => v.toFixed(0)}
          onChange={(v) => updateChoiceParams({ gamma: Math.round(v) })}
        />
      </div>

      <h3>Expectation learning (§12)</h3>
      <div className="control-grid">
        <Slider label="λ_q (precision decay)" value={snapshot.expectationParams.lambdaQ.toDisplayNumber()} min={0} max={1} step={0.01} onChange={(v) => updateExpectationParams({ lambdaQ: Rational.fromDecimal(v) })} />
        <Slider label="ρ_0 (base precision)" value={snapshot.expectationParams.rho0.toDisplayNumber()} min={0.1} max={10} step={0.1} onChange={(v) => updateExpectationParams({ rho0: Rational.fromDecimal(v) })} />
        <Slider label="σ (salience sensitivity)" value={snapshot.expectationParams.sigma.toDisplayNumber()} min={0} max={5} step={0.1} onChange={(v) => updateExpectationParams({ sigma: Rational.fromDecimal(v) })} />
        <Slider label="ρ_min" value={snapshot.expectationParams.rhoMin.toDisplayNumber()} min={0} max={2} step={0.01} onChange={(v) => updateExpectationParams({ rhoMin: Rational.fromDecimal(v) })} />
        <Slider label="ρ_max" value={snapshot.expectationParams.rhoMax.toDisplayNumber()} min={1} max={50} step={0.5} onChange={(v) => updateExpectationParams({ rhoMax: Rational.fromDecimal(v) })} />
        <Slider label="K_C (confidence half-sat.)" value={snapshot.expectationParams.kC.toDisplayNumber()} min={0.1} max={20} step={0.1} onChange={(v) => updateExpectationParams({ kC: Rational.fromDecimal(v) })} />
      </div>
    </section>
  );
}
