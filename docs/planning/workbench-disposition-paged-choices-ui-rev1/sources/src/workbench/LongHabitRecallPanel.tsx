import {useEffect,useState} from 'react';
import {describeLongHabitPracticeRecall} from './longHabitRecallDescription';
type Report=Awaited<ReturnType<typeof describeLongHabitPracticeRecall>>;
export function LongHabitRecallPanel({views}:{views:readonly (readonly number[])[]}){
 const signature=JSON.stringify(views),[value,setValue]=useState<{signature:string;report:Report}>(),[error,setError]=useState<{signature:string;text:string}>();
 useEffect(()=>{let current=true;setError(undefined);void describeLongHabitPracticeRecall(JSON.parse(signature)).then(report=>{if(current)setValue({signature,report});}).catch(e=>{if(current)setError({signature,text:String(e)});});return()=>{current=false;};},[signature]);
 if(error?.signature===signature)return <p role="alert">{error.text}</p>;
 if(value?.signature!==signature)return <p role="status">Reading retained practice evidence…</p>;
 const {report}=value;
 return <section><h3>Retained practice evidence</h3><p>{report.text}</p>{report.records.length>0&&<ul>{report.records.map(r=><li key={r.occurrence}><p>{r.text}</p><details><summary>Exact retained evidence · clock {r.at}</summary><p>{r.sha256}</p><pre className="exact">{r.exact}</pre></details></li>)}</ul>}<p>{report.scope}</p><details><summary>Versioned recall description</summary><pre className="exact" data-long-habit-recall-description>{JSON.stringify(report,null,2)}</pre></details></section>;
}
