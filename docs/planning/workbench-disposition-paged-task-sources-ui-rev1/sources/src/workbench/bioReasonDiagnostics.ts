import {decodeReceiving} from '../campaign3/receivingCodecs';
import {dataItems as items,dataRecord as rec,dataField as field,dataUnsigned as uint} from '../campaign2/canonicalData';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {exactKey,exactText,fromHex} from './canonical';

export const BIO_REASON_DIAGNOSTICS_VERSION='bio-reason-diagnostics/0.1';
const fraction=(value:CanonicalValue)=>{
  if(typeof value==='boolean'||value.kind!=='rational')throw Error('BIO rational operand required');
  return `${value.numerator}/${value.denominator}`;
};
const integer=(value:CanonicalValue)=>{
  if(typeof value==='boolean'||(value.kind!=='signed'&&value.kind!=='unsigned'))throw Error('BIO integer operand required');
  return String(value.value);
};

/** Detached, evaluation-time mechanical provenance. No inference from later history. */
export function inspectBioReasons(canonicalHex:string){
  if(canonicalHex.length>16_000_000)throw Error('BIO diagnostic record exceeds byte limit');
  const row=items(decodeReceiving(fromHex(canonicalHex)),'list');
  if(row.length!==14)throw Error('BIO component row shape mismatch');
  const ordinal=uint(row[0]);
  if(ordinal<1n||ordinal>19n)throw Error('BIO component ordinal outside retained calendar');
  const raw=rec(row[3],403n),reasons=rec(row[4],408n);
  if(exactKey(field(reasons,2n))!==exactKey(raw))throw Error('BIO reason/raw lineage mismatch');
  if(exactKey(field(raw,2n))!==exactKey(row[2]))throw Error('BIO raw/context lineage mismatch');
  const rawValues=items(field(raw,3n),'set'),nucleusValues=items(field(reasons,3n),'list');
  if(rawValues.length>6||nucleusValues.length>2)throw Error('BIO factor/nucleus limit exceeded');
  const signals=rawValues.map(value=>{
    const signal=rec(value,402n),source=rec(field(signal,1n),401n),role=uint(field(source,3n));
    if(role<1n||role>3n)throw Error('BIO unknown raw role');
    return {key:exactKey(source),source:exactText(source),candidate:exactKey(field(source,1n)),
      task:exactKey(field(rec(field(source,2n),371n),2n)),
      role:role===1n?'base':role===2n?'situational':'standing',
      strength:fraction(field(signal,2n)),basis:exactText(field(signal,3n))};
  });
  if(new Set(signals.map(s=>s.key)).size!==signals.length)throw Error('BIO duplicate raw source');
  const seen=new Set<string>();
  const nuclei=nucleusValues.map(value=>{
    const nucleus=rec(value,407n),key=rec(field(nucleus,1n),404n),roles=rec(field(nucleus,2n),406n);
    const coverage=items(field(roles,4n),'list').map(value=>{
      const entry=rec(value,405n),sourceKey=exactKey(field(entry,1n)),source=signals.find(s=>s.key===sourceKey);
      if(!source||seen.has(sourceKey))throw Error('BIO missing or repeated coverage source');
      if(source.candidate!==exactKey(field(key,1n))||source.task!==exactKey(field(key,3n)))throw Error('BIO coverage nucleus mismatch');
      seen.add(sourceKey);
      return {sourceKey,role:source.role,magnitude:fraction(field(entry,2n)),overlap:fraction(field(entry,3n)),independent:fraction(field(entry,4n)),effective:fraction(field(entry,5n))};
    });
    return {key:exactKey(key),identity:exactText(key),baseNet:fraction(field(roles,1n)),
      standingNet:fraction(field(roles,2n)),situationalNet:fraction(field(roles,3n)),
      relevance:fraction(field(nucleus,3n)),baseDie:integer(field(nucleus,4n)),
      standingModifier:integer(field(nucleus,5n)),situationalModifier:integer(field(nucleus,6n)),
      distribution:exactText(rec(field(nucleus,7n),424n)),coverage};
  });
  if(new Set(nuclei.map(n=>n.key)).size!==nuclei.length)throw Error('BIO duplicate nucleus');
  return {version:BIO_REASON_DIAGNOSTICS_VERSION,seamVersion:'bio-coupled-comparison/0.2-candidate',ordinal:String(ordinal),
    reasonIdentity:exactKey(field(reasons,1n)),context:exactKey(row[2]),raw:exactKey(raw),
    signals:signals.map(signal=>({...signal,coverage:seen.has(signal.key)?'recorded':'not-recorded'})),nuclei,
    scope:'Evaluation-time raw factors and recorded coverage/compiled nuclei. Every raw source is retained, including sources without a recorded coverage entry; absence does not establish irrelevance. Role nets, relevance, dice and modifiers are distinct. Mechanical distributions are not epistemic uncertainty. No character self-knowledge, necessity, counterfactual attribution or complete choice explanation is inferred.'};
}
