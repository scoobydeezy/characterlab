/** Actual cue, recall and publication adapters. Recall reads use the canonical
 * erasure; publication consumes the component's single-use view. */
import {canonicalEncode as enc,list,set,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {exact,atom} from './embodiedMath';
import {admitLocalReserveSignalCue} from './bodySignalCue';
import {prepareEventRecollections,prepareBodyRecollections,publishRecollections,closeRecollections,takeEventPresentation,type RecollectionView} from './recollectionProduction';
import {canonicalAcquisitionChildren} from './generalMemoryOwner';
import {generalDeliveredConcern,generalConcernModulation} from './generalConcernProduction';
import type {GeneralSelectionSource} from './generalSelectionProduction';
import type {compileGeneralAccessors} from './generalAccessors';
const context=generalBindingContext(),who=generalSubject(),ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA recall time');return v.value;};
const occurrence=(ns:number,n:bigint)=>typedIdentifier(ns,u(n));
export function compileGeneralRecallProduction(definitions:ReadonlyMap<string,RecordValue>,accessors:ReadonlyMap<string,ReturnType<typeof compileGeneralAccessors>>){
 const parameter=(name:string,type:bigint)=>rec(f(definitions.get(key(d(name)))??fail('GA recall definition'),4n),type);
 const event=parameter('event-recall',690n),body=parameter('body-recall',691n),feedbackPolicy=parameter('feedback',694n);
 const calibration={beta:exact(f(event,1n)),scale:uint(f(event,2n)),lambda:exact(f(event,3n)),exponent:Number(uint(f(event,4n))),omegaB:exact(f(event,5n)),omegaA:exact(f(event,6n)),k:Number(uint(f(event,7n)))};
 const subject={observer:txt(identity(who.observer).payload),character:'holder'};
 function bodyCue(source:GeneralSelectionSource){
  const samples=rec(decode(enc(source.samples),context),656n),now=time(f(samples,2n)),experience=samples.fields.get(8n),b=rec(f(samples,4n),654n);if(key(f(samples,1n))!==key(who.observer))fail('GA cue subject');
  const declarations=items(f(b,4n),'set').map(v=>{const row=rec(v,598n);return {channel:identity(f(row,1n)),signal:txt(identity(f(row,2n)).payload)};});
  const admitted=admitLocalReserveSignalCue({observer:who.observer,at:now,opportunityId:experience?ordinal(experience):null,samples:items(f(b,3n),'list'),declarations},now,true);
  const fields=new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(now)],[4n,u(admitted.cue.kind==='Present'?1:2)],[5n,set(admitted.cue.kind==='Present'?admitted.cue.signals.map(s=>typedIdentifier(1045,{kind:'text',value:s})):[])],[6n,set(admitted.provenance.supportingObservationIds)]]);if(experience)fields.set(3n,experience);
  return decode(enc(r(606,fields)),context);
 }
 function publisher(view:RecollectionView,winners:ReadonlyMap<bigint,CanonicalValue>,isEvent:boolean,now:bigint){
  return {publish(allocate:()=>bigint){const publication=publishRecollections(view,allocate),outputs=publication.recollections.map(row=>{
   const winner=winners.get(row.content.winner.id)??fail('GA publisher winner');return decode(enc(r(590,[occurrence(1148,row.occurrence),who.character,signed(now),winner])),context);
  });if(isEvent)takeEventPresentation(publication);return outputs;},close:()=>closeRecollections(view)};
 }
 return Object.freeze({
  bodyCue,
  eventCue(source:GeneralSelectionSource){
   const samples=rec(decode(enc(source.samples),context),656n),now=time(f(samples,2n));if(key(f(samples,1n))!==key(who.observer))fail('GA cue subject');
   const visual=rec(f(samples,6n),610n),detections=items(f(visual,5n),'list');if(detections.length>1)fail('GA cue requires singular safe detection');
   const detection=detections.length?f(rec(detections[0],609n),1n):undefined;
   const track=detection?source.tracking.tracks.find(t=>t.currentDetectionId.detectionOccurrenceId===ordinal(f(rec(detection,214n),2n))):undefined;
   if(detection&&!track)fail('GA cue missing actual track');
   const experience=samples.fields.get(8n),visualFields=new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,f(visual,1n)],[3n,signed(now)],[5n,u(track?1:2)]]);
   if(experience)visualFields.set(4n,experience);if(track){visualFields.set(6n,detection!);visualFields.set(7n,perceptualReferentIdValue(track.perceptualReferentId));}
   return decode(enc(r(623,visualFields)),context);
  },
  cues(source:GeneralSelectionSource){return {event:this.eventCue(source),body:bodyCue(source)};},
  event(state:AuthoritativeState,cue:CanonicalValue,now:bigint,lane:'current'|'consequence'='current',delivery?:CanonicalValue){
   const feedback=delivery?generalConcernModulation(generalDeliveredConcern(delivery,now),now,f(feedbackPolicy,2n)===true):undefined;
   const c=rec(decode(enc(cue),context),623n),read=accessors.get(delivery?'prior-concern-event-rank':lane+'-event-rank')!.construct(state,who.observer,now,c),evidence=new Map<bigint,RecordValue>();
   const prepared=prepareEventRecollections(subject,uint(f(c,5n))===1n?{kind:'Present',key:f(c,7n)}:{kind:'Absent'},now,feedback?{...calibration,omegaA:feedback.result.omegaA}:calibration,()=>{
    const memory=items(read.read('accessor/general-attention-event-recall-evidence'),'list').map(v=>{const a=rec(v,587n),id=ordinal(f(a,1n));evidence.set(id,a);return {id,acquiredAt:time(f(a,3n)),units:canonicalAcquisitionChildren(a,false).map(c=>({key:f(rec(c.childKey,571n),1n),views:c.views}))};});
    const graph=rec(read.read('accessor/general-attention-association-prior'),625n),history=rec(read.read('accessor/general-attention-presentations-prior'),595n);
    return {memory,graph:{keys:items(f(graph,1n),'list'),weights:items(f(graph,2n),'list').map(row=>items(f(rec(row,624n),1n),'list').map(n=>Q.of(uint(n),calibration.scale)))},presentations:new Map(items(f(history,1n),'list').map(v=>{const row=rec(v,594n);return [ordinal(f(row,1n)),items(f(row,2n),'list').map(time)];}))};
   });
   const e=prepared.evaluation,winners=new Map(e.recalled.map(a=>[a.id,r(588,[evidence.get(a.id)!,atom(e.scores.find(s=>s.acquisition===a.id)!.score)])]));
   const result=decode(enc(r(592,[who.observer,who.character,signed(now),u(e.disposition==='Evaluated'?2:1),list(e.scores.map(s=>r(591,[occurrence(1145,s.acquisition),atom(s.base),atom(s.pull),atom(s.score)]))),list([...winners.values()])])),context);
   return Object.freeze({result:()=>decode(enc(delivery?r(643,[result,delivery,feedback!.value]):result),context),actualReadRecords:()=>read.actualReadRecords(),...publisher(prepared.view,winners,true,now)});
  },
  body(state:AuthoritativeState,cue:CanonicalValue,now:bigint,lane:'current'|'consequence'|'goal-baseline'='current'){
   const c=rec(decode(enc(cue),context),606n),read=accessors.get(lane==='goal-baseline'?'goal-baseline-rank':lane+'-body-rank')!.construct(state,who.observer,now,c),available=uint(f(c,4n))===1n,evidence=new Map<bigint,RecordValue>();
   const slots=lane==='goal-baseline'?parameter('goal-baseline-recall',691n):body;
   const prepared=prepareBodyRecollections(subject,available?{kind:'Present',signals:items(f(c,5n),'set').map(v=>txt(identity(v).payload))}:{kind:'Absent'},now,Number(uint(f(slots,1n))),()=>items(read.read('accessor/general-attention-body-recall-evidence'),'list').map(v=>{const a=rec(v,587n),id=ordinal(f(a,1n));evidence.set(id,a);return {id,kind:'Interoceptive',acquiredAt:time(f(a,3n)),units:canonicalAcquisitionChildren(a,false).map(c=>({key:txt(identity(f(rec(c.childKey,572n),1n)).payload),views:c.views}))};}));
   const e=prepared.evaluation,winners=new Map(e.recalled.map(a=>[a.id,r(589,[evidence.get(a.id)!])]));
   const result=decode(enc(r(593,[who.observer,who.character,signed(now),u(available?2:1),set(e.eligible.map(id=>occurrence(1145,id))),list([...winners.values()])])),context);
   return Object.freeze({result:()=>decode(enc(result),context),actualReadRecords:()=>read.actualReadRecords(),...publisher(prepared.view,winners,false,now)});
  },
 });
}
