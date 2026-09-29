import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const [name,count] of [['DEFINING_NATIVE_REHEARSAL_TESTS_REV1.json',54],['DEFINING_NATIVE_REHEARSAL_REFERENCE_TESTS_REV1.json',328]]){
 const r=read(p+name);assert(r.success);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);assert.equal(r.numPendingTests,0);
}
const build=read(p+'DEFINING_NATIVE_REHEARSAL_BUILD_REV1.json');assert.equal(build.exitCode,0);assert.equal(sha(build.log.path),build.log.sha256);
const preservation=p+'defining-rehearsal-development-rev1/PRESERVATION.json';
for(const f of read(preservation).files){assert.equal(sha(f.path),f.sha256);const name=f.path.split('/').at(-1);if(name.endsWith('.ts')&&!name.endsWith('.test.ts'))assert.equal(sha('src/campaign3/'+name),f.sha256,'Production changed after the preserved test-only correction');}
const files=['definingRehearsalCodecs','definingRehearsalRecall','definingRehearsalAttribution','definingRehearsalOwner','definingFinalPresentation','definingRehearsalTrace','definingRehearsalInheritedTrace','definingRehearsalRuntime','definingRehearsalModel'].map(n=>'src/campaign3/'+n+'.ts').concat(['src/test/definingRehearsalOwners.test.ts','src/test/definingNativeRehearsal.test.ts','docs/formal/DEFINING_REHEARSAL_ALLOCATION_TABLE.json','docs/formal/DEFINING_NATIVE_REHEARSAL_CONTRACT.md',p+'DEFINING_NATIVE_REHEARSAL_CHECKPOINT.md',p+'DEFINING_NATIVE_REHEARSAL_TESTS_REV1.json',p+'DEFINING_NATIVE_REHEARSAL_REFERENCE_TESTS_REV1.json',p+'DEFINING_NATIVE_REHEARSAL_BUILD_REV1.json',preservation,'scripts/check-defining-native-rehearsal.mjs']);
const result={status:'NATIVE REHEARSAL IMPLEMENTATION CHECKS PASS',qualification:'NONE; all68 complete native cases and public gate OPEN',nativeProfiles:3,primaryInstants:26,completePrimaryPrefixesRepeated:27,ownerContinuations:68,actualRehearsalBatches:3,publicationsPerRehearsal:16,newTests:10,affectedTests:54,referenceTests:328,counters:{highestAllocated:1492,sinceVerdict:8},files:files.map(path=>({path,sha256:sha(path)}))};
const out=p+'DEFINING_NATIVE_REHEARSAL_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);
console.log('PASS native rehearsal/final recall; full gate OPEN;1492/8');
