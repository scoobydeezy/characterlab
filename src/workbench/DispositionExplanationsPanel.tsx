import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {explainDispositionFactors} from './dispositionExplanations';
export function DispositionExplanationsPanel({event,seamVersion}:{event:TimelineEvent;seamVersion:string}){
 const result=useMemo(()=>{try{return {report:explainDispositionFactors(event,seamVersion,'researcher')};}catch(e){return {error:String(e)};}},[event,seamVersion]),r=result.report;
 return <section aria-label="Disposition explanation audit"><h3>Factor explanations and language gaps</h3>
 {result.error&&<p role="alert">{result.error}. Explanation withheld.</p>}
 {r&&<><p>{r.scope}</p>{r.rows.map(row=><article key={row.sourceKey}><p>{row.text}</p>
 <details><summary>Semantic meaning and exact subject</summary><pre className="exact">{JSON.stringify(row.semantic,null,2)}</pre></details>
 <details><summary>Recorded source and coverage</summary><pre className="exact">{JSON.stringify({source:row.mechanical,coverage:row.coverage},null,2)}</pre></details>
 </article>)}{r.emitted&&<p role="status">Player-language qualification incomplete: {r.rows.length} factors lack a qualified character/player reason and subject name.</p>}
 <details><summary>Exact explanation audit</summary><pre className="exact" data-disposition-explanations>{JSON.stringify(r,null,2)}</pre></details></>}
 </section>;
}
