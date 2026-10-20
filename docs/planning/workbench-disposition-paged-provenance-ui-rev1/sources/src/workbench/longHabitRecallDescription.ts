import {decodeHabit} from '../campaign3/habitCodecs';
import {dataRecord,dataField,dataKey} from '../campaign2/canonicalData';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {digest} from './canonical';

/** Accept only the surviving practice children returned by component recall.
 * No profile, history, trace, loss journal, physical outcome or prior save is read. */
export async function describeLongHabitPracticeRecall(input:readonly (readonly number[])[]){
 const views=structuredClone(input);
 if(!Array.isArray(views)||views.length>32)throw Error('Invalid retained practice view count');
 const seen=new Set<string>(),records=[];
 for(const view of views){
  if(!Array.isArray(view)||view.length>65536||view.some(n=>!Number.isInteger(n)||n<0||n>255))throw Error('Invalid retained practice bytes');
  const bytes=Uint8Array.from(view),value=dataRecord(decodeHabit(bytes),836n),occurrence=dataField(value,1n),at=dataField(value,2n),cue=dataField(value,3n),observed=dataField(value,4n),reward=value.fields.get(5n);
  if(typeof occurrence==='boolean'||occurrence.kind!=='typedIdentifier'||occurrence.namespaceId!==1155n||typeof at==='boolean'||at.kind!=='signed'||typeof cue!=='boolean'||observed!==true||typeof reward!=='boolean')throw Error('Retained practice evidence is not an admitted observed outcome');
  const id=dataKey(occurrence);if(seen.has(id))throw Error('Duplicate retained practice occurrence');seen.add(id);
  records.push({occurrence:id,at:at.value.toString(),cue:cue?'alternate':'original',reward,authority:'retained-component-practice-evidence' as const,exact:bytesToHex(bytes),sha256:await digest(bytes),text:`A retained practice record at clock ${at.value} describes the ${cue?'alternate':'original'} cue and a ${reward?'positive':'negative'} observed reward.`});
 }
 return{version:'long-habit-practice-recall-description/0.1',status:records.length?'RETAINED_PRACTICE_EVIDENCE' as const:'NO_RETAINED_PRACTICE_EVIDENCE' as const,count:records.length,records,text:records.length?`Current component recall contains ${records.length} retained practice evidence ${records.length===1?'record':'records'}.`:'Current component recall contains no retained practice evidence.',scope:'Descriptions use only surviving practice children. They do not reconstruct lost episodes from history, traces or saves, establish current option availability, infer an unobserved reward, or prove global forgetting. Component recall is not native perceptual or general recollection admission.'};
}
