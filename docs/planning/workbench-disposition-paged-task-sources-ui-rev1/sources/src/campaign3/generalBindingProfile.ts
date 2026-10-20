/** Concrete declaration candidate beneath general-attention-carrier/0.1-candidate.
 * No ModelIdentity or execution budget is frozen by this construction module. */
import topology from '../../docs/planning/GA_COMPOSED_LOGICAL_TOPOLOGY_REV2.json';
import allocation from '../../docs/formal/GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json';
import writeAllocation from '../../docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_ALLOCATION_TABLE.json';
import members from '../../docs/planning/GA_REGISTRY_MEMBER_SHAPE_REV1.json';
import writePolicy from '../../docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json';
import attentionRoles from '../../docs/formal/ATTENTION_ALLOCATION_TABLE.json';
import embodiedRoles from '../../docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json';
import receivingRoles from '../../docs/formal/EMBODIED_RECEIVING_ALLOCATION_TABLE.json';
import predictionRoles from '../../docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json';
import taskRoles from '../../docs/formal/TASK_COMMITMENT_CORRECTION_ALLOCATION_TABLE.json';
import cognitiveRoles from '../../docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,record,list,set,text,unsigned as u,typedIdentifier as tid,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {statePathPatternValue,type StatePathPattern} from '../substrate/state';
import {generalAttentionSupportedSchemas,decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalRegistrationTemplates} from './generalRegistration';
import type {GeneralAccessorDeclaration} from './generalAccessors';

export const generalId=(ns:number,s:string)=>tid(ns,text(s));
export const generalDefinitionId=(name:string)=>generalId(1027,'definition/general-attention/'+name);
export const generalContentId=(name:string)=>generalId(1038,'content/general-attention/'+name);
export const generalSubject=()=>({observer:generalId(1000,'observer/general-attention-subject'),character:semanticReferentFromAuthoredContent(generalContentId('subject'))});
const schemas=generalAttentionSupportedSchemas();
export function generalRecord(type:number,values:readonly CanonicalValue[]|ReadonlyMap<bigint,CanonicalValue>){
 const schema=schemas.find(s=>s.typeId===BigInt(type)&&s.schemaVersion===1n);if(!schema)throw Error('GA_UNKNOWN_SCHEMA');
 return record(schema,values instanceof Map?values:new Map((values as readonly CanonicalValue[]).map((v,i)=>[BigInt(i+1),v])));
}
const r=generalRecord,d=generalDefinitionId,id=generalId;
export const generalSchemaRef=(type:bigint|number)=>r(254,[u(type),u(1)]);
export function generalPattern(root:number,subject?:CanonicalValue,field=1):StatePathPattern {
 return {rootStateTypeId:BigInt(root),fieldId:BigInt(field),selectors:[subject===undefined?{kind:'wildcard',selectorKind:'mapKey'}:{kind:'exact',selector:{kind:'mapKey',key:subject}}]};
}
export const generalPurposes=['BodySelection','VisualSelection','Spatial','Encoding','BodyRecall','GoalBaselineRecall','EventRecall','GoalQualification','Retention','Association','GraphRetention','Feedback','Workspace','Concern'] as const;
export const generalPurposeDefinitions={BodySelection:[696,'body-selection'],VisualSelection:[519,'visual-selection'],Spatial:[687,'spatial'],Encoding:[688,'encoding'],BodyRecall:[691,'body-recall'],GoalBaselineRecall:[691,'goal-baseline-recall'],EventRecall:[690,'event-recall'],GoalQualification:[697,'goal-qualification'],Retention:[692,'retention'],Association:[689,'association'],GraphRetention:[693,'graph-retention'],Feedback:[694,'feedback'],Workspace:[378,'workspace'],Concern:[385,'concern']} as const;
type Purpose=typeof generalPurposes[number];
export interface GeneralImplementation {readonly version:string;readonly source:string;readonly purposes:readonly Purpose[]}
const impl=(source:string,version:string,purposes:readonly Purpose[]=[]):GeneralImplementation=>({source:'src/'+source+'.ts',version:version+'/0.1-candidate',purposes});

/** Versions identify the actual accepted component being adapted, not a synthetic
 * common registration version. Dispatch/carriage stages name their coordinator. */
