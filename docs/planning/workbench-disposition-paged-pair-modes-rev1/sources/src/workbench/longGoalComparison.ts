import plan from '../../docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json';
import type {LongGoalSnapshot} from './longGoalAdapter';
import {digest,fromHex} from './canonical';
const find=(law:string,mode:string,seed:number,keepEpisodes=false)=>{
 const index=plan.runs.findIndex(p=>p.law===law&&p.mode===mode&&p.seed===seed&&p.keepEpisodes===keepEpisodes);
 if(index<0)throw Error('Missing original LONG goal comparison case');return index;
};
export const LONG_GOAL_COMPARISONS=Array.from({length:8},(_,seed)=>[
 ...(['Maintained','Withdrawn','Replaced'] as const).flatMap(mode=>[
  {id:`feedback:${mode}:${seed}`,control:find('FineStanding',mode,seed),candidate:find('NoFeedback',mode,seed),purpose:'Fine standing feedback versus removed receiving feedback'},
  {id:`coarse:${mode}:${seed}`,control:find('SeparateOwners',mode,seed),candidate:find('NoFeedback',mode,seed),purpose:'Retained coarse-calibration equality comparator'},
  {id:`retention:${mode}:${seed}`,control:find('FineStanding',mode,seed),candidate:find('FineStanding',mode,seed,true),purpose:'Episode expiry versus KeepAll; retained detail and receiving behavior are separate'},
  {id:`opportunity:${mode}:${seed}`,control:find('FineStanding',mode,seed),candidate:find('GoalEqualsOpportunity',mode,seed),purpose:'Explicit opportunity-loss countermodel under the same lifecycle request'},
 ]),
 ...(['Withdrawn','Replaced'] as const).map(mode=>({id:`lifecycle:${mode}:${seed}`,control:find('FineStanding','Maintained',seed),candidate:find('FineStanding',mode,seed),purpose:'Changed present goal with unchanged acquired source history'})),
 {id:`opportunity-withdrawn:${seed}`,control:find('FineStanding','Withdrawn',seed),candidate:find('GoalEqualsOpportunity','Maintained',seed),purpose:'Countermodel behavior versus explicit withdrawal; request identity remains distinct'},
]).flat();
const clocks=[1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21];
async function validate(s:LongGoalSnapshot,index:number){
 const p=plan.runs[index];
 if(s.index!==index||s.law!==p.law||s.mode!==p.mode||s.seed!==p.seed||s.keepEpisodes!==p.keepEpisodes||s.seamVersion!=='longitudinal-goal-component/0.1-candidate'||s.boundary!=='native-source-plus-component-receiver')throw Error('LONG goal comparison original case mismatch');
 if(s.modelHash!==await digest(fromHex(p.modelIdentity))||s.runHash!==await digest(fromHex(p.runIdentity)))throw Error('LONG goal comparison original identity mismatch');
 if(!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>16||s.state.prefix!==s.prefix||s.state.rows.length!==s.prefix||s.complete!==(s.prefix===16)||s.state.rows.some((r,i)=>r.at!==clocks[i]))throw Error('LONG goal comparison prefix/clock mismatch');
 if(!/^[a-f0-9]{64}$/.test(s.saveHash)||!/^[a-f0-9]{64}$/.test(s.nativeSaveHash))throw Error('LONG goal comparison invalid save digest');
}
/** Projection over trusted detached adapter snapshots, not a checkpoint authenticator. */
export async function compareLongGoalSnapshots(id:string,left:LongGoalSnapshot,right:LongGoalSnapshot){
 const spec=LONG_GOAL_COMPARISONS.find(p=>p.id===id);if(!spec)throw Error('Unknown LONG goal comparison');
 const a=structuredClone(left),b=structuredClone(right);await validate(a,spec.control);await validate(b,spec.candidate);
 const side=(s:LongGoalSnapshot)=>({index:s.index,law:s.law,mode:s.mode,seed:s.seed,keepEpisodes:s.keepEpisodes,prefix:s.prefix,clock:s.state.rows.at(-1)?.at??0,modelHash:s.modelHash,runHash:s.runHash,saveHash:s.saveHash,nativeSaveHash:s.nativeSaveHash});
 const info={version:'long-goal-comparison/0.1',spec:{...spec},control:side(a),candidate:side(b),identity:{modelEqual:a.modelHash===b.modelHash,runEqual:a.runHash===b.runHash,componentSaveEqual:a.saveHash===b.saveHash,nativeSaveEqual:a.nativeSaveHash===b.nativeSaveHash},rng:{controlSeed:a.seed,candidateSeed:b.seed,seedEqual:a.seed===b.seed,correspondence:'NOT_INFERRED_FROM_SEED',controlDraws:a.state.rows.map(r=>({at:r.at,draws:r.choice.draws})),candidateDraws:b.state.rows.map(r=>({at:r.at,draws:r.choice.draws}))}};
 if(a.prefix!==b.prefix)return{...info,status:'UNALIGNED_PREFIXES' as const,scope:'No equal-prefix field comparison is admitted.'};
 const projection=(s:LongGoalSnapshot)=>({actor:s.state.actor,goalLedger:s.state.goals,goalLifecycle:s.state.rows.map(r=>({at:r.at,before:r.goalsBefore,after:r.goalsAfter})),sourceViews:s.state.rows.map(r=>({at:r.at,exact:r.sourceView})),standing:s.state.rows.map(r=>({at:r.at,exact:r.standing})),receivingModifier:s.state.rows.map(r=>({at:r.at,value:r.usedStanding})),episodes:s.state.rows.map(r=>({at:r.at,count:r.episodes})),opportunities:s.state.rows.map(r=>({at:r.at,available:r.opportunity})),probabilities:s.state.rows.map(r=>({at:r.at,vector:r.choice.probabilities})),actions:s.state.rows.map(r=>({at:r.at,chosen:r.choice.chosen})),arbitration:s.state.rows.map(r=>({at:r.at,mode:r.choice.mode,authorship:r.choice.authorship})),nuclei:s.state.rows.map(r=>({at:r.at,exact:r.choice.nuclei}))});
 const ap=projection(a),bp=projection(b),fields=(Object.keys(ap) as (keyof typeof ap)[]).map(name=>{const control=JSON.stringify(ap[name]),candidate=JSON.stringify(bp[name]);return{name,control,candidate,equal:control===candidate};});
 return{...info,status:'ALIGNED_COMPONENT_PREFIX' as const,fields,scope:'Exact retained component trajectories through one aligned prefix. Goal lifecycle, observer standing, truncated receiving modifier, episode count, probability vectors and actual actions remain distinct. Snapshots require trusted adapter provenance; this projection does not authenticate arbitrary imported state. No general causal necessity, law selection, goal attainment or native scheduler admission follows.'};
}
