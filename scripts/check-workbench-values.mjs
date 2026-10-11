/** Instrument parity only. Never rewrites or extends the Campaign 3 verdict. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const sha = b => createHash('sha256').update(b).digest('hex');
const planPath = 'docs/planning/values-integration-matrix-rev1/plan.json';
const planBytes = fs.readFileSync(planPath), plan = JSON.parse(planBytes);
const fixtureCatalog = JSON.parse(fs.readFileSync('src/workbench/valuesFixtures.json', 'utf8').replace(/^\uFEFF/, ''));
assert.equal(fixtureCatalog.sourceSha256, sha(planBytes));
assert.deepEqual(fixtureCatalog.cases, plan.runs.filter(r => r.law === 'Accumulated' && r.appraisal === 'ValueRelative' && r.seed === 0).map(({name, frames}) => ({name, frames})));
const out = 'docs/planning/workbench-values-parity-rev1';
fs.mkdirSync(out, {recursive: true});
const sources = ['src/workbench/valuesAdapter.ts', 'src/workbench/contracts.ts', 'src/workbench/canonical.ts', 'src/workbench/valuesFixtures.json', 'scripts/check-workbench-values.mjs'].map(path => ({path, sha256: sha(fs.readFileSync(path))}));
const server = await createServer({configFile: false, server: {middlewareMode: true, hmr: false}, appType: 'custom'});
try {
  const {ValuesWorkbenchRun, auditReasons} = await server.ssrLoadModule('/src/workbench/valuesAdapter.ts');
  const results = [];
  for (const row of plan.runs) {
    const referencePath = `docs/planning/values-integration-matrix-rev1/run-${row.index}.json`;
    const referenceBytes = fs.readFileSync(referencePath), reference = JSON.parse(referenceBytes);
    const adapter = await ValuesWorkbenchRun.create({profile: {law: row.law, appraisal: row.appraisal, seed: row.seed}, frames: row.frames});
    const prefixes = [];
    for (let prefix = 0; prefix <= row.frames.length; prefix++) {
      const snapshot = adapter.snapshot();
      assert.equal(snapshot.saveHash, reference.prefixes[prefix].saveSha256, `save ${row.index}/${prefix}`);
      assert.equal(snapshot.runHash, sha(Buffer.from(row.runIdentity, 'hex')));
      assert.deepEqual(snapshot.rows, reference.rows.slice(0, prefix));
      assert.equal(snapshot.timeline.length, prefix * 13);
      prefixes.push({prefix, saveHash: snapshot.saveHash, stateHash: snapshot.stateHash});
      assert.equal(await adapter.advance(), prefix < row.frames.length);
    }
    const snapshot = adapter.snapshot();
    assert.deepEqual(snapshot.randomAddresses, reference.randomAddresses);
    const audit = auditReasons(snapshot.reasons); assert.deepEqual(audit.issues, []);
    results.push({index: row.index, law: row.law, appraisal: row.appraisal, name: row.name, seed: row.seed, referencePath, referenceSha256: sha(referenceBytes), prefixes, factors: audit.factors, reasons: snapshot.reasons.map(({id, human, semanticKey, renderer}) => ({id, human, semanticKey, renderer}))});
    if (results.length % 10 === 0) console.log(`PASS ${results.length}/${plan.runs.length} native programs`);
  }
  const report = {status: 'PASS WORKBENCH VALUES INSTRUMENT PARITY', planPath, planSha256: sha(planBytes), sources, runs: results.length, prefixes: results.reduce((n, x) => n + x.prefixes.length, 0), factors: results.reduce((n, x) => n + x.factors, 0), limitations: ['Parity with retained native receipts, not new psychological qualification.', 'Structural reason audit only; language adequacy and corpus-wide coverage remain open.', 'Checkpoint full-tail authentication is covered separately by workbenchValues.test.ts; this matrix checks all original prefix save digests.'], results};
  fs.writeFileSync(`${out}/receipt.json`, JSON.stringify(report, null, 2) + '\n', {flag: 'wx'});
  console.log(`PASS ${report.runs} runs / ${report.prefixes} exact native prefixes / ${report.factors} explained factors`);
} finally {await server.close();}
