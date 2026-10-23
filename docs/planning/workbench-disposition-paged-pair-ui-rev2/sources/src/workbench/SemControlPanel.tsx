import {useState} from 'react';
import type {runSemControlSuite} from './semControlSuite';
import type {SemWorkerClient} from './semWorkerClient';
export function SemControlPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Awaited<ReturnType<typeof runSemControlSuite>>>();
 return <section className="card"><h2>Original semantic component controls</h2><p>These fixed experiments inspect hidden truth, permitted perception and binding multiplicity. Their results are independent of the active run and its selected prefix.</p>
 <button disabled={busy||!client} onClick={()=>void execute(async()=>{setReport(await client!.controls());})}>Run SEM component controls</button>
 {report&&<><p>{report.scope}</p><h3>Exact component comparisons</h3><table><thead><tr><th>Control</th><th>Truth equal</th><th>Experience equal</th><th>Classification equal</th><th>Causal evidence equal</th></tr></thead><tbody>{report.pairs.map(p=><tr key={p.pair.id}><td>{p.pair.label}</td>{Object.values(p.equality).map((v,i)=><td key={i}>{v===null?'Not invoked':String(v)}</td>)}</tr>)}</tbody></table>
 <h3>Binding occurrences</h3><p>Multiple-role and repeated-role witnesses preserve each occurrence. Track and event numbers belong to that component experiment and observer.</p>
 {report.cases.filter(c=>c.id.startsWith('mina-')).map(c=><div key={c.id}><h4>{c.id}</h4><table><thead><tr><th>Occurrence</th><th>Track</th><th>Event</th><th>Perceived role</th></tr></thead><tbody>{c.bindings.map(b=><tr key={b.occurrence}><td>{b.occurrence}</td><td>{b.track}</td><td>{b.event}</td><td>{b.role}</td></tr>)}</tbody></table></div>)}
 <details><summary>Exact SEM component report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export SEM component report</button></>}
 </section>;
}
