import { describe, it, expect } from 'vitest';
import { conceptKey, canonicalActionKey, compareCanonical, sortCanonical, sortByScoreDesc } from '../kernel/canonical';

describe('canonical identity and ordering', () => {
  it('accepts well-formed namespace.slug keys', () => {
    expect(() => conceptKey('person.glen')).not.toThrow();
    expect(() => canonicalActionKey('action.visit_glen')).not.toThrow();
  });

  it('rejects malformed keys', () => {
    expect(() => conceptKey('Person.Glen')).toThrow();
    expect(() => conceptKey('person')).toThrow();
    expect(() => conceptKey('person..glen')).toThrow();
    expect(() => conceptKey('')).toThrow();
  });

  it('orders strings by plain code-point comparison', () => {
    expect(compareCanonical('a', 'b')).toBe(-1);
    expect(compareCanonical('b', 'a')).toBe(1);
    expect(compareCanonical('a', 'a')).toBe(0);
  });

  it('sortCanonical is stable and deterministic regardless of input order', () => {
    const items = [{ k: 'c' }, { k: 'a' }, { k: 'b' }];
    const sorted = sortCanonical(items, (i) => i.k);
    expect(sorted.map((i) => i.k)).toEqual(['a', 'b', 'c']);

    const reversed = [...items].reverse();
    const sortedReversed = sortCanonical(reversed, (i) => i.k);
    expect(sortedReversed.map((i) => i.k)).toEqual(['a', 'b', 'c']);
  });

  it('sortByScoreDesc breaks ties by canonical key ascending', () => {
    const items = [
      { k: 'action.b', score: 5 },
      { k: 'action.a', score: 5 },
      { k: 'action.c', score: 9 },
    ];
    const sorted = sortByScoreDesc(items, (i) => i.score, (i) => i.k);
    expect(sorted.map((i) => i.k)).toEqual(['action.c', 'action.a', 'action.b']);
  });
});
