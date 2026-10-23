import {useState} from 'react';
import type {TimelineEvent} from './contracts';
import type {AffectExplanation} from './affectExplanations';
import {affectDecisionEvent} from './affectAppraisalDecision';
import {affectRawReasonEvent} from './affectRawReasonEvent';
import {AffectTaskReadPanel} from './AffectTaskReadPanel';
import {EventStatePanel} from './EventStatePanel';
import {CausalHistoryPanel} from './CausalHistoryPanel';
export interface AffectReasonTrace {events:TimelineEvent[];runHash:string;saveHash:string;modelHash?:string}
export function AffectDecisionTracePanel({card,trace}:{card:AffectExplanation;trace:AffectReasonTrace}){
 const [selected,setSelected]=useState(''),[error,setError]=useState('');const event=trace.events.find(e=>e.id===selected);
 function inspect(kind:'raw'|'decision'){try{const event=(kind==='raw'?affectRawReasonEvent:affectDecisionEvent)(trace.events,card);setSelected(event.id);setError('');}catch(e){setSelected('');setError(String(e));}}
 return <section aria-label="AFFECT decision source navigation"><AffectTaskReadPanel card={card} events={trace.events} modelHash={trace.modelHash}/><div className="button-row"><button onClick={()=>inspect('raw')}>Inspect raw source event</button><button onClick={()=>inspect('decision')}>Inspect decision event</button></div>{error&&<p role="alert">Event source withheld: {error}</p>}{event&&<><p>Selected event {event.id} · {event.stage} · instant {event.instant}</p><p>Owning save revision <code style={{overflowWrap:'anywhere'}} data-affect-reasoning-revision>{trace.saveHash}</code></p><EventStatePanel key={trace.saveHash+event.id} event={event}/><CausalHistoryPanel events={trace.events} selected={event.id} runHash={trace.runHash} onSelect={setSelected}/><details><summary>Exact selected reasoning event</summary><pre className="exact" data-affect-reasoning-event>{JSON.stringify(event,null,2)}</pre></details></>}</section>;
}
