import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-decision-link-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const b=read(root+'/browser.json'),freeze=read(root+'/freeze.json'),language=read('docs/planning/workbench-affect-language-rev1/receipt.json'),original=read('docs/planning/workbench-affect-browser-rev1/comparison.json'),parity=read('docs/planning/workbench-affect-parity-rev1/receipt.json');
for(const s of [...freeze.sources,...freeze.references])assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
for(const branch of ['a','b']){
 const snapshot=original[branch],entry=language.results.find(r=>r.program===snapshot.program),bytes=fs.readFileSync(entry.file);assert.equal(sha(bytes),entry.sha256);
 const card=JSON.parse(bytes).explanations.find(c=>c.kind==='Decision'&&c.at==='1');assert.equal(b.branches[branch].human,card.human);assert.equal(b.branches[branch].source,card.provenance);
 const event=snapshot.timeline.find(e=>e.stage==='decision'&&e.instant==='1');assert.deepEqual(JSON.parse(b.branches[branch].event),event);
 const prefix=parity.results.find(r=>r.id===snapshot.program).prefixes[1];assert.equal(b.branches[branch].revision,prefix.saveHash);
}
assert.deepEqual(JSON.parse(b.returnedAppraisal),original.a.timeline.find(e=>e.stage==='appraise'&&e.instant==='1'));
assert.equal(b.keyboardEvent,b.branches.a.event);assert.deepEqual(b.alerts,[]);assert.deepEqual(b.afterHashes,b.beforeHashes);
const a=parity.results.find(r=>r.id==='baseline'),p=a.prefixes[1];assert.equal(b.beforeHashes[2],p.stateHash);assert.equal(b.beforeHashes[3],p.saveHash);assert.equal(b.beforeHashes[0],original.a.modelHash);assert.equal(b.beforeHashes[1],original.a.runHash);
fs.writeFileSync(root+'/browser-receipt.json',JSON.stringify({status:'PASS AFFECT APPRAISAL TO DECISION BROWSER LINKS',scope:'Baseline/hidden original pair at1: exact frozen decision language/source and original event24, branch save revision, appraisal return, keyboard decision selection and unchanged four native identities. Broader browser roles/horizons and player disclosure remain unqualified.',artifacts:['browser.json','decision.png','freeze.json'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),verifier:{path:'scripts/check-affect-decision-link-browser.mjs',sha256:sha(fs.readFileSync('scripts/check-affect-decision-link-browser.mjs'))}},null,2)+'\n',{flag:'wx'});console.log('PASS exact appraisal-to-decision browser links');
