import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(p+f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const plan=read('CRAVING_PLAN_REV1.json'),result=read('CRAVING_RESULT_REV1.json'),sources=read('CRAVING_SOURCES_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(p+'CRAVING_PLAN_REV1.json'));assert.equal(plan.models.length,4);assert.equal(plan.runs.length,56);assert.equal(plan.comparisons.length,60);assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,56);assert.equal(result.results.length,60);assert.equal(result.componentPrefixes,300);assert.equal(result.distinctPrefixes,280);assert.equal(result.advancing,240);assert.equal(result.terminal,60);assert.equal(result.publicRuns,5);assert.equal(result.publicPrefixes,15);assert.equal(sources.publicRuns,5);assert.equal(sources.publicPrefixes,15);assert(plan.experimentIdentity&&plan.comparisonCase);
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const gcd=(a,b)=>b?gcd(b,a%b):a,q=(n,d=1n)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
for(const [i,row] of result.results.entries()){
 const input=plan.comparisons[i];for(const k of ['law','name','modelIdentity','runIdentity'])assert.equal(row[k],input[k]);assert(plan.runs.some(r=>r.runIdentity===row.runIdentity));assert.equal(row.prefixHashes.length,5);assert.equal(row.snapshot.rows.length,4);assert.equal(row.snapshot.observer,plan.observer);
 const history=[];
 for(const [j,f] of input.frames.entries()){
  let belief=null,urge=null;
  if(history.length){const n=BigInt(input.law==='LatestProduct'?history.at(-1):history.reduce((a,b)=>a+b,0)),d=BigInt(input.law==='LatestProduct'?1:history.length);belief=q(n,d);if((f.cue||f.deliberateRecall)&&f.body!==null){const [bn,bd]=f.body.split('/').map(BigInt);urge=input.law==='MeanBottleneck'?(bn*d<n*bd?f.body:belief):q(bn*n,bd*d);}}
  assert.deepEqual(row.snapshot.rows[j],{at:j+1,body:f.body,belief,accessible:f.cue||f.deliberateRecall,urge,available:f.available,restrained:f.restrained,eligible:urge!==null&&urge!=='0/1'&&f.available&&!f.restrained});
  if(input.law!=='NoLearning'&&f.reportVisible&&f.report!==null)history.push(f.report);
 }
 assert.deepEqual(row.snapshot.history,history);
}
for(const [file,count] of [['CRAVING_TESTS_REV1.json',7],['CRAVING_REFERENCE_TESTS_REV1.json',328]]){const r=read(file);assert(r.success);assert.equal(r.numPassedTests,count);assert.equal(r.numFailedTests,0);}
const build=read('CRAVING_BUILD_REV1.json');assert.equal(build.status,'PASS');assert.equal(build.exitCode,0);for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256);
for(const a of read('CRAVING_DEVELOPMENT_FINDING_REV1.json').artifacts)assert.equal(sha(a.preserved),a.sha256);
const files=['CRAVING_PLAN_REV1.json','CRAVING_RESULT_REV1.json','CRAVING_SOURCES_REV1.json','CRAVING_TESTS_REV1.json','CRAVING_REFERENCE_TESTS_REV1.json','CRAVING_BUILD_REV1.json','CRAVING_DEVELOPMENT_FINDING_REV1.json','CRAVING_FINDINGS.md','CAMPAIGN3_CRAVING_QUALIFICATION.md','RELAPSE_READINESS.md'];
const closure={status:'PASS',scope:'craving-component/0.1-candidate; represented urge and prospective eligibility only',models:4,distinctRuns:56,comparisonRows:60,componentPrefixChecks:300,distinctComponentPrefixes:280,publicSourceRuns:5,publicSourcePrefixes:15,tests:7,referenceTests:328,counters:[1400,0],artifacts:[...files.map(f=>({path:p+f,sha256:sha(p+f)})),{path:'scripts/check-craving-closure.mjs',sha256:sha('scripts/check-craving-closure.mjs')}]};
const file=p+'CRAVING_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(file,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});assert.deepEqual(JSON.parse(fs.readFileSync(file)),closure);console.log('PASS craving:4 models/56 distinct runs/60 comparisons/300 prefix checks;5 public sources/15 prefixes;7+328 tests/build;1400/0.');
