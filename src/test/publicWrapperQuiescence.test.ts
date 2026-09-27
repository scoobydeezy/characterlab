import {it, expect} from 'vitest';
import {taskCase, bioCase, runtime} from './identityPublicFixtures';
import {matchedBiology} from './biologyPublicFixtures';
import {biologyRecipe, initialBytes, orderedBytes, compileBiologyModel, compileBiologyInputs} from '../campaign3/biologyPublicModel';
import {createBiologyRuntime} from '../campaign3/biologyPublicRuntime';

const factories = {
  identityTask: async () => (await runtime(taskCase())).runtime,
  identityBiology: async () => (await runtime(bioCase())).runtime,
  biologyPublic: async () => {
    const c = matchedBiology(), model = await compileBiologyModel(biologyRecipe(c.law, c.config));
    return createBiologyRuntime(model, await compileBiologyInputs(model, initialBytes(c.config.initial), orderedBytes(c.frames), new Uint8Array(32).fill(7)));
  },
};

for (const [name, create] of Object.entries(factories)) {
  it(`${name}: blocks the scheduler-to-ledger window and rejected concurrent callers cannot unlock it`, async () => {
    const run = await create(), reads: string[] = [];
    // Biological fixture acquires its competing motives before drawing at instant 9.
    if (name !== 'identityTask') for (let i = 0; i < 8; i++) await run.settle();
    const settling = run.settleForConformance({onBoundary(boundary) {
      if (boundary === 'before-commit') queueMicrotask(() => {
        for (const read of [() => run.save(), () => run.snapshot()]) {
          try { read(); reads.push('ACCEPTED'); } catch (e) { reads.push(String(e)); }
        }
      });
    }});
    await expect(run.settle()).rejects.toThrow('not quiescent');
    expect(() => run.save()).toThrow('not quiescent');
    await settling;
    expect(reads).toHaveLength(2);
    expect(reads.every(e => e.includes('not quiescent'))).toBe(true);
    expect(run.snapshot().randomAddresses.length).toBeGreaterThan(0);
    expect(run.save().length).toBeGreaterThan(0);
  }, 600000);

  it(`${name}: fault cleanup retains the prior snapshot without admitting a continuation save`, async () => {
    const run = await create();
    await run.settle();
    const before = run.snapshot();
    await expect(run.settleForConformance({onBoundary(boundary) {
      if (boundary === 'before-commit') throw Error('wrapper audit injected failure');
    }})).rejects.toThrow();
    const after = run.snapshot();
    expect(after.status).toBe('Failed');
    expect(after.clock).toEqual(before.clock);
    expect(after.state.canonicalValue()).toEqual(before.state.canonicalValue());
    expect(after.trace).toEqual(before.trace);
    expect(after.outputs).toEqual(before.outputs);
    expect(after.randomAddresses).toEqual(before.randomAddresses);
    expect(() => run.save()).toThrow();
    await expect(run.settle()).rejects.toThrow();
    expect(run.snapshot().status).toBe('Failed');
  }, 600000);
}
