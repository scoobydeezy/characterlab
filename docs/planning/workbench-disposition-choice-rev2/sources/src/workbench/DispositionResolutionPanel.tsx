import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionResolution} from './dispositionResolution';
export function DispositionResolutionPanel({events,event,seamVersion,onEvent}:{events:readonly TimelineEvent[];event:string;seamVersion:string;onEvent:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:dispositionResolution(events,event,seamVersion)};}catch(e){return {error:String(e)};}},[events,event,seamVersion]),r=result.report;
 return <section aria-label="DISPOSITION resolution linkage"><h3>Recorded resolution and chosen intent</h3>{result.error&&<p role="alert">{result.error}. Resolution linkage withheld.</p>}
 {r&&<><p>{r.scope}</p><button onClick={()=>onEvent(r.decisionEvent)}>Open linked decision event</button><button onClick={()=>onEvent(r.intentEvent)}>Open linked intent event</button>
 {r.emitted&&<><p>Recorded mode: {r.mode}</p><table><thead><tr><th>Nucleus</th><th>Die</th><th>Face</th><th>Standing</th><th>Situational</th><th>Signed contribution</th></tr></thead><tbody>{r.draws.map(d=><tr key={d.key}>{[d.nucleus,d.die,d.face,d.standing,d.situational,d.contribution].map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table>
 <details><summary>Chosen candidate and original tie record</summary><pre className="exact">{JSON.stringify({chosenCandidate:r.chosenCandidate,tie:r.tie},null,2)}</pre></details></>}
 <details><summary>Exact linked resolution</summary><pre className="exact" data-disposition-resolution>{JSON.stringify(r,null,2)}</pre></details></>}
 </section>;
}
