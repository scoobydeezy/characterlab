/** Protocol publication barrier; no character state or serialization change. */
import {SchedulerContractError, type ConformanceInstrumentation} from '../substrate/scheduler';

interface NativeRun<T> {
  settle(): Promise<T>;
  settleForConformance(instrumentation: ConformanceInstrumentation): Promise<T>;
  snapshot(): unknown;
  save(): Uint8Array;
}

export function guardPublicWrapperSettlement<T, R extends NativeRun<T>>(runtime: R): R {
  let active = false;
  const requireQuiescence = () => {
    if (active) throw new SchedulerContractError('RUN_NOT_ACTIVE', 'public wrapper is not quiescent');
  };
  async function settle(instrumentation?: ConformanceInstrumentation) {
    // A rejected second caller must not release the first caller's barrier.
    requireQuiescence();
    active = true;
    try {
      return await (instrumentation ? runtime.settleForConformance(instrumentation) : runtime.settle());
    } finally {
      active = false;
    }
  }
  return {
    ...runtime,
    settle: () => settle(),
    settleForConformance: (instrumentation: ConformanceInstrumentation) => settle(instrumentation),
    snapshot: () => { requireQuiescence(); return runtime.snapshot(); },
    save: () => { requireQuiescence(); return runtime.save(); },
  } as R;
}
