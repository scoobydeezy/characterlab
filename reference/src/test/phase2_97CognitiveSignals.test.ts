import { describe, it, expect } from 'vitest';
import { Rational, ratOf } from '../kernel/rational';
import { canonicalActionKey, conceptKey, needId } from '../kernel/canonical';
import { ActionDef, ScoredAction } from '../model/actions';
import { Option } from '../model/decision';
import { MemoryEpisode, MemoryRecord, ScoredMemory, createMemory } from '../model/memory';
import { EMPTY_IDENTITY_EVIDENCE, IdentityEvidenceState, IdentityExpressionChannelId } from '../model/identity';
import {
  needSignals,
  accessibilitySignal,
  standingIdentitySignals,
  situationalMemorySignals,
  situationalExpectationNudgeSignals,
  NeedMotiveChannelMapping,
  IdentityMotiveChannelMapping,
} from '../model/cognitiveSignals';

const GLEN = conceptKey('person.glen');
const OPT_KEEP_DINNER = canonicalActionKey('action.keep_dinner_promise');
const NEED_CONNECTION = needId('need.connection');
const NEED_ACHIEVEMENT = needId('need.achievement');

const option: Option = {
  actionDef: {
    actionKey: OPT_KEEP_DINNER,
    displayName: 'Keep Dinner Promise',
    subject: GLEN,
    subjectRole: 'Participant',
    preconditionHolds: () => true,
  } as ActionDef,
};

const needMapping: NeedMotiveChannelMapping = new Map([
  [NEED_CONNECTION, 'Connection'],
  [NEED_ACHIEVEMENT, 'Achievement'],
]);

function scoredAction(contributions: { needId: string; contribution: Rational }[]): ScoredAction {
  return {
    actionKey: OPT_KEEP_DINNER,
    needTerm: Rational.ZERO,
    score: Rational.ZERO,
    boundedScore: Rational.ZERO,
    perNeedContributions: contributions.map((c) => ({
      needId: needId(c.needId),
      urgency: Rational.ZERO,
      confidence: Rational.ZERO,
      mu: Rational.ZERO,
      contribution: c.contribution,
    })),
  };
}

describe('cognitiveSignals::needSignals', () => {
  it('attributes referent = the option\'s own subject, exactly (A_s = 1)', () => {
    const scored = scoredAction([{ needId: 'need.connection', contribution: ratOf(3, 10) }]);
    const signals = needSignals(option, scored, needMapping);
    expect(signals).toHaveLength(1);
    expect(signals[0].referent).toBe(GLEN);
    expect(signals[0].motiveChannel).toBe('Connection');
    expect(signals[0].sourceRole).toBe('MotiveGenerating');
    expect(signals[0].signedStrength.equals(ratOf(3, 10))).toBe(true);
  });

  it('drops exactly-zero contributions', () => {
    const scored = scoredAction([{ needId: 'need.connection', contribution: Rational.ZERO }]);
    expect(needSignals(option, scored, needMapping)).toHaveLength(0);
  });

  it('drops contributions from an unmapped Need (authored gap, not a crash)', () => {
    const scored = scoredAction([{ needId: 'need.security', contribution: ratOf(1, 2) }]);
    expect(needSignals(option, scored, needMapping)).toHaveLength(0);
  });

  it('one signal per mapped Need when multiple contribute', () => {
    const scored = scoredAction([
      { needId: 'need.connection', contribution: ratOf(1, 5) },
      { needId: 'need.achievement', contribution: ratOf(-1, 5) },
    ]);
    const signals = needSignals(option, scored, needMapping);
    expect(signals.map((s) => s.motiveChannel).sort()).toEqual(['Achievement', 'Connection']);
  });
});

describe('cognitiveSignals::accessibilitySignal', () => {
  it('emits a MotiveGenerating Habit-channel signal for nonzero accessibility', () => {
    const sig = accessibilitySignal(option, ratOf(2, 5));
    expect(sig).not.toBeNull();
    expect(sig!.motiveChannel).toBe('Habit');
    expect(sig!.sourceRole).toBe('MotiveGenerating');
    expect(sig!.referent).toBe(GLEN);
  });

  it('returns null for exactly-zero accessibility', () => {
    expect(accessibilitySignal(option, Rational.ZERO)).toBeNull();
  });
});

