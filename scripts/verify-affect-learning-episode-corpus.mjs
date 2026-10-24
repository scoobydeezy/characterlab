import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-learning-episode-corpus-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),freeze=read(root+'/freeze.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
for(const r of freeze.references)assert.equal(sha(fs.readFileSync(r.path)),r.sha256,r.path);
const originals=freeze.references.slice(0,2).flatMap(r=>read(r.path).results),counts={programs:0,prefixes:0,reports:0,conditional:0,empty:0,roles:0,evidenceJoins:0,freezeJoins:0,trackJoins:0,observationJoins:0,unavailable:0,multiple:0,historyChecks:0};
const checkStatus=(items,status)=>{if(!items.length)counts.unavailable++;if(items.length>1)counts.multiple++;assert.equal(status,items.length===1?'unique recorded source':items.length===0?'unavailable in selected history':'multiple recorded matches');};
assert.equal(receipt.results.length,105);
for(const [i,result] of receipt.results.entries()){
 const bytes=fs.readFileSync(root+'/'+result.file);assert.equal(sha(bytes),result.sha256);const d=JSON.parse(bytes),original=originals[i],history=new Map();assert.equal(d.program,original.id);assert.equal(result.program,original.id);assert.equal(d.prefixes.length,original.prefixes.length);
 for(const [j,p] of d.prefixes.entries()){
  assert.equal(p.prefix,j);for(const k of ['stateHash','saveHash','outputsHash'])assert.equal(p.identities[k],original.prefixes[j][k]);
  for(const r of p.reports){const {identity,...body}=r;assert.equal(identity.saveHash,p.identities.saveHash);assert(BigInt(r.at)<=BigInt(j));if(history.has(r.eventId)){assert.deepEqual(body,history.get(r.eventId));counts.historyChecks++;}else history.set(r.eventId,body);counts.reports++;
   if(!r.conditionalEvidencePresent){assert.equal(r.current,null);assert.deepEqual(r.episodeBasis,[]);assert.deepEqual(r.evidence,[]);assert.equal(r.samplePresent,false);assert.equal(r.evidenceStatus,'no conditional evidence supplied');counts.empty++;continue;}
   counts.conditional++;checkStatus(r.evidence,r.evidenceStatus);for(const e of r.evidence){assert(BigInt(e.at)<=BigInt(r.at));counts.evidenceJoins++;}
   assert.equal(r.current.role,'Current');r.episodeBasis.forEach((row,k)=>assert.equal(row.role,`Episode basis ${k+1}`));
   for(const row of [r.current,...r.episodeBasis]){assert.equal(row.frozen.record,'AffectFrozenObservation#751/1');counts.roles++;checkStatus(row.freezes,row.freezeStatus);
    for(const f of row.freezes){assert(BigInt(f.at)<=BigInt(r.at));counts.freezeJoins++;checkStatus(f.tracks,f.trackStatus);for(const t of f.tracks){assert(BigInt(t.at)<=BigInt(f.at));counts.trackJoins++;checkStatus(t.observations,t.observationStatus);for(const o of t.observations){assert(BigInt(o.at)<=BigInt(t.at));counts.observationJoins++;}}}
   }
  }counts.prefixes++;
 }counts.programs++;
}
assert.deepEqual(counts,receipt.counts);assert.equal(counts.prefixes,1436);
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT FULL EPISODE ARTIFACT RECONCILIATION',counts,sources:freeze.sources.length,receiptHash:sha(fs.readFileSync(root+'/receipt.json')),scope:'Original order/prefix identities, frozen source/artifact hashes, historical report equality, role/status/chronology and count consistency. Native output/parent joins belong to frozen writer, not re-executed here. No complete ancestry, browser or full entry claim.'},null,2)+'\n',{flag:'wx'});console.log(counts);
