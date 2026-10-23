import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-pair-horizons-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const freeze=read(root+'/freeze.json');for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
const start=read(root+'/browser-start.json');assert.equal(sha(fs.readFileSync(start.build.path)),start.build.sha256);for(const asset of read(start.build.path).assets)assert.equal(sha(fs.readFileSync(asset.path)),asset.sha256);
const index=Number(process.argv[2]);assert(Number.isInteger(index)&&index>=0&&index<8);
const native=read(`${root}/pair-${index}.json`),b=read(`${root}/browser-${index}.json`),terminal=native.prefixes.at(-1);assert.equal(native.contrast,b.id);assert(native.terminalRestore);assert.equal(native.terminalAdvanceMoved,false);
for(const capture of [b.terminal,b.restored]){
 assert.equal(capture.status,`Retained A${terminal.prefix} / B${terminal.prefix} · Complete`);assert(capture.stepDisabled);
 assert.deepEqual(JSON.parse(capture.summary),terminal.summary);
 const {identity,...appraisals}=JSON.parse(capture.appraisals);assert.deepEqual(appraisals,terminal.appraisals);
 for(const branch of ['a','b']){const s=terminal.summary[branch];assert.deepEqual(identity[branch],{program:s.program,saveHash:s.saveHash,prefix:s.prefix});}
}
assert.deepEqual(b.restored,b.terminal);assert.deepEqual(b.alerts,[]);
fs.writeFileSync(`${root}/browser-receipt-${index}.json`,JSON.stringify({status:'PASS ONE AFFECT PAIRED BROWSER TERMINAL AND RESTORE',contrast:b.id,prefix:terminal.prefix,artifacts:[`pair-${index}.json`,`browser-${index}.json`,'freeze.json','browser-start.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'One original pair terminal summary, both source identities, all appraisal comparisons and authenticated paired restore. No full eight-pair acceptance until aggregate audit.'},null,2)+'\n',{flag:'wx'});console.log(`PASS browser terminal and restore ${b.id}`);
