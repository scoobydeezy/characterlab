import type {projectSemCausalLanguage} from './semCausalLanguage';
export function SemCausalLanguagePanel({report,onEntry}:{report:ReturnType<typeof projectSemCausalLanguage>|undefined;onEntry:(index:number)=>void}){
 return <section aria-label="Observer causal-role interpretations"><h3>Recorded event-role interpretation</h3><p>{report?.scope}</p>
 {!report?.entries.length&&<p>No causal-role record is available for this observer at this prefix. This does not establish absence of an interpretation.</p>}
 {report?.entries.map(e=><article key={e.evidenceId}><p data-sem-causal-human>{e.human}</p>
 <details><summary>Causal-role meaning and rule</summary><pre className="exact" data-sem-causal-semantic>{JSON.stringify({semantic:e.semantic,rule:e.rule,evidenceId:e.evidenceId,experienceId:e.experienceId},null,2)}</pre></details>
 <details><summary>Supporting perceived event-role bindings</summary><pre className="exact" data-sem-causal-supports>{JSON.stringify(e.supports,null,2)}</pre></details>
 <details><summary>Exact observer causal-role record</summary><pre className="exact" data-sem-causal-record>{e.exact}</pre></details>
 <button onClick={()=>onEntry(e.sourceIndex)}>Inspect causal-role committed entry {e.sourceIndex+1}</button></article>)}
 </section>;
}
