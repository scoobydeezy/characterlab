import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
await import('./check-reason-closure.mjs');
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),ref=path=>({path,sha256:sha(path)});
const plan=read(p+'REASON_PUBLIC_EXPERIMENT_PLAN_REV3.json'),result=read(p+'REASON_PUBLIC_EXPERIMENT_REV3.json');
assert.equal(result.results.reduce((n,r)=>n+r.prefixes,0),350);
for(let i=0;i<115;i++)for(const k of ['name','law','modelIdentity','runIdentity','orderedInputs'])assert.equal(result.results[i][k],plan.runs[i][k]);
const get=(name,law)=>result.results.find(r=>r.name===name&&r.law===law);
for(const law of [1,2,3,4,5]){
 for(const k of ['outputsSha256','stateSha256'])assert.equal(get('collective',law)[k],get('hidden',law)[k]);
 for(const name of ['denied','untrained'])assert.equal(get(name,law).nuclei.length,0);
 if(law<=3)assert.equal(get('avoidStanding',law).nuclei[0].base,'-1/3');
 if(law===4)assert.equal(get('avoidStanding',law).nuclei.length,0);
 if(law===5){assert.equal(get('avoidStanding',law).nuclei.length,1);assert.equal(get('avoidStanding',law).nuclei[0].base,'68027/146054');}
}
const failures=[];
for(const [name,passed,failed] of [['REASON_PUBLIC_TESTS_REV1.json',8,11],['REASON_PUBLIC_TESTS_REV2.json',16,3],['REASON_PRESERVATION_TESTS_REV1.json',66,1],['REASON_REPLAY_RETRY_REV1.json',1,0]]){
 const v=read(p+name);assert.equal(v.numPassedTests,passed);assert.equal(v.numFailedTests,failed);
 const f=v.testResults.flatMap(t=>t.assertionResults).filter(a=>a.status==='failed');assert.equal(f.length,failed);
 failures.push({source:ref(p+name),passed,failed,failures:f.map(a=>({name:a.fullName,firstLine:a.failureMessages[0].split('\n')[0]}))});
}
assert.equal(failures[0].failures.filter(f=>f.firstLine==='SchedulerContractError: event phase is not registered').length,9);
assert.equal(failures[0].failures.filter(f=>f.name.startsWith('rollback at')).length,2);
assert.equal(failures[2].failures[0].firstLine,'Error: Test timed out in 5000ms.');
const composite=read(p+'REASON_PRESERVATION_TESTS_REV2.json');assert.equal(composite.numPassedTests,failures[2].passed+failures[3].passed);assert(composite.scope.includes('Not a single67/67 run'));
const c1=fs.readFileSync('docs/formal/REASON_PUBLIC_CONTRACT_REV1.md','utf8'),c2=fs.readFileSync('docs/formal/REASON_PUBLIC_CONTRACT_REV2.md','utf8'),c3=fs.readFileSync('docs/formal/REASON_PUBLIC_CONTRACT.md','utf8');
assert.equal(c1.replace('reason-public/0.1-candidate','reason-public/0.2-candidate').replaceAll('source20','source10').replaceAll('freeze24','freeze14'),c2);
assert(c3.startsWith(c2.replace('reason-public/0.2-candidate','reason-public/0.3-candidate')));
assert(c3.includes('no threshold or evidence law changed'));
const receipt={status:'PASS; HQ011 OPEN',scope:'Original closure and all3 model-image cohorts verified;115ordered stored result joins,350prefix count,5hidden-output/state pairs,failed tests and exact contract corrections checked. No fresh simulation,rollback,prefix replay or test execution. Historical raw-source equality and full-save bytes remain scoped to their original evidence.',runs:115,prefixes:350,hiddenPairs:5,failures,composite:ref(p+'REASON_PRESERVATION_TESTS_REV2.json'),sources:['scripts/check-reason-closure.mjs','scripts/qualify-reason-public.mjs',p+'REASON_PUBLIC_EXPERIMENT_PLAN_REV3.json',p+'REASON_PUBLIC_EXPERIMENT_REV3.json',p+'REASON_VALIDATION_CLOSURE_REV1.json','docs/formal/REASON_PUBLIC_CONTRACT_REV1.md','docs/formal/REASON_PUBLIC_CONTRACT_REV2.md','docs/formal/REASON_PUBLIC_CONTRACT.md'].map(ref),checker:ref('scripts/check-history-reason-authority.mjs')};
const O=p+'campaign3-history-reason-authority-rev1/';fs.mkdirSync(O,{recursive:true});if(fs.existsSync(O+'canonical-check.json'))assert.deepEqual(read(O+'canonical-check.json'),receipt);else fs.writeFileSync(O+'canonical-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log('PASS: REASON failed cohorts,composite test accounting and stored comparisons.');
