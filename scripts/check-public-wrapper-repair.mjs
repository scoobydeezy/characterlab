import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
const p='docs/planning/',root=p+'public-wrapper-quiescence-rev1/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
execFileSync(process.execPath,['scripts/check-public-wrapper-inventory.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-public-wrapper-routing.mjs'],{stdio:'inherit'});
execFileSync(process.execPath,['scripts/check-preserved-public-wrapper-evidence.mjs'],{stdio:'inherit'});
const repairedSources=new Set(['identityTask','identityBiology','biologyPublic','embodied'].map(n=>'src/campaign3/'+n+'Runtime.ts'));
for(const a of read(root+'PRESERVATION.json').artifacts)if(!repairedSources.has(a.original))assert.equal(sha(a.original),a.sha256,'Unchanged dependency drift: '+a.original);
const plans=['REPAIR_PLAN.json','EMBODIED_REPAIR_PLAN.json'].map(n=>({path:root+n,value:read(root+n)}));
for(const plan of plans)for(const a of [...(plan.value.parents??[]),...plan.value.artifacts])assert.equal(sha(a.path),a.sha256,a.path);
const priorIdentity=read(p+'IDENTITY_PUBLIC_PLAN_REV1.json'),priorBiology=read(p+'BIOLOGY_PUBLIC_PLAN_REV3.json');
const oldBiology=[0,1,2,3].flatMap(i=>read(p+`BIOLOGY_PUBLIC_RESULT_PART${i}_REV3.json`).results),runs=[];
assert.equal(new Set(oldBiology.map(r=>r.index)).size,58);
for(let part=0;part<4;part++){const receipt=read(root+'REPAIR_PART_'+part+'.json');assert.equal(receipt.status,'PASS');assert.equal(receipt.part,part);assert.equal(receipt.planSha256,sha(plans[0].path));}
let prefixes=0;
for(let i=0;i<142;i++){
 const r=read(root+'REPAIR_RUN_'+i+'.json');assert.equal(r.status,'PASS');assert.equal(r.index,i);assert.equal(r.planSha256,sha(plans[0].path));
 const identity=i<84,index=identity?i:i-84,planned=identity?priorIdentity.runs[index]:priorBiology.runs[index],old=identity?read(p+'IDENTITY_PUBLIC_RUN_'+index+'_REV1.json'):oldBiology.find(r=>r.index===index);
 assert.equal(r.kind,identity?'identity':'biology');assert.equal(r.priorIndex,index);assert.equal(r.runIdentity,planned.runIdentity);assert.equal(r.modelIdentity,identity?priorIdentity.models[planned.model].modelIdentity:planned.modelIdentity);assert.deepEqual(r.prefixes.map(x=>x.at),planned.prefixes);
 for(const q of r.prefixes){if(identity)assert.deepEqual(q,old.prefixes.find(x=>x.at===q.at));else{assert.equal(q.sha256,old.prefixHashes[q.at]);assert.equal(q.nextSha256,old.prefixHashes[Math.min(q.at+1,planned.frames.length)]);}prefixes++;}
 assert.equal(r.observerHash,identity?old.observerSha256:old.observerHash);assert.equal(r.stateHash,identity?old.stateSha256:old.stateHash);if(!identity)assert.equal(r.traceHash,old.traceHash);
 runs.push(r);
}
assert.equal(prefixes,698);assert.equal(new Set(runs.map(r=>r.modelIdentity)).size,44);assert.equal(new Set(runs.map(r=>r.runIdentity)).size,142);
const embodied=read(root+'EMBODIED_REPAIR_RESULT.json');assert.equal(embodied.status,'PASS');assert.equal(embodied.planSha256,sha(plans[1].path));assert.equal(embodied.rows.length,7);assert.equal(embodied.rows.reduce((n,r)=>n+r.prefixes.length,0),49);
const embodiedFreeze=read(p+'campaign3-embodied-model-rev2/FREEZE.json');assert.equal(new Set(embodied.rows.map(r=>embodiedFreeze.models.find(m=>m.name===(r.name==='hidden89'?'baseline':r.name)).modelDigest)).size,6);
for(const r of embodied.rows){assert.deepEqual(r.prefixes.map(x=>x.at),[0,1,2,3,4,5,6]);for(const q of r.prefixes)assert.equal(q.nextSha256,r.prefixes[Math.min(q.at+1,6)].sha256);}
const tests=read(root+'TESTS_REV3.json'),reference=read(root+'REFERENCE_TESTS_REV1.json');for(const [r,count]of [[tests,72],[reference,328]]){assert(r.success);assert.equal(r.numFailedTests,0);assert.equal(r.numPassedTests,count);}
const rollback=read(root+'ROLLBACK_TESTS_REV1.json');assert(rollback.success);assert.equal(rollback.numPassedTests,2);assert.equal(rollback.numFailedTests,0);
const failed=read(root+'TESTS_REV1.json');assert.equal(failed.numPassedTests,4);assert.equal(failed.numFailedTests,2);const corrected=read(root+'TESTS_REV2.json');assert(corrected.success);assert.equal(corrected.numPassedTests,6);
assert.equal(read(root+'BUILD_REV3.json').status,'PASS');assert.equal(read(root+'BUILD_REV3.json').exitCode,0);
const files=[...Array.from({length:142},(_,i)=>root+'REPAIR_RUN_'+i+'.json'),...Array.from({length:4},(_,i)=>root+'REPAIR_PART_'+i+'.json'),...['REPAIR_PLAN.json','EMBODIED_REPAIR_PLAN.json','EMBODIED_REPAIR_RESULT.json','PRESERVATION.json','INVENTORY.json','INVENTORY_DISPOSITIONS.json','TESTS_REV1.json','TESTS_REV2.json','TESTS_REV3.json','REFERENCE_TESTS_REV1.json','BUILD_REV2.json','BUILD_REV2.log','publicWrapperQuiescence-test-development-rev1.ts'].map(n=>root+n),...fs.readdirSync(root).filter(n=>/-(probe|concurrent)-rev\d+\.json$/.test(n)).map(n=>root+n),'docs/formal/PUBLIC_WRAPPER_QUIESCENCE_CONTRACT.md',p+'PUBLIC_WRAPPER_QUIESCENCE_FINDINGS.md',p+'CAMPAIGN3_PUBLIC_WRAPPER_QUIESCENCE_QUALIFICATION.md','scripts/audit-public-wrapper-quiescence.mjs','scripts/audit-public-wrapper-legacy.mjs','scripts/check-public-wrapper-inventory.mjs','scripts/check-preserved-public-wrapper-evidence.mjs','scripts/public-wrapper-preserved-source-loader.mjs','scripts/check-public-wrapper-repair.mjs'];
files.push(root+'FACTORY_ROUTING.json','scripts/check-public-wrapper-routing.mjs',root+'ROLLBACK_TESTS_REV1.json','src/test/biologicalWrapperRollback.test.ts',root+'BUILD_REV3.json',root+'BUILD_REV3.log');
const result={status:'PASS',verdict:'VER-C3-PUBLIC-QUIESCENCE-001',contract:'public-wrapper-quiescence/0.1-candidate',scope:'49 native save producers; three torn-ledger publications and one overlapping embodied cleanup repaired. Same149 prior cases/747 selected whole-prefix continuations. No changed character law, state, schema, model/run identity, ordinary save/view/trace byte, or psychological clause promotion.',producers:49,repaired:4,independentlyGuarded:30,inapplicable:15,runs:149,models:50,prefixes:747,tests:74,referenceTests:328,counters:{highestAllocatedRecordType:1450,allocatedSinceVerdict:0},files:files.map(path=>({path,sha256:sha(path)}))};
const out=p+'PUBLIC_WRAPPER_QUIESCENCE_CLOSURE_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(out),result);
console.log('PASS public wrapper closure:49 producers,4 repairs,149 cases/747 prefixes,74 affected/328 reference tests/build;1450/0.');
