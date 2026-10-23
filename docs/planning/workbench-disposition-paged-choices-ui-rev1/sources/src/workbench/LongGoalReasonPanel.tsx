import {useMemo} from 'react';
import {inspectLongGoalReasons} from './longGoalReasonDiagnostics';
export function LongGoalReasonPanel({nuclei,prefix,runHash}:{nuclei:readonly string[];prefix:number;runHash:string}){
 const result=useMemo(()=>{try{return {report:inspectLongGoalReasons(nuclei)};}catch(error){return {error:String(error)};}},[nuclei]);
 if(!result.report)return <p role="alert">Receiving factor inspection unavailable: {result.error}</p>;
 const report=result.report;
 return <section aria-label="Recorded goal receiving factors"><h3>Recorded receiving factors</h3><p>Inspected prefix {prefix} · {report.nuclei.length} compiled nuclei</p>
 <p>{report.scope}</p>{report.nuclei.length===0&&<p>No compiled reasons were recorded at this prefix.</p>}
 {report.nuclei.map((n,i)=><details key={n.key}><summary>Nucleus {i+1}: d{n.baseDie}, standing {n.standingModifier}, situational {n.situationalModifier}</summary>
 <dl><dt>Base net</dt><dd>{n.baseNet}</dd><dt>Standing net</dt><dd>{n.standingNet}</dd><dt>Situational net</dt><dd>{n.situationalNet}</dd><dt>Relevance</dt><dd>{n.relevance}</dd></dl>
 <table><caption>Recorded coverage operands</caption><thead><tr><th>Role</th><th>Magnitude</th><th>Overlap</th><th>Independent fraction</th><th>Effective magnitude</th></tr></thead><tbody>{n.coverage.map(c=><tr key={c.sourceKey}><td>{c.role}</td><td>{c.magnitude}</td><td>{c.overlap}</td><td>{c.independent}</td><td>{c.effective}</td></tr>)}</tbody></table>
 <details><summary>Exact nucleus identity and coverage sources</summary><pre className="exact">{n.identity}</pre>{n.coverage.map(c=><pre className="exact" key={c.sourceKey}>{c.source}</pre>)}</details>
 <details><summary>Exact mechanical score distribution</summary><pre className="exact">{n.distribution}</pre></details></details>)}
 <details><summary>Receiving factor provenance</summary><pre className="exact" data-long-goal-reason-diagnostics>{JSON.stringify({runHash,prefix,...report},null,2)}</pre></details></section>;
}
