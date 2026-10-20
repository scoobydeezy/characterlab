import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
export const MULTISOURCE_CHARACTER_VERSION='multisource-character-projection/0.1';
export const MULTISOURCE_LANGUAGE_VERSION='multisource-assessment-explanation/0.1';
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'&&v.kind!=='unsigned')throw Error('MULTISOURCE integer required');return String(v.value);};
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('MULTISOURCE rational required');return `${v.numerator}/${v.denominator}`;};
function safe(v:CanonicalValue):void{if(typeof v==='boolean')return;if(v.kind==='record'){if(v.schema.schemaVersion!==1n||![718n,462n,461n,400n,399n,237n].includes(v.schema.typeId))throw Error('Unsafe MULTISOURCE assessment record');v.fields.forEach(safe);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(safe);else if(v.kind==='map')v.entries.forEach(([k,x])=>{safe(k);safe(x);});else if(v.kind==='typedIdentifier')safe(v.payload);}
export interface MultisourceCharacterEntry {kind:string;at:string;sourceIndex:number;occurrence:string;human:string;exact:string;}
/** Only native719 assessments are projected. Its task/selection/observed ancestry
 * supplies observer and time, but is never copied into character provenance. */
export function projectMultisourceCharacter(outputs:readonly CanonicalValue[],observer:CanonicalValue){
 const entries:MultisourceCharacterEntry[]=[];
 outputs.forEach((value,sourceIndex)=>{if(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==719n)return;
  const source=rec(value,719n),task=rec(f(source,2n),717n),selected=rec(f(task,2n),716n),frozen=rec(f(selected,2n),714n),observed=rec(f(frozen,2n),713n);
  if(exactKey(f(observed,3n))!==exactKey(observer))throw Error('MULTISOURCE observer mismatch');
  const at=integer(f(observed,5n)),assessments=items(f(source,3n),'list'),selectedSamples=items(f(selected,3n),'list').flatMap(g=>items(f(rec(g,715n),2n),'list')).map(exactKey);
  for(const value of assessments){const a=rec(value,718n);safe(a);const kind=integer(f(a,2n));if(!['1','2'].includes(kind))throw Error('Unknown MULTISOURCE assessment kind');const known=kind==='2';
   if(!known&&[3n,4n,5n,6n].some(k=>a.fields.has(k)))throw Error('Unavailable assessment carries evidence');
   const samples=known?items(f(a,6n),'list'):[];for(const s of samples){const sample=rec(s,461n);if(exactKey(f(sample,2n))!==exactKey(observer)||!selectedSamples.includes(exactKey(sample)))throw Error('Assessment sample is not selected observer evidence');}
   const interval=known?rec(f(a,3n),462n):undefined;
   const human=known?`At instant ${at}, this description uses ${samples.length} selected observation view(s), with interval ${fraction(f(interval!,1n))} to ${fraction(f(interval!,2n))} and signed assessment ${fraction(f(a,4n))}. This is an evidence-derived assessment, not an exact physical reserve reading. A recorded zero remains known evidence; shared samples do not become independent sources.`:`At instant ${at}, this description has no complete selected evidence. Its assessment is unavailable, not a recorded zero or proof of physical absence.`;
   const projection=list([text('multisource-safe-assessment/0.1'),observer,f(observed,5n),f(source,1n),a]);safe(projection);
   entries.push({kind:known?'Selected assessment':'Unavailable assessment',at,sourceIndex,occurrence:exactKey(f(source,1n))+'/'+exactKey(f(a,1n)),human,exact:exactText(projection)});
  }
 });
 return {version:MULTISOURCE_CHARACTER_VERSION,renderer:MULTISOURCE_LANGUAGE_VERSION,observer:exactKey(observer),entries,scope:'Selected source assessments only. Task reasons, choice, expression and outcomes are not described by this renderer. No physical reserve, RNG record or selection audit is copied.',notice:entries.length?'Earlier descriptions preserve their original assessment-time evidence.':'No source assessment descriptions recorded; this does not establish absence of observations, tasks or motives.'};
}
