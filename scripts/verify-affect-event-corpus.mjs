import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-event-corpus-rev2',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),receipt=read(root+'/receipt.json'),freeze=read(root+'/freeze.json');
assert.equal(receipt.status,'PASS AFFECT EVENT CORPUS');assert.equal(receipt.results.length,105);
for(const s of [...freeze.sources,...freeze.references])assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);
const expected=freeze.references.slice(0,2).flatMap(r=>read(r.path).results),programs=new Set();let prefixes=0,appraisals=0,reads=0,matches=0,mismatches=0,absent=0,historical=0;
for(const r of receipt.results){assert(!programs.has(r.program));programs.add(r.program);const bytes=fs.readFileSync(root+'/'+r.file);assert.equal(sha(bytes),r.sha256);const p=JSON.parse(bytes),oracle=expected.find(e=>e.id===r.program);assert(oracle);assert.equal(p.program,r.program);assert.equal(p.prefixes.length,oracle.prefixes.length);const seen=new Map();
 for(const [index,prefix] of p.prefixes.entries()){
  assert.equal(prefix.prefix,index);for(const key of ['stateHash','saveHash','outputsHash'])assert.equal(prefix[key],oracle.prefixes[index][key]);prefixes++;
  for(const join of prefix.joins){const exact=JSON.stringify(join);if(seen.has(join.card)){assert.equal(exact,seen.get(join.card));historical++;}else{seen.set(join.card,exact);appraisals++;for(const read of join.reads){reads++;if(read.priorMutation){assert.equal(read.relation,read.exact===read.priorMutation.after?'exact-value-match':'value-mismatch');if(read.relation==='exact-value-match')matches++;else mismatches++;}else{assert.equal(read.relation,'no-prior-recorded-mutation');absent++;}}}}
 }
 assert.equal(seen.size,r.appraisals);
}
assert.deepEqual([...programs].sort(),expected.map(e=>e.id).sort());assert.equal(prefixes,1436);assert.equal(appraisals,1331);
assert.deepEqual(receipt.counts,{roles:105,prefixes,appraisals,historicalComparisons:historical,reads,exactMatches:matches,valueMismatches:mismatches,noPriorMutation:absent});
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT AFFECT EVENT CORPUS RECEIPT CHECK',counts:receipt.counts,receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),freezeSha256:sha(fs.readFileSync(root+'/freeze.json')),verifier:{path:'scripts/verify-affect-event-corpus.mjs',sha256:sha(fs.readFileSync('scripts/verify-affect-event-corpus.mjs'))},scope:'Authenticates all105 files/1436 prefix identities against original receipts, all1331 unique appraisal joins and stable historical join records; independently recounts read relation outcomes. Does not independently rerun native execution or grant browser/player-language acceptance.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt.counts));
