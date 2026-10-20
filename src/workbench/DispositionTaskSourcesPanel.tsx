import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionTaskSources} from './dispositionTaskSources';
export function DispositionTaskSourcesPanel({event,seamVersion}:{event:TimelineEvent;seamVersion:string}){
 const result=useMemo(()=>{try{return {report:dispositionTaskSources(event,seamVersion)};}catch(e){return {error:String(e)};}},[event,seamVersion]);
 return <DispositionTaskSourcesReportPanel {...result}/>;
}
export function DispositionTaskSourcesReportPanel({report,error}:{report?:ReturnType<typeof dispositionTaskSources>;error?:string}){
 const r=error?undefined:report;
 return <section aria-label="Disposition task source provenance"><h3>Task motives and situational sources</h3>{error&&<p role="alert">{error}. Task-source explanation withheld.</p>}
 {r&&!r.emitted&&<p>No task reason record was emitted at this stage.</p>}
 {r?.emitted&&<><p>{r.scope}</p>{r.rows.map((row:any,i)=><details key={i}><summary>Task origin {i+1} · base {row.basePressure??'missing'} · response {row.responseState}</summary><p>Response intensity: {row.responseIntensity??'unavailable'}. Forecast: {row.forecastState}.</p><pre className="exact">{JSON.stringify({candidate:row.candidate,task:row.task,motiveOccurrence:row.motiveOccurrence,concernOccurrence:row.concernOccurrence},null,2)}</pre><table><thead><tr><th>Role</th><th>Emitter operand</th><th>Signal emitted</th></tr></thead><tbody>{row.links.map((link:any)=><tr key={link.role}><td>{link.role}</td><td>{link.emitterValue}</td><td>{link.emitted?'Yes':'No'}</td></tr>)}</tbody></table></details>)}
 <details><summary>Non-identity semantic pressure</summary><pre className="exact">{JSON.stringify(r.meanings,null,2)}</pre></details></>}
 {r&&<details><summary>Exact task-source provenance</summary><pre className="exact" data-disposition-task-sources>{JSON.stringify(r,null,2)}</pre></details>}</section>;
}
