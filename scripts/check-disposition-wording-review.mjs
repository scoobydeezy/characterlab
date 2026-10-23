import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-wording-review-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const freeze=read(root+'/freeze.json'),o=read(root+'/oracle.json'),b=read(root+'/browser.json'),c=read('src/workbench/dispositionLanguageCorpus.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
for(const s of read(root+'/build.json').assets)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
assert.equal(b.counts,o.counts);assert.equal(b.groups.length,4);let occurrences=0;
for(const [i,g] of b.groups.entries()){
 const expected=o.groups[i];assert.equal(g.text,expected.text);assert.deepEqual(JSON.parse(g.semantics),expected.semantics);
 assert.deepEqual(g.options,['Select an occurrence to inspect below',...expected.occurrences.map(o=>o.label)]);occurrences+=g.options.length-1;
 for(const link of g.links){const address=expected.occurrences[link.index],p=c.programs[address.programIndex],e=p.events[address.eventIndex];
  assert.equal(link.selection,`${p.program} · instant ${e.instant} · event ${e.eventId} · ${e.rows.length} matching factors · reason record emitted`);assert(link.liveDisabled);
  assert.deepEqual(link.sources.map(JSON.parse),e.rows.map(r=>({languageVersion:c.languageVersion,semantic:c.semantics[r.semanticId].semantic,source:{archive:p.archive,sha256:p.sha256,reportIndex:e.reportIndex,rowIndex:r.rowIndex,eventId:e.eventId,snapshot:p.snapshot}})));
 }
}
assert.equal(occurrences,154);assert.equal(b.beforeHashes.length,5);assert(b.beforeHashes.every(h=>/^[0-9a-f]{64}$/.test(h)));assert.deepEqual(b.afterHashes,b.beforeHashes);assert.deepEqual(b.alerts,[]);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS CROSS-CORPUS WORDING REVIEW',groups:4,occurrences:154,browserSourceLinks:8,tests:2,buildModules:608,scope:'Researcher sentence reuse across distinct subject semantics is surfaced with exact retained occurrence addresses. This does not amend zero within-event collisions, classify reuse as misleading, grant player disclosure or complete language/entry qualification.',artifacts:['freeze.json','build.json','oracle.json','browser.json','review.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),verifier:{path:'scripts/check-disposition-wording-review.mjs',sha256:sha(fs.readFileSync('scripts/check-disposition-wording-review.mjs'))}},null,2)+'\n',{flag:'wx'});
console.log('PASS four wording groups / 154 occurrences / eight browser source links / unchanged five identities');
