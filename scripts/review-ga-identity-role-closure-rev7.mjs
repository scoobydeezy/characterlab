import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV7.json',output='docs/planning/GA_IDENTITY_ROLE_REVIEW_REV7.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.recordCount,129);assert.equal(p.positions.length,127);assert.equal(p.boundaries.length,185);assert.equal(new Set(p.positions.map(x=>x.path)).size,127);
 for(const x of p.positions){assert.equal(x.mode,p.stateMapKeyRoles.some(r=>x.path===r.root+'.'+r.field+'{key}')?'StateMapKey':x.path.includes('[*]')||x.path.includes('{')?'FixedCompilerCollectionElement':'CanonicalRecordField');if(x.symbolicFamily){assert(!Object.hasOwn(x,'namespace'));assert.equal(x.symbolicFamily,x.identity);}}
 const byIdentity=name=>p.positions.filter(x=>x.identity===name);for(const x of byIdentity('CharacterId')){assert.equal(x.namespace,1002);assert.equal(x.validator,'validator/character-qualification');}
 for(const x of byIdentity('ObserverId')){assert.equal(x.namespace,1000);assert(!Object.hasOwn(x,'validator'));}
 assert.equal(byIdentity('SemanticReferentId').length,1);assert.deepEqual(byIdentity('SemanticReferentId')[0],{path:'MaintenanceGoalKey.GoalReferent',identity:'SemanticReferentId',mode:'CanonicalRecordField',namespace:1002,validator:'validator/maintenance-goal-qualification'});
 for(const [name,namespace] of Object.entries({ConcernOccurrenceId:1130,DefinitionId:1027,ObservationId:1115,ExperienceId:1106,SelectionOccurrenceId:1143,TransitionKindId:1009,MutationAuthorityId:1025,ObservationChannelId:1005}))for(const x of byIdentity(name)){assert.equal(x.namespace,namespace);assert(!Object.hasOwn(x,'validator'));}
 for(const name of ['PerceptualReferentId','PerceptualEventReferentId']){assert.equal(byIdentity(name).length,0);const rows=p.boundaries.filter(x=>x.record===name);assert(rows.length>0);for(const x of rows){assert.equal(x.mode,'InheritedRecordRoles');assert.equal(x.source,name==='PerceptualReferentId'?'existing212':'existing213');}}
 for(const [path,record] of [['FormationGovernanceValue.AdmittedSources{key}','QualifiedFormationSource'],['FormationGovernanceValue.SuccessfulFormations{key}','QualifiedFormationSource']])assert(p.boundaries.some(x=>x.path===path&&x.record===record&&x.mode==='RecurseDeclaredRecord'));
 assert(p.boundaries.some(x=>x.path==='PositiveEventChildEvidence.Encoding'&&x.record==='RetainedEncodingUnit'&&x.mode==='RecurseDeclaredRecord')); for(const [name,id] of [['CurrentDetectionId',214],['CurrentEventDetectionId',215],['PerceptualTrackTransition',217],['PerceptualEventTransition',219],['EventRoleEvidence',223],['PerceivedBindingEvidence',224],['CausalRoleEvidence',240],['AttentionUnitKey',530],['SelectedEvidenceView',534]]){const b=p.boundaries.filter(x=>x.record===name);assert(b.length>0);for(const x of b)assert.equal(x.source,'existing'+id);} assert.deepEqual(p.stateMapKeyRoles,JSON.parse(fs.readFileSync('docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV2.json')).stateMapKeyRoles);assert(p.stateMapKeyDisposition.startsWith('Symbolic'));assert(p.status.includes('OPEN'));
 // Every inventoried field must retain a scalar, primitive/enum or record-boundary disposition.
 const all=new Set([...p.positions,...p.boundaries].map(x=>x.path));for(const row of [...original.positions,...original.boundaries])assert(all.has(row.path),'missing field disposition');
}
const structuralValidate=validate;function validateTransport(p){structuralValidate(p);assert(p.boundaries.some(x=>x.path==='GeneralSamplingInput.World'&&x.record==='WorldEventTruth'&&x.mode==='InheritedRecordRoles'&&x.source==='existing210'));for(const n of ['GeneralTrackingInput','GeneralBindingInput','GeneralFreezeInput']){assert(p.boundaries.some(x=>x.path===n+'.Samples'&&x.record==='CompletedRequestedSamples'&&x.mode==='RecurseDeclaredRecord'));assert(p.boundaries.some(x=>x.path===n+'.Use'&&x.record==='ObservationUsePlan'&&x.mode==='RecurseDeclaredRecord'));}}const priorValidate=validateTransport;function validatePhysical(p){priorValidate(p);for(const [name,ns]of [['SceneObjectReferent',1002],['EventRoleId',1003]]){const rows=p.positions.filter(x=>x.identity===name);assert.equal(rows.length,1);assert.equal(rows[0].namespace,ns);assert(!Object.hasOwn(rows[0],'validator'));}assert(p.boundaries.some(x=>x.path==='LocalReserveState.Anchors{key}'&&x.record==='LocalReserveKey'&&x.mode==='RecurseDeclaredRecord'));assert(!p.positions.some(x=>x.path==='LocalReserveState.Anchors{key}'));assert(p.positions.some(x=>x.path==='LocalReserveKey.Reserve'&&x.symbolicFamily==='LocalReserveId'&&!Object.hasOwn(x,'namespace')));for(const [name,id] of [['ReserveAnchor',454],['ReserveReplenishmentResult',479]]){const rows=p.boundaries.filter(x=>x.record===name);assert(rows.length>0);for(const x of rows){assert.equal(x.mode,'InheritedRecordRoles');assert.equal(x.source,'existing'+id);}}}validatePhysical(original);const row=(p,id)=>p.positions.find(x=>x.identity===id);
const faults=[
 ['world-without-inherited-roles',p=>p.boundaries.find(x=>x.path==='GeneralSamplingInput.World').source='opaque-world'],
 ['source-observer-is-observation',p=>p.positions.find(x=>x.path==='GeneralTrackingInput.ObserverId').namespace=1115],
 ['opaque-source-use-plan',p=>p.boundaries.find(x=>x.path==='GeneralFreezeInput.Use').mode='InheritedRecordRoles'],
 ['scene-object-as-file',p=>row(p,'SceneObjectReferent').namespace=1112],
 ['event-role-as-cause',p=>row(p,'EventRoleId').namespace=1019],
 ['scene-object-as-character',p=>row(p,'SceneObjectReferent').validator='validator/character-qualification'],
 ['physical-key-as-scalar',p=>p.boundaries.find(x=>x.path==='LocalReserveState.Anchors{key}').mode='StateMapKey'],
 ['physical-as-signal',p=>p.positions.find(x=>x.path==='LocalReserveKey.Reserve').symbolicFamily='InteroceptiveSignalId'],
 ['parallel-anchor',p=>p.boundaries.find(x=>x.record==='ReserveAnchor').source='new-anchor'],
 ['state-key-as-record-field',p=>p.positions.find(x=>x.mode==='StateMapKey').mode='CanonicalRecordField'],
 ['reuse-appraisal-id-for-concern',p=>row(p,'ConcernOccurrenceId').namespace=1129],
 ['opaque-retained-encoding',p=>p.boundaries.find(x=>x.path==='PositiveEventChildEvidence.Encoding').mode='InheritedRecordRoles'],
 ['unit-key-as-namespace',p=>p.boundaries.find(x=>x.record==='AttentionUnitKey').source='namespace530'],
 ['character-is-observer',p=>row(p,'CharacterId').namespace=1000],
 ['namespace-only-character',p=>delete row(p,'CharacterId').validator],
 ['goal-is-generic-referent',p=>delete row(p,'SemanticReferentId').validator],
 ['observation-is-experience',p=>row(p,'ObservationId').namespace=1106],
 ['collection-as-scalar-role',p=>p.positions.find(x=>x.mode==='FixedCompilerCollectionElement').mode='CanonicalRecordField'],
 ['allocate-new-result-as-old-evid',p=>row(p,'GoalOutcomeAssessmentId').namespace=1116],
 ['event-file-as-scalar',p=>p.boundaries.find(x=>x.record==='PerceptualEventReferentId').mode='CanonicalRecordField'],
 ['drop-composite-source-key',p=>p.boundaries=p.boundaries.filter(x=>x.path!=='FormationGovernanceValue.AdmittedSources{key}')],
 ['claim-unresolved-state-key-roles',p=>p.stateMapKeyDisposition='CLOSED']
].map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validatePhysical(p),name);return{name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC IDENTITY ROLE REVIEW PASS; PUBLIC GATES OPEN',records:129,identityPositions:127,recordBoundaries:185,faults,sources:[source,'scripts/review-ga-identity-role-closure-rev7.mjs'].map(fp),limits:['Structural crosswalk only; actual canonical role tables and domain/holder checks await final public closure.','RetainedEncodingUnit now recurses into declared fields; six new-root keys are symbolic; actual compiler checks remain pending.']},null,2)+'\n');
