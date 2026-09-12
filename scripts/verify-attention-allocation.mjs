import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const freeze=read('docs/formal/ATTENTION_ALLOCATION_FREEZE_AUDIT.json');
for(const f of [...freeze.artifacts,freeze.numericReview,freeze.shape,freeze.script,...freeze.priorAllocations])assert.equal(sha(f.path),f.sha256,f.path);
const review=read(freeze.numericReview.path);for(const f of review.reviewedArtifacts)assert.equal(sha(f.path),f.sha256,f.path);
const shape=read(freeze.shape.path);for(const f of shape.files)assert.equal(sha(f.path),f.sha256,f.path);
const old=read('docs/planning/CAMPAIGN3_EMBODIED_QUALIFICATION.json'),prior=[...old.evidence,...old.verifiedFingerprints,old.script];for(const f of prior)assert.equal(sha(f.path),f.sha256,f.path);
const table=read('docs/formal/ATTENTION_ALLOCATION_TABLE.json');assert.equal(table.status,'PERMANENT AND FROZEN');assert.deepEqual(table.records.map(r=>r.typeId),Array.from({length:26},(_,i)=>516+i));assert.deepEqual(table.newNamespaces.map(r=>r.namespace),[1143,1144]);
console.log({status:table.status,priorAllocationTables:freeze.priorAllocations.length,preservedEMBFingerprints:prior.length,parityChecks:review.parityChecks,roundTrips:review.canonicalDeclarationRoundTrips});
