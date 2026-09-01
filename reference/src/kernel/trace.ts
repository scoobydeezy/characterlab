/**
 * Causal trace recorder, per Brief §30 ("Every meaningful choice emits a
 * complete derivation... Trace generation is a product requirement, not
 * optional debug logging") and §25 step 20 ("Emit full causal trace").
 *
 * A trace is an ordered list of named steps. Each step records exactly the
 * inputs it read and the outputs it produced, using only
 * Canonicalizable values (kernel/stateHash.ts) — plain data, never live
 * object references — so a completed trace is a faithful, replayable
 * record of "every number in the trace ... reproducible from earlier
 * values" (§30).
 */

import { Canonicalizable, canonicalStringify, stateHash } from './stateHash';

export interface TraceStep {
  readonly step: string; // e.g. "need_urgency", "need_term", "choice_weight"
  readonly inputs: Readonly<Record<string, Canonicalizable>>;
  readonly outputs: Readonly<Record<string, Canonicalizable>>;
  readonly note?: string;
}

export interface CognitiveCycleTrace {
  readonly cycleId: string;
  readonly occurredAt: number;
  readonly steps: readonly TraceStep[];
}

export class TraceBuilder {
  private readonly steps: TraceStep[] = [];

  constructor(
    private readonly cycleId: string,
    private readonly occurredAt: number,
  ) {}

  record(
    step: string,
    inputs: Readonly<Record<string, Canonicalizable>>,
    outputs: Readonly<Record<string, Canonicalizable>>,
    note?: string,
  ): void {
    this.steps.push({ step, inputs, outputs, note });
  }

  build(): CognitiveCycleTrace {
    return { cycleId: this.cycleId, occurredAt: this.occurredAt, steps: this.steps.slice() };
  }
}

/** Fingerprint an entire cycle trace for the determinism-replay check. */
export function traceHash(trace: CognitiveCycleTrace): string {
  const payload = {
    cycleId: trace.cycleId,
    occurredAt: trace.occurredAt,
    steps: trace.steps.map((s) => ({
      step: s.step,
      inputs: s.inputs as Canonicalizable,
      outputs: s.outputs as Canonicalizable,
    })),
  };
  return stateHash(payload as Canonicalizable);
}

export function traceToCanonicalJson(trace: CognitiveCycleTrace): string {
  return canonicalStringify({
    cycleId: trace.cycleId,
    occurredAt: trace.occurredAt,
    steps: trace.steps.map((s) => ({
      step: s.step,
      inputs: s.inputs as Canonicalizable,
      outputs: s.outputs as Canonicalizable,
      note: s.note ?? null,
    })),
  } as Canonicalizable);
}
