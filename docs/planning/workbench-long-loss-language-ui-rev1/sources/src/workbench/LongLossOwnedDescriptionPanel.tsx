import {describeLongLossOwnedState} from './longLossStateDescription';
import type {projectLongLossOwnedState} from './longLossOwnedProjection';
export function LongLossOwnedDescriptionPanel({owned}:{owned:ReturnType<typeof projectLongLossOwnedState>}){
 try{
  const report=describeLongLossOwnedState(owned);
  return <section aria-label="Loss owned-state descriptions"><h3>What the owned records say</h3><p>{report.relationship.text}</p><p>{report.belief.text}</p><p>{report.goalSummary}</p><ul>{report.goals.map(g=><li key={g.id}>{g.text}</li>)}</ul><p>{report.scope}</p><details><summary>Exact owned-state description provenance</summary><pre className="exact" data-long-loss-description>{JSON.stringify(report,null,2)}</pre></details></section>;
 }catch(e){return <p role="alert">Owned-state description unavailable: {String(e)}</p>;}
}
