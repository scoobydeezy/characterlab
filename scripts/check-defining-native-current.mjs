import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
for(const [name,count] of [['DEFINING_NATIVE_CURRENT_TESTS_REV1.json',50],['DEFINING_NATIVE_CURRENT_REFERENCE_TESTS_REV1.json',328]]){
 const r=read(p+name);assert(r.success);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);assert.equal(r.numPendingTests,0);
}
const build=read(p+'DEFINING_NATIVE_CURRENT_BUILD_REV1.json');assert.equal(build.exitCode,0);assert.equal(sha(build.log.path),build.log.sha256);
const preservation=p+'defining-current-development-rev1/PRESERVATION.json';
for(const f of read(preservation).files){
 assert.equal(sha(f.path),f.sha256);
 const name=f.path.split('/').at(-1);
 if(name.startsWith('definingCurrent')&&name.endsWith('.ts')&&!name.endsWith('.test.ts'))assert.equal(sha('src/campaign3/'+name),f.sha256,'Production changed after the preserved test-only correction');
}
const development=read(p+'DEFINING_NATIVE_CURRENT_TESTS_DEV1.json');assert.equal(development.numPassedTests,8);assert.equal(development.numFailedTests,1);assert.equal(development.numPendingTests,0);
const files=['src/campaign3/definingCurrentAssessment.ts','src/campaign3/definingCurrentCodecs.ts','src/campaign3/definingCurrentModel.ts','src/campaign3/definingCurrentRuntime.ts','src/campaign3/definingCurrentTrace.ts','src/test/definingCurrentAssessment.test.ts','src/test/definingNativeCurrent.test.ts','docs/formal/DEFINING_CURRENT_ASSESSMENT_ALLOCATION_TABLE.json','docs/formal/DEFINING_NATIVE_CURRENT_ASSESSMENT_CONTRACT.md',p+'DEFINING_NATIVE_CURRENT_CHECKPOINT.md',p+'DEFINING_NATIVE_CURRENT_TESTS_REV1.json',p+'DEFINING_NATIVE_CURRENT_REFERENCE_TESTS_REV1.json',p+'DEFINING_NATIVE_CURRENT_BUILD_REV1.json',preservation,'scripts/check-defining-native-current.mjs'];
const result={status:'NATIVE CURRENT ASSESSMENT IMPLEMENTATION CHECKS PASS',qualification:'NONE; rehearsal/final recall and public gate OPEN',nativeProfiles:2,primaryInstants:23,completePrimaryPrefixesRepeated:24,currentOwnerComparisons:68,newTests:9,affectedTests:50,referenceTests:328,counters:{highestAllocated:1490,sinceVerdict:6},files:files.map(path=>({path,sha256:sha(path)}))};
const out=p+'DEFINING_NATIVE_CURRENT_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);
console.log('PASS native current assessment; full gate OPEN;1490/6');
