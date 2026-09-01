import { describe, expect, it } from 'vitest';
import {
  bytesToHex,
  canonicalEncode,
  list,
  signed,
  text,
  typedIdentifier,
  type CanonicalValue,
  type TypedIdentifierValue,
} from '../substrate/canonicalEncoding';
import { commitManifest, createModelIdentity, createRunIdentity, runSeedFromFriendlyInteger } from '../substrate/identity';
import {
  SaveContractError,
  createCanonicalSave,
  loadCanonicalSave,
  type PersistentStateAdapter,
  type SaveContext,
} from '../substrate/persistence';
import {
  ComparisonDrawMap,
  PurposeComparisonRoleRegistry,
  randomSchemas,
  type RandomAddress,
} from '../substrate/random';
import { DeterministicScheduler, orderingParametersValue, orderingPhaseRegistryValue, type EventHandler } from '../substrate/scheduler';
import {
  LinearParameterRegistry,
  applySemanticLinearTransition,
  createLinearAnchor,
  linearAnalyticalAnchorValue,
  linearRateParametersValue,
  materializeLinear,
  simInstant,
  timeSchemas,
  type LinearAnalyticalAnchor,
} from '../substrate/time';

interface PersistState {
  readonly counter: bigint;
  readonly log: readonly string[];
  readonly anchor: LinearAnalyticalAnchor;
  readonly randomIds: readonly TypedIdentifierValue[];
}

const parameterId = typedIdentifier(10040n, text('progress/default'));
const parameters = {
  parameterIdentity: parameterId,
  rate: 1n,
  scale: 3n,
  valueMinimum: 0n,
  valueMaximum: 1_000n,
};
const parameterRegistry = new LinearParameterRegistry([parameters]);
const TICK = typedIdentifier(10041n, text('tick'));
const causalRoot = typedIdentifier(10042n, text('event/root'));
const purpose = typedIdentifier(10043n, text('decision/arbitration'));
const comparisonRole = typedIdentifier(10044n, text('decision-result'));

const initialState = (): PersistState => ({
  counter: 0n,
  log: [],
  anchor: createLinearAnchor({ valueAtAnchor: 0n, governingParameterIdentity: parameterId, exactBoundedRemainder: 0n }, simInstant(0n), parameterRegistry),
  randomIds: [causalRoot, purpose],
});

const adapter: PersistentStateAdapter<PersistState> = {
  clone: (state) => ({ ...state, log: [...state.log], anchor: { ...state.anchor }, randomIds: [...state.randomIds] }),
  validate: (state) => {
    if (typeof state.counter !== 'bigint' || state.log.some((entry) => typeof entry !== 'string')) throw new Error('invalid persistent state');
    materializeLinear(state.anchor, state.anchor.anchorInstant, parameterRegistry);
  },
  canonicalValue: (state) => list([
    signed(state.counter),
    list(state.log.map(text)),
    linearAnalyticalAnchorValue(state.anchor),
    list(state.randomIds),
  ]),
  restore: (value) => {
    const items = asList(value);
    const anchorRecord = asRecord(items[2], timeSchemas.analyticalAnchor.typeId);
    return {
      counter: asSigned(items[0]),
      log: asList(items[1]).map(asText),
      anchor: {
        valueAtAnchor: asSigned(requiredField(anchorRecord, 1n)),
        anchorInstant: simInstant(asSigned(requiredField(anchorRecord, 2n))),
        governingParameterIdentity: asTypedId(requiredField(anchorRecord, 3n)),
        exactBoundedRemainder: asUnsigned(requiredField(anchorRecord, 4n)),
      },
      randomIds: asList(items[3]).map(asTypedId),
    };
  },
  analyticalAnchors: (state) => list([linearAnalyticalAnchorValue(state.anchor)]),
  randomRelevantAuthoritativeIds: (state) => list(state.randomIds),
};

const handlerKey = (value: CanonicalValue) => bytesToHex(canonicalEncode(value));

