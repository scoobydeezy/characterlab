/** canonical-event-recall-component/0.1-candidate; supplied authenticated reads/cue. */
import {ExactRational as Q} from '../substrate/exactMath';
import {unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {canonicalOperationKeyIndex} from './canonicalChildKeys';
import {fragmentRetainedUnits} from './retentionFragmentation';
import {composeDirectAssociativeAccess} from './directAssociativeAccess';
import {rankAccessibleEpisodes} from './encodingAccessMath';
export interface CanonicalEventAcquisition {readonly id:bigint;readonly acquiredAt:bigint;readonly units:readonly {readonly key:CanonicalValue;readonly views:readonly Uint8Array[]}[]}
export interface CanonicalEventRecallInput {
 readonly cue:{readonly kind:'Absent'}|{readonly kind:'Present';readonly key:CanonicalValue};
 readonly memory:readonly CanonicalEventAcquisition[];
 readonly graph:{readonly keys:readonly CanonicalValue[];readonly weights:readonly (readonly Q[])[]};
 readonly presentations:ReadonlyMap<bigint,readonly bigint[]>;
 readonly now:bigint;
 readonly calibration:{readonly beta:Q;readonly scale:bigint;readonly lambda:Q;readonly exponent:number;readonly omegaB:Q;readonly omegaA:Q;readonly k:number};
}
export function recallCanonicalEventAcquisitions(input:CanonicalEventRecallInput){
 const p=input.calibration;
 rankAccessibleEpisodes([],new Map(),input.now,p);composeDirectAssociativeAccess([],[],[],new Map(),p.beta,p.scale);
 if(input.cue.kind==='Absent')return {disposition:'UnavailableCue' as const,access:[],scores:[],recalled:[]};
 if(input.cue.kind!=='Present')throw Error('CANONICAL_EVENT_CUE');
 if(!Array.isArray(input.memory)||input.memory.length>32||Array.from({length:input.memory.length},(_,i)=>!Object.hasOwn(input.memory,i)).some(Boolean))throw Error('CANONICAL_EVENT_MEMORY');
 const memory:readonly CanonicalEventAcquisition[]=input.memory;
 for(const a of memory)if(!Array.isArray(a.units)||a.units.length<1||a.units.length>3||typeof a.acquiredAt!=='bigint'||a.acquiredAt<0n||a.acquiredAt>input.now)throw Error('CANONICAL_EVENT_MEMORY');
 const keys=canonicalOperationKeyIndex([...memory.flatMap(a=>a.units.map(u=>u.key)),...input.graph.keys,input.cue.key]);
 const fragments=fragmentRetainedUnits(memory.map(a=>({id:a.id,kind:'EventContinuant',units:a.units.map(u=>({...u,key:keys.label(u.key)}))})),[],{EventContinuant:96,Interoceptive:0}).acquisitions;
 const ids=canonicalOperationKeyIndex(fragments.map(a=>unsigned(a.id))),byId=new Map(memory.map(a=>[a.id,a]));
 const copied=fragments.map(a=>({...a,units:[...a.units].sort((x,y)=>x.key<y.key?-1:1)})).sort((a,b)=>ids.label(unsigned(a.id))<ids.label(unsigned(b.id))?-1:1);
 for(const id of input.presentations.keys())if(!byId.has(id))throw Error('CANONICAL_EVENT_HISTORY');
 const access=composeDirectAssociativeAccess([...new Set(copied.flatMap(a=>a.units.map(u=>u.key)))],input.graph.keys.map(k=>keys.label(k)),input.graph.weights,new Map([[keys.label(input.cue.key),Q.of(1n)]]),p.beta,p.scale);
 const ranked=rankAccessibleEpisodes(copied.map(a=>({key:ids.label(unsigned(a.id)),retainedKeys:a.units.map(u=>u.key),presentations:input.presentations.get(a.id)??[]})),new Map(access.map(a=>[a.key,a.quantized])),input.now,p);
 const idFrom=(label:string)=>{const v=ids.original(label);if(typeof v==='boolean'||v.kind!=='unsigned')throw Error('CANONICAL_EVENT_ID');return v.value;};
 return {disposition:'Evaluated' as const,access:access.map(a=>({...a,key:keys.original(a.key)})),scores:ranked.scored.map(s=>({acquisition:idFrom(s.key),base:s.base,pull:s.pull,score:s.score})),recalled:ranked.selected.map(s=>{const id=idFrom(s.key),a=copied.find(a=>a.id===id)!;return {id,acquiredAt:byId.get(id)!.acquiredAt,units:a.units.map(u=>({key:keys.original(u.key),views:u.views.map(v=>v.slice())}))};})};
}
