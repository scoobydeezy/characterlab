import { bytesToHex, canonicalEncode, record, signed, unsigned, type CanonicalValue, type RecordSchema, type TypedIdentifierValue } from './canonicalEncoding';
import { floorDiv } from './exactMath';

export const INT64_MIN = -(1n << 63n);
export const INT64_MAX = (1n << 63n) - 1n;

export const timeSchemas = {
  linearRateParameters: schema(120n, 'LinearRateParameters', ['ParameterIdentity', 'Rate', 'Scale', 'ValueMinimum', 'ValueMaximum']),
  analyticalAnchor: schema(121n, 'LinearAnalyticalAnchor', ['ValueAtAnchor', 'AnchorInstant', 'GoverningParameterIdentity', 'ExactBoundedRemainder']),
} as const;

declare const instantBrand: unique symbol;
declare const durationBrand: unique symbol;
export type SimInstant = bigint & { readonly [instantBrand]: true };
export type SimDuration = bigint & { readonly [durationBrand]: true };

export type TimeFailureCode =
  | 'INVALID_INSTANT'
  | 'INVALID_DURATION'
  | 'INSTANT_OVERFLOW'
  | 'BACKWARD_ADVANCEMENT'
  | 'UNKNOWN_PARAMETER_IDENTITY'
  | 'INVALID_PARAMETER'
  | 'INVALID_REMAINDER'
  | 'VALUE_OVERFLOW'
  | 'INVALID_NONLINEAR_CONTRACT';

export class TimeContractError extends Error {
  constructor(readonly code: TimeFailureCode, message: string) {
    super(message);
    this.name = 'TimeContractError';
  }
}

export interface LinearRateParameters {
  readonly parameterIdentity: TypedIdentifierValue;
  readonly rate: bigint;
  readonly scale: bigint;
  readonly valueMinimum: bigint;
  readonly valueMaximum: bigint;
}

export interface LinearAnalyticalAnchor {
  readonly valueAtAnchor: bigint;
  readonly anchorInstant: SimInstant;
  readonly governingParameterIdentity: TypedIdentifierValue;
  readonly exactBoundedRemainder: bigint;
}

export interface LinearMaterialization {
  readonly value: bigint;
  readonly at: SimInstant;
  readonly governingParameterIdentity: TypedIdentifierValue;
  readonly exactBoundedRemainder: bigint;
}

export interface ReanchoredLinearState {
  readonly valueAtAnchor: bigint;
  readonly governingParameterIdentity: TypedIdentifierValue;
  readonly exactBoundedRemainder: bigint;
}

export interface NonlinearAdvancementContract {
  readonly algorithmVersion: string;
  readonly arithmeticProfile: 'exact-integer' | 'exact-rational' | 'bounded-fixed-point';
  readonly quantizationRule: string;
  readonly errorBoundNumerator: bigint;
  readonly errorBoundDenominator: bigint;
  readonly partitionRule: 'partition-invariant' | 'semantic-transitions-only';
  readonly usesHiddenMicroticks: boolean;
}

export class LinearParameterRegistry {
  readonly #parameters = new Map<string, LinearRateParameters>();

