import type {AffectExplanation} from './affectExplanations';
import type {TimelineEvent} from './contracts';

/** Link only the exact appraisal embedded in the recorded decision's raw reasons. */
export function affectAppraisalDecision(cards:readonly AffectExplanation[],provenance:string){
 const appraisal=JSON.parse(provenance);
 if(appraisal?.record!=='AffectAppraisal#754/1')throw Error('Invalid appraisal decision source');
 const matches=cards.filter(card=>{
  if(card.kind!=='Decision')return false;
  if(card.renderer!=='affect-evaluation-explanation/0.1')throw Error('Unsupported decision renderer');
  const d=JSON.parse(card.provenance),reasons=d['Reasons [3]'],raw=reasons?.['Raw [2]'];
  if(d.record!=='AffectDecision#757/1'||reasons?.record!=='AffectReasons#756/1'||raw?.record!=='AffectRawReasons#755/1')throw Error('Invalid decision provenance');
  return JSON.stringify(raw['Appraisal [2]'])===JSON.stringify(appraisal);
 });
 if(matches.length>1)throw Error('Ambiguous appraisal decision');
 return matches[0]??null;
}

export function affectDecisionEvent(events:readonly TimelineEvent[],card:AffectExplanation){
 const decision=JSON.parse(card.provenance);
 if(card.kind!=='Decision'||decision?.record!=='AffectDecision#757/1'||decision['At [2]']!==card.at)throw Error('Invalid decision event source');
 const matches=events.filter(e=>e.stage==='decision'&&e.phase==='60'&&e.instant===card.at).flatMap(event=>{
  const outputs=JSON.parse(event.output);if(!Array.isArray(outputs))throw Error('Invalid decision outputs');
  return outputs.filter(o=>JSON.stringify(o)===JSON.stringify(decision)).map(()=>event);
 });
 if(matches.length!==1||events.filter(e=>e.id===matches[0]?.id).length!==1)throw Error('Decision emitter absent or ambiguous');
 return matches[0];
}
