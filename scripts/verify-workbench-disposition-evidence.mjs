import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-disposition-comparison-rev1',native='docs/planning/workbench-disposition-parity-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),parity=read(native+'/receipt.json'),plan=read('docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json');
for(const [base,r]of [[root,receipt],[native,parity]])for(const s of r.sources){
 assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 assert.equal(sha(fs.readFileSync(base+'/sources/'+s.path)),s.sha256,s.path);
}
assert.equal(parity.results.length,15);assert.equal(receipt.artifacts.length,855);
const snapshots=new Map(),reports=[];
for(const a of receipt.artifacts){
 const bytes=fs.readFileSync(root+'/'+a.path);assert.equal(sha(bytes),a.sha256,a.path);
 const value=JSON.parse(gunzipSync(bytes));
 if(a.path.startsWith('snapshot-')){
  const [,index,prefix]=a.path.match(/^snapshot-(\d+)-(\d+)\.json.gz$/),p=plan.runs[Number(index)],entry=parity.results.find(r=>r.program===p.law+'/'+p.name);
  assert.equal(sha(fs.readFileSync(native+'/'+entry.path)),entry.sha256);
  assert.equal(sha(fs.readFileSync(entry.referencePath)),entry.referenceSha256);
  const n=read(native+'/'+entry.path).rows[Number(prefix)],original=read(entry.referencePath);
  for(const k of ['prefix','clock','saveHash','stateHash','projectionHash'])assert.equal(value[k],n[k]);
  assert.equal(value.saveHash,original.prefixes[Number(prefix)].saveSha256);
  assert.equal(value.modelHash,sha(Buffer.from(p.modelIdentity,'hex')));assert.equal(value.runHash,sha(Buffer.from(p.runIdentity,'hex')));
  assert.equal(value.timeline.length,10*Number(prefix));
  snapshots.set(entry.program+'/'+prefix,{identity:Object.fromEntries(['program','prefix','clock','constitution','law','modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>[k,value[k]])),path:a.path});
 }else reports.push(a.path);
}
assert.equal(snapshots.size,285);assert.equal(reports.length,570);
const contrasts=new Map();
for(const reportPath of reports){
 const r=JSON.parse(gunzipSync(fs.readFileSync(root+'/'+reportPath)));
 const a=snapshots.get(r.a.program+'/'+r.a.prefix),b=snapshots.get(r.b.program+'/'+r.b.prefix);
 assert(a&&b);assert.deepEqual(r.a,a.identity);assert.deepEqual(r.b,b.identity);
 assert.equal(r.aligned,true);assert.equal(r.a.prefix,r.b.prefix);
 assert.equal(r.stateEqual,r.a.stateHash===r.b.stateHash);assert.equal(r.saveEqual,r.a.saveHash===r.b.saveHash);
 const av=JSON.parse(gunzipSync(fs.readFileSync(root+'/'+a.path))),bv=JSON.parse(gunzipSync(fs.readFileSync(root+'/'+b.path)));
 assert.equal(r.mechanismProjectionEqual,av.mechanismProjection===bv.mechanismProjection);
 const left=new Map(av.fields.map(f=>[f.path,f.exact])),right=new Map(bv.fields.map(f=>[f.path,f.exact]));
 assert.deepEqual(new Set(r.fields.map(f=>f.path)),new Set([...left.keys(),...right.keys()]));
 for(const f of r.fields){assert.equal(f.a,left.get(f.path)??null);assert.equal(f.b,right.get(f.path)??null);assert.equal(f.equal,left.get(f.path)===right.get(f.path));}
 if(!contrasts.has(r.contrast.id))contrasts.set(r.contrast.id,new Set());
 assert(!contrasts.get(r.contrast.id).has(r.a.prefix));contrasts.get(r.contrast.id).add(r.a.prefix);
}
assert.equal(contrasts.size,30);for(const prefixes of contrasts.values())assert.deepEqual([...prefixes].sort((a,b)=>a-b),Array.from({length:19},(_,i)=>i));
const paths=[root+'/receipt.json',native+'/receipt.json','scripts/verify-workbench-disposition-evidence.mjs'];
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT DISPOSITION SAVED EVIDENCE JOIN',programs:15,prefixes:285,contrasts:30,reports:570,artifacts:paths.map(path=>({path,sha256:sha(fs.readFileSync(path))})),scope:'All retained snapshot commitments join original native saves and separate parity results; every report side and exact field difference joins retained snapshots. Current and frozen source hashes pass. No new execution, full restore, subjective observer language, all-program browser or integrated-entry claim.'},null,2)+'\n',{flag:'wx'});
console.log('PASS Disposition 15 programs / 285 prefixes / 30 contrasts / 570 reports');
