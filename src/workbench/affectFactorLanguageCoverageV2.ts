import type {AffectExplanation} from './affectExplanations';
import {affectFactorLanguageCoverage} from './affectFactorLanguageCoverage';
import {affectPlayerAppraisalContribution,affectPreviewRecipient,AFFECT_PLAYER_APPRAISAL_POLICY} from './affectPlayerAppraisalContribution';
/** Versioned successor: preserve the original missing-component audit as historical evidence. */
export function affectFactorLanguageCoverageV2(card:AffectExplanation){
 const original=affectFactorLanguageCoverage(card),appraisal=affectPlayerAppraisalContribution(card,affectPreviewRecipient(),AFFECT_PLAYER_APPRAISAL_POLICY);
 const rows=original.rows.map(row=>({...row,links:row.links.map(link=>{
  const component=row.role==='situational'&&BigInt(link.effective.split('/')[0])>0n?appraisal.components.find(c=>c.nucleus===link.nucleus):undefined;
  return{...link,status:component?'component presence represented; constituent factors and magnitude open':link.status,componentSentence:component?.human??null};
 })}));
 return{...original,version:'affect-factor-language-coverage/0.2',policies:[...original.policies,AFFECT_PLAYER_APPRAISAL_POLICY],rows,
  scope:'Researcher-only factor-language accounting. Own-goal presence, relative pull and appraisal-component presence are distinct qualified paths. Absolute magnitude, certainty and constituent appraisal-factor language remain open. Uncovered raw sources produce no inferred player reason. Exact source/coverage data remains unchanged from audit0.1; this successor does not rewrite historical reports or grant additional disclosure.'};
}
