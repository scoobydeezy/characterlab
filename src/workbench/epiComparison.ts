import plan from '../../docs/planning/EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import type {EpiSnapshot} from './epiAdapter';
export const EPI_OPTIONS=plan.runs.map(r=>`${r.law}/${r.numeric}/${r.name}`);
export function epiPair(program:string){return /\/(established|informative|fresh|missing)[AB]$/.test(program)?program.slice(0,-1)+(program.endsWith('A')?'B':'A'):null;}
export function compareEpi(a:EpiSnapshot,b:EpiSnapshot){
 if(epiPair(a.program)!==b.program||a.modelHash!==b.modelHash)throw Error('EPI comparison requires the declared hidden-potential pair under one model');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock;
 return {version:'epi-pair-inspection/0.2',aligned,policy:'Same frozen model and seed19; original potential differs in the declared pair. No runtime intervention or cross-model RNG coupling claim.',
   programs:[a.program,b.program],originalInputs:[a,b].map(s=>plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===s.program)!.orderedInputs),
   characterOutputsEqual:aligned?a.characterOutputs===b.characterOutputs:null,characterStateEqual:aligned?a.characterStateHash===b.characterStateHash:null,
   researcherOutputsEqual:aligned?a.researchOutputs===b.researchOutputs:null,exactSaveEqual:aligned?a.saveHash===b.saveHash:null,
   lawfulCharacterAccess:a.lawfulCharacterAccess&&b.lawfulCharacterAccess,scope:'Finite native EPI consumer roster only; raw research trace is not character knowledge; versioned encoding descriptions only; no complete decision narrative.',a:structuredClone(a),b:structuredClone(b)};
}
