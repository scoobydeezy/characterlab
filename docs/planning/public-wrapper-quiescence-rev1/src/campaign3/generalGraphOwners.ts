/** State/receipt adapters for event-association-settlement/0.1-candidate and
 * event-presentation-settlement/0.1-candidate. Both use the instant's B0, and the
 * presentation owner consumes an actual memory-owner result for loss cleanup. */
import {canonicalEncode as enc,list,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {canonicalOperationKeyIndex} from './canonicalChildKeys';
import {settleEventAssociation} from './eventAssociationSettlement';
import {settleEventPresentationHistory} from './eventPresentationSettlement';
import {exact} from './embodiedMath';
import type {compileGeneralAccessors} from './generalAccessors';
import type {compileGeneralMemoryOwner} from './generalMemoryOwner';
import type {compileGeneralOutputSlots,GeneralOutputReceipt} from './generalOutputSlots';
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA graph instant');return v.value;};
export function compileGeneralGraphOwners(definitions:ReadonlyMap<string,RecordValue>,accessors:ReadonlyMap<string,ReturnType<typeof compileGeneralAccessors>>,memory:ReturnType<typeof compileGeneralMemoryOwner>){
 const context=generalBindingContext(),who=generalSubject(),parameters=rec(f(definitions.get(key(d('association')))!,4n),689n),bounds=rec(f(definitions.get(key(d('graph-retention')))!,4n),693n),scale=uint(f(parameters,1n));
 const path=(root:bigint):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:who.character}]});
 const patch=(root:bigint,before:CanonicalValue,next:CanonicalValue):StatePatch=>({operations:key(before)===key(next)?[]:[{kind:'set',path:path(root),expected:{presence:true,value:before},newValue:next}]});
 return Object.freeze({
  association(state:AuthoritativeState,tx:Instant,formation:GeneralOutputReceipt|undefined,now:bigint){
   tx.assertActive();
   const stage=formation?'event-association-formation':'event-association-retention',read=accessors.get(stage)!.construct(state,who.observer,now),prior=rec(read.read('accessor/general-attention-association-prior'),625n);
   const originalKeys=items(f(prior,1n),'list'),originalWeights=items(f(prior,2n),'list').map(row=>items(f(rec(row,624n),1n),'list').map(n=>Q.of(uint(n),scale)));
   let activations:{key:CanonicalValue;strength:Q}[]|null=null;
   if(formation){const outputs=tx.outputsFrom(formation,['visual-acquisition-evidence']).bytes;if(outputs.length!==1)fail('GA graph requires actual event acquisition');
    const a=rec(decode(outputs[0],context),549n);if(key(f(a,2n))!==key(who.observer)||at(f(a,3n))!==now)fail('GA graph formation subject/time');
    activations=items(f(rec(f(a,6n),547n),2n),'list').map(child=>{const e=rec(f(rec(child,544n),1n),620n);return {key:f(rec(f(e,1n),530n),2n),strength:exact(f(e,5n))};});}
   const index=canonicalOperationKeyIndex([...originalKeys,...(activations?.map(a=>a.key)??[])]);
   const result=settleEventAssociation({prior:{keys:originalKeys.map(index.label),weights:originalWeights,lastUpdatedAt:at(f(prior,3n))},now,formation:activations?.map(a=>({key:index.label(a.key),strength:a.strength}))??null,calibration:{scale,eta:exact(f(parameters,2n)),lambda:exact(f(parameters,3n))},capacity:{nodes:Number(uint(f(bounds,1n))),edges:Number(uint(f(bounds,2n)))}});
   const next=decode(enc(r(625,[list(result.keys.map(index.original)),list(result.weights.map(row=>r(624,[list(row.map(q=>{const mass=q.multiply(Q.of(scale));if(mass.denominator!==1n)fail('GA graph nonlattice mass');return u(mass.numerator);}))]))),signed(result.lastUpdatedAt)])),context),changes=patch(631n,prior,next);
   return Object.freeze({patch:()=>structuredClone(changes),actualReadRecords:()=>read.actualReadRecords(),valueBytes:()=>enc(next)});
  },
  presentations(state:AuthoritativeState,tx:Instant,ownerResult:object|undefined,recollections:readonly GeneralOutputReceipt[],now:bigint){
   tx.assertActive();
   const read=accessors.get('event-presentation-owner')!.construct(state,who.observer,now),prior=rec(read.read('accessor/general-attention-presentations-prior'),595n);
   const priorHistory=items(f(prior,1n),'list').map(v=>{const row=rec(v,594n);return {acquisition:ordinal(f(row,1n)),instants:items(f(row,2n),'list').map(at)};});
   // With no memory owner in this batch there is no formation or loss. The
   // presentation owner's own history supplies its event inventory and original
   // acquisition instant; no undeclared ordinary-memory read is necessary.
   const unchanged=priorHistory.map(h=>({id:h.acquisition,kind:'EventContinuant' as const,acquiredAt:h.instants[0]}));
   const result=ownerResult===undefined?{prior:unchanged,formed:[],survivors:unchanged.map(a=>a.id)}:memory.inspectSettlement(tx,ownerResult,now);
   const presentations=recollections.flatMap(receipt=>tx.outputsFrom(receipt,['current-recollection','consequence-recollection']).bytes.flatMap(bytes=>{
    const row=rec(decode(bytes,context),590n);if(key(f(row,2n))!==key(who.character)||at(f(row,3n))!==now)fail('GA presentation subject/time');
    const content=f(row,4n);if(typeof content==='boolean'||content.kind!=='record')fail('GA recollection content');if(content.schema.typeId===589n)return [];
    const winner=rec(content,588n),evidence=rec(f(winner,1n),587n);return [{recollection:ordinal(f(row,1n)),acquisition:ordinal(f(evidence,1n))}];
   }));
   const history=settleEventPresentationHistory({now,priorAcquisitions:result.prior,formed:result.formed,survivingAcquisitions:result.survivors,priorHistory,presentations});
   const next=decode(enc(r(595,[list(history.map(row=>r(594,[typedIdentifier(1145,u(row.acquisition)),list(row.instants.map(signed))])))])),context),changes=patch(632n,prior,next);
   return Object.freeze({patch:()=>structuredClone(changes),actualReadRecords:()=>read.actualReadRecords(),valueBytes:()=>enc(next)});
  },
 });
}
