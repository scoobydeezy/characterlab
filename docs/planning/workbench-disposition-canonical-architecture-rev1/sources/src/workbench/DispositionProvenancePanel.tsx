import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionProvenance} from './dispositionProvenance';
export function DispositionProvenancePanel({event,law,seamVersion}:{event:TimelineEvent;law:string;seamVersion:string}){
 const result=useMemo(()=>{try{return {report:dispositionProvenance(event,law,seamVersion)};}catch(e){return {error:String(e)};}},[event,law,seamVersion]),r=result.report;
 return <section aria-label="Disposition state-to-signal provenance"><h3>From recorded state to standing signals</h3>
 {result.error&&<p role="alert">{result.error}. Provenance explanation withheld.</p>}
 {r&&!r.emitted&&<p>No standing-signal derivation was emitted at this stage.</p>}
 {r?.emitted&&<><p>{r.scope}</p><p>Selected law: {r.law}. Constitution {r.constitution.value}; plastic contribution {r.plastic}; identity standing {r.standing}. Selected acquired feedback {r.acquired}; final feedback {r.feedback}.</p>
 <p>Effective disposition = constitution + plastic = {r.effective}. Final feedback = constitution + selected acquired feedback. These quantities remain distinct.</p>
 <details><summary>Exact owned-state paths</summary><pre className="exact">{JSON.stringify({constitution:r.constitution.path,journal:r.journalPath,plastic:r.plasticPath},null,2)}</pre></details>
 <details><summary>Accepted journal and identity rounding ({r.history.length} entries)</summary><pre className="exact">{JSON.stringify(r.history,null,2)}</pre></details>
 <details><summary>Plastic batches ({r.batches.length} complete; {r.incompleteBatchEntries} pending entries)</summary><pre className="exact">{JSON.stringify(r.batches,null,2)}</pre></details>
 <table><thead><tr><th>Candidate</th><th>Standing raw strength</th></tr></thead><tbody>{r.signals.map(s=><tr key={s.sourceKey}><td>{s.action}</td><td>{s.strength}</td></tr>)}</tbody></table>{!r.signals.length&&<p>Zero final feedback emits no standing signal.</p>}</>}
 {r&&<details><summary>Exact state-to-signal provenance</summary><pre className="exact" data-disposition-provenance>{JSON.stringify(r,null,2)}</pre></details>}
 </section>;
}
