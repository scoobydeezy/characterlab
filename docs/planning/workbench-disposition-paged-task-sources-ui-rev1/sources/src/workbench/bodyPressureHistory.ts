import type {TimelineEvent} from './contracts';
import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import {dataRecord} from '../campaign2/canonicalData';
import {exactText,fromHex} from './canonical';
export const BODY_PRESSURE_HISTORY_VERSION='body-pressure-event-join/0.1';
/** Join exact admitted output records, never merely similar timestamps or prose. */
export function bodyPressureEventLinks(records:readonly string[],events:readonly TimelineEvent[]){
 if(records.length>100||events.length>10000||events.reduce((n,e)=>n+e.output.length,0)>16000000)throw Error('BODY pressure history limit');
 if(new Set(events.map(e=>e.id)).size!==events.length)throw Error('BODY pressure history duplicate event');
 const outputs=new Map<string,string[]>();
 for(const event of events){
  const values:unknown=JSON.parse(event.output);
  if(!Array.isArray(values))throw Error('BODY event output must be a list');
  for(const value of values)if(value&&typeof value==='object'&&'record'in value&&value.record==='EmbodiedPressureOutput#464/1'){
   const key=JSON.stringify(value),ids=outputs.get(key)??[];ids.push(event.id);outputs.set(key,ids);
  }
 }
 return records.map(record=>{
  if(record.length>200000)throw Error('BODY pressure record limit');
  const value=dataRecord(decodeEmbodied(fromHex(record)),464n),ids=outputs.get(JSON.stringify(JSON.parse(exactText(value))))??[];
  if(ids.length>1)throw Error('BODY pressure occurrence has ambiguous event provenance');
  return {record,eventId:ids[0]??null};
 });
}
