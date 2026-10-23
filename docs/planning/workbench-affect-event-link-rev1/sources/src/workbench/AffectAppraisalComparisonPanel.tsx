import {useState} from 'react';
import type {compareAffect} from './affectComparison';
import {compareAffectAppraisals} from './affectAppraisalComparison';
import {AFFECT_FACTOR_AXES} from './affectFactorProjection';
import {affectAppraisalEvent} from './affectAppraisalEvent';
import {EventStatePanel} from './EventStatePanel';
import {CausalHistoryPanel} from './CausalHistoryPanel';
export function AffectAppraisalComparisonPanel({comparison}:{comparison:ReturnType<typeof compareAffect>}){
 const [selected,setSelected]=useState('');
 const [inspection,setInspection]=useState<{branch:'a'|'b';id:string}|null>(null),[linkError,setLinkError]=useState('');
 if(!comparison.aligned)return <p>Appraisal comparison unavailable at unequal horizons. Prepare an aligned paired prefix.</p>;
 let report:ReturnType<typeof compareAffectAppraisals>;try{report=compareAffectAppraisals(comparison.a.explanations,comparison.b.explanations);}catch(error){return <p role="alert">Appraisal comparison withheld: {String(error)}</p>;}
 const row=report.rows.find(r=>r.at===selected)??report.rows.find(r=>r.at===report.firstDifference)??report.rows.at(-1);
 const snapshot=inspection?comparison[inspection.branch]:null,event=snapshot?.timeline.find(e=>e.id===inspection?.id);
 function inspect(branch:'a'|'b'){try{const value=row?.[branch];if(!value)throw Error('No evaluation');const event=affectAppraisalEvent(comparison[branch].timeline,value.provenance);setInspection({branch,id:event.id});setLinkError('');}catch(error){setInspection(null);setLinkError(String(error));}}
 return <section aria-label="AFFECT appraisal comparison"><h3>Recorded appraisal divergence</h3><p>{report.scope}</p>
 <p data-affect-first-difference>{report.firstDifference===null?'No difference in these fields through the aligned prefix.':`First recorded difference in these fields: instant ${report.firstDifference}.`}</p>
 <p>Branch A: {comparison.a.program} · prefix {comparison.a.prefix}. Branch B: {comparison.b.program} · prefix {comparison.b.prefix}.</p>
 <label>Compared appraisal instant<select value={row?.at??''} onChange={e=>{setSelected(e.target.value);setInspection(null);setLinkError('');}}>{report.rows.map(r=><option key={r.at} value={r.at}>Instant {r.at} · {r.changed.length?r.changed.join(', '):'Equal inspected fields'}</option>)}</select></label>
 {row&&<><table><thead><tr><th>Recorded operand</th><th>Branch A</th><th>Branch B</th></tr></thead><tbody>{AFFECT_FACTOR_AXES.map(k=><tr key={k}><td>{k}</td><td>{row.a?row.a.factors[k]?.exact??'Unavailable':'No evaluation'}</td><td>{row.b?row.b.factors[k]?.exact??'Unavailable':'No evaluation'}</td></tr>)}{(['raw','result'] as const).map(k=><tr key={k}><td>{k==='raw'?'Raw coordinates':'Resulting coordinates'}</td>{[row.a,row.b].map((v,i)=><td key={i}>{v?v[k].length?v[k].map(x=>x.exact).join(', '):'Unavailable':'No evaluation'}</td>)}</tr>)}</tbody></table>
 {([['A',row.a,comparison.a],['B',row.b,comparison.b]] as const).map(([branch,value,snapshot])=><details key={branch}><summary>Branch {branch} exact appraisal and revision</summary><code>{snapshot.saveHash}</code><pre className="exact" data-affect-comparison-source={branch}>{value?.provenance??'No evaluation at this instant'}</pre></details>)}</>}
 <details><summary>Exact appraisal comparison report</summary><pre className="exact" data-affect-appraisal-comparison>{JSON.stringify({identity:{a:{program:comparison.a.program,saveHash:comparison.a.saveHash,prefix:comparison.a.prefix},b:{program:comparison.b.program,saveHash:comparison.b.saveHash,prefix:comparison.b.prefix}},...report},null,2)}</pre></details>
 <div className="button-row"><button disabled={!row?.a} onClick={()=>inspect('a')}>Inspect branch A appraisal event</button><button disabled={!row?.b} onClick={()=>inspect('b')}>Inspect branch B appraisal event</button></div>
 {linkError&&<p role="alert">Event link withheld: {linkError}</p>}
 {event&&snapshot&&inspection&&<section aria-label="Compared AFFECT event"><h4>Branch {inspection.branch.toUpperCase()} · event {event.id} · {event.stage}</h4><p>Committed prefix {snapshot.prefix} · {snapshot.program}. This is retained execution evidence; selecting an event does not install intermediate state.</p><code data-affect-event-revision>{snapshot.saveHash}</code><EventStatePanel key={`${snapshot.saveHash}:${event.id}`} event={event}/><CausalHistoryPanel events={snapshot.timeline} selected={event.id} runHash={snapshot.runHash} onSelect={id=>setInspection({...inspection,id})}/><details><summary>Exact selected event</summary><pre className="exact" data-affect-compared-event>{JSON.stringify(event,null,2)}</pre></details></section>}
 </section>;
}
