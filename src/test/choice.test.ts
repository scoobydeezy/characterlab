import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { canonicalActionKey } from '../kernel/canonical';
import { buildChoiceDistribution, selectAction, ChoiceParams } from '../model/choice';
import { ScoredAction } from '../model/actions';

const params: ChoiceParams = { epsilon: ratOf(1, 2), gamma: 2 };

function scored(actionKey: string, score: Rational): ScoredAction {
  return {
    actionKey: canonicalActionKey(actionKey),
    needTerm: score,
    score,
    boundedScore: Rational.boundedResponse(score),
    perNeedContributions: [],
  };
}

describe('choice distribution and selection — Brief §24', () => {
  it('probabilities are exactly non-negative and sum to exactly 1', () => {
    const actions = [scored('action.a', ratOf(2)), scored('action.b', ratOf(-1)), scored('action.c', ratOf(0))];
    const dist = buildChoiceDistribution(actions, params);
    const sum = dist.ordered.reduce((acc, o) => acc.add(o.probability), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
    for (const o of dist.ordered) {
      expect(o.probability.gte(Rational.ZERO)).toBe(true);
    }
  });

  it('orders the distribution by CanonicalActionKey regardless of input order', () => {
    const actions = [scored('action.c', ratOf(0)), scored('action.a', ratOf(2)), scored('action.b', ratOf(-1))];
    const dist = buildChoiceDistribution(actions, params);
    expect(dist.ordered.map((o) => o.actionKey)).toEqual(['action.a', 'action.b', 'action.c']);
  });

  it('a higher score yields a strictly higher probability', () => {
    const actions = [scored('action.a', ratOf(5)), scored('action.b', ratOf(-5))];
    const dist = buildChoiceDistribution(actions, params);
    const pa = dist.ordered.find((o) => o.actionKey === 'action.a')!.probability;
    const pb = dist.ordered.find((o) => o.actionKey === 'action.b')!.probability;
    expect(pa.gt(pb)).toBe(true);
  });

  it('selectAction is deterministic and reproducible for a fixed address', () => {
    const actions = [scored('action.a', ratOf(1)), scored('action.b', ratOf(1)), scored('action.c', ratOf(1))];
    const dist = buildChoiceDistribution(actions, params);
    const addr = { seed: 's', eventId: 'e1', purposeId: 'action_selection', drawIndex: 0 };
    const first = selectAction(dist, addr);
    const second = selectAction(dist, { ...addr });
    expect(first.actionKey).toBe(second.actionKey);
    expect(first.draw.equals(second.draw)).toBe(true);
  });

  it('selectAction always returns a candidate actually in the distribution', () => {
    const actions = [scored('action.a', ratOf(1)), scored('action.b', ratOf(3)), scored('action.c', ratOf(-2))];
    const dist = buildChoiceDistribution(actions, params);
    const keys = new Set(dist.ordered.map((o) => o.actionKey));
    for (let i = 0; i < 30; i++) {
      const sel = selectAction(dist, { seed: 's', eventId: `e${i}`, purposeId: 'action_selection', drawIndex: 0 });
      expect(keys.has(sel.actionKey)).toBe(true);
    }
  });
});
