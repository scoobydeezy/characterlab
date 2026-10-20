import {useEffect,useRef,useState} from 'react';
import {LongWorkerClient} from './longWorkerClient';
import {LONG_COMPARISONS,compareLongSnapshots} from './longComparison';
type Report=Awaited<ReturnType<typeof compareLongSnapshots>>;
export function LongComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[LongWorkerClient,LongWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState(LONG_COMPARISONS[0].id),[loaded,setLoaded]=useState(''),[report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[complete,setComplete]=useState(false);
 const spec=LONG_COMPARISONS.find(s=>s.id===selected)!;
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;clients.current?.forEach(c=>c.dispose());};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:'create'|'probe'|'step'|'run'){
  if(locked.current)return;locked.current=true;stop.current=false;setBusy(true);setError('');setReport(undefined);const fresh:LongWorkerClient[]=[];
  try{
   if(action==='create'||action==='probe'){
    for(const name of [spec.control,spec.candidate]){fresh.push(await LongWorkerClient.create(name));if(!alive.current)return;}
    clients.current?.forEach(c=>c.dispose());clients.current=[fresh[0],fresh[1]];setLoaded(spec.id);
   }else if(!clients.current||loaded!==selected)throw Error('Create the selected LONG pair first');
   const pair=clients.current!;
   for(let i=0;i<(action==='probe'?4:action==='step'?1:action==='run'?16:0);i++){
    if(stop.current||pair.every(c=>c.snapshot().complete))break;
    for(const c of pair){await c.advance();if(!alive.current)return;}
   }
   const next=await compareLongSnapshots(spec.id,pair[0].snapshot(),pair[1].snapshot());
   if(alive.current){setReport(next);setComplete(pair.every(c=>c.snapshot().complete));}
  }catch(e){if(alive.current){setError(String(e));setLoaded('');}clients.current?.forEach(c=>c.dispose());clients.current=undefined;}
  finally{if(!alive.current||!clients.current)fresh.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 const canContinue=!busy&&loaded===selected&&!complete&&!error;
 return <section className="card"><h2>Controlled longitudinal comparison</h2><p>Each pair uses two independent workers and original inputs. The main LONG session stays separate. Both sides finish the current pair step before a pause. Different authored schedules may produce unaligned clocks.</p>
 <label>LONG comparison<select value={selected} disabled={busy} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{LONG_COMPARISONS.map(s=><option key={s.id} value={s.id}>{s.control} → {s.candidate}</option>)}</select></label><p>{spec.purpose}</p>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create LONG pair</button><button disabled={busy} onClick={()=>void execute('probe')}>Run fresh LONG pair four instants</button><button disabled={!canContinue} onClick={()=>void execute('step')}>Step LONG pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run LONG pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause LONG pair</button></div>
 <p role="status">{busy?'Working on LONG comparison':error?'LONG comparison failed; recreate pair':report?`LONG pair ${report.control.prefix} / ${report.candidate.prefix} · clocks ${report.control.clock} / ${report.candidate.clock} · ${report.status}`:'Create a pair to inspect its records'}</p>{error&&<p role="alert">{error}</p>}
 {report&&<><p>Same model: {String(report.identity.modelEqual)} · same run identity: {String(report.identity.runEqual)} · same closed observer record: {String(report.identity.observerEqual)}</p>
 {report.status==='ALIGNED_COMMITTED_CLOCK'&&<><p>Identity, skill and relationship projections all equal: {String(report.learnedEqual)}. Retained detail is assessed separately below.</p><table><caption>Exact observer-field comparison</caption><thead><tr><th>Field</th><th>Control present</th><th>Candidate present</th><th>Equal</th></tr></thead><tbody>{report.fields.map(f=><tr key={f.name}><td>{f.name}</td><td>{String(f.control.present)}</td><td>{String(f.candidate.present)}</td><td>{String(f.equal)}</td></tr>)}</tbody></table></>}
 <p>{report.scope}</p><details><summary>Exact LONG comparison and draw records</summary><pre className="exact" data-long-comparison>{JSON.stringify(report,null,2)}</pre></details></>}
 <p className="caption">24 declared contrasts. Full-horizon and browser coverage require separate qualification. Equal projections do not establish general memory equivalence or authorize reduction.</p></section>;
}
