import {affectAppraisalFactorSources} from './affectAppraisalFactorSources';
import type {AffectExplanation} from './affectExplanations';
export function AffectAppraisalFactorSourcesPanel({card,modelHash}:{card:AffectExplanation;modelHash:string}){
 let report:ReturnType<typeof affectAppraisalFactorSources>;try{report=affectAppraisalFactorSources(card,modelHash);}catch(error){return <p role="alert">Appraisal factor sources withheld: {String(error)}</p>;}
 return <section aria-label="AFFECT appraisal factor sources"><h4>Where appraisal factors come from</h4><p>{report.scope}</p><table><thead><tr><th>Factor</th><th>Exact value</th><th>Source rule</th></tr></thead><tbody>{report.rows.map(r=><tr key={r.factor}><td>{r.factor}</td><td>{r.exact??'Unavailable'}</td><td>{r.rule}</td></tr>)}</tbody></table>{report.rows.map(r=><details key={r.factor}><summary>{r.factor}: exact recorded operands</summary><pre className="exact">{JSON.stringify(r.source,null,2)}</pre></details>)}<details><summary>Exact appraisal factor source report</summary><pre className="exact" data-affect-appraisal-factor-sources>{JSON.stringify(report,null,2)}</pre></details></section>;
}
