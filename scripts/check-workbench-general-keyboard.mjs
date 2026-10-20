import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-general-keyboard-rev1';
const native='docs/planning/workbench-general-comparison-cohort-rev1';
const render='docs/planning/workbench-general-event-state-rev2/receipt.json';
const search='docs/planning/workbench-recorded-state-search-rev1/receipt.json';
const ui='docs/planning/workbench-general-event-state-ui-rev1/receipt.json';
const script='scripts/check-workbench-general-keyboard.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p));
const b=read(root+'/browser.json');
const entry=read(native+'/receipt.json').models.find(m=>m.recipe==='baseline');
const bytes=fs.readFileSync(native+'/'+entry.path);
assert.equal(sha(bytes),entry.sha256);
const decoded=gunzipSync(bytes);assert.equal(sha(decoded),entry.decodedSha256);
const snapshot=JSON.parse(decoded)[4];
const field=snapshot.fields.find(f=>f.root==='631');
const event=snapshot.timeline.find(e=>e.id==='43');
assert.deepEqual(b.beforeHashes,['modelHash','runHash','stateHash','saveHash'].map(k=>snapshot[k]));
assert.deepEqual(b.afterHashes,b.beforeHashes);
assert.deepEqual(b.queryPaths,[field.path]);
assert.equal(b.focusAfterQuery.tag,'SELECT');
assert.ok(b.focusAfterQuery.label.startsWith('Recorded state root'));
assert.equal(b.focusAfterRoot,'Clear state filters');
assert.equal(b.focusAfterClear,'Inspect stored root 631 · result 1');
assert.equal(b.root,'631');
assert.deepEqual(b.selected,{path:field.path,value:field.exact,revision:snapshot.saveHash});
assert.deepEqual(b.clearedPaths,snapshot.fields.map(f=>f.path));
assert.equal(b.timelineLinkEvent,'43');
assert.equal(b.filterChecked,true);
assert.equal(b.nextEvent,'44');
assert.equal(b.filterReset,true);
assert.equal(b.expanded,true);
assert.deepEqual(b.eventBefore,event.diffs.map(d=>d.before));
assert.deepEqual(b.eventAfter,event.diffs.map(d=>d.after));
// The later event-state build supersedes the older GeneralWorkbench source.
// Authenticate the search component itself against its own qualification.
const sources=[...read(render).sources,...read(search).sources.filter(s=>
 ['src/workbench/recordedStateSearch.ts','src/workbench/RecordedStateInspector.tsx'].includes(s.path))];
for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
assert.equal(read(ui).status,'PASS BOUNDED GENERAL EVENT STATE BROWSER');
const receipt={
 status:'PASS BOUNDED GENERAL STATE SEARCH AND EVENT KEYBOARD',
 build:'characterlab-general-event-state-rev1 at127.0.0.1:4204; browser2/tab28',
 parents:[native+'/receipt.json',render,search,ui].map(path=>({path,sha256:sha(fs.readFileSync(path))})),
 sources,
 verifier:{path:script,sha256:sha(fs.readFileSync(script))},
 artifacts:['browser.json','keyboard.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),
 scope:'Frozen-seed baseline prefix4. Enter opens Reasoning; typed AssociationGraph query finds root631. Tab reaches root selector, skips disabled paging to Clear, then reaches the result. Home/ArrowDown select root631; Enter opens exact state and clears filters. Enter follows selected event43 to Timeline; Space checks changed-only; ArrowDown selects44 and resets it; ArrowUp returns43 and Enter opens mutation disclosure. Exact current state, historical before/after and all four native identities match the frozen cohort. This is bounded keyboard-control and local focus-order evidence, not full tab order, screen-reader behavior, multi-page results, all recipes or integrated-entry acceptance.'
};
fs.writeFileSync(root+'/receipt.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log(receipt.status);
