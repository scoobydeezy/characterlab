import {useState} from 'react';
import type {runSemOccurrenceControls} from './semOccurrenceControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemOccurrenceControls>>;
export function SemOccurrencePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Occurrence identity and ordering</h2><p>Inspect original allocation, malformed-identity, support-ordering and namespace witnesses in a separate fixture.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.occurrence()))}>Run occurrence controls</button>{report&&<>
 <p>The active run is unchanged. Ordinals are identities, not psychological magnitudes.</p><table><thead><tr><th>Case</th><th>Assertions</th><th>Caught failure codes</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.assertions}</td><td>{c.failures.length?c.failures.map(f=>f.code).join(', '):'Positive or comparison assertions; no caught failure'}</td></tr>)}</tbody></table>
 <p>The event-support witness distinguishes numeric order [2, 9, 10] from string order [10, 2, 9]. Continuant rules currently have one input each, so their support ordering is unobservable in these cases.</p><p>{report.scope}</p><details><summary>Exact occurrence report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export occurrence report</button></>}</section>;
}
