import { describe, it, expect } from 'vitest';
import {
  runExperimentA_BaselineFormation,
  runExperimentB_SameReferentSeveralMotives,
  runExperimentC_SameMotiveDifferentReferents,
} from '../experiments/reasonNucleusFormation';

describe('Phase 2.97 — Reason Nucleus Formation (real pipeline, Experiments A/B/C)', () => {
  it('Experiment A: baseline scenario forms only the channels its real seeded pressure supports, on the right referent', () => {
    const result = runExperimentA_BaselineFormation();
    expect(result.noSpuriousChannels).toBe(true);
    expect(result.keepDinnerChannels).toEqual(['Connection']);
    expect(result.stayAtWorkChannels).toEqual(['Achievement']);
    expect(result.keepDinnerReferentsAreAllGlen).toBe(true);
    expect(result.stayAtWorkReferentsAreAllWork).toBe(true);
  });

  it('Experiment B: one Option, one referent, several independently-intelligible motives -> several independent nuclei', () => {
    const result = runExperimentB_SameReferentSeveralMotives();
    expect(result.atLeastThreeIndependentNuclei).toBe(true);
    expect(result.allShareGlenAsReferent).toBe(true);
    expect(result.distinctMotiveChannels).toEqual(expect.arrayContaining(['Connection', 'Achievement', 'Recognition']));
  });

  it('Experiment C: two Options, same motive channel, different referents -> two independent nuclei, never merged', () => {
    const result = runExperimentC_SameMotiveDifferentReferents();
    expect(result.bothPresent).toBe(true);
    expect(result.referentsDiffer).toBe(true);
    expect(result.independentNuclei).toBe(true);
  });
});