describe('cognitiveSignals::standingIdentitySignals', () => {
  const identityMapping: IdentityMotiveChannelMapping = {
    AuthorityDefiance: ['Autonomy'],
    Caregiving: ['Caregiving'],
    CommitmentFidelity: ['Commitment'],
    NoveltySeeking: ['Recreation', 'Novelty'], // multi-mapped: Brief's "one fact, multiple legitimate motives"
    RiskAcceptance: [],
    RuleAdherence: [],
    SelfProtection: [],
    SelfSacrifice: [],
    SocialApproach: [],
    WorkPersistence: [],
  };

  it('emits nothing for a channel with zero identity evidence', () => {
    const evidenceByChannel = new Map<IdentityExpressionChannelId, IdentityEvidenceState>();
    expect(standingIdentitySignals(option, evidenceByChannel, ratOf(2), identityMapping)).toHaveLength(0);
  });

  it('a multi-mapped identity channel emits one signal per mapped MotiveChannel, all sharing identical EvidenceBasis (anti-double-counting provenance)', () => {
    const evidenceByChannel = new Map<IdentityExpressionChannelId, IdentityEvidenceState>([
      ['NoveltySeeking', { support: ratOf(3), opposition: Rational.ZERO }],
    ]);
    const signals = standingIdentitySignals(option, evidenceByChannel, ratOf(2), identityMapping);
    expect(signals).toHaveLength(2);
    expect(signals.every((s) => s.sourceRole === 'StandingDisposition')).toBe(true);
    expect(new Set(signals.map((s) => s.motiveChannel))).toEqual(new Set(['Recreation', 'Novelty']));
    const [a, b] = signals;
    expect([...a.basis.weights.entries()]).toEqual([...b.basis.weights.entries()]);
    expect(a.signedStrength.equals(b.signedStrength)).toBe(true);
  });

  it('a single-mapped channel emits exactly one signal', () => {
    const evidenceByChannel = new Map<IdentityExpressionChannelId, IdentityEvidenceState>([
      ['CommitmentFidelity', { support: ratOf(5), opposition: Rational.ZERO }],
    ]);
    const signals = standingIdentitySignals(option, evidenceByChannel, ratOf(2), identityMapping);
    expect(signals).toHaveLength(1);
    expect(signals[0].motiveChannel).toBe('Commitment');
  });
});

function fakeMemory(overrides: Partial<MemoryEpisode>): ScoredMemory {
  const episode: MemoryEpisode = {
    memoryId: 'memory:1',
    experienceId: 'experience:1',
    encodedAt: 0,
    semanticConcepts: [],
    needOutcomes: [{ needId: NEED_CONNECTION, result: ratOf(2, 5) }],
    predictionErrors: [{ subject: GLEN, needId: NEED_CONNECTION, error: ratOf(1, 10) }],
    participants: [GLEN],
    location: null,
    action: OPT_KEEP_DINNER,
    conceptSalience: new Map(), // empty by default -> the pre-fix fallback path (Check 3)
    ...overrides,
  };
  const record: MemoryRecord = { memory: episode, retrievalHistory: [0] };
  return { record, base: ratOf(1), associative: ratOf(1), retrieval: ratOf(1) };
}

