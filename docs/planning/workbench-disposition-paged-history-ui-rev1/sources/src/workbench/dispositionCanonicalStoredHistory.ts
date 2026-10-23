import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,restoreStatePath,statePathValue} from '../substrate/state';
import {dataRecord as rec,dataField as field,dataItems as items} from '../campaign2/canonicalData';
import {exactKey} from './canonical';
import {scalar} from './nativeTimeline';
import {dispositionCanonicalStoredState} from './dispositionCanonicalStoredState';
import type {DispositionInspectionSummary} from './dispositionPagedAdapter';

/** Reconstruct only the two stored scalar roots; never installs historical runtime state. */
export function dispositionCanonicalStoredHistory(identity:DispositionInspectionSummary,state:CanonicalValue,trace:readonly CanonicalValue[]){
 if(trace.length!==identity.prefix*10||identity.timeline.length!==trace.length)throw Error('DISPOSITION history trace length mismatch');
 const leaves=new Map(restoreAuthoritativeState(state).entries().filter(e=>e.path.rootStateTypeId===1457n||e.path.rootStateTypeId===1458n).map(e=>[exactKey(statePathValue(e.path)),e]));
 const events=trace.map((value,index)=>{const row=rec(value,160n),event=rec(field(row,4n),130n),named=(name:string)=>{const f=event.schema.fields.find(f=>f.name===name);if(!f)throw Error('Missing history event header');return field(event,f.id);};
  const id=scalar(named('EventId')),instant=scalar(named('DueAt')),expected=Math.floor(index/10)+1;
  if(instant!==String(expected)||identity.timeline[index].id!==id||identity.timeline[index].instant!==instant)throw Error('DISPOSITION history event ordering mismatch');
  return {id,instant:expected,diffs:items(field(row,17n),'list')};
 });
 const rows=[];let index=events.length-1;const rewoundEvents:string[]=[];
 for(let prefix=identity.prefix;prefix>=0;prefix--){
  const projected=dispositionCanonicalStoredState({...identity,prefix},new AuthoritativeState([...leaves.values()]).canonicalValue());
  rows.push({prefix,constitution:projected.constitution,plastic:projected.plastic});
  if(prefix===0)break;
  while(index>=0&&events[index].instant===prefix){const event=events[index--];
   for(const value of [...event.diffs].reverse()){const d=rec(value,148n),pathValue=field(d,1n),path=restoreStatePath(pathValue);if(path.rootStateTypeId!==1457n&&path.rootStateTypeId!==1458n)continue;
    const key=exactKey(pathValue),before=field(d,2n),after=field(d,4n),current=leaves.get(key);
    if(typeof before!=='boolean'||typeof after!=='boolean')throw Error('DISPOSITION history presence required');
    if((current!==undefined)!==after||(after&&exactKey(current!.value)!==exactKey(field(d,5n))))throw Error('DISPOSITION history mutation chain mismatch');
    if(path.rootStateTypeId===1457n)throw Error('DISPOSITION immutable constitution mutation');
    if(before)leaves.set(key,{path,value:field(d,3n)});else leaves.delete(key);
    rewoundEvents.push(event.id);
   }
  }
 }
 if(index!==-1)throw Error('DISPOSITION history unconsumed events');
 return {version:'disposition-stored-history/0.1',source:{program:identity.program,seamVersion:identity.seamVersion,modelHash:identity.modelHash,runHash:identity.runHash,saveHash:identity.saveHash,prefix:identity.prefix},rows:rows.reverse(),rewoundEvents,
  scope:'Stored constitution and plastic contribution at each committed prefix, reconstructed backward from the current state and exact native mutation records. Source saveHash identifies the containing save, not a historical save. Exact fractions and paths are authoritative; plotting coordinates are diagnostic. Refold absence is not zero. These scalars are not a general personality vector, identity standing, effective disposition or represented self-knowledge. Historical projections are not installable runtime states.'};
}
