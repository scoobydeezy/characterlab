import {useMemo} from 'react';
import type {SubstitutionSnapshot} from './substitutionAdapter';
import {describeSubstitutionObserver} from './substitutionDescription';
export function SubstitutionDescriptionPanel({observer}:{observer:SubstitutionSnapshot['observer']}){
 const result=useMemo(()=>{try{return{report:describeSubstitutionObserver(observer)};}catch(e){return{error:String(e)};}},[observer]);
 if(!result.report)return <p role="alert">SUBSTITUTION descriptions unavailable: {result.error}</p>;
 const report=result.report;
 return <><p>{report.scope}</p>{report.entries.length===0&&<p>No component opportunity has been recorded at this prefix.</p>}{report.entries.map(e=><article key={`${e.sourceIndex}/${e.kind}`} data-substitution-description><h3>{e.kind} · opportunity {e.at}</h3><p>{e.human}</p><details><summary>Safe provenance · observer row {e.sourceIndex}</summary><pre className="exact">{e.exact}</pre></details></article>)}</>;
}
