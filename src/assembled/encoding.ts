/** assembled-character-encoding/0.1: observed role products, selected-only factors. */
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataRecord as rec,dataField as f,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {EventRoleId as R,type EventRoleEvidence} from '../semanticBinding/eventBindings';
import {assemblePreRecognitionExperience,type PreRecognitionSemanticExperience} from '../semanticBinding/perceptualEventFiles';
import {compileCausalRoleModel,deriveCausalRoleEvidence,INITIAL_CAUSAL_ROLE_RULE,characterEvidenceRefKey,type ObserverSafeEvidenceOccurrence} from '../semanticBinding/evidenceProvenance';
import {preRecognitionSemanticExperienceValue,causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeSemanticValue,restorePerceptualReferentId,restorePerceptualEventReferentId,perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {prepareAttentionPool,selectAttention} from '../campaign3/attentionSelection';
import type {EncodingBudget} from '../campaign3/encodingAccessMath';
import type {SelectedBudgetCalibration} from '../campaign3/selectedEncodingBudgetControl';
import {encodeSelectedBudgetControl} from '../campaign3/selectedEncodingBudgetControl';
export const ENCODING='assembled-encoding/0.1',ENCODING_VERSION='assembled-character-encoding/0.1-candidate';
export const MULTI_ENCODING='assembled-encoding/0.2',MULTI_ENCODING_VERSION='assembled-character-encoding/0.2-candidate';
export const BUDGET_ENCODING='assembled-encoding/0.3',BUDGET_ENCODING_VERSION='assembled-character-encoding/0.3-candidate';
export interface EncodingSettings {capacity:number;attention:'role-calibrated'|'disabled-attention';multiUnit?:boolean;budgetLaw?:EncodingBudget;budgetCalibration?:SelectedBudgetCalibration}
export const encodingLabel=(s:EncodingSettings)=>s.budgetLaw?BUDGET_ENCODING:s.multiUnit?MULTI_ENCODING:ENCODING;
export function encodingMatchesModel(v:CanonicalValue,s:EncodingSettings){
 const a=items(v,'list');return a.length===(s.budgetLaw?11:9)&&txt(a[0])===encodingLabel(s)&&uint(a[1])===BigInt(s.capacity)&&txt(a[2])===s.attention&&(!s.budgetLaw||txt(a[9])===s.budgetLaw&&txt(a[10])===s.budgetCalibration);
}
const require=(ok:unknown,s:string)=>{if(!ok)invalidModel('encoding: '+s);};
export function compileEncoding(v:CanonicalValue,multiUnit=false,budgets=false):EncodingSettings{
 const a=items(v,'list');require(a.length===(budgets?5:3)&&txt(a[0])===(budgets?BUDGET_ENCODING:multiUnit?MULTI_ENCODING:ENCODING)&&(!budgets||multiUnit),'declaration');
 const capacity=Number(uint(a[1])),attention=txt(a[2]);require(capacity<=2&&['role-calibrated','disabled-attention'].includes(attention),'domain');
 const budgetLaw=budgets?txt(a[3]) as EncodingBudget:undefined,budgetCalibration=budgets?txt(a[4]) as SelectedBudgetCalibration:undefined;
 if(budgets)require(['independent','historical-shared','historical-hybrid','retired-flat'].includes(budgetLaw!)&&['UnitBudget','SmallBudget'].includes(budgetCalibration!),'budget domain');
 return {capacity,attention:attention as EncodingSettings['attention'],...(multiUnit?{multiUnit:true}:{}),...(budgets?{budgetLaw,budgetCalibration}:{})};
}
export function roleChannel(v:CanonicalValue,multiUnit=false){
 const a=items(v,'list');require(a.length===(multiUnit?3:2),'role channel');
 const physical=uint(a[0]),observed=uint(a[1]);require(physical<=4n&&observed<=4n,'role codes');
 const additional=multiUnit?items(a[2],'list').map(v=>{const x=items(v,'list');require(x.length===3&&typeof x[0]==='boolean','additional detector');const physical=uint(x[1]),observed=uint(x[2]);require(physical<=4n&&observed<=4n,'additional role codes');return {permitted:x[0]===true,physical,observed};}):[];
 require(additional.length<=2,'additional detection capacity');return {physical,observed,additional};
}
export function observedRole(code:bigint):EventRoleEvidence{require(code>=0n&&code<=4n,'observed role');return code===0n?{kind:'unresolved'}:{kind:'exact',eventRoleId:[R.Actor,R.Target,R.Participant,R.Recipient][Number(code)-1]};}
const G='semantic-binding/0.1-candidate#SEM-001G';
/** Classification-free role projection; original frozen experience is never changed. */
export function encodeExperience(full:PreRecognitionSemanticExperience,settings:EncodingSettings,claimId:bigint|readonly bigint[]){
 const experience=assemblePreRecognitionExperience({...full,perceptualClassifications:[],perceptualEventClassifications:[]});
 const bindings=[...experience.perceivedBindings].sort((a,b)=>a.perceivedBindingId<b.perceivedBindingId?-1:1),ids=typeof claimId==='bigint'?[claimId]:[...claimId];
 require(bindings.length>=1&&bindings.length<=(settings.multiUnit?3:1)&&experience.perceptualEventReferentIds.length===1,'observed unit domain');
 require(ids.length===bindings.length&&new Set(ids).size===ids.length&&ids.every(x=>x>=0n),'reserved claim identities');
 const occurrences:ObserverSafeEvidenceOccurrence[]=bindings.map(b=>({ref:{kind:'perceived-binding',perceivedBindingId:b.perceivedBindingId},observerId:b.observerId,occurredAt:b.occurredAt,recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:b.transformationVersion,scope:{experienceId:experience.experienceId,carrier:{kind:'continuant-in-event',perceptualEventReferentId:b.perceptualEventReferentId,perceptualReferentId:b.perceptualReferentId}}}));
 occurrences.sort((a,b)=>characterEvidenceRefKey(a.ref).localeCompare(characterEvidenceRefKey(b.ref)));
 const claims=bindings.flatMap((b,i)=>{
  const derived=deriveCausalRoleEvidence(compileCausalRoleModel(ENCODING,[INITIAL_CAUSAL_ROLE_RULE]),{experience,perceptualEventReferentId:b.perceptualEventReferentId,perceptualReferentId:b.perceptualReferentId,evidenceOccurrences:occurrences,readDomain:{transitionKindId:'transition/derive-character-causal-role',permittedEvidenceSchemas:[{refKind:'perceived-binding',recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:b.transformationVersion}],temporalScope:'SameExperience'},transformationVersion:G},ids[i]);
  require(derived.nextRuntimeId<=ids[i]+1n,'one reserved claim per unit');return [...derived.evidence];
 });
 const selection=selectAttention(prepareAttentionPool(experience,claims),settings.capacity),result=encodeSelectedBudgetControl(selection.view,settings.budgetLaw??'historical-shared',settings.attention,settings.budgetCalibration??'UnitBudget');
 const value=list([text(encodingLabel(settings)),u(settings.capacity),text(settings.attention),settings.multiUnit?list(ids.map(u)):u(ids[0]),preRecognitionSemanticExperienceValue(experience),list(claims.map(causalRoleEvidenceValue)),list(selection.audit.map(a=>list([text(a.key),list(a.roles.map(text)),text(a.exclusion??'Eligible'),a.selected]))),list(result.evidence.map(e=>decodeSemanticValue(e.bytes))),list(result.rows.map(r=>list([text(r.continuantKey),text(r.roleId),...[r.base,r.role,r.attention,r.raw,r.strength].map(x=>q(x.numerator,x.denominator))]))),...(settings.budgetLaw?[text(settings.budgetLaw),text(settings.budgetCalibration!)]:[])]);
 // The focal binding is reserved first by the actual perception producer.
 const focal=key(perceptualReferentIdValue(bindings[0].perceptualReferentId));
 return {value,positive:result.rows.some(r=>r.continuantKey===focal&&r.strength.numerator>0n)};
}
/** Decode the original role projection for structural validation, never as live input. */
function roleProjection(v:CanonicalValue):PreRecognitionSemanticExperience{
 const x=rec(v,227n),observerId=txt(id(f(x,2n)).payload),experienceId=uint(id(f(x,1n)).payload),occurredAt=uint(f(x,3n));
 const support=(v:CanonicalValue)=>items(v,'set').map(s=>({observerId:txt(id(f(rec(s,216n),1n)).payload),observationId:uint(id(f(rec(s,216n),2n)).payload)}));
 return {observerId,experienceId,occurredAt,perceptualEventReferentIds:items(f(x,4n),'set').map(restorePerceptualEventReferentId),perceivedBindings:items(f(x,5n),'set').map(v=>{const b=rec(v,224n),r=rec(f(b,5n),223n);return {perceivedBindingId:uint(id(f(b,1n)).payload),observerId:txt(id(f(b,2n)).payload),perceptualEventReferentId:restorePerceptualEventReferentId(f(b,3n)),perceptualReferentId:restorePerceptualReferentId(f(b,4n)),eventRoleEvidence:uint(f(r,1n))===2n?{kind:'unresolved' as const}:{kind:'exact' as const,eventRoleId:txt(id(f(r,2n)).payload) as typeof R.Actor},supportingObservationIds:support(f(b,6n)),occurredAt:uint(f(b,7n)),transformationVersion:txt(f(b,8n))};}),perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:support(f(x,8n)),transformationVersion:txt(f(x,9n))};
}
export function validateEncoding(value:CanonicalValue,full:CanonicalValue){
 const a=items(value,'list');require([ENCODING,MULTI_ENCODING,BUDGET_ENCODING].includes(txt(a[0]))&&a.length===(txt(a[0])===BUDGET_ENCODING?11:9),'assessment shape');const budgets=txt(a[0])===BUDGET_ENCODING,settings=compileEncoding(list([...a.slice(0,3),...(budgets?a.slice(9):[])]),budgets||txt(a[0])===MULTI_ENCODING,budgets),projection=roleProjection(a[4]);
 const original=rec(full,227n),projected=rec(a[4],227n);for(const field of [1n,2n,3n,4n,5n,8n,9n])require(key(f(original,field))===key(f(projected,field)),'original evidence binding');
 const expected=encodeExperience(projection,settings,settings.multiUnit?items(a[3],'list').map(uint):uint(a[3]));require(key(value)===key(expected.value),'canonical factors/refs');return expected.positive;
}
