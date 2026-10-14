import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const root='docs/planning/workbench-bio-ui-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root+'/receipt.json'));
const nativePath='docs/planning/workbench-bio-parity-rev1/case-00.json',native=JSON.parse(fs.readFileSync(nativePath)),ui=JSON.parse(fs.readFileSync(root+'/ui.json'));
assert.equal(native.name,'Earned/6');const keys=['modelHash','runHash','stateHash','saveHash'];
for(const [label,prefix]of [['initial',0],['one',1],['two',2],['restored',1]])assert.deepEqual(ui[label],keys.map(k=>native.prefixes[prefix][k]));
assert.equal(ui.record,native.finalRecords[0].exact);assert.deepEqual(ui.modes.map(m=>m.mode),['Character','Timeline','Compare','Architecture','Reasoning']);
for(const m of ui.modes)assert.deepEqual(m.hashes,ui.one);
assert(ui.modes.find(m=>m.mode==='Character').text.includes('Character view awaiting qualification'));
assert(ui.modes.find(m=>m.mode==='Compare').text.includes('comparison awaiting qualification'));
assert(ui.modes.find(m=>m.mode==='Architecture').text.includes('not an observed participation'));
const paths=['src/workbench/BioWorkbench.tsx','src/workbench/WorkbenchApp.tsx','src/workbench/inspectionRegistry.ts','src/workbench/bioAdapter.ts','src/workbench/bioWorker.ts','src/workbench/bioWorkerClient.ts','src/test/workbenchInspectionRegistry.test.ts','scripts/check-workbench-bio-ui.mjs',nativePath];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
assert.equal(sha(fs.readFileSync('src/workbench/bioAdapter.ts')),sha(fs.readFileSync('docs/planning/workbench-bio-parity-rev1/sources/src/workbench/bioAdapter.ts')));
const inputs=['ui.json','bio.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED BIO BROWSER INSPECTION',sources,inputs,scope:'Earned/6 prefixes0/1/2 and checkpoint return to1 match completed per-case parity evidence. First exact record matches native component evidence. Five mode switches preserve all four hashes and retain explicit unqualified language/comparison/participation limits. Screenshot inspected; registry test excludes BIO from batch. Enclosing13-case audit remains in progress. No all-case browser, full-program pause/switch, checkpoint download/import, language, joined comparison or Campaign4 entry completion.'},null,2)+'\n',{flag:'wx'});console.log('PASS BIO browser prefix/record/restore/mode evidence');
