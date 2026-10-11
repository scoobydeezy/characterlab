import plan from '../../docs/planning/LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import type {LearnSnapshot} from './learnAdapter';
export const LEARN_OPTIONS=plan.runs.map(r=>`${r.law}/${r.numeric}/${r.name}`);
export function learnPair(program:string){
 if(!LEARN_OPTIONS.includes(program))return null;
 return program.endsWith('/repeated')?program.replace(/repeated$/,'hidden'):program.endsWith('/hidden')?program.replace(/hidden$/,'repeated'):null;
}
export function compareLearn(a:LearnSnapshot,b:LearnSnapshot){
 if(learnPair(a.program)!==b.program||a.modelHash!==b.modelHash)throw Error('LEARN comparison requires the declared hidden-potential pair under one model');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock;
 return {version:'learn-pair-inspection/0.1',aligned,policy:'Same frozen model and zero seed; original potential differs, admitted measurements agree. No RNG draws, runtime intervention or cross-model coupling claim.',
  programs:[a.program,b.program],originalInputs:[a,b].map(s=>plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===s.program)!.orderedInputs),
  outputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,exactSaveEqual:aligned?a.saveHash===b.saveHash:null,
  scope:'Finite LEARN public programs; output equality does not make raw researcher traces character knowledge. No narrative renderer.',a:structuredClone(a),b:structuredClone(b)};
}
