import {useEffect,useState} from 'react';
import {describeLongGoalSource,type LongGoalSourceInput} from './longGoalSourceObserver';
type Report=Awaited<ReturnType<typeof describeLongGoalSource>>;
export function LongGoalSourceDescription({prefix,rows}:LongGoalSourceInput){
 const [report,setReport]=useState<Report>(),[error,setError]=useState('');
 const latest=rows.at(-1)?.sourceView;
 useEffect(()=>{let current=true;setError('');setReport(undefined);void describeLongGoalSource({prefix,rows:rows.map(({at,sourceView})=>({at,sourceView}))}).then(value=>{if(current)setReport(value);}).catch(e=>{if(current)setError(String(e));});return()=>{current=false;};},[prefix,rows]);
 if(error)return <p role="alert">{error}</p>;
 if(!report||report.prefix!==prefix||(report.status==='RECORDED_NATIVE_OBSERVER'&&report.observerHex!==latest))return <p role="status">Preparing recorded source observation…</p>;
 return <section><h3>Native source observation</h3>{report.status==='NO_RECORDED_SOURCE_OBSERVATION'?<p>No source observation has been recorded yet. The component has not committed its first source instant.</p>:<><p>Recorded at source clock {report.sourceClock}. These descriptions concern the native source, separately from the goal ledger and receiving decisions.</p><ul>{report.description.rows.map(r=><li key={r.id}><p>{r.text}</p><details><summary>Exact source evidence · {r.field} · {r.present?'present':'absent'}</summary><pre className="exact">{r.exact??'Absent'}</pre></details></li>)}</ul></>}<p>{report.scope}</p><details><summary>Versioned source-description record</summary><pre className="exact" data-long-goal-source-description>{JSON.stringify(report,null,2)}</pre></details></section>;
}
