import {it, expect} from 'vitest';
import {bioCase, runtime} from './identityPublicFixtures';
import {matchedBiology} from './biologyPublicFixtures';
import {biologyRecipe, initialBytes, orderedBytes, compileBiologyModel, compileBiologyInputs} from '../campaign3/biologyPublicModel';
import {createBiologyRuntime} from '../campaign3/biologyPublicRuntime';

for (const identity of [false, true]) {
  it(`${identity ? 'identity Biology' : 'Biology'} preserves an acquired RNG ledger when a later contested instant rolls back`, async () => {
    const run = await (async () => {
      if (identity) return (await runtime(bioCase())).runtime;
      const c = matchedBiology(), m = await compileBiologyModel(biologyRecipe(c.law, c.config));
      return createBiologyRuntime(m, await compileBiologyInputs(m, initialBytes(c.config.initial), orderedBytes(c.frames), new Uint8Array(32).fill(7)));
    })();
    for (let i = 0; i < 9; i++) await run.settle();
    const before = run.snapshot();
    expect(before.randomAddresses.length).toBeGreaterThan(0);
    await expect(run.settleForConformance({onBoundary(boundary) {
      if (boundary === 'before-commit') throw Error('rollback after contested draw');
    }})).rejects.toThrow();
    const after = run.snapshot();
    expect(after.status).toBe('Failed');
    expect(after.clock).toEqual(before.clock);
    expect(after.state.canonicalValue()).toEqual(before.state.canonicalValue());
    expect(after.trace).toEqual(before.trace);
    expect(after.randomAddresses).toEqual(before.randomAddresses);
    expect(() => run.save()).toThrow();
  }, 600000);
}
