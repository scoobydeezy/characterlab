import React from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { Slider } from './Slider';

function shortLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1];
}

/**
 * Brief §17 episodic memory made visible: every stored MemoryEpisode, its
 * semantic tags, and how many times it's been retrieved (encoding counts as
 * the first retrieval — §17). When the last cycle actually retrieved (and
 * thereby reinforced) memories, each one's Base/Associative/Retrieval score
 * breakdown is shown too, so "why did THIS memory come back" is traceable
 * the same way action selection is.
 */
export function MemoryPanel({ engine }: { engine: Engine }) {
  const { snapshot, updateMemoryParams } = engine;
  const store = snapshot.character.memory;
  const retrieved = new Map(snapshot.lastRetrievedMemories.map((s) => [s.record.memory.memoryId, s]));

  return (
    <section className="panel">
      <h2>Episodic Memory &amp; Retrieval Accessibility (§17)</h2>
      <p className="panel__hint">
        Retrieval_m = ω_b·Base_m(recency/frequency) + ω_a·a_m(associative pull). Retrieval itself becomes a new
        retrieval timestamp — accessing a memory reinforces its own future accessibility.
      </p>

      {store.records.length === 0 ? (
        <p className="panel__hint">No memories encoded yet — every Experience creates one (§17, step 15).</p>
      ) : (
        <ul className="memory-list">
          {[...store.records]
            .slice()
            .sort((a, b) => b.memory.encodedAt - a.memory.encodedAt)
            .map((record) => {
              const scored = retrieved.get(record.memory.memoryId);
              return (
                <li key={record.memory.memoryId} className="memory-list__item">
                  <div className="memory-list__header">
                    <span className="memory-list__id">{record.memory.memoryId}</span>
                    <span className="memory-list__meta">
                      encoded t{record.memory.encodedAt} · retrieved {record.retrievalHistory.length}× (last t
                      {record.retrievalHistory[record.retrievalHistory.length - 1]})
                    </span>
                  </div>
                  <div className="memory-list__tags">
                    {record.memory.action} · {record.memory.semanticConcepts.map(shortLabel).join(', ') || '(no tags)'}
                  </div>
                  {scored && (
                    <div className="memory-list__scores">
                      Base={scored.base.toDisplayNumber().toFixed(3)} Associative={scored.associative.toDisplayNumber().toFixed(3)}{' '}
                      Retrieval={scored.retrieval.toDisplayNumber().toFixed(3)} (retrieved this cycle)
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      )}

      <h3>Accessibility parameters (§17)</h3>
      <div className="control-grid">
        <Slider
          label="λ_m (recency decay)"
          value={snapshot.memoryParams.lambdaM.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateMemoryParams({ lambdaM: Rational.fromDecimal(v) })}
        />
        <Slider
          label="d_m (decay exponent)"
          value={snapshot.memoryParams.dM}
          min={1}
          max={4}
          step={1}
          formatValue={(v) => v.toFixed(0)}
          onChange={(v) => updateMemoryParams({ dM: Math.round(v) })}
        />
        <Slider
          label="ω_b (base/recency weight)"
          value={snapshot.memoryParams.omegaB.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateMemoryParams({ omegaB: Rational.fromDecimal(v) })}
        />
        <Slider
          label="ω_a (associative weight)"
          value={snapshot.memoryParams.omegaA.toDisplayNumber()}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateMemoryParams({ omegaA: Rational.fromDecimal(v) })}
        />
        <Slider
          label="Retrieval K"
          value={snapshot.memoryParams.retrievalK}
          min={1}
          max={10}
          step={1}
          formatValue={(v) => v.toFixed(0)}
          onChange={(v) => updateMemoryParams({ retrievalK: Math.round(v) })}
        />
      </div>
    </section>
  );
}
