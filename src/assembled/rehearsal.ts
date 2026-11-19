/** Controlled carried queries; all psychology stays in ordinary shared stages. */
import {list,text,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataText as txt,dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {RETAINED_ATTRIBUTION,validateAttributionCue,isAttributionCue} from './retainedAttribution';
import {named} from './significance';
import {BODY_OBSERVER} from './body';
import {WORKSPACE,type BodyRecallDelivery} from './workspace';
export const REHEARSAL='assembled-rehearsal/0.1',REHEARSAL_USE='assembled-rehearsal-use/0.1',REHEARSAL_VERSION='assembled-character-rehearsal/0.1-candidate';
export interface Rehearsal {readonly anchor:bigint;readonly destinations:readonly bigint[];readonly final?:Readonly<{at:bigint;slots:number;cue:boolean}>}
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','rehearsal '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('time');return v.value;};
export function compileRehearsal(v:CanonicalValue,finalEnabled=false):Rehearsal{
 const a=items(v,'list');if(a.length!==(finalEnabled?4:3)||txt(a[0])!==REHEARSAL)fail('declaration');
 const anchor=time(a[1]),destinations=items(a[2],'list').map(time);
 if(anchor>=1000000n||destinations.length>3||destinations.some((d,i)=>d<=(i?destinations[i-1]:anchor)||d>1000000n))fail('schedule domain/order');
 const final=finalEnabled?items(a[3],'list'):[];
 if(final.length&&(final.length!==3||time(final[0])<=(destinations.at(-1)??anchor)||time(final[0])>1000000n||uint(final[1])>32n||typeof final[2]!=='boolean'))fail('final query domain/order');
 return Object.freeze({anchor,destinations:Object.freeze(destinations),...(final.length?{final:Object.freeze({at:time(final[0]),slots:Number(uint(final[1])),cue:final[2] as boolean})}:{})});
}
export const isCarriedCue=(v:CanonicalValue)=>isAttributionCue(v)&&items(v,'list').length===5;
export function rehearsalContext(event:ScheduledEvent,outputs:readonly CanonicalValue[],deliveries:readonly BodyRecallDelivery[],C:CanonicalValue){
 if(event.phase!==40n||txt(event.eventTypeId.payload)!=='event/deliberation-opportunity')return undefined;
 const reports=(tag:string)=>outputs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&eq(v.items[0],text(tag)));
 const ws=reports(WORKSPACE),as=reports(RETAINED_ATTRIBUTION);
 if(ws.length!==1||as.length!==1)fail('actual workspace/attribution');
 const w=items(ws[0],'list'),a=items(as[0],'list');
 if(!eq(w[1],signed(event.dueAt))||!eq(a[1],w[1])||!eq(f(rec(w[3],381n),2n),C))fail('workspace subject/time');
 if(!items(a[2],'list').length)return {workspace:ws[0],attribution:as[0],delivery:undefined};
 validateAttributionCue(a[2],C,event.dueAt);
 const matches=deliveries.filter(d=>eq(d.character,C)&&d.event.dueAt===event.dueAt&&d.event.phase===20n&&eq(d.event.payload,a[2]));
 if(matches.length!==1)fail('actual cue delivery');
 return {workspace:ws[0],attribution:as[0],delivery:matches[0]};
}
/** Addresses are actual semantic reads of a Supported result, never its target list. */
export function rehearsalOperands(event:ScheduledEvent,workspace:CanonicalValue,attribution:CanonicalValue,deliveries:readonly BodyRecallDelivery[],C:CanonicalValue){
 if(event.phase!==50n||txt(event.eventTypeId.payload)!=='event/task-appraisal')fail('consumer lifecycle');
 const w=items(workspace,'list'),a=items(attribution,'list');
 if(a.length!==5||txt(a[0])!==RETAINED_ATTRIBUTION||!eq(w[1],signed(event.dueAt))||!eq(a[1],w[1])||!eq(f(rec(w[3],381n),2n),C))fail('consumer subject/time');
 if(!items(a[2],'list').length)return [];
 if(!isCarriedCue(a[2]))return [];
 const cue=validateAttributionCue(a[2],C,event.dueAt);
 const actual=deliveries.filter(d=>eq(d.character,C)&&d.event.dueAt===event.dueAt&&d.event.phase===20n&&eq(d.event.payload,a[2]));
 if(actual.length!==1)fail('consumer current delivery');
 if(txt(named(a[4],'kind'))!=='Result')return [];
 const r=named(a[4],'result');
 if(!eq(named(r,'at'),signed(event.dueAt))||!eq(named(r,'character'),text(key(C)))||!eq(named(r,'observer'),text(txt(BODY_OBSERVER.payload)))||!eq(named(r,'consequence'),signed(cue.consequence))||txt(named(r,'transformationVersion'))!=='attribution-production/0.1-candidate')fail('result subject/focus');
 if(txt(named(r,'disposition'))!=='Supported')return [];
 const consumed=items(named(r,'consumed'),'list'),seen=new Set<string>();
 return consumed.map(address=>{
  if(txt(named(address,'unit'))!=='episode')fail('consumed unit');
  const acquisition=named(address,'acquisition'),k=key(acquisition);if(seen.has(k))fail('duplicate consumption');seen.add(k);
  const slots=items(w[4],'list').map(v=>items(v,'list')[1]).filter(v=>eq(signed(uint(id(items(v,'list')[1]).payload)),acquisition));
  if(slots.length!==1||!deliveries.some(d=>eq(d.character,C)&&d.event.dueAt===event.dueAt&&d.event.phase===20n&&txt(d.event.eventTypeId.payload)==='event/assembled-memory-recall'&&d.episodes.some(v=>eq(v,slots[0]))))fail('consumed recalled workspace operand');
  const e=items(slots[0],'list');if(!['assembled-position-episode/0.1','assembled-body-episode/0.1'].includes(txt(e[0]))||time(e[5])>=event.dueAt)fail('consumed prior episode');
  return slots[0];
 });
}

export const FINAL_RECALL='assembled-final-position-recall/0.1';
export const isFinalQuery=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&eq(v.items[0],text(FINAL_RECALL));
export function readFinalQuery(v:CanonicalValue,C:CanonicalValue,at:bigint){
 const a=items(v,'list');if(a.length!==4||!isFinalQuery(v)||!eq(a[1],C)||uint(a[3])>32n)fail('final query payload');
 const present=items(a[2],'list').length>0;if(present){validateAttributionCue(a[2],C,at);if(isCarriedCue(a[2]))fail('final requires natural cue');}
 return {present,slots:Number(uint(a[3]))};
}
