import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-long-goal-reasons-ui-rev1',parent='docs/planning/workbench-long-goal-reasons-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(parent+'/receipt.json'),entry=receipt.artifacts.find(a=>a.path==='case-000.json'),bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
const reports=JSON.parse(bytes),original=read(entry.source),plan=read('docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json'),b=read(root+'/browser.json'),runHash=sha(Buffer.from(plan.runs[0].runIdentity,'hex'));
assert.deepEqual(b.observations.map(o=>o.selectedPrefix),[1,9]);assert.equal(b.observations[1].currentPrefix,16);
for(const o of b.observations){
 assert.deepEqual(o.report,{runHash,prefix:o.selectedPrefix,...reports[o.selectedPrefix-1].report});
 assert.deepEqual(o.hashes,[sha(Buffer.from(plan.runs[0].modelIdentity,'hex')),runHash,original.prefixHashes[o.currentPrefix],original.nativeHashes[o.currentPrefix]]);
}
assert.equal(b.observations[0].report.nuclei.length,0);assert.equal(b.observations[1].report.nuclei.length,3);
assert.deepEqual(b.afterInspection,b.observations[1].hashes);assert.deepEqual(b.alerts,[]);
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const paths=['src/workbench/LongGoalWorkbench.tsx','src/workbench/LongGoalReasonPanel.tsx','src/workbench/longGoalReasonDiagnostics.ts','scripts/check-workbench-long-goal-reasons-ui.mjs',parent+'/receipt.json',parent+'/'+entry.path];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),dest=root+'/sources/'+path;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path,sha256:sha(bytes)};});
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED LONG GOAL FACTOR BROWSER',sources,artifacts:['browser.json','factors.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Case0 recorded-factor reports at selected prefixes1/9 equal the complete original-qualified reports. Prefix9 is inspected after current16; keyboard expansion preserves four run hashes. Empty and three-nucleus states are shown. No raw-factor reconstruction, all-case browser, observer knowledge or complete entry claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS LONG goal recorded-factor browser');
