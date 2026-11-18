/** Exact positional presentation/access port; no state owner or source factory. */
import {ExactRational as Q} from '../substrate/exactMath';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {list,signed,unsigned,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items} from '../campaign2/canonicalData';
export const POSITION_PRESENTATION='assembled-position-presentation/0.1',POSITION_ACCESS='assembled-position-access/0.1',POSITION_PRESENTATION_VERSION='assembled-character-position-presentation/0.1-candidate';
export type PositionAccessLaw='PresentationFrequency'|'RecencyOnly';
const fail=(s:string):never=>{throw Error('position presentation: '+s);};
const time=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='signed'&&v.value>=0n?v.value:fail('time');
export function positionHistory(v:CanonicalValue){
 const a=items(v,'list');if(a.length!==11)fail('version');const acquired=time(a[5]),h=items(a[10],'list').map(time);
 if(h.length<1||h.length>1024||h[0]!==acquired||h.some((t,i)=>i>0&&(t<=acquired||t<h[i-1])))fail('acquisition/history order or capacity');return h;
}
export function assertPositionHistoryUpdate(before:CanonicalValue,after:CanonicalValue){
 const a=positionHistory(before),b=positionHistory(after);
 if(b.length<a.length||a.some((t,i)=>t!==b[i])||b.length>a.length&&(b[a.length]<=a[a.length-1]||b.slice(a.length).some(t=>t!==b[a.length])))fail('append authentic batch only');
}
export function appendPositionPresentations(v:CanonicalValue,at:bigint,count:number){
 const a=items(v,'list'),h=positionHistory(v);
 if(typeof at!=='bigint'||at<=h[h.length-1]||!Number.isSafeInteger(count)||count<1||h.length+count>1024)fail('publication batch clock/capacity');
 const next=list([...a.slice(0,10),list([...h,...Array.from({length:count},()=>at)].map(signed))]);assertPositionHistoryUpdate(v,next);return next;
}
export interface PositionAccessCandidate {acquisition:bigint;acquiredAt:bigint;history:readonly bigint[]}
const compare=(x:bigint,y:bigint)=>{const a=enc(unsigned(x)),b=enc(unsigned(y));for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
/** Chunking changes only the accepted domain, never the exact sum or global rank. */
export function rankPositionPresentations(rows:readonly PositionAccessCandidate[],now:bigint,slots:number,law:PositionAccessLaw){
 if(typeof now!=='bigint'||now<0n||!Number.isSafeInteger(slots)||slots<0||slots>32||rows.length>1024||!['PresentationFrequency','RecencyOnly'].includes(law))fail('rank domain');
 const seen=new Set<bigint>(),scores=rows.map(row=>{
  if(typeof row.acquisition!=='bigint'||row.acquisition<0n||seen.has(row.acquisition)||typeof row.acquiredAt!=='bigint'||row.acquiredAt<0n||row.acquiredAt>=now||row.history.length<1||row.history.length>1024||row.history[0]!==row.acquiredAt)fail('rank acquisition/history');
  seen.add(row.acquisition);let last=row.acquiredAt,base=Q.of(0n);
  for(const [i,t]of row.history.entries()){if(typeof t!=='bigint'||t>=now||t<last||i>0&&t<=row.acquiredAt)fail('prior ordered history');last=t;}
  for(let i=0;i<row.history.length;i+=32)base=base.add(presentationAccessibility(row.history.slice(i,i+32),now,Q.of(1n),1));
  return {acquisition:row.acquisition,acquiredAt:row.acquiredAt,base,pull:Q.of(1n),score:base.add(Q.of(1n))};
 });
 const ranked=[...scores].sort((a,b)=>law==='PresentationFrequency'?b.score.compare(a.score)||compare(a.acquisition,b.acquisition):a.acquiredAt!==b.acquiredAt?(a.acquiredAt>b.acquiredAt?-1:1):compare(a.acquisition,b.acquisition));
 return {scores,eligible:ranked.map(x=>x.acquisition),selected:ranked.slice(0,slots).map(x=>x.acquisition)};
}
