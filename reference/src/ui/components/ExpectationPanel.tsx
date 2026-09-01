import React from 'react';
import { Engine } from '../state/useEngine';
import { confidence } from '../../model/expectation';
import { Bar } from './Bar';

function shortLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1];
}

/**
 * Visible state for Brief §12: for every (subject, Need) pair the
 * character has ever observed, show μ (learned expectation), τ
 * (precision/evidence), and C (confidence) as separate quantities — the
 * point of §12 is precisely that these do NOT collapse into one number.
 */
export function ExpectationPanel({ engine }: { engine: Engine }) {
  const { snapshot } = engine;
  const subjects = Array.from(new Set(snapshot.actionDefs.map((a) => a.subject)));
  const needs = [...snapshot.needDefs.keys()];
  const kC = snapshot.expectationParams.kC;

  return (
    <section className="panel">
      <h2>Learned Need-Satisfaction Expectations</h2>
      <p className="panel__hint">NeedExpectation(x, n): μ (expected effect), τ (accumulated evidence), C = τ/(τ+K_C).</p>
      <div className="expectation-grid">
        {subjects.map((subject) =>
          needs.map((needId) => {
            const exp = engine.getExpectation(subject, needId);
            const c = confidence(exp.tau, kC);
            if (exp.tau.isZero() && exp.mu.isZero()) return null;
            return (
              <div key={`${subject}|${needId}`} className="expectation-cell">
                <div className="expectation-cell__title">
                  {shortLabel(subject)} → {shortLabel(needId)}
                </div>
                <Bar
                  label="μ"
                  value={exp.mu.toDisplayNumber()}
                  max={1}
                  displayValue={exp.mu.toDisplayNumber().toFixed(4)}
                  color="var(--accent)"
                />
                <Bar label="τ" value={exp.tau.toDisplayNumber()} max={Math.max(1, exp.tau.toDisplayNumber())} color="var(--muted)" />
                <Bar label="C (confidence)" value={c.toDisplayNumber()} color="var(--good)" />
              </div>
            );
          }),
        )}
      </div>
      {subjects.every((s) => needs.every((n) => engine.getExpectation(s, n).tau.isZero())) && (
        <p className="panel__hint">No experience yet — trigger an event below to start learning.</p>
      )}
    </section>
  );
}
