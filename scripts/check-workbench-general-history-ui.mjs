import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-general-history-ui-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const capture=read(root+'/browser.json'),qualified=read('docs/planning/workbench-general-history-rev1/receipt.json'),cohort='docs/planning/workbench-general-comparison-cohort-rev1',original=read(cohort+'/receipt.json'),p=original.pairs.find(p=>p.id==='ga-pair-01'),bytes=fs.readFileSync(cohort+'/'+p.path);
assert.equal(sha(bytes),p.sha256);const expected=JSON.parse(gunzipSync(bytes));
assert.deepEqual(capture.mainBefore,capture.mainAfter);assert.equal(capture.mainBefore.length,4);assert(capture.mainBefore.every(h=>/^[0-9a-f]{64}$/.test(h)));
for(const c of capture.captures){assert.deepEqual(c.report,expected[c.report.control.prefix]);assert.deepEqual(c.history.observedPrefixes,Array.from({length:c.report.control.prefix+1},(_,i)=>i));assert.deepEqual(c.history.missingPrefixes,[]);}
const byLabel=Object.fromEntries(capture.captures.map(c=>[c.label,c]));
assert.equal(byLabel.initial.report.control.prefix,0);assert.equal(byLabel['captured-1'].report.control.prefix,1);assert.equal(byLabel.paused.report.control.prefix,2);
assert.deepEqual(byLabel.restored, {...byLabel['captured-1'],label:'restored'});
assert.deepEqual(byLabel.continued,{...byLabel.paused,label:'continued'});
assert.deepEqual(capture.historical,expected[1]);assert.deepEqual(byLabel['mode-paused'].report,byLabel['mode-returned'].report);
assert.equal(byLabel['mode-paused'].report.control.prefix,3);assert.equal(capture.staleReportCleared,true);assert.equal(capture.staleStepDisabled,true);
assert.deepEqual(byLabel['restore-after-selection'].report,expected[1]);
for(const s of qualified.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const artifacts=['browser.json','comparison.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}));
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED GENERAL COMPARISON BROWSER HISTORY',qualification:{path:'docs/planning/workbench-general-history-rev1/receipt.json',sha256:sha(fs.readFileSync('docs/planning/workbench-general-history-rev1/receipt.json'))},verifier:{path:'scripts/check-workbench-general-history-ui.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-general-history-ui.mjs'))},artifacts,scope:'Original first pair: initial0, captured1, run/pause2, historical1 unchanged, restore1 and identical continuation2, run then mode-leave pause3, mode return unchanged, selection clears stale report/disables stepping, checkpoint restores original declaration1. Four independent main-run hashes unchanged. Full displayed reports match qualified native cohort. No all-pair browser replay or download-transport claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS bounded General comparison UI: pause/history/restore/continuation/mode leave/selection isolation');
