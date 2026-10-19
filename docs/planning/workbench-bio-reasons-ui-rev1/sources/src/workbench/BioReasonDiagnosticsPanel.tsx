import {useMemo} from 'react';
import {inspectBioReasons} from './bioReasonDiagnostics';

export function BioReasonDiagnosticsPanel({canonicalHex,runHash}:{canonicalHex:string;runHash:string}){
 const result=useMemo(()=>{try{return {report:inspectBioReasons(canonicalHex)};}catch(error){return {error:String(error)};}},[canonicalHex]);
 if(!result.report)return <p role="alert">BIO factor inspection unavailable: {result.error}</p>;
 const report=result.report;
 return <section aria-label="BIO recorded reason factors">
  <h3>Recorded reason factors</h3>
  <p>Step {report.ordinal} · {report.signals.length} raw factors · {report.nuclei.length} compiled nuclei</p>
  <p>{report.scope}</p>
  {report.nuclei.map((n,index)=><details key={n.key}><summary>Nucleus {index+1}: d{n.baseDie}, standing {n.standingModifier}, situational {n.situationalModifier}</summary>
   <dl><dt>Base net</dt><dd>{n.baseNet}</dd><dt>Standing net</dt><dd>{n.standingNet}</dd><dt>Situational net</dt><dd>{n.situationalNet}</dd><dt>Relevance</dt><dd>{n.relevance}</dd></dl>
   <pre className="exact">{n.identity}</pre>
   <table><caption>Recorded coverage operands</caption><thead><tr><th>Role</th><th>Magnitude</th><th>Overlap</th><th>Independent fraction</th><th>Effective magnitude</th><th>Source</th></tr></thead><tbody>
    {n.coverage.map(c=><tr key={c.sourceKey}><td>{c.role}</td><td>{c.magnitude}</td><td>{c.overlap}</td><td>{c.independent}</td><td>{c.effective}</td><td><details><summary>Exact source and basis</summary><pre className="exact">{report.signals.find(s=>s.key===c.sourceKey)?.source}</pre><pre className="exact">{report.signals.find(s=>s.key===c.sourceKey)?.basis}</pre></details></td></tr>)}
   </tbody></table>
   <details><summary>Exact mechanical score distribution</summary><pre className="exact">{n.distribution}</pre></details>
  </details>)}
  <details><summary>All recorded raw factors</summary>{report.signals.map(s=><div key={s.key}><p>{s.role} · signed strength {s.strength} · coverage {s.coverage}</p><pre className="exact">{s.source}</pre><pre className="exact">{s.basis}</pre></div>)}</details>
  <details><summary>Factor provenance</summary><p>Run: <code>{runHash}</code></p><pre className="exact" data-bio-reason-diagnostics>{JSON.stringify(report,null,2)}</pre></details>
 </section>;
}
