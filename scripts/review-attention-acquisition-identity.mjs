import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const dir='docs/planning/';
const output=dir+'ATTENTION_ACQUISITION_IDENTITY_PROPAGATION_REV1.json';
const receipt=dir+'ATTENTION_ACQUISITION_IDENTITY_PROPAGATION_REVIEW_REV1.json';
for(const path of [output,receipt]) assert(!fs.existsSync(path),'preserve prior receipt');
const wrappers=dir+'ATTENTION_MEMORY_WRAPPER_INVENTORY_REV2.json';
const roles=dir+'ATTENTION_MEMORY_IDENTITY_ROLES_REV2.json';
const w=JSON.parse(fs.readFileSync(wrappers));
const r=JSON.parse(fs.readFileSync(roles));
const field=(record,name)=>w.records.find(x=>x.name===record)?.fields.find(x=>x.name===name);
const refs=[];
for(const record of w.records) for(const f of record.fields)
 if(f.type.kind==='ref'&&f.type.name==='SelectionOccurrenceId') refs.push(record.name+'.'+f.name);
assert.deepEqual(refs,['RetainedEncoding.Selection','PresentationEntry.Selection','RecallScore.Selection']);
for(const record of ['RetainedEncoding','PresentationEntry','RecallScore']) {
 assert.equal(field(record,'Selection').type.name,'SelectionOccurrenceId');
 assert.equal(r.fields.find(x=>x.record===record&&x.field==='Selection').validation.family,'SelectionOccurrenceId');
}
for(const record of ['RetainedEncoding','EncodingEvaluation','SpatialPreparation'])
 assert.equal(field(record,'Calibration').type.name,'DefinitionId','preserve accepted calibration correction');

const delta={
 status:'ACCEPTED ROLE PROPAGATION PLAN; NOT A COMPLETE SCHEMA OR ALLOCATION INPUT',
 acceptedRole:'AcquisitionOccurrenceId',
 numericNamespace:null,
 changes:[
  {record:'RetainedEncoding',operation:'add',field:'Acquisition',type:'AcquisitionOccurrenceId',purpose:'durable address'},
  {record:'RetainedEncoding',operation:'preserve',field:'Selection',type:'SelectionOccurrenceId',purpose:'source provenance only'},
  {record:'PresentationEntry',operation:'replace',field:'Selection',withField:'Acquisition',type:'AcquisitionOccurrenceId',purpose:'presentation target'},
  {record:'RecallScore',operation:'replace',field:'Selection',withField:'Acquisition',type:'AcquisitionOccurrenceId',purpose:'ranked acquisition target'},
 ],
 storageAddress:['qualified CharacterId','AcquisitionOccurrenceId'],
 peerKinds:['event-continuant','interoceptive'],
 bodyGroupAddress:['AcquisitionOccurrenceId','InteroceptiveSignalId'],
 commitCondition:'nonempty admitted formation AND successful whole-instant settlement',
 noCommittedOccurrence:['empty selection','unavailable formation','zero formation','rejected formation','rolled-back settlement'],
 sourceCardinality:{scope:'first bounded profile only',maximumInitialAcquisitions:1},
 sourceLookupAuthority:false,
 additionalEpisodeOrGroupIdentities:[],
 acceptedMeasurementMemoryMigration:false,
 pending:[
  'exact occurrence-bearing formation/learning-evidence carrier; no redundant formation identity',
  'body typed payload and producer admission;1143 reuse is not implied for a new producer',
  'owner and read-domain propagation through retention, recollection, consolidation and pruning',
  'shared family reconciliation and complete rollback/restore',
  'conditional output/allocation counts and total work budgets; old totals are historical',
  'symbolic declarations and field-role compiler closure',
  'whole shape, separate numeric review, model packaging and public proof',
 ],
};
function review(p){
 assert.equal(p.status,delta.status);
 assert.equal(p.acceptedRole,'AcquisitionOccurrenceId');assert.equal(p.numericNamespace,null);
 assert.deepEqual(p.changes,delta.changes);
 assert.deepEqual(p.storageAddress,['qualified CharacterId','AcquisitionOccurrenceId']);
 assert.deepEqual(p.peerKinds,['event-continuant','interoceptive']);
 assert.deepEqual(p.bodyGroupAddress,['AcquisitionOccurrenceId','InteroceptiveSignalId']);
 assert.equal(p.commitCondition,'nonempty admitted formation AND successful whole-instant settlement');
 assert.deepEqual(p.noCommittedOccurrence,delta.noCommittedOccurrence);
 assert.deepEqual(p.sourceCardinality,{scope:'first bounded profile only',maximumInitialAcquisitions:1});
 assert.equal(p.sourceLookupAuthority,false);assert.deepEqual(p.additionalEpisodeOrGroupIdentities,[]);
 assert.equal(p.acceptedMeasurementMemoryMigration,false);assert.deepEqual(p.pending,delta.pending);
}
review(delta);
const faults=[];
for(const [name,mutate] of [
 ['selection-is-durable-address',p=>p.storageAddress[1]='SelectionOccurrenceId'],
 ['drop-selection-provenance',p=>p.changes.splice(1,1)],
 ['stale-recall-address',p=>p.changes[3].type='SelectionOccurrenceId'],
 ['commit-before-settlement',p=>p.commitCondition='positive selection'],
 ['global-one-to-one',p=>p.sourceCardinality.scope='global invariant'],
 ['source-archive-resolver',p=>p.sourceLookupAuthority=true],
 ['extra-episode-id',p=>p.additionalEpisodeOrGroupIdentities.push('MemoryEpisodeId')],
 ['measurement-migration',p=>p.acceptedMeasurementMemoryMigration=true],
 ['premature-number',p=>p.numericNamespace=999999],
 ['hide-output-budget-gate',p=>p.pending.splice(4,1)],
]){const p=structuredClone(delta);mutate(p);assert.throws(()=>review(p),undefined,name);faults.push({name,detected:true});}
const hash=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify(delta,null,2)+'\n');
fs.writeFileSync(receipt,JSON.stringify({status:'STATIC PROPAGATION CHECK PASS; NO RUNTIME QUALIFICATION',existingDirectSelectionFields:refs,plannedChanges:delta.changes.length,faults,sources:[wrappers,roles,output,dir+'GENERAL_ATTENTION_ACQUISITION_IDENTITY_RESOLUTION.md','scripts/review-attention-acquisition-identity.mjs'].map(hash),limits:['Exact source fields/roles and calibration preservation inspected.','Corruptions test this bounded edit plan, not a production compiler or allocation.','Older wrapper and role packets remain historical; no integrated successor packet is claimed.']},null,2)+'\n');
console.log(JSON.stringify({existingDirectSelectionFields:refs.length,plannedChanges:delta.changes.length,faults:faults.length,status:'PASS; static scope only'}));
