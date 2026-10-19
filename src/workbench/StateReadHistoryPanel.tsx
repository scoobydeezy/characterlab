import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {recordedStateReadHistory} from './stateReadHistory';
export function StateReadHistoryPanel({events,selected,runHash,onSelect}:{events:TimelineEvent[];selected:string;runHash:string;onSelect:(id:string)=>void}){
 const result=useMemo(()=>{try{return {history:recordedStateReadHistory(events,selected)};}catch(e){return {error:String(e)};}},[events,selected]);
 if(!result.history)return <p role="alert">{result.error}</p>;
 const h=result.history;
 return <section aria-label="Recorded state-read history"><h3>Recorded state-read history</h3><p>Inspect the latest earlier mutation at each exact read path. Equality links the recorded values; it does not establish causal necessity. Reads without a prior mutation remain unresolved.</p>
 {!h.reads.length&&<p>No state reads recorded for this event. Payload dependencies remain separate.</p>}
 {h.reads.map(r=><details key={r.ordinal}><summary>Read {r.ordinal+1} · {r.relation==='exact-value-match'?'Matches prior mutation':r.relation==='value-mismatch'?'Value mismatch — provenance unresolved':'No prior recorded mutation'}</summary><pre className="exact">{r.label}</pre><pre className="exact">Read: {r.exact}</pre>{r.priorMutation&&<><button onClick={()=>onSelect(r.priorMutation!.event.id)}>Prior mutation event {r.priorMutation.event.id} · {r.priorMutation.event.stage}</button><p>{r.priorMutation.changed?'Changed value':'Unchanged write'} · instant {r.priorMutation.event.instant} · phase {r.priorMutation.event.phase}</p><div className="diff-grid"><pre className="exact">{r.priorMutation.before}</pre><pre className="exact">{r.priorMutation.after}</pre></div></>}</details>)}
 <details><summary>Exact state-read history</summary><pre className="exact" data-state-read-history>{JSON.stringify({runHash,...h},null,2)}</pre></details><p className="caption">{h.scope}</p></section>;
}
