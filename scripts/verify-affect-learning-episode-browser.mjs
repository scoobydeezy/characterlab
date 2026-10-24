import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-learning-episode-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
for(const s of read(root+'/freeze.json').sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
const r=read(root+'/reports.json'),b=read(root+'/browser.json'),native=r.results.find(r=>r.program==='baseline').reports.find(r=>r.eventId==='60');
const {identity:terminalIdentity,...expected}=native;
for(const key of ['prefix3','prefix4']){const {identity,...body}=JSON.parse(b[key]);assert.deepEqual(body,expected);assert.equal(identity.runHash,terminalIdentity.runHash);}
assert.notEqual(JSON.parse(b.prefix3).identity.saveHash,JSON.parse(b.prefix4).identity.saveHash);
const original=read('docs/planning/workbench-affect-appraisal-reads-rev1/baseline.json').snapshot;
for(const [id,event] of Object.entries(b.events))assert.deepEqual(JSON.parse(event),original.timeline.find(e=>e.id===id));
assert.deepEqual(Object.keys(b.events).sort(),['30','31','32','59']);assert.deepEqual(b.alerts,[]);assert.equal(b.width.scroll,b.width.client);
fs.writeFileSync(root+'/browser-verification.json',JSON.stringify({status:'PASS BOUNDED EPISODE BROWSER',prefixes:[3,4],events:Object.keys(b.events),browserHash:sha(fs.readFileSync(root+'/browser.json')),scope:'Baseline original ordered episode report and four exact event links; history body stable with changed prefix save identity, no alerts or desktop horizontal overflow. No full corpus/browser, complete ancestry or broad accessibility claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS episode report, historical stability and exact original event links');