export function generalImplementation(stage:string,allocation='Spatial'):GeneralImplementation {
 if(allocation!=='Spatial'&&(stage.endsWith('-visual-encoding'))){
  if(!['RoleCalibrated','Disabled'].includes(allocation))throw Error('GA_ALLOCATION_CONTROL');
  return impl('campaign3/selectedSpatialEncoding',allocation==='RoleCalibrated'?'selected-role-allocation-control':'selected-disabled-allocation-control',stage==='prior-concern-visual-encoding'?['Spatial','Encoding','Feedback']:['Spatial','Encoding']);
 }
 const lane=stage.replace(/^(current|consequence)-/,'');
 const laneMap:Record<string,GeneralImplementation>={
  sample:impl('campaign3/requestedSourceSampling','requested-source-sampling-component'),
  track:impl('campaign3/generalSourceOpportunity','general-source-opportunity-component'),
  bind:impl('campaign3/generalSourceOpportunity','general-source-opportunity-component'),
  classify:impl('campaign3/generalSourceOpportunity','general-source-opportunity-component'),
  freeze:impl('campaign3/generalSourceOpportunity','general-source-opportunity-component'),
  roles:impl('campaign3/generalSourceRoles','general-source-role-batch'),
  dispatch:impl('campaign3/generalSourceSchedule','general-source-schedule-component'),
  'visual-selection':impl('campaign3/canonicalVisualSelection','canonical-visual-selection-component',['VisualSelection','Spatial']),
  'visual-encoding':impl('campaign3/selectedSpatialEncoding','calibrated-selected-spatial-encoding',['Spatial','Encoding']),
  'body-selection':impl('campaign3/canonicalBodyProduction','general-attention-body-production',['BodySelection']),
  'visual-cue':impl('campaign3/generalSourceOpportunity','general-source-opportunity-component'),
  'body-cue':impl('campaign3/bodySignalCue','body-signal-cue-component'),
  'event-rank':impl('campaign3/canonicalEventRecall','canonical-event-recall-component',['EventRecall']),
  'body-rank':impl('campaign3/bodyRecall','body-recall-recency-component',['BodyRecall']),
  recollection:impl('campaign3/recollectionProduction','recollection-production'),
 };
 if(lane!==stage&&laneMap[lane])return laneMap[lane];
 const fixed:Record<string,GeneralImplementation>={
  world:impl('campaign3/positionSceneSource','position-scene-source-component'),
  'visual-acquisition-evidence':impl('campaign3/visualFormationEvidence','visual-formation-evidence-component',['Encoding']),
  'body-acquisition-evidence':impl('campaign3/canonicalBodyProduction','general-attention-body-production'),
  'ordinary-memory-formation':impl('campaign3/ordinaryMemoryBatch','ordinary-memory-batch',['Retention']),
  'event-association-formation':impl('campaign3/eventAssociationSettlement','event-association-settlement',['Association','GraphRetention']),
  'event-presentation-formation':impl('campaign3/eventPresentationSettlement','event-presentation-settlement'),
  'prior-concern-workspace':impl('campaign2/cognitiveTransforms','task-cognitive-path',['Workspace']),
  'prior-concern-appraisal':impl('campaign2/cognitiveTransforms','task-cognitive-path'),
  'prior-concern-producer':impl('campaign2/cognitiveTransforms','task-cognitive-path',['Concern']),
  'encoding-concern-delivery':impl('campaign3/priorConcernFeedback','prior-concern-feedback-component',['Feedback']),
  'recall-concern-delivery':impl('campaign3/priorConcernFeedback','prior-concern-feedback-component',['Feedback']),
  'prior-concern-visual-encoding':impl('campaign3/selectedSpatialEncoding','prior-concern-spatial-encoding',['Spatial','Encoding','Feedback']),
  'prior-concern-event-rank':impl('campaign3/priorConcernFeedback','prior-concern-feedback-component',['EventRecall','Feedback']),
  'goal-command-proposal':impl('campaign3/bodilyMaintenanceGoal','bodily-maintenance-goal-component'),
  'goal-command-owner':impl('campaign3/bodilyMaintenanceGoal','bodily-maintenance-goal-component'),
  'goal-deadline-owner':impl('campaign3/bodilyMaintenanceGoal','bodily-maintenance-goal-component'),
  'goal-outcome-assessment':impl('campaign3/goalAssessmentProduction','goal-assessment-production',['GoalQualification']),
  'focal-consequence-delivery':impl('campaign3/focalAttribution','focal-attribution-component'),
  'goal-qualification-delivery':impl('campaign3/goalOutcomeQualification','goal-qualification-projection-component',['GoalQualification']),
  'retained-attribution':impl('campaign3/attributionProduction','attribution-production'),
  'attribution-use-dispatch':impl('campaign3/retainedAttributionUse','retained-attribution-use-component'),
  'ordinary-memory-use':impl('campaign3/ordinaryMemoryBatch','ordinary-memory-batch',['Retention']),
  'attribution-result-delivery':impl('campaign3/attributionProduction','attribution-production'),
  'significance-opportunity':impl('campaign3/attributedChildBoundary','attributed-child-boundary-component'),
  'significance-join':impl('campaign3/attributedChildBoundary','attributed-child-boundary-component'),
  'ordinary-memory-significance':impl('campaign3/ordinaryMemoryBatch','ordinary-memory-batch',['Retention']),
  'retention-original':impl('campaign3/generalAttentionCodecs','general-attention-carrier',['Retention','Association','GraphRetention']),
  'retention-dispatch':impl('campaign3/generalAttentionCodecs','general-attention-carrier',['Retention','Association','GraphRetention']),
  'ordinary-memory-retention':impl('campaign3/ordinaryMemoryBatch','ordinary-memory-batch',['Retention']),
  'event-association-retention':impl('campaign3/eventAssociationSettlement','event-association-settlement',['Association','GraphRetention']),
  'event-presentation-cleanup':impl('campaign3/eventPresentationSettlement','event-presentation-settlement'),
  'event-presentation-dispatch':impl('campaign3/recollectionProduction','recollection-production'),
  'event-presentation-owner':impl('campaign3/eventPresentationSettlement','event-presentation-settlement'),
  'goal-baseline-cue':impl('campaign3/bodySignalCue','body-signal-cue-component'),
  'goal-baseline-rank':impl('campaign3/bodyRecall','body-recall-recency-component',['GoalBaselineRecall']),
  'goal-baseline-recollection':impl('campaign3/recollectionProduction','recollection-production'),
  'local-reserve-replenishment':impl('campaign3/localReserveSource','local-reserve-replenishment-production'),
 };
 if(!fixed[stage])throw Error('GA_UNBOUND_IMPLEMENTATION: '+stage);return fixed[stage];
}
export function generalBindingContext(){return {graphScale:100n,admittedVersions:[...new Set([
 ...generalRegistrationTemplates().map(t=>generalImplementation(t.name).version),
 // Nested source/formation records retain their producer version even when a
 // registered coordinator invokes that component. This does not change706 bytes.
 'trial-panel-source-component/0.1-candidate','body-formation-evidence-component/0.1-candidate',
 'selected-role-allocation-control/0.1-candidate','selected-disabled-allocation-control/0.1-candidate',
 ])]};}
