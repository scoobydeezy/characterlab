import { describe, expect, it } from 'vitest';
import { bytesToHex, canonicalEncode, list, signed, text, typedIdentifier, type CanonicalValue } from '../substrate/canonicalEncoding';
import { commitManifest, createModelIdentity, createRunIdentity } from '../substrate/identity';
import { createCanonicalSave, loadCanonicalSave } from '../substrate/persistence';
import { DeterministicScheduler, type EventHandler, type ScheduledEvent } from '../substrate/scheduler';
import {
  AuthoritativeState,
  StateAuthorityRegistry,
  createStatePatch,
  stateSchemas,
  type StatePath,
  type StatePathPattern,
} from '../substrate/state';
import { traceSchemas } from '../substrate/trace';
import { authoritativePersistentStateAdapter, createContractEventHandler } from '../substrate/transition';
import { simInstant } from '../substrate/time';

const character = typedIdentifier(22000n, text('character/golden'));
const authority = typedIdentifier(22001n, text('authority/golden'));
const rootType = typedIdentifier(22002n, text('event/root'));
const childType = typedIdentifier(22002n, text('event/child'));
const seamId = typedIdentifier(22003n, text('seam/golden'));
const kind = typedIdentifier(22004n, text('record/golden'));
const accessor = typedIdentifier(22005n, text('accessor/value'));
const path: StatePath = { rootStateTypeId: 2n, fieldId: 1n, selectors: [{ kind: 'typedEntity', id: character }] };
const pattern: StatePathPattern = { rootStateTypeId: 2n, fieldId: 1n, selectors: [{ kind: 'wildcard', selectorKind: 'typedEntity' }] };
const key = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));
const valueOf = (value: CanonicalValue): bigint => {
  if (typeof value === 'boolean' || value.kind !== 'signed') throw new Error('expected signed state value');
  return value.value;
};

describe('PHEN-DET-001 integrated deterministic substrate', () => {
  it('preserves canonical state, event allocation, outputs, and committed traces across save/load continuation', async () => {
    const content = await commitManifest(list([text('content/golden')]));
    const parameters = await commitManifest(list([text('parameters/golden')]));
    const registries = await commitManifest(list([text('registries/golden')]));
    const model = await createModelIdentity({
      rulesVersion: 'rules/golden', contentSchemaVersion: 'content/golden', contentManifest: content,
      parameterSchemaVersion: 'parameters/golden', parameterSet: parameters,
      numericProfileVersion: 'numeric/golden', randomAlgorithmVersion: 'rng/golden',
      registrySchemaVersion: 'registries/golden', registryManifest: registries,
    });
    const initial = new AuthoritativeState([{ path, value: signed(0n) }]);
    const run = await createRunIdentity({
      modelIdentity: model, initialState: await commitManifest(initial.canonicalValue()),
      orderedInputSequence: await commitManifest(list([text('input/golden')])), runSeed: new Uint8Array(32).fill(7),
    });
    const registry = new StateAuthorityRegistry(
      [{ pattern, validateValue: (value) => { valueOf(value); }, removalAllowed: false }],
      [{ mutationAuthorityId: authority, patterns: [pattern] }],
    );
    const adapter = authoritativePersistentStateAdapter(registry);
    const handler = createContractEventHandler(
      {
        seamId, seamVersion: 'golden/1', recordKind: kind, mutationAuthorityId: authority,
        readDomain: [pattern], bindings: { value: { kind: 'direct' as const, accessorId: accessor, path } },
      },
      registry,
      { modelIdentity: model.value, runIdentity: run.value },
      (projection, context) => {
        const oldValue = projection.read('value')!;
        const nextValue = signed(valueOf(oldValue) + 1n);
        const isRoot = key(context.event.eventTypeId) === key(rootType);
        return {
          statePatch: createStatePatch([{ kind: 'set', path, expected: { presence: true, value: oldValue }, newValue: nextValue }]),
          emittedEvents: isRoot ? [{
            dueAt: simInstant(20n), phase: 10n, eventTypeId: childType,
            payload: text('child'), dependencies: list([text('dependency/golden')]),
          }] : [],
          outputs: [nextValue], subjectIds: [character], sourceRecordIds: [],
          inputProjection: oldValue, outputProjection: nextValue,
          randomDrawRecords: [list([text('addressed-draw-fixture'), signed(context.event.eventId)])],
          quantizationOperations: [], invariantResults: [text('state-valid')],
        };
      },
    );
    const handlers = new Map<string, EventHandler<AuthoritativeState>>([[key(rootType), handler], [key(childType), handler]]);
    const root: ScheduledEvent = {
      eventId: 0n, dueAt: simInstant(10n), phase: 10n, eventSequence: 0n, eventTypeId: rootType,
      payload: text('root'), dependencies: list([]), causalParentEventIds: [],
    };
    const uninterrupted = new DeterministicScheduler({
      initialState: initial, stateAdapter: adapter, handlers, maxSettlementWorkPerSimulationInstant: 10n,
      initialQueue: [root], initialAllocators: { nextRuntimeId: 0n, nextEventId: 1n, nextEventSequence: 1n },
    });
    await uninterrupted.settleNextInstant();
    const save = createCanonicalSave({
      scheduler: uninterrupted, stateAdapter: adapter, modelIdentity: model, runIdentity: run,
      continuingRunInputs: list([text('input/golden')]),
    });
    const loaded = await loadCanonicalSave(save, {
      stateAdapter: adapter, handlers, maxSettlementWorkPerSimulationInstant: 10n,
      expectedModelIdentity: model, expectedRunIdentity: run,
      additionalSchemas: [...Object.values(stateSchemas), ...Object.values(traceSchemas)],
    });
    expect(bytesToHex(loaded.canonicalBytes)).toBe(bytesToHex(save));

    await uninterrupted.settleNextInstant();
    await loaded.scheduler.settleNextInstant();
    expect(key(uninterrupted.getState().canonicalValue())).toBe(key(loaded.scheduler.getState().canonicalValue()));
    expect(uninterrupted.getPendingQueue()).toEqual(loaded.scheduler.getPendingQueue());
    expect(uninterrupted.getAllocatorState()).toEqual(loaded.scheduler.getAllocatorState());
    expect(uninterrupted.getOutputs().map(key)).toEqual(loaded.scheduler.getOutputs().map(key));
    expect(uninterrupted.getCommittedTrace().map(key)).toEqual(loaded.scheduler.getCommittedTrace().map(key));
    expect(valueOf(uninterrupted.getState().read(path).value!)).toBe(2n);
  });
});
