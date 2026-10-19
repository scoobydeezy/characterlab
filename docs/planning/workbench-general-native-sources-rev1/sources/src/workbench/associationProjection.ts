import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec, dataField as f, dataItems as items, dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational} from '../substrate/exactMath';
import {exactKey, exactText} from './canonical';
export interface AssociationProjection {
  version: 'association-inspection/0.1'; scale: string; updatedAt: string;
  nodes: {id: string; label: string; exact: string}[];
  weights: {units: string; exact: string; display: number}[][];
}
/** Record625 is an actual directed association matrix, not a personality embedding. */
export function projectAssociation(value: CanonicalValue, scale: bigint): AssociationProjection {
  if (scale <= 0n) throw Error('Association scale must be positive');
  const graph = rec(value, 625n), keys = items(f(graph, 1n), 'list'), rows = items(f(graph, 2n), 'list');
  const at = f(graph, 3n);
  if (typeof at === 'boolean' || at.kind !== 'signed') throw Error('Association revision must be an instant');
  if (keys.length > 30 || rows.length !== keys.length || new Set(keys.map(exactKey)).size !== keys.length) throw Error('Invalid association matrix dimensions/keys');
  const weights = rows.map(row => {
    const values = items(f(rec(row, 624n), 1n), 'list');
    if (values.length !== keys.length) throw Error('Association matrix must be square');
    return values.map(value => {const units = uint(value), q = ExactRational.of(units, scale); if (units > scale) throw Error('Association weight outside the admitted unit interval'); return {units: String(units), exact: `${q.numerator}/${q.denominator}`, display: Number(units) / Number(scale)};});
  });
  return {version: 'association-inspection/0.1', scale: String(scale), updatedAt: String(at.value),
    nodes: keys.map((key, index) => ({id: exactKey(key), label: `Concept ${index + 1}`, exact: exactText(key)})), weights};
}
/** Match by exact semantic identity, never by row position or display label. */
export function associationCellDifference(a: AssociationProjection, b: AssociationProjection, row: string, column: string) {
  const ai = a.nodes.findIndex(n => n.id === row), aj = a.nodes.findIndex(n => n.id === column), bi = b.nodes.findIndex(n => n.id === row), bj = b.nodes.findIndex(n => n.id === column);
  const before = ai < 0 || aj < 0 ? null : a.weights[ai][aj].exact;
  const after = bi < 0 || bj < 0 ? null : b.weights[bi][bj].exact;
  return {before, after, changed: before !== after};
}
