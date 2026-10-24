import {affectPlayerReasonPreview,affectPreviewRecipient,AFFECT_PLAYER_PREVIEW_POLICY} from './affectPlayerReasonPreview';
import {affectReasonSemantics} from './affectReasonSemantics';
import type {AffectExplanation} from './affectExplanations';
export const AFFECT_PLAYER_RELATIVE_POLICY='workbench-affect-player-relative/0.1';
function fraction(text:string){if(text.length>256||!/^\d+\/[1-9]\d*$/.test(text))throw Error('Unsupported relative reason relevance');const [n,d]=text.split('/').map(BigInt);return{n,d};}
/** Presentation-only ordering of admitted own-goal reasons, never a forecast or certainty estimate. */
export function affectPlayerRelativeReasons(card:AffectExplanation,recipient:unknown,policy:string){
 if(policy!==AFFECT_PLAYER_RELATIVE_POLICY)throw Error('Unsupported relative reason policy');
 // Original policy authenticates the recipient before reading any card field.
 const admitted=affectPlayerReasonPreview(card,recipient,AFFECT_PLAYER_PREVIEW_POLICY),detail=affectReasonSemantics(card);
 if(admitted.reasons.length>2||new Set(admitted.reasons.map(r=>r.semantic.concept)).size!==admitted.reasons.length)throw Error('Unsupported relative reason roster');
 const values=admitted.reasons.map(r=>{const source=detail.reasons.find(s=>s.nucleus===r.nucleus);if(!source)throw Error('Missing relative reason source');return fraction(source.mechanical.relevance);});
 const comparison=values.length===2?values[0].n*values[1].d-values[1].n*values[0].d:null;
 const reasons=admitted.reasons.map((r,i)=>{
  const order=comparison===null?'not-comparable':comparison===0n?'equal':(i===0?comparison>0n:comparison<0n)?'stronger':'weaker';
  const human=order==='not-comparable'?r.human:order==='equal'?`${r.human} This pulls me as strongly as my other goal.`:order==='stronger'?`${r.human} This pulls me more strongly than my other goal.`:`${r.human} This pulls me less strongly than my other goal.`;
  return{nucleus:r.nucleus,human,semantic:{concept:r.semantic.concept,subject:'self',option:r.semantic.option,polarity:'supports',relativeStrength:order,comparisonScope:'admitted own-goal reasons at this evaluation',strengthBand:null,certaintyBand:null,qualifiers:['relative pull only','no absolute intensity or certainty claim']}};
 });
 return{version:AFFECT_PLAYER_RELATIVE_POLICY,audience:admitted.audience,at:admitted.at,reasons,scope:'Relative pull among the admitted own-goal reasons at this evaluation. This does not predict the chosen action, assert absolute intensity or express subjective certainty. A sole reason has no relative-strength comparison.'};
}
export {affectPreviewRecipient};
