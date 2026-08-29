import React from 'react';

export interface BarProps {
  readonly label: string;
  readonly value: number; // expected in [0,1] typically, but not clamped here
  readonly max?: number;
  readonly color?: string;
  readonly displayValue?: string;
  readonly title?: string;
}

/** A minimal horizontal bar meter — used for Need levels, urgency,
 * confidence, and choice probabilities. No charting library: this is
 * plain divs sized by percentage, which is all a single bounded scalar
 * needs. */
export function Bar({ label, value, max = 1, color = 'var(--accent)', displayValue, title }: BarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="bar" title={title}>
      <div className="bar__label">
        <span>{label}</span>
        <span className="bar__value">{displayValue ?? value.toFixed(3)}</span>
      </div>
      <div className="bar__track">
        <div className="bar__fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
