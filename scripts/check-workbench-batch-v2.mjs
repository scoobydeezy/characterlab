import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const catalog = JSON.parse(fs.readFileSync('src/workbench/batchCatalogV2.json'));
for (const source of catalog.sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
const paths = ['src/workbench/batchSession.ts', 'src/workbench/experimentRegistry.ts', 'src/workbench/batchCatalogV2.json', 'src/workbench/BatchWorkbench.tsx', 'src/workbench/valuesAdapter.ts', 'src/workbench/reasonAdapter.ts', 'src/workbench/epiAdapter.ts', 'src/workbench/learnAdapter.ts', 'scripts/check-workbench-batch-v2.mjs'];
const sources = paths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
const out = 'docs/planning/workbench-batch-parity-rev2';
assert(!fs.existsSync(`${out}/receipt.json`), 'immutable receipt exists');
const server = await createServer({configFile: false, server: {middlewareMode: true, hmr: false}, appType: 'custom'});
try {
  const {BatchSession} = await server.ssrLoadModule('/src/workbench/batchSession.ts');
  const {batchReport} = await server.ssrLoadModule('/src/workbench/BatchWorkbench.tsx');
  const session = new BatchSession(catalog.jobs); let printed = 0;
  session.subscribe(() => {const s = session.snapshot(); if (s.current >= printed + 20) {printed = s.current; console.log(`PASS ${printed}/${catalog.jobs.length} batch programs`);}});
  await session.run(); const snapshot = session.snapshot();
  fs.mkdirSync(out, {recursive: true});
  if (snapshot.status !== 'complete') fs.writeFileSync(`${out}/failure.json`, JSON.stringify({sources, snapshot}, null, 2) + '\n', {flag: 'wx'});
  assert.equal(snapshot.status, 'complete');
  assert.equal(snapshot.results.length, 351);
  assert.equal(snapshot.results.reduce((n, r) => n + r.prefixes.length, 0), 1795);
  assert(snapshot.results.every(r => r.status === 'complete' && r.prefixes.every(p => p.matchesFrozenSave)));
  const report = batchReport(snapshot);
  assert.equal(report.originals.values.length, 18); assert.equal(report.originals.reason.length, 23); assert.equal(report.originals.epi.length,72); assert.equal(report.originals.learn.length,39);
  assert.deepEqual(report.snapshot.results.map(r => r.job), catalog.jobs);
  // Reject source drift during a long qualification run.
  for (const source of sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
  for (const source of sources) {const target=out+'/sources/'+source.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
  const receipt = {status: 'PASS SHARED BATCH EXECUTION', sources, programs: 351, prefixes: 1795, limitations: ['Available Values, REASON, EPI and LEARN seams only, not full corpus coverage.', 'Exact frozen save agreement does not establish psychological validity.', 'In-session pause/resume and fault paths are covered by focused tests; browser evidence is separate.'], report};
  fs.writeFileSync(`${out}/receipt.json`, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  console.log('PASS 351 programs / 1795 exact frozen prefixes / original inputs in export');
} finally {await server.close();}
