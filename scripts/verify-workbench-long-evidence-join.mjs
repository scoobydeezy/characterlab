import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const roots={native:'docs/planning/workbench-long-parity-rev2',language:'docs/planning/workbench-long-language-rev1',comparison:'docs/planning/workbench-long-comparison-cohort-rev1'};
const sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const receipts=Object.fromEntries(Object.entries(roots).map(([k,r])=>[k,read(r+'/receipt.json')]));
const artifacts=[],sources=new Map();
function artifact(path,hash){const bytes=fs.readFileSync(path);if(hash)assert.equal(sha(bytes),hash,path);artifacts.push({path,sha256:sha(bytes)});return bytes;}
for(const [kind,receipt]of Object.entries(receipts)){
 artifact(roots[kind]+'/receipt.json');
 for(const s of receipt.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(roots[kind]+'/sources/'+s.path)),s.sha256);if(sources.has(s.path))assert.equal(sources.get(s.path),s.sha256);sources.set(s.path,s.sha256);}
}
const native=new Map(receipts.native.results.map(r=>[r.program,JSON.parse(artifact(roots.native+'/'+r.path,r.sha256)).prefixes]));
assert.equal(native.size,32);
let languagePrefixes=0,descriptions=0,comparisonPrefixes=0,alignedPairs=0,missingInstants=0;
for(const result of receipts.language.results){
 const record=JSON.parse(artifact(roots.language+'/'+result.path,result.sha256)),prefixes=native.get(record.program);assert(prefixes);assert.equal(record.rows.length,prefixes.length);
 for(const [i,row]of record.rows.entries()){
  const p=prefixes[i];assert.equal(row.prefix,p.prefix);assert.equal(row.saveHash,p.saveHash);assert.equal(sha(Buffer.from(row.observerHex,'hex')),p.observerHash);assert.equal(row.description.observerHash,p.observerHash);assert.equal(row.description.rows.length,6);languagePrefixes++;descriptions+=row.description.rows.length;
 }
}
function archive(root,entry){const compressed=artifact(root+'/'+entry.path,entry.sha256),bytes=gunzipSync(compressed);assert.equal(bytes.length,entry.decodedBytes);assert.equal(sha(bytes),entry.decodedSha256);return JSON.parse(bytes);}
// Decode one large program archive at a time; retain only the small native commitments.
for(const result of receipts.comparison.programs){
 const snapshots=archive(roots.comparison,result),prefixes=native.get(result.program);assert(prefixes);assert.equal(snapshots.length,prefixes.length);
 for(const [i,snapshot]of snapshots.entries()){
  assert.equal(snapshot.program,result.program);
  for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash','outputsHash','traceHash','observerHash'])assert.equal(snapshot[key],prefixes[i][key],result.program+' '+i+' '+key);
  assert.equal(sha(Buffer.from(snapshot.observerHex,'hex')),prefixes[i].observerHash);comparisonPrefixes++;
 }
 console.log('JOINED '+result.program);
}
for(const entry of receipts.comparison.pairs){
 let aligned=0,missing=0;
 for(const report of archive(roots.comparison,entry)){
  if(report.status==='MISSING_COMMITTED_INSTANT'){assert.equal(report.identity,undefined);missing++;continue;}
  assert.equal(report.status,'ALIGNED_COMMITTED_CLOCK');assert.equal(report.spec.id,entry.id);
  const sides=['control','candidate'].map(side=>{const s=report[side];assert.equal(s.program,entry[side]);const p=native.get(s.program)?.[s.prefix];assert(p);assert.equal(s.saveHash,p.saveHash);assert.equal(s.clock,p.clock);return p;});
  assert.equal(sides[0].clock,sides[1].clock);
  for(const [flag,key]of [['modelEqual','modelHash'],['runEqual','runHash'],['stateEqual','stateHash'],['observerEqual','observerHash']])assert.equal(report.identity[flag],sides[0][key]===sides[1][key]);
  aligned++;
 }
 assert.equal(aligned,entry.alignedPrefixes);assert.equal(missing,entry.missingInstants);alignedPairs+=aligned;missingInstants+=missing;
}
assert.equal(languagePrefixes,513);assert.equal(descriptions,3078);assert.equal(comparisonPrefixes,476);assert.equal(alignedPairs,407);assert.equal(missingInstants,2);
artifact('scripts/verify-workbench-long-evidence-join.mjs');
fs.writeFileSync(roots.native+'/evidence-join.json',JSON.stringify({status:'PASS LONG NATIVE LANGUAGE COMPARISON JOIN',artifacts,sources:[...sources].map(([path,sha256])=>({path,sha256})),counts:{nativePrograms:32,languagePrefixes,descriptions,comparisonPrograms:28,comparisonPrefixes,pairs:24,alignedPairs,missingInstants},scope:'Exact cross-receipt join of saved evidence, not fresh execution. Language observer bytes/digests and save identities join every native prefix. Full comparison snapshots join nine native identity/time/hash fields; every aligned pair joins native commitments and identity equalities. Missing instants remain non-comparisons. Does not re-prove language semantics or comparison field mathematics, broaden browser evidence, or qualify LONG successors or full Workbench entry.'},null,2)+'\n',{flag:'wx'});
console.log('PASS LONG native/language/comparison join');
