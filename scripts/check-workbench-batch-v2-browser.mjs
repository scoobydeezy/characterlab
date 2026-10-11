import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-parity-rev2',sha=b=>createHash('sha256').update(b).digest('hex');
const native=JSON.parse(fs.readFileSync(`${root}/receipt.json`)),paused=JSON.parse(fs.readFileSync(`${root}/browser-paused.json`)),browser=JSON.parse(fs.readFileSync(`${root}/browser-resumed.json`));
assert.equal(paused.snapshot.status,'paused');assert.equal(browser.snapshot.status,'complete');assert.equal(browser.snapshot.results.length,39);
assert.equal(browser.snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),580);
assert.deepEqual(browser.snapshot.results,native.report.snapshot.results.filter(r=>r.job.experimentId==='learn'));
assert.deepEqual(browser.originals.learn,native.report.originals.learn);assert.deepEqual(browser.originals.epi,[]);
const epi=JSON.parse(fs.readFileSync(`${root}/browser-epi-complete.json`));assert.equal(epi.snapshot.status,'complete');assert.equal(epi.snapshot.results.length,72);assert.equal(epi.snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),240);
assert.deepEqual(epi.snapshot.results,native.report.snapshot.results.filter(r=>r.job.experimentId==='epi'));assert.deepEqual(epi.originals.epi,native.report.originals.epi);
for(const p of paused.snapshot.results){const final=browser.snapshot.results.find(r=>r.job.id===p.job.id);assert.deepEqual(p.job,final.job);assert.deepEqual(p.prefixes,final.prefixes.slice(0,p.prefixes.length));}
for(const source of native.sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
fs.writeFileSync(`${root}/browser-check.json`,JSON.stringify({status:'PASS COMPLETE LEARN AND EPI BROWSER BATCHES WITH LEARN PAUSE/RESUME',programs:111,prefixes:820,pausedPrefixes:paused.snapshot.results.reduce((n,r)=>n+r.prefixes.length,0),artifacts:['browser-paused.json','browser-resumed.json','browser-epi-complete.json','receipt.json'].map(path=>({path,sha256:sha(fs.readFileSync(`${root}/${path}`))})),verifier:{path:'scripts/check-workbench-batch-v2-browser.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-batch-v2-browser.mjs'))},scope:'All39 LEARN and72 EPI jobs in browser workers agree with the complete shared batch native receipt. No all351-program browser claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS111 browser jobs/820 prefixes; paused prefixes retained unchanged');
