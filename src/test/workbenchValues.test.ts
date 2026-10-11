import {describe, it, expect} from 'vitest';
import {ValuesWorkbenchRun, defaultConfiguration, valuesFixture, compareValues, auditReasons} from '../workbench/valuesAdapter';
import {prepareIntegrationModel, createIntegrationPublicRun} from '../campaign3/valuesIntegrationPublicFactory';
import {integrationRecipe, integrationInitial, integrationOrdered} from '../campaign3/valuesIntegrationPublicModel';
import {bytesToHex} from '../substrate/canonicalEncoding';

describe('Values workbench public adapter', () => {
  it('preserves direct native save bytes, outputs and RNG at every prefix', async () => {
    const config = defaultConfiguration(), adapter = await ValuesWorkbenchRun.create(config);
    const direct = await createIntegrationPublicRun(await prepareIntegrationModel(integrationRecipe('Accumulated')), {initialState: integrationInitial(), orderedInputs: integrationOrdered(config.frames), runSeed: new Uint8Array(32)});
    for (let prefix = 0; prefix <= 4; prefix++) {
      const view = adapter.snapshot();
      expect(view.prefix).toBe(prefix);
      expect(adapter.checkpoint().saveHex).toBe(bytesToHex(direct.save()));
      expect(view.rows).toEqual(direct.rows());
      expect(view.randomAddresses).toEqual(direct.snapshot().randomAddresses);
      expect(view.timeline).toHaveLength(prefix * 13);
      expect(await adapter.advance()).toBe(await direct.settleNextInstant());
    }
    expect(adapter.snapshot().reasons.length).toBeGreaterThan(0);
    expect(adapter.snapshot().timeline.map(e => e.stage)).toContain('observation');
  }, 600000);

  it('authenticates checkpoints and reproduces complete remaining tails', async () => {
    const run = await ValuesWorkbenchRun.create();
    await run.advance(); await run.advance();
    const checkpoint = run.checkpoint(), restored = await ValuesWorkbenchRun.restore(checkpoint);
    do {expect(restored.checkpoint().saveHex).toBe(run.checkpoint().saveHex); expect(await restored.advance()).toBe(await run.advance());} while (run.snapshot().prefix < 4);
    expect(restored.checkpoint().saveHex).toBe(run.checkpoint().saveHex);
    await expect(ValuesWorkbenchRun.restore({...checkpoint, prefix: 1})).rejects.toThrow('prefix');
    const forged = structuredClone(checkpoint); forged.config.profile.seed = 1;
    await expect(ValuesWorkbenchRun.restore(forged)).rejects.toThrow('configuration');
    await expect(ValuesWorkbenchRun.restore({...checkpoint, saveHash: 'forged'})).rejects.toThrow('digest');
  }, 600000);

  it('detaches reads and rejects concurrent advancement without exposing partial state', async () => {
    const run = await ValuesWorkbenchRun.create(), before = run.checkpoint();
    const config = run.configuration(); config.frames[0].world.outcome = -1;
    const snapshot = run.snapshot(); snapshot.fields.length = 0;
    expect(run.checkpoint()).toEqual(before);
    const pending = run.advance();
    expect(() => run.snapshot()).toThrow('advancing');
    expect(() => run.checkpoint()).toThrow('advancing');
    await expect(run.advance()).rejects.toThrow('in flight'); await pending;
    expect(run.snapshot().prefix).toBe(1);
    expect(run.snapshot().fields.length).toBeGreaterThan(0);
  }, 600000);

  it('finds evidence-relative divergence and preserves explanation history', async () => {
    const a = await ValuesWorkbenchRun.create(), config = defaultConfiguration();
    config.frames = valuesFixture('Withheld outcome');
    const b = await ValuesWorkbenchRun.create(config);
    await a.advance(); await b.advance();
    expect(compareValues(a, b).firstSemanticInstant).toBeNull();
    await a.advance(); await b.advance();
    expect(compareValues(a, b).firstSemanticInstant).toBe(2);
    expect(compareValues(a, b).firstExactStatePrefix).toBe(2);
    expect(compareValues(a, b).controlledDifference.inputChanges).toEqual([{path: 'frames.1.observation.visible', before: true, after: false}]);
    const historical = a.snapshot().reasons;
    await a.advance(); await a.advance();
    expect(a.snapshot().reasons.filter(r => r.instant === 2)).toEqual(historical);
    expect(auditReasons(a.snapshot().reasons).issues).toEqual([]);
  }, 600000);

  it('fixed admitted evidence keeps reasons equal across distinct physical outcomes', async () => {
    const ca = defaultConfiguration(), cb = defaultConfiguration();
    for (const c of [ca, cb]) c.frames.forEach(f => {f.observation.display = 'Positive'; f.observation.goalDisplay = 'Present';});
    cb.frames.forEach(f => {f.world.permitted = false; f.world.outcome = -1;});
    const a = await ValuesWorkbenchRun.create(ca), b = await ValuesWorkbenchRun.create(cb);
    while (await a.advance()) await b.advance();
    expect(a.snapshot().reasons).toEqual(b.snapshot().reasons);
    expect(compareValues(a, b).firstSemanticInstant).toBeNull();
    expect(compareValues(a, b).firstExactStatePrefix).toBe(2);
    expect(compareValues(a, b).stateEqual).toBe(false);
  }, 600000);

  it('Refold is a model comparison with equal observer rows and distinct storage', async () => {
    const a = await ValuesWorkbenchRun.create(), config = defaultConfiguration(); config.profile.law = 'Refold';
    const b = await ValuesWorkbenchRun.create(config);
    while (await a.advance()) await b.advance();
    expect(compareValues(a, b).protocol).toBe('Model comparison');
    expect(compareValues(a, b).firstSemanticInstant).toBeNull();
    expect(compareValues(a, b).firstExactStatePrefix).toBe(0);
    expect(a.snapshot().activity.some(x => x.root === '1517')).toBe(true);
    expect(b.snapshot().activity.some(x => x.root === '1517')).toBe(false);
    expect(b.snapshot().fields.find(x => x.key === 'view.preference')?.authority).toBe('Derived');
  }, 600000);

  it('rejects invalid configuration and distinguishes no reasons from no opportunity', async () => {
    const config = defaultConfiguration(); config.frames = valuesFixture('Withheld outcome');
    const run = await ValuesWorkbenchRun.create(config);
    while (await run.advance()) { /* complete the bounded program */ }
    expect(run.snapshot().rows[0].status).toBe('NoOpportunity');
    expect(run.snapshot().rows[2].status).toBe('NoReasons');
    const tooShort = defaultConfiguration(); tooShort.frames.pop();
    await expect(ValuesWorkbenchRun.create(tooShort)).rejects.toThrow('exactly instants');
    const invalid = defaultConfiguration(); invalid.profile.seed = 256;
    await expect(ValuesWorkbenchRun.create(invalid)).rejects.toThrow();
  }, 600000);
});
