import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-substitution-search-rev2',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));assert(!fs.existsSync(root+'/browser-receipt.json'));
const index=read(root+'/receipt.json'),b=read(root+'/browser.json'),parent='docs/planning/workbench-substitution-browser-programs-rev1',p=read(parent+'/receipt.json'),f=p.artifacts.find(f=>f.program==='LatestHistory/diversified'),bytes=fs.readFileSync(parent+'/'+f.path);assert.equal(sha(bytes),f.sha256);const rows=JSON.parse(gunzipSync(bytes)).rows;
for(const [capture,prefix]of [[b.before,1],[b.after,1],[b.restored,1],[b.terminal,8]]){
 assert.equal(capture.state,rows[prefix].state);assert.deepEqual(capture.hashes,rows[prefix].hashes);
}
assert.deepEqual(b.before,b.after);assert.deepEqual(b.before,b.restored);assert.deepEqual(JSON.parse(b.timeline),JSON.parse(b.before.state).rows[0]);
for(const [text,capture,prefix,row]of [[b.selected,b.before,1,0],[b.terminalSelection,b.terminal,8,7]]){
 const meta=JSON.parse(text.slice(text.indexOf('{'),text.lastIndexOf('}')+1));const hashes=Object.fromEntries(capture.hashes.map(h=>[h.key,h.value]));
 for(const key of ['runHash','modelHash','stateHash'])assert.equal(meta[key],hashes[key]);assert.equal(meta.prefix,prefix);assert.equal(meta.path,`/rows/${row}/intent`);assert.equal(meta.renderer,'diagnostic-search/0.1');assert.equal(meta.authority,'diagnostic projection');
 assert(text.includes('\n'+JSON.parse(capture.state).rows[row].intent+'\n'));
}
assert.equal(b.limit,'364 matching fields · showing 100 · result limit reached; refine the search');assert.deepEqual(b.stale,{results:'0 matching fields · showing 0',selectedCount:0});
for(const s of index.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256);}
const script='scripts/check-workbench-diagnostic-search-ui.mjs';fs.copyFileSync(script,root+'/sources/scripts/check-workbench-diagnostic-search-ui.mjs',fs.constants.COPYFILE_EXCL);
fs.writeFileSync(root+'/browser-receipt.json',JSON.stringify({status:'PASS BOUNDED SEARCH/IDENTITY/TIMELINE/RESTORE BROWSER',parent:{path:root+'/receipt.json',sha256:sha(fs.readFileSync(root+'/receipt.json'))},checker:{path:script,sha256:sha(fs.readFileSync(script))},artifacts:['browser.json','search.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'LatestHistory/diversified prefixes1 and8. Keyboard field selection, exact identity, linked Timeline row, explicit result limit, restored missing path clears selection. Main state and five hashes match original qualified browser cohort. Screenshot inspected. Not all-program browser search, full filtering, responsive/assistive technology or resource-policy acceptance.'},null,2)+'\n',{flag:'wx'});console.log('PASS bounded search browser evidence and original state/hash joins');
