import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const base = 'docs/planning/workbench-general-parity-rev1';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const native = JSON.parse(fs.readFileSync(`${base}/receipt.json`, 'utf8'));
const browser = JSON.parse(fs.readFileSync(`${base}/browser/verification.json`, 'utf8'));
const graph = JSON.parse(fs.readFileSync(`${base}/browser/prefix3-graph.json`, 'utf8'));
const prefix = native.results.find(r => r.recipe === browser.recipe).prefixes.find(p => p.prefix === browser.prefix);
assert.deepEqual(graph, prefix.graph);
assert(browser.hashes.includes(prefix.saveHash));
assert(browser.hashes.includes(prefix.stateHash));
for (const source of native.sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
const paths = [...native.sources.map(s => s.path), 'src/workbench/GeneralWorkbench.tsx', 'src/workbench/AssociationInspector.tsx', 'src/workbench/generalWorker.ts', 'src/workbench/generalWorkerClient.ts', 'src/workbench/WorkbenchApp.tsx', 'scripts/check-workbench-general-browser.mjs'];
const sources = paths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
for (const source of sources) {
  const target = `${base}/sources/${source.path}`;
  fs.mkdirSync(target.slice(0, target.lastIndexOf('/')), {recursive: true});
  fs.writeFileSync(target, fs.readFileSync(source.path), {flag: 'wx'});
}
fs.writeFileSync(`${base}/browser/check.json`, JSON.stringify({status: 'PASS EXACT BROWSER GRAPH AND PREFIX IDENTITY', recipe: browser.recipe, prefix: browser.prefix, sources, evidence: ['receipt.json', 'browser/verification.json', 'browser/prefix3-graph.json'].map(path => ({path, sha256: sha(fs.readFileSync(`${base}/${path}`))})), limitations: browser.limitations}, null, 2) + '\n', {flag: 'wx'});
console.log('PASS browser graph, native prefix hashes and exact source snapshots');
