import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const path='docs/planning/GA_VISUAL_PIPELINE_CARRIER_REV2.json',output='docs/planning/GA_VISUAL_CLAIM_TRANSPORT_REVIEW_REV2.json';assert(!fs.existsSync(output));
const prior=JSON.parse(fs.readFileSync('docs/planning/GA_VISUAL_PIPELINE_CARRIER_REV1.json')),current=JSON.parse(fs.readFileSync(path));
function validate(p){
 assert.equal(p.records.length,16);const records=structuredClone(p.records),selection=records.find(r=>r.name==='VisualSelectionInput');
 assert.deepEqual(selection.fields.pop(),{name:'Claims',type:{kind:'list',element:{kind:'ref',name:'CausalRoleEvidence'},min:0,max:3}});assert.deepEqual(records,prior.records);
 assert.equal(p.invariants.ownership,'One audit owns1143; phase130 AcquisitionFormationEvidence producer allocates the positive candidate acquisition; phase140 owner reuses it.');
 assert.equal(p.invariants.claims,'Visual selection consumes the exact completed phase15/125 claim batch; no replacement derivation or occurrence.');
}
validate(current);const faults=[['missing-actual-claims',p=>p.records.find(r=>r.name==='VisualSelectionInput').fields.pop()],['truth-in-place-of-claims',p=>p.records.find(r=>r.name==='VisualSelectionInput').fields.at(-1).type.element.name='WorldEventTruth'],['unbounded-claim-batch',p=>p.records.find(r=>r.name==='VisualSelectionInput').fields.at(-1).type.max=64],['full-source-encoder-read',p=>p.records.find(r=>r.name==='EncodingJoinInput').fields.push({name:'Source',type:{kind:'ref',name:'VisualOpportunityEvidence'}})],['owner-allocates-second-identity',p=>p.invariants.ownership='owner allocates acquisition']];
for(const [name,mutate]of faults){const p=structuredClone(current);mutate(p);assert.throws(()=>validate(p),name);}
for(const s of current.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'VISUAL CLAIM TRANSPORT REVIEW PASS; PUBLIC GATES OPEN',records:16,faults:faults.map(([name])=>({name,detected:true})),sources:[path,'scripts/review-ga-visual-claim-transport.mjs'].map(fp),limits:['Exact field delta and accepted allocation-stage correction only.','Public claim-producer authentication and selected-capability admission remain open.']},null,2)+'\n');
