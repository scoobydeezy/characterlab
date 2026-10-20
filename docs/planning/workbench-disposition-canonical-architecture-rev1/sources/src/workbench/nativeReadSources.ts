import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
import {scalar} from './nativeTimeline';
import type {TimelineEvent} from './contracts';
import {recordedStateReadHistory} from './stateReadHistory';
export const NATIVE_READ_SOURCES_VERSION='native-read-sources/0.1';
function identifier(v:CanonicalValue){if(typeof v==='boolean'||v.kind!=='typedIdentifier')throw Error('Native read metadata requires typed identifier');return exactText(v);}
function observation(path:CanonicalValue,presence:CanonicalValue,value:CanonicalValue){
 rec(path,140n);if(typeof presence!=='boolean')throw Error('Native read presence must be boolean');
 if(!presence&&value!==false)throw Error('Absent native read has nonempty value');
 return {path:exactKey(path),label:exactText(path),presence,exact:presence?exactText(value):'Absent'};
}
/** Decodes qualified native trace metadata; does not execute transformations. */
export function nativeReadSources(trace:readonly CanonicalValue[]){
 if(trace.length>10000)throw Error('Native read source event limit exceeded');let count=0;const ids=new Set<string>();
 return trace.map(value=>{
  const row=rec(value,160n),event=rec(f(row,4n),130n),idField=event.schema.fields.find(x=>x.name==='EventId');if(!idField)throw Error('Missing native EventId');
  const id=scalar(f(event,idField.id));if(ids.has(id))throw Error('Duplicate native read-source event');ids.add(id);
  const reads=items(f(row,11n),'list').map(value=>{
   if(++count>50000)throw Error('Native read/source record limit exceeded');const r=rec(value,147n),transformation=f(r,6n);
   const sources=items(f(r,5n),'list').map(v=>{if(++count>50000)throw Error('Native read/source record limit exceeded');const tuple=items(v,'list');if(tuple.length!==3)throw Error('Native derived source tuple must have three members');return observation(tuple[0],tuple[1],tuple[2]);});
   if(transformation===false&&sources.length)throw Error('Native derived sources lack transformation identity');
   return {...observation(f(r,2n),f(r,3n),f(r,4n)),accessor:identifier(f(r,1n)),transformation:transformation===false?null:identifier(transformation),sources};
  });return {id,reads};
 });
}
export type NativeReadSources=ReturnType<typeof nativeReadSources>;
export function inspectNativeReadSources(events:readonly TimelineEvent[],metadata:NativeReadSources,selected:string){
 if(events.length!==metadata.length)throw Error('Native read metadata timeline length mismatch');
 for(let i=0;i<events.length;i++){
  const e=events[i],m=metadata[i];if(e.id!==m.id||e.reads.length!==m.reads.length)throw Error('Native read metadata event alignment mismatch');
  for(let j=0;j<e.reads.length;j++)if(e.reads[j].path!==m.reads[j].path||e.reads[j].exact!==m.reads[j].exact)throw Error('Native read metadata value alignment mismatch');
 }
 const ordinary=recordedStateReadHistory(events,selected),index=events.findIndex(e=>e.id===selected),m=metadata[index];
 return {version:NATIVE_READ_SOURCES_VERSION,selected,reads:m.reads.map((r,ordinal)=>{
  const sourceReads=r.sources.map(s=>({path:s.path,label:s.label,exact:s.exact}));
  const h=recordedStateReadHistory([...events.slice(0,index),{...events[index],reads:sourceReads}],selected);
  return {ordinal,kind:r.transformation===null?'direct':'derived',...structuredClone(r),deliveredValueHistory:ordinary.reads[ordinal],sourceHistory:h.reads};
 }),scope:'Native ActualReadRecord accessor, transformation and derived-source observations from the same qualified committed trace. Derived delivered values need not equal their stored source values. Source-to-prior-mutation matches establish recorded value continuity only; transformation mathematics are not rerun here. Missing prior mutations remain unresolved. Omniscient diagnostic metadata is not character evidence or psychological necessity.'};
}
