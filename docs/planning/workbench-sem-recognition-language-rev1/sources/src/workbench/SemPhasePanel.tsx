import {useState} from 'react';
import type {runSemPhaseControls} from './semPhaseControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemPhaseControls>>;
export function SemPhasePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Observation lanes and phase ordering</h2><p>Inspect lane cutoffs, frozen experience and recognition, and the exact causes of rejected settlement.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.phases()))}>Run phase controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><p>Phase declarations and admission checks have narrower scope than executed scheduler behavior. The companion causal role is a fixture literal; classification sorting does not demonstrate a scheduler read boundary.</p>
 <h3>Original cases</h3><table><thead><tr><th>Case</th><th>Vector</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.vector}</td></tr>)}</tbody></table>
 <h3>Rejected inputs</h3><table><thead><tr><th>Case</th><th>Vector</th><th>Guard</th><th>Cause</th></tr></thead><tbody>{report.negatives.map(n=><tr key={n.id}><td>{n.id}</td><td>{n.vector}</td><td>{n.code}</td><td>{n.message}</td></tr>)}</tbody></table>
 <h3>Verified orphan rollback</h3><p>{report.rollback.failureCode}: {report.rollback.failure}. The validator reached {report.rollback.validationFailureCode}. Status: {report.rollback.before.status} → {report.rollback.after.status}.</p><p>The historical test failed an allocator assertion before reaching this validator. This report uses the corrected test and retains its correction receipt: {report.rollback.correctionReceipt}.</p>
 <table><thead><tr><th>Preserved data</th><th>Equal</th></tr></thead><tbody>{Object.entries(report.rollback.preserved).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact phase report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export phase report</button></>}</section>;
}
