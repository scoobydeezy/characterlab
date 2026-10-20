import {useState} from 'react';
import type {runSemPhenomenonControls} from './semPhenomenonControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemPhenomenonControls>>;
export function SemPhenomenonPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 return <section className="card"><h2>Binding, causal roles and ancestry</h2><p>Inspect the complete original binding and causal test witnesses in separate fixtures. The exact evidence includes researcher truth and must not be treated as character knowledge.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.phenomenon()))}>Run phenomenon controls</button>{report&&<>
 <p>The active run is unchanged. These witnesses preserve the original assertion boundaries.</p>{report.groups.map(g=><article key={g.name}><h3>{g.name==='binding'?'Binding and observer visibility':'Causal roles and ancestry separation'}</h3><table><thead><tr><th>Witness</th><th>Assertions</th></tr></thead><tbody>{g.cases.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.assertions}</td></tr>)}</tbody></table></article>)}
 <p>Companion maps to Participant through an executed derivation. Swapping hidden Actor/Companion identities can leave permitted evidence unchanged; changing permitted role evidence changes the causal-role result.</p><p>Original JSON/string equality is not canonical-byte equality. The ancestry checks cover this fixture’s observers and records, not every possible epistemic boundary.</p><p>{report.scope}</p><details><summary>Exact phenomenon report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export phenomenon report</button></>}</section>;
}
