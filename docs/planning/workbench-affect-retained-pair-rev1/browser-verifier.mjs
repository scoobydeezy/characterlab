import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-retained-pair-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),b=read(root+'/browser.json'),native=read(root+'/native.json');
assert.equal(sha(fs.readFileSync(root+'/native.json')),read(root+'/native-receipt.json').artifact.sha256);
for(const s of read(root+'/freeze.json').sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
for(const [field,prefix] of [['summary1',1],['summary2',2],['restoredSummary',1],['pausedSummary',2]])assert.deepEqual(JSON.parse(b[field]),native[prefix].summary);
assert.equal(b.status1,'Retained A1 / B1 · Ready');assert.equal(b.restoredStatus,b.status1);assert.equal(b.pausedStatus,'Retained A2 / B2 · Ready');assert.equal(b.returnStatus,b.pausedStatus);
assert.equal(b.unequal.status,'Retained A2 / B1 · Ready');assert(b.unequal.bothDisabled);assert(b.unequal.message.includes('unequal horizons'));assert.equal(b.unequal.summaryStill,b.summary1);
assert.equal(b.restoredAppraisal,b.appraisal1);
for(const [field,prefix] of [['appraisal1',1],['appraisal2',2]]){
 const report=JSON.parse(b[field]);assert.equal(report.rows.length,prefix);
 for(const branch of ['a','b']){const s=native[prefix].report[branch];assert.deepEqual(report.identity[branch],{program:s.program,saveHash:s.saveHash,prefix});for(const row of report.rows)assert.equal(row[branch].provenance,s.explanations.find(c=>c.kind==='Appraisal'&&c.at===row.at).provenance);}
}
const s=native[1].report.b,hashes=['modelHash','runHash','stateHash','saveHash'].map(k=>s[k]);
assert.deepEqual(Object.keys(b.modes).sort(),['Architecture','Character','Compare','Experiment','Reasoning','Timeline']);for(const mode of Object.values(b.modes))assert.deepEqual(mode.hashes,hashes);
assert.equal(b.modes.Character.source,s.explanations.find(c=>c.kind==='Appraisal').provenance);
assert.deepEqual(b.modes.Reasoning.sources,s.explanations.filter(c=>c.at==='1').map(c=>c.provenance));
assert.deepEqual(JSON.parse(b.modes.Timeline.event),s.timeline.at(-1));assert.deepEqual(JSON.parse(b.modes.Architecture.report),native[1].architecture.b);
assert.deepEqual(b.standaloneBefore,['modelHash','runHash','stateHash','saveHash'].map(k=>native[0].report.a[k]));assert.deepEqual(b.standaloneAfter,b.standaloneBefore);assert.deepEqual(b.alerts,[]);
fs.writeFileSync(root+'/browser-receipt.json',JSON.stringify({status:'PASS RETAINED AFFECT PAIR BROWSER LIFECYCLE',scope:'Baseline/hidden0/1/2: six-mode branch B identities and exact diagnostics, unequal2/1 withholding, summary history, checkpoint1 restore, Run/Pause1→2 and outer mode retention with standalone0 isolation. Full horizons, all eight browser pairs, broader accessibility/player language and integrated entry remain due.',artifacts:['browser.json','pair.png','native.json','freeze.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),verifier:{path:'scripts/check-affect-retained-pair-browser.mjs',sha256:sha(fs.readFileSync('scripts/check-affect-retained-pair-browser.mjs'))}},null,2)+'\n',{flag:'wx'});console.log('PASS retained AFFECT pair lifecycle and six modes');
