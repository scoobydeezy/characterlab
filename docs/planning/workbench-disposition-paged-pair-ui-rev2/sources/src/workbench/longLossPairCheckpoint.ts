import type {LongLossCheckpoint} from './longLossAdapter';
import {LONG_LOSS_COMPARISONS} from './longLossComparison';
export interface LongLossPairCheckpoint{version:'long-loss-pair/0.1';comparison:string;control:LongLossCheckpoint;candidate:LongLossCheckpoint;}
interface CheckpointSource{checkpoint():LongLossCheckpoint|Promise<LongLossCheckpoint>;}
function validate(input:LongLossPairCheckpoint){
 const value=structuredClone(input),spec=LONG_LOSS_COMPARISONS.find(s=>s.id===value?.comparison);
 if(value?.version!=='long-loss-pair/0.1'||!spec||value.control?.index!==spec.control||value.candidate?.index!==spec.candidate)throw Error('Loss pair checkpoint declaration mismatch');
 if(value.control.version!=='long-loss-workbench/0.1'||value.candidate.version!=='long-loss-workbench/0.1'||!Number.isInteger(value.control.prefix)||value.control.prefix<0||value.control.prefix>12||value.control.prefix!==value.candidate.prefix)throw Error('Loss pair checkpoint prefix mismatch');
 return value;
}
export async function captureLongLossPair(comparison:string,pair:readonly [CheckpointSource,CheckpointSource]):Promise<LongLossPairCheckpoint>{
 return validate({version:'long-loss-pair/0.1',comparison,control:await pair[0].checkpoint(),candidate:await pair[1].checkpoint()});
}
/** Both original component restores must authenticate before callers install the pair. */
export async function restoreLongLossPair<T>(input:LongLossPairCheckpoint,restore:(c:LongLossCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.control));fresh.push(await restore(value.candidate));return[fresh[0],fresh[1]];}
 catch(error){for(const c of fresh)dispose(c);throw error;}
}
