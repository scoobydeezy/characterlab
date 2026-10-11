import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const directory = 'docs/planning/workbench-values-parity-rev1/browser';
const file = `${directory}/comparison-export.json`, bytes = fs.readFileSync(file);
let report;
try {report = JSON.parse(bytes);} catch {throw Error(`Browser export is not complete JSON (${bytes.length} bytes); do not print save contents`);}
const server = await createServer({configFile: false, server: {middlewareMode: true, hmr: false}, appType: 'custom'});
try {
  const {ValuesWorkbenchRun, compareValues} = await server.ssrLoadModule('/src/workbench/valuesAdapter.ts');
  const a = await ValuesWorkbenchRun.restore(report.A.checkpoint), b = await ValuesWorkbenchRun.restore(report.B.checkpoint);
  assert.deepEqual(a.snapshot(), report.A.snapshot); assert.deepEqual(b.snapshot(), report.B.snapshot);
  assert.deepEqual(compareValues(a, b), report.comparison);
  assert.equal(await a.advance(), false); assert.equal(await b.advance(), false);
  const receipt = {status: 'PASS BROWSER EXPORT RESTORE', file, sha256: createHash('sha256').update(bytes).digest('hex'), branchPrefixes: [report.A.checkpoint.prefix, report.B.checkpoint.prefix], firstSemanticInstant: report.comparison.firstSemanticInstant, scope: 'Exact browser-generated report restored through unchanged public API; complete snapshots and comparison reproduced. Host download delivery is separate.'};
  fs.writeFileSync(`${directory}/export-check.json`, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  console.log(receipt.status);
} finally {await server.close();}
