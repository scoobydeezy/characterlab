import type {TimelineEvent} from './contracts';
import {explainDecisionPlayer} from './decisionPlayerPresentation';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
/** Research-only occurrence join. Equal display values never substitute for output position. */
export function decisionPlayerEvent(outputs:string,events:readonly TimelineEvent[],sourceIndex:number){
 const values=JSON.parse(outputs);if(!Array.isArray(values)||!Number.isSafeInteger(sourceIndex)||sourceIndex<0||sourceIndex>=values.length)throw Error('Invalid player source index');
 explainDecisionPlayer(values[sourceIndex]);const ids=new Set<string>(),flattened:unknown[]=[],owners:{event:TimelineEvent;localIndex:number}[]=[];
 for(const event of events){if(ids.has(event.id))throw Error('Duplicate event identity');ids.add(event.id);const emitted=JSON.parse(event.output);if(!Array.isArray(emitted))throw Error('Invalid event outputs');emitted.forEach((value,localIndex)=>{flattened.push(value);owners.push({event,localIndex});});}
 if(stable(flattened)!==stable(values))throw Error('Output/trace occurrence mismatch');const owner=owners[sourceIndex];if(owner.event.stage!=='decision'||owner.event.phase!=='60'||owner.localIndex!==1)throw Error('Invalid player emitter');
 const emitted=JSON.parse(owner.event.output);if(emitted.length!==2||emitted[0]?.record!=='DecisionResolution#935/1'||emitted[0]['At [2]']!==owner.event.instant)throw Error('Invalid decision source');
 return {version:'decision-player-event/0.1',sourceIndex,localOutputIndex:owner.localIndex,eventId:owner.event.id,instant:owner.event.instant,event:owner.event,scope:'Researcher-only navigation from a separate player display to its exact emission occurrence. Full event data remains outside the player presentation and character projection.'};
}
