import type {ControlCheckpoint} from './controlAdapter';
import {CONTROL_CONTRASTS} from './controlComparison';
export interface ControlPairCheckpoint{version:'control-pair/0.1';comparison:string;a:ControlCheckpoint;b:ControlCheckpoint;}
interface Source{checkpoint():ControlCheckpoint|Promise<ControlCheckpoint>;}
function validate(input:ControlPairCheckpoint){
 const value=structuredClone(input),spec=CONTROL_CONTRASTS.find(c=>c.id===value?.comparison);
 if(value?.version!=='control-pair/0.1'||!spec||value.a?.program!==spec.a||value.b?.program!==spec.b)throw Error('CONTROL pair declaration mismatch');
 for(const c of [value.a,value.b])if(c.version!=='control-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16)throw Error('CONTROL pair prefix mismatch');
 return value;
}
export async function captureControlPair(comparison:string,pair:readonly [Source,Source]):Promise<ControlPairCheckpoint>{return validate({version:'control-pair/0.1',comparison,a:await pair[0].checkpoint(),b:await pair[1].checkpoint()});}
/** Both native restores authenticate before replacement. Unequal horizons remain explicit. */
export async function restoreControlPair<T>(input:ControlPairCheckpoint,restore:(c:ControlCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.a));fresh.push(await restore(value.b));return[fresh[0],fresh[1]];}
 catch(e){fresh.forEach(dispose);throw e;}
}
