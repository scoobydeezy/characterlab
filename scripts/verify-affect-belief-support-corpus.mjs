import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const root='docs/planning/workbench-affect-belief-support-corpus-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const receipt=read(root+'/receipt.json'),freeze=read(root+'/freeze.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256,s.copy);}
for(const r of freeze.references)assert.equal(sha(fs.readFileSync(r.path)),r.sha256,r.path);
const originals=freeze.references.slice(0,2).flatMap(r=>read(r.path).results);
assert.equal(receipt.results.length,105);
const counts={programs:0,prefixes:0,revisions:0,historyChecks:0,supports:0,unavailableApplications:0,multipleApplications:0,applicationJoins:0,unavailableObservations:0,multipleObservations:0,observationJoins:0};
for(const [i,result] of receipt.results.entries()){
 const bytes=fs.readFileSync(root+'/'+result.file);assert.equal(sha(bytes),result.sha256);const d=JSON.parse(bytes),original=originals[i],history=new Map();
 assert.equal(d.program,original.id);assert.equal(result.program,original.id);assert.equal(d.prefixes.length,original.prefixes.length);
 for(const [j,p] of d.prefixes.entries()){
  assert.equal(p.prefix,j);for(const k of ['stateHash','saveHash','outputsHash'])assert.equal(p.identities[k],original.prefixes[j][k]);
  for(const r of p.reports){assert.equal(r.identity.saveHash,p.identities.saveHash);const key=r.eventId??'initial';if(history.has(key)){assert.deepEqual(r.rows,history.get(key));counts.historyChecks++;}else history.set(key,r.rows);
   for(const row of r.rows)for(const s of row.support){counts.supports++;if(!s.sources.length)counts.unavailableApplications++;if(s.sources.length>1)counts.multipleApplications++;
    assert.equal(s.status,s.sources.length===1?'unique recorded application':s.sources.length===0?'unavailable in selected history':'multiple recorded matches');
    assert.equal(s.id,`${s.support.namespace}:${s.support.identity}`);
    for(const a of s.sources){assert(r.at!==null&&BigInt(a.at)<=BigInt(r.at));assert.equal(a.application['Applied [5]'],true);assert.deepEqual(a.sample,a.application['Evidence [2]']['Sample [2]']);assert.equal(`${a.sample['SampleId [1]'].namespace}:${a.sample['SampleId [1]'].identity}`,s.id);counts.applicationJoins++;
     if(!a.observations.length)counts.unavailableObservations++;if(a.observations.length>1)counts.multipleObservations++;
     assert.equal(a.observationStatus,a.observations.length===1?'unique recorded observation':a.observations.length===0?'unavailable in selected history':'multiple recorded matches');
     for(const o of a.observations){assert.equal(o.observation['At [2]'],a.sample['At [4]']);assert.deepEqual(o.observation['Observation [1]'],a.sample['SampleId [1]']);for(const [x,y] of [['Opportunity [6]','Opportunity [5]'],['MonitoringComplete [7]','MonitoringComplete [6]'],['ReportedOutcome [8]','ReportedOutcome [7]']])assert.equal(o.observation[x],a.sample[y]);counts.observationJoins++;}
    }
   }counts.revisions++;
  }counts.prefixes++;
 }counts.programs++;
}
assert.deepEqual(counts,receipt.counts);assert.equal(counts.prefixes,1436);
fs.writeFileSync(root+'/verification.json',JSON.stringify({status:'PASS INDEPENDENT FULL SUPPORT ARTIFACT RECONCILIATION',counts,sources:freeze.sources.length,receiptHash:sha(fs.readFileSync(root+'/receipt.json')),scope:'Original order/prefix identities, source/artifact hashes, historical support equality, exact sample/observation field and status consistency. Native output/event joins belong to frozen writer, not re-executed here. Full conditional-episode ancestry and entry remain open.'},null,2)+'\n',{flag:'wx'});
console.log(counts);
