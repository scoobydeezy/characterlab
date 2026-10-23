import {TASKS,taskPath} from '../campaign3/affectModel';
import {statePathValue} from '../substrate/state';
import {readable,exactKey} from './canonical';
import type {TimelineEvent} from './contracts';
import type {AffectExplanation} from './affectExplanations';
import {affectRawReasonEvent} from './affectRawReasonEvent';
import {affectReasonSources} from './affectReasonSources';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
const tasks=TASKS.map(t=>({key:stable(readable(t)),path:exactKey(statePathValue(taskPath(t)))}));
/** Identity correspondence to the task status read, not a numeric derivation or necessity claim. */
export function affectTaskReadSources(events:readonly TimelineEvent[],card:AffectExplanation){
 const event=affectRawReasonEvent(events,card),sources=affectReasonSources(card);
 const rows=sources.rows.map(source=>{const key=JSON.parse(source.key),task=tasks.find(t=>t.key===stable(key['TaskCommitmentKey [2]']));if(!task)throw Error('Unsupported task-state correspondence');const reads=event.reads.map((read,index)=>({read,index})).filter(r=>r.read.path===task.path);if(reads.length>1)throw Error('Ambiguous task-state read');return {sourceIndex:source.index,role:source.role,strength:source.strength,taskKey:JSON.parse(task.key),path:task.path,status:reads.length?'recorded-read':'no-recorded-read',readIndex:reads[0]?.index??null,exact:reads[0]?.read.exact??null};});
 return {version:'affect-task-read-source/0.1',eventId:event.id,at:card.at,rows,scope:'Each raw factor names a complete task commitment key. Its registered task-status path is matched to the exact path read by the original raw-reason event. This identifies a recorded state dependency, not the origin of its magnitude, prior adoption history, observer awareness or causal necessity. A missing read is unavailable evidence, not an absent or zero task status.'};
}
