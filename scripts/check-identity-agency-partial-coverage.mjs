// Historical integrity checks only; no simulation or source rewriting.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const p='docs/planning/',read=n=>JSON.parse(fs.readFileSync(p+n)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const script of ['check-agency-closure.mjs','check-inference-correction-closure.mjs'])execFileSync(process.execPath,['scripts/'+script],{stdio:'inherit'});
const identity=read('IDENTITY_PUBLIC_CLOSURE_REV1.json');assert.equal(identity.models,16);assert.equal(identity.runs,84);assert.equal(identity.nativePrefixes,428);
for(const f of [...identity.files,...identity.tests])assert.equal(sha(f.path),f.sha256,f.path);
const intake=read('PARTIAL_COVERAGE_INTAKE_REV6.json'),prior=read('PARTIAL_COVERAGE_INTAKE_REV5.json');
assert.equal(intake.predecessorSha256,sha(p+'PARTIAL_COVERAGE_INTAKE_REV5.json'));
assert.deepEqual(intake.clauses.map(c=>[c.id,c.text]),prior.clauses.map(c=>[c.id,c.text]));
assert.equal(intake.clauses.filter(c=>c.disposition==='NOT YET AUDITED').length,4);
const audited=['BRIEF-12.12-1','BRIEF-12.12-3','BRIEF-12.14-5'];
for(const id of audited)assert.equal(intake.clauses.find(c=>c.id===id).disposition,'PARTIAL');
const files=['CAMPAIGN3_IDENTITY_AGENCY_PARTIAL_COVERAGE_AUDIT.md','PARTIAL_COVERAGE_INTAKE_REV6.json','CAMPAIGN3_EXIT_AUDIT_REV89.json','IDENTITY_PUBLIC_CLOSURE_REV1.json','CAMPAIGN3_IDENTITY_PUBLIC_QUALIFICATION.md','CAMPAIGN3_IDENTITY_ELIGIBILITY_QUALIFICATION.md','AGENCY_CLOSURE_REV2.json','CAMPAIGN3_AGENCY_QUALIFICATION.md','INFERENCE_CORRECTION_CLOSURE_REV1.json','CAMPAIGN3_INFERENCE_CORRECTION_QUALIFICATION.md','CAMPAIGN3_IDENTITY_BELIEF_PUBLIC_QUALIFICATION.md','CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md','CAMPAIGN3_DISPOSITION_ADAPTATION_QUALIFICATION.md','CAMPAIGN3_DEVELOPMENT_PUBLIC_QUALIFICATION.md'];
const result={status:'PASS',scope:'Existing evidence integrity only; three gaps retained, no new behavioral qualification.',audited,promoted:[],counts:{bounded:117,partial:15,blocked:0},counters:[1508,0],files:[...files.map(n=>({path:p+n,sha256:sha(p+n)})),...['src/campaign3/agencyInterferenceSource.ts','scripts/check-identity-agency-partial-coverage.mjs'].map(path=>({path,sha256:sha(path)}))]};
const out=p+'IDENTITY_AGENCY_PARTIAL_COVERAGE_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);
console.log('PASS identity/agency audit: three clauses remain partial; four original clauses await audit.');
