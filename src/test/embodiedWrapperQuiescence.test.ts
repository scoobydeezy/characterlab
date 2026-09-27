import {it, expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {compileEmbodiedInputs} from '../campaign3/embodiedAdmission';
import {createEmbodiedRuntime} from '../campaign3/embodiedRuntime';

async function create() {
  const model = await compileEmbodiedModel({...freeze.versions, ...Object.fromEntries(['content','registry','parameters'].map(k => [k, bytes('baseline/'+k+'.cenc.hex')]))} as Parameters<typeof compileEmbodiedModel>[0]);
  const initial = bytes('runs/baseline/initial-state.cenc.hex');
  return createEmbodiedRuntime(model, await compileEmbodiedInputs(bytes('runs/baseline/ordered-inputs.cenc.hex'), initial, model.modelIdentity, new Uint8Array(32)), model.state.restoreState(initial));
}

it('rejects a settlement entering the scheduler-to-ingress-cleanup window without failing the run', async () => {
  const run = await create(), serial = await create();
  let second: Promise<unknown> | undefined;
  await run.settleNextInstantForConformance({onBoundary(boundary) {
    if (boundary === 'before-commit') queueMicrotask(() => {
      second = run.settleNextInstant().then(() => 'ACCEPTED', e => String(e));
      expect(() => run.save()).toThrow('not quiescent');
      expect(() => run.snapshot()).toThrow('not quiescent');
    });
  }});
  expect(await second).toContain('not quiescent');
  expect(run.snapshot().status).toBe('Active');
  while (await run.settleNextInstant()) {}
  while (await serial.settleNextInstant()) {}
  expect(run.save()).toEqual(serial.save());
}, 120000);

it('clears the barrier after rollback, keeps diagnostics, and rejects failed continuation saves', async () => {
  const run = await create(), before = run.snapshot();
  await expect(run.settleNextInstantForConformance({onBoundary(boundary) {
    if (boundary === 'before-commit') throw Error('wrapper audit injected failure');
  }})).rejects.toThrow();
  expect(run.snapshot().status).toBe('Failed');
  expect(run.snapshot().clock).toEqual(before.clock);
  expect(run.snapshot().state.canonicalValue()).toEqual(before.state.canonicalValue());
  expect(run.diagnostic()).toBeDefined();
  expect(() => run.save()).toThrow();
}, 120000);
