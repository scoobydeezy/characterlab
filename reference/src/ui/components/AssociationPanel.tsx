import React from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { getWeight, rowSum } from '../../model/associations';
import { Bar } from './Bar';
import { Slider, Toggle } from './Slider';

function shortLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1];
}

/**
 * Brief §14–16 made visible: the learned association graph W as a dense
 * heatmap (rows/cols in the same canonical ConceptKey order the kernel
 * itself uses), each row's Σ_j W_ij shown alongside it so the row-
 * substochastic invariant (§14, §32) is something the user can literally
 * watch hold rather than take on faith. Below it, the last computed
 * spreading-activation vector and, when the last cycle was autonomous, the
 * full §22 accessibility-filtered candidate breakdown (why each Action did
 * or didn't clear θ_A / the top-K_A cut) — the same data the trace records,
 * surfaced without needing to expand a trace row to find it.
 */
export function AssociationPanel({ engine }: { engine: Engine }) {
  const { snapshot, conceptUniverse, updateActivationParams, updateAssociationLearningParams, toggleEvening } = engine;
  const graph = snapshot.character.associations;
  const activation = snapshot.lastActivation;
  const filter = snapshot.lastAccessibilityFilter;

  return (
    <section className="panel">
      <h2>Associative Structure &amp; Accessibility (§14–16, §22)</h2>
      <p className="panel__hint">
        W_ij: how strongly concept i is associated with concept j. Learned only by ordinary Experience (Hebbian
        co-activation + atrophy, §14–15) — nothing else may write to this graph. Row sums never exceed 1.
      </p>

      <div className="control-grid">
        <Toggle
          label="Evening context active"
          checked={snapshot.eveningActive}
          onChange={() => toggleEvening()}
          title="Context concept fed into base activation (§16) and tagged onto every Experience while on — the Habit experiment's Context->Action target."
        />
      </div>

      <div className="assoc-heatmap-wrap">
        <table className="assoc-heatmap">
          <thead>
            <tr>
              <th />
              {conceptUniverse.map((c) => (
                <th key={c} title={c}>
                  {shortLabel(c)}
                </th>
              ))}
              <th>Σ_j</th>
            </tr>
          </thead>
          <tbody>
            {conceptUniverse.map((i) => {
              const sum = rowSum(graph, i);
              return (
                <tr key={i}>
                  <th title={i}>{shortLabel(i)}</th>
                  {conceptUniverse.map((j) => {
                    const w = getWeight(graph, i, j);
                    const v = w.toDisplayNumber();
                    return (
                      <td
                        key={j}
                        className="assoc-heatmap__cell"
                        style={{ background: v > 0 ? `rgba(59,111,214,${Math.min(1, v)})` : undefined }}
                        title={`W[${i}][${j}] = ${w.toString()}`}
                      >
                        {v > 0 ? v.toFixed(2) : ''}
                      </td>
                    );
                  })}
                  <td className={`assoc-heatmap__sum ${sum.equals(Rational.ONE) ? 'assoc-heatmap__sum--full' : ''}`}>
                    {sum.toDisplayNumber().toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activation && (
        <>
          <h3>Last computed spreading activation a = (I - βW)⁻¹b (§16)</h3>
          {conceptUniverse
            .map((c) => ({ c, a: activation.get(c) ?? Rational.ZERO }))
            .filter(({ a }) => !a.isZero())
            .map(({ c, a }) => (
              <Bar key={c} label={shortLabel(c)} value={a.toDisplayNumber()} max={Math.max(1, a.toDisplayNumber())} color="var(--accent)" />
            ))}
        </>
      )}

      {filter && (
        <>
          <h3>Accessibility filter — last autonomous cycle (§22.2–3)</h3>
          <table className="accessibility-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Accessibility</th>
                <th>≥ θ_A?</th>
                <th>In top-K_A?</th>
              </tr>
            </thead>
            <tbody>
              {filter.evaluated.map((e) => (
                <tr key={e.actionKey} className={e.selected ? 'accessibility-table__row--selected' : ''}>
                  <td>{shortLabel(e.actionKey)}</td>
                  <td>{e.accessibility.toDisplayNumber().toFixed(4)}</td>
                  <td>{e.passedThreshold ? 'yes' : 'no'}</td>
                  <td>{e.selected ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Spreading activation (§16)</h3>
      <div className="control-grid">
        <Slider
          label="β (decay per hop)"
          value={snapshot.activationParams.beta.toDisplayNumber()}
          min={0}
          max={0.95}
          step={0.01}
          onChange={(v) => updateActivationParams({ beta: Rational.fromDecimal(v) })}
        />
        <Slider
          label="θ_A (accessibility threshold)"
          value={snapshot.activationParams.thetaA.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateActivationParams({ thetaA: Rational.fromDecimal(v) })}
        />
        <Slider
          label="K_A (max candidates)"
          value={snapshot.activationParams.kA}
          min={1}
          max={10}
          step={1}
          formatValue={(v) => v.toFixed(0)}
          onChange={(v) => updateActivationParams({ kA: Math.round(v) })}
        />
      </div>

      <h3>Association learning (§14–15)</h3>
      <div className="control-grid">
        <Slider
          label="λ_a (atrophy rate)"
          value={snapshot.associationLearningParams.lambdaA.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateAssociationLearningParams({ lambdaA: Rational.fromDecimal(v) })}
        />
        <Slider
          label="η (Hebbian learning rate)"
          value={snapshot.associationLearningParams.eta.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateAssociationLearningParams({ eta: Rational.fromDecimal(v) })}
        />
      </div>
    </section>
  );
}
