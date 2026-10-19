import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-bio-comparison-rev2',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const receipt=read(root+'/receipt.json');assert.equal(receipt.status,'PASS FULL RETAINED BIO COMPARISON COHORT');
for(const source of receipt.sources){assert.equal(sha(fs.readFileSync(source.path)),source.sha256);assert.equal(sha(fs.readFileSync(root+'/sources/'+source.path)),source.sha256);}
const cases=new Map();
for(const item of receipt.cases){
 const bytes=fs.readFileSync(root+'/'+item.path);assert.equal(sha(bytes),item.sha256);
 const rows=JSON.parse(gunzipSync(bytes));assert.equal(rows.length,20);
 const input=receipt.nativeInputs.find(x=>x.name===item.name),originalPath='docs/planning/workbench-bio-parity-rev1/'+input.path;
 assert.equal(sha(fs.readFileSync(originalPath)),input.sha256);const original=read(originalPath);
 rows.forEach((row,prefix)=>{assert.equal(row.prefix,prefix);for(const k of ['modelHash','runHash','stateHash','saveHash'])assert.equal(row[k],original.prefixes[prefix][k]);assert.deepEqual(row.records,original.finalRecords.slice(0,prefix));});
 assert(!cases.has(item.name));cases.set(item.name,item);
}
assert.equal(cases.size,13);assert.equal(receipt.reports.length,19);
let prefixes=0,recordObservations=0;const ids=new Set();
for(const item of receipt.reports){
 assert(!ids.has(item.id));ids.add(item.id);const bytes=fs.readFileSync(root+'/'+item.path);assert.equal(sha(bytes),item.sha256);
 const reports=JSON.parse(gunzipSync(bytes));assert.equal(reports.length,20);
 const loadCase=name=>JSON.parse(gunzipSync(fs.readFileSync(root+'/'+cases.get(name).path)));
 const aa=loadCase(reports[0].spec.control),bb=loadCase(reports[0].spec.candidate);
 reports.forEach((report,prefix)=>{
  assert.equal(report.spec.id,item.id);assert.equal(report.status,'ALIGNED_COMPONENT_PREFIX');
  assert.equal(report.spec.control,reports[0].spec.control);assert.equal(report.spec.candidate,reports[0].spec.candidate);
  const a=aa[prefix],b=bb[prefix];
  assert.equal(report.control.saveHash,a.saveHash);assert.equal(report.candidate.saveHash,b.saveHash);
  assert.equal(report.control.prefix,prefix);assert.equal(report.candidate.prefix,prefix);assert.equal(report.records.length,prefix);
  for(const [flag,k]of [['modelEqual','modelHash'],['runEqual','runHash'],['stateEqual','stateHash'],['saveEqual','saveHash']])assert.equal(report.identity[flag],a[k]===b[k]);
  assert.equal(report.currentHistoryEqual,a.history===b.history);assert.equal(report.currentArchiveEqual,a.archive===b.archive);
  report.records.forEach((r,i)=>{
   const x=a.records[i],y=b.records[i];assert.equal(r.ordinal,i+1);assert.equal(r.recordEqual,x.canonicalHex===y.canonicalHex);
   for(const [field,key]of [['choice','chosen'],['probabilities','probabilities'],['modifiers','modifiers'],['strength','strength'],['authorship','authorship']]){
    assert.deepEqual(r[field].control,x.summary[key]);assert.deepEqual(r[field].candidate,y.summary[key]);assert.equal(r[field].equal,JSON.stringify(x.summary[key])===JSON.stringify(y.summary[key]));
   }
   for(const k of ['history','archive','expression','display','context','raw','reasons'])assert.equal(r[k+'Equal'],x.summary[k]===y.summary[k]);
   assert.deepEqual(r.rng.controlAddressKeys,x.summary.addresses);assert.deepEqual(r.rng.candidateAddressKeys,y.summary.addresses);
   assert.deepEqual(r.rng.controlDraws,x.summary.draws);assert.deepEqual(r.rng.candidateDraws,y.summary.draws);
   assert.equal(r.rng.addressKeysEqual,JSON.stringify(x.summary.addresses)===JSON.stringify(y.summary.addresses));assert.equal(r.rng.drawRecordsEqual,JSON.stringify(x.summary.draws)===JSON.stringify(y.summary.draws));
   assert.equal(r.rng.controlSeed,x.summary.seed);assert.equal(r.rng.candidateSeed,y.summary.seed);assert.equal(r.rng.nondecisionEqual,x.summary.nondecision===y.summary.nondecision);recordObservations++;
  });prefixes++;
 });
}
assert.equal(prefixes,380);assert.equal(recordObservations,3610);assert.equal(receipt.counts.recordObservations,recordObservations);
const checker='scripts/verify-workbench-bio-comparison-full.mjs';
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT BIO COMPARISON ARTIFACT JOIN',checker:{path:checker,sha256:sha(fs.readFileSync(checker))},receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),counts:{cases:cases.size,prefixes,recordObservations,sources:receipt.sources.length},scope:'Every retained comparison field rechecked from saved case snapshots, whose hashes and exact records independently join original native parity evidence. No additional execution, language, browser or Campaign4 claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS independent BIO comparison: 380 reports / 3610 record observations');
