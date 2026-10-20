import type {GeneralCheckpoint} from './generalAdapter';
import {GENERAL_COMPARISONS} from './generalComparison';
import catalog from './generalComparisonCatalog.json';
export interface GeneralPairCheckpoint{version:'general-pair/0.1';comparison:string;a:GeneralCheckpoint;b:GeneralCheckpoint;}
interface Source{checkpoint():GeneralCheckpoint|Promise<GeneralCheckpoint>;}
function validate(input:GeneralPairCheckpoint){
 const v=structuredClone(input),spec=GENERAL_COMPARISONS.find(c=>c.id===v?.comparison);
 if(v?.version!=='general-pair/0.1'||!spec||v.a?.recipe!==spec.control||v.b?.recipe!==spec.candidate)throw Error('General pair declaration mismatch');
 for(const c of [v.a,v.b])if(c.version!=='general-workbench/0.2'||c.seed!==catalog.seed||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>100)throw Error('General pair seed or prefix mismatch');
 if(v.a.prefix!==v.b.prefix)throw Error('General pair requires matching prefixes');
 return v;
}
export async function captureGeneralPair(comparison:string,pair:readonly [Source,Source]):Promise<GeneralPairCheckpoint>{return validate({version:'general-pair/0.1',comparison,a:await pair[0].checkpoint(),b:await pair[1].checkpoint()});}
export async function restoreGeneralPair<T>(input:GeneralPairCheckpoint,restore:(c:GeneralCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const v=validate(input),fresh:T[]=[];
 try{fresh.push(await restore(v.a));fresh.push(await restore(v.b));return[fresh[0],fresh[1]];}
 catch(e){fresh.forEach(dispose);throw e;}
}
