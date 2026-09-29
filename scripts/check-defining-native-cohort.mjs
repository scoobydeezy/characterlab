import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/defining-native-cohort-rev1',p='docs/planning/';
const read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const manifest=read(dir+'/MANIFEST.json');assert.equal(manifest.cases.length,68);
for(const f of manifest.files)assert.equal(sha(f.path),f.sha256,f.path);
assert.equal(fs.readdirSync(dir).filter(n=>n.startsWith('FAILURE_')).length,0,'Preserve and resolve failures before qualification');
const paths=manifest.cases.map((_,i)=>dir+'/CASE_'+String(i).padStart(2,'0')+'.json');
const rows=paths.map(read);
for(const [i,row] of rows.entries()){
 assert.equal(row.status,'PASS');assert.equal(row.index,i);assert.deepEqual(row.spec,manifest.cases[i]);
 assert.equal(row.instants.at(-1),String(row.spec.now));assert.equal(new Set(row.instants).size,row.instants.length);
 assert.deepEqual(row.instants,[1,2,3,4,5,6,16,17,18,19,20,21,22,23,33,34,35,36,37,38,...(row.spec.rehearsals?[39,40,41]:[]),42,43,...(row.spec.now>100?[100]:[]),row.spec.now].map(String),'Sparse calendar must retain the inherited deadline');
 assert.deepEqual(row.stages.map(s=>s.clock),['37','38',...(row.spec.rehearsals?['39','40','41']:[]),'42','43',String(row.spec.now)]);
 assert.equal(row.finalRankReads,row.spec.cue==='absent'?0:2);
 assert.equal(row.finalPresentationSettlements,row.selected.length);assert.equal(row.rehearsals,row.spec.rehearsals);
 if(row.spec.cue==='absent'||row.spec.capacity===0)assert.deepEqual(row.selected,[]);
 for(const s of row.stages)for(const key of ['state','outputs','trace'])assert.match(s[key],/^[a-f0-9]{64}$/);
}
const counts=key=>Object.fromEntries([...new Set(rows.map(r=>r.spec[key]))].map(value=>[value,rows.filter(r=>r.spec[key]===value).length]));
const diagnosticPairs=[];
for(const row of rows.filter(r=>r.spec.worldAfter===20)){
 const counterpart=rows.find(r=>JSON.stringify(r.spec)===JSON.stringify({...row.spec,worldAfter:30}));assert(counterpart);
 for(const key of ['historical','current','retainedEvents','selected','finalRankReads','finalPresentationSettlements'])assert.deepEqual(row[key],counterpart[key]);
 diagnosticPairs.push([counterpart.index,row.index]);
}
const result={status:'ALL68 INTERNAL NATIVE CASES PASS',scope:'Internal native execution and component correspondence; selected-stage hashes, not public Save132 or all-prefix restore qualification.',runs:rows.length,models:new Set(rows.map(r=>r.modelIdentity)).size,runIdentities:new Set(rows.map(r=>r.runIdentity)).size,selectedStages:rows.reduce((n,r)=>n+r.stages.length,0),settledInstants:rows.reduce((n,r)=>n+r.instants.length,0),coverage:Object.fromEntries(['law','goal','rehearsals','capacity','now','cue','report','worldAfter'].map(k=>[k,counts(k)])),retained35NotSelected:rows.filter(r=>r.retainedEvents.includes('35')&&!r.selected.includes('35')).map(r=>r.index),counters:{highestAllocated:1492,sinceVerdict:8},files:[dir+'/MANIFEST.json',...paths,'scripts/check-defining-native-cohort.mjs',p+'DEFINING_PUBLIC_SAVE_GATE.md'].map(path=>({path,sha256:sha(path)}))};
result.diagnosticPairs=diagnosticPairs;
const output=p+'DEFINING_NATIVE_COHORT_CHECK_REV1.json';
if(process.argv.includes('--write'))fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(output),result);
console.log(JSON.stringify({...result,files:undefined}));
