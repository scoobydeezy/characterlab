import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_REQUESTED_SOURCE_CARRIER_REV1.json',output='docs/planning/GA_REQUESTED_SOURCE_CARRIER_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
const field=(p,n,f)=>p.records.find(r=>r.name===n).fields.find(x=>x.name===f);
function validate(p){
 assert.equal(p.records.length,5);assert.equal(new Set(p.records.map(r=>r.name)).size,5);
 assert.deepEqual(p.storage,[]);assert.deepEqual(p.newIdentityFamilies,[]);assert.deepEqual(p.truthReadsFromPerception,[]);
 for(const r of p.records)assert(!r.fields.some(f=>/World|Truth|BindingId|Reason|Physical|Experience/.test(f.name)));
 assert.deepEqual(p.records.find(r=>r.name==='TrialPanelUnavailableObservation').fields.map(f=>f.name),['Observation','Observer','At','TransformationVersion']);
 for(const name of ['Body','Panel','Visual'])assert.equal(field(p,'CompletedRequestedSamples',name).type.kind,'optional');
 assert.deepEqual(field(p,'CompletedRequestedSamples','Panel').type.value.alternatives.map(r=>r.name),['TrialPanelPresentObservation','TrialPanelUnavailableObservation']);
 assert.equal(field(p,'CompletedRequestedSamples','Request').type.name,'GeneralSourceSamplingRequest');
 assert.deepEqual(field(p,'CompletedRequestedSamples','EventDetection').type,{kind:'optional',value:{kind:'ref',name:'CurrentEventDetectionId'}});
 assert.equal(field(p,'RequestedBodySamples','Samples').type.element.name,'EmbodiedSample');assert.equal(field(p,'RequestedBodySamples','Samples').type.min,1);assert.equal(field(p,'RequestedBodySamples','Samples').type.max,9);
 for(const [k,v]of Object.entries(original.invariants))assert.equal(p.invariants[k],v);
 assert(p.status.includes('OPEN'));
}
validate(original);
const faults=[
 ['absence-reason',p=>p.records[0].fields.push({name:'Reason',type:{kind:'ref',name:'VersionText'}})],
 ['mandatory-unsampled-panel',p=>field(p,'CompletedRequestedSamples','Panel').type=field(p,'CompletedRequestedSamples','Panel').type.value],
 ['drop-request-binding',p=>field(p,'CompletedRequestedSamples','Request').type.name='OriginalAddress'],
 ['premature-experience',p=>p.records[1].fields.push({name:'Experience',type:{kind:'ref',name:'ExperienceId'}})],
 ['truth-access',p=>p.truthReadsFromPerception.push('WorldEventTruth')],
 ['new-wrapper-identity',p=>p.newIdentityFamilies.push('SourceBatchId')],
 ['event-as-feature',p=>field(p,'CompletedRequestedSamples','EventDetection').type.value.name='EventFeatureObservationId'],
 ['zero-request-body',p=>field(p,'RequestedBodySamples','Samples').type.min=0],
 ['unsampled-clears-context',p=>p.invariants.unsampled='Clear active context']
];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),undefined,name);}
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC REQUESTED SOURCE REVIEW PASS',records:5,faults:faults.map(([name])=>({name,detected:true})),sources:[source,'scripts/review-ga-requested-source-carrier.mjs'].map(fp),limits:['Structural inventory only. Branch equations, real source admission and public identity/PRJ/owner enforcement remain unqualified.']},null,2)+'\n');
