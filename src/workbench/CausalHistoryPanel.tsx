import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {recordedCausalHistory} from './causalNavigation';
export function CausalHistoryPanel({events,selected,runHash,onSelect}:{events:TimelineEvent[];selected:string;runHash:string;onSelect:(id:string)=>void}){
 const result=useMemo(()=>{try{return {history:recordedCausalHistory(events,selected)};}catch(e){return {error:String(e)};}},[events,selected]);
 if(!result.history)return <p role="alert">{result.error}</p>;
 const history=result.history;
 return <section aria-label="Recorded causal history"><h3>Recorded causal history</h3><p>Follow native parent-event links to retained inputs and evaluations. Links show recorded scheduling dependencies; they do not establish psychological necessity or complete state-read causality. No parents means none recorded.</p>
 {history.cyclic&&<p role="alert">A cycle is recorded in these links; no temporal ordering is inferred.</p>}
 {history.missing.length>0&&<p>Parent events outside this retained timeline: {history.missing.join(', ')}. Their contents are unavailable.</p>}
 <ol>{history.nodes.filter(n=>n.distance>0).map(({event,distance})=><li key={event.id}><button onClick={()=>onSelect(event.id)}>Event {event.id} · {event.stage} · instant {event.instant}</button><small>{distance} parent link{distance===1?'':'s'} from selection</small></li>)}</ol>
 {history.nodes.length===1&&history.missing.length===0&&<p>No recorded ancestors for this event.</p>}
 {history.children.length>0&&<details><summary>Direct recorded children ({history.children.length})</summary><div className="button-row">{history.children.map(e=><button key={e.id} onClick={()=>onSelect(e.id)}>Child event {e.id} · {e.stage} · instant {e.instant}</button>)}</div></details>}
 <details><summary>Exact event-link provenance</summary><pre className="exact" data-causal-history>{JSON.stringify({renderer:history.version,runHash,selected:history.selected,nodes:history.nodes.map(n=>({id:n.event.id,instant:n.event.instant,stage:n.event.stage,distance:n.distance})),edges:history.edges,missing:history.missing,cyclic:history.cyclic},null,2)}</pre></details>
 </section>;
}
