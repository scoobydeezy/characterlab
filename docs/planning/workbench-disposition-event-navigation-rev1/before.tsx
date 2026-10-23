import {useState} from 'react';
import type {DispositionInspectionSummary,DispositionPagedRun,DispositionTextSelector} from './dispositionPagedAdapter';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
import {DispositionReasonReportPanel} from './DispositionReasonReportPanel';
import {DispositionResolutionReportPanel} from './DispositionResolutionReportPanel';
import {DispositionCalibrationReportPanel} from './DispositionCalibrationReportPanel';
import {DispositionArchitectureReportPanel} from './DispositionArchitectureReportPanel';
import {DispositionCanonicalFactorSourcesPanel} from './DispositionCanonicalFactorSourcesPanel';
import {DispositionProvenanceReportPanel} from './DispositionProvenancePanel';
import {DispositionTaskSourcesReportPanel} from './DispositionTaskSourcesPanel';
import {DispositionExplanationsReportPanel} from './DispositionExplanationsPanel';
import type {DispositionLanguageAudience} from './dispositionExplanations';
type Envelope=ReturnType<DispositionPagedRun['diagnostic']>;
type Kind=DispositionDiagnosticSelection['kind'];
type Of<K extends Kind>=Extract<Envelope,{selection:{kind:K}}>;
export function DispositionPagedDiagnostics({summary,busy,envelope,onRequest,onText,kinds,onEvent}:{summary:DispositionInspectionSummary;busy:boolean;envelope?:Envelope;onRequest:(revision:string,selection:DispositionDiagnosticSelection)=>void;onText:(revision:string,selection:DispositionTextSelector)=>void;kinds?:readonly Kind[];onEvent?:(revision:string,id:string)=>void}){
 const [kind,setKind]=useState<Kind>(envelope?.selection.kind??kinds?.[0]??'storedState'),[event,setEvent]=useState(envelope&&'eventId' in envelope.selection?envelope.selection.eventId:'');
 const [audience,setAudience]=useState<DispositionLanguageAudience>('researcher');
 const [query,setQuery]=useState(''),[stage,setStage]=useState('');
 const eventBased=kind!=='storedState'&&kind!=='architecture',eligible=summary.timeline.filter(e=>kind==='eventState'||e.stage==='reasons');
 const stages=[...new Set(eligible.map(e=>e.stage))],needle=query.trim().toLowerCase();
 const events=eligible.filter(e=>(!stage||e.stage===stage)&&(!needle||[e.id,e.instant,e.phase,e.stage,...e.parents].join(' ').toLowerCase().includes(needle)));
 const intended=eligible.find(e=>e.id===event)?.id??eligible.at(-1)?.id??'',selected=events.some(e=>e.id===intended)?intended:'';
 const selection:DispositionDiagnosticSelection=kind==='storedState'||kind==='architecture'?{kind}:kind==='language'?{kind,eventId:selected,audience}:{kind,eventId:selected};
 const stale=!!envelope&&envelope.identity.saveHash!==summary.saveHash;
 const followEvent=(id:string)=>{if(envelope&&!stale&&!busy){if(onEvent){onEvent(envelope.identity.saveHash,id);return;}setKind('eventState');setEvent(id);onRequest(envelope.identity.saveHash,{kind:'eventState',eventId:id});}};
 const text=(revision:string,selector:DispositionTextSelector)=>{if(!stale&&!busy)onText(revision,selector);};
 function content(e:Envelope){switch(e.selection.kind){
  case 'reasons':return <DispositionReasonReportPanel diagnostic={(e as Of<'reasons'>).report}/>;
  case 'language':return <><p>Displayed audience: {(e as Of<'language'>).selection.audience}. This inspector and its run identities remain researcher diagnostics; a withheld report does not turn this page into a player view.</p><DispositionExplanationsReportPanel report={(e as Of<'language'>).report}/></>;
  case 'taskSources':return <><DispositionTaskSourcesReportPanel report={(e as Of<'taskSources'>).report}/><button onClick={()=>text(e.identity.saveHash,{kind:'event',id:(e as Of<'taskSources'>).selection.eventId,part:'output'})}>Open task-source output</button></>;
  case 'provenance':return <><DispositionProvenanceReportPanel report={(e as Of<'provenance'>).report}/><button onClick={()=>text(e.identity.saveHash,{kind:'event',id:(e as Of<'provenance'>).selection.eventId,part:'reads'})}>Open provenance evaluation reads</button></>;
  case 'resolution':return <DispositionResolutionReportPanel report={(e as Of<'resolution'>).report} onEvent={followEvent}/>;
  case 'calibration':return <DispositionCalibrationReportPanel report={(e as Of<'calibration'>).report}/>;
  case 'architecture':return <DispositionArchitectureReportPanel report={(e as Of<'architecture'>).report} onEvent={followEvent}/>;
  case 'factorSources':return <DispositionCanonicalFactorSourcesPanel envelope={e as Of<'factorSources'>} currentSaveHash={summary.saveHash} onRead={text}/>;
  case 'storedState':{const r=(e as Of<'storedState'>).report;return <><h3>Stored disposition state</h3><p>{r.scope}</p><table><thead><tr><th>Stored operand</th><th>Exact value</th><th>Source</th></tr></thead><tbody>{([['Constitution',r.constitution],['Plastic',r.plastic]] as const).map(([label,value])=><tr key={label}><td>{label}</td><td>{value?.exact??'No stored leaf'}</td><td>{value&&<button onClick={()=>text(e.identity.saveHash,{kind:'state',path:value.path})}>Open {label.toLowerCase()} source</button>}</td></tr>)}</tbody></table></>;}
  case 'eventState':{const r=(e as Of<'eventState'>).report;return <><h3>Event {r.event.id} · {r.event.stage}</h3><p>{r.scope}</p><p>{r.counts.reads} reads · {r.counts.mutations} mutations · {r.counts.changes} changed</p><h4>Read references</h4><table><thead><tr><th>Index</th><th>Path</th><th>Presence</th></tr></thead><tbody>{r.reads.map(x=><tr key={x.index}><td>{x.index}</td><td><code>{x.path}</code></td><td>{x.presence?'Present':'Absent'}</td></tr>)}</tbody></table><h4>Mutation references</h4><table><thead><tr><th>Index</th><th>Path</th><th>Before</th><th>After</th><th>Changed</th></tr></thead><tbody>{r.diffs.map(x=><tr key={x.index}><td>{x.index}</td><td><code>{x.path}</code></td><td>{x.beforePresence?'Present':'Absent'}</td><td>{x.afterPresence?'Present':'Absent'}</td><td>{x.changed?'Yes':'No'}</td></tr>)}</tbody></table><button onClick={()=>text(e.identity.saveHash,r.sources.reads)}>Open event reads</button><button onClick={()=>text(e.identity.saveHash,r.sources.diffs)}>Open event before/after records</button></>;}
 }}
 return <section className="card" aria-label="Paged diagnostic reports"><h2>Revision-bound diagnostics</h2>
 <label>Diagnostic view<select value={kind} disabled={busy} onChange={e=>{setKind(e.target.value as Kind);setStage('');}}>{(kinds??(['storedState','architecture','reasons','resolution','factorSources','calibration','provenance','taskSources','language','eventState'] as const)).map(k=><option key={k}>{k}</option>)}</select></label>
 {kind==='language'&&<label>Explanation audience<select value={audience} disabled={busy} onChange={e=>setAudience(e.target.value as DispositionLanguageAudience)}>{(['researcher','character','player'] as const).map(a=><option key={a}>{a}</option>)}</select></label>}
 {eventBased&&<fieldset disabled={busy}><legend>Find a recorded event</legend><label>Event header search<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>Semantic event category<select value={stage} onChange={e=>setStage(e.target.value)}><option value="">All eligible categories</option>{stages.map(s=><option key={s} value={s}>{s}</option>)}</select></label><button onClick={()=>{setQuery('');setStage('');}}>Reset event filters</button><p>Search exact event ID, instant, phase, stage or parent IDs. Filtering does not change the displayed report or the native run.</p><p role="status" data-paged-event-filter>{events.length} of {eligible.length} eligible events. {selected?'Selected event remains visible.':events.length?'Select a matching event to load it.':'No matching events.'}</p><label>Diagnostic event<select value={selected} onChange={e=>setEvent(e.target.value)}><option value="" disabled>Select a matching event</option>{events.map(e=><option key={e.id} value={e.id}>{e.instant} · {e.stage} · {e.id}</option>)}</select></label></fieldset>}
 <button disabled={busy||(eventBased&&!selected)} onClick={()=>onRequest(summary.saveHash,selection)}>Load diagnostic at current revision</button>
 {envelope&&<><p>Displayed {envelope.selection.kind} · {envelope.identity.program} · prefix {envelope.identity.prefix}</p><code data-diagnostic-revision>{envelope.identity.saveHash}</code>{stale&&<p role="status">Historical diagnostic retained. Restore its checkpoint to follow source links, or load a diagnostic at the current revision.</p>}<fieldset disabled={busy||stale}><legend>Recorded report</legend>{content(envelope)}</fieldset><details><summary>Exact diagnostic envelope</summary><pre className="exact" data-paged-diagnostic>{JSON.stringify(envelope,null,2)}</pre></details></>}
 </section>;
}
