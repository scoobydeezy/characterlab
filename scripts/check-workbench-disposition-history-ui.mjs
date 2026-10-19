import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-history-ui-rev1';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const b=read(`${root}/browser.json`),native=read('docs/planning/workbench-disposition-pair-browser-rev1/browser.json');
assert.deepEqual(b.zero.observedPrefixes,[0]);
assert.equal(b.zero.firstStateDifference.prefix,0);
assert.equal(b.zero.firstMechanismProjectionDifference,null);
for(const key of ['one','restored']){
 assert.deepEqual(b[key].observedPrefixes,[0,1]);
 assert.equal(b[key].firstMechanismProjectionDifference.prefix,1);
 assert.equal(b[key].firstMechanismProjectionDifference.earliestProven,true);
}
assert.deepEqual(b.two.observedPrefixes,[0,1,2]);
assert.deepEqual(b.historical,native.zero);
assert.deepEqual(b.liveBeforeInspection,native.advanced);
assert.deepEqual(b.liveAfterInspection,b.liveBeforeInspection);
assert.deepEqual(b.restored,b.one);
assert.deepEqual(b.continued,b.two);
assert.deepEqual(b.continuedReport,native.advanced);
assert.deepEqual(b.afterModes,b.two);
for(const key of ['zero','one','two','restored','continued']){
 const h=b[key];assert.deepEqual(h.missingPrefixes,[]);assert.equal(h.completeFromInitial,true);
 assert.equal(h.firstStateDifference.earliestProven,true);
 for(const p of h.checkpoints){
  const original=[native.zero,native.paused,native.advanced][p.prefix];
  assert.equal(p.aSaveHash,original.a.saveHash);assert.equal(p.bSaveHash,original.b.saveHash);
  assert.equal(p.stateEqual,original.stateEqual);assert.equal(p.mechanismProjectionEqual,original.mechanismProjectionEqual);
 }
}
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const sources={};
for(const name of fs.readdirSync(`${root}/source`)){
 const current=name.endsWith('.test.ts')?`src/test/${name}`:`src/workbench/${name}`;
 assert.equal(hash(current),hash(`${root}/source/${name}`));sources[current]=hash(current);
}
const receipt={version:'disposition-history-browser/0.1',status:'PASS',contrast:'model/0/13',prefixes:[0,1,2],checks:['initial state versus mechanism divergence','every retained step','read-only historical inspection','restore horizon truncation','exact deterministic continuation','mode persistence'],sources,artifacts:{'browser.json':hash(`${root}/browser.json`)},scope:'One constitutional pair, three committed prefixes. Native report equality joins the prior qualified pair receipt. Full contrast coverage, integrated demonstration and causal significance remain unqualified.'};
fs.writeFileSync(path.join(root,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(receipt));
