import { cloneCanonicalValue, list, text, type CanonicalValue, type TypedIdentifierValue } from './canonicalEncoding';
import { SchedulerContractError, type EventEmission, type EventHandler, type EventHandlerContext, type StateAdapter } from './scheduler';
import type { PersistentStateAdapter } from './persistence';
import {
  AuthoritativeState,
  ContractReadProjection,
  StateAuthorityRegistry,
  actualReadRecordValue,
  applyStatePatch,
  mutationDiffValue,
  restoreAuthoritativeState,
  statePatchValue,
  type ProjectionBinding,
  type StatePatch,
  type StatePathPattern,
} from './state';
import { TRACE_CONTRACT_VERSION, traceRecordValue, type TraceRecord } from './trace';

export interface TransitionSeamContract<Bindings extends Readonly<Record<string, ProjectionBinding>>> {
  readonly seamId: TypedIdentifierValue;
  readonly seamVersion: string;
  readonly recordKind: TypedIdentifierValue;
  readonly mutationAuthorityId: TypedIdentifierValue;
  readonly readDomain: readonly StatePathPattern[];
  readonly bindings: Bindings;
}

export interface SemanticTransitionResult {
  readonly statePatch: StatePatch;
  readonly emittedEvents: readonly EventEmission[];
  readonly outputs: readonly CanonicalValue[];
  readonly subjectIds: readonly TypedIdentifierValue[];
  readonly sourceRecordIds: readonly TypedIdentifierValue[];
  readonly inputProjection: CanonicalValue;
  readonly outputProjection: CanonicalValue;
  readonly randomDrawRecords?: readonly CanonicalValue[];
  readonly quantizationOperations?: readonly CanonicalValue[];
  readonly invariantResults?: readonly CanonicalValue[];
}

export type SemanticTransition<Bindings extends Readonly<Record<string, ProjectionBinding>>> = (
  projection: ContractReadProjection<Bindings>,
  context: EventHandlerContext<AuthoritativeState>,
) => SemanticTransitionResult | Promise<SemanticTransitionResult>;

export interface TraceIdentityContext {
  readonly modelIdentity: CanonicalValue;
  readonly runIdentity: CanonicalValue;
}

export function createContractEventHandler<Bindings extends Readonly<Record<string, ProjectionBinding>>>(
  contract: TransitionSeamContract<Bindings>,
  authorityRegistry: StateAuthorityRegistry,
  identities: TraceIdentityContext,
  transition: SemanticTransition<Bindings>,
): EventHandler<AuthoritativeState> {
  return async (context) => {
    const projection = new ContractReadProjection(context.state, contract.readDomain, contract.bindings);
    const semantic = await transition(projection, context);
    const reads = projection.actualReadRecords();
    let applied: ReturnType<typeof applyStatePatch>;
    try {
      applied = applyStatePatch(context.state, semantic.statePatch, contract.mutationAuthorityId, authorityRegistry);
    } catch (error) {
      throw new SchedulerContractError(
        'STATE_VALIDATION_FAILURE',
        error instanceof Error ? error.message : String(error),
        list([
          text(contract.seamVersion),
          list(reads.map(actualReadRecordValue)),
          statePatchValue(semantic.statePatch),
          text(error instanceof Error ? error.name : 'UnknownStatePatchFailure'),
        ]),
      );
    }
    const stagedEvidence = list([
      text(contract.seamVersion),
      list(reads.map(actualReadRecordValue)),
      statePatchValue(semantic.statePatch),
      list(applied.diffs.map(mutationDiffValue)),
      semantic.outputProjection,
    ]);
    return {
      nextState: applied.state,
      emittedEvents: semantic.emittedEvents,
      traceContributions: [],
      traceFactory: (allocatedEmittedEvents) => {
        const trace: TraceRecord = {
          traceSchemaVersion: TRACE_CONTRACT_VERSION,
          modelIdentity: identities.modelIdentity,
          runIdentity: identities.runIdentity,
          event: context.event,
          seamId: contract.seamId,
          seamVersion: contract.seamVersion,
          recordKind: contract.recordKind,
          subjectIds: semantic.subjectIds,
          sourceRecordIds: semantic.sourceRecordIds,
          registeredReadDomain: contract.readDomain,
          actualReadRecords: reads,
          inputProjection: semantic.inputProjection,
          outputProjection: semantic.outputProjection,
          randomDrawRecords: semantic.randomDrawRecords ?? [],
          quantizationOperations: semantic.quantizationOperations ?? [],
          statePatch: semantic.statePatch,
          structuralMutationDiffs: applied.diffs,
          emittedEvents: allocatedEmittedEvents,
          invariantResults: semantic.invariantResults ?? [],
        };
        return [traceRecordValue(trace)];
      },
      failureContext: stagedEvidence,
      outputs: semantic.outputs.map(cloneCanonicalValue),
    };
  };
}

export function authoritativeStateAdapter(registry: StateAuthorityRegistry): StateAdapter<AuthoritativeState> {
  return {
    clone: (state) => new AuthoritativeState(state.entries()),
    validate: (state) => registry.validateState(state),
    canonicalValue: (state) => state.canonicalValue(),
  };
}

export function authoritativePersistentStateAdapter(
  registry: StateAuthorityRegistry,
  projections: {
    readonly analyticalAnchors?: (state: AuthoritativeState) => CanonicalValue;
    readonly randomRelevantAuthoritativeIds?: (state: AuthoritativeState) => CanonicalValue;
  } = {},
): PersistentStateAdapter<AuthoritativeState> {
  const base = authoritativeStateAdapter(registry);
  return {
    ...base,
    restore: (value) => {
      const state = restoreAuthoritativeState(value);
      registry.validateState(state);
      return state;
    },
    analyticalAnchors: projections.analyticalAnchors ?? (() => list([])),
    randomRelevantAuthoritativeIds: projections.randomRelevantAuthoritativeIds ?? (() => list([])),
  };
}
