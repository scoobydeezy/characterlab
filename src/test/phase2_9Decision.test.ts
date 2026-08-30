import { describe, it, expect } from 'vitest';
import { ratOf, Rational } from '../kernel/rational';
import { canonicalActionKey, conceptKey } from '../kernel/canonical';
import { ActionDef } from '../model/actions';
import {
  Decision,
  DecisionInfluence,
  DecisionParams,
  DieScaleParams,
  strengthToDie,
  resolveDecision,
} from '../model/decision';

const ACTION_A = canonicalActionKey('action.dilemma_a');
const ACTION_B = canonicalActionKey('action.dilemma_b');
const SUBJECT = conceptKey('person.somebody');

function fakeAction(key = ACTION_A): ActionDef {
  return {
    actionKey: key,
    displayName: key,
    subject: SUBJECT,
    subjectRole: 'Participant',
    preconditionHolds: () => true,
  };
}

const DIE_SCALE: DieScaleParams = {
  weak: ratOf(1, 10),
  moderate: ratOf(3, 10),
  strong: ratOf(1, 2),
  veryStrong: ratOf(7, 10),
  extreme: ratOf(9, 10),
};

const PARAMS: DecisionParams = {
  dieScale: DIE_SCALE,
  thetaRoll: ratOf(1, 2),
  thetaPlayer: ratOf(3, 10),
  thetaTrait: ratOf(3, 10),
  thetaConfidence: ratOf(3, 10),
  kI: ratOf(2),
  kC: ratOf(2),
  identityFeedbackEnabled: true,
};

function influence(
  optionKey = ACTION_A,
  strength: Rational,
  reasonChannel = 'need.test',
  idSuffix = '0',
): DecisionInfluence {
  return {
    influenceId: `${optionKey}:${reasonChannel}:${idSuffix}`,
    optionKey,
    reasonChannel,
    source: 'test',
    rawStrength: strength,
    signedStrength: strength,
  };
}

describe('strengthToDie — die-size calibration and the floor', () => {
  it('maps each threshold band to the correct die size', () => {
    expect(strengthToDie(ratOf(1, 10), DIE_SCALE)).toBe(4);
    expect(strengthToDie(ratOf(3, 10), DIE_SCALE)).toBe(6);
    expect(strengthToDie(ratOf(1, 2), DIE_SCALE)).toBe(8);
    expect(strengthToDie(ratOf(7, 10), DIE_SCALE)).toBe(10);
    expect(strengthToDie(ratOf(9, 10), DIE_SCALE)).toBe(12);
    expect(strengthToDie(ratOf(1), DIE_SCALE)).toBe(12);
  });

  it('drops anything strictly below the weak threshold — no die at all', () => {
    expect(strengthToDie(ratOf(1, 20), DIE_SCALE)).toBeNull();
    expect(strengthToDie(Rational.ZERO, DIE_SCALE)).toBeNull();
  });

  it('is sign-agnostic on magnitude — a negative strength maps by absolute value', () => {
    expect(strengthToDie(ratOf(-7, 10), DIE_SCALE)).toBe(10);
  });
});

describe('resolveDecision — bounds (Brief §35)', () => {
  it('pre-roll probabilities sum to exactly 1, Contest ∈ [0,1], Stake ∈ [0,1), AuthorshipPotential ∈ [0,1]', () => {
    const decision: Decision = { decisionId: 'decision:1', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(3, 10))]],
      [ACTION_B, [influence(ACTION_B, ratOf(-3, 10))]],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-1');
    const sum = res.preRollOptionProbabilities.reduce((acc, p) => acc.add(p.probability), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
    expect(res.contest.gte(Rational.ZERO)).toBe(true);
    expect(res.contest.lte(Rational.ONE)).toBe(true);
    expect(res.stake.gte(Rational.ZERO)).toBe(true);
    expect(res.stake.lt(Rational.ONE)).toBe(true);
    expect(res.authorshipPotential.gte(Rational.ZERO)).toBe(true);
    expect(res.authorshipPotential.lte(Rational.ONE)).toBe(true);
  });
});

