import catalog from './workCatalog.json';
import type {WorkSnapshot} from './workAdapter';
export interface WorkContrast {id:string;label:string;kind:'input'|'model';changed:string;a:string;b:string;}
export const WORK_CANDIDATES=['StoredSet','IndexedReplay','StatelessPriority (violating control)','UnlimitedWorkspace (violating control)','AvailabilityEqualsAccess (violating control)','ImmortalGoal (violating control)'];
export const WORK_CONTRASTS:WorkContrast[]=[];
for(const candidate of [2,3,4,5,6])for(const capacity of [0,1,2,3])for(const support of [0,1])WORK_CONTRASTS.push({id:`candidate/${candidate}/${capacity}/${support}`,label:`StoredSet / ${WORK_CANDIDATES[candidate-1]} · capacity${capacity}, support${support}`,kind:'model',changed:'Candidate parameter only; exact original calendar, capacity, support and seed fixed. Controls3..6 remain diagnostic violations.',a:`c1-k${capacity}-s${support}`,b:`c${candidate}-k${capacity}-s${support}`});
for(const candidate of [1,2,3,4,5,6]){
 for(const capacity of [0,1,2,3])WORK_CONTRASTS.push({id:`support/${candidate}/${capacity}`,label:`Maintenance support · ${WORK_CANDIDATES[candidate-1]}, capacity${capacity}`,kind:'model',changed:'Maintenance-support parameter only; same candidate, capacity, physical inputs and seed.',a:`c${candidate}-k${capacity}-s0`,b:`c${candidate}-k${capacity}-s1`});
 for(const support of [0,1])for(const capacity of [1,2,3])WORK_CONTRASTS.push({id:`capacity/${candidate}/${support}/${capacity}`,label:`Capacity${capacity-1}/${capacity} · ${WORK_CANDIDATES[candidate-1]}, support${support}`,kind:'model',changed:'Capacity parameter only; same candidate, support, physical inputs and seed.',a:`c${candidate}-k${capacity-1}-s${support}`,b:`c${candidate}-k${capacity}-s${support}`});
}
for(const candidate of [1,2])for(const support of [0,1]){
 const base=`c${candidate}-k1-s${support}`;
 for(const [name,changed] of [['hidden','Private truth bit only; admitted display held fixed.'],['no-cue','Reminder lamp calendar differs; no claim that retained task adoption changes.'],['missing-board','Board visibility calendar differs; absence of observations is not observed absence of tasks.']])WORK_CONTRASTS.push({id:`input/${candidate}/${support}/${name}`,label:`${name} · ${WORK_CANDIDATES[candidate-1]}, support${support}`,kind:'input',changed,a:base,b:`${base}-${name}`});
 WORK_CONTRASTS.push({id:`distractor/${candidate}/${support}`,label:`Isolated distractor priority · ${WORK_CANDIDATES[candidate-1]}, support${support}`,kind:'input',changed:'Preregistered distractor supplement: physical distractor priority1→3; goal and neutral-card priorities fixed.',a:`distractor-${candidate}-${support}-low`,b:`distractor-${candidate}-${support}-high`});
}
for(const seed of [1,2,3])WORK_CONTRASTS.push({id:`draw/${seed}`,label:`StoredSet / IndexedReplay · seed${seed}`,kind:'model',changed:'Candidate only in the frozen addressed-draw cohort; identical physical inputs and seed.',a:`draw-1-${seed}`,b:`draw-2-${seed}`});
export function compareWork(id:string,a:WorkSnapshot,b:WorkSnapshot){
 const contrast=WORK_CONTRASTS.find(c=>c.id===id);if(!contrast||contrast.a!==a.program||contrast.b!==b.program)throw Error('WORK requires its declared ordered pair');
 if(a.seamVersion!=='workspace-control/0.1-candidate'||b.seamVersion!==a.seamVersion)throw Error('WORK seam mismatch');
 const originals=[a,b].map(v=>catalog.programs.find(r=>r.name===v.program)!),models=originals.map(r=>catalog.models.find(m=>m.name===r.model)!);
 if(originals[0].seed!==originals[1].seed||models[0].initialState!==models[1].initialState)throw Error('WORK original correspondence mismatch');
 if(contrast.kind==='input'&&a.modelHash!==b.modelHash)throw Error('Input contrast requires one model');if(contrast.kind==='model'&&(a.modelHash===b.modelHash||originals[0].orderedInputs!==originals[1].orderedInputs))throw Error('Model contrast requires different model and identical inputs');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock,summary=(s:WorkSnapshot)=>({program:s.program,prefix:s.prefix,clock:s.clock,complete:s.complete,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash});
 return {version:'work-contrast-inspection/0.1',contrast:structuredClone(contrast),aligned,originals:structuredClone(originals),models:models.map(m=>({name:m.name,settings:{...m.settings},modelIdentity:m.modelIdentity})),initialState:models[0].initialState,seedByte:originals[0].seed,
  alignment:'Equal committed prefix and instant only. Cache state, retained observation journal and task status are not merged into one semantic equality.',randomPolicy:'Exact original32-byte seed: byte0 is the declared seed; bytes1..31 are zero. Shared seed is not by itself a general stochastic coupling claim; inspect addressed draws in the committed trace.',
  outputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,saveEqual:aligned?a.saveHash===b.saveHash:null,a:summary(a),b:summary(b),scope:'Researcher comparisons of native records and state. No observer-safe narrative or general workspace theory claim. Equal outputs do not justify retiring StoredSet, IndexedReplay or any retained control.'};
}
