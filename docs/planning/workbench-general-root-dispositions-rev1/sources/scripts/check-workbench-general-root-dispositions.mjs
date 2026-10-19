import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';

const root='docs/planning/workbench-general-root-dispositions-rev1';
const parent='docs/planning/workbench-general-architecture-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
const dispositions=[
 {root:'268',schema:'CharacterObserverBindingState',kind:'identity-support',next:'Retain as identity/projection support; do not map to Self or Person.',allocation:'CAMPAIGN2_ALLOCATION_TABLE.json'},
 {root:'302',schema:'RegulatoryAdaptationState',kind:'candidate-correspondence',next:'RegAdapt correspondence supported by allocation and canonical embodied-state ownership; implement with explicit inherited authority.',allocation:'CAMPAIGN2_ALLOCATION_TABLE.json'},
 {root:'362',schema:'MeasurementPredictionState',kind:'bounded-expectation-review',next:'Retain diagnostic-reading prediction scope and sole belief/expectation authority. Resolve Expect versus Beliefs correspondence explicitly before adding a box.',allocation:'MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json'},
 {root:'373',schema:'TaskCommitmentState',kind:'candidate-correspondence',next:'Prospection correspondence supported by prospective commitment ownership; preserve distinct task lifecycle and schema successors.',allocation:'TASK_COMMITMENT_ALLOCATION_TABLE.json'},
 {root:'581',schema:'FormationGovernanceState',kind:'protocol-support',next:'Retain formation/loss protocol metadata separately from remembered content; do not aggregate into Episodic.',allocation:'GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json'},
 {root:'649',schema:'LocalReserveState',kind:'physical-source',next:'Expose world-side physical source scope separately; no automatic Phys or Intero correspondence or cognitive evidence admission.',allocation:'GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json'},
];
const sources=[
 'scripts/check-workbench-general-root-dispositions.mjs',
 'CHARACTER_ARCHITECTURE.md',
 'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md',
 'docs/formal/OPEN_DECISIONS.md',
 'docs/formal/FORMATION_GOVERNANCE_COMPONENT.md',
 'docs/formal/FORMATION_SETTLEMENT_COMPONENT.md',
 'docs/formal/LOCAL_RESERVE_REPLENISHMENT_PRODUCTION_COMPONENT.md',
 'docs/formal/LOCAL_RESERVE_SAMPLE_BRIDGE_COMPONENT.md',
 'docs/formal/MEASUREMENT_PREDICTION.md',
 'docs/formal/TASK_COMMITMENTS.md',
 'docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json',
 'docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json',
 'src/campaign3/generalWriteScope.ts',
 ...new Set(dispositions.map(d=>'docs/formal/'+d.allocation)),
 parent+'/receipt.json',
];
assert(!fs.existsSync(root),'Never overwrite a retained audit');
const receipt=JSON.parse(fs.readFileSync(parent+'/receipt.json'));
assert.deepEqual(receipt.unmappedRoots,dispositions.map(d=>d.root));
function records(value){return value&&typeof value==='object'?[value,...Object.values(value).flatMap(records)]:[];}
for(const d of dispositions){
 const table=JSON.parse(fs.readFileSync('docs/formal/'+d.allocation));
 assert(records(table).some(v=>String(v.typeId)===d.root&&v.name===d.schema),d.schema);
}
const counts=Object.fromEntries(dispositions.map(d=>[d.root,{prefixes:0,pathObservations:0,reads:0,mutations:0,changes:0,present:0}]));
const inputs=[];let prefixes=0;
for(const model of receipt.results){
 const path=parent+'/'+model.path,bytes=fs.readFileSync(path);assert.equal(sha(bytes),model.sha256);
 const reports=JSON.parse(gunzipSync(bytes));
 for(const report of reports){
  assert.equal(report.version,'general-canonical-participation/0.1');
  const seen=new Set();
  for(const row of report.rows.filter(r=>!r.binding)){
   const count=counts[row.root];assert(count,row.root);seen.add(row.root);count.pathObservations++;
   for(const key of ['reads','mutations','changes']){assert(Number.isSafeInteger(row[key])&&row[key]>=0);count[key]+=row[key];}
   if(row.presentAtRevision)count.present++;
  }
  for(const id of seen)counts[id].prefixes++;
  prefixes++;
 }
 inputs.push({path,sha256:sha(bytes)});
}
assert.equal(prefixes,568);assert.equal(inputs.length,43);
assert.equal(Object.values(counts).reduce((n,c)=>n+c.pathObservations,0),receipt.counts.unmappedPathObservations);
fs.mkdirSync(root,{recursive:true});
const frozen=sources.map(path=>{
 const bytes=fs.readFileSync(path),dest=root+'/sources/'+path;
 fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});
 return {path,sha256:sha(bytes)};
});
const result={status:'PASS RETAINED UNMAPPED ROOT CENSUS',models:inputs.length,prefixes,
 dispositions:dispositions.map(d=>({...d,counts:counts[d.root]})),inputs,sources:frozen,
 scope:'Inventory and local implementation dispositions only. Counts sum cumulative reports across prefixes, not unique events across runs. Existing eight-root UI mapping unchanged. Source excerpts retain their original historical acceptance limits; this audit neither reactivates superseded gates nor promotes contracts. No psychological verdict, new topology, observer-language or complete architecture qualification.'};
fs.writeFileSync(root+'/receipt.json',JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,models:inputs.length,prefixes,counts}));
