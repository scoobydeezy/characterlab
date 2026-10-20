import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {exactKey,exactText} from './canonical';
import {equalCanonicalText} from './canonicalTextEquality';
import {scalar} from './nativeTimeline';
import type {ParticipationRow} from './participation';
/** Same recorded activity census as stateParticipation, without formatting trace payloads. */
export function canonicalActivityIndex(state:CanonicalValue,trace:readonly CanonicalValue[]){
 const rows=new Map<string,ParticipationRow>();
 const ensure=(path:string)=>{let row=rows.get(path);if(!row){row={path,root:null,label:path,reads:0,mutations:0,changes:0,presentAtRevision:false,events:[]};rows.set(path,row);}return row;};
 for(const e of restoreAuthoritativeState(state).entries()){const row=ensure(exactKey(statePathValue(e.path)));row.root=String(e.path.rootStateTypeId);row.presentAtRevision=true;}
 const ids=new Set<string>();
 for(const value of trace){const row=rec(value,160n),event=rec(f(row,4n),130n),named=(name:string)=>{const field=event.schema.fields.find(x=>x.name===name);if(!field)throw Error('Missing event field');return f(event,field.id);};
  const id=scalar(named('EventId')),instant=scalar(named('DueAt')),type=named('EventTypeId');if(typeof type==='boolean'||type.kind!=='typedIdentifier')throw Error('Invalid event type');const stage=scalar(type.payload).split('/').at(-1)!;
  if(ids.has(id))throw Error('Duplicate event identity in participation prefix');ids.add(id);const activity=new Map<string,{reads:number;mutations:number;changes:number}>();
  const touch=(pathValue:CanonicalValue)=>{const path=exactKey(pathValue);ensure(path).label=exactText(pathValue);let counts=activity.get(path);if(!counts){counts={reads:0,mutations:0,changes:0};activity.set(path,counts);}return counts;};
  for(const value of items(f(row,11n),'list')){const read=rec(value,147n);touch(f(read,2n)).reads++;}
  for(const value of items(f(row,17n),'list')){const diff=rec(value,148n),counts=touch(f(diff,1n)),before=f(diff,2n)===true,after=f(diff,4n)===true;counts.mutations++;if(before!==after||(before&&!equalCanonicalText(f(diff,3n),f(diff,5n))))counts.changes++;}
  for(const [path,counts]of activity){const r=ensure(path);r.reads+=counts.reads;r.mutations+=counts.mutations;r.changes+=counts.changes;r.events.push({id,instant,stage,...counts});}
 }
 return {events:trace.length,rows:[...rows.values()].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0)};
}
