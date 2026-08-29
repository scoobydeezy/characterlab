import React from 'react';

export interface SliderProps {
  readonly label: string;
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly onChange: (value: number) => void;
  readonly formatValue?: (value: number) => string;
  readonly title?: string;
}

export function Slider({ label, value, min, max, step, onChange, formatValue, title }: SliderProps) {
  return (
    <label className="control control--slider" title={title}>
      <span className="control__label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <span className="control__value">{formatValue ? formatValue(value) : value.toFixed(3)}</span>
    </label>
  );
}

export interface ToggleProps {
  readonly label: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly title?: string;
}

export function Toggle({ label, checked, onChange, title }: ToggleProps) {
  return (
    <label className="control control--toggle" title={title}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="control__label">{label}</span>
    </label>
  );
}
