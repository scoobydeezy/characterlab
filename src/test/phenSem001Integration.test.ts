/**
 * `SEM-001` acceptance gate, item 6: *the complete multi-observer fixture passes through immediate
 * consumers and save/load replay.*
 *
 * The run itself lives in `fixtures/phenSem001Run.ts`, shared with the `SEM-001J` integrated gate so
 * the two obligations cannot drift onto different runs. This file asserts the persistence claim.
 */
import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, type CanonicalValue } from '../substrate/canonicalEncoding';
import { createCanonicalSave, loadCanonicalSave } from '../substrate/persistence';
import { DeterministicScheduler, type EventHandler } from '../substrate/scheduler';
import { simInstant } from '../substrate/time';
import { continuantFileStateSummary } from '../semanticBinding/perceptualContinuantFiles';
import { SEMANTIC_RECORD_SCHEMAS } from '../semanticBinding/semanticSchemaRegistry';
import { DARIUS, GLEN, MINA, type ObserverId } from './fixtures/phenSem001';
import { RENDERER_VIEWPOINTS } from './fixtures/phenSem001Renderer';
import {
  OBSERVE, SCHEDULE, adapter, handlerKey, identities, initialState, observeHandler,
  observerPayload, scheduler, type FixtureState,
} from './fixtures/phenSem001Run';

