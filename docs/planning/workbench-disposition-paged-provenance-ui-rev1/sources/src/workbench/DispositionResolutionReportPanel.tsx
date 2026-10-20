import type {dispositionResolution} from './dispositionResolution';
import {DispositionScoreMatrixPanel} from './DispositionScoreMatrixPanel';
export function DispositionResolutionReportPanel({report:r,error,onEvent}:{report?:ReturnType<typeof dispositionResolution>;error?:string;onEvent:(id:string)=>void}){
 return <section aria-label="DISPOSITION resolution linkage"><h3>Recorded resolution and chosen intent</h3>{error&&<p role="alert">{error}. Resolution linkage withheld.</p>}
 {r&&<><p>{r.scope}</p><button onClick={()=>onEvent(r.decisionEvent)}>Open linked decision event</button><button onClick={()=>onEvent(r.intentEvent)}>Open linked intent event</button>
 {r.emitted&&<><p>Recorded mode: {r.mode}</p><table><thead><tr><th>Nucleus</th><th>Die</th><th>Face</th><th>Standing</th><th>Situational</th><th>Signed contribution</th></tr></thead><tbody>{r.draws.map(d=><tr key={d.key}>{[d.nucleus,d.die,d.face,d.standing,d.situational,d.contribution].map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table>
 <details><summary>Chosen candidate and original tie record</summary><pre className="exact">{JSON.stringify({chosenCandidate:r.chosenCandidate,tie:r.tie},null,2)}</pre></details></>}
 <DispositionScoreMatrixPanel resolution={r} onEvent={onEvent}/><details><summary>Exact linked resolution</summary><pre className="exact" data-disposition-resolution>{JSON.stringify(r,null,2)}</pre></details></>}
 </section>;
}
