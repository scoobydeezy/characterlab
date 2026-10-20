import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-horizon-ui-rev2',prior='docs/planning/workbench-disposition-comparison-rev1',freezePath='docs/planning/workbench-disposition-choice-rev2/freeze.json',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
if(process.argv.includes('--freeze')){
 assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const sources=read(freezePath).sources;
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources,sourceFreeze:{path:freezePath,sha256:sha(fs.readFileSync(freezePath))},verifier:{path:'scripts/check-workbench-disposition-horizon-ui-v2.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-horizon-ui-v2.mjs'))},scope:'Original Plastic/Main browser Run/Pause then terminal18, mode availability, exact five identities and historical decision inspection. No heap measurement or all-program browser resource claim.'},null,2)+'\n',{flag:'wx'});
 console.log('FROZEN full-horizon browser qualification');process.exit(0);
}
const freeze=read(root+'/freeze.json'),b=read(root+'/browser.json'),artifacts=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
assert.equal(sha(fs.readFileSync(freeze.sourceFreeze.path)),freeze.sourceFreeze.sha256);assert.equal(sha(fs.readFileSync(freeze.verifier.path)),freeze.verifier.sha256);
for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const original=prefix=>{const name=`snapshot-0-${prefix}.json.gz`,bytes=fs.readFileSync(prior+'/'+name);assert.equal(sha(bytes),artifacts.get(name));return JSON.parse(gunzipSync(bytes));};
for(const c of [b.paused,b.terminal]){const s=original(c.prefix);assert.deepEqual(c.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]));}
assert.equal(b.paused.prefix,1);assert.equal(b.paused.status,'DISPOSITION prefix 1 · Ready');assert.equal(b.paused.pauseDisabled,true);
assert.equal(b.terminal.prefix,18);assert.equal(b.terminal.status,'DISPOSITION prefix 18 · Complete');assert.equal(b.terminal.stepDisabled,true);assert.equal(b.terminal.runDisabled,true);assert.equal(b.terminal.eventCount,180);
assert.deepEqual(b.modes.map(m=>m.name),['Character','Experiment','Reasoning','Timeline','Compare','Architecture']);for(const m of b.modes){assert.equal(m.pressed,'true');assert.equal(m.alerts.length,0);}
const s=original(18);assert.deepEqual(JSON.parse(b.historical.record),s.timeline.find(e=>e.id==='19'));assert.deepEqual(b.historical.hashes,b.terminal.hashes);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED PLASTIC MAIN FULL-HORIZON BROWSER',sourceFreeze:freeze,artifacts:['browser.json','terminal.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Plastic/Main Run/Pause finishes exactly prefix1, resumed run reaches original18 with exact five hashes and180 selectable events. Six mode buttons remain available without displayed alerts; historical decision19 matches terminal native history without changing hashes. Mode availability is not exhaustive panel-content validation, heap profiling, all-program browser acceptance or full integrated-entry qualification.'},null,2)+'\n',{flag:'wx'});console.log('PASS bounded full-horizon browser controls and historical decision');
