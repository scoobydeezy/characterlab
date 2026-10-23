import {useMemo} from 'react';
import {inspectBioReasonHistory} from './bioReasonHistory';
export function BioReasonHistoryPanel({records,selected,onSelect}:{records:readonly string[];selected:number;onSelect:(ordinal:number)=>void}){
 const result=useMemo(()=>{try{return {report:inspectBioReasonHistory(records,selected)};}catch(error){return {error:String(error)};}},[records,selected]);
 if(!result.report)return <p role="alert">BIO evidence history unavailable: {result.error}</p>;
 const report=result.report;
 return <section aria-label="BIO reason evidence history"><h3>Earlier evidence behind these factors</h3><p>{report.scope}</p>
 {report.sources.map((source,i)=><details key={source.sourceKey}><summary>Factor {i+1} · {source.atoms.length} recorded evidence atoms</summary>
  {!source.atoms.length&&<p>No evidence atoms are recorded for this factor. No earlier source is inferred.</p>}
  {source.atoms.map(atom=><div key={atom.atom}><p>Basis weight: {atom.weight}</p>
   {atom.status==='earlier-recorded-qualification'?<><button onClick={()=>onSelect(atom.source.ordinal)}>Inspect source step {atom.source.ordinal}</button><p>Recorded eligibility tag: {atom.source.eligibility}; qualification evidence: {atom.source.evidence??'No eligible evidence recorded'}.</p><details><summary>Exact earlier qualification and expression</summary><pre className="exact">{atom.source.qualification}</pre><pre className="exact">{atom.source.expression}</pre></details></>:<p>{atom.status==='other-recorded-atom'?'This recorded atom is not a qualification reference.':'No earlier original qualification with this identity is present in the supplied trace.'}</p>}
   <details><summary>Exact evidence atom</summary><pre className="exact">{atom.identity}</pre></details>
  </div>)}
 </details>)}
 <details><summary>Evidence history provenance</summary><pre className="exact" data-bio-reason-history>{JSON.stringify(report,null,2)}</pre></details>
 </section>;
}
