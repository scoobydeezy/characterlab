import {useMemo,useState} from 'react';
import type {GeneralSnapshot} from './generalAdapter';
import {generalArchitectureParticipation} from './generalArchitecture';
export function GeneralArchitectureInspector({snapshot,onEvent}:{snapshot:GeneralSnapshot;onEvent:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:generalArchitectureParticipation(snapshot)};}catch(error){return {error:String(error)};}},[snapshot]);
 const [selected,setSelected]=useState('Episodic');
 if(!result.report)return <section className="card"><p role="alert">Canonical participation unavailable: {result.error}</p></section>;
 const report=result.report,rows=report.rows.filter(r=>selected==='unmapped'?!r.binding&&!r.support:r.binding?.box===selected||`support:${r.support?.kind}`===selected);
 return <section className="card" aria-label="General canonical architecture participation"><h2>Canonical boxes · recorded state activity</h2>
  <p>{report.scope}</p><p>Authority: CHARACTER_ARCHITECTURE.md §3.2; General allocation and write-scope policy; inherited Campaign2 adaptation and prospective-commitment contracts. Prefix {report.identity.prefix}.</p>
  <table><caption>Scoped correspondence to existing architecture boxes</caption><thead><tr><th>Canonical box</th><th>Observed paths</th><th>Reads</th><th>Mutations</th><th>Changes</th><th>Present now</th></tr></thead><tbody>{report.boxes.map(box=><tr key={box.box}><td><button onClick={()=>setSelected(box.box)}>Inspect {box.label}</button></td><td>{box.observedPaths}</td><td>{box.reads}</td><td>{box.mutations}</td><td>{box.changes}</td><td>{box.currentlyPresent}</td></tr>)}</tbody></table>
  <h3>Supporting records outside canonical-box totals</h3>
  <div className="button-row">{report.supportGroups.map(s=><button key={s.kind} onClick={()=>setSelected(`support:${s.kind}`)}>Inspect {s.label} ({s.paths.length} paths)</button>)}</div>
  <button onClick={()=>setSelected('unmapped')}>Inspect unclassified state ({report.unclassifiedPaths.length} paths)</button>
  <h3>{selected==='unmapped'?'Unclassified state':report.boxes.find(b=>b.box===selected)?.label??report.supportGroups.find(s=>`support:${s.kind}`===selected)?.label}</h3>
  {!rows.length&&<p>No paths in this selected correspondence at this prefix. This does not establish absent machinery or redundancy.</p>}
  {rows.map(row=><details key={row.path}><summary>Root {row.root} · {row.binding?.schema??row.support?.schema??'No canonical correspondence declared'} · reads {row.reads}, changes {row.changes}</summary>
   {row.binding&&<p>{row.binding.basis}. Write authority: {row.binding.authority}.</p>}
   {row.support&&<p>{row.support.basis}. These paths are excluded from canonical-box totals.</p>}
   <p>{row.presentAtRevision?'Present at this revision.':'Absent now; retained in recorded history.'} Mutation records: {row.mutations}. Event links are distinct from the number of reads or changes.</p>
   <pre className="exact">{row.path}</pre><div className="button-row">{row.events.map(e=><button key={e.id} onClick={()=>onEvent(e.id)}>Inspect event {e.id} · {e.stage}</button>)}</div>
  </details>)}
  <details><summary>Exact canonical correspondence report</summary><pre className="exact" data-general-architecture>{JSON.stringify(report,null,2)}</pre></details>
 </section>;
}
