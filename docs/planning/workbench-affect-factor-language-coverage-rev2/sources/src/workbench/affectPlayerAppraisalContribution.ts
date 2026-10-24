import {ExactRational as Q} from '../substrate/exactMath';
import type {AffectExplanation} from './affectExplanations';
import {affectPlayerReasonPreview,affectPreviewRecipient,AFFECT_PLAYER_PREVIEW_POLICY} from './affectPlayerReasonPreview';
import {affectReasonSources} from './affectReasonSources';
export const AFFECT_PLAYER_APPRAISAL_POLICY='workbench-affect-player-appraisal/0.1';
/** A separately authorized, evaluation-time subjective contribution, never physical danger. */
export function affectPlayerAppraisalContribution(card:AffectExplanation,recipient:unknown,policy:string){
 if(policy!==AFFECT_PLAYER_APPRAISAL_POLICY)throw Error('Unsupported appraisal contribution policy');
 const admitted=affectPlayerReasonPreview(card,recipient,AFFECT_PLAYER_PREVIEW_POLICY),sources=affectReasonSources(card);
 const decision=JSON.parse(card.provenance),appraisal=decision['Reasons [3]']['Raw [2]']['Appraisal [2]'];
 if(appraisal?.record!=='AffectAppraisal#754/1'||appraisal['At [2]']!==card.at||!Array.isArray(appraisal['Coordinates [6]']))throw Error('Unsupported appraisal contribution source');
 const components=sources.rows.flatMap(row=>{
  if(row.role!=='situational'||row.coverage.length===0)return[];
  if(row.coverage.length!==1)throw Error('Ambiguous appraisal contribution');
  const coverage=row.coverage[0],reason=admitted.reasons.find(r=>r.nucleus===coverage.nucleus),nucleus=sources.nuclei.find(n=>n.index===coverage.nucleus);
  if(!reason||!nucleus||reason.semantic.concept!=='goal.safety'||reason.semantic.option!=='mitigate danger'||reason.semantic.polarity!=='supports')throw Error('Unsupported appraisal contribution meaning');
  const [effectiveN,effectiveD]=coverage.effective.split('/').map(BigInt),total=Q.of(effectiveN,effectiveD),bounded=total.divide(Q.of(1n).add(Q.of(effectiveN<0n?-effectiveN:effectiveN,effectiveD)));
  const [netN,netD]=nucleus.situational.split('/').map(BigInt);
  if(row.strength!==appraisal['Coordinates [6]'].at(-1)||!bounded.equals(Q.of(netN,netD)))throw Error('Appraisal contribution correspondence mismatch');
  const n=BigInt(coverage.effective.split('/')[0]);if(n<0n)throw Error('Unsupported negative appraisal contribution');if(n===0n)return[];
  return[{nucleus:coverage.nucleus,human:'The way I see things adds to my reason to keep myself safe.',semantic:{concept:'appraisal.safety_support',subject:'self',option:'mitigate danger',polarity:'supports',temporalScope:'evaluation-time appraisal',strengthBand:null,certaintyBand:null,qualifiers:['subjective appraisal','may reflect retained earlier appraisal','no physical truth or success claim']}}];
 });
 if(new Set(components.map(c=>c.nucleus)).size!==components.length)throw Error('Duplicate appraisal contribution');
 return{version:AFFECT_PLAYER_APPRAISAL_POLICY,audience:admitted.audience,at:card.at,components,scope:'A positive compiled contribution from the character’s appraisal to its safety reason. This can include retained earlier appraisal; it does not assert new evidence, physical danger, successful action, absolute intensity or subjective certainty. Uncompiled sources produce no sentence.'};
}
export {affectPreviewRecipient};
