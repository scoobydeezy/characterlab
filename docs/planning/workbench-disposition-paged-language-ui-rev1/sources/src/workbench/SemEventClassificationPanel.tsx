import {useState} from 'react';
import type {runSemEventClassificationControls} from './semEventClassificationControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemEventClassificationControls>>;
export function SemEventClassificationPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Event patterns and role separation</h2><p>Inspect event-pattern conjunctions, observer support, role separation and false-merge or false-split controls.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.eventClassification()))}>Run event-pattern controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><p>Repeated permitted input is not a world-truth intervention. The later cross-experience record is a structural copy, not an executed history append.</p>
 <h3>Comparison checks</h3><table><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody>{Object.entries(report.summary).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <h3>Original cases</h3><table><thead><tr><th>Case</th><th>Vector</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.vector}</td></tr>)}</tbody></table>
 <h3>Rejected inputs</h3><table><thead><tr><th>Case</th><th>Vector</th><th>Guard</th></tr></thead><tbody>{report.negatives.map(n=><tr key={n.id}><td>{n.id}</td><td>{n.vector}</td><td>{n.code}</td></tr>)}</tbody></table>
 <h3>Emission boundaries</h3><table><thead><tr><th>Target</th><th>Accepted</th><th>Guard</th></tr></thead><tbody>{report.emissions.map(e=><tr key={e.target}><td>{e.target}</td><td>{String(e.accepted)}</td><td>{e.code??'None'}</td></tr>)}</tbody></table>
 <h3>Failed settlement</h3><p>First allocated event classification {report.rollback.firstAllocated}. {report.rollback.failure}. Status: {report.rollback.before.status} → {report.rollback.after.status}.</p><table><thead><tr><th>Preserved data</th><th>Equal</th></tr></thead><tbody>{Object.entries(report.rollback.preserved).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact event-pattern report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export event-pattern report</button></>}</section>;
}
