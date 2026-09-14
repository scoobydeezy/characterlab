import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_PRIOR_FEEDBACK_CARRIER_REV1.json',output='docs/planning/GA_PRIOR_FEEDBACK_CARRIER_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 const records=new Map(p.records.map(r=>[r.name,r])),names=n=>records.get(n).fields.map(f=>f.name),type=(n,f)=>records.get(n).fields.find(x=>x.name===f).type;
 assert.equal(records.size,8);assert.deepEqual(p.storage,[]);assert.deepEqual(p.newIdentityFamilies,[]);
 assert.deepEqual(names('ActualConcernCarry'),['Concern','Subject','SourceAt','Response']);assert.equal(type('ActualConcernCarry','Concern').name,'ConcernOccurrenceId');assert.equal(type('ActualConcernCarry','Response').name,'TaskConcernResponse');
 assert.deepEqual(names('NoConcernAvailable'),['Subject','SourceAt','Reason']);assert.deepEqual(type('NoConcernAvailable','Reason').values,['NoSelectedTask']);
 assert.deepEqual(names('FeedbackDelivery'),['TargetOriginal','TargetAt','Value']);assert.equal(type('FeedbackDelivery','TargetOriginal').name,'OriginalAddress');
 assert.deepEqual(type('FeedbackDelivery','Value'),{kind:'union',alternatives:[{kind:'ref',name:'ActualConcernCarry'},{kind:'ref',name:'NoConcernAvailable'}]});
 assert.equal(type('PriorConcernEncodingInput','Selected').name,'EncodingJoinInput');assert.equal(type('PriorConcernRecallInput','Cue').name,'CueEvidence');
 for(const n of ['PriorConcernEncodingInput','PriorConcernEncodingEvaluation','PriorConcernRecallInput','PriorConcernRecallEvaluation'])assert.equal(type(n,'Feedback').name,'FeedbackDelivery');
 assert.deepEqual(type('PriorConcernModulation','SourceStatus').values,['KnownIntensity','Unavailable','NoSelectedTask']);assert.equal(type('PriorConcernModulation','ResidualMultiplier').name,'UnitRational');assert.equal(type('PriorConcernModulation','AssociativeWeight').name,'OneToTwoRational');
 assert(p.external.ConcernOccurrenceId.startsWith('existing1130'));assert.equal(p.external.TaskConcernResponse,'existing386');
}
validate(original);const record=(p,n)=>p.records.find(r=>r.name===n),field=(p,n,f)=>record(p,n).fields.find(x=>x.name===f);
const faults=[
 ['nested-forecast-carry',p=>record(p,'ActualConcernCarry').fields.push({name:'Forecast',type:{kind:'ref',name:'Belief'}})],
 ['goal-is-concern',p=>field(p,'ActualConcernCarry','Concern').type.name='GoalOutcomeAssessmentId'],
 ['invented-unavailable-occurrence',p=>record(p,'NoConcernAvailable').fields.push({name:'Concern',type:{kind:'ref',name:'ConcernOccurrenceId'}})],
 ['new-delivery-identity',p=>p.newIdentityFamilies.push('FeedbackOccurrenceId')],
 ['source-reaches-encoder',p=>field(p,'PriorConcernEncodingInput','Selected').type.name='VisualOpportunityEvidence'],
 ['implicit-delivery-cache',p=>field(p,'PriorConcernRecallInput','Feedback').type.name='ConcernOccurrenceId'],
 ['known-zero-status-collapse',p=>field(p,'PriorConcernModulation','SourceStatus').type.values=['Unavailable','NoSelectedTask']],
 ['persistent-affect-inferred',p=>p.storage.push('ActualConcernCarry')]
];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),undefined,name);}
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC PRIOR FEEDBACK CARRIER REVIEW PASS',records:8,faults:faults.map(([name])=>({name,detected:true})),sources:[source,'scripts/review-ga-prior-feedback-carrier.mjs'].map(fp),limits:['Structural carrier review only; actual same-run parent, subject and output authentication remain public gates.']},null,2)+'\n');
