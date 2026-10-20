import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionFactorSources} from './dispositionFactorSources';
export function DispositionFactorSourcesPanel({event}:{event:TimelineEvent}){
 const result=useMemo(()=>{try{return {report:dispositionFactorSources(event)};}catch(e){return {error:String(e)};}},[event]),r=result.report;
 return <section aria-label="Recorded factor sources"><h3>Raw signals and overlap accounting</h3>
 {result.error&&<p role="alert">{result.error}. No partial factor accounting is shown.</p>}
 {r&&!r.emitted&&<p>No factor record was emitted at this stage.</p>}
 {r?.emitted&&<><p>{r.scope}</p>{r.rows.map((row,i)=><details key={row.key}><summary>Source {i+1} · {row.role} · signed strength {row.strength}</summary>
 <p>Exact source identity</p><pre className="exact">{row.key}</pre><p>Recorded evidence basis</p><pre className="exact">{row.basis}</pre>
 {row.coverage.length?<table><thead><tr>{['Nucleus','Raw magnitude','Overlap','Independent fraction','Effective magnitude'].map(v=><th key={v}>{v}</th>)}</tr></thead><tbody>{row.coverage.map(c=><tr key={c.nucleus}>{[c.nucleus,c.raw,c.overlap,c.independent,c.effective].map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table>:<p>No compiled coverage entry. This does not establish irrelevance or absence of a raw signal.</p>}
 </details>)}
 <details><summary>Evaluation-time state reads ({r.reads.length})</summary><pre className="exact">{JSON.stringify(r.reads,null,2)}</pre></details></>}
 {r&&<details><summary>Exact factor-source report</summary><pre className="exact" data-disposition-factor-sources>{JSON.stringify(r,null,2)}</pre></details>}
 </section>;
}
