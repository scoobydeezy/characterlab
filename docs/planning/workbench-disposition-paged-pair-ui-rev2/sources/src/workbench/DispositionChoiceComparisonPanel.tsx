import type {dispositionChoiceComparison} from './dispositionChoiceComparison';
export function DispositionChoiceComparisonPanel({report,onEvent}:{report:ReturnType<typeof dispositionChoiceComparison>;onEvent?:(branch:'A'|'B',event:string)=>void}){
 return <section aria-label="Recorded choice comparison"><h3>Recorded choice comparison</h3>
 <p>{report.firstDifference?`First recorded choice or emission difference: instant ${report.firstDifference.instant} (${report.firstDifference.outcome}).`:'No recorded choice or emission difference in the aligned observed instants.'}</p>
 <p>{report.scope}</p>
 <table><thead><tr><th>Instant</th><th>Result</th><th>Branch A decision</th><th>Branch B decision</th></tr></thead><tbody>{report.rows.map(r=><tr key={r.instant}><td>{r.instant}</td><td>{r.outcome}</td>{(['a','b'] as const).map((key,i)=><td key={key}>{r[key]?<><span>{r[key]!.emitted?'Choice emitted':'No choice emitted'}</span>{onEvent&&<button onClick={()=>onEvent(i===0?'A':'B',r[key]!.decisionEvent)}>Inspect {i===0?'A':'B'} decision at instant {r.instant}</button>}<details><summary>Exact candidate identity</summary><pre className="exact">{r[key]!.candidate??'No candidate emitted'}</pre></details></>:'Missing instant'}</td>)}</tr>)}</tbody></table>
 <details><summary>Exact choice comparison</summary><pre className="exact" data-disposition-choice-comparison>{JSON.stringify(report,null,2)}</pre></details></section>;
}
