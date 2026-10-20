/** Detached trace/0.2 projection. Never evaluates model rules or mutates a run. */
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec, dataField as f, dataItems as items} from '../campaign2/canonicalData';
import {exactKey, exactText, readable} from './canonical';
import type {TimelineEvent} from './contracts';

export const scalar = (v: CanonicalValue): string => {
  if (typeof v === 'boolean' || !['signed', 'unsigned', 'text', 'rational'].includes(v.kind)) throw Error('Expected exact scalar');
  return String(readable(v));
};
export function nativeTimeline(trace: readonly CanonicalValue[]): TimelineEvent[] {
  return trace.map(value => {
    const row = rec(value, 160n), event = rec(f(row, 4n), 130n);
    const named = (name: string) => {
      const field = event.schema.fields.find(x => x.name === name);
      if (!field) throw Error(`Missing scheduled event field ${name}`);
      return f(event, field.id);
    };
    const type = named('EventTypeId');
    if (typeof type === 'boolean' || type.kind !== 'typedIdentifier') throw Error('Invalid event type');
    return {
      id: scalar(named('EventId')), instant: scalar(named('DueAt')), phase: scalar(named('Phase')),
      stage: scalar(type.payload).split('/').at(-1)!, parents: items(named('CausalParentEventIds'), 'list').map(scalar),
      reads: items(f(row, 11n), 'list').map(value => {
        const r = rec(value, 147n), path = f(r, 2n);
        return {path: exactKey(path), label: exactText(path), exact: f(r, 3n) === true ? exactText(f(r, 4n)) : 'Absent'};
      }),
      diffs: items(f(row, 17n), 'list').map(value => {
        const r = rec(value, 148n), path = f(r, 1n);
        const before = f(r, 2n) === true ? exactText(f(r, 3n)) : 'Absent';
        const after = f(r, 4n) === true ? exactText(f(r, 5n)) : 'Absent';
        return {path: exactKey(path), label: exactText(path), before, after, changed: before !== after};
      }),
      input: exactText(f(row, 12n)), output: exactText(f(row, 13n)), draws: exactText(f(row, 14n)), quantization: exactText(f(row, 15n)),
    };
  });
}
