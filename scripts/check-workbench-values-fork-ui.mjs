import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

const root = 'docs/planning/workbench-values-fork-ui-rev1';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const read = path => JSON.parse(fs.readFileSync(path));
const browser = read(`${root}/browser.json`);
const ancestryRoot = 'docs/planning/workbench-values-causal-rev2';
const archive = `${ancestryRoot}/run-0.json.gz`;
const receipt = read(`${ancestryRoot}/receipt.json`);
const result = receipt.results.find(row => row.index === 0);
assert.equal(sha(fs.readFileSync(archive)), result.sha256);
assert.equal(sha(fs.readFileSync(result.referencePath)), result.referenceSha256);
const original = read(result.referencePath);
const native = JSON.parse(gunzipSync(fs.readFileSync(archive)));
const expected = [
  ['A2', 2], ['B2-restored', 2], ['B3', 3], ['A2-after-B3', 2],
  ['A3', 3], ['A4', 4], ['B4', 4], ['B2-restored-again', 2],
  ['A4-after-B-restore', 4], ['B4-repeated', 4],
];
assert.equal(browser.observations.length, expected.length);
for (const [index, [label, prefix]] of expected.entries()) {
  const observation = browser.observations[index], row = native.rows[prefix];
  assert.equal(observation.label, label);
  assert(observation.controls.includes(`${prefix}/4 instants`));
  assert.equal(observation.hashes.length, 4);
  assert.equal(observation.hashes[0], browser.observations[0].hashes[0]);
  assert.deepEqual(observation.hashes.slice(1), [row.runHash, row.stateHash, row.saveHash]);
  assert.equal(row.saveHash, original.prefixes[prefix].saveSha256);
}
assert(browser.partial.includes('2 matched prefixes inspected'));
assert(browser.partial.includes('CURRENT EXACT STATE\nDifferent'));
assert(browser.partial.includes('First exact state difference: none observed'));
assert(browser.partial.includes('Comparison is partial.'));
assert(browser.partial.includes('unexecuted tails are not equality evidence'));
for (const text of [browser.complete, browser.repeated]) {
  assert(text.includes('4 matched prefixes inspected'));
  assert(text.includes('CURRENT EXACT STATE\nEqual'));
  assert(text.includes('First exact state difference: none observed'));
  assert(text.includes('Both programs complete.'));
}
// Bind the served implementation to the already frozen, running batch build.
const freezePath = 'docs/planning/workbench-batch-browser-rev7/freeze.json';
const sources = read(freezePath).sources;
for (const source of sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256, source.path);
const checker = 'scripts/check-workbench-values-fork-ui.mjs';
const artifacts = [`${root}/browser.json`, `${root}/complete.png`, archive,
  `${ancestryRoot}/receipt.json`, result.referencePath, freezePath, checker];
fs.writeFileSync(`${root}/receipt.json`, JSON.stringify({
  status: 'PASS BOUNDED VALUES IN-MEMORY CHECKPOINT FORK',
  seamContract: 'values-integration-public/0.1-candidate',
  program: 0, observations: expected.length, prefixes: [2, 3, 4],
  frozenSourcesVerified: sources.length,
  artifacts: artifacts.map(path => ({ path, sha256: sha(fs.readFileSync(path)) })),
  scope: 'Browser capture A2, restore B2, independent B3/A2, identical A3/B3 and A4/B4, repeated B2 restore while A4 remains unchanged, and repeated B4 exact continuation. Every observed run/state/save hash joins original native evidence. Current-state inequality at unequal horizons is kept separate from matched-prefix divergence. No checkpoint file transfer, parameter-changing live fork, all-program browser coverage or complete integrated demonstration claim.',
}, null, 2) + '\n', { flag: 'wx' });
console.log('PASS Values checkpoint fork: 10 browser observations joined to native prefixes 2/3/4');
