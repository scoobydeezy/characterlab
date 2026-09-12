import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p));
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const report=read('docs/planning/ATTENTION_PUBLIC_INVENTORY_REVIEW_REV1.json');
for(const f of report.fingerprints)assert.equal(sha(f.path),f.sha256,f.path);
const old=read('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json');
const preserved=[...old.evidence,...old.verifiedFingerprints,old.script];
for(const f of preserved)assert.equal(sha(f.path),f.sha256,f.path);
const source=read('docs/planning/ATTENTION_SOURCE_CHECKPOINT_REVIEW_REV1.json');
for(const f of [...source.evidence,source.source])assert.equal(sha(f.path),f.sha256,f.path);
const docs=['docs/planning/CAMPAIGN3_ATTENTION_PUBLIC_INTEGRATION_REV1.md','docs/planning/CURRENT.md'];
let links=0;
for(const p of docs)for(const m of fs.readFileSync(p,'utf8').matchAll(/\]\(([^)]+)\)/g)){
 const target=m[1].split('#')[0];if(!target||/^https?:/.test(target))continue;
 assert(fs.existsSync(path.resolve(path.dirname(p),target)),`${p}: ${target}`);links++;
}
assert.equal(report.checks.length,10);
assert.equal(report.recordCount,24);
assert.equal(report.fieldCount,69);
assert.equal(report.stageCount,10);
console.log({reviewFingerprints:report.fingerprints.length,preservedEMBFingerprints:preserved.length,priorSourceCheckpointFingerprints:source.evidence.length+1,links,wholeShape:'OPEN: canonical declaration closure'});
