import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-long-language-ui-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root+'/receipt.json'));
const ui=JSON.parse(fs.readFileSync(root+'/ui.json'));
const qualified=JSON.parse(fs.readFileSync('docs/planning/workbench-long-language-rev1/program-00.json'));
assert.equal(ui.before.length,7);assert.deepEqual(ui.before,ui.prefixes[0].hashes);
for(let i=0;i<2;i++){
 assert.equal(ui.prefixes[i].hashes.length,7);
 assert.deepEqual(ui.prefixes[i].report,qualified.rows[i].description);
 assert.equal(ui.prefixes[i].hashes[3],qualified.rows[i].saveHash);
 assert.equal(ui.prefixes[i].hashes[6],qualified.rows[i].description.observerHash);
}
assert.notEqual(ui.prefixes[0].report.observerHash,ui.prefixes[1].report.observerHash);
const paths=['src/workbench/LongObserverDescription.tsx','src/workbench/LongWorkbench.tsx','src/workbench/longExplanations.ts','scripts/check-workbench-long-language-ui.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const inputs=['ui.json','language.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));
const qualification={path:'docs/planning/workbench-long-language-rev1/program-00.json',sha256:sha(fs.readFileSync('docs/planning/workbench-long-language-rev1/program-00.json'))};
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED LONG LANGUAGE BROWSER',sources,inputs,qualification,scope:'Original representation-1-law-1 prefixes0/1 match qualified observer descriptions exactly. Opening Character preserves seven hashes; stepping updates description digest to current native observer. Screenshot inspected. Other programs/prefixes, rapid async races, full choice explanations and broader browser qualification remain open.'},null,2)+'\n',{flag:'wx'});
console.log('PASS bounded LONG observer language browser');
