import {describe, it, expect} from 'vitest';
import {ReasonWorkbenchRun} from '../workbench/reasonAdapter';
import {prepareReasonModel, createReasonRun} from '../campaign3/reasonFactory';
import {reasonRecipe} from '../campaign3/reasonModel';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {cases, initialState, ordered, seed} from './reasonFixtures';
import {exactText} from '../workbench/canonical';
import {decodeReason} from '../campaign3/reasonCodecs';

async function complete(name: string, law = 1) {
  const run = await ReasonWorkbenchRun.create({name, law, seed: 7});
  while (await run.advance()) { /* quiescent public steps */ }
  return run;
}
describe('Joined REASON observer adapter', () => {
  it('retains native bytes and historical records at every continued prefix', async () => {
    const adapter = await ReasonWorkbenchRun.create({name: 'continued', law: 1, seed: 7});
    const native = await createReasonRun(await prepareReasonModel(reasonRecipe()), {initialState, orderedInputs: ordered(cases().continued), runSeed: seed});
    for (let prefix = 0; prefix <= 4; prefix++) {
      expect(adapter.checkpoint().saveHex).toBe(bytesToHex(native.save()));
      expect(adapter.snapshot().outputs).toBe(exactText(decodeReason(native.snapshot().outputs)));
      expect(await adapter.advance()).toBe(await native.settleNextInstant());
    }
    const snapshot = adapter.snapshot();
    expect(snapshot.probes.map(p => p.instant)).toEqual(['2', '4']);
    expect(snapshot.probes.every(p => p.kind === 'Compilation probe')).toBe(true);
    expect(snapshot.timeline.filter(e => e.stage === 'decision').map(e => e.instant)).toEqual(['1', '3']);
    expect(snapshot.randomAddresses.length).toBeGreaterThan(0);
  }, 600000);
  it('exposes collective coverage, comparator residual, and rejection causes', async () => {
    const aggregate = (await complete('collective')).snapshot().probes[0];
    const pairwise = (await complete('collective', 3)).snapshot().probes[0];
    expect(aggregate.reasons[0].base).toBe('17/29');
    expect(aggregate.reasons[0].die).toBe('d6');
    expect(aggregate.reasons[0].human).toContain('Supports Option A. The group concerns Task A, with motive Commitment.');
    expect(aggregate.reasons[0].witnesses.at(-1)?.effective).toBe('0/1');
    expect(pairwise.reasons[0].base).toBe('37/61');
    expect(pairwise.reasons[0].die).toBe('d8');
    const zero = (await complete('zeroStanding')).snapshot().probes[0];
    expect(zero.reasons).toHaveLength(0);
    expect(zero.rejected[0].cause).toBe('Zero net base: no die');
    expect(zero.rawRejected[0].cause).toBe('Zero raw strength');
  }, 600000);
  it('keeps hidden values out of explanations and exposes denied evidence as absent', async () => {
    const visible = (await complete('collective')).snapshot().probes;
    const hidden = (await complete('hidden')).snapshot().probes;
    expect(hidden).toEqual(visible);
    const denied = (await complete('denied')).snapshot().probes[0];
    expect(denied.reasons).toHaveLength(0);
    expect(denied.rawRejected.every(r => r.cause === 'Missing accessible source support')).toBe(true);
  }, 600000);
  it('does not describe pooled motives as one shared source meaning', async () => {
    const pooled = (await complete('motive', 2)).snapshot().probes[0];
    expect(pooled.reasons).toHaveLength(1);
    expect(pooled.reasons[0].human).toContain('pools source motives and referents');
    expect(pooled.reasons[0].human).not.toContain('with motive Commitment');
    expect(pooled.reasons[0].witnesses.some(w => w.provenance.includes('Safety'))).toBe(true);
  }, 600000);
  it('authenticates complete checkpoints, detaches views, and guards settlement', async () => {
    const run = await ReasonWorkbenchRun.create({name: 'continued', law: 1, seed: 7});
    const pending = run.advance();
    expect(() => run.snapshot()).toThrow('advancing');
    await expect(run.advance()).rejects.toThrow('in flight');
    await pending;
    const checkpoint = run.checkpoint(), restored = await ReasonWorkbenchRun.restore(checkpoint);
    const detached = restored.snapshot(); detached.timeline.length = 0;
    expect(restored.snapshot().timeline.length).toBeGreaterThan(0);
    while (await run.advance()) {expect(await restored.advance()).toBe(true); expect(restored.checkpoint()).toEqual(run.checkpoint());}
    expect(await restored.advance()).toBe(false);
    await expect(ReasonWorkbenchRun.restore({...checkpoint, prefix: 0})).rejects.toThrow();
    await expect(ReasonWorkbenchRun.restore({...checkpoint, config: {...checkpoint.config, seed: 6}})).rejects.toThrow();
  }, 600000);
});
