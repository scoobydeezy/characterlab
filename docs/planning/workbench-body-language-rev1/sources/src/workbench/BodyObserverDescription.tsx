import {useMemo} from 'react';
import {explainBodyPressure} from './bodyExplanations';
export function BodyObserverDescription({records}:{records:readonly string[]}){
 const result=useMemo(()=>{try{return {value:explainBodyPressure(records)};}catch(error){return {error:String(error)};}},[records]);
 if(!result.value)return <p role="alert">Admitted pressure description unavailable: {result.error}</p>;
 const report=result.value;
 return <section className="card"><h2>Admitted body signals</h2><p>{report.scope}</p>
 {!report.rows.length&&<p>No admitted pressure output has been recorded at this prefix.</p>}
 {report.rows.map(row=><article key={row.occurrence}><p>{row.text}</p><details><summary>Exact admitted sample and pressure · time {row.at}</summary><pre className="exact">{row.exact}</pre></details></article>)}
 <details><summary>Versioned BODY description record</summary><pre className="exact" data-body-language>{JSON.stringify(report,null,2)}</pre></details>
 </section>;
}
