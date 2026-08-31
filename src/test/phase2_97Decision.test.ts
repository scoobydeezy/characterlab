import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { canonicalActionKey, conceptKey } from '../kernel/canonical';
import { convolve, negate, pointMass, uniformDie } from '../kernel/discreteDistribution';
import { Decision, resolveReasonDiceExpressions } from '../model/decision';
import { CompiledNucleus } from '../model/diceCompiler';
import { ActionDef } from '../model/actions';

const OPT_A = canonicalActionKey('action.opt_a');
const OPT_B = canonicalActionKey('action.opt_b');
const GLEN = conceptKey('person.glen');
const WORK = conceptKey('activity.work');

function actionDef(key: typeof OPT_A, subject: typeof GLEN): ActionDef {
  return { actionKey: key, displayName: key, subject, subjectRole: 'Participant', preconditionHolds: () => true };
}

const decision: Decision = {
  decisionId: 'decision:test',
  actor: conceptKey('person.mina'),
  options: [{ actionDef: actionDef(OPT_A, GLEN) }, { actionDef: actionDef(OPT_B, WORK) }],
};

function nucleus(optionKey: typeof OPT_A, faces: number, direction: 'Pursue' | 'Avoid', modifier: number): CompiledNucleus {
  const magnitude = convolve(uniformDie(faces, 1), pointMass(BigInt(modifier)));
  const distribution = direction === 'Avoid' ? negate(magnitude) : magnitude;
  return {
    key: { optionKey, motiveChannel: 'Connection', referent: GLEN, direction },
    baseMotiveStrength: ratOf(1, 2),
    reasonRelevance: ratOf(1, 2),
    baseDie: faces,
    standingModifier: modifier,
    situationalModifier: 0,
    finalModifier: modifier,
    distribution,
    sourceSignals: [],
    correlationTrace: [],
  };
}

describe('decision::resolveReasonDiceExpressions', () => {
  it('produces exact pre-roll probabilities summing to 1, using the SAME shared core resolveDecision uses', () => {
    const compiledByOption = new Map([
      [OPT_A, [nucleus(OPT_A, 8, 'Pursue', 1)]],
      [OPT_B, [nucleus(OPT_B, 6, 'Pursue', 0)]],
    ]);
    const resolution = resolveReasonDiceExpressions(decision, compiledByOption, ratOf(3, 10), ratOf(3, 10), 'seed-1');
    const sum = resolution.preRollOptionProbabilities.reduce((acc, p) => acc.add(p.probability), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
    expect(resolution.margin.gte(Rational.ZERO)).toBe(true);
    expect(resolution.contest.equals(Rational.ONE.sub(resolution.margin))).toBe(true);
  });

  it('is deterministic: same seed/inputs -> identical resolution, including rolls', () => {
    const compiledByOption = new Map([
      [OPT_A, [nucleus(OPT_A, 8, 'Pursue', 1)]],
      [OPT_B, [nucleus(OPT_B, 8, 'Avoid', -1)]],
    ]);
    const a = resolveReasonDiceExpressions(decision, compiledByOption, ratOf(1, 100), ratOf(1, 100), 'seed-determinism');
    const b = resolveReasonDiceExpressions(decision, compiledByOption, ratOf(1, 100), ratOf(1, 100), 'seed-determinism');
    expect(a.chosenOption).toBe(b.chosenOption);
    expect(a.influenceRolls.map((r) => r.signedContribution)).toEqual(b.influenceRolls.map((r) => r.signedContribution));
  });

  it("rolled reasons' signedContribution folds the modifier in as Polarity*(rollValue+addend), matching the reason's own distribution support", () => {
    const compiledByOption = new Map([
      [OPT_A, [nucleus(OPT_A, 8, 'Pursue', 2)]],
      [OPT_B, [nucleus(OPT_B, 8, 'Pursue', 2)]],
    ]);
    // Force a rolled (non-Auto) resolution by setting thetaRoll to 0.
    const resolution = resolveReasonDiceExpressions(decision, compiledByOption, Rational.ZERO, ratOf(2), 'seed-roll');
    expect(resolution.influenceRolls.length).toBeGreaterThan(0);
    for (const roll of resolution.influenceRolls) {
      expect(roll.signedContribution).toBe(roll.sign * (roll.rollValue + 2));
    }
  });

  it('survivingInfluencesByOption is empty (legacy-only field, not meaningful for the Reason Nuclei pipeline)', () => {
    const compiledByOption = new Map([[OPT_A, [nucleus(OPT_A, 8, 'Pursue', 0)]]]);
    const resolution = resolveReasonDiceExpressions(decision, compiledByOption, ratOf(3, 10), ratOf(3, 10), 'seed-2');
    expect(resolution.survivingInfluencesByOption.size).toBe(0);
  });

  it('an Option with no active nuclei gets a degenerate RollScore≡0 (pointMass identity) rather than crashing', () => {
    const compiledByOption = new Map([[OPT_A, [nucleus(OPT_A, 6, 'Pursue', 0)]]]); // OPT_B absent entirely
    const resolution = resolveReasonDiceExpressions(decision, compiledByOption, ratOf(3, 10), ratOf(3, 10), 'seed-3');
    const sum = resolution.preRollOptionProbabilities.reduce((acc, p) => acc.add(p.probability), Rational.ZERO);
    expect(sum.equals(Rational.ONE)).toBe(true);
  });
});
