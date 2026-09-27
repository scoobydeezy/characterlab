/** general-attention-recall-projection/0.1-candidate.
 * Projection of an admitted B0 owner leaf. Public PRJ/accessor and cue gates are upstream. */
import {canonicalEncode,bytesToHex,list,signed,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {decodeGeneralAttention,generalAttentionRecord,generalAttentionSchema} from './generalAttentionCodecs';
import {validateGeneralPrimitive,type GeneralPrimitiveContext} from './generalPrimitiveGrammar';
import type {RetentionKind} from './retentionFragmentation';
type R=Extract<CanonicalValue,{kind:'record'}>;
function fail(why:string):never{throw Error('CANONICAL_RECALL_PROJECTION_'+why);}
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
function rec(v:CanonicalValue):R{if(typeof v==='boolean'||v.kind!=='record')fail('RECORD');return v;}
function field(v:R,n:number):CanonicalValue{return v.fields.get(BigInt(n))??fail('FIELD');}
function items(v:CanonicalValue):readonly CanonicalValue[]{if(typeof v==='boolean'||v.kind!=='list')fail('LIST');return v.items;}
export function projectCanonicalRecallPartition(input:CanonicalValue,observer:TypedIdentifierValue,kind:RetentionKind,now:bigint,context:GeneralPrimitiveContext):readonly R[]{
 if(kind!=='EventContinuant'&&kind!=='Interoceptive')fail('KIND');
 validateGeneralPrimitive('Instant',signed(now));
 if(observer.namespaceId!==1000n||typeof observer.payload==='boolean'||observer.payload.kind!=='text'||!observer.payload.value)fail('OBSERVER');
 const observerKey=key(observer),ledger=rec(decodeGeneralAttention(canonicalEncode(input),context));
 if(ledger.schema.typeId!==generalAttentionSchema('SurvivingEpisodeLedger').typeId)fail('LEDGER');
 const entries=items(field(ledger,1)).map(rec),seen=new Set<string>();
 // Check the entire owner before choosing a partition. Invalid siblings cannot
 // disappear merely because this ranker reads the other kind.
 for(const a of entries){
  const id=key(field(a,1));if(seen.has(id))fail('DUPLICATE_ACQUISITION');seen.add(id);
  if(key(field(a,2))!==observerKey)fail('OBSERVER');
  const at=field(a,3);if(typeof at==='boolean'||at.kind!=='signed'||at.value>=now)fail('PRIOR');
 }
 const eventType=generalAttentionSchema('SurvivingEventContent').typeId;
 const result:R[]=[];
 for(const a of entries){
  const content=rec(field(a,6)),event=content.schema.typeId===eventType;
  if(event!==(kind==='EventContinuant'))continue;
  const children=items(field(content,event?2:1)).map(v=>field(rec(v),1));
  const evidence=generalAttentionRecord(event?'PositiveEventAcquisitionContent':'PositiveBodyAcquisitionContent',event?[field(content,1),list(children)]:[list(children)],context);
  result.push(generalAttentionRecord('RecalledAcquisitionEvidence',[field(a,1),field(a,2),field(a,3),field(a,4),field(a,5),evidence],context));
 }
 return result;
}
