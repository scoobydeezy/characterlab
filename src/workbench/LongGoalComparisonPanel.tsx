import {useEffect,useRef,useState} from 'react';
import {LongGoalWorkerClient} from './longGoalWorkerClient';
import {LONG_GOAL_COMPARISONS,compareLongGoalSnapshots} from './longGoalComparison';
type Report=Awaited<ReturnType<typeof compareLongGoalSnapshots>>;
export function LongGoalComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[LongGoalWorkerClient,LongGoalWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState(LONG_GOAL_COMPARISONS[0].id),[loaded,setLoaded]=useState(''),[report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[complete,setComplete]=useState(false);
 const spec=LONG_GOAL_COMPARISONS.find(s=>s.id===selected)!;
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;clients.current?.forEach(c=>c.dispose());};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:'create'|'step'|'run'){
  if(locked.current)return;locked.current=true;stop.current=false;setBusy(true);setError('');setReport(undefined);const fresh:LongGoalWorkerClient[]=[];
  try{
   if(action==='create'){
    for(const index of [spec.control,spec.candidate]){fresh.push(await LongGoalWorkerClient.create(index));if(!alive.current)return;}
    clients.current?.forEach(c=>c.dispose());clients.current=[fresh[0],fresh[1]];setLoaded(spec.id);
   }else if(!clients.current||loaded!==selected)throw Error('Create the selected goal pair first');
   const pair=clients.current!;
   for(let i=0;i<(action==='step'?1:action==='run'?16:0);i++){
    if(stop.current||pair.every(c=>c.snapshot().complete))break;
    for(const c of pair){await c.advance();if(!alive.current)return;}
   }
   const next=await compareLongGoalSnapshots(spec.id,pair[0].snapshot(),pair[1].snapshot());
   if(alive.current){setReport(next);setComplete(pair.every(c=>c.snapshot().complete));}
  }catch(e){if(alive.current){setError(String(e));setLoaded('');}clients.current?.forEach(c=>c.dispose());clients.current=undefined;}
  finally{if(!alive.current||!clients.current)fresh.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 const canContinue=!busy&&loaded===selected&&!complete&&!error;
 return <section className="card"><h2>Matched goal components</h2><p>Independent original-case workers preserve the main inspection session. Pause finishes both sides of the current component step. The report compares retained trajectories through the selected prefix.</p>
 <label>Goal comparison<select value={selected} disabled={busy} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{LONG_GOAL_COMPARISONS.map(s=><option key={s.id} value={s.id}>{s.id} · case {s.control} → {s.candidate}</option>)}</select></label><p>{spec.purpose}</p>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create goal pair</button><button disabled={!canContinue} onClick={()=>void execute('step')}>Step goal pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run goal pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause goal pair</button></div>
 <p role="status">{busy?'Working on goal comparison':error?'Goal comparison failed; recreate pair':report?`Goal pair ${report.control.prefix} / ${report.candidate.prefix} · ${report.status}`:'Create a goal pair to inspect its records'}</p>{error&&<p role="alert">{error}</p>}
 {report&&<><p>Same native source save: {String(report.identity.nativeSaveEqual)} · same component save: {String(report.identity.componentSaveEqual)} · same run identity: {String(report.identity.runEqual)}</p>
 {report.status==='ALIGNED_COMPONENT_PREFIX'&&<table><caption>Exact trajectory comparisons</caption><thead><tr><th>Field</th><th>Equal</th><th>Evidence</th></tr></thead><tbody>{report.fields.map(f=><tr key={f.name}><td>{f.name}</td><td>{String(f.equal)}</td><td><details><summary>Control / candidate</summary><pre className="exact">{f.control}</pre><pre className="exact">{f.candidate}</pre></details></td></tr>)}</tbody></table>}
 <p>{report.scope}</p><details><summary>Exact goal comparison and draw records</summary><pre className="exact" data-long-goal-comparison>{JSON.stringify(report,null,2)}</pre></details></>}
 <p className="caption">120 declared contrasts. Full browser coverage and pair checkpoint persistence remain separate requirements. Equal actions do not imply equal probabilities or identical reasons.</p></section>;
}
