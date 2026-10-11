/** Compile exact retained cohorts, never a Cartesian expansion of qualified scope. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha = b => createHash('sha256').update(b).digest('hex'), sources = [];
function read(path) {const bytes = fs.readFileSync(path); sources.push({path, sha256: sha(bytes)}); return JSON.parse(bytes);}
const vp = read('docs/planning/values-integration-matrix-rev1/plan.json');
const vr = read('docs/planning/workbench-values-parity-rev1/receipt.json');
const rp = read('docs/planning/REASON_PUBLIC_EXPERIMENT_PLAN_REV3.json');
const rr = read('docs/planning/workbench-reason-parity-rev2/receipt.json');
const vf = read('src/workbench/valuesFixtures.json'), rf = read('src/workbench/reasonFixtures.json');
const jobs = vp.runs.map(row => {
  const fixture = vf.cases.find(f => f.name === row.name), receipt = vr.results.find(r => r.index === row.index);
  assert(fixture && receipt); assert.deepEqual(fixture.frames, row.frames);
  assert.equal(receipt.law, row.law); assert.equal(receipt.seed, row.seed); assert.equal(receipt.appraisal, row.appraisal);
  return {id: `values/${row.index}`, experimentId: 'values', name: row.name, seed: row.seed, law: row.law, appraisal: row.appraisal, expectedSaveHashes: receipt.prefixes.map(p => p.saveHash)};
});
for (const row of rp.runs) {
  const fixture = rf.cases.find(f => f.name === row.name), receipt = rr.results.find(r => r.name === row.name && r.law === row.law);
  assert(fixture && receipt); assert.equal(fixture.orderedInputs, row.orderedInputs);
  jobs.push({id: `reason/${row.law}/${row.name}`, experimentId: 'reason', name: row.name, seed: 7, law: row.law, expectedSaveHashes: receipt.prefixes.map(p => p.saveHash)});
}
assert.equal(jobs.length, 240); assert.equal(new Set(jobs.map(j => j.id)).size, jobs.length);
const value = {version: 'workbench-batch-catalog/0.1', sources, retention: 'Summary includes each exact original profile/program reference and every prefix hash. Raw traces remain reproducible through the named adapter and are not retained in a batch summary.', jobs};
const output = JSON.stringify(value, null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(fs.readFileSync('src/workbench/batchCatalog.json', 'utf8'), output);
else fs.writeFileSync('src/workbench/batchCatalog.json', output, {flag: 'wx'});
console.log(`PASS ${jobs.length} exact cohort programs`);
