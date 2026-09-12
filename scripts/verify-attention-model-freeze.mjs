import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const frozen=read('docs/planning/campaign3-attention-model-rev1/FREEZE.json'),review=read(frozen.review.path);
for(const f of [frozen.review,frozen.sourceProposal,...frozen.sources,...frozen.sharedFiles,...frozen.models.flatMap(m=>m.files),...review.reviewedFiles])assert.equal(sha(f.path),f.sha256,f.path);
const old=read('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json');for(const f of [...old.evidence,...old.verifiedFingerprints,old.script])assert.equal(sha(f.path),f.sha256,f.path);
assert.equal(frozen.models.length,32);assert.equal(frozen.runs.length,224);assert.equal(new Set(frozen.models.map(m=>m.modelIdentity)).size,32);assert.equal(new Set(frozen.runs.map(r=>r.runIdentity)).size,224);
for(const p of ['docs/planning/CURRENT.md','docs/planning/CAMPAIGN3_ATTENTION_MODEL_CHECKPOINT.md'])for(const m of fs.readFileSync(p,'utf8').matchAll(/\]\(([^)]+)\)/g)){const target=m[1].split('#')[0];if(target&&!/^https?:/.test(target))assert(fs.existsSync(path.resolve(path.dirname(p),target)),target);}
console.log({models:32,runs:224,modelFiles:frozen.models.flatMap(m=>m.files).length,sharedFiles:frozen.sharedFiles.length,preservedEMBFingerprints:453,runtime:'NOT QUALIFIED'});
