import {describe, expect, it} from 'vitest';
import {BatchSession} from '../workbench/batchSession';
import type {BatchJob, BatchRunView, InspectableBatchRun} from '../workbench/experimentRegistry';
import catalog from '../workbench/batchCatalog.json';
const hashes = ['a', 'b', 'c'].map(x => x.repeat(64));
const job = (): BatchJob => ({id: 'test/1', experimentId: 'reason', name: 'collective', law: 1, seed: 7, expectedSaveHashes: [...hashes]});
function fakeRun(beforeAdvance: () => Promise<void> = async () => {}): InspectableBatchRun {
  let prefix = 0;
  return {view: (): BatchRunView => ({prefix, total: 2, complete: prefix === 2, clock: String(prefix), modelHash: hashes[0], runHash: hashes[0], stateHash: hashes[prefix], saveHash: hashes[prefix]}),
    advance: async () => {if (prefix === 2) return false; await beforeAdvance(); prefix++; return true;}};
}
describe('Bounded workbench batch sessions', () => {
  it('pauses at a completed instant and resumes the same run with no lost prefixes', async () => {
    let release!: () => void, started!: () => void, creates = 0;
    const gate = new Promise<void>(r => {release = r;}), advancing = new Promise<void>(r => {started = r;});
    const batch = new BatchSession([job()], async () => {creates++; return fakeRun(async () => {started(); await gate;});});
    const work = batch.run(); await advancing;
    await expect(batch.run()).rejects.toThrow('in flight');
    batch.pause(); release(); await work;
    expect(batch.snapshot().status).toBe('paused');
    expect(batch.snapshot().results[0].prefixes.map(p => p.prefix)).toEqual([0, 1]);
    const detached = batch.snapshot(); detached.results[0].job.name = 'mutated'; detached.results[0].prefixes.length = 0;
    await batch.run();
    expect(creates).toBe(1); expect(batch.snapshot().status).toBe('complete');
    expect(batch.snapshot().results[0].job.name).toBe('collective');
    expect(batch.snapshot().results[0].prefixes.map(p => p.saveHash)).toEqual(hashes);
  });
  it('retains a mismatch and stops before the next program', async () => {
    const first = job(); first.expectedSaveHashes[1] = 'd'.repeat(64);
    let creates = 0;
    const batch = new BatchSession([first, {...job(), id: 'test/2'}], async () => {creates++; return fakeRun();});
    await batch.run(); const result = batch.snapshot();
    expect(creates).toBe(1); expect(result.status).toBe('failed');
    expect(result.results[0].prefixes.at(-1)?.matchesFrozenSave).toBe(false);
    expect(result.results[0].error).toBe('Frozen save mismatch at prefix 1');
    expect(result.results[1].status).toBe('queued');
    await expect(batch.run()).rejects.toThrow('immutable');
  });
  it('rejects resource overflow and duplicate jobs before execution', () => {
    expect(() => new BatchSession([])).toThrow();
    expect(() => new BatchSession([job(), job()])).toThrow();
    expect(() => new BatchSession(Array.from({length: 352}, (_, i) => ({...job(), id: String(i)})))).toThrow();
    expect(() => new BatchSession([{...job(), expectedSaveHashes: Array(34).fill(hashes[0])}])).toThrow();
  });
  it('rejects early termination and terminal mutation without a passing receipt', async () => {
    const early = new BatchSession([job()], async () => ({view: fakeRun().view, advance: async () => false}));
    await early.run(); expect(early.snapshot().status).toBe('failed');
    const original = fakeRun(); let terminalMutation = false;
    const terminal = new BatchSession([job()], async () => ({view: () => ({...original.view(), ...(terminalMutation ? {stateHash: 'e'.repeat(64)} : {})}), advance: async () => {const moved = await original.advance(); if (!moved) terminalMutation = true; return moved;}}));
    await terminal.run(); expect(terminal.snapshot().results[0].error).toBe('Terminal call changed the committed view');
  });
  it('executes both real adapter types through the common protocol', async () => {
    const jobs = [catalog.jobs.find(j => j.experimentId === 'values')!, catalog.jobs.find(j => j.experimentId === 'reason' && j.name === 'collective' && j.law === 3)!];
    const batch = new BatchSession(jobs as BatchJob[]); await batch.run();
    expect(batch.snapshot().status).toBe('complete');
    expect(batch.snapshot().results.map(r => r.prefixes.length)).toEqual([5, 3]);
    expect(batch.snapshot().results.every(r => r.prefixes.every(p => p.matchesFrozenSave))).toBe(true);
  }, 600000);
});
