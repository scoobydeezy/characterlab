import {useState} from 'react';
import type {runSemEventFileControls} from './semEventFileControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemEventFileControls>>;
export function SemEventFilePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Observer event files</h2><p>Inspect event grouping, continuity and concurrent roles. False continuity and discontinuity describe fixture controls; they do not give the observer access to truth.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.eventFiles()))}>Run event-file controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p>
 <h3>Preserved distinctions</h3><table><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody>{Object.entries(report.summary).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <h3>Original scenarios</h3><table><thead><tr><th>Case</th><th>Vector</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.vector}</td></tr>)}</tbody></table>
 <h3>Rejected inputs</h3><table><thead><tr><th>Case</th><th>Vector</th><th>Guard</th></tr></thead><tbody>{report.negatives.map(n=><tr key={n.id}><td>{n.id}</td><td>{n.vector}</td><td>{n.code}</td></tr>)}</tbody></table>
 <h3>Failed settlement</h3><p>Allocated runtime ID {report.rollback.allocated}. {report.rollback.failure}. Status: {report.rollback.before.status} → {report.rollback.after.status}.</p><table><thead><tr><th>Preserved data</th><th>Equal</th></tr></thead><tbody>{Object.entries(report.rollback.preserved).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <h3>Occurrence allocation order</h3><table><thead><tr><th>Label</th><th>Ordinal</th></tr></thead><tbody>{report.occurrenceOrdinals.map(o=><tr key={o.label}><td>{o.label}</td><td>{o.ordinal}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact event-file report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export event-file report</button></>}</section>;
}
