import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import {dataItems,dataRecord,dataField} from '../campaign2/canonicalData';
import {exactKey,exactText,fromHex} from './canonical';
export const BODY_LANGUAGE_VERSION='body-admitted-pressure-language/0.1';
/** Only the public pressure output crosses this projection boundary. */
export function bodyPressureRecords(outputs:Uint8Array):string[]{
 return dataItems(decodeEmbodied(outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===464n).map(exactKey);
}
export function explainBodyPressure(records:readonly string[]){
 if(records.length>100||records.some(s=>typeof s!=='string'||s.length>200000))throw Error('BODY pressure language limit');
 const ids=new Set<string>();
 const rows=records.map(hex=>{
  const output=dataRecord(decodeEmbodied(fromHex(hex)),464n),sample=dataField(output,3n),result=dataRecord(dataField(output,4n),481n),version=dataField(output,5n);
  if(typeof version==='boolean'||version.kind!=='text'||version.value!=='embodied-pressure/0.1-candidate')throw Error('BODY pressure version');
  if(typeof sample==='boolean'||sample.kind!=='record'||![461n,463n].includes(sample.schema.typeId))throw Error('BODY sample type');
  const at=dataField(sample,4n),tag=dataField(result,1n),occurrence=exactKey(dataField(output,1n));
  if(ids.has(occurrence))throw Error('Duplicate BODY pressure occurrence');ids.add(occurrence);
  if(typeof at==='boolean'||at.kind!=='signed'||typeof tag==='boolean'||tag.kind!=='unsigned')throw Error('BODY pressure fields');
  const available=sample.schema.typeId===461n;
  if(tag.value!==(available?1n:2n))throw Error('BODY sample/result mismatch');
  const value=available?dataField(result,2n):undefined;
  if(value!==undefined&&(typeof value==='boolean'||value.kind!=='rational'||value.numerator<0n||value.numerator>value.denominator))throw Error('BODY pressure range');
  const interval=available?dataRecord(dataField(sample,5n),462n):undefined;
  const pressure=value===undefined?null:exactText(value).slice(1,-1);
  const lower=interval?exactText(dataField(interval,1n)).slice(1,-1):null,upper=interval?exactText(dataField(interval,2n)).slice(1,-1):null;
  const text=available?`At time ${at.value}, admitted body-level evidence ranged from ${lower} to ${upper}. Mediated pressure was ${pressure}${pressure==='0/1'?' (known zero)':''}.`:`At time ${at.value}, no body-level sample was available. Mediated pressure was unavailable; this is not a zero-pressure observation.`;
  return {occurrence,at:String(at.value),observer:exactKey(dataField(sample,2n)),character:exactKey(dataField(output,2n)),available,pressure,interval:available?{lower,upper}:null,text,evidenceHex:hex,exact:exactText(output)};
 });
 return {version:BODY_LANGUAGE_VERSION,rows,scope:'Descriptions of recorded admitted samples and their public pressure outputs only. They do not reveal hidden reserve, predict later pressure, infer a motive or choice, or describe a subjective feeling. Historical samples remain historical after delivery or later observations; unavailable evidence is distinct from known zero.'};
}
