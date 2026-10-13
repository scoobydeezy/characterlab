import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const catalog = JSON.parse(fs.readFileSync('src/workbench/batchCatalogV7.json'));
for (const source of catalog.sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
const paths = ['src/workbench/socialAdapter.ts','src/workbench/socialCharacter.ts','src/workbench/socialCatalog.json','src/workbench/relationshipAdapter.ts','src/workbench/relationshipCharacter.ts','src/workbench/relationshipCatalog.json','src/workbench/relationshipLegacyCatalog.json','src/test/workbenchBatchV7.test.ts','src/workbench/skillAdapter.ts','src/workbench/skillCharacter.ts','src/workbench/skillCatalog.json','src/workbench/habitAdapter.ts','src/workbench/habitCharacter.ts','src/workbench/habitCatalog.json','src/workbench/batchSession.ts', 'src/workbench/experimentRegistry.ts', 'src/workbench/batchCatalogV7.json', 'src/workbench/BatchWorkbench.tsx', 'src/workbench/valuesAdapter.ts', 'src/workbench/reasonAdapter.ts', 'src/workbench/epiAdapter.ts', 'src/workbench/learnAdapter.ts', 'src/workbench/beliefAdapter.ts', 'src/workbench/affectAdapter.ts', 'src/workbench/affectSupplementAdapter.ts', 'src/workbench/affectSession.ts', 'src/workbench/PreparedExport.tsx', 'src/workbench/decisionAdapter.ts', 'src/workbench/commitAdapter.ts', 'src/workbench/workAdapter.ts', 'src/workbench/workCharacter.ts', 'src/workbench/workCatalog.json', 'scripts/build-workbench-batch-catalog-v6.mjs', 'scripts/check-workbench-batch-v7.mjs'];
const sources = paths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
const out = 'docs/planning/workbench-batch-parity-rev7';
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
  assert.equal(snapshot.results.length, 915);
  assert.equal(snapshot.results.reduce((n, r) => n + r.prefixes.length, 0), 5875);
  assert(snapshot.results.every(r => r.status === 'complete' && r.prefixes.every(p => p.matchesFrozenSave)));
  const report = batchReport(snapshot);
  assert.equal(report.originals.values.length, 18); assert.equal(report.originals.reason.length, 23); assert.equal(report.originals.epi.length,72); assert.equal(report.originals.learn.length,39); assert.equal(report.originals.belief.runs.length,48); assert.equal(report.originals.affect.runs.length,91); assert.equal(report.originals.affect.supplementaryRuns.length,14); assert.equal(report.originals.affect.models.length,18); assert.equal(report.originals.decision.runs.length,174); assert.equal(report.originals.commit.runs.length,10);
  assert.equal(report.originals.work.programs.length,78); assert.equal(report.originals.work.models.length,48); assert.equal(report.originals.work.seedEncoding,'Byte0 is the declared seed; bytes1..31 are zero');
  const work=JSON.parse(fs.readFileSync('src/workbench/workCatalog.json'));assert.deepEqual(report.originals.work.programs,work.programs);assert.deepEqual(report.originals.work.models,work.models);
  for(const name of ['skill','habit']){const c=JSON.parse(fs.readFileSync('src/workbench/'+name+'Catalog.json'));assert.deepEqual(report.originals[name].programs,c.programs);assert.deepEqual(report.originals[name].models,c.models);assert.equal(report.originals[name].runSeed,'00'.repeat(32));}
  for(const name of ['social','relationship']){const c=JSON.parse(fs.readFileSync('src/workbench/'+name+'Catalog.json')),legacy=name==='relationship'?JSON.parse(fs.readFileSync('src/workbench/relationshipLegacyCatalog.json')):{programs:[],models:[]};assert.deepEqual(report.originals[name].programs,[...c.programs,...legacy.programs]);assert.deepEqual(report.originals[name].models,[...c.models,...legacy.models]);assert.equal(report.originals[name].runSeed,'00'.repeat(32));}
  assert(report.originals.relationship.legacyStatus.includes('failed'));
  assert.deepEqual(report.snapshot.results.map(r => r.job), catalog.jobs);
  // Reject source drift during a long qualification run.
  for (const source of sources) assert.equal(sha(fs.readFileSync(source.path)), source.sha256);
  for (const source of sources) {const target=out+'/sources/'+source.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
  const receipt = {status: 'PASS SHARED BATCH EXECUTION', sources, programs: 915, prefixes: 5875, limitations: ['Thirteen available seams; previous841 roles plus26 SOCIAL and48 RELATIONSHIP corrected/legacy programs, not full corpus coverage. Legacy fidelity does not reverse failure.', 'Exact frozen save agreement does not establish psychological validity.', 'In-session pause/resume and fault paths are covered by focused tests; browser evidence is separate.'], report};
  fs.writeFileSync(`${out}/receipt.json`, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  console.log('PASS 915 programs / 5875 exact frozen prefixes / original inputs in export');
} finally {await server.close();}
