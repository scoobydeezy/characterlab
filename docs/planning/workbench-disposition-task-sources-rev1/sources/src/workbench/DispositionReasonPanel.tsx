import {useMemo} from 'react';
import type {DispositionSnapshot} from './dispositionAdapter';
import {inspectDispositionReasons} from './dispositionReasonDiagnostics';
import {DispositionFactorSourcesPanel} from './DispositionFactorSourcesPanel';
import {DispositionCalibrationPanel} from './DispositionCalibrationPanel';
import {DispositionProvenancePanel} from './DispositionProvenancePanel';
import {DispositionTaskSourcesPanel} from './DispositionTaskSourcesPanel';
export function DispositionReasonPanel({snapshot,selected,onSelect,onTimeline}:{snapshot:DispositionSnapshot;selected:string;onSelect:(id:string)=>void;onTimeline:(id:string)=>void}){
 const events=snapshot.timeline.filter(e=>e.stage==='reasons'),event=events.find(e=>e.id===selected)??events.at(-1);
 const result=useMemo(()=>{if(!event)return {};try{return {diagnostic:inspectDispositionReasons(event)};}catch(e){return {error:String(e)};}},[event]);
 const d=result.diagnostic;
 return <section className="card"><h2>Recorded decision factors</h2><p>These are recorded reasons-stage diagnostics. They do not establish character self-knowledge or explain the entire later choice.</p>
 {!event&&<p>No reasons-stage event has been committed yet.</p>}
 {event&&<><label>DISPOSITION reason event<select value={event.id} onChange={e=>onSelect(e.target.value)}>{events.map(e=><option key={e.id} value={e.id}>Instant {e.instant} · reasons event {e.id}</option>)}</select></label><button onClick={()=>onTimeline(event.id)}>Open reason event in Timeline</button><p>Run {snapshot.runHash} · event {event.id} · instant {event.instant} · phase {event.phase}</p></>}
 {result.error&&<p role="alert">{result.error}. No partial reason interpretation is shown.</p>}
 {d&&!d.emitted&&<p>{d.scope}</p>}
 {d?.emitted&&<><h3>Distinct disposition operands</h3><table><thead><tr><th>Recorded operand</th><th>Exact value</th></tr></thead><tbody>{[['Immutable constitution',d.constitution],['Prior plastic contribution',d.plastic],['Identity standing',d.standing],['Effective constitution + plastic',d.effective],['Selected final feedback',d.feedback]].map(([label,value])=><tr key={label}><td>{label}</td><td>{value}</td></tr>)}</tbody></table><p>{d.qualifiedEntries} qualified journal entries at this event. Entry count does not establish independent evidence.</p>
 <h3>Compiled reasons ({d.nuclei.length})</h3>{d.nuclei.map((n,i)=><section key={i} aria-label={`Compiled reason ${i+1}`}><h4>Compiled reason {i+1}</h4><div className="table-scroll"><table><thead><tr><th>Base net</th><th>Standing net</th><th>Situational net</th><th>Relevance</th><th>Base die</th><th>Standing modifier</th><th>Situational modifier</th></tr></thead><tbody><tr>{[n.baseNet,n.standingNet,n.situationalNet,n.relevance,n.baseDie,n.standingModifier,n.situationalModifier].map((value,j)=><td key={j}>{value}</td>)}</tr></tbody></table></div><details><summary>Exact candidate and motive key</summary><pre className="exact">{n.key}</pre></details><details><summary>Exact source coverage</summary><pre className="exact">{n.coverage}</pre></details><details><summary>Exact mechanical score distribution</summary><pre className="exact">{n.distribution}</pre></details></section>)}<p>{d.scope}</p></>}
 {d&&<details><summary>Exact reason diagnostic projection</summary><pre className="exact" data-disposition-reason-diagnostic>{JSON.stringify(d,null,2)}</pre></details>}
 {event&&<><DispositionTaskSourcesPanel event={event} seamVersion={snapshot.seamVersion}/><DispositionProvenancePanel event={event} law={snapshot.law} seamVersion={snapshot.seamVersion}/><DispositionFactorSourcesPanel event={event}/><DispositionCalibrationPanel event={event} seamVersion={snapshot.seamVersion}/><details><summary>Original native event</summary><pre className="exact">{JSON.stringify(event,null,2)}</pre></details></>}
 </section>;
}
