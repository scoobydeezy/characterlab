import React, { useState } from 'react';
import { Engine, HistoryEntry } from '../state/useEngine';
import { traceHash } from '../../kernel/trace';

function TraceEntry({ entry }: { entry: HistoryEntry }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="trace-entry">
      <button className="trace-entry__header" onClick={() => setExpanded((e) => !e)}>
        <span className="trace-entry__tick">t{entry.tick}</span>
        <span className={`trace-entry__kind trace-entry__kind--${entry.kind}`}>{entry.kind}</span>
        {entry.actionKey && <span className="trace-entry__action">{entry.actionKey}</span>}
        <span className="trace-entry__hash">{traceHash(entry.trace)}</span>
        <span className="trace-entry__toggle">{expanded ? '▾' : '▸'}</span>
      </button>
      {expanded && (
        <ol className="trace-steps">
          {entry.trace.steps.map((step, i) => (
            <li key={i} className="trace-step">
              <div className="trace-step__name">{step.step}</div>
              {Object.keys(step.inputs).length > 0 && (
                <pre className="trace-step__io">in: {JSON.stringify(step.inputs, (_, v) => (typeof v === 'bigint' ? `${v}n` : v))}</pre>
              )}
              <pre className="trace-step__io">out: {JSON.stringify(step.outputs, (_, v) => (typeof v === 'bigint' ? `${v}n` : v))}</pre>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

/**
 * Brief §30: "Every meaningful choice emits a complete derivation... Trace
 * generation is a product requirement, not optional debug logging." This
 * panel is that requirement made visible: every button press in the UI
 * appends one entry here, expandable down to the exact numbers.
 */
export function TraceViewer({ engine }: { engine: Engine }) {
  const { snapshot } = engine;
  return (
    <section className="panel panel--trace">
      <h2>Causal Trace Log</h2>
      <p className="panel__hint">Most recent first. Click a row to expand its full step-by-step derivation (§30).</p>
      {snapshot.history.length === 0 ? (
        <p className="panel__hint">No cycles run yet.</p>
      ) : (
        <ol className="trace-list">
          {snapshot.history.map((entry) => (
            <TraceEntry key={entry.seq} entry={entry} />
          ))}
        </ol>
      )}
    </section>
  );
}
