import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
import {scalar} from './nativeTimeline';
import {equalCanonicalText} from './canonicalTextEquality';
const presence=(value:CanonicalValue)=>{if(typeof value!=='boolean')throw Error('Canonical event-state presence required');return value;};
/** Trace-local metadata only. Values remain in the original paged reads/diffs record. */
export function canonicalEventState(value:CanonicalValue){
 const row=rec(value,160n),event=rec(f(row,4n),130n),named=(name:string)=>{const field=event.schema.fields.find(f=>f.name===name);if(!field)throw Error('Missing event-state header');return f(event,field.id);};
 const type=named('EventTypeId');if(typeof type==='boolean'||type.kind!=='typedIdentifier')throw Error('Invalid event-state type');
 const header={id:scalar(named('EventId')),instant:scalar(named('DueAt')),phase:scalar(named('Phase')),stage:scalar(type.payload).split('/').at(-1)!,parents:items(named('CausalParentEventIds'),'list').map(scalar)};
 const reads=items(f(row,11n),'list').map((value,index)=>{const read=rec(value,147n),path=f(read,2n);return {index,path:exactKey(path),label:exactText(path),presence:presence(f(read,3n))};});
 const diffs=items(f(row,17n),'list').map((value,index)=>{
  const diff=rec(value,148n),path=f(diff,1n),beforePresence=presence(f(diff,2n)),afterPresence=presence(f(diff,4n));
  const changed=beforePresence!==afterPresence||(beforePresence&&!equalCanonicalText(f(diff,3n),f(diff,5n)));
  return {index,path:exactKey(path),label:exactText(path),beforePresence,afterPresence,changed};
 });
 return {version:'canonical-event-state/0.1',event:header,reads,diffs,counts:{reads:reads.length,mutations:diffs.length,changes:diffs.filter(d=>d.changed).length},
  sources:{reads:{kind:'event' as const,id:header.id,part:'reads' as const},diffs:{kind:'event' as const,id:header.id,part:'diffs' as const}},
  scope:'Recorded reads and structural mutations at this event. Indices refer to the original native reads/diffs lists; exact values remain available through paged records at the owning save revision. Changed preserves the existing readable-text comparison and presence semantics, not canonical byte inequality or causal necessity. Counts describe only this recorded event, not uninstrumented activity elsewhere. Before/after records are historical inspection, not installable intermediate runtime states.'};
}