export function generalSubjectProjection(){return r(266,[u(1),statePathPatternValue(generalPattern(268)),u(1),r(263,[u(1002),id(1021,'validator/character-qualification')]),id(1028,'ResolvedCharacterSubject')]);}
const type=(name:string)=>{const s=schemas.find(s=>s.name===name);if(!s)throw Error('GA_UNKNOWN_ROOT '+name);return Number(s.typeId);};
export function generalStagePaths(stage:string){
 const s=topology.stages.find(s=>s.name===stage);if(!s)throw Error('GA_UNKNOWN_STAGE');
 const who=generalSubject(),physical=['A','B','C'].map(n=>r(644,[who.character,id(1044,'local-reserve/'+n)]));
 const projection='projection' in s||stage==='current-sample'||stage==='consequence-sample';
 const reads:StatePathPattern[]=projection?[generalPattern(268)]:[];
 for(const root of s.reads){
  if(root.startsWith('LocalReserveState'))reads.push(...physical.map(k=>generalPattern(649,k)));
  else if(root==='PerceptualContinuantFileState'||root==='PerceptualEventFileState'){
   const n=root==='PerceptualContinuantFileState'?241:242;reads.push(generalPattern(n,who.observer),generalPattern(n,undefined,2));
  }else if(root==='Existing subject TaskCommitmentState')reads.push(generalPattern(373,r(371,[who.character,semanticReferentFromAuthoredContent(generalContentId('task'))])));
  else if(root==='Existing subject MeasurementPredictionState')reads.push(generalPattern(362,r(360,[who.character,d('prediction')])));
  else reads.push(generalPattern(type(root),root==='GeneralTrackingState'||root==='TrialPanelContextState'?who.observer:who.character));
 }
 const policy=writePolicy.stages.find(p=>p.name===stage)!;
 const writes=reads.filter(p=>policy.roots.some(root=>root.startsWith('LocalReserveState')?p.rootStateTypeId===649n:BigInt(type(root))===p.rootStateTypeId));
 return {projection,reads,writes};
}
export function generalStageAccessors(stage:string):GeneralAccessorDeclaration[]{
 const {reads}=generalStagePaths(stage),who=generalSubject();
 const suffixes=stage.includes('event-rank')?['event-recall-evidence','association-prior','presentations-prior']:stage.includes('body-rank')||stage==='goal-baseline-rank'?['body-recall-evidence']:[];
 return members.accessors.filter(a=>suffixes.length?suffixes.some(s=>a.member.endsWith(s)):a.projection==='Identity'&&reads.some(p=>p.rootStateTypeId===BigInt(a.rootTypeId))).map(a=>({member:a.member,path:{rootStateTypeId:BigInt(a.rootTypeId),fieldId:1n,selectors:[{kind:'mapKey',key:a.key==='CharacterId'?who.character:who.observer}]},resultTypeId:BigInt(a.resultTypeId),projection:a.projection as GeneralAccessorDeclaration['projection']}));
}
export function buildGeneralRegistrations(allocation='Spatial'){
 const result=new Map<string,Uint8Array>(),context=generalBindingContext();
 for(const t of generalRegistrationTemplates()){
  const impl=generalImplementation(t.name,allocation),paths=generalStagePaths(t.name),policy=writePolicy.stages.find(s=>s.name===t.name)!;
  let write=r(322,[u(1)]);
  if(policy.writeMode==='LearningFamilies'){
   const owner=policy.roots[0]==='GeneralEpisodeState'?'ordinary-memory':policy.roots[0]==='GeneralAssociationState'?'association':'presentation';
   write=r(322,[u(2),id(1025,'authority/general-attention-'+owner),set([id(1031,owner==='association'?'associations':'episodic-memory')])]);
  }else if(policy.writeMode==='ExactPaths')write=r(705,[id(1025,t.name.endsWith('-track')?'authority/perception':t.name==='local-reserve-replenishment'?'authority/general-attention-local-reserve':'authority/general-attention-goal-lifecycle'),set(paths.writes.map(statePathPatternValue))]);
  const fields=new Map<bigint,CanonicalValue>([[1n,u(t.ordinal)],[2n,t.seam],[3n,text(impl.version)],[4n,t.event],[5n,u(t.phase)],[6n,generalSchemaRef(t.input.typeId)],[7n,list(t.outputs.map(o=>r(703,[generalSchemaRef(o.schema.typeId),u(o.minimum),u(o.maximum),u(o.identityMode)])))],[8n,set(paths.reads.map(statePathPatternValue))],[9n,write],[11n,list(impl.purposes.map(p=>r(702,[u(generalPurposes.indexOf(p)+1),d(generalPurposeDefinitions[p][1])])))] ]);
  if(paths.projection)fields.set(10n,generalSubjectProjection());
  result.set(t.name,enc(decode(enc(r(706,fields)),context)));
 }
 return result;
}
/** Exact role declarations from the permanent position inventory, with the same
 * character/goal predicates that the model content compiler implements. */
