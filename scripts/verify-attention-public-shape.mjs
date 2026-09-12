import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=read('docs/formal/ATTENTION_PUBLIC_SHAPE_MANIFEST.json');let links=0;
for(const f of manifest.files){assert.equal(sha(f.path),f.sha256,f.path);if(f.path.endsWith('.md'))for(const m of fs.readFileSync(f.path,'utf8').matchAll(/\]\(([^)]+)\)/g)){const target=m[1].split('#')[0];if(target&&!/^https?:/.test(target)){assert(fs.existsSync(path.resolve(path.dirname(f.path),target)),target);links++;}}}
const review=read('docs/planning/ATTENTION_DECLARATION_CLOSURE_REVIEW_REV1.json');for(const f of review.fingerprints)assert.equal(sha(f.path),f.sha256,f.path);
const d=read(manifest.allocationInput);for(const f of [d.script,d.inherited.source])assert.equal(sha(f.path),f.sha256,f.path);
const old=read('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json'),prior=[...old.evidence,...old.verifiedFingerprints,old.script];for(const f of prior)assert.equal(sha(f.path),f.sha256,f.path);
assert.equal(manifest.numericAllocation,'NOT PERFORMED');assert.equal(manifest.runtimeVectors,'AT2-A..N FROZEN NOT PASSED');
console.log({acceptedFiles:manifest.files.length,reviewFiles:review.fingerprints.length,preservedEMBFingerprints:prior.length,links,runtime:'NOT QUALIFIED'});
