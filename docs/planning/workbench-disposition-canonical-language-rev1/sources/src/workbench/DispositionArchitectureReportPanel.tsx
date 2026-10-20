import {useState} from 'react';
import type {dispositionArchitecture} from './dispositionArchitecture';
export function DispositionArchitectureReportPanel({report,error,onEvent}:{report?:ReturnType<typeof dispositionArchitecture>;error?:string;onEvent:(id:string)=>void}){
 const [selected,setSelected]=useState('Psych0'),r=report;
 return <section className="card" aria-label="DISPOSITION canonical architecture"><h2>Canonical boxes · disposition state participation</h2>
 {error&&<p role="alert">{error}</p>}{r&&<><p>{r.scope}</p>
 <table><thead><tr><th>Canonical box</th><th>Present paths</th><th>Reads</th><th>Mutations</th><th>Changes</th></tr></thead><tbody>{r.boxes.map(b=><tr key={b.box}><td><button onClick={()=>setSelected(b.box)}>{b.label}</button></td><td>{b.present}</td><td>{b.reads}</td><td>{b.mutations}</td><td>{b.changes}</td></tr>)}</tbody></table>
 <button onClick={()=>setSelected('support')}>Truth-side execution support</button><button onClick={()=>setSelected('unclassified')}>Unclassified paths ({r.unclassifiedPaths.length})</button>
 {r.rows.filter(row=>selected==='support'?!!row.support:selected==='unclassified'?!row.binding&&!row.support:row.binding?.box===selected).map(row=><details key={row.path}><summary>Root {row.root} · reads {row.reads} · changes {row.changes}</summary>
 <p>{row.binding?.basis??row.support?.basis} Write authority: {row.binding?.authority??row.support?.authority??'Unclassified'}.</p><pre className="exact">{row.path}</pre>
 {row.events.map(e=><button key={e.id} onClick={()=>onEvent(e.id)}>Inspect disposition event {e.id} · {e.stage}</button>)}</details>)}
 <details><summary>Exact DISPOSITION canonical participation</summary><pre className="exact" data-disposition-architecture>{JSON.stringify(r,null,2)}</pre></details></>}
 </section>;
}
