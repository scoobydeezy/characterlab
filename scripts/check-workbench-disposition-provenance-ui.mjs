import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-provenance-ui-rev1',corpus='docs/planning/workbench-disposition-provenance-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),receipt=read(corpus+'/receipt.json'),b=read(root+'/browser.json'),entry=receipt.results.find(r=>r.program===13),bytes=fs.readFileSync(corpus+'/'+entry.path);
assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(gunzipSync(bytes));
for(const c of b.captures){
 const r=expected.find(r=>r.instant===String(c.prefix));assert.deepEqual(c.report,r);
 const s=JSON.parse(gunzipSync(fs.readFileSync(`docs/planning/workbench-disposition-comparison-rev1/snapshot-13-${c.prefix}.json.gz`)));
 assert.deepEqual(c.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]));assert.deepEqual(c.signals,r.signals.flatMap(s=>[s.action,s.strength]));
}
assert.deepEqual(b.captures.map(c=>c.prefix),[1,2]);assert.equal(b.captures[0].report.history.length,0);assert.equal(b.captures[1].report.history.length,1);assert.equal(b.captures[1].report.incompleteBatchEntries,1);
assert.deepEqual(b.historyRows,b.captures[1].report.history);assert.deepEqual(b.historical,b.captures[0].report);
assert.equal(b.event.id,b.historical.eventId);assert.equal(b.event.instant,'1');assert(b.event.reads.some(r=>r.path===b.historical.constitution.path));
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED DISPOSITION PROVENANCE BROWSER',qualification:{path:corpus+'/receipt.json',sha256:sha(fs.readFileSync(corpus+'/receipt.json'))},verifier:{path:'scripts/check-workbench-disposition-provenance-ui.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-provenance-ui.mjs'))},artifacts:['browser.json','provenance.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Positive-constitution original prefixes1/2: exact provenance reports, opposing raw signals, first qualified-history entry and pending-batch distinction. Five identities match archived native-backed snapshots. Historical report1 remains exact and links to original reason event/read paths. No all-law browser or full entry claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS provenance browser reports, signals, history and exact event link');
