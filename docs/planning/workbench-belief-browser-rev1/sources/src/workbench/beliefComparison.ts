import plan from '../../docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json';
import type {BeliefSnapshot} from './beliefAdapter';
export interface BeliefContrast {id:string;label:string;kind:'input'|'model';changed:string;a:string;b:string;}
export const BELIEF_CONTRASTS:BeliefContrast[]=[];
for(const law of [1,2,3]){
 const a=`misleading-law-${law}`;
 BELIEF_CONTRASTS.push({id:`hidden/${law}`,label:`Hidden physical world · law ${law}`,kind:'input',changed:'Physical opportunity/outcome only; displayed evidence is fixed.',a,b:`hidden-law-${law}`});
 BELIEF_CONTRASTS.push({id:`display/${law}`,label:`Reported outcome · law ${law}`,kind:'input',changed:'Displayed outcome report only; physical truth is fixed.',a,b:`accurate-law-${law}`});
 for(const goal of [0,1])BELIEF_CONTRASTS.push({id:`goal/${law}/${goal}`,label:`Goal −1 to ${goal} · law ${law}`,kind:'model',changed:`Goal sign only, from −1 to ${goal}; original inputs and learning law are fixed.`,a,b:`goal-${goal}-law-${law}`});
}
for(const law of [2,3])BELIEF_CONTRASTS.push({id:`law/${law}`,label:`Corrected evidence · EvidenceMean versus ${law===2?'LastObservation':'NoLearning'}`,kind:'model',changed:'Learning law only; original evidence calendar and goal are fixed.',a:'corrected-law-1',b:`corrected-law-${law}`});
export function compareBelief(id:string,a:BeliefSnapshot,b:BeliefSnapshot){
 const contrast=BELIEF_CONTRASTS.find(c=>c.id===id);if(!contrast||a.program!==contrast.a||b.program!==contrast.b)throw Error('BELIEF comparison requires its declared ordered pair');
 if(a.seamVersion!=='belief-public/0.1-candidate'||b.seamVersion!==a.seamVersion)throw Error('BELIEF seam mismatch');
 const originals=[a,b].map(s=>plan.runs.find(r=>r.name===s.program)!);
 if(contrast.kind==='input'&&a.modelHash!==b.modelHash)throw Error('Input contrast requires one model');
 if(contrast.kind==='model'&&(a.modelHash===b.modelHash||originals[0].orderedInputs!==originals[1].orderedInputs))throw Error('Model contrast requires distinct models and identical originals');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock;
 return {version:'belief-contrast-inspection/0.1',contrast:structuredClone(contrast),aligned,
  alignment:'Same committed prefix and instant; unequal horizons yield unavailable comparisons. Internal event ancestry remains run-specific.',
  randomPolicy:'Original seed7 is fixed. These public models draw no RNG; no stochastic coupling is inferred.',
  originals:structuredClone(originals),initialState:plan.initialState,runSeed:plan.runSeed,
  modelIdentityEqual:a.modelHash===b.modelHash,runIdentityEqual:a.runHash===b.runHash,
  admittedOutputsEqual:aligned?a.outputsHash===b.outputsHash:null,beliefStateEqual:aligned?a.stateHash===b.stateHash:null,exactSaveEqual:aligned?a.saveHash===b.saveHash:null,
  scope:'Bounded retained BELIEF models. Exact belief bytes are comparable across these declared model controls because the state schema and named targets are unchanged. Researcher traces are not character knowledge. No action-choice, calibrated confidence or necessity claim.',
  a:structuredClone(a),b:structuredClone(b)};
}