function handlers(): ReadonlyMap<string, EventHandler<PersistState>> {
  const tick: EventHandler<PersistState> = ({ state, event, allocateRuntimeId }) => {
    const runtimeId = allocateRuntimeId();
    const anchor = applySemanticLinearTransition(state.anchor, event.dueAt, parameterRegistry, (materialized) => ({
      valueAtAnchor: materialized.value + 1n,
      governingParameterIdentity: materialized.governingParameterIdentity,
      exactBoundedRemainder: materialized.exactBoundedRemainder,
    }));
    return {
      nextState: { ...state, counter: state.counter + 1n, log: [...state.log, `tick-runtime-${runtimeId}`], anchor },
      emittedEvents: [],
      traceContributions: [list([text('tick'), signed(runtimeId), linearAnalyticalAnchorValue(anchor)])],
      outputs: [text(`tick-output-${runtimeId}`)],
    };
  };
  return new Map([[handlerKey(TICK), tick]]);
}

function drawMap(): ComparisonDrawMap {
  const address: RandomAddress = { causalRootId: causalRoot, purposeId: purpose, subjectBindings: [], drawIndex: 0n };
  return new ComparisonDrawMap([{
    localRandomAddress: address,
    comparisonDrawKey: {
      keyId: typedIdentifier(10045n, text('comparison/tick')),
      comparisonRoleId: comparisonRole,
    },
  }], new PurposeComparisonRoleRegistry([{ purposeId: purpose, comparisonRoleId: comparisonRole }]));
}

async function identities(state: PersistState, continuingInputs: CanonicalValue) {
  const content = await commitManifest(list([]));
  const parameterManifest = await commitManifest(list([linearRateParametersValue(parameters), orderingParametersValue(20n)]));
  const registryManifest = await commitManifest(list([orderingPhaseRegistryValue(), TICK, purpose, comparisonRole]));
  const modelIdentity = await createModelIdentity({
    rulesVersion: 'rules/0d-fixture',
    contentSchemaVersion: 'content/fixture-1',
    contentManifest: content,
    parameterSchemaVersion: 'parameters/fixture-1',
    parameterSet: parameterManifest,
    numericProfileVersion: 'numeric/exact-1',
    randomAlgorithmVersion: 'rng/sha256-addressed-128-v1-candidate',
    registrySchemaVersion: 'registry/fixture-1',
    registryManifest,
  });
  const initialStateCommitment = await commitManifest(adapter.canonicalValue(state));
  const inputCommitment = await commitManifest(continuingInputs);
  const runIdentity = await createRunIdentity({
    modelIdentity,
    initialState: initialStateCommitment,
    orderedInputSequence: inputCommitment,
    runSeed: runSeedFromFriendlyInteger(77n),
  });
  return { modelIdentity, runIdentity };
}

