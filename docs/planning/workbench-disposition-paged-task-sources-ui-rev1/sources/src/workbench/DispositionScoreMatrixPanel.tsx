import {useMemo} from 'react';
import type {dispositionResolution} from './dispositionResolution';
import {dispositionScoreMatrix} from './dispositionScoreMatrix';
export function DispositionScoreMatrixPanel({resolution,onEvent}:{resolution:ReturnType<typeof dispositionResolution>;onEvent:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:dispositionScoreMatrix(resolution)};}catch(error){return {error:String(error)};}},[resolution]),r=result.report;
 return <section aria-label="Recorded decision score matrix"><h3>Recorded decision score matrix</h3>
 {result.error&&<p role="alert">{result.error}. Score matrix withheld.</p>}
 {r&&<><p>{r.scope}</p><p role="status">{r.availability} · instant {r.instant} · {r.rows.length} sampled nuclei</p>
 <div className="button-row"><button onClick={()=>onEvent(r.reasonEvent)}>Inspect matrix reason event {r.reasonEvent}</button><button onClick={()=>onEvent(r.decisionEvent)}>Inspect matrix decision event {r.decisionEvent}</button></div>
 {r.rows.length>0?<><p>Color scale: −{r.scaleMaximum} to +{r.scaleMaximum}. Neutral cells retain exact zero. Rows follow the original nucleus order.</p>
 <div className="table-scroll"><table><caption>Signed score components and exact row sums</caption><thead><tr><th scope="col">Nucleus / candidate</th>{r.columns.map(column=><th scope="col" key={column}>{column}</th>)}<th scope="col">Recorded contribution</th></tr></thead>
 <tbody>{r.rows.map(row=><tr key={row.key}><th scope="row">Nucleus {row.nucleus}<details><summary>Exact candidate and nucleus {row.nucleus}</summary><pre className="exact">{row.candidate}</pre><pre className="exact">{row.key}</pre></details></th>
 {row.cells.map((cell,i)=><td key={r.columns[i]} data-score-component={i} aria-label={`Nucleus ${row.nucleus}, ${r.columns[i]}: ${cell.exact}`} style={{backgroundColor:cell.normalized===0?'transparent':cell.normalized>0?`rgba(25,110,90,${Math.abs(cell.normalized)*0.24})`:`rgba(170,65,40,${Math.abs(cell.normalized)*0.24})`}}><code>{cell.exact}</code></td>)}
 <td data-score-total><code>{row.total}</code></td></tr>)}</tbody></table></div></>:<p>No sampled score matrix is available for this resolution. No zero-valued draw is inferred.</p>}
 <details><summary>Exact score matrix and scaling</summary><pre className="exact" data-disposition-score-matrix>{JSON.stringify(r,null,2)}</pre></details></>}
 </section>;
}
