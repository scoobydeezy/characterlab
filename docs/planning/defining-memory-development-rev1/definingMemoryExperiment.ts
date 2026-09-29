/** defining-memory-experiment/0.1-candidate. Restricted component continuation. */
import {canonicalEncode as enc,list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity} from '../campaign2/canonicalData';
import {decodeGeneralAttention} from './generalAttentionCodecs';
import {generalBindingContext} from './generalBindingProfile';
import {canonicalAcquisitionChildren} from './generalMemoryOwner';
import {retainSignificanceFirst,retainSharedProtectionTier} from './significanceFirstRetention';
import {retainWithUseProtection} from './useProtectedRetention';
import {retainByRecency} from './recencyRetention';
import {copySignificantMemory,type SignificantAcquisition} from './directionalSignificanceState';
import {prepareEventRecollections,publishRecollections,takeEventPresentation} from './recollectionProduction';
import {ExactRational as Q} from '../substrate/exactMath';
export const definingLaws=['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'] as const;
export type DefiningLaw=typeof definingLaws[number];
export interface DefiningCase {law:DefiningLaw;admit:boolean;capacity:number;now:number;cue:'matching'|'absent'|'unrelated'}
const hex=(b:Uint8Array)=>Array.from(b,n=>n.toString(16).padStart(2,'0')).join('');
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('DEFINING_TIME');return v.value;};
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
const serial=(v:unknown):string=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?x.toString():x instanceof Uint8Array?hex(x):x instanceof Map?[...x]:x);
export const definingStageBytes=(v:unknown)=>enc(text(serial(v)));
export function definingTraining(stateBytes:Uint8Array){
 const rows=items(decodeGeneralAttention(stateBytes.slice(),generalBindingContext()),'list');
 // State entries use substrate grammar; do not assume an arbitrary source object.
 const leaves=new Map<bigint,CanonicalValue>();
 for(const value of rows){if(typeof value==='boolean'||value.kind!=='record')throw Error('DEFINING_STATE');const path=f(value,1n);if(typeof path==='boolean'||path.kind!=='record')throw Error('DEFINING_PATH');leaves.set(uint(f(path,1n)),f(value,2n));}
 const memory=items(f(rec(leaves.get(630n)!,555n),1n),'list').map(value=>{
  const a=rec(value,554n),children=canonicalAcquisitionChildren(a,true);
  if(children.length!==1)throw Error('DEFINING_SINGLE_CHILD_PROFILE');
  return {id:ordinal(f(a,1n)),acquiredAt:time(f(a,3n)),kind:(rec(f(a,6n), (f(a,6n) as {schema:{typeId:bigint}}).schema.typeId).schema.typeId===552n?'EventContinuant':'Interoceptive') as SignificantAcquisition['kind'],units:children.map(c=>({key:'child',views:c.views.map(b=>b.slice()),useProtection:c.useProtection,outcomeSignificanceDirections:c.directions})),eventKey:children[0].childKey};
 });
 const history=items(f(rec(leaves.get(632n)!,595n),1n),'list').map(v=>{const row=rec(v,594n);return [ordinal(f(row,1n)),items(f(row,2n),'list').map(time)] as const;});
 return {memory:copySignificantMemory(memory,38n),keys:new Map(memory.filter(a=>a.kind==='EventContinuant').map(a=>[a.id,f(rec(a.eventKey,571n),1n)])),presentations:new Map(history)};
}
export function continueDefiningMemory(training:ReturnType<typeof definingTraining>,spec:DefiningCase){
 if(!definingLaws.includes(spec.law)||![0,1,4,8].includes(spec.capacity)||![40,400,4000].includes(spec.now)||!['matching','absent','unrelated'].includes(spec.cue)||typeof spec.admit!=='boolean')throw Error('DEFINING_CASE');
 const before=copySignificantMemory(training.memory,38n),capacity={EventContinuant:spec.capacity,Interoceptive:8},now=BigInt(spec.now);
 // Admission is selected by the harness's authenticated37/38 source, never a bit edit.
 let retained:SignificantAcquisition[];
 if(spec.law==='SignificanceFirst'||spec.law==='SharedProtection')retained=(spec.law==='SignificanceFirst'?retainSignificanceFirst:retainSharedProtectionTier)(before,now,capacity).acquisitions;
 else{const result=spec.law==='UseOnly'?retainWithUseProtection(before,now,capacity):retainByRecency(before,now,capacity);retained=result.acquisitions.map(a=>({...a,units:a.units.map(u=>({...u,useProtection:before.find(b=>b.id===a.id)!.units[0].useProtection,outcomeSignificanceDirections:[...before.find(b=>b.id===a.id)!.units[0].outcomeSignificanceDirections]}))}));}
 const events=retained.filter(a=>a.kind==='EventContinuant'),cue=spec.cue==='absent'?{kind:'Absent' as const}:{kind:'Present' as const,key:spec.cue==='matching'?[...training.keys.values()][0]:text('unrelated-cue')};let reads=0;
 const prepared=prepareEventRecollections({observer:'observer',character:'holder'},cue,now,{beta:Q.of(0n),scale:100n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:1},()=>{reads++;return {memory:events.map(a=>({...a,units:a.units.map(u=>({key:training.keys.get(a.id)!,views:u.views.map(b=>b.slice())}))})),graph:{keys:[],weights:[]},presentations:new Map(events.map(a=>[a.id,training.presentations.get(a.id)??[]]))};});
 let occurrence=0n;const publication=publishRecollections(prepared.view,()=>occurrence++),presentation=takeEventPresentation(publication);
 const result={spec,retained:retained.map(a=>({id:a.id,at:a.acquiredAt,kind:a.kind,units:a.units})),reads,disposition:prepared.evaluation.disposition,scores:prepared.evaluation.scores,publication,presentation};
 return {result,stages:[definingStageBytes(before),definingStageBytes(retained),definingStageBytes(result)],summary:JSON.parse(serial(result))};
}
export function definingCases():DefiningCase[]{const result:DefiningCase[]=[];for(const law of definingLaws)for(const admit of [false,true])for(const capacity of [0,1,4,8])for(const now of [40,400,4000])for(const cue of ['matching','absent','unrelated'] as const)result.push({law,admit,capacity,now,cue});return result;}
export const definingMemoryBytes=(t:ReturnType<typeof definingTraining>,eraseSignificance=false)=>enc(list(t.memory.map(a=>text(serial({...a,units:a.units.map(u=>({...u,outcomeSignificanceDirections:eraseSignificance?[]:u.outcomeSignificanceDirections}))})))));
