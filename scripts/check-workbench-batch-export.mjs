/** Independently check the actual browser worker export against the complete native receipt. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const root = 'docs/planning/workbench-batch-parity-rev1';
const referenceBytes = fs.readFileSync(`${root}/receipt.json`), reference = JSON.parse(referenceBytes);
const browserPath = `${root}/browser/worker-summary-export.json`, browserBytes = fs.readFileSync(browserPath), report = JSON.parse(browserBytes);
assert.equal(report.snapshot.status, 'complete');
assert.equal(report.snapshot.results.length, 240);
assert.deepEqual(report, reference.report);
const sourcePaths = ['src/workbench/batchSession.ts', 'src/workbench/experimentRegistry.ts', 'src/workbench/batchWorkerProtocol.ts', 'src/workbench/batchWorker.ts', 'src/workbench/batchWorkerClient.ts', 'src/workbench/BatchWorkbench.tsx', 'src/workbench/WorkbenchApp.tsx', 'vite.config.ts', 'scripts/check-workbench-batch-export.mjs'];
const sources = sourcePaths.map(path => ({path, sha256: sha(fs.readFileSync(path))}));
for (const path of ['src/workbench/batchSession.ts', 'src/workbench/experimentRegistry.ts', 'src/workbench/valuesAdapter.ts', 'src/workbench/reasonAdapter.ts']) assert.equal(sha(fs.readFileSync(path)), reference.sources.find(s => s.path === path).sha256);
const receipt = {status: 'PASS COMPLETE BROWSER WORKER EXPORT', sources, referenceSha256: sha(referenceBytes), browserPath, browserSha256: sha(browserBytes), programs: 240, prefixes: 975, comparison: 'Deep equality of the entire browser-produced report with the independently executed native batch report, including inputs, profiles, exact prefix identities and limits.', limitations: ['Available Values/REASON cohorts only; other corpus adapters remain open.', 'Browser control responsiveness and responsive layout are recorded separately.']};
fs.writeFileSync(`${root}/browser/worker-export-check.json`, JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
console.log('PASS 240 browser worker programs / 975 prefixes / complete exported report equality');
