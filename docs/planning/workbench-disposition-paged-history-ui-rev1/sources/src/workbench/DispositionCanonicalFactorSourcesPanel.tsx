import type {dispositionCanonicalFactorSources} from './dispositionCanonicalFactorSources';
import type {DispositionInspectionSummary,DispositionTextSelector} from './dispositionPagedAdapter';
export type DispositionFactorEnvelope={identity:Pick<DispositionInspectionSummary,'program'|'prefix'|'runHash'|'saveHash'>;selection:{kind:'factorSources';eventId:string};report:ReturnType<typeof dispositionCanonicalFactorSources>};
export function DispositionCanonicalFactorSourcesPanel({envelope,currentSaveHash,error,onRead}:{envelope?:DispositionFactorEnvelope;currentSaveHash:string;error?:string;onRead:(saveHash:string,selection:DispositionTextSelector)=>void}){
 const r=envelope?.report,stale=!!envelope&&envelope.identity.saveHash!==currentSaveHash;
 const problem=error||(r&&(r.version!=='disposition-factor-sources/0.2'||envelope!.selection.kind!=='factorSources'||r.eventId!==envelope!.selection.eventId)?'Factor report identity/version mismatch':undefined);
 return <section aria-label="Paged factor sources"><h3>Raw signals and overlap accounting</h3>
 {problem?<p role="alert">{problem}. Factor interpretation withheld.</p>:envelope&&r?<>
 <p>Program {envelope.identity.program} · prefix {envelope.identity.prefix} · event {r.eventId}</p><p>Run <code>{envelope.identity.runHash}</code></p><p>Source revision <code data-factor-source-revision>{envelope.identity.saveHash}</code></p>
 {stale&&<p role="status">Historical factor report retained. Restore its checkpoint to open the paged source reads, or request a report at the current revision.</p>}
 {!r.emitted?<p>No factor record was emitted at this stage.</p>:<><p>{r.scope}</p>
 {r.rows.map((row,i)=><details key={row.key}><summary>Source {i+1} · {row.role} · signed strength {row.strength}</summary><p>Exact source identity</p><pre className="exact">{row.key}</pre><p>Recorded evidence basis</p><pre className="exact">{row.basis}</pre>
 {row.coverage.length?<table><thead><tr>{['Nucleus','Raw magnitude','Overlap','Independent fraction','Effective magnitude'].map(v=><th key={v}>{v}</th>)}</tr></thead><tbody>{row.coverage.map(c=><tr key={c.nucleus}>{[c.nucleus,c.raw,c.overlap,c.independent,c.effective].map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table>:<p>No compiled coverage entry. This does not establish irrelevance or absence of a raw signal.</p>}</details>)}
 <h4>Evaluation-time read references ({r.readSources.length})</h4><p>Indices identify entries in the original native reads list. Exact values are available through the paged source record.</p>
 <table><thead><tr><th>Read index</th><th>Canonical path</th><th>Recorded presence</th></tr></thead><tbody>{r.readSources.map(source=><tr key={source.index}><td>{source.index}</td><td><code>{source.path}</code></td><td>{source.presence?'Present':'Absent'}</td></tr>)}</tbody></table>
 <button disabled={stale} onClick={()=>{if(!stale)onRead(envelope.identity.saveHash,{...r.readSelection});}}>Open event {r.eventId} evaluation reads at source revision</button></>}
 <details><summary>Exact factor report and revision</summary><pre className="exact" data-canonical-factor-report>{JSON.stringify(envelope,null,2)}</pre></details>
 </>:<p>No factor report selected.</p>}
 </section>;
}
