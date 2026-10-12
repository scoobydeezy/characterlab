import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const catalog = JSON.parse(fs.readFileSync('src/workbench/batchCatalogV3.json'));
for (const source of catalog.sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
const paths = ['src/workbench/batchSession.ts', 'src/workbench/experimentRegistry.ts', 'src/workbench/batchCatalogV3.json', 'src/workbench/BatchWorkbench.tsx', 'src/workbench/valuesAdapter.ts', 'src/workbench/reasonAdapter.ts', 'src/workbench/epiAdapter.ts', 'src/workbench/learnAdapter.ts', 'src/workbench/beliefAdapter.ts', 'src/workbench/affectAdapter.ts', 'src/workbench/affectSupplementAdapter.ts', 'src/workbench/affectSession.ts', 'src/workbench/PreparedExport.tsx', 'scripts/check-workbench-batch-v3.mjs'];
const sources = paths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
const out = 'docs/planning/workbench-batch-parity-rev3';
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
  assert.equal(snapshot.results.length, 504);
  assert.equal(snapshot.results.reduce((n, r) => n + r.prefixes.length, 0), 3612);
  assert(snapshot.results.every(r => r.status === 'complete' && r.prefixes.every(p => p.matchesFrozenSave)));
  const report = batchReport(snapshot);
  assert.equal(report.originals.values.length, 18); assert.equal(report.originals.reason.length, 23); assert.equal(report.originals.epi.length,72); assert.equal(report.originals.learn.length,39); assert.equal(report.originals.belief.runs.length,48); assert.equal(report.originals.affect.runs.length,91); assert.equal(report.originals.affect.supplementaryRuns.length,14); assert.equal(report.originals.affect.models.length,18);
  assert.deepEqual(report.snapshot.results.map(r => r.job), catalog.jobs);
  // Reject source drift during a long qualification run.
  for (const source of sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
  for (const source of sources) {const target=out+'/sources/'+source.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
  const receipt = {status: 'PASS SHARED BATCH EXECUTION', sources, programs: 504, prefixes: 3612, limitations: ['Six available seams only;490 main programs plus14 supplementary AFFECT execution roles, not full corpus coverage.', 'Exact frozen save agreement does not establish psychological validity.', 'In-session pause/resume and fault paths are covered by focused tests; browser evidence is separate.'], report};
  fs.writeFileSync(`${out}/receipt.json`, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  console.log('PASS 504 programs / 3612 exact frozen prefixes / original inputs in export');
} finally {await server.close();}
