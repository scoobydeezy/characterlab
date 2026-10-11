import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
await import('./check-learn-closure.mjs'); // Read-only default: exact original receipt equality.
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const ref=path=>({path,sha256:sha(path)});
const plan=read(p+'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json'),result=read(p+'LEARN_PUBLIC_EXPERIMENT_REV1.json');
assert.equal(result.results.length,39);
assert.equal(result.results.reduce((n,r)=>n+r.prefixes,0),580);
for(let i=0;i<39;i++)for(const k of ['name','law','numeric','runIdentity'])assert.equal(result.results[i][k],plan.runs[i][k]);
const row=(law,numeric,name)=>result.results.find(r=>r.law===law&&r.numeric===numeric&&r.name===name);
for(const law of [1,2,3])for(const numeric of [1,2]){
 const a=row(law,numeric,'repeated'),b=row(law,numeric,'hidden');
 for(const k of ['stateSha256','outputsSha256'])assert.equal(a[k],b[k]);
 assert.deepEqual(a.trajectory,b.trajectory);
 assert.equal(row(law,numeric,'missing').trajectory.length,1);
}
assert.deepEqual(row(1,1,'positiveZero').trajectory.at(-1),{mean:'2/5',precision:'50/1',applied:false});
assert.deepEqual(row(1,1,'repeatedEstablished').trajectory.at(-1),{mean:'37/620',precision:'62/1',applied:true});
const failed=read(p+'LEARN_PUBLIC_TESTS_REV1.json');
assert.equal(failed.numPassedTests,18);assert.equal(failed.numFailedTests,1);
const failures=failed.testResults.flatMap(t=>t.assertionResults).filter(a=>a.status==='failed');
assert.equal(failures.length,1);assert.equal(failures[0].fullName,'lattice competitor records raw posterior separately from rounded commit');
// Independent integer nearest-millionth witness; remainder is below half, not a tie.
const scaled=27n*1000000n,q=scaled/520n,r=scaled%520n;
assert.equal(q,51923n);assert(r*2n<520n);assert.equal(q-51922n,1n);
const receipt={status:'PASS; HQ011 OPEN',scope:'Original closure rechecked without writes; stored39run plan joins,580 prefix counts,6 hidden-state/output hash equalities and supplementary evidence checked. No fresh runtime,prefix replay,rollback or test execution. Stored hashes do not replace the original execution-time byte assertions.',runs:39,prefixes:580,hiddenPairs:6,failedHistoricalTests:1,repeatedEstablished:{mean:'37/620',precision:'62/1'},rounding:{raw:'27/520',millionths:51923,incorrectHistoricalAssertion:51922},sources:['scripts/check-learn-closure.mjs','scripts/qualify-learn-public.mjs',p+'LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json',p+'LEARN_PUBLIC_EXPERIMENT_REV1.json',p+'LEARN_VALIDATION_CLOSURE_REV1.json',p+'LEARN_PUBLIC_TESTS_REV1.json'].map(ref),checker:ref('scripts/check-history-learn-authority.mjs')};
const O=p+'campaign3-history-learn-authority-rev1/';fs.mkdirSync(O,{recursive:true});
if(fs.existsSync(O+'canonical-check.json'))assert.deepEqual(read(O+'canonical-check.json'),receipt);
else fs.writeFileSync(O+'canonical-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS: LEARN stored evidence and failed lattice assertion preserved.');
