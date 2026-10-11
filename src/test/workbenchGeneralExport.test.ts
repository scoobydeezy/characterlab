import {expect, it} from 'vitest';
import {GeneralWorkbenchRun} from '../workbench/generalAdapter';
import {exportGeneral, importGeneral} from '../workbench/generalExport';
import {EXPERIMENTS, createBatchRun} from '../workbench/experimentRegistry';
it('exports originals and authenticates diagnostics before exact native continuation', async () => {
  const run = await GeneralWorkbenchRun.create();
  await run.advance();
  const exported = await exportGeneral(run);
  const restored = await importGeneral(JSON.stringify(exported));
  expect(restored.snapshot()).toEqual(run.snapshot());
  await run.advance(); await restored.advance();
  expect(restored.checkpoint()).toEqual(run.checkpoint());
  const tampered = structuredClone(exported); tampered.snapshot.clock = '999';
  await expect(importGeneral(JSON.stringify(tampered))).rejects.toThrow('mismatch');
  const changedOriginal = structuredClone(exported); changedOriginal.originalInputs = '00';
  await expect(importGeneral(JSON.stringify(changedOriginal))).rejects.toThrow('mismatch');
  expect(exported.snapshot.prefix).toBe(1);
}, 600000);
it('rejects unknown versions and declares graph capabilities without batch or narrative support', async () => {
  await expect(importGeneral('{"version":"future"}')).rejects.toThrow('version');
  const descriptor = EXPERIMENTS.find(e => e.id === 'general')!;
  expect(descriptor.capabilities.graph.supported).toBe(true);
  expect(descriptor.capabilities.matrix.supported).toBe(true);
  expect(descriptor.capabilities.explanation.supported).toBe(false);
  await expect(createBatchRun({experimentId:'general'} as never)).rejects.toThrow('Unsupported');
});
