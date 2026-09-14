import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const source='docs/planning/GA_IDENTITY_ROLE_CLOSURE_REV2.json',output='docs/planning/GA_IDENTITY_ROLE_REVIEW_REV2.json';assert(!fs.existsSync(output));const original=JSON.parse(fs.readFileSync(source));
function validate(p){
 assert.equal(p.recordCount,82);assert.equal(p.positions.length,86);assert.equal(p.boundaries.length,116);assert.equal(new Set(p.positions.map(x=>x.path)).size,86);
 for(const x of p.positions){assert.equal(x.mode,x.path.includes('[*]')||x.path.includes('{')?'FixedCompilerCollectionElement':'CanonicalRecordField');if(x.symbolicFamily){assert(!Object.hasOwn(x,'namespace'));assert.equal(x.symbolicFamily,x.identity);}}
 const byIdentity=name=>p.positions.filter(x=>x.identity===name);for(const x of byIdentity('CharacterId')){assert.equal(x.namespace,1002);assert.equal(x.validator,'validator/character-qualification');}
 for(const x of byIdentity('ObserverId')){assert.equal(x.namespace,1000);assert(!Object.hasOwn(x,'validator'));}
 assert.equal(byIdentity('SemanticReferentId').length,1);assert.deepEqual(byIdentity('SemanticReferentId')[0],{path:'MaintenanceGoalKey.GoalReferent',identity:'SemanticReferentId',mode:'CanonicalRecordField',namespace:1002,validator:'validator/maintenance-goal-qualification'});
 for(const [name,namespace] of Object.entries({DefinitionId:1027,ObservationId:1115,ExperienceId:1106,SelectionOccurrenceId:1143,TransitionKindId:1009,MutationAuthorityId:1025,ObservationChannelId:1005}))for(const x of byIdentity(name)){assert.equal(x.namespace,namespace);assert(!Object.hasOwn(x,'validator'));}
 for(const name of ['PerceptualReferentId','PerceptualEventReferentId']){assert.equal(byIdentity(name).length,0);const rows=p.boundaries.filter(x=>x.record===name);assert(rows.length>0);for(const x of rows){assert.equal(x.mode,'InheritedRecordRoles');assert.equal(x.source,name==='PerceptualReferentId'?'existing212':'existing213');}}
 for(const [path,record] of [['FormationGovernanceValue.AdmittedSources{key}','QualifiedFormationSource'],['FormationGovernanceValue.SuccessfulFormations{key}','QualifiedFormationSource']])assert(p.boundaries.some(x=>x.path===path&&x.record===record&&x.mode==='RecurseDeclaredRecord'));
 assert(p.boundaries.some(x=>x.path==='PositiveEventChildEvidence.Encoding'&&x.record==='RetainedEncodingUnit'&&x.mode==='RecurseDeclaredRecord')); for(const [name,id] of [['CurrentDetectionId',214],['CurrentEventDetectionId',215],['PerceptualTrackTransition',217],['PerceptualEventTransition',219],['EventRoleEvidence',223],['PerceivedBindingEvidence',224],['CausalRoleEvidence',240],['AttentionUnitKey',530],['SelectedEvidenceView',534]]){const b=p.boundaries.filter(x=>x.record===name);assert(b.length>0);for(const x of b)assert.equal(x.source,'existing'+id);} assert.deepEqual(p.stateMapKeyRoles,[]);assert(p.stateMapKeyDisposition.startsWith('Pending'));assert(p.status.includes('OPEN'));
 // Every inventoried field must retain a scalar, primitive/enum or record-boundary disposition.
 const all=new Set([...p.positions,...p.boundaries].map(x=>x.path));for(const row of [...original.positions,...original.boundaries])assert(all.has(row.path),'missing field disposition');
}
validate(original);const row=(p,id)=>p.positions.find(x=>x.identity===id);
const faults=[
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
].map(([name,mutate])=>{const p=structuredClone(original);mutate(p);assert.throws(()=>validate(p),name);return{name,rejected:true};});
for(const s of original.sources)assert.equal(createHash('sha256').update(fs.readFileSync(s.path)).digest('hex'),s.sha256);
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});fs.writeFileSync(output,JSON.stringify({status:'SYMBOLIC IDENTITY ROLE REVIEW PASS; PUBLIC GATES OPEN',records:82,identityPositions:86,recordBoundaries:116,faults,sources:[source,'scripts/review-ga-identity-role-closure-rev2.mjs'].map(fp),limits:['Structural crosswalk only; actual canonical role tables and domain/holder checks await final public closure.','RetainedEncodingUnit now recurses into declared fields; actual state-root keys remain pending.']},null,2)+'\n');
