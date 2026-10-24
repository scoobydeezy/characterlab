import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
export const LEARN_RENDERER='learn-application-explanation/0.1';
export interface LearnExplanation {id:string;renderer:string;at:string;observer:string;proposition:string;sample:string;kind:'Point'|'Lower bound';measurement:string;priorKnown:boolean;posteriorKnown:boolean;applied:boolean;human:string;provenance:string;}
const q=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('LEARN explanation requires exact rational');return `${v.numerator}/${v.denominator}`;};
/** Closed application projection: no physical frames, current state or trace resolver. */
export function explainLearn(outputs:readonly CanonicalValue[],law:number,numeric:number):LearnExplanation[]{
 if(![1,2,3].includes(law)||![1,2].includes(numeric))throw Error('Unknown LEARN explanation profile');
 const result:LearnExplanation[]=[];
 for(const output of outputs){
  if(typeof output==='boolean'||output.kind!=='record'||![887n,891n,892n,893n,894n].includes(output.schema.typeId))throw Error('Unclassified LEARN output');
  if(output.schema.typeId!==892n)continue;
  const application=rec(output,892n),evidence=rec(f(application,2n),891n),sample=rec(f(evidence,2n),887n),kind=f(sample,6n),at=f(sample,4n),applied=f(application,5n);
  if(typeof kind==='boolean'||kind.kind!=='unsigned'||![1n,2n].includes(kind.value)||typeof at==='boolean'||at.kind!=='signed'||typeof applied!=='boolean')throw Error('Invalid LEARN application');
  const prior=application.fields.has(3n)?rec(f(application,3n),889n):null,posterior=application.fields.has(4n)?rec(f(application,4n),889n):null,measurement=q(f(sample,5n));
  const observation=kind.value===1n?`The observation reports a point measurement of ${measurement}.`:`The observation provides a lower bound of ${measurement}; the exact effect is not identified.`;
  const before=prior?`The earlier estimate was ${q(f(prior,1n))}, with precision ${q(f(prior,2n))}.`:'No earlier estimate was available. The candidate uses zero reference operands without treating unknown as a stored zero belief.';
  const rule=law===1?'Gated candidate':law===2?'UnconditionalPrecision retired negative control':'PointOnly comparator';
  const after=posterior?`The retained estimate is ${q(f(posterior,1n))}, with precision ${q(f(posterior,2n))}.`:'The estimate remains unknown; no belief leaf is stored.';
  result.push({id:exactKey(f(application,1n)),renderer:LEARN_RENDERER,at:String(at.value),observer:exactKey(f(sample,2n)),proposition:exactKey(f(sample,3n)),sample:exactKey(f(sample,1n)),kind:kind.value===1n?'Point':'Lower bound',measurement,priorKnown:!!prior,posteriorKnown:!!posterior,applied,
   human:`${observation} ${before} The ${rule} ${applied?'applied this observation':'did not apply this observation'}. Recorded raw mean is ${q(f(application,6n))} and raw precision ${q(f(application,7n))}. ${after} ${numeric===1?'This profile retains exact rationals.':'This profile rounds committed values to millionths using ties-to-even.'} Precision is not calibrated confidence.`,provenance:exactText(application)});
 }
 return result;
}
