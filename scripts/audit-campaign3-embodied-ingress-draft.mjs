// Document/preservation audit only. Does not execute proposed EMB semantics.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const output='docs/planning/CAMPAIGN3_EMBODIED_INGRESS_DRAFT_AUDIT_REV1.json';
assert(!fs.existsSync(output),'preserve receipt; use a new revision');
const docs=['CAMPAIGN3_EMBODIED_INGRESS_SCHEDULING_DRAFT.md','CAMPAIGN3_EMBODIED_OBSERVATION_ADMISSION_DRAFT.md','CURRENT.md'].map(p=>'docs/planning/'+p);
let links=0;
for(const p of docs)for(const m of fs.readFileSync(p,'utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
 if(/^(https?:|#)/.test(m[1]))continue;
 assert(fs.existsSync(path.resolve(path.dirname(p),m[1].split('#')[0])),m[1]);links++;
}
const draft=fs.readFileSync(docs[0],'utf8');
const vectors=[...draft.matchAll(/^\| (EING-[A-N]) \|/gm)].map(m=>m[1]);
assert.equal(vectors.length,14);assert.equal(new Set(vectors).size,14);
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));
for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
const suite=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_FINAL_SUITE_RECEIPT_REV1.json'));
for(const f of suite.sourceFingerprints)assert.equal(hash(f.path),f.sha256,f.path);
const componentPath='docs/planning/CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json';
const component=JSON.parse(fs.readFileSync(componentPath));
for(const f of component.sourceFingerprints)assert.equal(hash(f.path),f.sha256,f.path);
const report={status:'DOCUMENT AND PRESERVATION CHECKS PASS; EING-A..N NOT PASSED',links,proposedVectors:vectors.length,frozenChecks:frozen.checks.length,
 limitation:'No proposed producer/absence/budget/restore control executed. Existing SEM component receipt preserved; full runtime suites not rerun.',
 documents:docs.map(path=>({path,sha256:hash(path)})),componentReceipt:{path:componentPath,sha256:hash(componentPath)},
 script:{path:'scripts/audit-campaign3-embodied-ingress-draft.mjs',sha256:hash('scripts/audit-campaign3-embodied-ingress-draft.mjs')}};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,links,proposedVectors:vectors.length,frozenChecks:report.frozenChecks}));
