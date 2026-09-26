import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(p+f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read('TOLERANCE_PLAN_REV1.json'),result=read('TOLERANCE_RESULT_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(p+'TOLERANCE_PLAN_REV1.json'));
assert.equal(plan.models.length,3);assert.equal(plan.runs.length,18);assert.equal(result.results.length,18);
assert.equal(new Set(plan.runs.map(x=>x.runIdentity)).size,18);assert.equal(result.prefixes,90);assert.equal(result.advancing,72);assert.equal(result.terminal,18);
assert(plan.experimentIdentity&&plan.comparisonCase&&plan.publicModel);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const gcd=(a,b)=>b?gcd(b,a%b):a,q=(n,d=1n)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
for(const [i,row] of result.results.entries()){
 const input=plan.runs[i];for(const k of ['law','name','modelIdentity','runIdentity'])assert.equal(row[k],input[k]);
 assert.equal(row.prefixHashes.length,5);assert.equal(row.snapshotHashes.length,5);assert.equal(row.views.length,5);
 let t=0n;for(let j=0;j<=4;j++){
  if(j)t+=BigInt(input.counts[j-1]);const value=input.wrong?0n:t;
  const potential=input.law==='Reciprocal'?q(1n,1n+value):input.law==='Linear'?q(10n-value,10n):'1/1';
  assert.deepEqual(row.views[j],{tolerance:String(value),before:`${input.before}/1`,potential,applied:input.before===10?'0/1':potential,overflow:input.before===10?potential:'0/1',after:input.before===10?'10/1':potential});
 }
}
for(const [file,count] of [['TOLERANCE_TESTS_REV1.json',4],['TOLERANCE_REFERENCE_TESTS_REV1.json',328]]){const r=read(file);assert.equal(r.success,true);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
const build=read('TOLERANCE_BUILD_REV1.json');assert.equal(build.status,'PASS');assert.equal(build.exitCode,0);for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const files=['TOLERANCE_PLAN_REV1.json','TOLERANCE_RESULT_REV1.json','TOLERANCE_TESTS_REV1.json','TOLERANCE_REFERENCE_TESTS_REV1.json','TOLERANCE_BUILD_REV1.json','TOLERANCE_FINDINGS.md','CAMPAIGN3_TOLERANCE_QUALIFICATION.md','ABSENCE_DEFICIT_READINESS.md'];
const closure={status:'PASS',scope:'tolerance-effect-component/0.1-candidate; world-only challenge on unchanged public ADAPT prefixes',models:3,composedRuns:18,underlyingPublicConditions:4,prefixComparisons:90,advancing:72,terminal:18,tests:4,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-tolerance-closure.mjs',sha256:sha('scripts/check-tolerance-closure.mjs')}]};
const file=p+'TOLERANCE_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(JSON.parse(fs.readFileSync(file)),closure);console.log('PASS tolerance:3 component models/18 runs/90 prefix comparisons;4+328 tests/build;1400/0.');
