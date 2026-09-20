/** Freeze independently reviewed exact images. Does not qualify runtime/corpus. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/general-attention-model-review-rev3',output='docs/planning/campaign3-general-attention-model-rev2',reviewPath='docs/planning/GA_MODEL_IMAGE_REVIEW_REV2_2026_09_19.json';
assert(!fs.existsSync(output),'frozen output already exists');
const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')});
const review=JSON.parse(fs.readFileSync(reviewPath)),proposal=JSON.parse(fs.readFileSync(input+'/REVIEW.json'));
assert.equal(review.status,'EXACT GA MODEL IMAGE REVIEW PASS; NOT YET FROZEN');assert.equal(review.models,43);assert.equal(review.negativeControls,129);assert.deepEqual(fp(review.proposal.path),review.proposal);
for(const file of [...review.reviewedSources,review.script])assert.deepEqual(fp(file.path),file);
fs.mkdirSync(output);
const copy=file=>{assert.deepEqual(fp(file.path),file);const target=file.path.replace(input,output);assert(target.startsWith(output+'/'));fs.copyFileSync(file.path,target);const copied=fp(target);assert.equal(copied.sha256,file.sha256);return copied;};
const shared=Object.fromEntries(Object.entries(proposal.shared).map(([k,v])=>[k,copy(v)]));
const models=proposal.models.map(m=>({...m,files:Object.fromEntries(Object.entries(m.files).map(([k,v])=>[k,copy(v)]))}));
fs.writeFileSync(output+'/FREEZE.json',JSON.stringify({status:'ACCEPTED AND FROZEN EXACT GA MODEL COHORT; RUNTIME QUALIFICATION PENDING',versions:proposal.versions,seed:proposal.seed,models,shared,budget:proposal.budget,review:fp(reviewPath),proposal:fp(input+'/REVIEW.json'),preservation:review.preservation,sources:review.reviewedSources,script:fp('scripts/freeze-general-attention-models.mjs'),scope:['43 distinct exact model images; zero new record allocations.','Canonical source calendars, required S0, owner scopes, component versions and full budgets are committed.','Role-calibrated, disabled and spatial allocation remain distinct candidates.','Only these images may enter the first public GA factory.','Public execution, corpus verdict and whole GA closure remain separate gates.'],counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}},null,2)+'\n');
console.log(JSON.stringify({models:models.length,status:'FROZEN EXACT MODELS; NO RUNTIME QUALIFICATION CLAIM'}));
