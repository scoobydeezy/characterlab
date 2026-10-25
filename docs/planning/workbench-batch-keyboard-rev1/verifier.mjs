import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-batch-keyboard-rev1',priorRoot='docs/planning/workbench-batch-boundary-ui-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const prior=read(priorRoot+'/receipt.json'),original=read(priorRoot+'/browser.json'),b=read(root+'/browser.json');
assert.equal(prior.status,'PASS BOUNDED SHARED BOUNDARY UI');
for(const s of [...prior.freeze.baselineSources,...prior.freeze.sources])assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
for(const a of prior.freeze.assets){assert.equal(sha(fs.readFileSync(a.copy)),a.sha256,a.copy);assert.equal(sha(fs.readFileSync(a.served)),a.sha256,a.served);}
assert.equal(b.before.status,original.status);assert.deepEqual(b.before.hashes,original.hashes);assert.equal(b.before.preview,original.preview);
assert.deepEqual(b.after,b.before);assert.equal(b.before.hashes.length,16);assert.equal(b.before.preview.length,64000);
assert.deepEqual(b.focus,[{tag:'BUTTON',text:'Prepare fresh batch'},{tag:'SUMMARY',text:'Capabilities and scope'},
 {tag:'BUTTON',text:'Prepare summary export'},{tag:'SUMMARY',text:'Prefix hashes'},{tag:'SUMMARY',text:'Prefix hashes'}]);
assert.equal(b.firstOpen,'');assert.deepEqual(b.bothVisible,[true,true]);assert.equal(b.secondClosed,null);
const verifier=fs.readFileSync('scripts/check-workbench-batch-keyboard.mjs');fs.writeFileSync(root+'/verifier.mjs',verifier,{flag:'wx'});
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED COMPLETED BATCH KEYBOARD',build:664,tab:55,roles:2,prefixes:8,
 priorReceiptSha256:sha(fs.readFileSync(priorRoot+'/receipt.json')),verifierSha256:sha(verifier),artifacts:['browser.json','disclosures.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
 scope:'Completed ADAPT cohort only: local Tab order skips disabled Run/Pause, Enter opens both hash disclosures and recreates the identical preview, Space closes a disclosure. All16 displayed hashes and64000 preview characters remain identical. No fresh simulation, all-cohort, screen-reader, responsive-layout or complete accessibility claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS bounded keyboard:5 focus stops,2 disclosures,16 unchanged hashes,64000 unchanged preview characters');
