/** general-source-role-batch/0.1-candidate; actual admitted SEM experience upstream. */
import {canonicalEncode,bytesToHex,list} from '../substrate/canonicalEncoding';
import {assemblePreRecognitionExperience,type PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import {INITIAL_CAUSAL_ROLE_RULE,compileCausalRoleModel,deriveCausalRoleEvidence,characterEvidenceRefKey,type ObserverSafeEvidenceOccurrence} from '../semanticBinding/evidenceProvenance';
import {perceptualReferentIdValue,perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
const C='semantic-binding/0.1-candidate#SEM-001C',G='semantic-binding/0.1-candidate#SEM-001G';
const unitKey=(b:PreRecognitionSemanticExperience['perceivedBindings'][number])=>bytesToHex(canonicalEncode(list([perceptualEventReferentIdValue(b.perceptualEventReferentId),perceptualReferentIdValue(b.perceptualReferentId)])));
export function deriveGeneralSourceRoles(input:PreRecognitionSemanticExperience,allocate:()=>bigint){
 const experience=assemblePreRecognitionExperience(input);if(experience.perceivedBindings.length>3)throw Error('SOURCE_ROLE_BOUND');
 if(experience.transformationVersion!=='semantic-binding/0.1-candidate#SEM-001H'||experience.perceivedBindings.some(b=>b.transformationVersion!==C))throw Error('SOURCE_ROLE_PROVENANCE');
 const index:ObserverSafeEvidenceOccurrence[]=experience.perceivedBindings.map(b=>({ref:{kind:'perceived-binding',perceivedBindingId:b.perceivedBindingId},observerId:experience.observerId,occurredAt:experience.occurredAt,recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:C,scope:{experienceId:experience.experienceId,carrier:{kind:'continuant-in-event',perceptualEventReferentId:b.perceptualEventReferentId,perceptualReferentId:b.perceptualReferentId}}}));
 index.sort((a,b)=>characterEvidenceRefKey(a.ref).localeCompare(characterEvidenceRefKey(b.ref)));
 const units=new Map(experience.perceivedBindings.map(b=>[unitKey(b),b])),model=compileCausalRoleModel('general-source-role',[INITIAL_CAUSAL_ROLE_RULE]);
 // Derive semantic content first. Local zero placeholders never become outputs.
 const content=[...units].sort(([a],[b])=>a<b?-1:a>b?1:0).flatMap(([,b])=>deriveCausalRoleEvidence(model,{experience,perceptualEventReferentId:b.perceptualEventReferentId,perceptualReferentId:b.perceptualReferentId,evidenceOccurrences:index,readDomain:{transitionKindId:'transition/derive-character-causal-role',permittedEvidenceSchemas:[{refKind:'perceived-binding',recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:C}],temporalScope:'SameExperience'},transformationVersion:G},0n).evidence);
 const used=new Set<bigint>();return Object.freeze(content.map(c=>{const n=allocate();if(typeof n!=='bigint'||n<0n||used.has(n))throw Error('SOURCE_ROLE_ALLOCATION');used.add(n);const claim=Object.freeze({...c,causalRoleEvidenceId:n});canonicalEncode(causalRoleEvidenceValue(claim));return claim;}));
}
