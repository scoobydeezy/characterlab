import {expect, it} from 'vitest';
import {GeneralWorkbenchRun} from '../workbench/generalAdapter';
import {generalAttentionModelSource as source, prepareGeneralAttentionModel as prepare, generalAttentionInitialState as initial, generalAttentionOrderedInputs as originals, createGeneralAttentionRun as create} from '../campaign3/generalFactory';
import {bytesToHex} from '../substrate/canonicalEncoding';
it('projects actual native association state without changing any complete-prefix save', async () => {
  const adapter = await GeneralWorkbenchRun.create(), token = await prepare(source('baseline'));
  const native = await create(token, {initialState: initial(token), orderedInputs: originals(token), runSeed: new Uint8Array(32)});
  for (let i = 0; i <= 4; i++) {
    expect(adapter.checkpoint().saveHex).toBe(bytesToHex(native.save()));
    const view = adapter.snapshot();
    expect(view.graph).not.toBeNull();
    expect(view.graph!.weights.length).toBe(view.graph!.nodes.length);
    expect(await adapter.advance()).toBe(await native.settleNextInstant());
  }
  const view = adapter.snapshot();
  expect(view.graph!.nodes.length).toBeGreaterThan(1);
  expect(view.graph!.weights.some(row => row.some(w => w.units !== '0'))).toBe(true);
  const before = adapter.checkpoint(); view.graph!.nodes.length = 0; view.timeline.length = 0;
  expect(adapter.checkpoint()).toEqual(before);
  expect(adapter.snapshot().graph!.nodes.length).toBeGreaterThan(1);
}, 600000);
it('authenticates a native graph checkpoint and continues the same exact tail', async () => {
  const adapter = await GeneralWorkbenchRun.create(); await adapter.advance(); await adapter.advance();
  const checkpoint = adapter.checkpoint(), restored = await GeneralWorkbenchRun.restore(checkpoint);
  expect(restored.snapshot()).toEqual(adapter.snapshot());
  let moved = true;
  while (moved) {
    moved = await adapter.advance();
    expect(await restored.advance()).toBe(moved);
    expect(restored.checkpoint()).toEqual(adapter.checkpoint());
  }
  expect(restored.snapshot().complete).toBe(true);
  await expect(GeneralWorkbenchRun.restore({...checkpoint, prefix: 0})).rejects.toThrow('mismatch');
}, 600000);
