import {useState} from 'react';
import type {runSemAuthorityControls} from './semAuthorityControls';
import type {SemWorkerClient} from './semWorkerClient';
type Report=Awaited<ReturnType<typeof runSemAuthorityControls>>;
type Registry={definitions:{authorityName:string;ownedLeaves:{pattern:{rootStateTypeId:{$bigint:string};fieldId:{$bigint:string};selectors:{kind:string;selectorKind:string}[]};valueGrammar:{kind:string;recordTypeId?:{$bigint:string}};removalAllowed:boolean}[]}[]};
export function SemAuthorityPanel({client,busy,execute,onExport}:{client?:SemWorkerClient;busy:boolean;execute:(fn:()=>Promise<void>)=>Promise<void>;onExport:(text:string)=>void}){
 const [report,setReport]=useState<Report>();
 const registry:Registry|undefined=report?JSON.parse(report.registry.exact):undefined;
 return <section className="card"><h2>Semantic state ownership</h2><p>Inspect declared write authority and its original executable controls. Ownership declarations do not show which paths a run actually read or wrote.</p><button disabled={busy||!client} onClick={()=>void execute(async()=>setReport(await client!.authority()))}>Run authority controls</button>{report&&<>
 <p>{report.contract}</p><p>The active run is unchanged. These controls execute in a separate fixture with fresh occurrence allocation.</p>
 <h3>Declared writable leaves</h3><table><thead><tr><th>Authority</th><th>Root / field</th><th>Selector</th><th>Value grammar</th><th>Removal allowed</th></tr></thead><tbody>{registry!.definitions.flatMap(d=>d.ownedLeaves.map(l=><tr key={`${l.pattern.rootStateTypeId.$bigint}/${l.pattern.fieldId.$bigint}`}><td>{d.authorityName}</td><td>{l.pattern.rootStateTypeId.$bigint} / {l.pattern.fieldId.$bigint}</td><td>{l.pattern.selectors.map(s=>`${s.kind}:${s.selectorKind}`).join(', ')}</td><td>{l.valueGrammar.kind}{l.valueGrammar.recordTypeId?` / ${l.valueGrammar.recordTypeId.$bigint}`:''}</td><td>{String(l.removalAllowed)}</td></tr>))}</tbody></table>
 <p>Membership markers address canonical set members. They do not turn the persisted domain set into a map. Counters and resolution history cannot be removed.</p>
 <h3>Executed authority witnesses</h3><table><thead><tr><th>Case</th><th>Assertions</th><th>Caught failure codes</th></tr></thead><tbody>{report.cases.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.assertions}</td><td>{c.failures.length?c.failures.map(f=>f.code).join(', '):'Positive or comparison assertions; no caught failure'}</td></tr>)}</tbody></table>
 <p>Changed model identity records a definition change; it does not alone prove different behavior. Codec round trips and native scheduler save/load are separate checks.</p><p>{report.scope}</p><details><summary>Exact authority report</summary><pre className="exact">{JSON.stringify(report,null,2)}</pre></details><button onClick={()=>onExport(JSON.stringify(report,null,2))}>Export authority report</button></>}</section>;
}
