import { describe, expect, it } from 'vitest';
import {
  applyPerceptualTrackTransition,
  assertUniqueTrackTransitions,
  clonePerceptualContinuantFileState,
  continuantFileStateSummary,
  continuantTrackSemanticView,
  emptyPerceptualContinuantFileState,
  endPerceptualContinuantFile,
  PerceptualContinuantFileContractError,
  type ContinuityKind,
  type PerceptualContinuantFileState,
  type PerceptualReferentId,
  type PerceptualTrackTransition,
  type PerceptualTrackTransitionRequest,
  type SupportingObservationId,
} from '../semanticBinding/perceptualContinuantFiles';

const mina = 'character/mina';
const darius = 'character/darius';
const version = 'perceptual-continuant-files/0.1-candidate';

const observation = (observerId: string, observationId: bigint): SupportingObservationId => ({
  observerId,
  observationId,
});

const continuantFile = (observerTrackSequence: bigint, observerId = mina): PerceptualReferentId => ({
  observerId,
  observerTrackSequence,
});

/**
 * Detections and observations are allocated occurrence ordinals, not symbolic strings. The helper
 * derives a stable ordinal per detection label so the fixtures stay readable.
 */
const DETECTION_ORDINALS = new Map<string, bigint>();
const detectionOrdinal = (label: string): bigint => {
  if (!DETECTION_ORDINALS.has(label)) DETECTION_ORDINALS.set(label, BigInt(DETECTION_ORDINALS.size));
  return DETECTION_ORDINALS.get(label)!;
};

const transition = (
  continuityKind: ContinuityKind,
  detectionLabel: string,
  options: {
    readonly observerId?: string;
    readonly prior?: PerceptualReferentId;
    readonly occurredAt?: bigint;
    readonly observations?: readonly bigint[];
  } = {},
): PerceptualTrackTransitionRequest => {
  const observerId = options.observerId ?? mina;
  return {
    observerId,
    priorPerceptualReferentId: options.prior,
    currentDetectionId: { observerId, detectionOccurrenceId: detectionOrdinal(detectionLabel) },
    continuityKind,
    supportingObservationIds: (options.observations ?? [detectionOrdinal(detectionLabel) + 500n])
      .map((observationId) => observation(observerId, observationId)),
    occurredAt: options.occurredAt ?? 100n,
    transformationVersion: version,
  };
};

const failureCode = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    if (error instanceof PerceptualContinuantFileContractError) return error.code;
    throw error;
  }
  throw new Error('expected a continuant-file contract failure');
};

/** Applies a canonical detection sequence and returns the final state plus every transition. */
const runDetections = (
  requests: readonly PerceptualTrackTransitionRequest[],
  initial: PerceptualContinuantFileState = emptyPerceptualContinuantFileState(),
): { state: PerceptualContinuantFileState; transitions: readonly PerceptualTrackTransition[] } => {
  let state = initial;
  const transitions: PerceptualTrackTransition[] = [];
  for (const request of requests) {
    const result = applyPerceptualTrackTransition(state, request);
    state = result.state;
    transitions.push(result.transition);
  }
  return { state, transitions };
};

