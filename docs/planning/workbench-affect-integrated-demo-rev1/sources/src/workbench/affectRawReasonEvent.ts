import type {AffectExplanation} from './affectExplanations';
import type {TimelineEvent} from './contracts';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
/** The raw emitter must contain the exact top-level record embedded in this decision. */
export function affectRawReasonEvent(events:readonly TimelineEvent[],card:AffectExplanation){
 if(card.renderer!=='affect-evaluation-explanation/0.1'||card.kind!=='Decision')throw Error('Unsupported raw reason source');
 const decision=JSON.parse(card.provenance),reasons=decision?.['Reasons [3]'],raw=reasons?.['Raw [2]'];
 if(decision?.record!=='AffectDecision#757/1'||decision['At [2]']!==card.at||reasons?.record!=='AffectReasons#756/1'||raw?.record!=='AffectRawReasons#755/1'||raw['Appraisal [2]']?.['At [2]']!==card.at)throw Error('Invalid raw reason lineage');
 const matches:TimelineEvent[]=[];
 for(const event of events){if(event.stage!=='raw'||event.phase!=='51'||event.instant!==card.at)continue;const outputs=JSON.parse(event.output);if(!Array.isArray(outputs))throw Error('Invalid raw reason event output');for(const output of outputs)if(stable(output)===stable(raw))matches.push(event);}
 if(matches.length!==1||events.filter(e=>e.id===matches[0]?.id).length!==1)throw Error('Raw reason emitter absent or ambiguous');
 return matches[0];
}
