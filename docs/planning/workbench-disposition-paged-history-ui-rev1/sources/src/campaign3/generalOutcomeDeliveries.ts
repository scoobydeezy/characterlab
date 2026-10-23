/** Narrow frozen outcome deliveries. The runtime authenticates scheduled target
 * originals; source values are derived from actual output receipts only. */
import {canonicalEncode as enc,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import type {compileGeneralOutputSlots,GeneralOutputReceipt} from './generalOutputSlots';
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;
const context=generalBindingContext(),who=generalSubject(),time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA outcome instant');return v.value;};
const one=(tx:Instant,receipt:GeneralOutputReceipt,stage:string,type:bigint)=>{const outputs=tx.outputsFrom(receipt,[stage]).bytes;if(outputs.length!==1)fail('GA outcome source cardinality');return rec(decode(outputs[0],context),type);};
const later=(sourceAt:bigint,targetAt:bigint)=>{if(targetAt<=sourceAt)fail('GA outcome delivery must be strictly later');};
export function compileGeneralOutcomeDeliveries(){return Object.freeze({
 goal(tx:Instant,receipt:GeneralOutputReceipt){
  const source=one(tx,receipt,'goal-outcome-assessment',568n),goal=rec(f(source,3n),557n),sourceAt=time(f(source,5n));if(key(f(source,2n))!==key(who.observer)||key(f(goal,1n))!==key(who.character))fail('GA goal delivery subject');
  const carry=r(569,[f(source,1n),f(source,2n),goal,f(source,4n),f(source,5n),f(source,8n),f(source,6n)]);
  return Object.freeze({focal(target:CanonicalValue,at:bigint){later(sourceAt,at);return decode(enc(r(680,[who.observer,f(source,4n),signed(sourceAt),target,signed(at)])),context);},qualification(target:CanonicalValue,at:bigint){later(sourceAt,at);return decode(enc(r(570,[target,signed(at),carry,signed(sourceAt)])),context);}});
 },
 attribution(tx:Instant,receipt:GeneralOutputReceipt){
  const source=one(tx,receipt,'retained-attribution',575n),sourceAt=time(f(source,5n));if(key(f(source,2n))!==key(who.observer)||key(f(source,3n))!==key(who.character))fail('GA attribution delivery subject');
  return Object.freeze({delivery(target:CanonicalValue,at:bigint){later(sourceAt,at);return decode(enc(r(683,[who.observer,target,signed(at),source,signed(sourceAt)])),context);}});
 },
 significance(tx:Instant,qualificationReceipt:GeneralOutputReceipt,attributionReceipt:GeneralOutputReceipt,target:CanonicalValue,now:bigint){
  const q=one(tx,qualificationReceipt,'goal-qualification-delivery',570n),a=one(tx,attributionReceipt,'attribution-result-delivery',683n),carry=rec(f(q,3n),569n),attribution=rec(f(a,4n),575n);
  if(key(f(q,1n))!==key(target)||key(f(a,2n))!==key(target)||time(f(q,2n))!==now||time(f(a,3n))!==now||time(f(q,4n))!==time(f(carry,5n))||time(f(a,5n))!==time(f(attribution,5n)))fail('GA significance delivery target/time');
  later(time(f(q,4n)),now);later(time(f(a,5n)),now);
  if(key(f(a,1n))!==key(who.observer)||key(f(carry,2n))!==key(who.observer)||key(f(attribution,2n))!==key(who.observer)||key(f(attribution,3n))!==key(who.character)||key(f(rec(f(carry,3n),557n),1n))!==key(who.character)||key(f(carry,4n))!==key(f(attribution,4n)))fail('GA significance consequence/subject');
  const qualification=f(carry,6n) as RecordValue;
  // The frozen stage emits its one joined result even when no owner credit is
  // qualified. The runtime dispatches a memory credit only in the latter case.
  return {outputs:[decode(enc(r(576,[carry,attribution])),context)],qualifies:qualification.schema.typeId===564n&&uint(f(attribution,7n))===1n};
 },
});}
