import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-learning-episode-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),b=read(root+'/paired-browser.json'),reports=read(root+'/reports.json');
for(const s of read(root+'/freeze.json').sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
for(const [branch,program] of [['a','baseline'],['b','hidden']]){
 const expected=reports.results.find(r=>r.program===program).reports.find(r=>r.eventId==='60'),{identity,...body}=expected;
 for(const key of [branch,branch+'4']){const {identity:actual,...report}=JSON.parse(b[key]);assert.deepEqual(report,body);assert.equal(actual.runHash,identity.runHash);}
 assert.notEqual(JSON.parse(b[branch]).identity.saveHash,JSON.parse(b[branch+'4']).identity.saveHash);
 const original=read(`docs/planning/workbench-affect-appraisal-reads-rev1/${program}.json`).snapshot;assert.deepEqual(JSON.parse(b[branch==='a'?'eventA':'eventB']),original.timeline.find(e=>e.id==='30'));
}
assert.notEqual(JSON.parse(b.a).identity.saveHash,JSON.parse(b.b).identity.saveHash);assert.equal(b.status4,'Retained A4 / B4 · Ready');assert(b.statuses.includes('Prefix 4 · instant 4 · Ready'));assert.deepEqual(b.alerts,[]);
fs.writeFileSync(root+'/paired-verification.json',JSON.stringify({status:'PASS BOUNDED PAIRED EPISODE BROWSER',programs:['baseline','hidden'],prefixes:[3,4],eventId:'60',observationId:'30',captureHash:sha(fs.readFileSync(root+'/paired-browser.json')),scope:'Each branch report matches its authenticated original; both original observation links and historical body stability verified, distinct branch saves, standalone prefix remains4. Not full paired corpus, broad accessibility or complete ancestry.'},null,2)+'\n',{flag:'wx'});console.log('PASS paired episode reports and original observation links');
