import {useState} from 'react';
import type {runSemPersistenceControls} from './semPersistenceControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemPersistenceControls>>;
export function SemPersistencePanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Native persistence and observer isolation</h2><p>Compare uninterrupted execution with native save/load continuation, inspect failed-settlement rollback, and examine the original observer-interleaving control.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.persistence()))}>Run persistence controls</button>{report&&<>
 <p>{report.contract}. The active integrated run is unchanged.</p><h3>Native save/load</h3><table><thead><tr><th>Comparison</th><th>Equal</th></tr></thead><tbody><tr><td>Midpoint save/load/re-save</td><td>{String(report.persistence.midpointEqual)}</td></tr><tr><td>Restored versus uninterrupted continuation</td><td>{String(report.persistence.continuationEqual)}</td></tr></tbody></table>
 <h3>Failed settlement</h3><p>{report.rollback.failure}. Status: {report.rollback.before.status} → {report.rollback.after.status}.</p><table><thead><tr><th>Preserved data</th><th>Equal</th></tr></thead><tbody>{Object.entries(report.rollback.preserved).map(([k,v])=><tr key={k}><td>{k}</td><td>{String(v)}</td></tr>)}</tbody></table>
 <h3>Observer interleaving</h3><p>This original control applies transitions directly with a shared counter. It does not execute a multi-observer scheduler or prove general observer independence.</p><table><thead><tr><th>Check</th><th>Result</th></tr></thead><tbody>{(['sameObserverState','sameObserverTransitions','differentRuntimeIds'] as const).map(k=><tr key={k}><td>{k}</td><td>{String(report.isolation[k])}</td></tr>)}</tbody></table>
 <p>{report.scope}</p><details><summary>Exact persistence report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export persistence report</button></>}</section>;
}
