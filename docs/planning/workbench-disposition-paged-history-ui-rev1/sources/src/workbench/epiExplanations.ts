import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
export const EPI_RENDERER='epi-encoding-explanation/0.1';
export interface EpiExplanation {id:string;renderer:string;at:string;observer:string;proposition:string;sample:string;human:string;priorKnown:boolean;measurement:string;kind:'Point'|'Lower bound';surprise:string;raw:string;strength:string;provenance:string;}
const q=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('EPI explanation requires an exact rational');return `${v.numerator}/${v.denominator}`;};
/** Consumes only admitted evaluation records; no current state or researcher trace argument. */
export function explainEpi(outputs:readonly CanonicalValue[],lawful:boolean):EpiExplanation[]{
 if(!lawful)return [];
 const result:EpiExplanation[]=[];
 for(const output of outputs){
  if(typeof output==='boolean'||output.kind!=='record'||![900n,904n,905n,906n,907n,910n].includes(output.schema.typeId))throw Error('Unclassified character output in EPI explanation');
  if(output.schema.typeId!==910n)continue;
  const encoding=rec(output,910n),sample=rec(f(encoding,2n),900n),kind=f(sample,6n),at=f(sample,4n);
  if(typeof kind==='boolean'||kind.kind!=='unsigned'||![1n,2n].includes(kind.value)||typeof at==='boolean'||at.kind!=='signed')throw Error('Invalid EPI observation kind/instant');
  const measurement=q(f(sample,5n)),prior=encoding.fields.has(3n)?rec(f(encoding,3n),902n):null;
  const surprise=q(f(encoding,4n)),raw=q(f(encoding,5n)),strength=q(f(encoding,6n));
  const observed=kind.value===2n?`The observation provides a lower bound of ${measurement}; it does not identify an exact value.`:`The observation reports ${measurement} as a point measurement.`;
  const priorText=prior?`The earlier estimate was ${q(f(prior,1n))}.`:'No earlier estimate was available. This numeric candidate uses a zero reference for surprise, without storing a zero belief.';
  result.push({id:exactKey(f(encoding,1n)),renderer:EPI_RENDERER,at:String(at.value),observer:exactKey(f(sample,2n)),proposition:exactKey(f(sample,3n)),sample:exactKey(f(sample,1n)),
    human:`${observed} ${priorText} Recorded surprise is ${surprise}, raw encoding score ${raw}, and retained encoding strength ${strength}. Encoding strength is not confidence that the proposition is true.`,priorKnown:!!prior,measurement,kind:kind.value===2n?'Lower bound':'Point',surprise,raw,strength,provenance:exactText(encoding)});
 }
 return result;
}
