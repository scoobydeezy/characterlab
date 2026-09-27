import { describe, expect, it } from 'vitest';
import { projectAttempt, projectReports, admitAgencyEvidence, foldAgencyEvidence,
  type AttemptInput } from '../campaign3/agencyInterferenceSource';

const input = (changes: Partial<AttemptInput> = {}): AttemptInput => ({ attempt: 1, frozenIntent: 'deliver',
  competent: true, blocker: 'blocker-a', access: {
    A: { outcome: true, obstruction: true }, B: { outcome: true, obstruction: false },
  }, ...changes });

describe('agency-interference-source/0.1-candidate boundary', () => {
  it('preserves the supplied intent and attempt under successful or blocked execution', () => {
    const blocked = projectAttempt(input());
    const success = projectAttempt(input({ blocker: null }));
    expect(blocked.truth.success).toBe(false); expect(success.truth.success).toBe(true);
    expect(blocked.truth.intent).toBe(success.truth.intent);
    expect(blocked.truth.attempted).toBe(success.truth.attempted);
  });
  it('does not expose the hidden cause of identical failure to B', () => {
    const blocked = projectAttempt(input());
    const incompetent = projectAttempt(input({ blocker: null, competent: false }));
    const otherBlocker = projectAttempt(input({ blocker: 'blocker-b' }));
    expect(blocked.views.B).toEqual(incompetent.views.B);
    expect(blocked.views.B).toEqual(otherBlocker.views.B);
    expect(blocked.views.A).not.toEqual(otherBlocker.views.A);
    expect(admitAgencyEvidence('B', blocked.views.B)).toEqual([]);
  });
  it('distinguishes admitted obstruction from an unsuccessful outcome and counterfactual efficacy', () => {
    const competent = projectAttempt(input());
    const incompetent = projectAttempt(input({ competent: false }));
    expect(competent.views).toEqual(incompetent.views);
    expect(admitAgencyEvidence('A', competent.views.A)).toHaveLength(1);
    expect(admitAgencyEvidence('A', competent.views.A, true)).toEqual([]);
    expect(() => admitAgencyEvidence('B', competent.views.A)).toThrow('FOREIGN');
  });
  it('does not turn missing access or no observed obstruction into negative evidence', () => {
    const unseen = projectAttempt(input({ access: {
      A: { outcome: false, obstruction: false }, B: { outcome: false, obstruction: false },
    } }));
    expect(unseen.views).toEqual({ A: [], B: [] });
    expect(admitAgencyEvidence('A', projectAttempt(input({ blocker: null })).views.A)).toEqual([]);
    expect(foldAgencyEvidence([], 'GroupedMean').size).toBe(0);
  });
  it('keeps a false report recipient-specific and distinguishes known zero from unknown', () => {
    const report = projectReports([{ attempt: 1, receipt: 1, positive: false, recipients: ['B'] }]);
    expect(report.A).toEqual([]);
    const state = [...foldAgencyEvidence(admitAgencyEvidence('B', report.B), 'GroupedMean').values()][0];
    expect(state.numerator).toBe(0); expect(state.denominator).toBe(1);
  });
  it('preserves disagreement, correlation and historical observations under later reports', () => {
    const original = projectAttempt(input()).views.A;
    const archived = structuredClone(original);
    const reports = projectReports([
      { attempt: 1, receipt: 1, positive: false, recipients: ['A'] },
      { attempt: 1, receipt: 1, positive: false, recipients: ['A', 'B'] },
    ]);
    const evidence = admitAgencyEvidence('A', [...original, ...reports.A]);
    const mean = [...foldAgencyEvidence(evidence, 'GroupedMean').values()][0];
    const last = [...foldAgencyEvidence(evidence, 'LastClaim').values()][0];
    expect([mean.numerator, mean.denominator]).toEqual([1, 2]);
    expect([last.numerator, last.denominator]).toEqual([0, 1]);
    expect(mean.support).toHaveLength(2); expect(original).toEqual(archived);
    mean.support[0] = { ...mean.support[0], positive: false };
    expect(evidence[0].positive).toBe(true);
  });
  it('rejects contradictory receipt reuse before projection and contradictory evidence reuse', () => {
    expect(() => projectReports([
      { attempt: 1, receipt: 1, positive: true, recipients: ['A'] },
      { attempt: 1, receipt: 1, positive: false, recipients: ['B'] },
    ])).toThrow('RECEIPT_CONFLICT');
    const evidence = admitAgencyEvidence('A', projectReports([
      { attempt: 1, receipt: 1, positive: true, recipients: ['A'] },
    ]).A);
    expect(() => foldAgencyEvidence([...evidence, { ...evidence[0], positive: false }], 'GroupedMean')).toThrow('EVIDENCE_CONFLICT');
  });
  it('keeps separate episode support and rejects malformed finite source inputs', () => {
    const reports = projectReports([
      { attempt: 1, receipt: 1, positive: true, recipients: ['A'] },
      { attempt: 2, receipt: 2, positive: false, recipients: ['A'] },
    ]);
    expect(foldAgencyEvidence(admitAgencyEvidence('A', reports.A), 'GroupedMean').size).toBe(2);
    expect(() => projectAttempt(input({ attempt: 0 }))).toThrow('AGENCY_ID');
    expect(() => projectReports([{ attempt: 1, receipt: 1, positive: true, recipients: ['A', 'A'] }])).toThrow('RECIPIENTS');
  });
});
