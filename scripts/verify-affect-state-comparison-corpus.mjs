import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-state-comparison-corpus-rev1';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const freeze=read(root+'/freeze.json'),receipt=read(root+'/receipt.json'),declarations=read(root+'/declarations.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
for(const r of freeze.references)assert.equal(sha(fs.readFileSync(r.path)),r.sha256,r.path);
const originals=new Map(freeze.references.slice(0,2).flatMap(r=>read(r.path).results).map(r=>[r.id,r]));
assert.equal(declarations.length,16);assert.equal(receipt.results.length,16);
const counts={pairs:0,prefixes:0,historyChecks:0,writeLinks:0,differentTerminalPairs:0};
for(const [i,r] of receipt.results.entries()){
 const bytes=fs.readFileSync(root+'/'+r.file);assert.equal(sha(bytes),r.sha256);const data=JSON.parse(bytes);
 assert.deepEqual(data.contrast,declarations[i]);assert.equal(r.id,data.contrast.id);
 assert.equal(data.prefixes.length,r.prefixes);
 for(const branch of ['a','b'])assert.equal(r.prefixes,originals.get(data.contrast[branch]).prefixes.length);
 for(const [j,p] of data.prefixes.entries()){
  assert.equal(p.prefix,j);assert.equal(p.report.rows.length,j+1);
  for(const [index,branch] of ['a','b'].entries()){
   const id=p.identities[index];assert.equal(id.program,data.contrast[branch]);
   const old=originals.get(id.program).prefixes[j];for(const key of ['stateHash','saveHash','outputsHash'])assert.equal(id[key],old[key]);
   assert.equal(p.report.identity[branch].saveHash,id.saveHash);
  }
  for(const old of data.prefixes.slice(0,j)){assert.deepEqual(p.report.rows.slice(0,old.report.rows.length),old.report.rows);counts.historyChecks++;}
  for(const row of p.report.rows)for(const f of row.fields){assert.equal(f.equal,f.a===f.b);for(const branch of ['a','b'])if(f[branch+'Event']!==null)counts.writeLinks++;}
  const first=p.report.rows.find(row=>row.fields.some(f=>!f.equal));assert.deepEqual(p.report.firstDifference,first?{at:first.at,initial:first.at===null}:null);
  counts.prefixes++;
 }
 const terminal=data.prefixes.at(-1).report;
 assert.deepEqual(r.firstDifference,terminal.firstDifference);
 // Independently count actual terminal differences, rather than assuming that
 // an earlier difference cannot have converged again by the final prefix.
 if(terminal.rows.at(-1).fields.some(f=>!f.equal))counts.differentTerminalPairs++;
 counts.pairs++;
}
assert.deepEqual(counts,receipt.counts);
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT DECLARED COMPARISON ARTIFACT RECONCILIATION',counts,frozenSources:freeze.sources.length,receiptHash:sha(fs.readFileSync(root+'/receipt.json')),scope:'All declarations, original prefix identities, report equality/first-difference consistency, cumulative write-link counts and historical report stability. Direct native current-field and event-body checks belong to the frozen writer; not independently re-executed here.'},null,2)+'\n',{flag:'wx'});
console.log(counts);