describe('cognitiveSignals::situationalMemorySignals / situationalExpectationNudgeSignals', () => {
  it('emits a SituationalEvidence signal whose EvidenceBasis is exactly the memory\'s own experienceId', () => {
    const retrieved = [fakeMemory({})];
    const signals = situationalMemorySignals(option, retrieved, needMapping);
    expect(signals).toHaveLength(1);
    expect(signals[0].sourceRole).toBe('SituationalEvidence');
    expect([...signals[0].basis.weights.keys()]).toEqual(['experience:1']);
  });

  it('is silent for a memory irrelevant to this option (no shared participant/action)', () => {
    const irrelevant = fakeMemory({ participants: [conceptKey('person.priya')], action: canonicalActionKey('action.stay_at_work') });
    expect(situationalMemorySignals(option, [irrelevant], needMapping)).toHaveLength(0);
  });

  it('the two independently-derived families (needOutcomes vs. predictionErrors) share the SAME EvidenceBasis when drawn from one real memory — the genuine dual-derivation case Experiments D/E need', () => {
    const retrieved = [fakeMemory({})];
    const direct = situationalMemorySignals(option, retrieved, needMapping);
    const nudge = situationalExpectationNudgeSignals(option, retrieved, needMapping);
    expect(direct).toHaveLength(1);
    expect(nudge).toHaveLength(1);
    expect([...direct[0].basis.weights.keys()]).toEqual([...nudge[0].basis.weights.keys()]);
    expect(direct[0].signalId).not.toBe(nudge[0].signalId); // distinct signals, correlated evidence
  });

  it('predictionErrors for a different subject are excluded', () => {
    const retrieved = [fakeMemory({ predictionErrors: [{ subject: conceptKey('person.priya'), needId: NEED_CONNECTION, error: ratOf(1, 10) }] })];
    expect(situationalExpectationNudgeSignals(option, retrieved, needMapping)).toHaveLength(0);
  });

  // Phase 2.97 closure audit, Check 3 (review agent finding): "presence in
  // an Experience is not equivalent to psychological centrality." A memory
  // with Glen highly salient and Priya merely present must attribute more
  // to Glen's nucleus than to Priya's, not treat the two identically.
  it('a multi-participant memory attributes referent contribution by SemanticExperience salience, not bare participants membership', () => {
    const PRIYA = conceptKey('person.priya');
    const retrieved = [
      fakeMemory({
        participants: [GLEN, PRIYA],
        conceptSalience: new Map([
          [GLEN, ratOf(4, 5)], // highly salient
          [PRIYA, ratOf(1, 5)], // merely present
        ]),
      }),
    ];
    const signals = situationalMemorySignals(option, retrieved, needMapping);
    expect(signals).toHaveLength(2);
    const glenSignal = signals.find((s) => s.referent === GLEN)!;
    const priyaSignal = signals.find((s) => s.referent === PRIYA)!;
    expect(glenSignal).toBeDefined();
    expect(priyaSignal).toBeDefined();
    // needOutcomes[0].result = 2/5; weighted by salience: Glen = 2/5*4/5 = 8/25, Priya = 2/5*1/5 = 2/25.
    expect(glenSignal.signedStrength.equals(ratOf(8, 25))).toBe(true);
    expect(priyaSignal.signedStrength.equals(ratOf(2, 25))).toBe(true);
    expect(glenSignal.signedStrength.gt(priyaSignal.signedStrength)).toBe(true);
    // Both signals share the same memory's EvidenceBasis (same provenance,
    // different attribution) — correlation consolidation cares about
    // provenance, not which referent a signal was attributed to.
    expect([...glenSignal.basis.weights.entries()]).toEqual([...priyaSignal.basis.weights.entries()]);
  });

  it('an incidental object present in the memory but never a participant gets no referent-attribution signal, even if it had salience', () => {
    const LAMP = conceptKey('object.lamp');
    const retrieved = [
      fakeMemory({
        participants: [GLEN], // the lamp is not a participant, however salient it might be perceived
        conceptSalience: new Map([
          [GLEN, ratOf(1, 2)],
          [LAMP, ratOf(9, 10)],
        ]),
      }),
    ];
    const signals = situationalMemorySignals(option, retrieved, needMapping);
    expect(signals.every((s) => s.referent !== LAMP)).toBe(true);
  });

  it('falls back to attributing wholly to the option\'s own subject when no participant has any recorded salience (legacy/pre-fix memories)', () => {
    const retrieved = [fakeMemory({ participants: [GLEN], conceptSalience: new Map() })];
    const signals = situationalMemorySignals(option, retrieved, needMapping);
    expect(signals).toHaveLength(1);
    expect(signals[0].referent).toBe(GLEN);
    expect(signals[0].signedStrength.equals(ratOf(2, 5))).toBe(true); // unweighted, exactly the pre-fix value
  });
});
