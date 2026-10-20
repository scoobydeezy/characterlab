import type {DispositionCheckpoint} from './dispositionAdapter';
import {DISPOSITION_CONTRASTS} from './dispositionComparison';
export interface DispositionPairCheckpoint{version:'disposition-pair/0.1';comparison:string;a:DispositionCheckpoint;b:DispositionCheckpoint;}
interface Source{checkpoint():DispositionCheckpoint|Promise<DispositionCheckpoint>;}
function validate(input:DispositionPairCheckpoint){
 const value=structuredClone(input),spec=DISPOSITION_CONTRASTS.find(c=>c.id===value?.comparison);
 if(value?.version!=='disposition-pair/0.1'||!spec||value.a?.program!==spec.a||value.b?.program!==spec.b)throw Error('DISPOSITION pair declaration mismatch');
 for(const c of [value.a,value.b])if(c.version!=='disposition-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>18)throw Error('DISPOSITION pair prefix mismatch');
 return value;
}
export async function captureDispositionPair(comparison:string,pair:readonly [Source,Source]):Promise<DispositionPairCheckpoint>{return validate({version:'disposition-pair/0.1',comparison,a:await pair[0].checkpoint(),b:await pair[1].checkpoint()});}
/** Both native restores authenticate before replacement. Unequal horizons remain explicit. */
export async function restoreDispositionPair<T>(input:DispositionPairCheckpoint,restore:(c:DispositionCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.a));fresh.push(await restore(value.b));return[fresh[0],fresh[1]];}
 catch(e){fresh.forEach(dispose);throw e;}
}
