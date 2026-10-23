import type {SubstitutionCheckpoint} from './substitutionAdapter';
import {SUBSTITUTION_CONTRASTS} from './substitutionComparison';
export interface SubstitutionPairCheckpoint{version:'substitution-pair/0.1';comparison:string;a:SubstitutionCheckpoint;b:SubstitutionCheckpoint;}
interface Source{checkpoint():SubstitutionCheckpoint|Promise<SubstitutionCheckpoint>;}
function validate(input:SubstitutionPairCheckpoint){
 const value=structuredClone(input),spec=SUBSTITUTION_CONTRASTS.find(c=>c.id===value?.comparison);
 if(value?.version!=='substitution-pair/0.1'||!spec||value.a?.program!==spec.a||value.b?.program!==spec.b)throw Error('SUBSTITUTION pair declaration mismatch');
 for(const c of [value.a,value.b])if(c.version!=='substitution-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>8)throw Error('SUBSTITUTION pair prefix mismatch');
 return value;
}
export async function captureSubstitutionPair(comparison:string,pair:readonly [Source,Source]):Promise<SubstitutionPairCheckpoint>{return validate({version:'substitution-pair/0.1',comparison,a:await pair[0].checkpoint(),b:await pair[1].checkpoint()});}
/** Both component restores authenticate before replacement. Unequal prefixes remain explicit. */
export async function restoreSubstitutionPair<T>(input:SubstitutionPairCheckpoint,restore:(c:SubstitutionCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const value=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(value.a));fresh.push(await restore(value.b));return[fresh[0],fresh[1]];}
 catch(e){fresh.forEach(dispose);throw e;}
}
