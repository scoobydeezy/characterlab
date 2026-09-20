/** Terminal task-cognitive-path/0.1-candidate and prior-concern-feedback-component/
 * 0.1-candidate adapters. Persistent scheduling/ingress authentication is upstream;
 * this component projects only an actual admitted producer receipt. */
import {canonicalEncode as enc,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {appraisalOutput,concernOutput} from '../campaign2/cognitiveTransforms';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalContentId as c,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {projectPriorConcern,modulatePriorConcern,type PriorConcernCarry} from './priorConcernFeedback';
import {exact,atom} from './embodiedMath';
import type {compileGeneralOutputSlots,GeneralOutputReceipt} from './generalOutputSlots';
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;
const context=generalBindingContext(),who=generalSubject();
/** Called only after the runtime authenticates the delivery's scheduled parent and
 * target original. This checks its redundant subject/time and response content. */
export function generalDeliveredConcern(delivery:CanonicalValue,now:bigint):PriorConcernCarry{
 const row=rec(decode(enc(delivery),context),638n),at=f(row,2n);if(typeof at==='boolean'||at.kind!=='signed'||at.value!==now)fail('GA feedback delivery time');
 const value=rec(f(row,3n),(f(row,3n) as RecordValue).schema.typeId),actual=value.schema.typeId===636n,subject=f(value,actual?2n:1n),source=f(value,actual?3n:2n);
 if(typeof source==='boolean'||source.kind!=='signed'||source.value>=now||key(subject)!==key(who.character))fail('GA feedback subject/prior instant');
 const carry:PriorConcernCarry=actual?{kind:'Concern',subject,sourceAt:source.value,concern:f(value,1n),response:f(value,4n)}:{kind:'NoSelectedTask',subject,sourceAt:source.value};
 generalConcernModulation(carry,now,false);return carry;
}
export function generalConcernModulation(carry:PriorConcernCarry,now:bigint,enabled:boolean){
 const result=modulatePriorConcern(carry,who.character,now,Q.of(1n),enabled);
 return {result,value:r(639,[u(['KnownIntensity','Unavailable','NoSelectedTask'].indexOf(result.sourceStatus)+1),u(['EnabledKnown','DisabledFeedback','BaselineWithoutAvailableFeedback'].indexOf(result.branch)+1),atom(result.residualPool),atom(result.omegaA)])};
}
export function compileGeneralConcernProduction(definitions:ReadonlyMap<string,RecordValue>){
 const task=rec(f(definitions.get(key(d('task')))!,4n),370n),concern=rec(f(definitions.get(key(d('concern')))!,4n),385n);
 const criteria=[{taskKey:r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))]),specId:d('task'),minimum:exact(f(task,3n)),maximum:exact(f(task,4n))}];
 const one=(tx:Instant,receipt:GeneralOutputReceipt,stage:string,type:bigint)=>{const outputs=tx.outputsFrom(receipt,[stage]).bytes;if(outputs.length!==1)fail('GA concern parent cardinality');return rec(decode(outputs[0],context),type);};
 return Object.freeze({
  appraisal(tx:Instant,workspace:GeneralOutputReceipt,occurrence:CanonicalValue){return decode(enc(appraisalOutput(occurrence,one(tx,workspace,'prior-concern-workspace',381n),criteria)),context);},
  concern(tx:Instant,appraisal:GeneralOutputReceipt,occurrence:CanonicalValue){return decode(enc(concernOutput(occurrence,one(tx,appraisal,'prior-concern-appraisal',384n),concern)),context);},
  prepareDelivery(tx:Instant,producer:GeneralOutputReceipt,sourceAt:bigint){
   const carry=projectPriorConcern(one(tx,producer,'prior-concern-producer',388n),sourceAt);if(key(carry.subject)!==key(who.character))fail('GA concern producer subject');
   const value=carry.kind==='Concern'?r(636,[carry.concern,carry.subject,signed(sourceAt),carry.response]):r(637,[carry.subject,signed(sourceAt),u(1)]);
   return Object.freeze({
    carry:()=>structuredClone(carry),
    delivery(targetOriginal:CanonicalValue,targetAt:bigint){if(targetAt<=sourceAt)fail('GA concern delivery must be strictly later');return decode(enc(r(638,[targetOriginal,signed(targetAt),value])),context);},
   });
  },
 });
}
