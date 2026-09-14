import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const input='docs/planning/GA_PRIOR_CONCERN_STAGE_CLOSURE_REV1.json',output='docs/planning/GA_PRIOR_CONCERN_STAGE_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(input));
const get=(p,n)=>p.stages.find(s=>s.name===n);
function validate(p){
 assert.equal(p.stages.length,7);assert.equal(new Set(p.stages.map(s=>s.name)).size,7);assert.equal(p.records.length,3);assert.deepEqual(p.numericAllocations,[]);assert.deepEqual(p.newIdentityFamilies,[]);
 for(const [name,field,type]of [['PriorConcernAppraisalInput','Workspace','TaskWorkspace'],['PriorConcernProducerInput','Appraisal','TaskAppraisal'],['PriorConcernDeliveryInput','Delivery','FeedbackDelivery']])assert.deepEqual(p.records.find(r=>r.name===name)?.fields,[{name:'ObserverId',type:{kind:'ref',name:'ObserverId'}},{name:field,type:{kind:'ref',name:type}}]);
 for(const s of p.stages){assert.deepEqual(s.writes,[]);assert.deepEqual(s.route,[]);assert.equal(s.projection,'Required PRJ/IDN after exact event/output admission; nested CharacterId equals projected subject');for(const n of s.next){const t=get(p,n);assert(t||p.externalTargets.includes(n));if(t)assert(t.phase>=s.phase);}if(!['prior-concern-workspace','prior-concern-event-rank'].includes(s.name))assert.deepEqual(s.reads,[]);}
 for(const [name,phase,type,id]of [['workspace',40,381,1128],['appraisal',50,384,1129],['producer',50,388,1130]]){const s=get(p,'prior-concern-'+name);assert.equal(s.phase,phase);assert.equal(s.outputs.length,1);assert(s.outputs[0].endsWith('/'+type));assert(s.allocation.endsWith('/'+id));}
 assert.deepEqual(get(p,'prior-concern-workspace').reads,['Existing subject TaskCommitmentState','Existing subject MeasurementPredictionState']);
 assert.deepEqual(get(p,'prior-concern-producer').future,['encoding-concern-delivery','recall-concern-delivery']);assert(get(p,'prior-concern-producer').futureGate.includes('strict later instant'));
 for(const kind of ['encoding','recall']){const s=get(p,kind+'-concern-delivery');assert.equal(s.phase,15);assert.equal(s.allocation,'None');assert.deepEqual(s.outputs,['FeedbackDelivery']);assert.deepEqual(s.next,[]);assert.equal(s.joinReadiness,'Actual completed delivery, not allocated parent');assert.equal(s.consumer,kind==='encoding'?'prior-concern-visual-encoding':'prior-concern-event-rank');}
 const enc=get(p,'prior-concern-visual-encoding'),rank=get(p,'prior-concern-event-rank');assert.equal(enc.phase,40);assert.equal(rank.phase,40);assert.equal(enc.input,'PriorConcernEncodingInput');assert.equal(rank.input,'PriorConcernRecallInput');assert.equal(enc.allocation,'None');assert.equal(rank.allocation,'None');assert.deepEqual(enc.outputs,['PriorConcernEncodingEvaluation','PositiveVisualCandidate']);assert.deepEqual(rank.outputs,['PriorConcernRecallEvaluation']);assert.deepEqual(rank.reads,['GeneralEpisodeState','GeneralAssociationState','GeneralPresentationState']);assert.equal(rank.readGate,'AvailableCue');
 assert.equal(p.join.additionalParent,'Exact completed consumer-specific delivery');assert(p.join.expectedInput.includes('before PRJ and content reads'));assert(p.join.consumption.includes('One delivery per consumer'));assert(p.join.consumption.includes('transactional once-only'));assert(p.join.persistence.includes('complete-prefix replay'));assert(p.join.nestedTruth.startsWith('No TaskConcern/Appraisal/Workspace/forecast'));
 assert(p.variant.selection.includes('replace'));assert(p.variant.disabled.includes('checks remain active'));assert(p.variant.empty.includes('still complete'));assert.equal(p.work.producerInstant,3);assert.equal(p.work.receivingOverheadMaximum,2);assert.equal(p.work.wholeModelCeiling,null);
}
validate(original);
const faults=[
 ['workspace-phase-drift',p=>get(p,'prior-concern-workspace').phase=50],
 ['invent-feedback-occurrence',p=>p.newIdentityFamilies.push('FeedbackId')],
 ['source-reads-physiology',p=>get(p,'prior-concern-workspace').reads.push('LocalReserveState')],
 ['affect-state-write',p=>get(p,'prior-concern-producer').writes.push('AffectState')],
 ['late-delivery',p=>get(p,'encoding-concern-delivery').phase=50],
 ['allocated-parent-is-completed',p=>get(p,'recall-concern-delivery').joinReadiness='Allocated parent sufficient'],
 ['shared-consumed-delivery',p=>get(p,'prior-concern-producer').future=['encoding-concern-delivery']],
 ['encoder-full-workspace',p=>get(p,'prior-concern-visual-encoding').input='TaskWorkspace'],
 ['unavailable-recall-reads',p=>get(p,'prior-concern-event-rank').readGate='Always'],
 ['carry-as-learning',p=>get(p,'encoding-concern-delivery').route=['route/character-learning']],
 ['cached-save-proof',p=>p.join.persistence='Private map restored'],
 ['identity-before-authentication',p=>p.join.expectedInput='Checked after PRJ and content reads'],
 ['replay-numeric-disabled',p=>p.variant.disabled='Skip checks when disabled'],
 ['claim-whole-work-ceiling',p=>p.work.wholeModelCeiling=25],
 ];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});for(const s of original.sources)assert.deepEqual(fp(s.path),s);
fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC PRIOR CONCERN STAGE REVIEW PASS',records:3,stages:7,faults:faults.map(([name])=>({name,rejected:true})),sources:[input,'scripts/review-ga-prior-concern-stages.mjs'].map(fp),limits:['Declaration consistency only; AJB public controls remain frozen, not passed.','Whole model work, canonical codecs, allocation, actual producer binding and persistence remain open.']},null,2)+'\n');
