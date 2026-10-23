import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-disposition-replay-rev1',priorRoot='docs/planning/workbench-disposition-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const receipt=read(root+'/receipt.json'),manifest=read(root+'/manifest.json'),prior=read(priorRoot+'/receipt.json'),planPath='docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json',plan=read(planPath),interruption=read(root+'/interruption-2026-10-23.json');
assert.equal(receipt.status,'PASS COMPLETE ORIGINAL DISPOSITION ADAPTER REPLAY');assert.deepEqual(receipt.counts,{programs:15,prefixes:285,advancing:270,terminal:15});assert.deepEqual(receipt.sources,manifest.sources);
for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
assert.equal(interruption.records.length,242);for(const original of interruption.records)assert.equal(sha(fs.readFileSync(root+'/'+original.path)),original.sha256);
assert.equal(receipt.recovery.retainedRecords,242);assert.equal(sha(fs.readFileSync(root+'/resume-script.mjs')),receipt.recovery.scriptSha256);
const artifacts=new Map(receipt.artifacts.map(a=>[a.path,a.sha256]));assert.equal(receipt.artifacts.length,285);assert.equal(artifacts.size,285);let advancing=0,terminal=0;
for(const program of plan.runs){
 const name=program.law+'/'+program.name,p=prior.results.find(r=>r.program===name);assert(p);
 const originalBytes=fs.readFileSync(p.referencePath),rowsBytes=fs.readFileSync(priorRoot+'/'+p.path);assert.equal(sha(originalBytes),p.referenceSha256);assert.equal(sha(rowsBytes),p.sha256);
 const original=JSON.parse(originalBytes),rows=JSON.parse(rowsBytes).rows;assert.equal(original.planSha256,sha(fs.readFileSync(planPath)));assert.equal(rows.length,19);
 for(let prefix=0;prefix<=18;prefix++){
  const path=`program-${program.index}-prefix-${prefix}.json`,bytes=fs.readFileSync(root+'/'+path);assert.equal(sha(bytes),artifacts.get(path));const r=JSON.parse(bytes),row=rows[prefix];assert.equal(r.program,name);assert.equal(r.prefix,prefix);
  for(const key of ['saveHash','stateHash','projectionHash','events'])assert.equal(r[key],row[key]);assert.equal(r.events,prefix*10);
  assert.equal(r.modelHash,sha(Buffer.from(program.modelIdentity,'hex')));assert.equal(r.runHash,sha(Buffer.from(program.runIdentity,'hex')));assert.equal(r.saveHash,original.prefixes[prefix].saveSha256);assert.equal(r.successorHash,original.prefixes[prefix].nextSha256);assert.equal(r.successorHash,original.prefixes[Math.min(prefix+1,18)].saveSha256);assert.equal(r.successorPrefix,Math.min(prefix+1,18));assert.equal(r.advanced,prefix<18);assert(Number.isSafeInteger(r.saveBytes)&&r.saveBytes>0);r.advanced?advancing++:terminal++;
 }
}
assert.equal(advancing,270);assert.equal(terminal,15);
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT COMPLETE DISPOSITION REPLAY RECEIPT CHECK',counts:receipt.counts,retainedRecordsUnchanged:242,receiptSha256:sha(fs.readFileSync(root+'/receipt.json')),priorReceiptSha256:sha(fs.readFileSync(priorRoot+'/receipt.json')),verifier:{path:'scripts/verify-disposition-replay.mjs',sha256:sha(fs.readFileSync('scripts/verify-disposition-replay.mjs'))},scope:'All285 replay artifacts and242 pre-interruption originals authenticated. Every state/projection/event count matches original adapter parity; save and successor identities match original native receipts, with270 advancing and15 terminal outcomes. Receipt audit does not independently rerun restore or establish browser/resource/player-language/integrated-entry acceptance.'},null,2)+'\n',{flag:'wx'});console.log('PASS285 original replay receipts/270 successors/15 terminal outcomes/242 preserved originals');
