import {DispositionReasonReportPanel} from './DispositionReasonReportPanel';
import {useMemo} from 'react';
import type {DispositionSnapshot} from './dispositionAdapter';
import {inspectDispositionReasons} from './dispositionReasonDiagnostics';
import {DispositionFactorSourcesPanel} from './DispositionFactorSourcesPanel';
import {DispositionCalibrationPanel} from './DispositionCalibrationPanel';
import {DispositionProvenancePanel} from './DispositionProvenancePanel';
import {DispositionTaskSourcesPanel} from './DispositionTaskSourcesPanel';
import {DispositionExplanationsPanel} from './DispositionExplanationsPanel';
import {DispositionResolutionPanel} from './DispositionResolutionPanel';
export function DispositionReasonPanel({snapshot,selected,onSelect,onTimeline}:{snapshot:DispositionSnapshot;selected:string;onSelect:(id:string)=>void;onTimeline:(id:string)=>void}){
 const events=snapshot.timeline.filter(e=>e.stage==='reasons'),event=events.find(e=>e.id===selected)??events.at(-1);
 const result=useMemo(()=>{if(!event)return {};try{return {diagnostic:inspectDispositionReasons(event)};}catch(e){return {error:String(e)};}},[event]);
 const d=result.diagnostic;
 return <section className="card"><h2>Recorded decision factors</h2><p>These are recorded reasons-stage diagnostics. They do not establish character self-knowledge or explain the entire later choice.</p>
 {!event&&<p>No reasons-stage event has been committed yet.</p>}
 {event&&<><label>DISPOSITION reason event<select value={event.id} onChange={e=>onSelect(e.target.value)}>{events.map(e=><option key={e.id} value={e.id}>Instant {e.instant} · reasons event {e.id}</option>)}</select></label><button onClick={()=>onTimeline(event.id)}>Open reason event in Timeline</button><p>Run {snapshot.runHash} · event {event.id} · instant {event.instant} · phase {event.phase}</p></>}
 {result.error&&<p role="alert">{result.error}. No partial reason interpretation is shown.</p>}
 {event&&<DispositionExplanationsPanel event={event} seamVersion={snapshot.seamVersion}/>}
 {event&&<DispositionResolutionPanel events={snapshot.timeline} event={event.id} seamVersion={snapshot.seamVersion} onEvent={onTimeline}/>}
 <DispositionReasonReportPanel diagnostic={d}/>
 {event&&<><DispositionTaskSourcesPanel event={event} seamVersion={snapshot.seamVersion}/><DispositionProvenancePanel event={event} law={snapshot.law} seamVersion={snapshot.seamVersion}/><DispositionFactorSourcesPanel event={event}/><DispositionCalibrationPanel event={event} seamVersion={snapshot.seamVersion}/><details><summary>Original native event</summary><pre className="exact">{JSON.stringify(event,null,2)}</pre></details></>}
 </section>;
}
