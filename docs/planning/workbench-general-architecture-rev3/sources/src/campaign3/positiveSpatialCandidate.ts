/** positive-spatial-candidate-component/0.1-candidate; no state or occurrence authority. */
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import type {SelectedView} from './attentionSelection';
import type {SpatialEvidenceBindingInput} from './spatialEvidenceBinding';
import type {SpatialCalibration} from './spatialContextAllocation';
import type {EncodingBudget} from './encodingAccessMath';
import {encodeSelectedSpatialEvidence,encodePreparedSpatialEvidence,encodePreparedSpatialWithPriorConcern,encodePreparedSpatialWithCalibration,type PreparedSpatialEncoding} from './selectedSpatialEncoding';
import type {PriorConcernCarry} from './priorConcernFeedback';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
const copy=(q:Q)=>Q.of(q.numerator,q.denominator);
export function encodePositiveSpatialCandidate(view:SelectedView,source:SpatialEvidenceBindingInput,calibration:SpatialCalibration,law:EncodingBudget){
 const evaluation=encodeSelectedSpatialEvidence(view,source,calibration,law);
 return projectPositive(evaluation);
}
/** Prepared variants receive no full observation, source state or unselected evidence. */
export function encodePreparedPositiveSpatialCandidate(token:PreparedSpatialEncoding,law:EncodingBudget){
 return projectPositive(encodePreparedSpatialEvidence(token,law));
}
export function encodePreparedPositiveSpatialWithPriorConcern(token:PreparedSpatialEncoding,law:EncodingBudget,carry:PriorConcernCarry,subject:CanonicalValue,enabled:boolean,calibration?:Parameters<typeof encodePreparedSpatialWithPriorConcern>[5]){
 return projectPositive(encodePreparedSpatialWithPriorConcern(token,law,carry,subject,enabled,calibration));
}
export function encodePreparedPositiveSpatialWithCalibration(token:PreparedSpatialEncoding,calibration:Parameters<typeof encodePreparedSpatialWithCalibration>[1]){return projectPositive(encodePreparedSpatialWithCalibration(token,calibration));}
export function projectPositive<T extends Omit<ReturnType<typeof encodeSelectedSpatialEvidence>,'version'>&{version:string}>(evaluation:T){
 const units=evaluation.rows.filter(r=>r.status==='Positive').map(r=>{
  if(!('factors'in r)||!('strength'in r)||r.witness.spatialClass==='SpatialUnknown')throw Error('POSITIVE_SPATIAL_INVARIANT');
  const bindings=evaluation.evidence.filter(e=>e.ref.kind==='perceived-binding'&&key(f(rec(decodeSemanticValue(e.bytes),224n),4n))===r.continuantKey).map(e=>e.bytes.slice());
  const claims=evaluation.evidence.filter(e=>e.ref.kind==='causal-role'&&r.claimRef.kind==='causal-role'&&e.ref.causalRoleEvidenceId===r.claimRef.causalRoleEvidenceId).map(e=>e.bytes.slice());
  if(!bindings.length||claims.length!==1)throw Error('POSITIVE_SPATIAL_EVIDENCE');
  const w=r.witness;
  return {unit:structuredClone(w.unit),bindings,claims,factors:{base:copy(r.factors!.base),role:copy(r.factors!.role),attention:copy(r.factors!.attention),raw:copy(r.factors!.raw)},strength:copy(r.strength!),spatialWitness:{...w,unit:structuredClone(w.unit),position:{...w.position},allocation:copy(w.allocation)}};
 });
 return {evaluation,candidate:{version:'positive-spatial-candidate-component/0.1-candidate' as const,units}};
}
