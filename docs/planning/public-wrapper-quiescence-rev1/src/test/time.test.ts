import { describe, expect, it } from 'vitest';
import { text, typedIdentifier } from '../substrate/canonicalEncoding';
import {
  INT64_MAX,
  LinearParameterRegistry,
  TimeContractError,
  advancementDuration,
  applySemanticLinearTransition,
  checkedAddDuration,
  createLinearAnchor,
  materializeLinear,
  simDuration,
  simInstant,
  validateNonlinearAdvancementContract,
  type LinearRateParameters,
  type NonlinearAdvancementContract,
} from '../substrate/time';

const parameterId = typedIdentifier(10020n, text('linear/default'));
const changedParameterId = typedIdentifier(10020n, text('linear/changed'));

const parameters = (rate: bigint, scale: bigint, overrides: Partial<LinearRateParameters> = {}): LinearRateParameters => ({
  parameterIdentity: parameterId,
  rate,
  scale,
  valueMinimum: -1_000_000n,
  valueMaximum: 1_000_000n,
  ...overrides,
});

const anchorAtZero = (registry: LinearParameterRegistry) => createLinearAnchor({
  valueAtAnchor: 0n,
  governingParameterIdentity: parameterId,
  exactBoundedRemainder: 0n,
}, simInstant(0n), registry);

describe('Campaign 0C analytical time', () => {
  it.each([1n, -1n])('CV-TIME-001: direct and partitioned linear advancement agree for rate %s/2', (rate) => {
    const registry = new LinearParameterRegistry([parameters(rate, 2n)]);
    const initial = anchorAtZero(registry);
    const direct = materializeLinear(initial, simInstant(2n), registry);
    const atB = materializeLinear(initial, simInstant(1n), registry);
    const correctlyPartitioned = createLinearAnchor({
      valueAtAnchor: atB.value,
      governingParameterIdentity: atB.governingParameterIdentity,
      exactBoundedRemainder: atB.exactBoundedRemainder,
    }, atB.at, registry);
    expect(materializeLinear(correctlyPartitioned, simInstant(2n), registry)).toEqual(direct);

    const truncatingControl = createLinearAnchor({
      valueAtAnchor: atB.value,
      governingParameterIdentity: atB.governingParameterIdentity,
      exactBoundedRemainder: 0n,
    }, atB.at, registry);
    expect(materializeLinear(truncatingControl, simInstant(2n), registry)).not.toEqual(direct);
  });

  it('CV-TIME-002: an incidental read cannot mutate or re-anchor authoritative state', () => {
    const registry = new LinearParameterRegistry([parameters(1n, 3n)]);
    const anchor = anchorAtZero(registry);
    const before = structuredClone(anchor);
    const atB = materializeLinear(anchor, simInstant(2n), registry);
    expect(atB).toMatchObject({ value: 0n, exactBoundedRemainder: 2n });
    expect(anchor).toEqual(before);
    expect(materializeLinear(anchor, simInstant(6n), registry)).toMatchObject({ value: 2n, exactBoundedRemainder: 0n });
  });

  it('CV-TIME-003: a semantic change materializes old parameters, mutates, then anchors new parameters', () => {
    const changed = parameters(1n, 3n, { parameterIdentity: changedParameterId });
    const registry = new LinearParameterRegistry([parameters(1n, 2n), changed]);
    const transitioned = applySemanticLinearTransition(anchorAtZero(registry), simInstant(1n), registry, (materialized) => {
      expect(materialized).toMatchObject({ value: 0n, exactBoundedRemainder: 1n });
      return { valueAtAnchor: materialized.value + 10n, governingParameterIdentity: changedParameterId, exactBoundedRemainder: 0n };
    });
    expect(transitioned).toMatchObject({ valueAtAnchor: 10n, anchorInstant: 1n, exactBoundedRemainder: 0n });
    expect(materializeLinear(transitioned, simInstant(4n), registry)).toMatchObject({ value: 11n, exactBoundedRemainder: 0n });
  });

  it('CV-TIME-004: same-time transitions see earlier results with zero elapsed time and never act retroactively', () => {
    const registry = new LinearParameterRegistry([parameters(1n, 2n)]);
    const first = applySemanticLinearTransition(anchorAtZero(registry), simInstant(2n), registry, (atT) => ({
      valueAtAnchor: atT.value + 10n,
      governingParameterIdentity: atT.governingParameterIdentity,
      exactBoundedRemainder: atT.exactBoundedRemainder,
    }));
    const second = applySemanticLinearTransition(first, simInstant(2n), registry, (sameT) => {
      expect(sameT.value).toBe(11n);
      return { valueAtAnchor: sameT.value + 1n, governingParameterIdentity: sameT.governingParameterIdentity, exactBoundedRemainder: sameT.exactBoundedRemainder };
    });
    expect(second).toMatchObject({ valueAtAnchor: 12n, anchorInstant: 2n, exactBoundedRemainder: 0n });
  });

  it('CV-TIME-005: returns typed failures for invalid time and bounded arithmetic', () => {
    expect(() => simInstant(-1n)).toThrow(TimeContractError);
    expect(() => simInstant(INT64_MAX + 1n)).toThrowError(expect.objectContaining({ code: 'INVALID_INSTANT' }));
    expect(() => advancementDuration(simInstant(2n), simInstant(1n))).toThrowError(expect.objectContaining({ code: 'BACKWARD_ADVANCEMENT' }));
    expect(() => checkedAddDuration(simInstant(INT64_MAX), simDuration(1n))).toThrowError(expect.objectContaining({ code: 'INSTANT_OVERFLOW' }));
    expect(() => checkedAddDuration(simInstant(0n), simDuration(-1n))).toThrowError(expect.objectContaining({ code: 'INSTANT_OVERFLOW' }));
    const boundedRegistry = new LinearParameterRegistry([parameters(1n, 1n, { valueMinimum: 0n, valueMaximum: 10n })]);
    expect(() => materializeLinear(anchorAtZero(boundedRegistry), simInstant(11n), boundedRegistry)).toThrowError(expect.objectContaining({ code: 'VALUE_OVERFLOW' }));
  });

  it('CV-TIME-006: rejects ambient floating point, hidden microticks, and incomplete nonlinear contracts', () => {
    const valid: NonlinearAdvancementContract = {
      algorithmVersion: 'nonlinear/exact/1',
      arithmeticProfile: 'exact-rational',
      quantizationRule: 'none; exact rational output',
      errorBoundNumerator: 0n,
      errorBoundDenominator: 1n,
      partitionRule: 'partition-invariant',
      usesHiddenMicroticks: false,
    };
    expect(() => validateNonlinearAdvancementContract(valid)).not.toThrow();
    expect(() => validateNonlinearAdvancementContract({ ...valid, arithmeticProfile: 'ambient-platform-float' } as unknown as NonlinearAdvancementContract)).toThrow(/ambient/);
    expect(() => validateNonlinearAdvancementContract({ ...valid, usesHiddenMicroticks: true })).toThrow(/microticks/);
    expect(() => validateNonlinearAdvancementContract({ ...valid, errorBoundNumerator: 2n, errorBoundDenominator: 4n })).toThrow(/reduced/);
    expect(() => validateNonlinearAdvancementContract({ ...valid, algorithmVersion: '' })).toThrow(/version/);
  });
});
