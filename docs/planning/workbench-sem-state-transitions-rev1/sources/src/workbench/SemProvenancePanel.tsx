import {useState} from 'react';
import type {runSemProvenanceControls} from './semProvenanceControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemProvenanceControls>>;
export function SemProvenancePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Evidence admission and provenance</h2><p>Inspect exact reference admission, observer scope, shared evidence and independent causal roles.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.provenance()))}>Run provenance controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><p>A present reference does not establish a false payload. Future schema admission does not provide an interval value. Shared evidence here stays within one observer.</p>
 <h3>Comparison checks</h3><table><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody>{Object.entries(report.summary).map(([k,v])=><tr key={k}><td>{k}</td><td>{Array.isArray(v)?v.join(', '):String(v)}</td></tr>)}</tbody></table>
 <h3>Original cases</h3><table><thead><tr><th>Case</th><th>Vector</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.vector}</td></tr>)}</tbody></table>
 <h3>Rejected inputs</h3><table><thead><tr><th>Case</th><th>Vector</th><th>Guard</th></tr></thead><tbody>{report.negatives.map(n=><tr key={n.id}><td>{n.id}</td><td>{n.vector}</td><td>{n.code}</td></tr>)}</tbody></table>
 <h3>Truth-access API boundaries</h3><table><thead><tr><th>API</th><th>Present</th></tr></thead><tbody>{report.apiBoundary.map(e=><tr key={e.name}><td>{e.name}</td><td>{String(e.present)}</td></tr>)}</tbody></table>
 <h3>Failed settlement</h3><p>First allocated causal-role evidence {report.rollback.firstAllocated}. {report.rollback.failure}. Status: {report.rollback.before.status} → {report.rollback.after.status}.</p><table><thead><tr><th>Preserved data</th><th>Equal</th></tr></thead><tbody>{Object.entries(report.rollback.preserved).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact provenance report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export provenance report</button></>}</section>;
}
