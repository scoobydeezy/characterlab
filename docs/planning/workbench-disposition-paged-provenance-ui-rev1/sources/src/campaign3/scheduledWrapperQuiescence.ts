import type {ConformanceInstrumentation} from '../substrate/scheduler';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';

interface ScheduledRun<T> {
  settleNextInstant(): Promise<T>;
  settleNextInstantForConformance(instrumentation: ConformanceInstrumentation): Promise<T>;
  snapshot(): unknown;
  save(): Uint8Array;
}

/** Same publication barrier for the older scheduler-named runtime interface. */
export function guardScheduledPublicWrapper<T, R extends ScheduledRun<T>>(runtime: R): R {
  const guarded = guardPublicWrapperSettlement({
    ...runtime,
    settle: () => runtime.settleNextInstant(),
    settleForConformance: (instrumentation: ConformanceInstrumentation) => runtime.settleNextInstantForConformance(instrumentation),
  });
  return {
    ...runtime,
    settleNextInstant: guarded.settle,
    settleNextInstantForConformance: guarded.settleForConformance,
    snapshot: guarded.snapshot,
    save: guarded.save,
  } as R;
}
