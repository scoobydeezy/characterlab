/** Canonical retained-context and focal attribution adapter. Character operands
 * come only from actual recollection publishers, never a memory/source scan. */
import {canonicalEncode as enc,set,signed,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {canonicalAcquisitionChildren} from './generalMemoryOwner';
import {canonicalOperationKeyIndex} from './canonicalChildKeys';
import {groupRetainedPositionTrial} from './retainedContextGrouping';
import {prepareAttributionProduction,produceAttributionResult,closeAttributionProduction} from './attributionProduction';
import {exact} from './embodiedMath';
import {copyPerceivedTrialContext} from './perceivedTrialContext';
import type {AttributionField,PositionPairTrial,ObservedPosition} from './retainedAttributionUse';
import type {AttributionTrial} from './contrastiveAttribution';
import type {compileGeneralAccessors} from './generalAccessors';
import type {compileGeneralOutputSlots,GeneralOutputReceipt} from './generalOutputSlots';
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload),time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA attribution time');return v.value;};
const context=generalBindingContext(),who=generalSubject(),observer=txt(who.observer.payload);
function companion(value:CanonicalValue):ReturnType<typeof copyPerceivedTrialContext>{
 const c=rec(value,543n),event=rec(f(c,2n),213n),panel=rec(f(c,3n),542n);if(key(f(event,1n))!==key(who.observer)||key(f(panel,2n))!==key(who.observer))fail('GA attribution retained observer');
 return {experience:ordinal(f(c,1n)),context:{observerId:observer,observerEventSequence:uint(f(event,2n))},panel:{observation:ordinal(f(panel,1n)),sample:{kind:'Present',at:time(f(panel,3n)),glyph:Number(uint(f(panel,4n))),stage:(['Before','Motion','After'] as const)[Number(uint(f(panel,5n)))-1]}}};
}
export function compileGeneralAttributionProduction(definitions:ReadonlyMap<string,RecordValue>,accessor:ReturnType<typeof compileGeneralAccessors>){
 const signal=f(rec(f(definitions.get(key(d('goal')))!,4n),558n),3n);
 return Object.freeze({prepare(state:AuthoritativeState,tx:Instant,focusReceipt:GeneralOutputReceipt|null,recollections:readonly GeneralOutputReceipt[],now:bigint){
  tx.assertActive();const read=accessor.construct(state,who.observer,now);
  const focus=focusReceipt?tx.outputsFrom(focusReceipt,['focal-consequence-delivery']).bytes:[];if(focusReceipt&&focus.length!==1)fail('GA actual focal delivery');
  const delivery=focus.length?rec(decode(focus[0],context),680n):undefined;
  if(delivery&&(key(f(delivery,1n))!==key(who.observer)||time(f(delivery,5n))!==now))fail('GA focal delivery subject/time');
  const acquisitions=recollections.flatMap(receipt=>tx.outputsFrom(receipt,['current-recollection','consequence-recollection']).bytes.map(bytes=>{
   const pub=rec(decode(bytes,context),590n);if(key(f(pub,2n))!==key(who.character)||time(f(pub,3n))!==now)fail('GA attribution publication');const content=rec(f(pub,4n),(f(pub,4n) as RecordValue).schema.typeId),a=rec(f(content,1n),587n);return a;
  }));
  if(new Set(acquisitions.map(a=>key(f(a,1n)))).size!==acquisitions.length)fail('GA duplicate recalled acquisition');
  const all=acquisitions.map(a=>({a,children:canonicalAcquisitionChildren(a,false)})),index=canonicalOperationKeyIndex(all.flatMap(a=>a.children.map(c=>c.childKey)));
  const memory=all.map(({a,children})=>({id:ordinal(f(a,1n)),acquiredAt:time(f(a,3n)),kind:(f(a,6n) as RecordValue).schema.typeId===547n?'EventContinuant' as const:'Interoceptive' as const,units:children.map(c=>({key:index.label(c.childKey),views:c.views,useProtection:false}))}));
  const rows=all.flatMap(({a,children})=>children.flatMap(c=>c.views.map((bytes,view)=>{
   const childKey=c.childKey as RecordValue,evidence=rec(decode(bytes,context),childKey.schema.typeId===571n?544n:545n),value=evidence.fields.get(2n),ctx=value?companion(value):undefined;
   return {address:{acquisition:ordinal(f(a,1n)),unit:index.label(c.childKey)},view,bytes,context:ctx,event:childKey.schema.typeId===571n,signal:childKey.schema.typeId===572n?f(childKey,1n):undefined};
  }))).filter(row=>row.context&&(row.event?row.context.panel.sample.stage==='Motion':row.context.panel.sample.stage!=='Motion'&&key(row.signal!)===key(signal)));
  const view=prepareAttributionProduction({observer,character:'holder',at:now,focal:delivery?{observer,consequence:ordinal(f(delivery,2n)),sourceAt:time(f(delivery,3n))}:null},()=>{
   if(rows.length!==16||new Set(rows.map(row=>row.context!.experience)).size!==16)return null;
   const contexts=[...new Map(rows.map(row=>[row.context!.context.observerEventSequence,row.context!.context])).entries()].sort(([a],[b])=>a<b?-1:1).map(([,c])=>c);
   if(contexts.length!==4)return null;const groups=contexts.map(c=>groupRetainedPositionTrial(observer,c,rows.map(row=>row.context!)));if(groups.some(g=>g.kind!=='Grouped'))return null;
   const operand=(experience:bigint)=>{const row=rows.find(r=>r.context!.experience===experience)??fail('GA grouped retained operand');return {kind:'Retained' as const,address:row.address,view:row.view};};
   const trials:PositionPairTrial[]=groups.map(g=>{if(g.kind!=='Grouped')return fail('GA incomplete grouping');return {motion:{kind:'RetainedPositionPair',start:operand(g.startExperience),end:operand(g.endExperience)},before:operand(g.beforeExperience),after:operand(g.afterExperience)};});
   const focal=groups.findIndex(g=>g.kind==='Grouped'&&g.afterExperience===ordinal(f(delivery!,2n)));if(focal<0)return null;
   const project=<K extends AttributionField>(bytes:Uint8Array,field:K):AttributionTrial[K]=>{if(field==='motion')return fail('GA separate position projection');const interval=rec(f(rec(f(rec(decode(bytes,context),545n),1n),461n),5n),462n);return {lower:exact(f(interval,1n)),upper:exact(f(interval,2n))} as AttributionTrial[K];};
   const position=(bytes:Uint8Array):ObservedPosition=>{const child=rec(decode(bytes,context),544n),encoding=rec(f(child,1n),620n),witness=rec(f(encoding,6n),612n),p=witness.fields.get(3n),ctx=companion(f(child,2n));return {at:ctx.panel.sample.at,position:p?[Number(uint(f(rec(p,608n),1n))),Number(uint(f(rec(p,608n),2n)))]:null};};
   return [{memory,now,admitted:memory.flatMap(a=>a.units.map(unit=>({acquisition:a.id,unit:unit.key}))),trials,focalTrial:focal},project,position];
  });
  return Object.freeze({actualReadRecords:()=>read.actualReadRecords(),close:()=>closeAttributionProduction(view),produce(allocate:()=>bigint){
   const actual=produceAttributionResult(view,allocate);if(actual.kind==='NoConsequence')return [];
   const a=actual.result,addresses=(values:typeof a.consumed)=>set(values.map(v=>r(573,[typedIdentifier(1145,u(v.acquisition)),index.original(v.unit)])));
   return [decode(enc(r(575,[typedIdentifier(1147,u(a.resultId)),who.observer,who.character,typedIdentifier(1106,u(a.consequence)),signed(now),text(a.transformationVersion),u(a.disposition==='Supported'?1:2),addresses(a.consumed),addresses(a.targets)])),context)];
  }});
 }});
}
