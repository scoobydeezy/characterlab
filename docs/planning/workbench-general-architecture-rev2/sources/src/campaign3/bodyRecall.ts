/** body-recall-recency-component/0.1-candidate. Supplied safe cue; public authentication is upstream. */
import {fragmentRetainedUnits} from './retentionFragmentation';
import type {TimedAcquisition} from './recencyRetention';
import {canonicalEncode,unsigned} from '../substrate/canonicalEncoding';
export type BodyRecallCue=Readonly<{kind:'Absent'}>|Readonly<{kind:'Present';signals:readonly string[]}>;
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
export function recallBodyByAcquisitionRecency(memory:readonly TimedAcquisition[],cue:BodyRecallCue,now:bigint,slots:number){
 if(typeof now!=='bigint'||now<0n||!Number.isInteger(slots)||slots<0||slots>32)throw Error('BODY_RECALL_DOMAIN');
 if(!cue||typeof cue!=='object'||!['Absent','Present'].includes(cue.kind))throw Error('BODY_RECALL_CUE');
 const signals=new Set<string>();
 if(cue.kind==='Present'){
  if(!Array.isArray(cue.signals)||cue.signals.length<1||cue.signals.length>16||Object.keys(cue.signals).length!==cue.signals.length)throw Error('BODY_RECALL_CUE');
  for(const s of cue.signals){if(typeof s!=='string'||!s.length||s.normalize('NFC')!==s||new TextEncoder().encode(s).length>64||signals.has(s))throw Error('BODY_RECALL_CUE');signals.add(s);}
 }
 // Reuse only fragmentation's structural validation/detachment, not retention ordering.
 const detached=fragmentRetainedUnits(memory,[],{EventContinuant:0,Interoceptive:1024});
 const times=new Map<bigint,bigint>();
 for(const a of memory){if(a.kind!=='Interoceptive'||typeof a.acquiredAt!=='bigint'||a.acquiredAt<0n||a.acquiredAt>now)throw Error('BODY_RECALL_MEMORY');times.set(a.id,a.acquiredAt);}
 const eligible=detached.acquisitions.filter(a=>a.units.some(u=>signals.has(u.key))).map(a=>({...a,acquiredAt:times.get(a.id)!}));
 eligible.sort((a,b)=>a.acquiredAt!==b.acquiredAt?(a.acquiredAt>b.acquiredAt?-1:1):compare(canonicalEncode(unsigned(a.id)),canonicalEncode(unsigned(b.id))));
 return {eligible:Object.freeze(eligible.map(a=>a.id)),recalled:eligible.slice(0,slots)};
}
