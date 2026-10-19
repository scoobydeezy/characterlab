import {useMemo} from 'react';
import {describeControlObserver} from './controlDescription';
export function ControlDescriptionPanel({observerHex}:{observerHex:string}){
 const result=useMemo(()=>{try{return{report:describeControlObserver(observerHex)};}catch(e){return{error:String(e)};}},[observerHex]);
 if(!result.report)return <p role="alert">CONTROL descriptions unavailable: {result.error}</p>;
 const report=result.report;
 return <><p>{report.scope}</p>{report.entries.length===0&&<p>No public evaluation has been recorded at this prefix.</p>}{report.entries.map(e=><article key={e.sourceIndex} data-control-description><h3>{e.kind} · instant {e.at}</h3><p>{e.human}</p><details><summary>Safe provenance · observer index {e.sourceIndex}</summary><pre className="exact">{e.exact}</pre></details></article>)}</>;
}
