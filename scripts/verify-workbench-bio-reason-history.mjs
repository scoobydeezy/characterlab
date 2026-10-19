import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-bio-reason-history-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const receipt=read(root+'/receipt.json');assert.equal(receipt.status,'PASS FULL RETAINED BIO REASON HISTORY');
for(const s of receipt.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256);}
const f=(v,n)=>Object.entries(v).find(([k])=>k.endsWith(` [${n}]`))[1];let reports=0,links=0;
for(const entry of receipt.results){
 const bytes=fs.readFileSync(root+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
 assert.equal(sha(fs.readFileSync(entry.original)),entry.originalSha256);
 const source=read(entry.original),rows=source.finalRecords.map(r=>JSON.parse(r.exact)),data=JSON.parse(gunzipSync(bytes));assert.equal(data.length,19);
 for(const [index,report]of data.entries()){
  assert.equal(report.selected,index+1);
  const signals=f(rows[index][3],3);assert.equal(report.sources.length,signals.length);
  report.sources.forEach((s,i)=>{
   const atoms=f(f(signals[i],3),1);assert.equal(s.atoms.length,atoms.length);
   s.atoms.forEach((a,j)=>{
    assert.deepEqual(JSON.parse(a.identity),atoms[j][0]);assert.equal(a.weight,JSON.stringify(atoms[j][1],null,2));
    if(f(atoms[j][0],1)!=='2'){assert.equal(a.status,'other-recorded-atom');return;}
    const id=f(atoms[j][0],3),ordinal=rows.slice(0,index).findIndex(row=>JSON.stringify(f(row[8],1))===JSON.stringify(id))+1;
    assert(ordinal>0);assert.equal(a.status,'earlier-recorded-qualification');assert.equal(a.source.ordinal,ordinal);
    assert.equal(a.source.expression,source.finalRecords[ordinal-1].summary.expression);
    const qualification=f(rows[ordinal-1][8],3);assert.equal(a.source.eligibility,f(qualification,1));
    assert.equal(a.source.evidence,a.source.eligibility==='1'?JSON.stringify(f(qualification,3),null,2):null);links++;
   });
  });reports++;
 }
}
assert.equal(reports,247);assert.equal(links,2108);assert.equal(receipt.counts.links,links);
const checker='scripts/verify-workbench-bio-reason-history.mjs';fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT BIO HISTORY ARTIFACT JOIN',checker:{path:checker,sha256:sha(fs.readFileSync(checker))},receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),reports,links,scope:'All native/source/output hashes checked; every qualification atom independently joins an earlier original readable record, matching original expression identity, eligibility and evidence. No browser breadth, character-language or causal-necessity claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS independent BIO reason history:247 reports/2108 links');
