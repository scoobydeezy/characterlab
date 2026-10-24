import {affectReasonSources} from './affectReasonSources';
import {affectReasonSemantics} from './affectReasonSemantics';
import {affectPlayerReasonPreview,affectPreviewRecipient,AFFECT_PLAYER_PREVIEW_POLICY} from './affectPlayerReasonPreview';
import {affectPlayerRelativeReasons,AFFECT_PLAYER_RELATIVE_POLICY} from './affectPlayerRelativeReasons';
import type {AffectExplanation} from './affectExplanations';
/** Researcher audit. Presence/relative ordering is not a complete factor-language verdict. */
export function affectFactorLanguageCoverage(card:AffectExplanation){
 const sources=affectReasonSources(card),semantics=affectReasonSemantics(card),recipient=affectPreviewRecipient(),own=affectPlayerReasonPreview(card,recipient,AFFECT_PLAYER_PREVIEW_POLICY),relative=affectPlayerRelativeReasons(card,recipient,AFFECT_PLAYER_RELATIVE_POLICY);
 const rows=sources.rows.map(source=>{
  const links=source.coverage.map(c=>{
   const meaning=semantics.reasons.find(r=>r.nucleus===c.nucleus),base=own.reasons.find(r=>r.nucleus===c.nucleus),rank=relative.reasons.find(r=>r.nucleus===c.nucleus);
   if(!meaning||!base||!rank)throw Error('Missing factor language nucleus');
   const zero=BigInt(c.effective.split('/')[0])===0n;
   const status=zero?'zero effective contribution':source.role==='base'?'goal presence represented; absolute magnitude open':'nonzero component explanation missing';
   return{nucleus:c.nucleus,concept:meaning.semantic.concept,option:meaning.semantic.option,polarity:meaning.semantic.polarity,effective:c.effective,status,goalSentence:base.human,relativeSentence:rank.human,relativeStrength:rank.semantic.relativeStrength,componentSentence:null};
  });
  return{sourceIndex:source.index,role:source.role,key:source.key,raw:source.strength,links,status:links.length?'recorded compiled coverage':'uncovered raw source; no player reason inferred'};
 });
 return{version:'affect-factor-language-coverage/0.1',audience:'researcher',at:card.at,policies:[AFFECT_PLAYER_PREVIEW_POLICY,AFFECT_PLAYER_RELATIVE_POLICY],rows,
  scope:'Every recorded raw signal is joined by its exact coverage nucleus to existing own-goal and relative-pull language. Zero effective contribution, uncovered raw source and missing nonzero component explanation remain distinct. Goal-level text is not credited as component or absolute-magnitude language. This audit grants no additional player disclosure, certainty meaning or causal-necessity claim.'};
}
