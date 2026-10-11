/** selected-spatial-encoding/0.1-candidate; actual selected capability, supplied SEM source join. */
import {canonicalEncode,bytesToHex,typedIdentifier,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeSemanticValue,perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {perceivedBindingEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {closeSelectedView,type SelectedView} from './attentionSelection';
import {encodeSelectedEvidence} from './selectedEncoding';
import {bindSpatialEvidence,type SpatialEvidenceBindingInput} from './spatialEvidenceBinding';
import type {SpatialCalibration} from './spatialContextAllocation';
import {encodingBudget,type EncodingBudget} from './encodingAccessMath';
import {perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {modulatePriorConcern,type PriorConcernCarry} from './priorConcernFeedback';
function prepareOperands(view:SelectedView,source:SpatialEvidenceBindingInput,calibration:SpatialCalibration){
 try{
  const witnesses=bindSpatialEvidence(source,calibration),encoded=encodeSelectedEvidence(view,'independent','role-calibrated');
  const bindings=new Set(source.experience.perceivedBindings.map(b=>bytesToHex(canonicalEncode(perceivedBindingEvidenceValue(b)))));
  for(const e of encoded.evidence)if(e.ref.kind==='perceived-binding'&&!bindings.has(bytesToHex(e.bytes)))throw Error('SPATIAL_ENCODING_BINDING');
  const rows=encoded.rows.map(row=>{
   const evidence=encoded.evidence.find(e=>e.ref.kind==='causal-role'&&row.claimRef.kind==='causal-role'&&e.ref.causalRoleEvidenceId===row.claimRef.causalRoleEvidenceId);if(!evidence)throw Error('SPATIAL_ENCODING_CLAIM');
   const claim=rec(decodeSemanticValue(evidence.bytes),240n);
   if(key(f(claim,2n))!==key(typedIdentifier(1106,unsigned(source.experience.experienceId)))||key(f(claim,3n))!==key(typedIdentifier(1000,text(source.experience.observerId)))||key(f(claim,4n))!==key(perceptualEventReferentIdValue(source.event.perceptualEventReferentId)))throw Error('SPATIAL_ENCODING_EXPERIENCE');
   const witness=witnesses.find(w=>key(perceptualReferentIdValue(w.unit.perceptualReferentId))===row.continuantKey);if(!witness)throw Error('SPATIAL_ENCODING_WITNESS');
   return {continuantKey:row.continuantKey,claimRef:row.claimRef,roleId:row.roleId,witness,base:row.base,role:row.role,...(witness.spatialClass==='SpatialUnknown'?{}:{attention:witness.allocation,raw:row.base.multiply(row.role).multiply(witness.allocation)})};
  });
  return {at:source.experience.occurredAt,evidence:encoded.evidence,rows};
 }finally{closeSelectedView(view);}
}

declare const preparedBrand:unique symbol;
export interface PreparedSpatialEncoding {readonly [preparedBrand]:true}
const prepared=new WeakMap<object,ReturnType<typeof prepareOperands>>();
/** selected-spatial-capability/0.1-candidate. Preparation owns the full-source join. */
export function prepareSelectedSpatialEncoding(view:SelectedView,source:SpatialEvidenceBindingInput,calibration:SpatialCalibration):PreparedSpatialEncoding{
 const operands=prepareOperands(view,source,calibration),token=Object.freeze({}) as PreparedSpatialEncoding;
 prepared.set(token,operands);return token;
}
export function closePreparedSpatialEncoding(token:PreparedSpatialEncoding):void{prepared.delete(token);}
/** One attempt consumes the selected-only capability, including invalid calibration. */
export function encodePreparedSpatialEvidence(token:PreparedSpatialEncoding,law:EncodingBudget){
 return finish(consumePrepared(token),law);
}
function consumePrepared(token:PreparedSpatialEncoding){
 const operands=prepared.get(token);if(!operands)throw Error('SPATIAL_ENCODING_CAPABILITY');prepared.delete(token);
 return operands;
}
function finish(operands:ReturnType<typeof prepareOperands>,law:EncodingBudget,budget=Q.of(1n),threshold=Q.of(1n,4n)){
 const rows=operands.rows;
  const known=rows.filter(r=>r.raw!==undefined),strengths=encodingBudget(known.map(r=>r.continuantKey),known.map(r=>r.raw!),law,budget,threshold),byKey=new Map(known.map((r,i)=>[r.continuantKey,strengths[i]]));
  return {version:'selected-spatial-encoding/0.1-candidate' as const,budgetLaw:law,evidence:operands.evidence,need:'Disabled' as const,surprise:'Disabled' as const,rows:rows.map(r=>{
   const strength=byKey.get(r.continuantKey);return {continuantKey:r.continuantKey,claimRef:r.claimRef,roleId:r.roleId,witness:r.witness,...(strength===undefined?{status:'UnavailableAllocation' as const}:{status:strength.compare(Q.of(0n))>0?'Positive' as const:'KnownZero' as const,factors:{base:r.base,role:r.role,attention:r.attention!,raw:r.raw!},strength})};
  })};
}
/** calibrated-selected-spatial-encoding/0.1-candidate. Exact model calibration, not a runtime budget source. */
export function encodePreparedSpatialWithCalibration(token:PreparedSpatialEncoding,calibration:{readonly law:EncodingBudget;readonly budget:Q;readonly threshold:Q}){
 const operands=consumePrepared(token);
 if(!calibration||Object.getPrototypeOf(calibration)!==Object.prototype)throw Error('SPATIAL_ENCODING_CALIBRATION');
 const fields=Object.getOwnPropertyDescriptors(calibration);if(Reflect.ownKeys(fields).length!==3||['law','budget','threshold'].some(k=>!fields[k]||!('value'in fields[k])))throw Error('SPATIAL_ENCODING_CALIBRATION');
 if(!['independent','historical-shared','historical-hybrid','retired-flat'].includes(calibration.law))throw Error('SPATIAL_ENCODING_CALIBRATION');
 // Validate the bounded model shape even for independent/flat laws that ignore the floor.
 if(!calibration||!(calibration.budget instanceof Q)||calibration.budget.compare(Q.of(0n))<=0||calibration.budget.compare(Q.of(1n))>0||!(calibration.threshold instanceof Q)||calibration.threshold.compare(Q.of(0n))<0||calibration.threshold.compare(Q.of(1n))>0)throw Error('SPATIAL_ENCODING_CALIBRATION');
 return {...finish(operands,calibration.law,calibration.budget,calibration.threshold),version:'calibrated-selected-spatial-encoding/0.1-candidate' as const,calibration:{law:calibration.law,budget:Q.of(calibration.budget.numerator,calibration.budget.denominator),threshold:Q.of(calibration.threshold.numerator,calibration.threshold.denominator)}};
}
/** prior-concern-spatial-encoding/0.1-candidate; subject/delivery authentication upstream. */
export function encodePreparedSpatialWithPriorConcern(token:PreparedSpatialEncoding,law:EncodingBudget,carry:PriorConcernCarry,subject:CanonicalValue,enabled:boolean){
 const operands=consumePrepared(token),feedback=modulatePriorConcern(carry,subject,operands.at,Q.of(1n),enabled);
 const rows=operands.rows.map(row=>{
  if(row.witness.spatialClass!=='SpatialPeripheral')return row;
  const attention=row.attention!.multiply(feedback.residualPool);
  return {...row,attention,raw:row.base.multiply(row.role).multiply(attention),witness:{...row.witness,allocation:attention}};
 });
 return {...finish({...operands,rows},law),feedback};
}
/** Existing immediate convenience composition; it grants no public full-source encoder read. */
export function encodeSelectedSpatialEvidence(view:SelectedView,source:SpatialEvidenceBindingInput,calibration:SpatialCalibration,law:EncodingBudget){
 return encodePreparedSpatialEvidence(prepareSelectedSpatialEncoding(view,source,calibration),law);
}
