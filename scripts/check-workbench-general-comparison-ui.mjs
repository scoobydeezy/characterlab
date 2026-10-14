import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const root='docs/planning/workbench-general-comparison-ui-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root+'/receipt.json'));
const foundation='docs/planning/workbench-general-comparison-rev1';
const paths=['src/workbench/GeneralComparisonPanel.tsx','src/workbench/GeneralWorkbench.tsx','src/workbench/generalComparison.ts','src/workbench/generalComparisonCatalog.json','src/workbench/generalWorker.ts','src/workbench/generalWorkerClient.ts','src/workbench/generalAdapter.ts','scripts/check-workbench-general-comparison-ui.mjs',foundation+'/receipt.json',foundation+'/prefix-0.json',foundation+'/prefix-1.json'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const ui=JSON.parse(fs.readFileSync(root+'/ui.json'));
assert.deepEqual(ui.before,ui.after);assert.equal(ui.before.length,4);
assert.deepEqual(ui.draft,{status:'Create a pair to inspect its actual records',stepEnabled:false,reports:0});
assert.equal(ui.repeat,ui.initial);
assert.deepEqual(JSON.parse(ui.initial),JSON.parse(fs.readFileSync(foundation+'/prefix-0.json')));
assert.deepEqual(JSON.parse(ui.prefix),JSON.parse(fs.readFileSync(foundation+'/prefix-1.json')));
assert.equal(ui.repeatedPrefix,ui.prefix);
assert.equal(ui.status,'Comparison 1 / 1 · instants 1 / 1 · ALIGNED_COMMITTED_INSTANT');
for(const path of ['src/workbench/generalWorker.ts','src/workbench/generalWorkerClient.ts','src/workbench/generalAdapter.ts'])assert.equal(sha(fs.readFileSync(path)),sha(fs.readFileSync('docs/planning/workbench-general-cohort-rev1/sources/'+path)));
for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const inputs=['ui.json','comparison.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED GENERAL COMPARISON UI',sources,inputs,scope:'Browser-created frozen baseline/Independent1/1 pair prefixes0/1 exactly equal qualified detached reports. Recreating the pair repeats both reports. Selection clears stale records and prevents stepping an uncreated declaration. Main graph four hashes remain unchanged. Screenshot inspected. Only one pair/two prefixes; no all36 browser coverage, full-horizon comparison, comparison replay/export, language, resource limits or Campaign4 entry completion.'},null,2)+'\n',{flag:'wx'});
console.log('PASS comparison UI prefix parity/recreation/draft isolation/main-run independence');
