/**
 * Exact rational arithmetic, per Brief §5.1 (Exact oracle mathematics).
 *
 * x = p/q, p ∈ ℤ, q ∈ ℤ⁺, gcd(|p|, q) = 1.
 *
 * Used for proof/reference calculations, unit-test oracles, and as the
 * temporary exact intermediate representation before quantization onto the
 * authoritative rational lattice (see kernel/quantize.ts). Exact rational
 * state is NEVER persisted as long-lived runtime state (§5.1) — only
 * Rational.quantize() output (fixed-denominator lattice points) may be
 * persisted.
 *
 * All arithmetic here is exact BigInt arithmetic. There is no floating
 * point anywhere in this module, so results are bit-for-bit reproducible
 * across platforms — a precondition for the determinism contract in §3.1.
 */

function bigAbs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

function bigGcd(a: bigint, b: bigint): bigint {
  a = bigAbs(a);
  b = bigAbs(b);
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a === 0n ? 1n : a;
}

export class Rational {
  readonly p: bigint; // numerator, may be negative
  readonly q: bigint; // denominator, always positive

  private constructor(p: bigint, q: bigint) {
    this.p = p;
    this.q = q;
  }

  /** Construct and reduce to lowest terms with a positive denominator. */
  static of(p: bigint | number, q: bigint | number = 1n): Rational {
    let pn = typeof p === 'number' ? BigInt(Math.trunc(p)) : p;
    let qn = typeof q === 'number' ? BigInt(Math.trunc(q)) : q;
    if (qn === 0n) throw new RangeError('Rational: zero denominator');
    if (qn < 0n) {
      pn = -pn;
      qn = -qn;
    }
    const g = bigGcd(pn, qn);
    return new Rational(pn / g, qn / g);
  }

  static readonly ZERO = Rational.of(0n, 1n);
  static readonly ONE = Rational.of(1n, 1n);

  /** Exact rational from an integer. */
  static fromInt(n: bigint | number): Rational {
    return Rational.of(n, 1n);
  }

  /**
   * Exact rational from a lattice point k/D (see kernel/quantize.ts). This
   * is how persisted quantized state re-enters exact arithmetic for the
   * next calculation.
   */
  static fromLattice(k: bigint, D: bigint): Rational {
    return Rational.of(k, D);
  }

  /**
   * Exact rational from a JS number, for authored UI inputs only (slider
   * values, text fields). NOT for converting derived/runtime floating
   * results into "authoritative" state — those must come from actual
   * kernel arithmetic. `precision` fixes how many decimal digits of the
   * input are taken as exact (default 1e6, matching the default lattice D).
   */
  static fromDecimal(x: number, precision: bigint = 1_000_000n): Rational {
    if (!Number.isFinite(x)) throw new RangeError('Rational.fromDecimal: x must be finite');
    const scaled = Math.round(x * Number(precision));
    return Rational.of(BigInt(scaled), precision);
  }

  add(o: Rational): Rational {
    return Rational.of(this.p * o.q + o.p * this.q, this.q * o.q);
  }

  sub(o: Rational): Rational {
    return Rational.of(this.p * o.q - o.p * this.q, this.q * o.q);
  }

  mul(o: Rational): Rational {
    return Rational.of(this.p * o.p, this.q * o.q);
  }

  div(o: Rational): Rational {
    if (o.p === 0n) throw new RangeError('Rational: division by zero');
    return Rational.of(this.p * o.q, this.q * o.p);
  }

  neg(): Rational {
    return Rational.of(-this.p, this.q);
  }

  abs(): Rational {
    return this.p < 0n ? this.neg() : this;
  }

  inverse(): Rational {
    if (this.p === 0n) throw new RangeError('Rational: inverse of zero');
    return Rational.of(this.q, this.p);
  }

  pow(n: number): Rational {
    if (!Number.isInteger(n)) throw new RangeError('Rational.pow: exponent must be an integer');
    if (n === 0) return Rational.ONE;
    if (n < 0) return this.inverse().pow(-n);
    let result = Rational.ONE as Rational;
    let base: Rational = this;
    let e = n;
    while (e > 0) {
      if (e & 1) result = result.mul(base);
      base = base.mul(base);
      e >>= 1;
    }
    return result;
  }

  compare(o: Rational): -1 | 0 | 1 {
    const lhs = this.p * o.q;
    const rhs = o.p * this.q;
    if (lhs < rhs) return -1;
    if (lhs > rhs) return 1;
    return 0;
  }

  equals(o: Rational): boolean {
    return this.p === o.p && this.q === o.q;
  }

  lt(o: Rational): boolean {
    return this.compare(o) < 0;
  }
  lte(o: Rational): boolean {
    return this.compare(o) <= 0;
  }
  gt(o: Rational): boolean {
    return this.compare(o) > 0;
  }
  gte(o: Rational): boolean {
    return this.compare(o) >= 0;
  }

  isZero(): boolean {
    return this.p === 0n;
  }
  isNegative(): boolean {
    return this.p < 0n;
  }

  min(o: Rational): Rational {
    return this.lte(o) ? this : o;
  }
  max(o: Rational): Rational {
    return this.gte(o) ? this : o;
  }

  clamp(lo: Rational, hi: Rational): Rational {
    return this.max(lo).min(hi);
  }

  /**
   * Bounded response g(x) = x / (1 + |x|)  — Brief §9.1 / §32.
   * Guarantees -1 < g(x) < 1 for every finite x.
   */
  static boundedResponse(x: Rational): Rational {
    return x.div(Rational.ONE.add(x.abs()));
  }

  /**
   * Convert to a JS double for *display only*. Never use this result as
   * authoritative state — it exists so the UI can render numbers.
   */
  toDisplayNumber(): number {
    // BigInt division loses precision for very large p/q; for CharacterLab's
    // scenario magnitudes this is display-safe. Guard against Number
    // overflow by falling back to a manual long-division for extreme cases.
    if (this.q === 0n) return NaN;
    const asFloat = Number(this.p) / Number(this.q);
    if (Number.isFinite(asFloat)) return asFloat;
    // Fallback: scaled long division, safe for the ranges CharacterLab uses.
    const scale = 1_000_000_000n;
    return Number((this.p * scale) / this.q) / Number(scale);
  }

  toString(): string {
    return `${this.p.toString()}/${this.q.toString()}`;
  }

  /** Canonical, order-independent string for hashing / trace serialization. */
  toCanonicalString(): string {
    return this.toString();
  }
}

export function ratOf(p: bigint | number, q: bigint | number = 1): Rational {
  return Rational.of(p, q);
}
