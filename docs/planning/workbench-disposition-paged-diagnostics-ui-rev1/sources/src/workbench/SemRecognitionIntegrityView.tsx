import {useState} from 'react';
import type {runSemRecognitionIntegrity} from './semRecognitionIntegrity';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemRecognitionIntegrity>>;
export function SemRecognitionIntegrityView({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section aria-label="Canonical recognition integrity"><h3>Canonical recognition history</h3><p>Compare recognition over the same experience, then inspect the exact earlier bytes after each later evaluation. This experiment runs separately from the active fixture.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.recognitionIntegrity()))}>Check recognition history bytes</button>{report&&<>
 <table><thead><tr><th>Alternative</th><th>Experience equals baseline</th><th>Resolution</th></tr></thead><tbody>{report.alternatives.map(a=><tr key={a.id}><td>{a.id}</td><td>{String(a.experience.exact===report.alternatives[0].experience.exact)}</td><td>{a.resolution?'Emitted':'Unresolved'}</td></tr>)}</tbody></table>
 <table><thead><tr><th>Later evaluation</th><th>Records retained</th><th>Earlier byte comparisons</th><th>Preserved</th></tr></thead><tbody>{report.lifecycle.map(c=><tr key={c.id}><td>{c.id}</td><td>{c.records.length}</td><td>{c.preservation.reduce((n,p)=>n+p.before.length,0)}</td><td>{c.preservation.length?String(c.preservation.every(p=>p.equal)):'No earlier records'}</td></tr>)}</tbody></table>
 <p>No cue and same-candidate evaluations retain the current recognition. Withdrawal and replacement append records; earlier experience, evaluation and resolution bytes remain available.</p><p>{report.scope}</p><details><summary>Exact recognition integrity report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export recognition integrity report</button></>}</section>;
}
