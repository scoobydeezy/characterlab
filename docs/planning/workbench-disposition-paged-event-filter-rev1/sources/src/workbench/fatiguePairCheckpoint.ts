import type {FatigueCheckpoint} from './fatigueAdapter';
import {FATIGUE_CONTRASTS} from './fatigueComparison';
export interface FatiguePairCheckpoint{version:'fatigue-pair/0.1';comparison:string;a:FatigueCheckpoint;b:FatigueCheckpoint;}
interface Source{checkpoint():FatigueCheckpoint|Promise<FatigueCheckpoint>;}
function validate(input:FatiguePairCheckpoint){
 const value=structuredClone(input),spec=FATIGUE_CONTRASTS.find(c=>c.id===value?.comparison);
 if(value?.version!=='fatigue-pair/0.1'||!spec||value.a?.program!==spec.a||value.b?.program!==spec.b)throw Error('FATIGUE pair declaration mismatch');
 for(const c of [value.a,value.b])if(c.version!=='fatigue-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16)throw Error('FATIGUE pair prefix mismatch');
 return value;
}
export async function captureFatiguePair(comparison:string,pair:readonly [Source,Source]):Promise<FatiguePairCheckpoint>{return validate({version:'fatigue-pair/0.1',comparison,a:await pair[0].checkpoint(),b:await pair[1].checkpoint()});}
/** Both native restores authenticate before replacement. Unequal horizons remain explicit. */
export async function restoreFatiguePair<T>(input:FatiguePairCheckpoint,restore:(c:FatigueCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.a));fresh.push(await restore(value.b));return[fresh[0],fresh[1]];}
 catch(e){fresh.forEach(dispose);throw e;}
}
