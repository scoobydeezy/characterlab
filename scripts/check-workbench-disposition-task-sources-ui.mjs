import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-task-sources-ui-rev1',corpus='docs/planning/workbench-disposition-task-sources-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),receipt=read(corpus+'/receipt.json'),b=read(root+'/browser.json'),entry=receipt.results.find(r=>r.program===13),bytes=fs.readFileSync(corpus+'/'+entry.path);
assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(gunzipSync(bytes));
for(const c of b.captures){
 const r=expected.find(r=>r.instant===String(c.prefix));assert.deepEqual(c.report,r);
 const s=JSON.parse(gunzipSync(fs.readFileSync(`docs/planning/workbench-disposition-comparison-rev1/snapshot-13-${c.prefix}.json.gz`)));
 assert.deepEqual(c.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]));
 assert.deepEqual(c.cells,r.rows.flatMap(row=>row.links.flatMap(link=>[link.role,link.emitterValue,link.emitted?'Yes':'No'])));
 assert(r.rows.every(row=>row.responseState==='unavailable'&&row.responseIntensity===null));
}
assert.deepEqual(b.captures.map(c=>c.prefix),[1,2]);assert.deepEqual(b.historical,b.captures[0].report);
assert.equal(b.event.id,b.historical.eventId);assert.equal(b.event.instant,'1');
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED DISPOSITION TASK SOURCE BROWSER',qualification:{path:corpus+'/receipt.json',sha256:sha(fs.readFileSync(corpus+'/receipt.json'))},verifier:{path:'scripts/check-workbench-disposition-task-sources-ui.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-task-sources-ui.mjs'))},artifacts:['browser.json','task-sources.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Positive-constitution original prefixes1/2: exact source reports and visible base/situational emitter tables. Five identities match archived native-backed snapshots. Historical report1 remains exact after advancement and links to the original reason event. Unavailable responses are distinguished from zero emitter operands; no native nonzero situational or full-entry claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS task-source browser reports, tables and historical event link');
