import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-paged-full-diagnostics-rev1';
const prior='docs/planning/workbench-disposition-comparison-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const freeze=read(root+'/freeze.json'),receipt=read(root+'/receipt.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256,s.path);}
const archives=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
const plan=read('docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json');
assert.equal(receipt.results.length,285);assert.equal(new Set(receipt.results.map(r=>r.path)).size,285);
const kinds=['storedState','architecture','eventState','reasons','resolution','calibration','provenance','taskSources','factorSources','language'];
const counts=Object.fromEntries(kinds.map(k=>[k,0]));let historicalChecks=0;
for(let index=0;index<15;index++){
 const history=new Map();let modelHash,runHash;
 for(let prefix=0;prefix<=18;prefix++){
  const result=receipt.results[index*19+prefix],file=`program-${index}-prefix-${prefix}.json`;
  assert.equal(result.path,file);const bytes=fs.readFileSync(root+'/'+file);assert.equal(sha(bytes),result.sha256);
  const p=JSON.parse(bytes);assert.equal(p.index,index);assert.equal(p.prefix,prefix);assert.equal(p.program,plan.runs[index].law+'/'+plan.runs[index].name);
  assert.equal(p.archive.path,`snapshot-${index}-${prefix}.json.gz`);assert.equal(p.archive.sha256,archives.get(p.archive.path));assert.equal(sha(fs.readFileSync(prior+'/'+p.archive.path)),p.archive.sha256);
  for(const key of ['modelHash','runHash','stateHash','saveHash','projectionHash'])assert.match(p.identities[key],/^[0-9a-f]{64}$/);
  if(prefix===0){modelHash=p.identities.modelHash;runHash=p.identities.runHash;}else{assert.equal(p.identities.modelHash,modelHash);assert.equal(p.identities.runHash,runHash);}
  assert.match(p.scalarHistorySha256,/^[0-9a-f]{64}$/);assert.match(p.choicesSha256,/^[0-9a-f]{64}$/);
  const seen=new Set();for(const check of p.checks){const key=JSON.stringify(check.selection);assert(!seen.has(key));seen.add(key);assert(kinds.includes(check.selection.kind));assert.match(check.reportSha256,/^[0-9a-f]{64}$/);counts[check.selection.kind]++;
   if('eventId' in check.selection){if(history.has(key))assert.equal(check.reportSha256,history.get(key));history.set(key,check.reportSha256);}
  }
  for(const kind of ['storedState','architecture'])assert(p.checks.some(c=>c.selection.kind===kind));
  const reasons=p.checks.filter(c=>c.selection.kind==='reasons');
  for(const c of reasons){const eventId=c.selection.eventId;for(const kind of ['resolution','calibration','provenance','taskSources','factorSources'])assert(p.checks.some(x=>x.selection.kind===kind&&x.selection.eventId===eventId));for(const audience of ['researcher','character','player'])assert(p.checks.some(x=>x.selection.kind==='language'&&x.selection.eventId===eventId&&x.selection.audience===audience));}
  assert.equal(p.historicalReports,history.size);if(prefix>0)historicalChecks+=read(root+`/program-${index}-prefix-${prefix-1}.json`).historicalReports;
 }
}
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT PAGED DIAGNOSTIC ARTIFACT RECONCILIATION',programs:15,prefixes:285,frozenSources:freeze.sources.length,counts,historicalChecks,receiptHash:sha(fs.readFileSync(root+'/receipt.json')),scope:'All artifacts, frozen/current source hashes, original compressed archive hashes, program/prefix order, stable model/run identity, diagnostic selection coverage and cumulative historical report accounting. Exact native report bodies and historical replay are verified by the frozen writer, not re-executed by this artifact reconciliation. No browser, restore, heap-bound or full-entry claim.'},null,2)+'\n',{flag:'wx'});
console.log({counts,historicalChecks});
