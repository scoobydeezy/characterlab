import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {inspectNativeReadSources,type NativeReadSources} from './nativeReadSources';
export function NativeReadSourcesPanel({events,metadata,selected,runHash,onSelect}:{events:TimelineEvent[];metadata:NativeReadSources;selected:string;runHash:string;onSelect:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:inspectNativeReadSources(events,metadata,selected)};}catch(e){return {error:String(e)};}},[events,metadata,selected]);
 if(!result.report)return <p role="alert">{result.error}</p>;
 const report=result.report;
 return <section aria-label="Native read sources"><h3>Native read sources</h3><p>Derived values can differ from the stored owner at their read path. Native transformation identifiers and source observations explain that boundary; the exact-path comparison above remains separate.</p>
 {!report.reads.length&&<p>No native state reads recorded for this event.</p>}
 {report.reads.map(r=><details key={r.ordinal}><summary>Native read {r.ordinal+1} · {r.kind} · {r.sources.length} recorded sources</summary><pre className="exact">Accessor: {r.accessor}</pre>{r.transformation&&<pre className="exact">Transformation: {r.transformation}</pre>}<details><summary>Delivered value</summary><pre className="exact">{r.exact}</pre></details>{r.sourceHistory.map((s,i)=><div key={i}><h4>Source {i+1} · {s.relation}</h4><pre className="exact">{s.label}</pre><details><summary>Native source value</summary><pre className="exact">{s.exact}</pre></details>{s.priorMutation&&<button onClick={()=>onSelect(s.priorMutation!.event.id)}>Source mutation event {s.priorMutation.event.id} · {s.priorMutation.event.stage}</button>}</div>)}</details>)}
 <details><summary>Exact native read sources</summary><pre className="exact" data-native-read-sources>{JSON.stringify({runHash,...report},null,2)}</pre></details><p className="caption">{report.scope}</p></section>;
}
