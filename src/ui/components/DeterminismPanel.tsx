import React from 'react';
import { Engine } from '../state/useEngine';

/**
 * Brief §3.1's determinism contract, made checkable from the UI: run the
 * next hypothetical autonomous cycle twice from identical (M, S0, I, R) —
 * same current state, same seed, same next tick — via two independent
 * EventClocks, and compare the resulting trace hashes. Side-effect-free:
 * neither run is committed to the visible character state.
 */
export function DeterminismPanel({ engine }: { engine: Engine }) {
  const { snapshot, runDeterminismCheck } = engine;
  const check = snapshot.determinismCheck;

  return (
    <section className="panel">
      <h2>Determinism Replay Check</h2>
      <p className="panel__hint">
        Runs the same next autonomous cycle twice from identical state/seed/tick via independent random-oracle
        addressing (Brief §3.1, §7) and compares full causal-trace hashes. Does not affect Mina's actual state.
      </p>
      <div className="button-row">
        <button onClick={() => runDeterminismCheck()}>Verify determinism</button>
      </div>
      {check && (
        <div className={`determinism-result ${check.pass ? 'determinism-result--pass' : 'determinism-result--fail'}`}>
          <strong>{check.pass ? 'PASS' : 'FAIL'}</strong> at tick {check.checkedAtTick}
          <div className="hash-row">
            <span>Run A: {check.selectedA} — {check.hashA}</span>
            <span>Run B: {check.selectedB} — {check.hashB}</span>
          </div>
        </div>
      )}
    </section>
  );
}
