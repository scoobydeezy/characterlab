import {useState} from 'react';
import type {runSemBindingControls} from './semBindingControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemBindingControls>>;
export function SemBindingPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Truth bindings and permitted roles</h2><p>Researcher inspection of original binding controls. Truth records in the exact report are not character evidence.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.bindings()))}>Run truth-binding controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><table><thead><tr><th>Case</th><th>Vector</th><th>Start</th><th>Next</th><th>Bindings</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.vector}</td><td>{c.start}</td><td>{c.next}</td><td>{c.bindings.length}</td></tr>)}</tbody></table>
 <h3>Permitted role projections</h3><p>Unresolved role evidence is present. Omitted evidence has no projection.</p><table><thead><tr><th>Permission</th><th>Present</th><th>Role</th><th>Observer</th><th>Track</th></tr></thead><tbody>{report.projection.map(p=><tr key={p.kind}><td>{p.kind}</td><td>{String(p.present)}</td><td>{p.role===null?'No projection':p.role.kind==='exact'?p.role.eventRoleId:'Unresolved'}</td><td>{p.observer??'None'}</td><td>{p.track??'None'}</td></tr>)}</tbody></table>
 <h3>Rejected inputs</h3><table><thead><tr><th>Case</th><th>Guard</th></tr></thead><tbody>{report.negatives.map(n=><tr key={n.id}><td>{n.id}</td><td>{n.failure.code}</td></tr>)}</tbody></table>
 <h3>Replay and settlement</h3><table><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody>{[...Object.entries(report.replay),...Object.entries(report.rollback.preserved).map(([k,v])=>['Failed settlement preserves '+k,v] as const)].map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table><p>First allocated binding {report.rollback.firstAllocated}. {report.rollback.failure}. Status: {report.rollback.before.status} → {report.rollback.after.status}.</p>
 <p>{report.scope}</p><details><summary>Exact truth-binding report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export truth-binding report</button></>}</section>;
}