  constructor(parameters: readonly LinearRateParameters[]) {
    for (const parameter of parameters) {
      validateParameters(parameter);
      const key = idKey(parameter.parameterIdentity);
      if (this.#parameters.has(key)) fail('INVALID_PARAMETER', 'duplicate linear parameter identity');
      this.#parameters.set(key, { ...parameter });
    }
  }

  resolve(identity: TypedIdentifierValue): LinearRateParameters {
    const parameter = this.#parameters.get(idKey(identity));
    if (!parameter) fail('UNKNOWN_PARAMETER_IDENTITY', 'analytical anchor parameter identity does not resolve');
    return parameter;
  }
}

export function simInstant(value: bigint): SimInstant {
  if (typeof value !== 'bigint' || value < 0n || value > INT64_MAX) fail('INVALID_INSTANT', 'SimInstant must be in [0, Int64.MaxValue]');
  return value as SimInstant;
}

export function simDuration(value: bigint): SimDuration {
  if (typeof value !== 'bigint' || value < INT64_MIN || value > INT64_MAX) fail('INVALID_DURATION', 'SimDuration must fit signed Int64');
  return value as SimDuration;
}

export function checkedAddDuration(instant: SimInstant, duration: SimDuration): SimInstant {
  const result = instant + duration;
  if (result < 0n || result > INT64_MAX) fail('INSTANT_OVERFLOW', 'instant arithmetic overflow or underflow');
  return result as SimInstant;
}

export function advancementDuration(from: SimInstant, through: SimInstant): SimDuration {
  if (through < from) fail('BACKWARD_ADVANCEMENT', 'analytical advancement duration must be nonnegative');
  return simDuration(through - from);
}

export function createLinearAnchor(
  state: ReanchoredLinearState,
  at: SimInstant,
  registry: LinearParameterRegistry,
): LinearAnalyticalAnchor {
  const parameters = registry.resolve(state.governingParameterIdentity);
  validateValueAndRemainder(state.valueAtAnchor, state.exactBoundedRemainder, parameters);
  return {
    valueAtAnchor: state.valueAtAnchor,
    anchorInstant: at,
    governingParameterIdentity: state.governingParameterIdentity,
    exactBoundedRemainder: state.exactBoundedRemainder,
  };
}

export function materializeLinear(
  anchor: LinearAnalyticalAnchor,
  through: SimInstant,
  registry: LinearParameterRegistry,
): LinearMaterialization {
  const elapsed = advancementDuration(anchor.anchorInstant, through);
  const parameters = registry.resolve(anchor.governingParameterIdentity);
  validateValueAndRemainder(anchor.valueAtAnchor, anchor.exactBoundedRemainder, parameters);
  const total = anchor.exactBoundedRemainder + elapsed * parameters.rate;
  const delta = floorDiv(total, parameters.scale);
  const remainder = total - delta * parameters.scale;
  const value = anchor.valueAtAnchor + delta;
  if (value < parameters.valueMinimum || value > parameters.valueMaximum) {
    fail('VALUE_OVERFLOW', 'analytical value exceeded its declared bounded representation');
  }
  return {
    value,
    at: through,
    governingParameterIdentity: anchor.governingParameterIdentity,
    exactBoundedRemainder: remainder,
  };
}

export function applySemanticLinearTransition(
  anchor: LinearAnalyticalAnchor,
  at: SimInstant,
  registry: LinearParameterRegistry,
  transition: (materialized: LinearMaterialization) => ReanchoredLinearState,
): LinearAnalyticalAnchor {
  const materialized = materializeLinear(anchor, at, registry);
  const transitioned = transition(materialized);
  return createLinearAnchor(transitioned, at, registry);
}

export function validateNonlinearAdvancementContract(contract: NonlinearAdvancementContract): void {
  if (!contract.algorithmVersion || contract.algorithmVersion !== contract.algorithmVersion.normalize('NFC')) {
    fail('INVALID_NONLINEAR_CONTRACT', 'nonlinear algorithm requires a nonempty NFC version');
  }
  if (!contract.quantizationRule || contract.quantizationRule !== contract.quantizationRule.normalize('NFC')) {
    fail('INVALID_NONLINEAR_CONTRACT', 'nonlinear algorithm requires an explicit NFC quantization rule');
  }
  if (!['exact-integer', 'exact-rational', 'bounded-fixed-point'].includes(contract.arithmeticProfile)) {
    fail('INVALID_NONLINEAR_CONTRACT', 'ambient or undeclared nonlinear arithmetic is forbidden');
  }
  if (!['partition-invariant', 'semantic-transitions-only'].includes(contract.partitionRule)) {
    fail('INVALID_NONLINEAR_CONTRACT', 'nonlinear algorithm requires an explicit partition rule');
  }
  if (typeof contract.errorBoundNumerator !== 'bigint' || typeof contract.errorBoundDenominator !== 'bigint'
    || contract.errorBoundDenominator <= 0n || contract.errorBoundNumerator < 0n) {
    fail('INVALID_NONLINEAR_CONTRACT', 'nonlinear error bound must be an exact nonnegative rational');
  }
  if (gcd(contract.errorBoundNumerator, contract.errorBoundDenominator) !== 1n) {
    fail('INVALID_NONLINEAR_CONTRACT', 'nonlinear error bound must be reduced');
  }
  if (contract.usesHiddenMicroticks) fail('INVALID_NONLINEAR_CONTRACT', 'hidden numerical microticks are forbidden');
}

export function linearRateParametersValue(parameters: LinearRateParameters): CanonicalValue {
  validateParameters(parameters);
  return requiredRecord(timeSchemas.linearRateParameters, [
    parameters.parameterIdentity,
    signed(parameters.rate),
    unsigned(parameters.scale),
    signed(parameters.valueMinimum),
    signed(parameters.valueMaximum),
  ]);
}

export function linearAnalyticalAnchorValue(anchor: LinearAnalyticalAnchor): CanonicalValue {
  simInstant(anchor.anchorInstant);
  if (typeof anchor.valueAtAnchor !== 'bigint' || typeof anchor.exactBoundedRemainder !== 'bigint' || anchor.exactBoundedRemainder < 0n) {
    fail('INVALID_REMAINDER', 'canonical analytical anchor requires exact value and nonnegative remainder');
  }
  return requiredRecord(timeSchemas.analyticalAnchor, [
    signed(anchor.valueAtAnchor),
    signed(anchor.anchorInstant),
    anchor.governingParameterIdentity,
    unsigned(anchor.exactBoundedRemainder),
  ]);
}

function validateParameters(parameters: LinearRateParameters): void {
  if (typeof parameters.rate !== 'bigint' || typeof parameters.scale !== 'bigint'
    || typeof parameters.valueMinimum !== 'bigint' || typeof parameters.valueMaximum !== 'bigint') {
    fail('INVALID_PARAMETER', 'linear parameters must use exact integers');
  }
  if (parameters.scale <= 0n) fail('INVALID_PARAMETER', 'linear rate scale must be positive');
  if (parameters.valueMinimum > parameters.valueMaximum) fail('INVALID_PARAMETER', 'linear value domain is inverted');
}

function validateValueAndRemainder(value: bigint, remainder: bigint, parameters: LinearRateParameters): void {
  if (typeof value !== 'bigint' || typeof remainder !== 'bigint') fail('INVALID_PARAMETER', 'linear anchor values must use exact integers');
  if (value < parameters.valueMinimum || value > parameters.valueMaximum) fail('VALUE_OVERFLOW', 'anchor value is outside its declared representation');
  if (remainder < 0n || remainder >= parameters.scale) fail('INVALID_REMAINDER', 'exact remainder must be in [0, scale)');
}

function idKey(identity: TypedIdentifierValue): string {
  return bytesToHex(canonicalEncode(identity));
}

function gcd(left: bigint, right: bigint): bigint {
  while (right !== 0n) [left, right] = [right, left % right];
  return left;
}

function fail(code: TimeFailureCode, message: string): never {
  throw new TimeContractError(code, message);
}

function requiredRecord(target: RecordSchema, values: readonly CanonicalValue[]): CanonicalValue {
  return record(target, new Map(target.fields.map((field, index) => [field.id, values[index]])));
}

function schema(typeId: bigint, name: string, fieldNames: readonly string[]): RecordSchema {
  return {
    typeId,
    schemaVersion: 1n,
    name,
    fields: fieldNames.map((fieldName, index) => ({ id: BigInt(index + 1), name: fieldName, required: true })),
  };
}
