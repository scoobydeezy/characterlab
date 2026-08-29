import React, { useState } from 'react';
import { Engine } from '../state/useEngine';
import { Rational } from '../../kernel/rational';
import { Bar } from './Bar';
import { Slider, Toggle } from './Slider';
import {
  ACTION_BETRAYAL_GLEN,
  ACTION_VISIT_GLEN,
  ACTION_VISIT_PRIYA,
  ACTION_STAY_HOME,
  WORLD_FLAG_GLEN_AVAILABLE,
  WORLD_FLAG_PRIYA_AVAILABLE,
} from '../../model/scenario';

function shortLabel(id: string): string {
  const parts = id.split('.');
  return parts[parts.length - 1];
}

export function ActionPanel({ engine }: { engine: Engine }) {
  const { snapshot, triggerScriptedAction, runNScriptedSteps, runAutonomous, toggleWorldFlag, updateOutcomeEffect } = engine;
  const [repeatN, setRepeatN] = useState(20);

  const lastAutonomous = snapshot.history.find((h) => h.kind === 'autonomous');

  return (
    <section className="panel">
      <h2>Actions &amp; World</h2>

      <div className="control-grid">
        <Toggle
          label="Glen available"
          checked={snapshot.worldFlags.has(WORLD_FLAG_GLEN_AVAILABLE)}
          onChange={() => toggleWorldFlag(WORLD_FLAG_GLEN_AVAILABLE)}
        />
        <Toggle
          label="Priya available"
          checked={snapshot.worldFlags.has(WORLD_FLAG_PRIYA_AVAILABLE)}
          onChange={() => toggleWorldFlag(WORLD_FLAG_PRIYA_AVAILABLE)}
        />
      </div>

      <h3>Event buttons — scripted Experience (experimenter forces the Action)</h3>
      <div className="button-row">
        <button onClick={() => triggerScriptedAction(ACTION_VISIT_GLEN)}>Visit Glen ×1</button>
        <button onClick={() => triggerScriptedAction(ACTION_VISIT_PRIYA)}>Visit Priya ×1</button>
        <button onClick={() => triggerScriptedAction(ACTION_STAY_HOME)}>Stay Home ×1</button>
        <button className="button--danger" onClick={() => triggerScriptedAction(ACTION_BETRAYAL_GLEN)}>
          Trigger Betrayal (Glen)
        </button>
      </div>
      <div className="button-row">
        <label className="control">
          <span className="control__label">Repeat count</span>
          <input
            type="number"
            min={1}
            max={100}
            value={repeatN}
            onChange={(e) => setRepeatN(parseInt(e.target.value || '1', 10))}
            style={{ width: '4rem' }}
          />
        </label>
        <button onClick={() => runNScriptedSteps(ACTION_VISIT_GLEN, repeatN)}>Run Visit Glen ×N (§28 primary experiment)</button>
        <button onClick={() => runNScriptedSteps(ACTION_VISIT_PRIYA, repeatN)}>Run Visit Priya ×N</button>
      </div>

      <h3>Autonomous choice — Mina picks (Brief §22–24)</h3>
      <div className="button-row">
        <button className="button--primary" onClick={() => runAutonomous()}>
          Let Mina choose
        </button>
      </div>
      {lastAutonomous?.distribution && (
        <div className="choice-distribution">
          {lastAutonomous.distribution.ordered.map((o) => (
            <Bar
              key={o.actionKey}
              label={`${shortLabel(o.actionKey)}${o.actionKey === lastAutonomous.actionKey ? '  (selected)' : ''}`}
              value={o.probability.toDisplayNumber()}
              displayValue={`${(o.probability.toDisplayNumber() * 100).toFixed(1)}%`}
              color={o.actionKey === lastAutonomous.actionKey ? 'var(--good)' : 'var(--muted)'}
            />
          ))}
        </div>
      )}

      <h3>World outcome effects (authored, editable)</h3>
      {[...snapshot.outcomeTables.entries()]
        .filter(([key]) => key !== ACTION_BETRAYAL_GLEN)
        .map(([actionKey, table]) => (
          <div key={actionKey} className="need-block">
            <h4>{shortLabel(actionKey)}</h4>
            {table.effects.map((effect) => (
              <div key={effect.needId} className="control-grid">
                <Slider
                  label={`${shortLabel(effect.needId)} magnitude`}
                  value={effect.magnitude.toDisplayNumber()}
                  min={-1}
                  max={1}
                  step={0.01}
                  onChange={(v) => updateOutcomeEffect(actionKey, effect.needId, { magnitude: Rational.fromDecimal(v) })}
                />
                <Slider
                  label={`${shortLabel(effect.needId)} noise ±`}
                  value={effect.noiseHalfWidth.toDisplayNumber()}
                  min={0}
                  max={0.5}
                  step={0.01}
                  onChange={(v) => updateOutcomeEffect(actionKey, effect.needId, { noiseHalfWidth: Rational.fromDecimal(v) })}
                />
              </div>
            ))}
          </div>
        ))}
    </section>
  );
}
