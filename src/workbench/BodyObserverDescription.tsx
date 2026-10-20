import {useMemo} from 'react';
import {explainBodyPressure} from './bodyExplanations';
import {bodyPressureEventLinks} from './bodyPressureHistory';
import type {TimelineEvent} from './contracts';
export function BodyObserverDescription({records,events=[],onEvent}:{records:readonly string[];events?:readonly TimelineEvent[];onEvent?:(id:string)=>void}){
 const result=useMemo(()=>{try{return {value:explainBodyPressure(records),links:bodyPressureEventLinks(records,events)};}catch(error){return {error:String(error)};}},[records,events]);
 if(!result.value)return <p role="alert">Admitted pressure description unavailable: {result.error}</p>;
 const report=result.value;
 return <section className="card"><h2>Admitted body signals</h2><p>{report.scope}</p>
 {!report.rows.length&&<p>No admitted pressure output has been recorded at this prefix.</p>}
 {report.rows.map((row,i)=><article key={row.occurrence}><p>{row.text}</p><details><summary>Exact admitted sample and pressure · time {row.at}</summary><pre className="exact">{row.exact}</pre></details>{onEvent&&(result.links![i].eventId!==null?<button onClick={()=>onEvent(result.links![i].eventId!)}>Inspect pressure event {result.links![i].eventId}</button>:<small>Recorded event provenance unavailable in this timeline.</small>)}</article>)}
 <details><summary>Versioned BODY description record</summary><pre className="exact" data-body-language>{JSON.stringify(report,null,2)}</pre></details>
 </section>;
}
