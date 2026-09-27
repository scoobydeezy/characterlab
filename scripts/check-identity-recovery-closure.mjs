import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
execFileSync(process.execPath,['scripts/check-identity-recovery.mjs'],{stdio:'inherit'});
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const recovery=read(p+'IDENTITY_RECOVERY_RUN_0_REV1.json'),excluded=read(p+'IDENTITY_RECOVERY_RUN_3_REV1.json');
assert.deepEqual(recovery.sourceRows.slice(0,4).map(r=>r.chosen),excluded.sourceRows.slice(0,4).map(r=>r.chosen));
assert.deepEqual(excluded.sourceRows[4].probabilities,['1/2','1/2']);
const withheld=read(p+'IDENTITY_RECOVERY_RUN_4_REV1.json'),goal=read(p+'IDENTITY_RECOVERY_RUN_7_REV1.json');
for(const h of [0,2])assert.equal(withheld.observerSha256[h],recovery.observerSha256[h]);
assert.deepEqual(goal.rows.map(r=>r.states),recovery.rows.map(r=>r.states));

const tests=['IDENTITY_RECOVERY_TESTS_REV1.json','IDENTITY_RECOVERY_REFERENCE_TESTS_REV1.json'].map((n,i)=>{const path=p+n,x=read(path);assert(x.success&&x.numFailedTests===0);assert.equal(x.numPassedTests,i?328:8);return {path,sha256:sha(path),passed:x.numPassedTests};});
const build=read(p+'IDENTITY_RECOVERY_BUILD_REV1.json');assert.equal(build.status,'PASS');assert.equal(build.exitCode,0);
const files=['IDENTITY_RECOVERY_PLAN_REV1.json','IDENTITY_RECOVERY_RESULT_REV1.json','IDENTITY_RECOVERY_FINDINGS.md','CAMPAIGN3_IDENTITY_RECOVERY_QUALIFICATION.md','DISPOSITIONAL_ADAPTATION_READINESS.md','IDENTITY_RECOVERY_BUILD_REV1.json','IDENTITY_RECOVERY_BUILD_REV1.log','IDENTITY_RECOVERY_EXPLORATION_REV1.json'].map(n=>p+n).concat(['scripts/check-identity-recovery-closure.mjs','scripts/explore-identity-recovery.mjs']);
const result={status:'PASS',verdict:'VER-C3-IDENTITY-RECOVERY-001',version:'identity-recovery-experiment/0.1-candidate',scope:'Bounded native task biography, standing and separately represented identity recovery. No production changes or longer timeline; no general adaptation.',models:5,runs:13,newInputRuns:11,repeatedPriorRuns:2,nativePrefixes:78,tests,files:files.map(path=>({path,sha256:sha(path)})),counters:{highestAllocatedRecordType:1450,allocatedSinceVerdict:0}},out=p+'IDENTITY_RECOVERY_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);
console.log('PASS recovery closure:13 runs/78 prefixes;8 affected/328 reference tests and build;1450/0.');
