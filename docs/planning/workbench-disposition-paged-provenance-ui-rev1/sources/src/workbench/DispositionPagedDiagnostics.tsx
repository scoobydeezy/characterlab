import {useState} from 'react';
import type {DispositionInspectionSummary,DispositionPagedRun,DispositionTextSelector} from './dispositionPagedAdapter';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
import {DispositionReasonReportPanel} from './DispositionReasonReportPanel';
import {DispositionResolutionReportPanel} from './DispositionResolutionReportPanel';
import {DispositionCalibrationReportPanel} from './DispositionCalibrationReportPanel';
import {DispositionArchitectureReportPanel} from './DispositionArchitectureReportPanel';
import {DispositionCanonicalFactorSourcesPanel} from './DispositionCanonicalFactorSourcesPanel';
import {DispositionProvenanceReportPanel} from './DispositionProvenancePanel';
type Envelope=ReturnType<DispositionPagedRun['diagnostic']>;
type Kind=DispositionDiagnosticSelection['kind'];
type Of<K extends Kind>=Extract<Envelope,{selection:{kind:K}}>;
export function DispositionPagedDiagnostics({summary,busy,envelope,onRequest,onText}:{summary:DispositionInspectionSummary;busy:boolean;envelope?:Envelope;onRequest:(revision:string,selection:DispositionDiagnosticSelection)=>void;onText:(revision:string,selection:DispositionTextSelector)=>void}){
 const [kind,setKind]=useState<Kind>('storedState'),[event,setEvent]=useState('');
 const eventBased=kind!=='storedState'&&kind!=='architecture',events=summary.timeline.filter(e=>kind==='eventState'||e.stage==='reasons'),selected=events.find(e=>e.id===event)?.id??events.at(-1)?.id??'';
 const selection:DispositionDiagnosticSelection=kind==='storedState'||kind==='architecture'?{kind}:{kind,eventId:selected};
 const stale=!!envelope&&envelope.identity.saveHash!==summary.saveHash;
 const followEvent=(id:string)=>{if(envelope&&!stale&&!busy){setKind('eventState');setEvent(id);onRequest(envelope.identity.saveHash,{kind:'eventState',eventId:id});}};
 const text=(revision:string,selector:DispositionTextSelector)=>{if(!stale&&!busy)onText(revision,selector);};
 function content(e:Envelope){switch(e.selection.kind){
  case 'reasons':return <DispositionReasonReportPanel diagnostic={(e as Of<'reasons'>).report}/>;
  case 'provenance':return <><DispositionProvenanceReportPanel report={(e as Of<'provenance'>).report}/><button onClick={()=>text(e.identity.saveHash,{kind:'event',id:(e as Of<'provenance'>).selection.eventId,part:'reads'})}>Open provenance evaluation reads</button></>;
  case 'resolution':return <DispositionResolutionReportPanel report={(e as Of<'resolution'>).report} onEvent={followEvent}/>;
  case 'calibration':return <DispositionCalibrationReportPanel report={(e as Of<'calibration'>).report}/>;
  case 'architecture':return <DispositionArchitectureReportPanel report={(e as Of<'architecture'>).report} onEvent={followEvent}/>;
  case 'factorSources':return <DispositionCanonicalFactorSourcesPanel envelope={e as Of<'factorSources'>} currentSaveHash={summary.saveHash} onRead={text}/>;
  case 'storedState':{const r=(e as Of<'storedState'>).report;return <><h3>Stored disposition state</h3><p>{r.scope}</p><table><thead><tr><th>Stored operand</th><th>Exact value</th><th>Source</th></tr></thead><tbody>{([['Constitution',r.constitution],['Plastic',r.plastic]] as const).map(([label,value])=><tr key={label}><td>{label}</td><td>{value?.exact??'No stored leaf'}</td><td>{value&&<button onClick={()=>text(e.identity.saveHash,{kind:'state',path:value.path})}>Open {label.toLowerCase()} source</button>}</td></tr>)}</tbody></table></>;}
  case 'eventState':{const r=(e as Of<'eventState'>).report;return <><h3>Event {r.event.id} · {r.event.stage}</h3><p>{r.scope}</p><p>{r.counts.reads} reads · {r.counts.mutations} mutations · {r.counts.changes} changed</p><h4>Read references</h4><table><thead><tr><th>Index</th><th>Path</th><th>Presence</th></tr></thead><tbody>{r.reads.map(x=><tr key={x.index}><td>{x.index}</td><td><code>{x.path}</code></td><td>{x.presence?'Present':'Absent'}</td></tr>)}</tbody></table><h4>Mutation references</h4><table><thead><tr><th>Index</th><th>Path</th><th>Before</th><th>After</th><th>Changed</th></tr></thead><tbody>{r.diffs.map(x=><tr key={x.index}><td>{x.index}</td><td><code>{x.path}</code></td><td>{x.beforePresence?'Present':'Absent'}</td><td>{x.afterPresence?'Present':'Absent'}</td><td>{x.changed?'Yes':'No'}</td></tr>)}</tbody></table><button onClick={()=>text(e.identity.saveHash,r.sources.reads)}>Open event reads</button><button onClick={()=>text(e.identity.saveHash,r.sources.diffs)}>Open event before/after records</button></>;}
 }}
 return <section className="card" aria-label="Paged diagnostic reports"><h2>Revision-bound diagnostics</h2>
 <label>Diagnostic view<select value={kind} disabled={busy} onChange={e=>setKind(e.target.value as Kind)}>{(['storedState','architecture','reasons','resolution','factorSources','calibration','provenance','eventState'] as const).map(k=><option key={k}>{k}</option>)}</select></label>
 {eventBased&&<label>Diagnostic event<select value={selected} disabled={busy} onChange={e=>setEvent(e.target.value)}>{events.map(e=><option key={e.id} value={e.id}>{e.instant} · {e.stage} · {e.id}</option>)}</select></label>}
 <button disabled={busy||(eventBased&&!selected)} onClick={()=>onRequest(summary.saveHash,selection)}>Load diagnostic at current revision</button>
 {envelope&&<><p>Displayed {envelope.selection.kind} · {envelope.identity.program} · prefix {envelope.identity.prefix}</p><code data-diagnostic-revision>{envelope.identity.saveHash}</code>{stale&&<p role="status">Historical diagnostic retained. Restore its checkpoint to follow source links, or load a diagnostic at the current revision.</p>}<fieldset disabled={busy||stale}><legend>Recorded report</legend>{content(envelope)}</fieldset><details><summary>Exact diagnostic envelope</summary><pre className="exact" data-paged-diagnostic>{JSON.stringify(envelope,null,2)}</pre></details></>}
 </section>;
}
