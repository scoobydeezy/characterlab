import type {AffectSnapshot} from './affectSession';
import {affectLearningEpisodeSources} from './affectLearningEpisodeSources';
export function AffectLearningEpisodePanel({snapshot,eventId,onSelect}:{snapshot:AffectSnapshot;eventId:string;onSelect:(id:string)=>void}){
 try{
  const report=affectLearningEpisodeSources(snapshot,eventId);
  const button=(id:string,label:string)=><button type="button" onClick={()=>onSelect(id)}>{label} · event {id}</button>;
  return <section aria-label="Recorded learning episode"><h3>Recorded learning episode</h3><p>{report.scope}</p><p>Learning sample field: {report.samplePresent?'present':'absent'}. Evidence source: {report.evidenceStatus}.</p>{report.evidence.map(e=><span key={e.eventId}>{button(e.eventId,'Open evidence')}</span>)}
   {(report.current?[report.current,...report.episodeBasis]:[]).map(row=><details key={row.role}><summary>{row.role} · {row.freezeStatus}</summary>{row.freezes.map(f=><div key={f.eventId}>{button(f.eventId,`${row.role}: open freeze`)}<p>Track source: {f.trackStatus}</p>{f.tracks.map(t=><div key={t.eventId}>{button(t.eventId,`${row.role}: open track`)}<p>Admitted observation: {t.observationStatus}</p>{t.observations.map(o=><span key={o.eventId}>{button(o.eventId,`${row.role}: open observation`)}</span>)}</div>)}</div>)}<pre className="exact">{JSON.stringify(row.frozen,null,2)}</pre></details>)}
   {!report.conditionalEvidencePresent&&<p>No conditional evidence was supplied to this application event.</p>}{report.conditionalEvidencePresent&&report.episodeBasis.length===0&&<p>The recorded EpisodeBasis is empty.</p>}<details><summary>Exact episode source report</summary><pre className="exact" data-affect-learning-episode>{JSON.stringify(report,null,2)}</pre></details></section>;
 }catch(error){return <p role="alert">Episode source inspection unavailable: {String(error)}</p>;}
}
