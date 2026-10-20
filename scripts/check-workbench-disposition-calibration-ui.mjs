import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-calibration-ui-rev1',corpus='docs/planning/workbench-disposition-calibration-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),receipt=read(corpus+'/receipt.json'),b=read(root+'/browser.json'),entry=receipt.results.find(r=>r.program===13),bytes=fs.readFileSync(corpus+'/'+entry.path);
assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(gunzipSync(bytes));
for(const capture of b.captures){
 const r=expected.find(r=>r.eventId===capture.report.eventId);assert.deepEqual(capture.report,r);
 const s=JSON.parse(gunzipSync(fs.readFileSync(`docs/planning/workbench-disposition-comparison-rev1/snapshot-13-${capture.prefix}.json.gz`)));
 assert.deepEqual(capture.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]));
 const n=r.nuclei[0],roles=n.roles.flatMap(row=>[row.role,row.signedTotal,row.boundedNet,row.modifier?.scaled??'die bands',row.modifier?.truncated??'—',row.modifier?.result??'—']);
 assert.deepEqual(capture.tables[0],roles);assert.deepEqual(capture.tables[1],n.bands.flatMap(x=>[x.cutoff,'d'+x.die,x.crossed?'Yes':'No']));assert.deepEqual(capture.tables[2],n.masses.flatMap(x=>[x.score,x.mass]));
}
assert.equal(b.captures[0].prefix,1);assert.equal(b.captures[0].report.modifierUnit,'1/1');assert.equal(b.captures[1].prefix,5);assert.equal(b.captures[1].report.modifierUnit,'1/16');
assert.deepEqual(b.historical,b.captures[0].report);
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED DISPOSITION CALIBRATION BROWSER',qualification:{path:corpus+'/receipt.json',sha256:sha(fs.readFileSync(corpus+'/receipt.json'))},verifier:{path:'scripts/check-workbench-disposition-calibration-ui.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-calibration-ui.mjs'))},artifacts:['browser.json','calibration.png','overview.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Positive-constitution original learning1 and probe5. Complete reports, role tables, die-band tables and score masses match the qualified reconstruction. Five identities match native-backed archives. Historical event18 remains exact at prefix5. No all-program browser or full entry qualification.'},null,2)+'\n',{flag:'wx'});console.log('PASS learning/probe calibration tables and historical stability');
