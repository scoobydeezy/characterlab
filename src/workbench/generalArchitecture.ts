import type {GeneralSnapshot} from './generalAdapter';
import {canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreStatePath} from '../substrate/state';
import {generalAttentionSupportedSchemas} from '../campaign3/generalAttentionCodecs';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import {fromHex} from './canonical';
import {stateParticipation} from './participation';

export const GENERAL_ARCHITECTURE_VERSION='general-canonical-participation/0.3';
/** Scoped ownership correspondence, not a replacement topology or effect claim. */
export const GENERAL_ARCHITECTURE_BINDINGS=[
 {root:'630',schema:'GeneralEpisodeState',box:'Episodic',label:'Episodic Imprints',authority:'ordinary-memory',basis:'LearningFamilies: episodic-memory'},
 {root:'631',schema:'GeneralAssociationState',box:'Assoc',label:'Associations',authority:'association',basis:'LearningFamilies: associations'},
 {root:'632',schema:'GeneralPresentationState',box:'Episodic',label:'Episodic Imprints',authority:'presentation',basis:'LearningFamilies: episodic-memory; presentation remains a distinct state root'},
 {root:'633',schema:'MaintenanceGoalState',box:'Prospection',label:'Prospection / Goal Management',authority:'goal-lifecycle',basis:'Exact goal-lifecycle write authority; bounded maintenance-goal seam'},
 {root:'634',schema:'GeneralTrackingState',box:'Percept',label:'Perception / Attention',authority:'perception',basis:'Current/consequence tracking ExactPaths'},
 {root:'635',schema:'TrialPanelContextState',box:'Percept',label:'Perception / Attention',authority:'perception',basis:'Current/consequence tracking context; not world-truth admission'},
 {root:'241',schema:'PerceptualContinuantFileState',box:'Percept',label:'Perception / Attention',authority:'perception',basis:'Current/consequence tracking ExactPaths'},
 {root:'242',schema:'PerceptualEventFileState',box:'Percept',label:'Perception / Attention',authority:'perception',basis:'Current/consequence tracking ExactPaths'},
 {root:'302',schema:'RegulatoryAdaptationState',box:'RegAdapt',label:'Regulatory Adaptation',authority:'ADAPT (inherited)',basis:'Campaign2 permanent allocation: tolerance, sensitization, displacement and accumulated load; embodied adaptation remains distinct from learned disposition'},
 {root:'373',schema:'TaskCommitmentState',box:'Prospection',label:'Prospection / Goal Management',authority:'authority/prospective-commitments (inherited)',basis:'Concrete task commitment ownership; admitted measurement satisfaction and deadline status remain distinct from world success'},
 {root:'362',schema:'MeasurementPredictionState',box:'Beliefs',label:'Predictive / Causal Beliefs',authority:'authority/belief-expectation (inherited)',basis:'Bounded predictive-belief seam: expected next permitted diagnostic reading with evidence basis; no causal model, confidence or current truth claim; not counted again under Expectations'},
] as const;
export const GENERAL_ARCHITECTURE_SUPPORT=[
 {root:'268',schema:'CharacterObserverBindingState',kind:'identity',label:'Identity / projection support',basis:'Immutable observer-to-character roster; not self-concept or a person model'},
 {root:'581',schema:'FormationGovernanceState',kind:'protocol',label:'Formation protocol metadata',basis:'Formation identity and complete-loss metadata for the trusted coordinator; not remembered content or cognitive evidence'},
 {root:'649',schema:'LocalReserveState',kind:'physical',label:'World-side physical sources',basis:'Physical reserve ownership; admitted interoceptive evidence is separate; no automatic character Phys or Intero correspondence'},
] as const;
const schemas=generalAttentionSupportedSchemas(),registry=new RecordSchemaRegistry(schemas);
for(const binding of [...GENERAL_ARCHITECTURE_BINDINGS,...GENERAL_ARCHITECTURE_SUPPORT])if(!schemas.some(s=>String(s.typeId)===binding.root&&s.name===binding.schema))throw Error('General architecture allocation mismatch');
export function generalArchitectureParticipation(snapshot:GeneralSnapshot){
 if(snapshot.seamVersion!==freeze.versions.rulesVersion||!freeze.models.some(m=>m.name===snapshot.recipe))throw Error('General architecture requires a retained General profile');
 if(snapshot.timeline.length>10000||snapshot.fields.length>10000||snapshot.timeline.reduce((n,e)=>n+e.reads.length+e.diffs.length,0)>50000)throw Error('General architecture diagnostic limit');
 if(new Set(snapshot.fields.map(f=>f.path)).size!==snapshot.fields.length)throw Error('General architecture duplicate field');
 const rows=stateParticipation(snapshot.timeline,snapshot.fields).map(row=>{
  if(row.path.length>100000)throw Error('General architecture path limit');
  const root=String(restoreStatePath(canonicalDecode(fromHex(row.path),registry)).rootStateTypeId);
  if(row.root!==null&&row.root!==root)throw Error('General architecture root/path mismatch');
  const binding=GENERAL_ARCHITECTURE_BINDINGS.find(b=>b.root===root);
  const support=GENERAL_ARCHITECTURE_SUPPORT.find(s=>s.root===root);
  return {...row,root,binding:binding?{...binding}:null,support:support?{...support}:null};
 });
 const boxes=[...new Set(GENERAL_ARCHITECTURE_BINDINGS.map(b=>b.box))].map(box=>{
  const paths=rows.filter(r=>r.binding?.box===box);
  return {box,label:GENERAL_ARCHITECTURE_BINDINGS.find(b=>b.box===box)!.label,
   observedPaths:paths.length,reads:paths.reduce((n,r)=>n+r.reads,0),mutations:paths.reduce((n,r)=>n+r.mutations,0),changes:paths.reduce((n,r)=>n+r.changes,0),
   currentlyPresent:paths.filter(r=>r.presentAtRevision).length,eventIds:[...new Set(paths.flatMap(r=>r.events.map(e=>e.id)))],paths:paths.map(r=>r.path)};
 });
 return {version:GENERAL_ARCHITECTURE_VERSION,identity:{recipe:snapshot.recipe,seamVersion:snapshot.seamVersion,prefix:snapshot.prefix,modelHash:snapshot.modelHash,runHash:snapshot.runHash,stateHash:snapshot.stateHash,saveHash:snapshot.saveHash},
  authority:{architecture:'CHARACTER_ARCHITECTURE.md §3.2',allocation:'docs/formal/GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json',writeScope:'docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json',enforcement:'src/campaign3/generalWriteScope.ts',inheritedAdaptation:'docs/formal/CAMPAIGN2_PERMANENT_ALLOCATION.md',inheritedCommitment:'docs/formal/TASK_COMMITMENTS.md',commitmentSuccessors:'docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json'},boxes,rows,unmappedPaths:rows.filter(r=>!r.binding).map(r=>r.path),
  supportGroups:GENERAL_ARCHITECTURE_SUPPORT.map(s=>({...s,paths:rows.filter(r=>r.support?.kind===s.kind).map(r=>r.path)})),unclassifiedPaths:rows.filter(r=>!r.binding&&!r.support).map(r=>r.path),
  scope:'Eleven declared state-root correspondences within the retained General profile. Identity, protocol and world-side physical sources are shown separately from canonical boxes. Counts are recorded read/mutation/change activity, not evaluation contribution, behavioral necessity or character evidence. Historical paths decode from their exact identity even when absent now. Unrecognized roots remain unclassified; no inferred zero activity for the rest of the canonical architecture. No edge, state owner or reduction law is added.'};
}
