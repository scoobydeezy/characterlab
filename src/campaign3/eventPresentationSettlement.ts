/** event-presentation-settlement/0.1-candidate; actual owner-result and presentation authentication are upstream. */
import {canonicalEncode,unsigned} from '../substrate/canonicalEncoding';
export interface PresentationAcquisition {readonly id:bigint;readonly kind:'EventContinuant'|'Interoceptive';readonly acquiredAt:bigint}
export interface PresentationHistoryEntry {readonly acquisition:bigint;readonly instants:readonly bigint[]}
export interface EventPresentationSettlementInput {
 readonly now:bigint;
 readonly priorAcquisitions:readonly PresentationAcquisition[];
 readonly formed:readonly PresentationAcquisition[];
 readonly survivingAcquisitions:readonly bigint[];
 readonly priorHistory:readonly PresentationHistoryEntry[];
 readonly presentations:readonly {readonly recollection:bigint;readonly acquisition:bigint}[];
}
function fail():never{throw Error('EVENT_PRESENTATION_SETTLEMENT');}
function exact(value:unknown,keys:readonly string[]){if(!value||Object.getPrototypeOf(value)!==Object.prototype)fail();const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==keys.length||keys.some(k=>!d[k]||!('value'in d[k])))fail();}
function dense(value:unknown,max:number):asserts value is readonly unknown[]{if(!Array.isArray(value)||Object.getPrototypeOf(value)!==Array.prototype||value.length>max)fail();const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==value.length+1||Object.values(d).some(v=>!('value'in v))||Array.from({length:value.length},(_,i)=>!d[String(i)]).some(Boolean))fail();}
function ordinal(x:unknown):asserts x is bigint{if(typeof x!=='bigint'||x<0n)fail();}
const compare=(a:bigint,b:bigint)=>{const x=canonicalEncode(unsigned(a)),y=canonicalEncode(unsigned(b));for(let i=0;i<Math.min(x.length,y.length);i++)if(x[i]!==y[i])return x[i]-y[i];return x.length-y.length;};
/** No payloads, graph, selection identities, cue or rank scores enter this owner. */
export function settleEventPresentationHistory(input:EventPresentationSettlementInput):PresentationHistoryEntry[]{
 exact(input,['now','priorAcquisitions','formed','survivingAcquisitions','priorHistory','presentations']);ordinal(input.now);
 for(const values of [input.priorAcquisitions,input.formed,input.survivingAcquisitions,input.priorHistory])dense(values,32);dense(input.presentations,32);
 const all=new Map<bigint,PresentationAcquisition>(),prior=new Map<bigint,PresentationAcquisition>();
 for(const [rows,fresh]of [[input.priorAcquisitions,false],[input.formed,true]] as const)for(const a of rows){exact(a,['id','kind','acquiredAt']);ordinal(a.id);ordinal(a.acquiredAt);if(!['EventContinuant','Interoceptive'].includes(a.kind)||all.has(a.id)||(fresh?a.acquiredAt!==input.now:a.acquiredAt>=input.now))fail();all.set(a.id,a);if(!fresh)prior.set(a.id,a);}
 if(all.size>32)fail();
 const survivors=new Set<bigint>();for(const id of input.survivingAcquisitions){ordinal(id);if(!all.has(id)||survivors.has(id))fail();survivors.add(id);}
 const histories=new Map<bigint,bigint[]>();
 for(const row of input.priorHistory){exact(row,['acquisition','instants']);ordinal(row.acquisition);dense(row.instants,32);const a=prior.get(row.acquisition);if(!a||a.kind!=='EventContinuant'||histories.has(row.acquisition)||!row.instants.length||row.instants[0]!==a.acquiredAt)fail();let last=-1n;for(const at of row.instants){ordinal(at);if(at<last||at>=input.now)fail();last=at;}histories.set(row.acquisition,[...row.instants]);}
 if(histories.size!==[...prior.values()].filter(a=>a.kind==='EventContinuant').length)fail();
 const seen=new Set<bigint>();for(const p of input.presentations){exact(p,['recollection','acquisition']);ordinal(p.recollection);ordinal(p.acquisition);if(seen.has(p.recollection)||prior.get(p.acquisition)?.kind!=='EventContinuant')fail();seen.add(p.recollection);const history=histories.get(p.acquisition)!;if(history.length===32)fail();history.push(input.now);}
 for(const a of input.formed)if(a.kind==='EventContinuant')histories.set(a.id,[input.now]);
 // Validate all actual operations before reconciling complete loss. Lost targets
 // cannot conceal malformed history, forged presentations or a profile overflow.
 return [...histories].filter(([id])=>survivors.has(id)).sort(([a],[b])=>compare(a,b)).map(([acquisition,instants])=>({acquisition,instants}));
}
