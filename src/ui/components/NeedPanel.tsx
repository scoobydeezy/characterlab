import React from 'react';
import { Engine } from '../state/useEngine';
import { needDeficit, needUrgency } from '../../model/needs';
import { Rational } from '../../kernel/rational';
import { Bar } from './Bar';
import { Slider } from './Slider';

function shortLabel(id: string): string {
  const parts = id.split('.');
  const tail = parts[parts.length - 1];
  return tail.charAt(0).toUpperCase() + tail.slice(1);
}

export function NeedPanel({ engine }: { engine: Engine }) {
  const { snapshot, updateNeedDef } = engine;
  return (
    <section className="panel">
      <h2>Needs</h2>
      <p className="panel__hint">
        Level advances by PassiveRate every tick (Brief §10), clamped to [0,1]. Deficit and Urgency are derived, not
        stored.
      </p>
      {[...snapshot.needDefs.values()].map((def) => {
        const state = snapshot.character.needStates.get(def.needId);
        const level = state?.level ?? Rational.ZERO;
        const deficit = needDeficit(level, def.setPoint);
        const urgency = needUrgency(deficit, def.coreImportance, def.urgencyExponent);
        return (
          <div key={def.needId} className="need-block">
            <h3>{shortLabel(def.needId)}</h3>
            <Bar label="Level (L)" value={level.toDisplayNumber()} color="var(--accent)" />
            <Bar label="Deficit (D)" value={deficit.toDisplayNumber()} color="var(--warn)" />
            <Bar label="Urgency (U)" value={urgency.toDisplayNumber()} max={Math.max(1, urgency.toDisplayNumber())} color="var(--danger)" />
            <div className="control-grid">
              <Slider
                label="Set point (S)"
                value={def.setPoint.toDisplayNumber()}
                min={0.05}
                max={1}
                step={0.01}
                onChange={(v) => updateNeedDef(def.needId, { setPoint: Rational.fromDecimal(v) })}
              />
              <Slider
                label="Core importance (K)"
                value={def.coreImportance.toDisplayNumber()}
                min={0}
                max={2}
                step={0.01}
                onChange={(v) => updateNeedDef(def.needId, { coreImportance: Rational.fromDecimal(v) })}
              />
              <Slider
                label="Passive rate (R)"
                value={def.passiveRate.toDisplayNumber()}
                min={-1}
                max={0.2}
                step={0.01}
                onChange={(v) => updateNeedDef(def.needId, { passiveRate: Rational.fromDecimal(v) })}
                title="Change in Level per tick with no intervention. Usually negative."
              />
              <Slider
                label="Urgency exponent (p)"
                value={def.urgencyExponent}
                min={1}
                max={4}
                step={1}
                onChange={(v) => updateNeedDef(def.needId, { urgencyExponent: Math.round(v) })}
                formatValue={(v) => v.toFixed(0)}
              />
            </div>
          </div>
        );
      })}
    </section>
  );
}
