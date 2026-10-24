import {CHARACTER} from '../campaign3/affectModel';
import {readable} from './canonical';
import {affectReasonSemantics} from './affectReasonSemantics';
import type {AffectExplanation} from './affectExplanations';
export const AFFECT_PLAYER_PREVIEW_POLICY='workbench-affect-player-preview/0.1';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
export const affectPreviewRecipient=()=>readable(CHARACTER);
/** Recipient authorization precedes payload access. Explicit output allowlist; no research record spreads. */
export function affectPlayerReasonPreview(card:AffectExplanation,recipient:unknown,policy:string){
 if(policy!==AFFECT_PLAYER_PREVIEW_POLICY||stable(recipient)!==stable(affectPreviewRecipient()))throw Error('Unsupported AFFECT preview recipient or policy');
 const meanings=affectReasonSemantics(card),reasons=meanings.reasons.map(r=>{const s=r.semantic,safety=s.concept==='goal.safety';if(s.polarity!=='supports'||s.option!==(safety?'mitigate danger':'continue the obligation')||(!safety&&s.concept!=='goal.competing_obligation'))throw Error('Unsupported player reason meaning');return{nucleus:r.nucleus,human:safety?'I want to keep myself safe.':'I want to follow through on my commitment.',semantic:{concept:s.concept,subject:'self',option:s.option,polarity:'supports',strengthBand:null,certaintyBand:null,qualifiers:['adopted goal','no intensity or certainty claim']}};});
 return{version:AFFECT_PLAYER_PREVIEW_POLICY,audience:'inspected-character-player-preview',at:card.at,reasons,scope:'Own adopted goals only. This preview does not state world facts, promise success or communicate reason intensity or subjective certainty. Different mechanical strengths can share this prose; strength language remains unqualified.'};
}
