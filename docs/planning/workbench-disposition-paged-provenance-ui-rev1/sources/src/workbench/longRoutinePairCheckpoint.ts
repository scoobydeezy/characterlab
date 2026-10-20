import type {LongRoutineCheckpoint} from './longRoutineAdapter';
import {LONG_ROUTINE_COMPARISONS} from './longRoutineComparison';
export interface LongRoutinePairCheckpoint{version:'long-routine-pair/0.1';comparison:string;control:LongRoutineCheckpoint;candidate:LongRoutineCheckpoint;}
interface CheckpointSource{checkpoint():LongRoutineCheckpoint|Promise<LongRoutineCheckpoint>;}
function validate(input:LongRoutinePairCheckpoint){
 const value=structuredClone(input),spec=LONG_ROUTINE_COMPARISONS.find(s=>s.id===value?.comparison);
 if(value?.version!=='long-routine-pair/0.1'||!spec||value.control?.index!==spec.control||value.candidate?.index!==spec.candidate)throw Error('Routine pair checkpoint declaration mismatch');
 if(value.control.version!=='long-routine-reuse-workbench/0.1'||value.candidate.version!=='long-routine-reuse-workbench/0.1'||!Number.isInteger(value.control.prefix)||value.control.prefix<0||value.control.prefix>16||value.control.prefix!==value.candidate.prefix)throw Error('Routine pair checkpoint prefix mismatch');
 return value;
}
export async function captureLongRoutinePair(comparison:string,pair:readonly [CheckpointSource,CheckpointSource]):Promise<LongRoutinePairCheckpoint>{
 return validate({version:'long-routine-pair/0.1',comparison,control:await pair[0].checkpoint(),candidate:await pair[1].checkpoint()});
}
/** Both original component restores must authenticate before callers install the pair. */
export async function restoreLongRoutinePair<T>(input:LongRoutinePairCheckpoint,restore:(c:LongRoutineCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.control));fresh.push(await restore(value.candidate));return[fresh[0],fresh[1]];}
 catch(error){for(const c of fresh)dispose(c);throw error;}
}
