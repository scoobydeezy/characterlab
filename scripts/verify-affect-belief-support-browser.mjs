import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-belief-support-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const freeze=read(root+'/freeze.json'),r=read(root+'/reports.json'),b=read(root+'/browser.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
assert.deepEqual(JSON.parse(b.initial),r.prefixes[0].reports[0]);
assert.deepEqual(JSON.parse(b.prefix3),r.prefixes[3].reports.at(-1));
assert.deepEqual(JSON.parse(b.prefix4),r.prefixes[4].reports.at(-1));
assert.deepEqual(JSON.parse(b.prefix3).rows,JSON.parse(b.prefix4).rows);
const original=read('docs/planning/workbench-affect-appraisal-reads-rev1/baseline.json').snapshot;
const support=JSON.parse(b.prefix3).rows[0].support[0].sources[0];
assert.deepEqual(JSON.parse(b.application),original.timeline.find(e=>e.id===support.eventId));
assert.deepEqual(JSON.parse(b.observation),original.timeline.find(e=>e.id===support.observations[0].eventId));
assert.deepEqual(b.alerts,[]);assert.equal(b.width.scroll,b.width.client);
fs.writeFileSync(root+'/browser-verification.json',JSON.stringify({status:'PASS BOUNDED BELIEF SUPPORT BROWSER',prefixes:[0,3,4],applicationEvent:support.eventId,observationEvent:support.observations[0].eventId,historyStable:true,browserHash:sha(fs.readFileSync(root+'/browser.json')),scope:'Exact original support report, original apply/observe event navigation, stable prior support after advancement and desktop layout. No full corpus/browser or complete causal ancestry claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS native support reports and original event links');