describe('resolveDecision — resolution-mode classification', () => {
  it('auto-resolves an obvious choice (one option overwhelmingly stronger) — Contest low, no dice thrown', () => {
    const decision: Decision = { decisionId: 'decision:obvious', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(95, 100))]],
      [ACTION_B, [influence(ACTION_B, ratOf(1, 10))]],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-obvious');
    expect(res.resolutionMode).toBe('Auto');
    expect(res.influenceRolls.length).toBe(0);
    expect(res.chosenOption).toBe(ACTION_A);
    expect(res.chosenIntent).toBe(ACTION_A);
  });

  it('rolls dice for a genuinely contested decision (Contest >= thetaRoll)', () => {
    // Each Option carries its OWN positive-signed supporting reasons (a
    // reason is "for" whichever Option it's attached to, via optionKey —
    // never a mirrored negative on the other Option), of comparable
    // magnitude, so neither Option's distribution dominates the other's.
    const decision: Decision = { decisionId: 'decision:contested', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(1, 2), 'need.a'), influence(ACTION_A, ratOf(1, 2), 'need.b', '1')]],
      [ACTION_B, [influence(ACTION_B, ratOf(1, 2), 'need.c'), influence(ACTION_B, ratOf(1, 2), 'need.d', '1')]],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-contested');
    expect(res.resolutionMode).not.toBe('Auto');
    expect(res.influenceRolls.length).toBe(4);
    expect([ACTION_A, ACTION_B]).toContain(res.chosenOption);
  });

  it('a trivial decision ("tea or coffee?" — 50/50 but essentially no motivational mass behind either option) rolls quietly rather than player-facing', () => {
    // Brief §10's own example: a trivial decision can be highly contested
    // (a coin flip) while being psychologically unimportant. With NO
    // surviving influences on either side, both distributions collapse to
    // pointMass(0n) — a guaranteed tie (Contest=1 via the fair tie-share)
    // with zero motivational mass (M_o=0 on both leading options ⇒
    // ConflictMass=0 ⇒ Stake=0) ⇒ AuthorshipPotential=0 ⇒ QuietRoll. Note a
    // die's expected value alone (2.5 for the smallest d4) already pushes
    // Stake into the ~0.7-0.87 range once ANY influence clears the floor —
    // so "trivial" here means "nothing cleared the floor at all," not
    // merely "a weak reason," which is why this case is constructed with
    // empty influence lists rather than one weak influence per side.
    const decision: Decision = { decisionId: 'decision:trivial', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map<typeof ACTION_A, DecisionInfluence[]>([
      [ACTION_A, []],
      [ACTION_B, []],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-trivial');
    expect(res.contest.equals(Rational.ONE)).toBe(true);
    expect(res.stake.equals(Rational.ZERO)).toBe(true);
    expect(res.authorshipPotential.equals(Rational.ZERO)).toBe(true);
    expect(res.resolutionMode).toBe('QuietRoll');
  });

  it('a meaningful conflict (near-balanced, strong reasons on both sides) becomes player-facing', () => {
    const decision: Decision = { decisionId: 'decision:meaningful', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    // Identical strong positive influences on both options: Contest=1
    // (perfectly tied distributions) AND high motivational mass ⇒ high
    // Stake ⇒ high AuthorshipPotential ⇒ PlayerFacingRoll.
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(7, 10))]],
      [ACTION_B, [influence(ACTION_B, ratOf(7, 10))]],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-meaningful');
    expect(res.resolutionMode).toBe('PlayerFacingRoll');
  });
});

describe('resolveDecision — influences below the die floor are excluded entirely', () => {
  it('a below-floor influence contributes no die, is absent from influenceRolls, and does not affect M_o', () => {
    const decision: Decision = { decisionId: 'decision:floor', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(7, 10), 'need.a'), influence(ACTION_A, ratOf(1, 100), 'negligible', '1')]],
      [ACTION_B, [influence(ACTION_B, ratOf(7, 10), 'need.b')]],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-floor');
    expect(res.survivingInfluencesByOption.get(ACTION_A)!.length).toBe(1);
    expect(res.resolutionMode).not.toBe('Auto'); // identical A/B distributions ⇒ genuinely rolled, so the assertion below is non-vacuous
    expect(res.influenceRolls.length).toBeGreaterThan(0);
    expect(res.influenceRolls.every((r) => r.influenceId !== `${ACTION_A}:negligible:1`)).toBe(true);
  });
});

