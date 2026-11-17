/** M144343bd61a: original C1 affordances on one unchanged assembled character. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledCarrierObservation';
import {MINA,DARIUS,GLEN,OBSERVER_AFFORDANCES,MULTI_ROLE_AFFORDANCES,REPEATED_ROLE_AFFORDANCES,TRACK_FEATURES,CANONICAL_BINDING_REQUESTS,MULTI_ROLE_BINDING_REQUESTS,REPEATED_ROLE_BINDING_REQUESTS,SKIP_ROPE_SCHEMA,REFERENT,type ObserverId} from './phenSem001';
import {CURRENT_SEM_SOURCE} from '../../assembled/semanticLanes';
import {TRUTH_SCENE} from '../../assembled/semanticTruth';
import {channel,schema,rule} from './assembledSemanticTruth';
import {semanticReferentValue} from '../../substrate/referentOrigin';
import {unsigned as u} from '../../substrate/canonicalEncoding';
import {EventRoleId as R} from '../../semanticBinding/eventBindings';
export type Profile=ObserverId|'multi'|'repeat';
const roles=[R.Actor,R.Target,R.Participant,R.Recipient,R.Companion,R.Instrument,R.Location,R.Beneficiary,R.AffectedEntity,R.Action];
export function fixture(profile:Profile=MINA,padding=false){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')],content=items(slots[48],'list');
 const observer=profile==='multi'||profile==='repeat'?MINA:profile,affordances=profile==='multi'?MULTI_ROLE_AFFORDANCES:profile==='repeat'?REPEATED_ROLE_AFFORDANCES:OBSERVER_AFFORDANCES[observer];
 const requests=profile==='multi'?MULTI_ROLE_BINDING_REQUESTS:profile==='repeat'?REPEATED_ROLE_BINDING_REQUESTS:CANONICAL_BINDING_REQUESTS;
 // Same declaration for every profile; only world/source facts and affordances vary.
 const refs=new Map(items(content[1],'list').map(v=>[key(items(v,'list')[0]),v]));
 for(const r of [...CANONICAL_BINDING_REQUESTS,...MULTI_ROLE_BINDING_REQUESTS,...REPEATED_ROLE_BINDING_REQUESTS]){
  const value=semanticReferentValue(r.semanticReferent.semanticReferentId),old=refs.get(key(value)),tags=[...new Set([...r.semanticReferent.domainTags,...(r.semanticReferent.semanticReferentId===REFERENT.leadPipe.semanticReferentId?['object','metal','blunt']:r.semanticReferent.semanticReferentId===REFERENT.library.semanticReferentId?['interior-space']:[]),...(old?items(items(old,'list')[1],'list').map(v=>(v as {value:string}).value):[])])].sort();
  refs.set(key(value),list([value,list(tags.map(text))]));
 }
 const pinned=schema(SKIP_ROPE_SCHEMA.eventTypeId,SKIP_ROPE_SCHEMA.roleCardinalityRules.map(r=>rule(roles.indexOf(r.eventRoleId)+1,r.minOccurrences,r.maxOccurrences.kind==='unbounded'?null:r.maxOccurrences.value)));
 slots[48]=list([content[0],list([...refs.entries()].sort(([a],[b])=>a<b?-1:1).map(([,v])=>v)),list([...items(content[2],'list'),pinned,schema('event-type/ordinal-padding',[rule(10)])])]);
 const s={...b.s,registry:enc(list(slots))},labels=[...new Set(affordances.map(a=>a.trackLabel))],seen=new Set<string>();
 const features=(label:string)=>list([list((TRACK_FEATURES[label]??[]).map(f=>list([text(f),true,true]))),list([])]);
 const counts=new Map<string,number>(),bindings=requests.map(r=>{
  const n=counts.get(r.eventRoleId)??0;counts.set(r.eventRoleId,n+1);
  const a=affordances.find(a=>a.eventRoleId===r.eventRoleId&&(a.occurrenceIndex??0)===n),group=a?labels.indexOf(a.trackLabel):5;
  const precision=!a||a.permitted.kind==='omit'?0:a.permitted.kind==='preserve'?1:a.permitted.kind==='coarsen-to-participant'?2:3;
  const detail=a&&group!==0&&!seen.has(a.trackLabel)?list([features(a.trackLabel),list([])]):list([]);if(a)seen.add(a.trackLabel);
  return list([u(roles.indexOf(r.eventRoleId)+1),semanticReferentValue(r.semanticReferent.semanticReferentId),u(precision),u(group),u(0),detail]);
 });
 const world=channel(SKIP_ROPE_SCHEMA.eventTypeId,bindings),paddingWorld=channel('event-type/ordinal-padding',[list([u(10),semanticReferentValue(CANONICAL_BINDING_REQUESTS[0].semanticReferent.semanticReferentId),u(0),u(5)])]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(CURRENT_SEM_SOURCE))return v;const p=[...items(a[3],'list')];p[3]=list([false,false,false,false]);p[4]=features(labels[0]);p[5]=list([]);p[6]=padding?list([text(TRUTH_SCENE),list([paddingWorld,world])]):world;a[3]=list(p);return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},profile,padding,observer,affordances,requests,labels};
}
export {MINA,DARIUS,GLEN,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
