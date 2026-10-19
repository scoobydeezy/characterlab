import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-long-boundary-ui-rev1',native='docs/planning/workbench-long-parity-rev2',language='docs/planning/workbench-long-language-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const b=read(root+'/browser.json'),n=read(native+'/receipt.json'),l=read(language+'/receipt.json'),keys=['modelHash','runHash','stateHash','saveHash','outputsHash','traceHash','observerHash'];
assert.deepEqual(b.snapshots.map(s=>s.label),['empty-captured','empty-restored','maximum-initial','maximum-complete','maximum-restored','maximum-repeated','maximum-terminal-restored']);
const boundInputs=[];
function checked(parent,entry){const bytes=fs.readFileSync(parent+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);boundInputs.push({path:parent+'/'+entry.path,sha256:entry.sha256});return JSON.parse(bytes);}
const expected=Object.fromEntries(['empty','maximum-time'].map(p=>[p,checked(native,n.results.find(r=>r.program===p))]));
for(const s of b.snapshots){
 const p=expected[s.program].prefixes[s.prefix];assert(p);assert.deepEqual(s.hashes,keys.map(k=>p[k]));
 const terminal=s.program==='empty'||s.prefix===1;
 assert.equal(s.status,`LONG prefix ${s.prefix} · clock ${p.clock} · ${terminal?'Complete':'Ready'}`);
 assert.equal(s.stepEnabled,!terminal);assert.equal(s.runEnabled,!terminal);
}
assert.equal(b.emptyEvents,0);assert.equal(b.maximumEvents,17);
assert.deepEqual(b.language.map(r=>[r.program,r.prefix]),[['empty',0],['maximum-time',1]]);
for(const observed of b.language){const qualified=checked(language,l.results.find(r=>r.program===observed.program));assert.deepEqual(observed.report,qualified.rows[observed.prefix].description);assert.deepEqual(observed.hashes,keys.map(k=>expected[observed.program].prefixes[observed.prefix][k]));}
assert.deepEqual(b.alerts,[]);
const sources=[...n.sources];for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
for(const path of ['src/workbench/LongWorkbench.tsx','src/workbench/longWorker.ts','src/workbench/longWorkerClient.ts','src/workbench/LongObserverDescription.tsx','src/workbench/longExplanations.ts','scripts/check-workbench-long-boundary-ui.mjs']){
 const bytes=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});sources.push({path,sha256:sha(bytes)});
}
const artifacts=[root+'/browser.json',root+'/terminal.png',native+'/receipt.json',language+'/receipt.json'].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS LONG EMPTY AND MAXIMUM-TIME BROWSER',sources,artifacts,boundInputs,counts:{programs:2,snapshots:7,observerDescriptions:12},scope:'Production preview4180. Empty source starts complete with no events and restores unchanged. Maximum-time source reaches admitted clock64 with17 events; initial restore/repeated continuation and terminal restore reproduce seven native hashes. Terminal controls disabled, initial nonterminal controls enabled. Two complete observer-description records equal qualified language. No new runtime execution laws, all-program browser claim, command-race proof, file transfer or full Workbench acceptance.'},null,2)+'\n',{flag:'wx'});
console.log('PASS LONG boundary completion, restore, native identity and observer rendering');
