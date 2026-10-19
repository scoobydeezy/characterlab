import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-bio-reason-history-ui-rev1',parent='docs/planning/workbench-bio-reason-history-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const b=read(root+'/browser.json'),reports=JSON.parse(gunzipSync(fs.readFileSync(parent+'/case-00.json.gz'))),nativePath='docs/planning/workbench-bio-parity-rev1/case-00.json',native=read(nativePath);
const nativeReceipt=read('docs/planning/workbench-bio-parity-rev1/receipt.json');assert.equal(sha(fs.readFileSync(nativePath)),nativeReceipt.cases.find(c=>c.name==='Earned/6').sha256);
assert.deepEqual(b.before,reports[1]);assert.deepEqual(b.after,reports[0]);assert.deepEqual(b.historical,reports[1]);
const hashes=p=>['modelHash','runHash','stateHash','saveHash'].map(k=>native.prefixes[p][k]);
assert.deepEqual(b.prefix2Hashes,hashes(2));assert.deepEqual(b.afterNavigationHashes,b.prefix2Hashes);assert.deepEqual(b.prefix3Hashes,hashes(3));assert.deepEqual(b.afterHistoricalHashes,b.prefix3Hashes);
assert.equal(b.selectedAfterNavigation,'1');assert.equal(b.selectedHistorical,'2');
const sources=[...read(parent+'/freeze.json').sources];for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
for(const path of ['src/workbench/BioReasonHistoryPanel.tsx','src/workbench/BioWorkbench.tsx','scripts/check-workbench-bio-reason-history-ui.mjs']){const bytes=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});sources.push({path,sha256:sha(bytes)});}
const artifacts=[root+'/browser.json',root+'/history.png',parent+'/case-00.json.gz',parent+'/freeze.json',nativePath];
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED BIO REASON HISTORY NAVIGATION',sources,artifacts:artifacts.map(path=>({path,sha256:sha(fs.readFileSync(path))})),scope:'Earned/6 reason2 links by keyboard to original source step1. Native prefix2 hashes are unchanged. After advancing to3, historical reason2 provenance is identical and prefix3 hashes remain unchanged. Reports join the completed case00 of the still-running full-cohort audit; no full-cohort completion, all-case browser, observer-language or causal-necessity claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS bounded BIO reason history browser');
