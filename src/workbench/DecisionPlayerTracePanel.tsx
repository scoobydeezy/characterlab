import {useState} from 'react';
import type {DecisionSnapshot} from './decisionAdapter';
import {decisionPlayerPresentations} from './decisionPlayerPresentation';
import {decisionPlayerEvent} from './decisionPlayerEvent';
import {EventStatePanel} from './EventStatePanel';
import {CausalHistoryPanel} from './CausalHistoryPanel';
export function DecisionPlayerTracePanel({view}:{view:DecisionSnapshot}){
 const [selected,setSelected]=useState(''),[error,setError]=useState('');let sources:ReturnType<typeof decisionPlayerPresentations>;try{sources=decisionPlayerPresentations(view.researchOutputs);}catch(e){return <p role="alert">Player source navigation withheld: {String(e)}</p>;}
 const event=view.timeline.find(e=>e.id===selected);function inspect(index:number){try{setSelected(decisionPlayerEvent(view.researchOutputs,view.timeline,index).eventId);setError('');}catch(e){setSelected('');setError(String(e));}}
 return <section aria-label="DECISION researcher player-source navigation"><h3>Researcher source navigation</h3><p>These controls open the full recorded event and its causal history. Those diagnostics are separate from the permitted player presentation.</p><div className="button-row">{sources.map(s=><button key={s.sourceIndex} onClick={()=>inspect(s.sourceIndex)}>Inspect player source {s.sourceIndex}</button>)}</div>{!sources.length&&<p>No player-display source is available in this prefix.</p>}{error&&<p role="alert">Source withheld: {error}</p>}{event&&<><p>Selected event {event.id} · {event.stage} · instant {event.instant}</p><code style={{overflowWrap:'anywhere'}} data-decision-source-revision>{view.saveHash}</code><EventStatePanel key={view.saveHash+event.id} event={event}/><CausalHistoryPanel events={view.timeline} selected={event.id} runHash={view.runHash} onSelect={setSelected}/><details><summary>Exact selected source event</summary><pre className="exact" data-decision-source-event>{JSON.stringify(event,null,2)}</pre></details></>}</section>;
}
