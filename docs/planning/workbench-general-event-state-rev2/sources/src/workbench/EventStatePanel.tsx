import {useState} from 'react';
import type {TimelineEvent} from './contracts';
export function EventStatePanel({event}:{event:TimelineEvent}){
 const [changedOnly,setChangedOnly]=useState(false),changes=event.diffs.filter(d=>d.changed),diffs=event.diffs.map((d,i)=>({d,i})).filter(({d})=>!changedOnly||d.changed);
 return <section aria-label="Recorded event state"><h3>State read and transition</h3>
 <p>Event {event.id} · instant {event.instant} · phase {event.phase}. These are recorded event-time values, not the current state. A read is not proof of causal contribution; a mutation can preserve a value.</p>
 <p role="status">{event.reads.length} read records · {event.diffs.length} mutation records · {changes.length} changed records</p>
 <h4>Recorded reads</h4>{event.reads.length===0&&<p>No state read was recorded for this event. Payload dependencies remain separate.</p>}
 {event.reads.map((r,i)=><details key={`${event.id}/read/${i}`}><summary>Read {i+1}</summary><pre className="exact">{r.label}</pre><pre className="exact" data-event-read-value>{r.exact}</pre></details>)}
 <h4>Recorded mutations</h4><label><input type="checkbox" checked={changedOnly} onChange={e=>setChangedOnly(e.target.checked)}/>Show changed values only</label>
 {event.diffs.length===0&&<p>No state mutation was recorded for this event.</p>}
 {changedOnly&&event.diffs.length>0&&changes.length===0&&<p>All recorded mutations preserved their values.</p>}
 {diffs.map(({d,i})=><details key={`${event.id}/diff/${i}`}><summary>Mutation {i+1} · {d.changed?'Changed':'Unchanged'}</summary>
 <pre className="exact">{d.label}</pre><div className="diff-grid"><section><h4>Before</h4><pre className="exact" data-event-before>{d.before}</pre></section><section><h4>After</h4><pre className="exact" data-event-after>{d.after}</pre></section></div></details>)}
 <p>“Absent” records absence at that point. Empty activity does not establish unused machinery or justify removal.</p>
 </section>;
}
