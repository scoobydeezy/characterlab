import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(p+f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read('ABSENCE_PLAN_REV2.json'),result=read('ABSENCE_RESULT_REV2.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(p+'ABSENCE_PLAN_REV2.json'));
assert.equal(plan.models.length,3);assert.equal(plan.runs.length,27);assert.equal(result.results.length,27);
assert.equal(new Set(plan.runs.map(x=>x.runIdentity)).size,27);assert.equal(result.prefixes,135);assert.equal(result.advancing,108);assert.equal(result.terminal,27);
assert(plan.experimentIdentity&&plan.comparisonCase&&plan.publicModel);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const gcd=(a,b)=>b?gcd(b,a%b):a,q=(n,d=1n)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
for(const [i,row] of result.results.entries()){
 const input=plan.runs[i];for(const k of ['law','name','modelIdentity','runIdentity'])assert.equal(row[k],input[k]);
 assert.equal(row.prefixHashes.length,5);assert.equal(row.snapshotHashes.length,5);assert.equal(row.views.length,5);
 let t=0n;for(let j=0;j<=4;j++){
  if(j)t+=BigInt(input.counts[j-1]);const value=input.wrong?0n:t;
  const reference=50n+(input.law==='FixedReference'?0n:value),level=BigInt(input.baseline+input.support),gap=reference>level?reference-level:0n;
  const residual=gap-(input.law==='ThresholdGap'?2n:0n),response=q(residual>0n?residual:0n,10n);
  assert.deepEqual(row.views[j],{displacement:String(value),reference:q(reference),level:q(level),gap:q(gap),response});
 }
}
for(const [file,count] of [['ABSENCE_TESTS_REV2.json',4],['ABSENCE_REFERENCE_TESTS_REV1.json',328]]){const r=read(file);assert.equal(r.success,true);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
const build=read('ABSENCE_BUILD_REV2.json');assert.equal(build.status,'PASS');assert.equal(build.exitCode,0);for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
for(const a of read('ABSENCE_DEVELOPMENT_FINDING_REV1.json').artifacts)assert.equal(sha(a.preserved),a.sha256);
for(const a of read('ABSENCE_BUILD_REV1.json').artifacts)assert.equal(sha(a.path),a.sha256);
const files=['ABSENCE_DEVELOPMENT_FINDING_REV1.json','ABSENCE_BUILD_REV1.json','ABSENCE_PLAN_REV1.json','ABSENCE_TESTS_REV1.json','ABSENCE_PLAN_REV2.json','ABSENCE_RESULT_REV2.json','ABSENCE_TESTS_REV2.json','ABSENCE_REFERENCE_TESTS_REV1.json','ABSENCE_BUILD_REV2.json','ABSENCE_FINDINGS.md','CAMPAIGN3_ABSENCE_DEFICIT_QUALIFICATION.md','CRAVING_READINESS.md'];
const closure={status:'PASS',scope:'absence-deficit-component/0.1-candidate; world-only challenge on unchanged public ADAPT prefixes',models:3,composedRuns:27,underlyingPublicConditions:4,prefixComparisons:135,advancing:108,terminal:27,tests:4,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-absence-closure.mjs',sha256:sha('scripts/check-absence-closure.mjs')}]};
const file=p+'ABSENCE_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(JSON.parse(fs.readFileSync(file)),closure);console.log('PASS absence:3 component models/27 runs/135 prefix comparisons;4+328 tests/build;1400/0.');
