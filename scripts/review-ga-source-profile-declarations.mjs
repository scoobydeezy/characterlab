import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REV1.json',output='docs/planning/GA_SOURCE_PROFILE_DECLARATIONS_REVIEW_REV1.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
const field=(p,n,f)=>p.records.find(r=>r.name===n).fields.find(x=>x.name===f);
function validate(p){
 assert.equal(p.records.length,8);assert.equal(new Set(p.records.map(r=>r.name)).size,8);assert.deepEqual(p.newIdentityFamilies,[]);assert.deepEqual(p.storage,[]);
 assert.equal(p.identityAliases.SceneObjectReferent.namespace,1002);assert.equal(p.identityAliases.SceneObjectReferent.domainValidator,null);assert(p.identityAliases.SceneObjectReferent.compiler.includes('attention-scene-object'));assert.equal(p.identityAliases.EventRoleId.namespace,1003);
 assert.deepEqual(field(p,'PositionSceneItem','RoleMode').type.values,['Preserve','Unresolved']);assert.equal(field(p,'PositionSceneItem','Marker').type.name,'SceneObjectReferent');
 assert.equal(field(p,'PositionSceneFrame','Items').type.max,3);assert.equal(field(p,'PositionSceneDefinition','Frames').type.max,10);assert.equal(field(p,'TrialPanelDefinition','Frames').type.max,16);assert.equal(field(p,'PositionSceneDefinition','BindingSchema').type.name,'DefinitionId');
 for(const name of ['BodySelection','VisualSelection','BodyCue','VisualCue'])assert.equal(field(p,'ObservationUsePlan',name).type.name,'Boolean');
 assert.deepEqual(field(p,'ObservationUsePlan','GoalAssessment').type,{kind:'optional',value:{kind:'ref',name:'DefinitionId'}});
 assert.deepEqual(field(p,'GeneralObservationOriginal','Lane').type.values,['Current','Consequence']);
 for(const r of p.records)for(const f of r.fields)assert(!/Significance|Outcome|Baseline|Acquisition|Callback/.test(f.name));
 assert.deepEqual(p.invariants,original.invariants);assert(p.status.includes('OPEN'));
}
validate(original);const faults=[
 ['truth-marker-as-file',p=>field(p,'PositionSceneItem','Marker').type.name='PerceptualReferentId'],
 ['role-as-cause',p=>p.identityAliases.EventRoleId.namespace=1019],
 ['default-actor-on-absence',p=>field(p,'PositionSceneItem','RoleMode').type.values=['Preserve','Actor']],
 ['omit-competitor-bound',p=>field(p,'PositionSceneDefinition','Frames').type.max=9],
 ['couple-body-cue-to-selection',p=>field(p,'ObservationUsePlan','BodyCue').type.name='BodySelection'],
 ['authored-assessment-result',p=>field(p,'ObservationUsePlan','GoalAssessment').type.value.name='GoalOutcomeAssessment'],
 ['new-frame-identity',p=>p.newIdentityFamilies.push('FrameId')],
 ['callback-source',p=>p.records[0].fields.push({name:'Callback',type:{kind:'ref',name:'Text'}})],
 ['hidden-identity-order',p=>p.invariants.ordering='Sort by true marker identity']
];for(const [name,mutate]of faults){const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),undefined,name);}
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC SOURCE PROFILE REVIEW PASS',records:8,faults:faults.map(([name])=>({name,detected:true})),sources:[source,'scripts/review-ga-source-profile-declarations.mjs'].map(fp),limits:['No multi-item runtime source or public compiler is qualified by this structural review.','Exact profile schedules, work bounds, content membership and actual parent admission remain open.']},null,2)+'\n');
