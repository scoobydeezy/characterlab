/** scene-width/0.1: widen inputs, retain the original attention and encoding laws. */
import {canonicalEncode,bytesToHex,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {assemblePreRecognitionExperience,compilePerceivedBindings,type PreRecognitionSemanticExperience,type PerceivedBindingEvidence} from '../semanticBinding/perceptualEventFiles';
import type {CausalRoleEvidence} from '../semanticBinding/evidenceProvenance';
import {preRecognitionSemanticExperienceValue,perceivedBindingEvidenceValue,causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {perceptualEventReferentIdValue,perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {prepareAttentionPool,selectAttention,closeSelectedView,AttentionComponentError,type AttentionAuditRow} from '../campaign3/attentionSelection';
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const unitKey=(b:Pick<PerceivedBindingEvidence,'perceptualEventReferentId'|'perceptualReferentId'>)=>key(list([perceptualEventReferentIdValue(b.perceptualEventReferentId),perceptualReferentIdValue(b.perceptualReferentId)]));
const fail=(message:string):never=>{throw new AttentionComponentError('INVALID_POOL',message);};
export function selectWideAttention(input:PreRecognitionSemanticExperience,companions:readonly CausalRoleEvidence[],capacity:number){
 if(!Number.isInteger(capacity)||capacity<0||capacity>2)throw new AttentionComponentError('INVALID_CAPACITY','capacity must be0..2');
 const experience=assemblePreRecognitionExperience(structuredClone(input)),claims=structuredClone([...companions]);
 preRecognitionSemanticExperienceValue(experience);
 if(experience.perceptualEventReferentIds.length>1||experience.perceivedBindings.length>6||claims.length>6||experience.perceptualClassifications.length||experience.perceptualEventClassifications.length)fail('finite experience domain');
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
  const original=selectAttention(prepareAttentionPool({...experience,perceivedBindings:unit.bindings},unit.claims),0);
  try{if(original.audit.length!==1||original.audit[0].key!==k)fail('unit correspondence');audit.push(original.audit[0]);}finally{closeSelectedView(original.view);}
 }
 const eligible=audit.filter(a=>a.numerator!==undefined).sort((a,b)=>Q.of(b.numerator!,b.denominator!).compare(Q.of(a.numerator!,a.denominator!))||(a.key<b.key?-1:1));
 const selected=new Set(eligible.slice(0,capacity).map(a=>a.key));
 // Original capability, original shared encoding budget: one global capacity choice.
 const final=selectAttention(prepareAttentionPool({...experience,perceivedBindings:experience.perceivedBindings.filter(b=>selected.has(unitKey(b)))},claims.filter(c=>selected.has(unitKey(c)))),capacity);
 return {audit:audit.map(a=>({...a,selected:selected.has(a.key)})),view:final.view};
}
