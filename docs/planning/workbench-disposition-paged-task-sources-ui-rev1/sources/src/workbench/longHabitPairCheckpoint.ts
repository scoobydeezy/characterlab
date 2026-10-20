import type {LongHabitCheckpoint} from './longHabitAdapter';
import {LONG_HABIT_COMPARISONS} from './longHabitComparison';
export interface LongHabitPairCheckpoint{version:'long-habit-pair/0.1';comparison:string;control:LongHabitCheckpoint;candidate:LongHabitCheckpoint;}
interface CheckpointSource{checkpoint():LongHabitCheckpoint|Promise<LongHabitCheckpoint>;}
function validate(input:LongHabitPairCheckpoint){
 const value=structuredClone(input),spec=LONG_HABIT_COMPARISONS.find(s=>s.id===value?.comparison);
 if(value?.version!=='long-habit-pair/0.1'||!spec||value.control?.index!==spec.control||value.candidate?.index!==spec.candidate)throw Error('Habit pair checkpoint declaration mismatch');
 if(value.control.version!=='long-habit-reuse-workbench/0.1'||value.candidate.version!=='long-habit-reuse-workbench/0.1'||!Number.isInteger(value.control.prefix)||value.control.prefix<0||value.control.prefix>16||value.control.prefix!==value.candidate.prefix)throw Error('Habit pair checkpoint prefix mismatch');
 return value;
}
export async function captureLongHabitPair(comparison:string,pair:readonly [CheckpointSource,CheckpointSource]):Promise<LongHabitPairCheckpoint>{
 return validate({version:'long-habit-pair/0.1',comparison,control:await pair[0].checkpoint(),candidate:await pair[1].checkpoint()});
}
/** Both original component restores must authenticate before callers install the pair. */
export async function restoreLongHabitPair<T>(input:LongHabitPairCheckpoint,restore:(c:LongHabitCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.control));fresh.push(await restore(value.candidate));return[fresh[0],fresh[1]];}
 catch(error){for(const c of fresh)dispose(c);throw error;}
}