export function buildGeneralRoles(){
 const rows=[...allocation.rolePositions,...writeAllocation.rolePositions];
 const byPosition=new Map<string,CanonicalValue>();
 for(const p of rows){
  // Collection-element roles are fixed by the carrier grammar. A265 RecordField
  // role would incorrectly require the entire collection to be one identity.
  if(p.mode==='FixedCompilerCollectionElement')continue;
  const state=p.mode==='StateMapKey',position=r(264,new Map([[1n,u(state?2:1)],[state?3n:2n,u(p.recordTypeId)],[4n,u(p.fieldId)]]));
  const validator='validator' in p?p.validator:undefined;
  const role=r(263,validator?[u(p.requiredNamespace),id(1021,validator)]:[u(p.requiredNamespace)]);
  byPosition.set(`${state?2:1}/${p.recordTypeId}/${p.fieldId}`,r(265,[position,role]));
 }
 for(const p of [...attentionRoles.roles,...embodiedRoles.roles,...receivingRoles.roles,...predictionRoles.roles,...taskRoles.roles,...cognitiveRoles.roles]){
  const tag='position' in p&&p.position==='StateMapKey'?2:1;
  const position=r(264,new Map([[1n,u(tag)],[tag===1?2n:3n,u(p.recordTypeId)],[4n,u(p.fieldId)]]));
  const validator=typeof p.domainValidatorId==='string'?p.domainValidatorId:p.domainValidatorId?.payload;
  const role=r(263,validator?[u(p.requiredNamespace),id(1021,validator)]:[u(p.requiredNamespace)]);
  byPosition.set(`${tag}/${p.recordTypeId}/${p.fieldId}`,r(265,[position,role]));
 }
 // The IDN bridge's inherited source, key and projected-value roles are explicit.
 for(const [tag,root,field,ns,validator] of [[1,267,1,1002,true],[2,268,1,1000,false],[1,377,1,1000,false]] as const){
  byPosition.set(`${tag}/${root}/${field}`,r(265,[r(264,new Map([[1n,u(tag)],[tag===1?2n:3n,u(root)],[4n,u(field)]])),r(263,validator?[u(ns),id(1021,'validator/character-qualification')]:[u(ns)])]));
 }
 return set([...byPosition.values()]);
}
