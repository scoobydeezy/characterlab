import {useState} from 'react';
import type {runSemCodecControls} from './semCodecControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemCodecControls>>;
export function SemCodecPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Canonical codecs and identity boundaries</h2><p>Inspect exact round-trip bytes, rejected layouts and versions, and observer and occurrence identity differences.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.codecs()))}>Run codec controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><p>The original union-layout fixtures include placeholder payload types. Passing a field-layout check does not admit those payload domains. Codec round-trips do not establish native save/load.</p>
 <h3>Original cases</h3><table><thead><tr><th>Case</th><th>Vector</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{report.vector}</td></tr>)}</tbody></table>
 <h3>Rejected inputs</h3><table><thead><tr><th>Case</th><th>Guard</th><th>Cause</th></tr></thead><tbody>{report.guards.map(g=><tr key={g.id}><td>{g.id}</td><td>{g.code??'Decoder exception'}</td><td>{g.message}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact codec report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export codec report</button></>}</section>;
}
