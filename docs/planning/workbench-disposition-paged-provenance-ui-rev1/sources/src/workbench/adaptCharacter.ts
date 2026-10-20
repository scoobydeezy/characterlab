import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
import {scalar} from './nativeTimeline';
export const ADAPT_CHARACTER_VERSION='adapt-measurement-projection/0.1';
export const ADAPT_LANGUAGE_VERSION='adapt-measurement-explanation/0.1';
export interface AdaptCharacterEntry {kind:string;observedAt:string;occurrence:string;sourceIndex:number;human:string;exact:string;}
/** Projection of admitted carriage and actual recall only; physical adaptation
 * records and researcher state/trace are not inputs to a description. */
export function projectAdaptCharacter(outputs:readonly CanonicalValue[],observer:CanonicalValue){
 const entries:AdaptCharacterEntry[]=[];
 outputs.forEach((value,sourceIndex)=>{if(typeof value==='boolean'||value.kind!=='record'||![337n,352n].includes(value.schema.typeId))return;
  const recalled=value.schema.typeId===352n,source=recalled?rec(f(rec(f(rec(f(value,2n),345n),1n),342n),2n),337n):rec(value,337n),observation=rec(f(source,2n),203n),interval=rec(f(observation,6n),204n);
  if(exactKey(f(observation,2n))!==exactKey(observer))throw Error('ADAPT observer mismatch');
  if(scalar(f(source,4n))!=='measurement-evidence-carriage/0.1-candidate'||scalar(f(observation,11n))!=='regulatory-diagnostic-probe/0.1-candidate'||scalar(f(observation,7n))!=='1'||f(interval,1n)!==true||f(interval,3n)!==true||exactKey(f(interval,2n))!==exactKey(f(interval,4n))||items(f(observation,9n),'list').length||items(f(observation,10n),'list').length)throw Error('ADAPT requires the admitted diagnostic measurement shape');
  const q=f(interval,2n);if(typeof q==='boolean'||q.kind!=='rational')throw Error('ADAPT measurement rational required');const amount=`${q.numerator}/${q.denominator}`,at=scalar(f(observation,5n));
  // Versioned diagnostic tuple: do not forge a native record by deleting fields.
  const safe=list([text('adapt-safe-measurement/0.1'),text(recalled?'recalled':'observed'),f(value,1n),f(source,1n),f(observation,1n),observer,f(observation,4n),f(observation,5n),f(source,3n),interval]);
  const human=recalled?`I recalled the measurement ${amount} observed at instant ${at}. This is retained evidence from that observation, not a new measurement or direct knowledge of my physical adaptation state.`:`At instant ${at}, the permitted diagnostic observation reported ${amount}. This measurement does not itself reveal the hidden adaptation value or the earlier exposure that produced it.`;
  entries.push({kind:recalled?'Recalled measurement':'Admitted measurement',observedAt:at,occurrence:exactKey(f(value,1n)),sourceIndex,human,exact:exactText(safe)});
 });
 return {version:ADAPT_CHARACTER_VERSION,renderer:ADAPT_LANGUAGE_VERSION,observer:exactKey(observer),entries,scope:'Permitted diagnostic measurement and exact recalled evidence only. Physical adaptation, dispatch, evaluation and state-write diagnostics are excluded.',notice:entries.length?'Observation time remains the original evidence time, including in recall.':'No qualified measurement description is available. This does not establish that no experience or adaptation occurred.'};
}
