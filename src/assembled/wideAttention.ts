/** scene-width/0.1: widen inputs, retain the original attention and encoding laws. */
import {canonicalEncode,bytesToHex,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {encodeSelectedBudgetControl,type SelectedBudgetCalibration} from '../campaign3/selectedEncodingBudgetControl';
import {encodingBudget,type EncodingBudget} from '../campaign3/encodingAccessMath';
import type {SelectedAttentionLaw} from '../campaign3/selectedEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {assemblePreRecognitionExperience,compilePerceivedBindings,type PreRecognitionSemanticExperience,type PerceivedBindingEvidence} from '../semanticBinding/perceptualEventFiles';
import type {CausalRoleEvidence} from '../semanticBinding/evidenceProvenance';
import {preRecognitionSemanticExperienceValue,perceivedBindingEvidenceValue,causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {perceptualEventReferentIdValue,perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {prepareAttentionPool,selectAttention,closeSelectedView,AttentionComponentError,type AttentionAuditRow} from '../campaign3/attentionSelection';
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const unitKey=(b:Pick<PerceivedBindingEvidence,'perceptualEventReferentId'|'perceptualReferentId'>)=>key(list([perceptualEventReferentIdValue(b.perceptualEventReferentId),perceptualReferentIdValue(b.perceptualReferentId)]));
const fail=(message:string):never=>{throw new AttentionComponentError('INVALID_POOL',message);};
function prepared(input:PreRecognitionSemanticExperience,companions:readonly CausalRoleEvidence[],maxEvents:number){
 const experience=assemblePreRecognitionExperience(structuredClone(input)),claims=structuredClone([...companions]);
 preRecognitionSemanticExperienceValue(experience);
 if(experience.perceptualEventReferentIds.length>maxEvents||experience.perceivedBindings.length>6||claims.length>6||experience.perceptualClassifications.length||experience.perceptualEventClassifications.length)fail('finite experience domain');
 compilePerceivedBindings(experience.perceivedBindings.map(({perceivedBindingId,...request})=>request),0n);
 const bindingIds=new Set<bigint>(),claimIds=new Set<bigint>(),units=new Map<string,{bindings:PerceivedBindingEvidence[];claims:CausalRoleEvidence[]}>();
 for(const b of experience.perceivedBindings){
  perceivedBindingEvidenceValue(b);
  if(b.observerId!==experience.observerId||b.occurredAt!==experience.occurredAt||bindingIds.has(b.perceivedBindingId))fail('binding observer/time/identity');
  bindingIds.add(b.perceivedBindingId);const k=unitKey(b),unit=units.get(k)??{bindings:[],claims:[]};unit.bindings.push(b);units.set(k,unit);
 }
 for(const c of claims){
  causalRoleEvidenceValue(c);
  if(c.observerId!==experience.observerId||c.occurredAt!==experience.occurredAt||c.experienceId!==experience.experienceId||c.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001G'||claimIds.has(c.causalRoleEvidenceId))fail('claim observer/time/identity/version');
  claimIds.add(c.causalRoleEvidenceId);const unit=units.get(unitKey(c));if(!unit)fail('claim without unit');unit!.claims.push(c);
 }
 // Validate every unit, including those excluded from selection, with the original
 // SEM derivation/provenance checks. Empty capabilities have no consumer and close here.
 const audit:AttentionAuditRow[]=[];
 for(const [k,unit] of [...units].sort(([a],[b])=>a<b?-1:1)){
  const original=selectAttention(prepareAttentionPool(unitExperience(experience,unit.bindings),unit.claims),0);
  try{if(original.audit.length!==1||original.audit[0].key!==k)fail('unit correspondence');audit.push(original.audit[0]);}finally{closeSelectedView(original.view);}
 }
 return {audit,units,experience,claims};
}
function unitExperience(experience:PreRecognitionSemanticExperience,bindings:PerceivedBindingEvidence[]):PreRecognitionSemanticExperience{
 return {...experience,perceptualEventReferentIds:bindings.length?[bindings[0].perceptualEventReferentId]:experience.perceptualEventReferentIds.slice(0,1),perceivedBindings:bindings};
}
function chosen(audit:AttentionAuditRow[],capacity:number){
 if(!Number.isInteger(capacity)||capacity<0||capacity>2)throw new AttentionComponentError('INVALID_CAPACITY','capacity must be0..2');
 return audit.filter(a=>a.numerator!==undefined).sort((a,b)=>Q.of(b.numerator!,b.denominator!).compare(Q.of(a.numerator!,a.denominator!))||(a.key<b.key?-1:1)).slice(0,capacity);
}
export function selectWideAttention(input:PreRecognitionSemanticExperience,companions:readonly CausalRoleEvidence[],capacity:number){
 const {audit,experience,claims}=prepared(input,companions,1),selected=new Set(chosen(audit,capacity).map(a=>a.key));
 const final=selectAttention(prepareAttentionPool({...experience,perceivedBindings:experience.perceivedBindings.filter(b=>selected.has(unitKey(b)))},claims.filter(c=>selected.has(unitKey(c)))),capacity);
 return {audit:audit.map(a=>({...a,selected:selected.has(a.key)})),view:final.view};
}
/** Original raw factors, ONE global budget, unchanged distinct-continuant guard. */
export function encodeMultiEventAttention(input:PreRecognitionSemanticExperience,companions:readonly CausalRoleEvidence[],capacity:number,law:EncodingBudget,attention:SelectedAttentionLaw,calibration:SelectedBudgetCalibration){
 const {audit,units,experience}=prepared(input,companions,2),selected=chosen(audit,capacity),keys=new Set(selected.map(a=>a.key));
 const parts=selected.map(a=>{const unit=units.get(a.key)!;return encodeSelectedBudgetControl(selectAttention(prepareAttentionPool(unitExperience(experience,unit.bindings),unit.claims),1).view,'independent',attention,calibration);});
 if(!parts.length)parts.push(encodeSelectedBudgetControl(selectAttention(prepareAttentionPool(unitExperience(experience,[]),[]),0).view,'independent',attention,calibration));
 const evidence=parts.flatMap(p=>p.evidence),rows=parts.flatMap(p=>p.rows).sort((a,b)=>a.continuantKey<b.continuantKey?-1:a.continuantKey>b.continuantKey?1:0);
 if(new Set(rows.map(r=>r.continuantKey)).size!==rows.length)throw new RangeError('multiple selected roles per continuant');
 const strengths=encodingBudget(rows.map(r=>r.continuantKey),rows.map(r=>r.raw),law,calibration==='UnitBudget'?Q.of(1n):Q.of(1n,5n),Q.of(1n,4n));
 return {audit:audit.map(a=>({...a,selected:keys.has(a.key)})),result:{...parts[0],budgetLaw:law,evidence,rows:rows.map((r,i)=>({...r,strength:strengths[i]}))}};
}
