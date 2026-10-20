import {useMemo,useState} from 'react';
import type {LongSnapshot} from './longAdapter';
import {longArchitectureParticipation} from './longArchitecture';
export function LongArchitectureInspector({snapshot,onEvent}:{snapshot:LongSnapshot;onEvent:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:longArchitectureParticipation(snapshot)};}catch(error){return {error:String(error)};}},[snapshot]);
 const [selected,setSelected]=useState('Episodic');
 if(!result.report)return <section className="card"><p role="alert">Canonical participation unavailable: {result.error}</p></section>;
 const report=result.report,rows=report.rows.filter(r=>selected==='control'?!!r.control:selected==='unclassified'?!r.binding&&!r.control:r.binding?.box===selected);
 return <section className="card" aria-label="LONG canonical architecture participation"><h2>Canonical boxes · recorded state activity</h2>
 <p>{report.scope}</p><p>Authority: CHARACTER_ARCHITECTURE.md and longitudinal-public/0.2-candidate ownership contract. Prefix {report.identity.prefix}.</p>
 <div className="table-scroll"><table><caption>Scoped correspondence to existing architecture boxes</caption><thead><tr><th>Canonical box</th><th>Paths</th><th>Reads</th><th>Mutations</th><th>Changes</th><th>Present now</th></tr></thead><tbody>{report.boxes.map(b=><tr key={b.box}><td><button onClick={()=>setSelected(b.box)}>Inspect {b.label}</button></td><td>{b.observedPaths}</td><td>{b.reads}</td><td>{b.mutations}</td><td>{b.changes}</td><td>{b.currentlyPresent}</td></tr>)}</tbody></table></div>
 <div className="button-row"><button onClick={()=>setSelected('control')}>Inspect destructive shared-slot comparator ({report.controlPaths.length} paths)</button><button onClick={()=>setSelected('unclassified')}>Inspect unclassified state ({report.unclassifiedPaths.length} paths)</button></div>
 <h3>{selected==='control'?'Destructive shared-slot comparator':selected==='unclassified'?'Unclassified state':report.boxes.find(b=>b.box===selected)?.label}</h3>
 {!rows.length&&<p>No recorded paths in this correspondence at this prefix. This does not establish absent machinery or redundancy.</p>}
 {rows.map(r=><details key={r.path}><summary>Root {r.root} · {r.binding?.schema??r.control?.schema??'Unclassified'} · reads {r.reads}, changes {r.changes}</summary>
 <p>{r.binding?.basis??r.control?.basis} Write authority: {r.binding?.authority??r.control?.authority??'Not classified'}.</p>
 <p>{r.presentAtRevision?'Present at this revision.':'Absent now; retained in recorded history.'} Mutation records: {r.mutations}. Event links count distinct events.</p>
 <pre className="exact">{r.path}</pre><div className="button-row">{r.events.map(e=><button key={e.id} onClick={()=>onEvent(e.id)}>Inspect event {e.id} · {e.stage}</button>)}</div></details>)}
 <details><summary>Exact LONG canonical correspondence report</summary><pre className="exact" data-long-architecture>{JSON.stringify(report,null,2)}</pre></details>
 </section>;
}
