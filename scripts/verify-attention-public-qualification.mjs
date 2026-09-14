import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),verify=f=>assert.equal(createHash('sha256').update(fs.readFileSync(f.path)).digest('hex'),f.sha256,f.path);
const q=read('docs/planning/ATTENTION_PUBLIC_QUALIFICATION_REV1.json');assert.equal(q.status,'BOUNDED PUBLIC ATTN QUALIFIED');[...q.sources,...q.evidence,q.script].forEach(verify);assert.equal(Object.keys(q.vectors).length,14);
const old=read('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json'),preserved=[...old.evidence,...old.verifiedFingerprints,old.script];preserved.forEach(verify);
for(const rev of [1,2]){const cohort=read('docs/planning/campaign3-attention-model-rev'+rev+'/FREEZE.json');[...cohort.sharedFiles,...cohort.models.flatMap(m=>m.files)].forEach(verify);}
read('docs/formal/ATTENTION_PUBLIC_SHAPE_MANIFEST.json').files.forEach(verify);
const docs=['docs/planning/CAMPAIGN3_ATTENTION_PUBLIC_QUALIFICATION.md','docs/planning/ATTENTION_INITIAL_STATE_CORRECTION.md','docs/planning/CURRENT.md','docs/planning/CAMPAIGN3_POST_EMB_COVERAGE.md','docs/planning/CAMPAIGN3_ENTRY_READINESS.md','docs/planning/CAMPAIGN3_CORPUS_INTAKE_DRAFT.md'];let links=0;
for(const file of docs)for(const m of fs.readFileSync(file,'utf8').matchAll(/\]\(([^)]+)\)/g)){const target=m[1].split('#')[0];if(target&&!/^https?:/.test(target)){assert(fs.existsSync(path.resolve(path.dirname(file),decodeURIComponent(target))),file+': '+target);links++;}}
const sources=read('docs/planning/ATTENTION_RUNTIME_MUTANTS_REV1.json').sources;sources.forEach(verify);
console.log({status:q.status,activeCoverage:q.activeTests,historicalTests:328,vectors:14,models:q.models,specimens:q.specimenRuns,restores:q.wholePrefixRestores,preserved:preserved.length,links});
