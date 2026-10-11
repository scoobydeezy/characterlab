import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const out = 'docs/planning/workbench-general-parity-rev1';
assert(!fs.existsSync(`${out}/receipt.json`), 'immutable receipt exists');
const paths = ['src/workbench/generalAdapter.ts', 'src/workbench/associationProjection.ts', 'src/workbench/nativeTimeline.ts', 'scripts/check-workbench-general.mjs'];
const sources = paths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
const server = await createServer({configFile: false, server: {middlewareMode: true, hmr: false}, appType: 'custom'});
try {
  const {GeneralWorkbenchRun} = await server.ssrLoadModule('/src/workbench/generalAdapter.ts');
  const factory = await server.ssrLoadModule('/src/campaign3/generalFactory.ts');
  const results = [];
  for (const recipe of ['baseline', 'association-decay']) {
    const adapter = await GeneralWorkbenchRun.create(recipe), token = await factory.prepareGeneralAttentionModel(factory.generalAttentionModelSource(recipe));
    const native = await factory.createGeneralAttentionRun(token, {initialState: factory.generalAttentionInitialState(token), orderedInputs: factory.generalAttentionOrderedInputs(token), runSeed: new Uint8Array(32)});
    const prefixes = [];
    do {
      const s = adapter.snapshot(); assert.equal(s.saveHash, sha(native.save()));
      assert.equal(s.stateHash, sha(native.snapshot().state));
      prefixes.push({prefix: s.prefix, clock: s.clock, saveHash: s.saveHash, stateHash: s.stateHash, nodes: s.graph?.nodes.length, graph: s.graph});
      const a = await adapter.advance(), b = await native.settleNextInstant(); assert.equal(a, b); if (!a) break;
    } while (prefixes.length <= 100);
    assert.equal(adapter.snapshot().complete, true);
    results.push({recipe, seed: 0, prefixes, events: adapter.snapshot().timeline.length});
    console.log(`PASS ${recipe}: ${prefixes.length} exact prefixes, ${results.at(-1).events} events`);
  }
  for (const source of sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
  fs.mkdirSync(out, {recursive: true});
  fs.writeFileSync(`${out}/receipt.json`, JSON.stringify({status: 'PASS BOUNDED GENERAL ATTENTION INSTRUMENT PARITY', sources, results, limitations: ['Two exact frozen recipes at seed0 only; other recipe UI choices remain unqualified.', 'Diagnostic association matrix/row projection, not a personality embedding or general causal claim.', 'Full corpus, language and entry acceptance remain open.']}, null, 2) + '\n', {flag: 'wx'});
} finally {await server.close();}
