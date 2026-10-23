import {describeLongRoutineOwnedState} from './longRoutineStateDescription';
import type {projectLongRoutineOwnedState} from './longRoutineOwnedProjection';
export function LongRoutineOwnedDescriptionPanel({owned}:{owned:ReturnType<typeof projectLongRoutineOwnedState>}){
 try{
  const report=describeLongRoutineOwnedState(owned);
  return <section aria-label="Routine owned-state descriptions"><h3>What the owned records say</h3><p>{report.history.text}</p><p>{report.belief.text}</p><p>{report.goalSummary}</p><ul>{report.goals.map(g=><li key={g.id}>{g.text}</li>)}</ul><details><summary>Admitted practice history</summary><ul>{report.history.records.map(r=><li key={r.occurrence}>{r.text}</li>)}</ul></details><h3>Derived history diagnostic</h3><p>{report.cache.text}</p><p>{report.scope}</p><details><summary>Exact routine description provenance</summary><pre className="exact" data-long-routine-description>{JSON.stringify(report,null,2)}</pre></details></section>;
 }catch(e){return <p role="alert">Owned-state description unavailable: {String(e)}</p>;}
}
