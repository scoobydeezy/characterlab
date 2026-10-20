import {useState} from 'react';
import type {runSemAcceptanceControls} from './semAcceptanceControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemAcceptanceControls>>;
export function SemAcceptancePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Acceptance evidence and consumer replay</h2><p>Run the original ten acceptance checks and the complete three-observer save/load witnesses. These are separate fixtures; the active experiment is preserved.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.acceptance()))}>Run acceptance checks</button>{report&&<>
 <p>Document agreement, executed checks and references to other tests have different proof scopes. Passing these checks does not certify full workbench coverage or Campaign 4 entry.</p>
 <table><thead><tr><th>Item</th><th>Requirement</th><th>Evidence kind</th><th>Scope</th></tr></thead><tbody>{report.conditions.map(c=><tr key={c.item}><td>{c.item}</td><td>{c.condition}</td><td>{c.kind}</td><td>{c.scope}</td></tr>)}</tbody></table>
 {report.groups.map(g=><article key={g.name}><h3>{g.name==='acceptance'?'Acceptance checks and completeness':'Executed three-observer replay'}</h3><table><thead><tr><th>Witness</th><th>Assertions</th><th>Caught failures</th></tr></thead><tbody>{g.cases.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.assertions}</td><td>{c.failures.length}</td></tr>)}</tbody></table></article>)}
 <p>The replay supplement saves after the second observer and continues through the third. Original save and trace byte comparisons, consumer outputs and allocator-origin controls are retained in the report.</p><p>{report.scope}</p><details><summary>Exact acceptance report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export acceptance report</button></>}</section>;
}