describe('SEM-001A perceptual continuant-file lifecycle', () => {
  it('CV-SEM-013 allocates observer-scoped ordinals monotonically and never reuses one', () => {
    const first = applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      transition('NewTrack', 'det/1'),
    );
    expect(first.transition.perceptualReferentId).toEqual(continuantFile(0n));

    const second = applyPerceptualTrackTransition(first.state, transition('NewTrack', 'det/2'));
    expect(second.transition.perceptualReferentId).toEqual(continuantFile(1n));

    // Retiring a file removes it from the active set but never frees its sequence.
    const retired = endPerceptualContinuantFile(second.state, {
      observerId: mina,
      perceptualReferentId: continuantFile(1n),
      supportingObservationIds: [observation(mina, 900n)],
      occurredAt: 120n,
      transformationVersion: version,
    });
    expect(retired.state.activePerceptualReferentIds).toEqual([continuantFile(0n)]);

    const reacquired = applyPerceptualTrackTransition(retired.state, transition('NewTrack', 'det/3'));
    expect(reacquired.transition.perceptualReferentId).toEqual(continuantFile(2n));
    expect(reacquired.state.nextTrackSequenceByObserver.get(mina)).toBe(3n);
  });

  it('CV-SEM-013 persists allocator state across a structural save/load boundary', () => {
    const { state } = runDetections([
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/2'),
      transition('NewTrack', 'det/1x', { observerId: darius }),
    ]);

    const restored = clonePerceptualContinuantFileState(state);
    expect(continuantFileStateSummary(restored)).toEqual(continuantFileStateSummary(state));

    // Continuation after restore allocates the next ordinal, not a reused one.
    const afterRestore = applyPerceptualTrackTransition(restored, transition('NewTrack', 'det/3'));
    const afterOriginal = applyPerceptualTrackTransition(state, transition('NewTrack', 'det/3'));
    expect(afterRestore.transition.perceptualReferentId).toEqual(continuantFile(2n));
    expect(continuantFileStateSummary(afterRestore.state))
      .toEqual(continuantFileStateSummary(afterOriginal.state));
  });

  it('CV-SEM-013 keeps allocation independent per observer under interleaving', () => {
    const solo = runDetections([
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/2'),
    ]);
    const interleaved = runDetections([
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/1x', { observerId: darius }),
      transition('NewTrack', 'det/2x', { observerId: darius }),
      transition('NewTrack', 'det/2'),
    ]);

    const minaTracks = (transitions: readonly PerceptualTrackTransition[]) => transitions
      .filter((value) => value.observerId === mina)
      .map((value) => value.perceptualReferentId);

    expect(minaTracks(interleaved.transitions)).toEqual(minaTracks(solo.transitions));
    expect(interleaved.state.nextTrackSequenceByObserver.get(mina)).toBe(2n);
    expect(interleaved.state.nextTrackSequenceByObserver.get(darius)).toBe(2n);
  });

  it('CV-SEM-019 false continuity keeps one unchanged track across two truth entities', () => {
    // Truth: Glen → occlusion → Darius. Permitted sensory input says "continues".
    const { state, transitions } = runDetections([
      transition('NewTrack', 'det/glen'),
      transition('ContinuesPriorTrack', 'det/after-occlusion', { prior: continuantFile(0n) }),
    ]);

    expect(transitions[1].perceptualReferentId).toEqual(continuantFile(0n));
    expect(transitions[1].continuityKind).toBe('ContinuesPriorTrack');
    expect(state.activePerceptualReferentIds).toEqual([continuantFile(0n)]);
    // No second file was allocated, so no truth comparison corrected, ended, or replaced the track.
    expect(state.nextTrackSequenceByObserver.get(mina)).toBe(1n);
  });

  it('CV-SEM-019 false discontinuity allocates two immutable tracks for one truth entity', () => {
    // Truth: Glen → brief loss → Glen. Observer ends track/0 and begins track/1.
    const first = applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      transition('NewTrack', 'det/glen-a'),
    );
    const ended = endPerceptualContinuantFile(first.state, {
      observerId: mina,
      perceptualReferentId: continuantFile(0n),
      supportingObservationIds: [observation(mina, 901n)],
      occurredAt: 110n,
      transformationVersion: version,
    });
    const second = applyPerceptualTrackTransition(ended.state, transition('NewTrack', 'det/glen-b'));

    expect(second.transition.perceptualReferentId).toEqual(continuantFile(1n));
    expect(second.state.activePerceptualReferentIds).toEqual([continuantFile(1n)]);
    // The first transition record is untouched by the later reacquisition.
    expect(first.transition.perceptualReferentId).toEqual(continuantFile(0n));
    expect(Object.isFrozen(first.transition)).toBe(true);
  });

  it('CV-SEM-021 derives transitions solely from permitted observer-side evidence', () => {
    const applied = applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      transition('NewTrack', 'det/1', { observations: [11n, 12n] }),
    );
    expect(applied.transition.supportingObservationIds.map((value) => value.observationId))
      .toEqual([11n, 12n]);

    // A truth-side field cannot enter the transition request.
    expect(failureCode(() => applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      { ...transition('NewTrack', 'det/1'), truthEntityId: 'person/glen' } as never,
    ))).toBe('FORBIDDEN_TRUTH_FIELD');

    // Continuity is exactly binary.
    expect(failureCode(() => applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      { ...transition('NewTrack', 'det/1'), continuityKind: 'ProbablyContinues' as ContinuityKind },
    ))).toBe('INVALID_TRACK_TRANSITION');

    // Supporting observation support is mandatory and observer-owned.
    expect(failureCode(() => applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      transition('NewTrack', 'det/1', { observations: [] }),
    ))).toBe('INVALID_SUPPORTING_OBSERVATION');
    expect(failureCode(() => applyPerceptualTrackTransition(
      emptyPerceptualContinuantFileState(),
      {
        ...transition('NewTrack', 'det/1'),
        supportingObservationIds: [observation(darius, 902n)],
      },
    ))).toBe('CROSS_OBSERVER_REFERENCE');
  });

  it('CV-SEM-021 rejects forged, cross-observer, and inactive prior continuant-files', () => {
    const { state } = runDetections([transition('NewTrack', 'det/1')]);

    expect(failureCode(() => applyPerceptualTrackTransition(
      state,
      transition('ContinuesPriorTrack', 'det/2', { prior: continuantFile(0n, darius) }),
    ))).toBe('CROSS_OBSERVER_REFERENCE');

    expect(failureCode(() => applyPerceptualTrackTransition(
      state,
      transition('ContinuesPriorTrack', 'det/2', { prior: continuantFile(42n) }),
    ))).toBe('INACTIVE_CONTINUANT_FILE');

    expect(failureCode(() => applyPerceptualTrackTransition(
      state,
      transition('NewTrack', 'det/2', { prior: continuantFile(0n) }),
    ))).toBe('INVALID_TRACK_TRANSITION');
  });

  it('SEM-001I.1 keys exactly one track transition per continuant detection', () => {
    const { transitions } = runDetections([
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/2'),
    ]);
    expect(() => assertUniqueTrackTransitions(transitions)).not.toThrow();

    const duplicated = [...transitions, transitions[0]];
    expect(failureCode(() => assertUniqueTrackTransitions(duplicated)))
      .toBe('DUPLICATE_DETECTION_TRANSITION');
  });

  it('SEM-001I.1 permits exactly one retirement occurrence per continuant-file', () => {
    const { state } = runDetections([transition('NewTrack', 'det/1')]);
    const endRequest = {
      observerId: mina,
      perceptualReferentId: continuantFile(0n),
      supportingObservationIds: [observation(mina, 900n)],
      occurredAt: 130n,
      transformationVersion: version,
    };
    const ended = endPerceptualContinuantFile(state, endRequest);
    expect(ended.state.activePerceptualReferentIds).toEqual([]);

    // A second retirement of the same file has nothing active to retire.
    expect(failureCode(() => endPerceptualContinuantFile(ended.state, endRequest)))
      .toBe('INACTIVE_CONTINUANT_FILE');
    // Recognition and truth cannot end another observer's file.
    expect(failureCode(() => endPerceptualContinuantFile(state, {
      ...endRequest,
      observerId: darius,
    }))).toBe('CROSS_OBSERVER_REFERENCE');
  });

  it('CV-SEM-022 keeps track ordinals psychologically inert under renaming', () => {
    const detections: readonly PerceptualTrackTransitionRequest[] = [
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/2'),
      transition('ContinuesPriorTrack', 'det/3', { prior: continuantFile(0n) }),
    ];
    const baseline = runDetections(detections);

    // An isomorphic run whose observer allocator starts at 100 instead of 0.
    const shiftedStart: PerceptualContinuantFileState = {
      nextTrackSequenceByObserver: new Map([[mina, 100n]]),
      activePerceptualReferentIds: [],
    };
    const shifted = runDetections([
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/2'),
      transition('ContinuesPriorTrack', 'det/3', { prior: continuantFile(100n) }),
    ], shiftedStart);

    expect(shifted.transitions[0].perceptualReferentId)
      .not.toEqual(baseline.transitions[0].perceptualReferentId);
    expect(continuantTrackSemanticView(shifted.transitions))
      .toEqual(continuantTrackSemanticView(baseline.transitions));
  });

  it('CV-SEM-022 leaves this observer’s semantic view unchanged by another observer’s tracks', () => {
    const solo = runDetections([
      transition('NewTrack', 'det/1'),
      transition('ContinuesPriorTrack', 'det/2', { prior: continuantFile(0n) }),
    ]);
    const withDarius = runDetections([
      transition('NewTrack', 'det/1x', { observerId: darius }),
      transition('NewTrack', 'det/1'),
      transition('NewTrack', 'det/2x', { observerId: darius }),
      transition('ContinuesPriorTrack', 'det/2', { prior: continuantFile(0n) }),
    ]);

    const minaOnly = withDarius.transitions.filter((value) => value.observerId === mina);
    expect(continuantTrackSemanticView(minaOnly))
      .toEqual(continuantTrackSemanticView(solo.transitions));
  });
});
