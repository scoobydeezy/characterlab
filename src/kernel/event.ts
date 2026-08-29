/**
 * Deterministic event model, per Brief §6.
 *
 * Every event has: EventId, OccurredAt, EventType, CanonicalPayload.
 *
 * OccurredAt is a logical simulation tick (a non-negative integer), never
 * wall-clock time — Brief §3.1 explicitly forbids "wall-clock timing" as an
 * input to authoritative state. The world/input sequence I *is* the
 * ordered list of events; nothing about their processing may depend on
 * when, in real time, this code happens to run.
 */

export type CanonicalPayload = Readonly<Record<string, unknown>>;

export interface SimEvent<P extends CanonicalPayload = CanonicalPayload> {
  readonly eventId: string;
  readonly occurredAt: number; // logical tick
  readonly eventType: string;
  readonly payload: P;
}

/**
 * EventId is derived purely from (eventType, occurredAt, sequence-within-tick)
 * — never from a wall-clock timestamp or a random UUID — so replaying the
 * same input sequence I reproduces identical EventIds, which in turn keeps
 * every downstream PurposeId-addressed random draw (kernel/random.ts)
 * identical.
 */
export function makeEventId(eventType: string, occurredAt: number, sequenceInTick: number): string {
  return `${eventType}@t${occurredAt}#${sequenceInTick}`;
}

export function makeEvent<P extends CanonicalPayload>(
  eventType: string,
  occurredAt: number,
  sequenceInTick: number,
  payload: P,
): SimEvent<P> {
  return {
    eventId: makeEventId(eventType, occurredAt, sequenceInTick),
    occurredAt,
    eventType,
    payload,
  };
}

/**
 * A simulation-local monotonic tick + per-tick sequence counter. This is
 * the only place "the next id" is decided, and it is entirely a function
 * of how many events have already been constructed in this run — not of
 * real time.
 */
export class EventClock {
  private tick = 0;
  private sequenceInTick = 0;

  now(): number {
    return this.tick;
  }

  /** Advance to a new logical tick (e.g. after "Advance Time"). Resets the
   * per-tick sequence counter. */
  advance(deltaTicks = 1): number {
    this.tick += deltaTicks;
    this.sequenceInTick = 0;
    return this.tick;
  }

  /** Jump directly to an absolute tick (used when forking a throwaway clock
   * for a side-effect-free determinism-replay check — see
   * ui/state/useEngine.ts). Resets the per-tick sequence counter, matching
   * what a fresh EventClock advanced tick-by-tick to the same point would
   * have. */
  advanceTo(tick: number): number {
    this.tick = tick;
    this.sequenceInTick = 0;
    return this.tick;
  }

  nextSequence(): number {
    return this.sequenceInTick++;
  }

  emit<P extends CanonicalPayload>(eventType: string, payload: P): SimEvent<P> {
    return makeEvent(eventType, this.tick, this.nextSequence(), payload);
  }
}
