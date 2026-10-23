import {PROPOSITIONS,beliefKey,beliefPath} from '../campaign3/affectModel';
import {statePathValue} from '../substrate/state';
import {readable,exactKey} from './canonical';
import {affectAppraisalEvent} from './affectAppraisalEvent';
import type {TimelineEvent} from './contracts';
import type {AffectExplanation} from './affectExplanations';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
const sources=PROPOSITIONS.map((p,index)=>({name:['Current cue','Baseline','Mitigation'][index],key:readable(beliefKey(p)),path:exactKey(statePathValue(beliefPath(p)))}));
/** Exact original appraisal emitter and registered belief reads, including recorded absence. */
export function affectAppraisalReadSources(events:readonly TimelineEvent[],card:AffectExplanation){
 if(card.kind!=='Appraisal')throw Error('Expected appraisal card');const r=JSON.parse(card.provenance);if(r['At [2]']!==card.at)throw Error('Appraisal card time mismatch');const event=affectAppraisalEvent(events,card.provenance),beliefs=r['Beliefs [3]'];if(!Array.isArray(beliefs)||beliefs.some(p=>!Array.isArray(p)||p.length!==2||!sources.some(s=>stable(s.key)===stable(p[0]))))throw Error('Unregistered appraisal belief');
 const rows=sources.map(s=>{const operands=beliefs.filter(p=>stable(p[0])===stable(s.key));if(operands.length>1)throw Error('Ambiguous appraisal operand');const reads=event.reads.map((read,index)=>({read,index})).filter(x=>x.read.path===s.path);if(reads.length!==1)throw Error('Missing or ambiguous appraisal belief read');const read=reads[0],expected=operands.length?stable(operands[0][1]):'Absent',actual=read.read.exact==='Absent'?'Absent':stable(JSON.parse(read.read.exact));if(actual!==expected)throw Error('Appraisal belief differs from event-time read');return{name:s.name,key:s.key,path:s.path,readIndex:read.index,presence:operands.length?'Present':'Absent',exact:read.read.exact};});
 return{version:'affect-appraisal-read-sources/0.1',eventId:event.id,at:card.at,rows,scope:'Each embedded belief operand matches the exact registered path and value read by the unique original appraisal event. Recorded Absent is distinct from missing instrumentation, which withholds this report. These are event-time dependencies, not proof of learning ancestry, subjective awareness or causal necessity. Context and governed severity are not stored belief leaves.'};
}