describe('SEM-001 gate item 6 — the complete fixture through consumers and persistence', () => {
  it('replays the three-observer fixture byte-identically across a save/load boundary', async () => {
    const state = initialState();
    const identity = await identities(state);
    const handlers = new Map([[handlerKey(OBSERVE), observeHandler()]]);

    const schedule = (
      instance: DeterministicScheduler<FixtureState>,
      [observerId, at, experienceId]: readonly [ObserverId, bigint, bigint],
    ) => instance.schedule({
      dueAt: simInstant(at), phase: 10n, eventTypeId: OBSERVE,
      payload: observerPayload(observerId, experienceId), dependencies: list([]),
    });

    const save = (instance: DeterministicScheduler<FixtureState>) => createCanonicalSave({
      scheduler: instance,
      stateAdapter: adapter,
      modelIdentity: identity.modelIdentity,
      runIdentity: identity.runIdentity,
      continuingRunInputs: list([]),
    });

    const load = (bytes: Uint8Array) => loadCanonicalSave(bytes, {
      stateAdapter: adapter,
      handlers,
      maxSettlementWorkPerSimulationInstant: 200n,
      expectedModelIdentity: identity.modelIdentity,
      expectedRunIdentity: identity.runIdentity,
      additionalSchemas: SEMANTIC_RECORD_SCHEMAS,
    });

    // A: all three observers straight through, no persistence boundary.
    const straight = scheduler(state, handlers);
    for (const entry of SCHEDULE) {
      schedule(straight, entry);
      await straight.settleNextInstant();
    }
    const straightBytes = save(straight);
    const straightSnapshot = straight.exportQuiescentSnapshot();

    // The fixture really did run: all three observers, each with their own tracks and outputs.
    expect(straight.getState().continuantFiles.nextTrackSequenceByObserver.get(MINA)).toBe(3n);
    expect(straight.getState().continuantFiles.nextTrackSequenceByObserver.get(DARIUS)).toBe(2n);
    expect(straight.getState().continuantFiles.nextTrackSequenceByObserver.get(GLEN)).toBe(3n);
    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      expect(straight.getState().eventFiles.nextEventSequenceByObserver.get(observerId)).toBe(1n);
    }

    // Every immediate consumer contributed: semantics, causal roles, identity, and all three
    // rendered viewpoints, for each of the three observers.
    const outputText = straightSnapshot.outputs.map((value) =>
      typeof value !== 'boolean' && value.kind === 'text' ? value.value : '');
    for (const observerId of [MINA, DARIUS, GLEN] as const) {
      expect(outputText.some((line) => line.startsWith(`view:${observerId}:`))).toBe(true);
      expect(outputText.some((line) => line.startsWith(`causal:${observerId}:`))).toBe(true);
      const resolved = outputText.find((line) => line.startsWith(`identity:${observerId}:`))!
        .slice(`identity:${observerId}:`.length);
      expect(resolved.startsWith('person.')).toBe(true);

      for (const viewpoint of RENDERER_VIEWPOINTS) {
        const rendered = outputText.filter((line) =>
          line.startsWith(`render:${observerId}:${viewpoint}:`));
        expect(rendered.length).toBeGreaterThan(0);
        // The recognition consumer's result reaches the renderer consumer: exactly one rendered
        // line carries the identity that recognition resolved, and the rest are unrecognised.
        expect(rendered.filter((line) => line.endsWith(`identity:${resolved}`))).toHaveLength(1);
      }
    }

    // B: the same three observers with a persistence boundary after the second.
    const interrupted = scheduler(state, handlers);
    schedule(interrupted, SCHEDULE[0]);
    await interrupted.settleNextInstant();
    schedule(interrupted, SCHEDULE[1]);
    await interrupted.settleNextInstant();
    const midpointBytes = save(interrupted);

    const loaded = await load(midpointBytes);
    // Loading and immediately re-saving reproduces the midpoint exactly: the boundary itself adds
    // nothing and loses nothing.
    expect(bytesToHex(save(loaded.scheduler))).toBe(bytesToHex(midpointBytes));
    expect(loaded.scheduler.getAllocatorState()).toEqual(interrupted.getAllocatorState());

    // Both observers who ran before the boundary come back with their own counters intact.
    expect(loaded.scheduler.getState().continuantFiles.nextTrackSequenceByObserver.get(MINA)).toBe(3n);
    expect(loaded.scheduler.getState().continuantFiles.nextTrackSequenceByObserver.get(DARIUS)).toBe(2n);
    expect(loaded.scheduler.getState().continuantFiles.nextTrackSequenceByObserver.has(GLEN)).toBe(false);

    // The third observer runs on the far side of the boundary, through the same handler and the
    // same consumers.
    schedule(loaded.scheduler, SCHEDULE[2]);
    await loaded.scheduler.settleNextInstant();

    // State roots, all three observers' counters, allocators, committed trace, and outputs are
    // byte-identical to the run that never crossed a boundary.
    expect(bytesToHex(save(loaded.scheduler))).toBe(bytesToHex(straightBytes));
    const loadedSnapshot = loaded.scheduler.exportQuiescentSnapshot();

    // The trace is compared by canonical encoding rather than by value tree. `cenc/1` canonicalises
    // map order at encode time, so a state root built by insertion and one restored from a
    // canonically ordered save hold the same content in different in-memory order. Identity lives
    // in the bytes; a value-tree comparison would report a difference that does not exist and, more
    // importantly, would let a genuine content change hide behind a matching shape.
    const traceBytes = (trace: readonly CanonicalValue[]) => bytesToHex(canonicalEncode(list([...trace])));
    expect(traceBytes(loadedSnapshot.committedTrace)).toBe(traceBytes(straightSnapshot.committedTrace));
    expect(loadedSnapshot.outputs).toEqual(straightSnapshot.outputs);
    expect(loaded.scheduler.getAllocatorState()).toEqual(straight.getAllocatorState());
  });

  it('draws every occurrence identity from the scheduler allocator rather than the fixture', async () => {
    // The save/load comparison above is only meaningful if the projection's occurrence identities
    // actually come from the scheduler. Two runs from different allocator origins must therefore
    // produce different ordinals — and identical semantics.
    const state = initialState();
    const identity = await identities(state);
    const handlers = new Map([[handlerKey(OBSERVE), observeHandler()]]);

    const runFrom = async (nextRuntimeId: bigint) => {
      const instance = new DeterministicScheduler({
        initialState: state,
        stateAdapter: adapter,
        handlers,
        maxSettlementWorkPerSimulationInstant: 200n,
        initialAllocators: { nextRuntimeId, nextEventId: 0n, nextEventSequence: 0n },
      });
      for (const [observerId, at, experienceId] of SCHEDULE) {
        instance.schedule({
          dueAt: simInstant(at), phase: 10n, eventTypeId: OBSERVE,
          payload: observerPayload(observerId, experienceId), dependencies: list([]),
        });
        await instance.settleNextInstant();
      }
      return instance;
    };

    const base = await runFrom(5000n);
    const shifted = await runFrom(90000n);

    // The fixture's occurrence identities really are drawn from the scheduler: its runtime
    // allocator advanced by what the three observers consumed. A fixture that minted its own
    // ordinals would leave this delta at zero while every other assertion below still passed.
    const consumed = (instance: DeterministicScheduler<FixtureState>, origin: bigint) =>
      instance.getAllocatorState().nextRuntimeId - origin;
    expect(consumed(base, 5000n)).toBeGreaterThan(0n);
    expect(consumed(shifted, 90000n)).toBe(consumed(base, 5000n));

    // And different origins really do move the allocated identities.
    expect(shifted.getAllocatorState().nextRuntimeId)
      .not.toBe(base.getAllocatorState().nextRuntimeId);

    // ...while every ordinal-free semantic output is unchanged, and the observer-scoped file
    // counters — which are not drawn from that allocator — are identical.
    const semanticOutputs = (instance: DeterministicScheduler<FixtureState>) =>
      instance.exportQuiescentSnapshot().outputs
        .map((value) => typeof value !== 'boolean' && value.kind === 'text' ? value.value : '');
    // Every committed output — the semantic view, the causal roles, the resolved identity, and all
    // three rendered viewpoints — is ordinal-free, so the whole output set compares equal.
    expect(semanticOutputs(shifted)).toEqual(semanticOutputs(base));
    expect(semanticOutputs(base).some((line) => line.startsWith('render:'))).toBe(true);
    expect(continuantFileStateSummary(shifted.getState().continuantFiles))
      .toEqual(continuantFileStateSummary(base.getState().continuantFiles));

    void identity;
  });
});
