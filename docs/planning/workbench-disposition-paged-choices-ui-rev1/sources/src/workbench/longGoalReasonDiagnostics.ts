import {decodeReceiving} from '../campaign3/receivingCodecs';
import {dataItems as items,dataRecord as rec,dataField as field,dataUnsigned as uint} from '../campaign2/canonicalData';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {exactKey,exactText,fromHex} from './canonical';

export const LONG_GOAL_REASON_VERSION='long-goal-reason-diagnostics/0.1';
const rational=(v:CanonicalValue)=>{
 if(typeof v==='boolean'||v.kind!=='rational')throw Error('LONG goal rational operand required');
 return `${v.numerator}/${v.denominator}`;
};
const integer=(v:CanonicalValue)=>{
 if(typeof v==='boolean'||(v.kind!=='signed'&&v.kind!=='unsigned'))throw Error('LONG goal integer operand required');
 return String(v.value);
};
/** Read original compiled records; do not synthesize missing evaluation-time signals. */
export function inspectLongGoalReasons(encoded:readonly string[]){
 if(encoded.length>32||encoded.some(x=>typeof x!=='string'||x.length>2_000_000))throw Error('LONG goal nucleus bound exceeded');
 const seen=new Set<string>();
 const nuclei=encoded.map(hex=>{
  const value=rec(decodeReceiving(fromHex(hex)),407n),key=rec(field(value,1n),404n),roles=rec(field(value,2n),406n);
  const id=exactKey(key);if(seen.has(id))throw Error('LONG goal duplicate nucleus');seen.add(id);
  const sources=new Set<string>(),entries=items(field(roles,4n),'list');
  if(entries.length>32)throw Error('LONG goal coverage bound exceeded');
  const coverage=entries.map(v=>{
   const entry=rec(v,405n),source=rec(field(entry,1n),401n),sourceKey=exactKey(source),role=uint(field(source,3n));
   if(role<1n||role>3n)throw Error('LONG goal unknown source role');
   if(sources.has(sourceKey))throw Error('LONG goal repeated coverage source');sources.add(sourceKey);
   if(exactKey(field(source,1n))!==exactKey(field(key,1n))||exactKey(field(rec(field(source,2n),371n),2n))!==exactKey(field(key,3n)))throw Error('LONG goal coverage nucleus mismatch');
   return {sourceKey,source:exactText(source),role:role===1n?'base':role===2n?'situational':'standing',magnitude:rational(field(entry,2n)),overlap:rational(field(entry,3n)),independent:rational(field(entry,4n)),effective:rational(field(entry,5n))};
  });
  return {key:id,identity:exactText(key),baseNet:rational(field(roles,1n)),standingNet:rational(field(roles,2n)),situationalNet:rational(field(roles,3n)),relevance:rational(field(value,3n)),baseDie:integer(field(value,4n)),standingModifier:integer(field(value,5n)),situationalModifier:integer(field(value,6n)),distribution:exactText(rec(field(value,7n),424n)),coverage};
 });
 return {version:LONG_GOAL_REASON_VERSION,seamVersion:'longitudinal-goal-component/0.1-candidate',nuclei,
  scope:'Recorded receiving nuclei and coverage operands only. Role nets, relevance, die size and integer modifiers remain distinct. Original raw signal strengths and basis records are not retained by this component choice record; coverage does not reconstruct them or prove complete factor accounting. Empty nuclei mean no compiled reasons were recorded, not absence of goals or learned standing. Mechanical distributions are not character uncertainty. No observer knowledge, counterfactual attribution or causal necessity is inferred.'};
}
