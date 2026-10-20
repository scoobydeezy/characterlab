import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-language-ui-rev2',corpus='docs/planning/workbench-disposition-language-rev2',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),receipt=read(corpus+'/receipt.json'),b=read(root+'/browser.json'),entry=receipt.results.find(r=>r.program===13),bytes=fs.readFileSync(corpus+'/'+entry.path);
assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(gunzipSync(bytes));
for(const c of b.captures){
 const r=expected.find(r=>r.instant===String(c.prefix));assert.deepEqual(c.report,r);
 const s=JSON.parse(gunzipSync(fs.readFileSync(`docs/planning/workbench-disposition-comparison-rev1/snapshot-13-${c.prefix}.json.gz`)));
 assert.deepEqual(c.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>s[k]));
 assert.deepEqual(c.sentences,r.rows.map(row=>row.text));
 assert.equal(c.status,`Player-language qualification incomplete: ${r.rows.length} factors lack a qualified character/player reason and subject name.`);
}
assert.deepEqual(b.captures.map(c=>c.prefix),[1,2]);assert.deepEqual(b.historical,b.captures[0].report);
assert.deepEqual(b.semantic,b.historical.rows[0].semantic);assert.deepEqual(b.source,{source:b.historical.rows[0].mechanical,coverage:b.historical.rows[0].coverage});
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED RESEARCHER EXPLANATION BROWSER; PLAYER LANGUAGE INCOMPLETE',qualification:{path:corpus+'/receipt.json',sha256:sha(fs.readFileSync(corpus+'/receipt.json'))},verifier:{path:'scripts/check-workbench-disposition-language-ui.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-language-ui.mjs'))},artifacts:['browser.json','explanations.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Positive-constitution prefixes1/2 exact researcher descriptions, gap notice and five native identities. Historical report1 remains exact after advancement; first description expands to exact semantic/source/coverage records. No player-language or integrated-entry completion.'},null,2)+'\n',{flag:'wx'});console.log('PASS researcher explanation browser and historical semantic/source traversal');
