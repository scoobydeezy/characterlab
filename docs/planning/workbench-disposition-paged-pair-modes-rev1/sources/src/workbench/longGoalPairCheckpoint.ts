import type {LongGoalCheckpoint} from './longGoalAdapter';
import {LONG_GOAL_COMPARISONS} from './longGoalComparison';
export interface LongGoalPairCheckpoint{version:'long-goal-pair/0.1';comparison:string;control:LongGoalCheckpoint;candidate:LongGoalCheckpoint;}
interface CheckpointSource{checkpoint():LongGoalCheckpoint|Promise<LongGoalCheckpoint>;}
function validate(input:LongGoalPairCheckpoint){
 const value=structuredClone(input),spec=LONG_GOAL_COMPARISONS.find(s=>s.id===value?.comparison);
 if(value?.version!=='long-goal-pair/0.1'||!spec||value.control?.index!==spec.control||value.candidate?.index!==spec.candidate)throw Error('Goal pair checkpoint declaration mismatch');
 if(value.control.version!=='long-goal-workbench/0.1'||value.candidate.version!=='long-goal-workbench/0.1'||!Number.isInteger(value.control.prefix)||value.control.prefix<0||value.control.prefix>16||value.control.prefix!==value.candidate.prefix)throw Error('Goal pair checkpoint prefix mismatch');
 return value;
}
export async function captureLongGoalPair(comparison:string,pair:readonly [CheckpointSource,CheckpointSource]):Promise<LongGoalPairCheckpoint>{
 return validate({version:'long-goal-pair/0.1',comparison,control:await pair[0].checkpoint(),candidate:await pair[1].checkpoint()});
}
/** Both original component restores must authenticate before callers install the pair. */
export async function restoreLongGoalPair<T>(input:LongGoalPairCheckpoint,restore:(c:LongGoalCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.control));fresh.push(await restore(value.candidate));return[fresh[0],fresh[1]];}
 catch(error){for(const c of fresh)dispose(c);throw error;}
}
