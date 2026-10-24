import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = 'docs/planning/workbench-batch-coverage-rev1';
const ledgerPath = 'docs/planning/OBSERVABILITY_WORKBENCH_COVERAGE.json';
const paths = ['src/workbench/batchCatalogV8.json',
  'docs/planning/workbench-batch-parity-rev8/receipt.json',
  'docs/planning/workbench-batch-browser-rev8/receipt.json',
  'docs/planning/workbench-batch-browser-rev8/browser.json'];
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = path => crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const [catalog, native, receipt, browser] = paths.map(read);
assert.equal(native.status, 'PASS SHARED V8 BATCH EXECUTION');
assert.equal(receipt.status, 'PASS FULL V8 BROWSER BATCH');
assert.equal(native.report.snapshot.status, 'complete');
assert.equal(catalog.jobs.length, 947);
assert.equal(browser.rows.length, 947);
assert.equal(native.report.snapshot.results.length, 947);
const mapping = {values:'VER-C3-VALUES-INTEGRATION-001', reason:'PHEN-REASON-001',
  epi:'PHEN-EPI-001', learn:'PHEN-LEARN-001', belief:'PHEN-BELIEF-001',
  affect:'PHEN-AFFECT-001', decision:'PHEN-DECISION-001', commit:'PHEN-COMMIT-001',
  work:'PHEN-WORK-001', skill:'PHEN-SKILL-001', habit:'PHEN-HABIT-001',
  social:'PHEN-SOCIAL-001', relationship:'PHEN-REL-001', long:'PHEN-LONG-001'};
const groups = {};
const ids = new Set();
let cursor = 0;
for (const [i, job] of catalog.jobs.entries()) {
  assert(!ids.has(job.id)); ids.add(job.id);
  const result = native.report.snapshot.results[i];
  assert.deepEqual(result.job, job);
  assert.equal(result.status, 'complete');
  assert.equal(result.prefixes.length, job.expectedSaveHashes.length);
  assert.deepEqual(browser.rows[i], {checks:`${result.prefixes.length}/${result.prefixes.length}`, id:job.id, status:'complete'});
  const group = groups[job.experimentId] ??= {ledgerId:mapping[job.experimentId], roles:0, prefixes:0, jobIds:[]};
  assert(group.ledgerId);
  group.roles++; group.prefixes += result.prefixes.length; group.jobIds.push(job.id);
  for (const [prefix, record] of result.prefixes.entries()) {
    assert.equal(record.prefix, prefix);
    assert.equal(record.saveHash, job.expectedSaveHashes[prefix]);
    assert.equal(record.expectedSaveHash, record.saveHash);
    assert.equal(record.matchesFrozenSave, true);
    assert.equal(browser.hashes[cursor++], record.saveHash);
    assert.equal(browser.hashes[cursor++], record.saveHash);
  }
}
assert.equal(cursor, 12776); assert.equal(browser.hashes.length, cursor);
const binding = receipt.artifacts.find(a => a.path === 'browser.json');
assert.equal(binding.sha256, hash(paths[3]));
const ledger = read(ledgerPath);
const scope = 'Registered V8 execution and displayed save-hash parity only. Does not close language, comparisons, successor coverage, specialized views or integrated Campaign4 entry.';
for (const [experimentId, group] of Object.entries(groups)) {
  const entry = [...ledger.members, ...ledger.successors].find(e => e.id === group.ledgerId);
  assert(entry);
  entry.batchQualification = {version:catalog.version, experimentId, status:'PASS NATIVE AND BROWSER',
    roles:group.roles, prefixes:group.prefixes, receipt:`${root}/receipt.json`, scope};
}
const updates = {
  'PHEN-DECISION-001':['BROADER COMPARISON/LANGUAGE/BATCH OPEN','BROADER COMPARISON/LANGUAGE OPEN; REGISTERED V8 BATCH PASS'],
  'PHEN-COMMIT-001':['BROADER CONTROLS/LANGUAGE/BATCH OPEN','BROADER CONTROLS/LANGUAGE OPEN; REGISTERED V8 BATCH PASS'],
  'PHEN-BELIEF-001':['BATCH/FULL NARRATIVE OPEN','REGISTERED V8 BATCH PASS; FULL NARRATIVE OPEN'],
  'PHEN-WORK-001':['FULL UI/BATCH QUALIFICATION DUE','REGISTERED V8 BATCH PASS; FULL INSPECTION UI QUALIFICATION DUE'],
  'PHEN-SKILL-001':['UI PREPARED, REGISTRATION/BROWSER DUE','REGISTERED V8 BATCH PASS; BROADER INSPECTION BROWSER DUE'],
  'PHEN-SOCIAL-001':['BROADER BROWSER/BATCH DUE','REGISTERED V8 BATCH PASS; BROADER INSPECTION BROWSER DUE'],
  'PHEN-REL-001':['BROADER BROWSER/BATCH DUE','REGISTERED V8 BATCH PASS; BROADER INSPECTION BROWSER DUE'],
  'PHEN-LONG-001':['SOURCE ADAPTER IMPLEMENTED; FOCUSED PARITY PASS; FULL COHORT AUDIT RUNNING','ORIGINAL32 SOURCE PROGRAMS/513 PREFIXES NATIVE AND V8 BROWSER BATCH PASS; SUCCESSORS AND FULL INSPECTION REMAIN SEPARATE']};
for (const [id, [before, after]] of Object.entries(updates)) {
  const entry = ledger.members.find(e => e.id === id);
  assert(entry.workbenchStatus.includes(before));
  entry.workbenchStatus = entry.workbenchStatus.replace(before, after);
}
fs.mkdirSync(root, {recursive:true});
fs.writeFileSync(`${root}/coverage-before.json`, fs.readFileSync(ledgerPath), {flag:'wx'});
const output = {status:'PASS EXACT V8 COVERAGE RECONCILIATION', sources:paths.map(path=>({path,sha256:hash(path)})),
  roles:947, prefixes:6388, displayedHashes:cursor, groups,
  unenrolledMembers:ledger.members.filter(e=>!e.batchQualification).map(e=>e.id), scope};
fs.writeFileSync(`${root}/receipt.json`, JSON.stringify(output,null,2)+'\n', {flag:'wx'});
fs.writeFileSync(ledgerPath, JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({status:output.status, groups:Object.keys(groups).length, unenrolledMembers:output.unenrolledMembers}));
