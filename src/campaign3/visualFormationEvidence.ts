/** visual-formation-evidence-component/0.1-candidate. Phase-separated local capabilities. */
import {observerIdValue} from '../semanticBinding/semanticCodecs';
import type {CausalRoleEvidence} from '../semanticBinding/evidenceProvenance';
import type {SpatialEvidenceBindingInput} from './spatialEvidenceBinding';
import type {SpatialCalibration} from './spatialContextAllocation';
import type {EncodingBudget} from './encodingAccessMath';
import {selectCanonicalVisual,selectCanonicalVisualEqualPriorityControl,selectCanonicalVisualUnlimitedControl} from './canonicalVisualSelection';
import {prepareSelectedSpatialEncoding,closePreparedSpatialEncoding,type PreparedSpatialEncoding} from './selectedSpatialEncoding';
import {encodePreparedPositiveSpatialCandidate,encodePreparedPositiveSpatialWithPriorConcern,encodePreparedPositiveSpatialWithCalibration} from './positiveSpatialCandidate';
import type {PriorConcernCarry} from './priorConcernFeedback';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {bindPerceivedTrialContext,type PerceivedTrialContext} from './perceivedTrialContext';
declare const selectedBrand:unique symbol,encodedBrand:unique symbol;
export interface SelectedVisualFormation {readonly [selectedBrand]:true}
export interface EncodedVisualFormation {readonly [encodedBrand]:true}
type Header={selectionId:bigint;observerId:string;at:bigint;context?:PerceivedTrialContext};
const selected=new WeakMap<object,Header&{prepared:PreparedSpatialEncoding}>();
const encoded=new WeakMap<object,Header&{candidate:ReturnType<typeof encodePreparedPositiveSpatialCandidate>['candidate']}>();
export function prepareVisualFormation(source:SpatialEvidenceBindingInput,claims:readonly CausalRoleEvidence[],capacity:0|1|2,calibration:SpatialCalibration,context:PerceivedTrialContext|undefined,allocate:()=>bigint){
 return prepareWithSelector(selectCanonicalVisual,source,claims,capacity,calibration,context,allocate);
}
export const prepareVisualFormationEqualPriorityControl=(...args:Parameters<typeof prepareVisualFormation>)=>prepareWithSelector(selectCanonicalVisualEqualPriorityControl,...args);
export const prepareVisualFormationUnlimitedControl=(...args:Parameters<typeof prepareVisualFormation>)=>prepareWithSelector(selectCanonicalVisualUnlimitedControl,...args);
function prepareWithSelector(selector:typeof selectCanonicalVisual,source:SpatialEvidenceBindingInput,claims:readonly CausalRoleEvidence[],capacity:0|1|2,calibration:SpatialCalibration,context:PerceivedTrialContext|undefined,allocate:()=>bigint){
 const companion=context===undefined?undefined:bindPerceivedTrialContext(context,source.experience);
 const result=selector({kind:'Experience',experience:source.experience,claims},capacity,allocate);
 const prepared=prepareSelectedSpatialEncoding(result.view,source,calibration),view=Object.freeze({}) as SelectedVisualFormation;
 selected.set(view,{selectionId:result.selectionId,observerId:source.experience.observerId,at:source.experience.occurredAt,context:companion,prepared});
 return {selectionId:result.selectionId,audit:result.audit,selected:result.selected,view};
}
export function encodeVisualFormation(view:SelectedVisualFormation,law:EncodingBudget){
 const facts=selected.get(view);if(!facts)throw Error('VISUAL_FORMATION_SELECTED');selected.delete(view);
 const result=encodePreparedPositiveSpatialCandidate(facts.prepared,law),candidateView=Object.freeze({}) as EncodedVisualFormation;
 const {prepared,...header}=facts;encoded.set(candidateView,{...header,candidate:result.candidate});return {evaluation:result.evaluation,view:candidateView};
}
/** Prior producer/delivery and projected subject authentication belong to the outer adapter. */
export function encodeVisualFormationWithPriorConcern(view:SelectedVisualFormation,law:EncodingBudget,carry:PriorConcernCarry,subject:CanonicalValue,enabled:boolean){
 const facts=selected.get(view);if(!facts)throw Error('VISUAL_FORMATION_SELECTED');selected.delete(view);
 const result=encodePreparedPositiveSpatialWithPriorConcern(facts.prepared,law,carry,subject,enabled),candidateView=Object.freeze({}) as EncodedVisualFormation;
 const {prepared,...header}=facts;encoded.set(candidateView,{...header,candidate:result.candidate});return {evaluation:result.evaluation,view:candidateView};
}
export function encodeVisualFormationWithCalibration(view:SelectedVisualFormation,calibration:Parameters<typeof encodePreparedPositiveSpatialWithCalibration>[1]){
 const facts=selected.get(view);if(!facts)throw Error('VISUAL_FORMATION_SELECTED');selected.delete(view);
 const result=encodePreparedPositiveSpatialWithCalibration(facts.prepared,calibration),candidateView=Object.freeze({}) as EncodedVisualFormation;
 const {prepared,...header}=facts;encoded.set(candidateView,{...header,candidate:result.candidate});return {evaluation:result.evaluation,view:candidateView};
}
export function produceVisualFormationEvidence(view:EncodedVisualFormation,allocate:()=>bigint){
 const facts=encoded.get(view);if(!facts)throw Error('VISUAL_FORMATION_ENCODED');encoded.delete(view);
 if(!facts.candidate.units.length)return {kind:'NoFormation' as const,selectionId:facts.selectionId};
 const acquisitionId=allocate();if(typeof acquisitionId!=='bigint'||acquisitionId<0n)throw Error('VISUAL_FORMATION_ALLOCATION');
 return {kind:'Formation' as const,evidence:{acquisitionId,observer:observerIdValue(facts.observerId),at:facts.at,sourceSelectionId:facts.selectionId,transformationVersion:'visual-formation-evidence-component/0.1-candidate',content:{children:facts.candidate.units.map(encoding=>({encoding,context:structuredClone(facts.context)}))}}};
}
export function closeVisualFormation(view:SelectedVisualFormation|EncodedVisualFormation){const facts=selected.get(view);if(facts)closePreparedSpatialEncoding(facts.prepared);selected.delete(view);encoded.delete(view);}