describe('resolveDecision — deterministic replay', () => {
  it('the same (decisionId, influences, seed) always produces identical rolls and outcome', () => {
    const decision: Decision = { decisionId: 'decision:replay', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(6, 10))]],
      [ACTION_B, [influence(ACTION_B, ratOf(6, 10))]],
    ]);
    const run1 = resolveDecision(decision, influences, PARAMS, 'seed-replay');
    const run2 = resolveDecision(decision, influences, PARAMS, 'seed-replay');
    expect(run1.resolutionMode).not.toBe('Auto'); // identical distributions ⇒ genuinely rolled
    expect(run1.influenceRolls.length).toBeGreaterThan(0);
    expect(run1.chosenOption).toBe(run2.chosenOption);
    expect(run1.influenceRolls.length).toBe(run2.influenceRolls.length);
    for (let i = 0; i < run1.influenceRolls.length; i++) {
      expect(run1.influenceRolls[i].rollValue).toBe(run2.influenceRolls[i].rollValue);
      expect(run1.influenceRolls[i].draw.equals(run2.influenceRolls[i].draw)).toBe(true);
    }
  });

  it('an unrelated draw elsewhere (a different decisionId) never shifts this Decision\'s roll (Brief §7)', () => {
    const decision: Decision = { decisionId: 'decision:isolated', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(6, 10))]],
      [ACTION_B, [influence(ACTION_B, ratOf(6, 10))]],
    ]);
    const before = resolveDecision(decision, influences, PARAMS, 'seed-isolated');
    // Draw an unrelated decision under the same seed first.
    resolveDecision(
      { decisionId: 'decision:other', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] },
      influences,
      PARAMS,
      'seed-isolated',
    );
    const after = resolveDecision(decision, influences, PARAMS, 'seed-isolated');
    expect(before.influenceRolls.length).toBeGreaterThan(0); // identical distributions ⇒ genuinely rolled
    expect(before.chosenOption).toBe(after.chosenOption);
    for (let i = 0; i < before.influenceRolls.length; i++) {
      expect(before.influenceRolls[i].rollValue).toBe(after.influenceRolls[i].rollValue);
    }
  });
});

describe('resolveDecision — a tie at the max RollScore uses a deterministic tie-resolution draw', () => {
  it('produces a tieBreak record when two options tie exactly, and still picks one deterministically', () => {
    // Both options get exactly one identically-calibrated die influence, so
    // ties are a real, frequent outcome across repeated seeds — scan a
    // handful of seeds to exercise the tie path at least once.
    const decision: Decision = { decisionId: 'decision:tie', actor: SUBJECT, options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }] };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(1, 2))]],
      [ACTION_B, [influence(ACTION_B, ratOf(1, 2))]], // same sign, same magnitude: symmetric distributions
    ]);
    let sawTie = false;
    for (let i = 0; i < 50 && !sawTie; i++) {
      const res = resolveDecision({ ...decision, decisionId: `decision:tie:${i}` }, influences, PARAMS, 'seed-tie');
      if (res.tieBreak) {
        sawTie = true;
        expect(res.tieBreak.candidates).toContain(res.chosenOption);
      }
    }
    expect(sawTie).toBe(true);
  });
});

describe('resolveDecision — 3-option ConflictMass uses the same top-2-by-probability pair Margin/Contest use', () => {
  it('does not throw and produces bounded Contest/Stake with 3 options', () => {
    const ACTION_C = canonicalActionKey('action.dilemma_c');
    const decision: Decision = {
      decisionId: 'decision:three',
      actor: SUBJECT,
      options: [{ actionDef: fakeAction(ACTION_A) }, { actionDef: fakeAction(ACTION_B) }, { actionDef: fakeAction(ACTION_C) }],
    };
    const influences = new Map([
      [ACTION_A, [influence(ACTION_A, ratOf(6, 10))]],
      [ACTION_B, [influence(ACTION_B, ratOf(5, 10))]],
      [ACTION_C, [influence(ACTION_C, ratOf(1, 10))]],
    ]);
    const res = resolveDecision(decision, influences, PARAMS, 'seed-three');
    const sum = res.preRollOptionProbabilities.reduce((acc, p) => acc.add(p.probability), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
    expect(res.contest.gte(Rational.ZERO)).toBe(true);
    expect(res.contest.lte(Rational.ONE)).toBe(true);
  });
});
