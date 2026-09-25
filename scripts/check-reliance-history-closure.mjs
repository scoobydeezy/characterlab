import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const p='docs/planning/',read=path=>JSON.parse(fs.readFileSync(path)),sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const planPath=p+'RELIANCE_HISTORY_PUBLIC_PLAN_REV2.json',resultPath=p+'RELIANCE_HISTORY_PUBLIC_RESULT_REV2.json';
const plan=read(planPath),result=read(resultPath),tests=read(p+'RELIANCE_HISTORY_TESTS_REV2.json'),reference=read(p+'RELIANCE_HISTORY_REFERENCE_TESTS_REV1.json');
assert.equal(result.status,'PASS');assert.equal(result.planSha256,sha(planPath));
assert.equal(result.models,6);assert.equal(result.runs,22);assert.equal(result.restores,176);assert.equal(result.advancing,154);assert.equal(result.terminal,22);
assert.equal(plan.runs.length,22);assert.equal(new Set(plan.runs.map(r=>r.modelIdentity)).size,6);
assert.equal(new Set(plan.runs.map(r=>r.runIdentity)).size,22);
assert(plan.experimentIdentity.length>0&&plan.comparisonCase.length>0);
assert.equal(result.restores,result.results.reduce((n,r)=>n+r.prefixes,0));
assert.equal(result.terminal,result.runs);assert.equal(result.advancing,result.restores-result.runs);
for(const [i,row] of result.results.entries()) {
  assert.equal(row.runIdentity,plan.runs[i].runIdentity);assert.equal(row.modelIdentity,plan.runs[i].modelIdentity);assert.equal(row.orderedInputs,plan.runs[i].orderedInputs);
}
for(const a of plan.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
assert.equal(tests.success,true);assert.equal(reference.success,true);
assert.equal(tests.numPassedTests,7);assert.equal(tests.numFailedTests,0);
assert.equal(reference.numPassedTests,328);assert.equal(reference.numFailedTests,0);
const build=read(p+'RELIANCE_HISTORY_BUILD_REV1.json');assert.equal(build.status,'PASS');for(const a of build.artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const freeze=read(p+'campaign3-rel-dimensions-model-rev1/FREEZE.json');
assert.equal(freeze.models.length,6);for(const m of freeze.models)for(const a of m.files)assert.equal(sha(a.path),a.sha256,a.path);
assert.deepEqual(new Set(plan.runs.map(r=>r.modelIdentity)),new Set(freeze.models.map(m=>m.modelIdentity)));
const allocation=read('docs/formal/REL_DIMENSIONS_PUBLIC_ALLOCATION_TABLE.json');
assert.equal(allocation.namespace,1177);assert.deepEqual(allocation.records.map(r=>r.typeId),Array.from({length:14},(_,i)=>1207+i));
assert.equal(freeze.contractSha256,sha('docs/formal/REL_DIMENSIONS_PUBLIC_CONTRACT.md'));assert.equal(freeze.allocationSha256,sha('docs/formal/REL_DIMENSIONS_PUBLIC_ALLOCATION_TABLE.json'));
const workers=Array.from({length:4},(_,i)=>p+'reliance-history-public-workers-rev2/'+i+'.json');
const workerRows=workers.flatMap(path=>{const w=read(path);assert.equal(w.planSha256,sha(planPath));return w.results;});assert.equal(workerRows.length,22);for(const row of result.results)assert.deepEqual(workerRows.find(r=>r.runIdentity===row.runIdentity),row);
let workerPrefixes=0,workerAdvancing=0;const viewKeys=new Set();
for(const file of workers){const w=read(file);workerPrefixes+=w.restores;workerAdvancing+=w.advancing;
 for(const [key,v] of w.views){assert(!viewKeys.has(key));viewKeys.add(key);const row=w.results.find(r=>r.law+'/'+r.goal+'/'+r.name===key);assert(row);
  const hashHex=h=>createHash('sha256').update(Buffer.from(h,'hex')).digest('hex');assert.equal(hashHex(v.outputs),row.outputSha256);assert.deepEqual(v.observerViews.map(hashHex),row.observerSha256);
 }}
assert.equal(viewKeys.size,22);assert.equal(workerPrefixes,result.restores);assert.equal(workerAdvancing,result.advancing);
const preservationPath=p+'RELIANCE_HISTORY_PRESERVATION_REV1.json';for(const a of read(preservationPath).artifacts)assert.equal(sha(a.path),a.sha256,a.path);
const preserved=read(preservationPath),oldPlan=read(p+'RELIANCE_HISTORY_PUBLIC_PLAN_REV1.json');
for(const a of oldPlan.artifacts){const saved=preserved.artifacts.find(x=>x.originalPath===a.path);assert.equal(sha(saved?saved.path:a.path),a.sha256,a.path);}
const files=[p+'REL_DIMENSIONS_CLOSURE_REV1.json','docs/formal/RELIANCE_HISTORY_EXPERIMENT.md',preservationPath,p+'RELIANCE_HISTORY_IMPLEMENTATION_FINDINGS.md',...workers,planPath,resultPath,p+'RELIANCE_HISTORY_TESTS_REV2.json',p+'RELIANCE_HISTORY_REFERENCE_TESTS_REV1.json',p+'RELIANCE_HISTORY_BUILD_REV1.json',p+'CAMPAIGN3_RELIANCE_HISTORY_QUALIFICATION.md','scripts/check-reliance-history-closure.mjs','docs/formal/REL_DIMENSIONS_PUBLIC_CONTRACT.md'];
const closure={status:'PASS',experiment:'reliance-history-experiment/0.1-candidate',contract:'rel-dimensions-public/0.1-candidate',newModels:0,models:6,runs:22,prefixes:176,advancing:154,terminal:22,tests:7,referenceTests:328,artifacts:files.map(path=>({path,sha256:sha(path)}))};
const path=p+'RELIANCE_HISTORY_CLOSURE_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(path,JSON.stringify(closure,null,2)+'\n',{flag:'wx'});
assert.deepEqual(read(path),closure,'Reliance history closure evidence drift');
console.log('PASS reliance history:6 reused models/22 runs/176 prefixes;7+328 tests; counters1234/0.');
