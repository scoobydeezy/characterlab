import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-general-native-sources-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=JSON.parse(fs.readFileSync(root+'/receipt.json'));assert.equal(receipt.status,'PASS FULL GENERAL NATIVE READ SOURCES');
for(const s of receipt.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256);}
let prefixes=0,reads=0,derived=0,sources=0;const relations={},recipes=new Set();
for(const result of receipt.results){
 assert(!recipes.has(result.recipe));recipes.add(result.recipe);
 const bytes=fs.readFileSync(root+'/'+result.path);assert.equal(sha(bytes),result.sha256);
 const originalBytes=fs.readFileSync(result.original);assert.equal(sha(originalBytes),result.originalSha256);
 const data=JSON.parse(gunzipSync(bytes)),original=JSON.parse(gunzipSync(originalBytes));
 assert.equal(data.recipe,result.recipe);assert.equal(data.rows.length,original.length);
 const histories=new Map();
 data.rows.forEach((row,index)=>{
  assert.equal(row.prefix,index);assert.equal(row.runHash,original[index].runHash);assert.equal(row.saveHash,original[index].saveHash);
  assert.equal(row.metadata.length,original[index].timeline.length);assert.equal(row.reports.length,row.metadata.length);
  for(const metadata of row.metadata)for(const r of metadata.reads){reads++;if(r.transformation)derived++;sources+=r.sources.length;}
  for(const report of row.reports){
   if(histories.has(report.selected))assert.deepEqual(report,histories.get(report.selected));histories.set(report.selected,report);
   for(const read of report.reads)for(const source of read.sourceHistory)relations[source.relation]=(relations[source.relation]??0)+1;
  }prefixes++;
 });
}
assert.equal(recipes.size,43);assert.equal(prefixes,568);assert.equal(reads,receipt.readObservations);assert.equal(derived,receipt.derivedReadObservations);assert.equal(sources,receipt.sourceObservations);assert.deepEqual(relations,receipt.sourceRelations);
const checker='scripts/verify-workbench-general-native-sources.mjs';
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS GENERAL NATIVE SOURCE ARTIFACT VERIFICATION',checker:{path:checker,sha256:sha(fs.readFileSync(checker))},receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),counts:{models:recipes.size,prefixes,reads,derived,sources},relations,scope:'Every output/source hash and original prefix commitment verified; metadata/report cardinality, repeated historical reports and aggregate counts checked independently. Native tuple decoding remains established by the source-bound primary audit. No transformation-math, observer-language or complete causality claim.'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',models:recipes.size,prefixes,reads,derived,sources}));
