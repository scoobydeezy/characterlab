import { describe, it, expect } from 'vitest';
import {
  runExperimentG_StandingModifierPresentVsAblated,
  runExperimentH_NoMeaningFromNothingRealBootstrap,
  runExperimentI_RealPipelineRescue,
} from '../experiments/identityAsModifier';

describe('Phase 2.97 — Identity as a Standing Modifier (Experiments G/H/I, real pipeline)', () => {
  it('Experiment G: a real, bootstrapped identity shows up as a standing modifier only when present, never as a separate die', () => {
    const result = runExperimentG_StandingModifierPresentVsAblated();
    expect(result.workPersistenceStrength.isZero()).toBe(false);
    expect(result.bothActivateOnNeedAlone).toBe(true);
    expect(result.standingModifierPresentOnlyWithIdentity).toBe(true);
    expect(result.baseMotiveStrengthUnaffectedByAblation).toBe(true);
  });

  it('Experiment H (closure audit, Check 1): CommitmentFidelity now has a real Commitment nucleus to modify, and the no-meaning-from-nothing rule still holds elsewhere', () => {
    const result = runExperimentH_NoMeaningFromNothingRealBootstrap();
    expect(result.commitmentFidelityEvidenceIsGenuinelyNonzero).toBe(true);
    // The fix: 'Commitment' now forms, because `defaultCommitments()` gives
    // it a real, non-Need MotiveGenerating base — the pre-audit finding (no
    // Commitment nucleus could ever exist) is corrected.
    expect(result.commitmentChannelNucleusNowExists).toBe(true);
    expect(result.channelsThatDidForm).toContain('Commitment');
    // No double-counting: ablating CommitmentFidelity never moves the
    // nucleus's own base motive strength (only its standing modifier).
    expect(result.commitmentBaseMotiveStrengthUnaffectedByAblation).toBe(true);
    // The structural claim survives: a channel this scenario still gives no
    // Need-sourced MotiveGenerating pressure to (Caregiving) forms no
    // nucleus even under real, substantial, directly-injected evidence.
    expect(result.caregivingEvidenceIsGenuinelyNonzero).toBe(true);
    expect(result.noCaregivingChannelNucleusExistsDespiteRealEvidence).toBe(true);
    // Second correction (Commitment modeled as a real source, not a Need):
    // a genuinely strong CommitmentFidelity identity produces a nonzero
    // standing modifier on the real Commitment nucleus, and that nucleus's
    // referent is the commitment itself, never its stakeholder.
    expect(result.strongCommitmentFidelityStrength.isZero()).toBe(false);
    expect(result.commitmentStandingModifierNonzeroWhenIdentityIsStrong).toBe(true);
    expect(result.commitmentNucleusReferentIsTheCommitmentItself).toBe(true);
  });

  it('Experiment I: a real weak-but-genuine motive is dropped alone, but rescued into a floored d4 nucleus by a real standing modifier on the same channel', () => {
    const result = runExperimentI_RealPipelineRescue();
    expect(result.nucleusAbsentWithoutIdentity).toBe(true);
    expect(result.nucleusPresentAndFlooredWithIdentity).toBe(true);
  });
});