describe('Campaign 0D canonical persistence', () => {
  it('CV-SAVE-001/002: preserves full structure and continuation exactly', async () => {
    const state = initialState();
    const coupling = drawMap();
    const continuingInputs = list([coupling.canonicalValue, text('input/tick@10'), text('input/tick@20')]);
    const identity = await identities(state, continuingInputs);
    const eventHandlers = handlers();
    const uninterrupted = new DeterministicScheduler({
      initialState: state,
      stateAdapter: adapter,
      handlers: eventHandlers,
      maxSettlementWorkPerSimulationInstant: 20n,
    });
    uninterrupted.schedule({ dueAt: simInstant(10n), phase: 10n, eventTypeId: TICK, payload: list([]), dependencies: list([]) });
    uninterrupted.schedule({ dueAt: simInstant(20n), phase: 10n, eventTypeId: TICK, payload: list([]), dependencies: list([text('revision/2')]) });
    await uninterrupted.settleNextInstant();

    const saveContext: SaveContext<PersistState> = {
      scheduler: uninterrupted,
      stateAdapter: adapter,
      modelIdentity: identity.modelIdentity,
      runIdentity: identity.runIdentity,
      continuingRunInputs: continuingInputs,
    };
    const saveBytes = createCanonicalSave(saveContext);
    const preContinuation = uninterrupted.exportQuiescentSnapshot();
    const loaded = await loadCanonicalSave(saveBytes, {
      stateAdapter: adapter,
      handlers: eventHandlers,
      maxSettlementWorkPerSimulationInstant: 20n,
      expectedModelIdentity: identity.modelIdentity,
      expectedRunIdentity: identity.runIdentity,
      additionalSchemas: [...Object.values(timeSchemas), ...Object.values(randomSchemas)],
    });
    expect(loaded.scheduler.exportQuiescentSnapshot()).toEqual(preContinuation);
    expect(canonicalEncode(loaded.analyticalAnchors)).toEqual(canonicalEncode(adapter.analyticalAnchors(preContinuation.state)));
    expect(canonicalEncode(loaded.continuingRunInputs)).toEqual(canonicalEncode(continuingInputs));
    expect(createCanonicalSave({
      scheduler: loaded.scheduler,
      stateAdapter: adapter,
      modelIdentity: loaded.modelIdentity,
      runIdentity: loaded.runIdentity,
      continuingRunInputs: loaded.continuingRunInputs,
    })).toEqual(saveBytes);

    await uninterrupted.settleNextInstant();
    await loaded.scheduler.settleNextInstant();
    expect(loaded.scheduler.exportQuiescentSnapshot()).toEqual(uninterrupted.exportQuiescentSnapshot());
    expect(loaded.scheduler.getState().log).toEqual(['tick-runtime-0', 'tick-runtime-1']);
    expect(loaded.scheduler.getState().anchor).toMatchObject({ valueAtAnchor: 8n, exactBoundedRemainder: 2n, anchorInstant: 20n });
  });

  it('CV-SAVE-002: rejects mid-transition saves and unresolved handler registries', async () => {
    const state = initialState();
    const continuingInputs = list([text('input/tick@10')]);
    const identity = await identities(state, continuingInputs);
    let subject: DeterministicScheduler<PersistState>;
    const midSaveHandler: EventHandler<PersistState> = ({ state: current }) => {
      expect(() => createCanonicalSave({
        scheduler: subject,
        stateAdapter: adapter,
        modelIdentity: identity.modelIdentity,
        runIdentity: identity.runIdentity,
        continuingRunInputs: continuingInputs,
      })).toThrow(SaveContractError);
      return { nextState: current, emittedEvents: [], traceContributions: [], outputs: [] };
    };
    subject = new DeterministicScheduler({
      initialState: state,
      stateAdapter: adapter,
      handlers: new Map([[handlerKey(TICK), midSaveHandler]]),
      maxSettlementWorkPerSimulationInstant: 20n,
    });
    subject.schedule({ dueAt: simInstant(10n), phase: 10n, eventTypeId: TICK, payload: list([]), dependencies: list([]) });
    await subject.settleNextInstant();

    const continuation = new DeterministicScheduler({ initialState: state, stateAdapter: adapter, handlers: handlers(), maxSettlementWorkPerSimulationInstant: 20n });
    continuation.schedule({ dueAt: simInstant(10n), phase: 10n, eventTypeId: TICK, payload: list([]), dependencies: list([]) });
    const bytes = createCanonicalSave({ scheduler: continuation, stateAdapter: adapter, modelIdentity: identity.modelIdentity, runIdentity: identity.runIdentity, continuingRunInputs: continuingInputs });
    await expect(loadCanonicalSave(bytes, {
      stateAdapter: adapter,
      handlers: new Map(),
      maxSettlementWorkPerSimulationInstant: 20n,
      expectedModelIdentity: identity.modelIdentity,
      expectedRunIdentity: identity.runIdentity,
      additionalSchemas: [...Object.values(timeSchemas), ...Object.values(randomSchemas)],
    })).rejects.toThrow(/does not resolve/);
  });
});

type RecordValue = Extract<CanonicalValue, { readonly kind: 'record' }>;

function asList(value: CanonicalValue): readonly CanonicalValue[] {
  if (typeof value === 'boolean' || value.kind !== 'list') throw new Error('expected list');
  return value.items;
}

function asRecord(value: CanonicalValue, typeId: bigint): RecordValue {
  if (typeof value === 'boolean' || value.kind !== 'record' || value.schema.typeId !== typeId) throw new Error('expected record');
  return value;
}

function requiredField(value: RecordValue, id: bigint): CanonicalValue {
  const result = value.fields.get(id);
  if (result === undefined) throw new Error(`missing field ${id}`);
  return result;
}

function asSigned(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'signed') throw new Error('expected signed');
  return value.value;
}

function asUnsigned(value: CanonicalValue): bigint {
  if (typeof value === 'boolean' || value.kind !== 'unsigned') throw new Error('expected unsigned');
  return value.value;
}

function asText(value: CanonicalValue): string {
  if (typeof value === 'boolean' || value.kind !== 'text') throw new Error('expected text');
  return value.value;
}

function asTypedId(value: CanonicalValue): TypedIdentifierValue {
  if (typeof value === 'boolean' || value.kind !== 'typedIdentifier') throw new Error('expected typed ID');
  return value;
}
