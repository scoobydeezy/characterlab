import plan from '../../docs/planning/AFFECT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import type {AffectSnapshot} from './affectAdapter';
export const AFFECT_OPTIONS=plan.runs.map(r=>r.name);
export function affectPair(program:string){return program==='baseline'?'hidden':program==='hidden'?'baseline':null;}
export function compareAffect(a:AffectSnapshot,b:AffectSnapshot){
 if(affectPair(a.program)!==b.program||a.modelHash!==b.modelHash||a.seamVersion!=='affect-public/0.1-candidate'||b.seamVersion!==a.seamVersion)throw Error('AFFECT comparison requires the declared hidden-world pair under one model');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock;
 return {version:'affect-pair-inspection/0.1',aligned,policy:'Original frozen baseline/hidden pair, one model and original seeds. Native addressed draws are retained; shared seed alone does not establish general stochastic coupling.',
  programs:[a.program,b.program],originals:[a,b].map(s=>structuredClone(plan.runs.find(r=>r.name===s.program)!)),
  outputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,exactSaveEqual:aligned?a.saveHash===b.saveHash:null,
  scope:'Bounded AFFECT programs only. Researcher traces are not character knowledge. Candidate coordinates are derived outputs, not stored emotion state or a universal affect law.',a:structuredClone(a),b:structuredClone(b)};
}
