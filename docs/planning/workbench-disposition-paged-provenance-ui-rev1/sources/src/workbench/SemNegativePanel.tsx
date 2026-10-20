import {useState} from 'react';
import type {runSemNegativeControls} from './semNegativeControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemNegativeControls>>;
export function SemNegativePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Named negative-control ledger</h2><p>Inspect the original forbidden-design witnesses, their assertion values, and exact caught failure boundaries.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.negativeLedger()))}>Run named negative controls</button>{report&&<>
 <p>The active integrated run is unchanged. This report uses the corrected ledger recorder; its original assertion bodies are preserved.</p><h3>Ledger counts</h3><table><thead><tr><th>Count</th><th>Value</th></tr></thead><tbody>{Object.entries(report.summary).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <h3>Named witnesses</h3><table><thead><tr><th>Control</th><th>Assertions</th><th>Caught failure codes</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.assertionCount}</td><td>{c.closureCodes.length?c.closureCodes.join(', '):'No caught failure; structural/comparison checks'}</td></tr>)}</tbody></table>
 <p>A control can combine structural checks and caught failures. Absence of a caught failure is not evidence of an executed rejection. The exact report includes assertion operands and error messages, not complete runtime traces.</p>
 <p>{report.scope}</p><details><summary>Exact negative-control report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export negative-control report</button></>}</section>;
}
