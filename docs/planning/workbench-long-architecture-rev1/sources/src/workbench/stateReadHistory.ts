import type {TimelineEvent} from './contracts';
/** Uses committed trace order, never event-ID order or later state. */
export function recordedStateReadHistory(events:readonly TimelineEvent[],selected:string){
 if(events.length>10000)throw Error('State-read history exceeds 10000 events; no partial history inferred');
 const ids=new Set<string>();let records=0;
 for(const e of events){
  if(ids.has(e.id))throw Error('Duplicate event identity in state-read history');ids.add(e.id);
  records+=e.reads.length+e.diffs.length;
  if(records>50000)throw Error('State-read history exceeds 50000 read/mutation records; no partial history inferred');
  const paths=new Set<string>();for(const d of e.diffs){if(paths.has(d.path))throw Error('Duplicate mutation path in committed event');paths.add(d.path);if(d.changed!==(d.before!==d.after))throw Error('Mutation change flag mismatch');}
 }
 const index=events.findIndex(e=>e.id===selected);if(index<0)throw Error('Selected event is absent from retained timeline');
 const latest=new Map<string,{event:Pick<TimelineEvent,'id'|'instant'|'phase'|'stage'>;before:string;after:string;changed:boolean}>();
 for(let i=0;i<index;i++)for(const d of events[i].diffs){const {id,instant,phase,stage}=events[i];latest.set(d.path,{event:{id,instant,phase,stage},before:d.before,after:d.after,changed:d.changed});}
 const event=events[index];
 return {version:'recorded-state-read-history/0.1',selected:event.id,
  reads:event.reads.map((r,ordinal)=>{const mutation=latest.get(r.path);return {ordinal,path:r.path,label:r.label,exact:r.exact,priorMutation:mutation?structuredClone(mutation):null,relation:mutation?(mutation.after===r.exact?'exact-value-match':'value-mismatch'):'no-prior-recorded-mutation'};}),
  scope:'Most recent earlier mutation of the identical canonical leaf path in committed trace order. Same-event writes and later events are excluded. A match records value continuity, not psychological necessity or complete causal provenance. No prior mutation does not establish initial-state origin. Derived-source metadata, payload dependencies and omitted history are not resolved by this projection. Absence is distinct from a zero value.'};
}
