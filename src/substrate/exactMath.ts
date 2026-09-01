export class ExactMathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExactMathError';
  }
}

export function floorDiv(numerator: bigint, positiveDenominator: bigint): bigint {
  if (positiveDenominator <= 0n) throw new ExactMathError('floorDiv denominator must be positive');
  const quotient = numerator / positiveDenominator;
  const remainder = numerator % positiveDenominator;
  return remainder < 0n ? quotient - 1n : quotient;
}

export function ceilDiv(numerator: bigint, positiveDenominator: bigint): bigint {
  return -floorDiv(-numerator, positiveDenominator);
}

export function roundEven(numerator: bigint, positiveDenominator: bigint): bigint {
  if (positiveDenominator <= 0n) throw new ExactMathError('roundEven denominator must be positive');
  const lower = floorDiv(numerator, positiveDenominator);
  const remainder = numerator - lower * positiveDenominator;
  const doubled = remainder * 2n;
  if (doubled < positiveDenominator) return lower;
  if (doubled > positiveDenominator) return lower + 1n;
  return lower % 2n === 0n ? lower : lower + 1n;
}

export class ExactRational {
  readonly numerator: bigint;
  readonly denominator: bigint;

  private constructor(numerator: bigint, denominator: bigint) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  static of(numerator: bigint, denominator: bigint = 1n): ExactRational {
    if (denominator === 0n) throw new ExactMathError('rational denominator must be nonzero');
    if (denominator < 0n) {
      numerator = -numerator;
      denominator = -denominator;
    }
    const divisor = gcd(abs(numerator), denominator);
    return new ExactRational(numerator / divisor, denominator / divisor);
  }

  add(other: ExactRational): ExactRational {
    return ExactRational.of(
      this.numerator * other.denominator + other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  subtract(other: ExactRational): ExactRational {
    return ExactRational.of(
      this.numerator * other.denominator - other.numerator * this.denominator,
      this.denominator * other.denominator,
    );
  }

  multiply(other: ExactRational): ExactRational {
    return ExactRational.of(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(other: ExactRational): ExactRational {
    if (other.numerator === 0n) throw new ExactMathError('division by zero');
    return ExactRational.of(this.numerator * other.denominator, this.denominator * other.numerator);
  }

  compare(other: ExactRational): -1 | 0 | 1 {
    const left = this.numerator * other.denominator;
    const right = other.numerator * this.denominator;
    return left < right ? -1 : left > right ? 1 : 0;
  }

  equals(other: ExactRational): boolean {
    return this.numerator === other.numerator && this.denominator === other.denominator;
  }
}

function gcd(left: bigint, right: bigint): bigint {
  left = abs(left);
  right = abs(right);
  while (right !== 0n) [left, right] = [right, left % right];
  return left === 0n ? 1n : left;
}

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}
