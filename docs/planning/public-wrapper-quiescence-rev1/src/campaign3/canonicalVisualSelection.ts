/** canonical-visual-selection-component/0.1-candidate; completed source authentication upstream. */
import {canonicalEncode,cloneCanonicalValue,bytesToHex,list,set,text,signed,unsigned,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareAttentionPool,prepareNoDetectionAttentionPool,selectAttention,selectEqualPriorityControl,selectUnlimitedAttentionControl,closeSelectedView} from './attentionSelection';
import type {PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import type {CausalRoleEvidence} from '../semanticBinding/evidenceProvenance';
import {perceptualReferentIdValue,perceptualEventReferentIdValue,observerIdValue} from '../semanticBinding/semanticCodecs';
import {perceivedBindingEvidenceValue,causalRoleEvidenceValue,characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {attentionRecord as record,attentionRawRecord as raw} from './attentionCodecs';
const version='canonical-visual-selection-component/0.1-candidate';
type Empty=Parameters<typeof prepareNoDetectionAttentionPool>[0];
export type VisualSelectionSource={kind:'Experience';experience:PreRecognitionSemanticExperience;claims:readonly CausalRoleEvidence[]}|{kind:'NoDetection';observation:Empty};
export function selectCanonicalVisual(source:VisualSelectionSource,capacity:0|1|2,allocate:()=>bigint){
 return select(source,capacity,allocate,1,version);
}
export function selectCanonicalVisualEqualPriorityControl(source:VisualSelectionSource,capacity:0|1|2,allocate:()=>bigint){return select(source,capacity,allocate,2,'canonical-visual-equal-priority-control/0.1-candidate');}
export function selectCanonicalVisualUnlimitedControl(source:VisualSelectionSource,capacity:0|1|2,allocate:()=>bigint){return select(source,capacity,allocate,3,'canonical-visual-unlimited-control/0.1-candidate');}
function select(source:VisualSelectionSource,capacity:0|1|2,allocate:()=>bigint,algorithm:1|2|3,producer:string){
 const positive=source.kind==='Experience';
 if(!positive&&source.kind!=='NoDetection')throw Error('VISUAL_SELECTION_SOURCE');
 const header=positive?source.experience:source.observation,observer=observerIdValue(header.observerId),at=header.occurredAt;
 const policy=record('AttentionSelectionPolicy',[unsigned(algorithm),unsigned(capacity),text(producer)]);
 const pool=positive?prepareAttentionPool(source.experience,source.claims):prepareNoDetectionAttentionPool(source.observation);
 const result=(algorithm===1?selectAttention:algorithm===2?selectEqualPriorityControl:selectUnlimitedAttentionControl)(pool,capacity);
 try{
  const rows:CanonicalValue[]=[],units:CanonicalValue[]=[];
  const key=(event:Parameters<typeof perceptualEventReferentIdValue>[0],file:Parameters<typeof perceptualReferentIdValue>[0])=>bytesToHex(canonicalEncode(list([perceptualEventReferentIdValue(event),perceptualReferentIdValue(file)])));
  if(positive)for(const row of result.audit){
   const bindings=source.experience.perceivedBindings.filter(b=>key(b.perceptualEventReferentId,b.perceptualReferentId)===row.key);
   const claims=source.claims.filter(c=>key(c.perceptualEventReferentId,c.perceptualReferentId)===row.key);
   // Frozen533 is one binding/one claim; broader selected content needs a successor.
   if(bindings.length!==1||row.selected&&claims.length!==1)throw Error('VISUAL_SELECTION_BOUND');
   const b=bindings[0],unit=record('AttentionUnitKey',[perceptualEventReferentIdValue(b.perceptualEventReferentId),perceptualReferentIdValue(b.perceptualReferentId)]);
   const exclusion=row.exclusion==='MissingRole'?2:row.exclusion==='MultipleRoles'?3:row.exclusion==='UnsupportedRole'?4:1;
   const refs=[characterEvidenceRefValue({kind:'perceived-binding',perceivedBindingId:b.perceivedBindingId}),...claims.map(c=>characterEvidenceRefValue({kind:'causal-role',causalRoleEvidenceId:c.causalRoleEvidenceId}))];
   rows.push(raw('AttentionAuditRow',new Map<bigint,CanonicalValue>([[1n,unit],[2n,set(row.roles.map(r=>typedIdentifier(1019,text(r))))],[3n,unsigned(exclusion)],...(row.numerator===undefined?[]:[[4n,rational(row.numerator,row.denominator!)] as [bigint,CanonicalValue]]),[5n,row.selected],[6n,set(refs)]])));
   if(row.selected)units.push(record('SelectedAttentionUnit',[unit,list(bindings.map(perceivedBindingEvidenceValue)),list(claims.map(causalRoleEvidenceValue))]));
  }
  const provenance=raw('AttentionSelectionSource',new Map<bigint,CanonicalValue>(positive?[[1n,unsigned(1)],[2n,typedIdentifier(1106,unsigned(source.experience.experienceId))]]:[[1n,unsigned(2)],[3n,typedIdentifier(1115,unsigned(source.observation.observationId))]]));
  if(at<1n)throw Error('VISUAL_SELECTION_TIME');
  const selectionId=allocate();if(typeof selectionId!=='bigint'||selectionId<0n)throw Error('VISUAL_SELECTION_ALLOCATION');
  const identity=typedIdentifier(1143,unsigned(selectionId));
  const audit=record('AttentionSelectionAudit',[identity,observer,signed(at),provenance,policy,list(rows),text(producer)]);
  const selected=record('SelectedEvidenceView',[identity,observer,signed(at),list(units)]);
  return {selectionId,audit:cloneCanonicalValue(audit) as typeof audit,selected:cloneCanonicalValue(selected) as typeof selected,view:result.view};
 }catch(error){closeSelectedView(result.view);throw error;}
}
