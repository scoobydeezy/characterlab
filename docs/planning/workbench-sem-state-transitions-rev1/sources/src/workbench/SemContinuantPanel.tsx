import {useState} from 'react';
import type {runSemContinuantControls} from './semContinuantControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemContinuantControls>>;
export function SemContinuantPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Continuant lifecycle controls</h2><p>Inspect retirement, fresh allocation and observer-relative continuity in the original component experiments. Structural restore is a copy/continuation witness, not native save/load.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.continuant()))}>Run continuant lifecycle controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><h3>Exact lifecycle results</h3><table><thead><tr><th>Result</th><th>Value</th></tr></thead><tbody>{Object.entries(report.summary).map(([key,value])=><tr key={key}><td>{key}</td><td>{String(value)}</td></tr>)}</tbody></table>
 <h3>Original scenarios</h3><table><thead><tr><th>Scenario</th><th>Vector</th><th>Evidence SHA-256</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.vector}</td><td><code>{c.evidence.sha256}</code></td></tr>)}</tbody></table>
 <h3>Rejected transitions</h3><table><thead><tr><th>Case</th><th>Guard</th></tr></thead><tbody>{report.negatives.map(n=><tr key={n.id}><td>{n.id}</td><td>{n.code}</td></tr>)}</tbody></table>
 <p>Detection labels receive ordinals in the original fixture order. These ordinals carry no psychological meaning.</p><table><thead><tr><th>Fixture label</th><th>Ordinal</th></tr></thead><tbody>{report.detectionOrdinals.map(d=><tr key={d.label}><td>{d.label}</td><td>{d.ordinal}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact continuant lifecycle report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export continuant lifecycle report</button></>}</section>;
}
