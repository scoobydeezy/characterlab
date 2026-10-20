/** Canonical ordinary-memory-batch/0.1-candidate adapter. All new admissions and
 * acquisitions come from actual output receipts in this instant. Protocol reads
 * belong to the runtime hook, never a cognitive accessor or memory field. */
import {canonicalEncode as enc,list,set,map,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {canonicalOperationKeyIndex} from './canonicalChildKeys';
import {prepareOrdinaryMemoryBatch,prepareAgeOnlyMemoryBatchControl,prepareUseOnlyMemoryBatchControl,prepareSharedProtectionMemoryBatchControl} from './ordinaryMemoryBatch';
import type {FormationSource,FormationCommit,GovernanceEntry,GovernanceKind} from './formationGovernance';
import type {SignificantAcquisition} from './directionalSignificanceState';
import type {compileGeneralAccessors} from './generalAccessors';
import type {compileGeneralOutputSlots,GeneralOutputReceipt} from './generalOutputSlots';
import {extendFormationSourceDomain} from './formationSourceDomain';
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA memory instant');return v.value;};
const entries=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='map')return fail('GA memory map');return v.entries;};
const kind=(value:CanonicalValue):GovernanceKind=>[547n,552n].includes((value as RecordValue).schema.typeId)?'EventContinuant':'Interoceptive';
export function canonicalAcquisitionChildren(entry:RecordValue,retained:boolean){
 const content=rec(f(entry,6n),(f(entry,6n) as RecordValue).schema.typeId),event=kind(content)==='EventContinuant';
 return items(f(content,event?2n:1n),'list').map(v=>{
  const wrapper=retained?rec(v,event?550n:551n):undefined,evidence=rec(wrapper?f(wrapper,1n):v,event?544n:546n);
  const childKey=event?r(571,[f(rec(f(rec(f(evidence,1n),620n),1n),530n),2n)]):r(572,[f(evidence,1n)]);
  return {childKey,evidence,views:event?[enc(evidence)]:items(f(evidence,2n),'list').map(enc),useProtection:wrapper?f(wrapper,2n)===true:false,directions:wrapper?items(f(wrapper,3n),'set').map(v=>uint(v)===1n?'MovingCloser' as const:'MovingFarther' as const):[]};
 });
}
export function compileGeneralMemoryOwner(definitions:ReadonlyMap<string,RecordValue>,accessor:ReturnType<typeof compileGeneralAccessors>){
 const context=generalBindingContext(),who=generalSubject(),retention=rec(f(definitions.get(key(d('retention')))!,4n),692n);
 const prepare=[prepareAgeOnlyMemoryBatchControl,prepareUseOnlyMemoryBatchControl,prepareSharedProtectionMemoryBatchControl,prepareOrdinaryMemoryBatch][Number(uint(f(retention,3n)))-1];
 const memoryPath:StatePath={rootStateTypeId:630n,fieldId:1n,selectors:[{kind:'mapKey',key:who.character}]},protocolPath:StatePath={rootStateTypeId:581n,fieldId:1n,selectors:[]};
 const settlements=new WeakMap<object,{tx:Instant;now:bigint;prior:{id:bigint;kind:GovernanceKind;acquiredAt:bigint}[];formed:{id:bigint;kind:GovernanceKind;acquiredAt:bigint}[];survivors:bigint[]}>();
 function admissionsFrom(tx:Instant,receipts:readonly GeneralOutputReceipt[],now:bigint){
  tx.assertActive();
  const admissions=receipts.map(receipt=>{
   const produced=tx.outputsFrom(receipt,['current-visual-selection','consequence-visual-selection','current-body-selection','consequence-body-selection']);
   const event=produced.stage.endsWith('visual-selection'),audit=produced.bytes.map(b=>decode(b,context)).find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===(event?532n:603n));if(!audit)fail('GA missing actual selection audit');
   const a=rec(audit,event?532n:603n);if(key(f(a,2n))!==key(who.observer)||instant(f(a,3n))!==now)fail('GA selection owner subject/time');
   return {source:r(577,[who.character,f(a,1n)]),selection:f(a,1n),kind:event?'EventContinuant' as const:'Interoceptive' as const};
  });
  if(new Set(admissions.map(a=>key(a.source))).size!==admissions.length)fail('GA duplicate actual source admission');
  return admissions;
 }
 return Object.freeze({
  /** Runtime protocol enrollment for actual zero-formation selectors. This does
   * not invoke a cognitive owner, read ordinary memory, or change successes. */
  enrollSources(state:AuthoritativeState,tx:Instant,receipts:readonly GeneralOutputReceipt[],now:bigint){
   const admissions=admissionsFrom(tx,receipts,now),read=state.read(protocolPath);if(!read.presence)fail('GA missing formation protocol singleton');
   const prior=rec(decode(enc(read.value!),context),580n),old=entries(f(prior,1n));
   const index=canonicalOperationKeyIndex([...old.map(([k])=>k),...admissions.map(a=>a.source)]);
   const source=(v:CanonicalValue,k:GovernanceKind):FormationSource=>{if(key(f(rec(v,577n),1n))!==key(who.character))fail('GA protocol foreign holder');return {character:'holder',source:index.label(v),kind:k};};
   const domain=extendFormationSourceDomain(old.map(([k,v])=>source(k,uint(f(rec(v,578n),1n))===1n?'EventContinuant':'Interoceptive')),admissions.map(a=>source(a.source,a.kind)),32);
   const next=decode(enc(r(580,[map(domain.map(s=>[index.original(s.source),r(578,[u(s.kind==='EventContinuant'?1:2)])])),f(prior,2n)])),context);
   const patch:StatePatch={operations:key(prior)===key(next)?[]:[{kind:'set',path:protocolPath,expected:{presence:true,value:prior},newValue:next}]};
   return Object.freeze({protocolPatch:()=>structuredClone(patch),protocolRead:()=>structuredClone(read)});
  },
  inspectSettlement(tx:Instant,token:object,now:bigint){tx.assertActive();const result=settlements.get(token);if(!result||result.tx!==tx||result.now!==now)fail('GA actual memory owner result required');return structuredClone({prior:result.prior,formed:result.formed,survivors:result.survivors});},
  settleFormation(state:AuthoritativeState,tx:Instant,selectionReceipts:readonly GeneralOutputReceipt[],formationReceipts:readonly GeneralOutputReceipt[],now:bigint,credits:{readonly use?:readonly GeneralOutputReceipt[];readonly significance?:readonly GeneralOutputReceipt[]}={}){
   tx.assertActive();
   const projected=accessor.construct(state,who.observer,now),priorLedger=rec(projected.read('accessor/general-attention-episodes-prior'),555n),prior=items(f(priorLedger,1n),'list').map(v=>rec(v,554n));
   const protocolRead=state.read(protocolPath);if(!protocolRead.presence)fail('GA missing formation protocol singleton');
   const protocol=rec(decode(enc(protocolRead.value!),context),580n),oldSources=entries(f(protocol,1n)),oldSuccesses=entries(f(protocol,2n));
   const admissions=admissionsFrom(tx,selectionReceipts,now);
   const fresh=formationReceipts.flatMap(receipt=>{
    const produced=tx.outputsFrom(receipt,['visual-acquisition-evidence','body-acquisition-evidence']);
    return produced.bytes.map(b=>{const entry=rec(decode(b,context),549n);if(kind(f(entry,6n))!==(produced.stage.startsWith('visual-')?'EventContinuant':'Interoceptive'))fail('GA formation producer kind');return entry;});
   });
   const sourceIndex=canonicalOperationKeyIndex([...oldSources.map(([k])=>k),...admissions.map(a=>a.source)]);
   const source=(v:CanonicalValue,k:GovernanceKind):FormationSource=>{const s=rec(v,577n);if(key(f(s,1n))!==key(who.character))fail('GA protocol foreign holder');return {character:'holder',source:sourceIndex.label(v),kind:k};};
   const domain=oldSources.map(([k,v])=>source(k,uint(f(rec(v,578n),1n))===1n?'EventContinuant':'Interoceptive'));
   const successes:GovernanceEntry[]=oldSuccesses.map(([k,v])=>{const row=rec(v,579n),admitted=oldSources.find(([s])=>key(s)===key(k));if(!admitted)fail('GA orphan protocol success');return {...source(k,uint(f(rec(admitted[1],578n),1n))===1n?'EventContinuant':'Interoceptive'),acquisition:ordinal(f(row,1n)),formedAt:instant(f(row,2n)),completeLoss:f(row,3n)===true};});
   const all=[...prior,...fresh],children=new Map(all.map(a=>[ordinal(f(a,1n)),canonicalAcquisitionChildren(a,a.schema.typeId===554n)]));
   if(children.size!==all.length)fail('GA duplicate acquisition');
   const childIndex=canonicalOperationKeyIndex([...children.values()].flatMap(cs=>cs.map(c=>c.childKey)));
   const addresses=(value:CanonicalValue)=>items(value,'set').map(v=>{const a=rec(v,573n);return {acquisition:ordinal(f(a,1n)),unit:childIndex.label(f(a,2n))};});
   const attribution=(value:CanonicalValue)=>{const a=rec(value,575n);if(key(f(a,2n))!==key(who.observer)||key(f(a,3n))!==key(who.character))fail('GA credit attribution subject');return a;};
   const useResults=(credits.use??[]).flatMap(receipt=>tx.outputsFrom(receipt,['retained-attribution']).bytes.map(bytes=>{const a=attribution(decode(bytes,context));if(instant(f(a,5n))!==now)fail('GA use result instant');return addresses(f(a,8n));}));
   const significance=(credits.significance??[]).flatMap(receipt=>tx.outputsFrom(receipt,['significance-join']).bytes.map(bytes=>{
    const join=rec(decode(bytes,context),576n),qualification=rec(f(join,1n),569n),a=attribution(f(join,2n)),goal=rec(f(qualification,3n),557n);
    if(key(f(qualification,2n))!==key(who.observer)||key(f(goal,1n))!==key(who.character)||key(f(qualification,4n))!==key(f(a,4n))||instant(f(qualification,5n))>=now||instant(f(a,5n))>=now)fail('GA significance source join');
    const q=rec(f(qualification,6n),564n);if(uint(f(a,7n))!==1n)fail('GA significance unsupported attribution');
    return {observer:'observer',character:'holder',direction:uint(f(q,1n))===1n?'MovingCloser' as const:'MovingFarther' as const,targets:addresses(f(a,9n))};
   }));
   const memory=(a:RecordValue):SignificantAcquisition=>({id:ordinal(f(a,1n)),kind:kind(f(a,6n)),acquiredAt:instant(f(a,3n)),units:children.get(ordinal(f(a,1n)))!.map(c=>({key:childIndex.label(c.childKey),views:c.views,useProtection:c.useProtection,outcomeSignificanceDirections:c.directions}))});
   for(const a of all)if(key(f(a,2n))!==key(who.observer))fail('GA memory foreign observer');
   const formed:FormationCommit[]=fresh.map(a=>{const admission=admissions.find(s=>key(s.selection)===key(f(a,4n)));if(!admission||admission.kind!==kind(f(a,6n))||instant(f(a,3n))!==now)fail('GA acquisition actual selection association');return {...source(admission.source,admission.kind),acquisition:ordinal(f(a,1n)),formedAt:now};});
   const batch=prepare({observer:'observer',character:'holder',priorMemory:prior.map(memory),priorProtocol:{domain,successes},incoming:admissions.map(a=>source(a.source,a.kind)),formed,freshMemory:fresh.map(a=>{const m=memory(a);return {...m,units:m.units.map(({key,views})=>({key,views}))};}),now,sourceLimit:32,capacity:{EventContinuant:Number(uint(f(retention,1n))),Interoceptive:Number(uint(f(retention,2n)))},useResults,significance});
   try{
    const result=batch.finish(batch.resolve()),rows=result.memory.map(a=>{
     const original=all.find(v=>ordinal(f(v,1n))===a.id)!,oldContent=rec(f(original,6n),(f(original,6n) as RecordValue).schema.typeId),event=a.kind==='EventContinuant';
     const surviving=a.units.map(unit=>{const child=children.get(a.id)!.find(c=>childIndex.label(c.childKey)===unit.key)!;return r(event?550:551,[child.evidence,unit.useProtection,set(unit.outcomeSignificanceDirections.map(d=>u(d==='MovingCloser'?1:2)))]);});
     const fields=new Map(original.fields);fields.set(6n,r(event?552:553,event?[f(oldContent,1n),list(surviving)]:[list(surviving)]));return r(554,fields);
    });
    const ledger=decode(enc(r(555,[list(rows)])),context),protocolValue=decode(enc(r(580,[map(result.protocol.domain.map(s=>[sourceIndex.original(s.source),r(578,[u(s.kind==='EventContinuant'?1:2)])])),map(result.protocol.successes.map(s=>[sourceIndex.original(s.source),r(579,[typedIdentifier(1145,u(s.acquisition)),signed(s.formedAt),s.completeLoss])]))])),context);
    const patch=(path:StatePath,old:CanonicalValue,value:CanonicalValue):StatePatch=>({operations:key(old)===key(value)?[]:[{kind:'set',path,expected:{presence:true,value:old},newValue:value}]});
    const memoryPatch=patch(memoryPath,priorLedger,ledger),protocolPatch=patch(protocolPath,protocol,protocolValue);
    const token=Object.freeze({memoryPatch:()=>structuredClone(memoryPatch),protocolPatch:()=>structuredClone(protocolPatch),ledgerBytes:()=>enc(ledger),protocolBytes:()=>enc(protocolValue),actualReadRecords:()=>projected.actualReadRecords(),protocolRead:()=>structuredClone(protocolRead),survivors:()=>result.memory.map(a=>a.id)});
    const header=(a:RecordValue)=>({id:ordinal(f(a,1n)),kind:kind(f(a,6n)),acquiredAt:instant(f(a,3n))});settlements.set(token,{tx,now,prior:prior.map(header),formed:fresh.map(header),survivors:result.memory.map(a=>a.id)});return token;
   }finally{batch.close();}
  },
 });
}
