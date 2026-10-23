import plan from '../../docs/planning/LONGITUDINAL_ROUTINE_PLAN_REV1.json';
import type {LongRoutineSnapshot} from './longRoutineAdapter';
import type {RoutineProfile} from '../campaign3/longitudinalRoutine';
import {digest,fromHex} from './canonical';

const key=(p:RoutineProfile)=>JSON.stringify([p.law,p.seed,p.alternateCue,p.visible,p.keepEpisodes,p.mode]);
const indices=new Map(plan.runs.map((p,index)=>[key(p.profile as RoutineProfile),index]));
type Factor='law'|'keepEpisodes'|'mode'|'alternateCue'|'visible';
const specs:{id:string;factor:Factor;control:number;candidate:number;purpose:string}[]=[];
for(const [control,r]of plan.runs.entries()){
 const p=r.profile as RoutineProfile;
 const add=(factor:Factor,value:RoutineProfile[Factor],purpose:string)=>{const candidate=indices.get(key({...p,[factor]:value}));if(candidate===undefined)throw Error('Missing original LONG routine comparator');specs.push({id:`${factor}:${control}:${candidate}`,factor,control,candidate,purpose});};
 if(p.law==='Derived'&&!p.keepEpisodes)for(const law of ['Stored','ExplicitBeliefOnly','ScheduledOnly','EraseHistory'] as const)add('law',law,'Derived routine versus retained alternative access/history law');
 if(p.law==='Derived'&&!p.keepEpisodes&&!p.alternateCue&&p.visible)add('keepEpisodes',true,'Native source episode retention; receiving history ownership remains unchanged');
 if(p.mode==='Maintained')for(const mode of ['Withdrawn','Opposed'] as const)add('mode',mode,'Maintained goal versus withdrawal or an opposed rest goal');
 if(!p.keepEpisodes&&!p.alternateCue)add('alternateCue',true,'Original cue versus controlled alternate cue');
 if(!p.keepEpisodes&&p.visible)add('visible',false,'Admitted outcome visibility with the same physical opportunity schedule');
}
export const LONG_ROUTINE_COMPARISONS=specs;
const clocks=[1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21];
async function validate(s:LongRoutineSnapshot,index:number){
 const p=plan.runs[index],source=plan.sources.find(x=>x.seed===p.profile.seed&&x.keepEpisodes===p.profile.keepEpisodes)!;
 if(s.index!==index||key(s.profile)!==key(p.profile as RoutineProfile)||key(s.state.profile)!==key(s.profile)||s.seamVersion!=='longitudinal-routine-component/0.1-candidate'||s.state.version!==s.seamVersion||s.protocolVersion!=='routine-reuse-harness/0.1-candidate'||s.boundary!=='component-receiver-with-reused-native-source')throw Error('LONG routine comparison original case mismatch');
 if(s.runHash!==await digest(fromHex(p.runIdentity))||s.modelHash!==await digest(fromHex(p.modelIdentity)))throw Error('LONG routine comparison original identity mismatch');
 if(!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>16||s.state.prefix!==s.prefix||s.state.rows.length!==s.prefix||s.complete!==(s.prefix===16)||s.state.rows.some((r,i)=>r.at!==clocks[i]))throw Error('LONG routine comparison prefix/clock mismatch');
 if(s.sourceRun!==source.sourceRun||s.reusedNativeSaveHash!==source.nativeHashes[s.prefix])throw Error('LONG routine comparison source provenance mismatch');
 if(!/^[a-f0-9]{64}$/.test(s.saveHash)||!/^[a-f0-9]{64}$/.test(s.pairHash))throw Error('LONG routine comparison invalid digest');
}
/** Trusted adapter snapshot projection. Authenticate imported checkpoints through the adapter first. */
export async function compareLongRoutineSnapshots(id:string,left:LongRoutineSnapshot,right:LongRoutineSnapshot){
 const spec=specs.find(p=>p.id===id);if(!spec)throw Error('Unknown LONG routine comparison');
 const a=structuredClone(left),b=structuredClone(right);await validate(a,spec.control);await validate(b,spec.candidate);
 const side=(s:LongRoutineSnapshot)=>({index:s.index,profile:s.profile,prefix:s.prefix,clock:s.state.rows.at(-1)?.at??0,modelHash:s.modelHash,runHash:s.runHash,saveHash:s.saveHash,pairHash:s.pairHash,sourceRun:s.sourceRun,reusedNativeSaveHash:s.reusedNativeSaveHash});
 const info={version:'long-routine-comparison/0.1',spec:{...spec},control:side(a),candidate:side(b),identity:{modelEqual:a.modelHash===b.modelHash,runEqual:a.runHash===b.runHash,receiverSaveEqual:a.saveHash===b.saveHash,sourceReceiverCommitmentEqual:a.pairHash===b.pairHash,sourceRunEqual:a.sourceRun===b.sourceRun,reusedNativeSaveEqual:a.reusedNativeSaveHash===b.reusedNativeSaveHash},rng:{seedEqual:a.profile.seed===b.profile.seed,correspondence:'NOT_INFERRED_FROM_SEED',controlDraws:a.state.rows.map(r=>({at:r.at,draws:r.choice.draws})),candidateDraws:b.state.rows.map(r=>({at:r.at,draws:r.choice.draws}))}};
 if(a.prefix!==b.prefix)return{...info,status:'UNALIGNED_PREFIXES' as const,scope:'No equal-prefix field comparison is admitted.'};
 const project=(s:LongRoutineSnapshot)=>({actor:s.state.actor,history:s.state.history,cache:s.state.cache,belief:s.state.belief,goals:s.state.goals,
  standing:s.state.rows.map(r=>({at:r.at,exact:r.standing})),cues:s.state.rows.map(r=>({at:r.at,cue:r.cue})),opportunities:s.state.rows.map(r=>({at:r.at,opportunity:r.opportunity})),availability:s.state.rows.map(r=>({at:r.at,available:r.available})),strength:s.state.rows.map(r=>({at:r.at,strength:r.strength})),performance:s.state.rows.map(r=>({at:r.at,performed:r.performed})),observations:s.state.rows.map(r=>({at:r.at,observed:r.observed})),beliefLifecycle:s.state.rows.map(r=>({at:r.at,before:r.beliefBefore,after:r.beliefAfter})),goalLifecycle:s.state.rows.map(r=>({at:r.at,before:r.goalsBefore,after:r.goalsAfter})),probabilities:s.state.rows.map(r=>({at:r.at,vector:r.choice.probabilities})),actions:s.state.rows.map(r=>({at:r.at,chosen:r.choice.chosen})),arbitration:s.state.rows.map(r=>({at:r.at,mode:r.choice.mode,authorship:r.choice.authorship})),nuclei:s.state.rows.map(r=>({at:r.at,exact:r.choice.nuclei}))});
 const ap=project(a),bp=project(b),fields=(Object.keys(ap) as (keyof typeof ap)[]).map(name=>{const control=JSON.stringify(ap[name]),candidate=JSON.stringify(bp[name]);return{name,authority:name==='performance'?'execution-diagnostic':'receiver-state-or-decision-diagnostic',control,candidate,equal:control===candidate};});
 return{...info,status:'ALIGNED_RECEIVER_PREFIX' as const,fields,scope:'Exact component state and trajectories at an aligned original prefix. Availability, performed action, admitted outcome, belief, goals, source retention and receiving history remain separate. Native hashes identify reused source evidence, not current source execution. Trusted snapshots are required; this report is not an arbitrary-state authenticator. No law selection, causal necessity, routine universality or psychological generalization follows.'};
}
