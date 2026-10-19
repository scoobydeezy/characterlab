import {useEffect,useRef,useState} from 'react';
import {LongGoalWorkerClient} from './longGoalWorkerClient';
import {LONG_GOAL_COMPARISONS,compareLongGoalSnapshots} from './longGoalComparison';
import {captureLongGoalPair,restoreLongGoalPair,type LongGoalPairCheckpoint} from './longGoalPairCheckpoint';
import {PreparedExport} from './PreparedExport';
type Report=Awaited<ReturnType<typeof compareLongGoalSnapshots>>;
export function LongGoalComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[LongGoalWorkerClient,LongGoalWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState(LONG_GOAL_COMPARISONS[0].id),[loaded,setLoaded]=useState(''),[report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[complete,setComplete]=useState(false);
 const spec=LONG_GOAL_COMPARISONS.find(s=>s.id===selected)!;
 const [checkpoint,setCheckpoint]=useState<LongGoalPairCheckpoint>(),[checkpointError,setCheckpointError]=useState(''),[exportText,setExportText]=useState('');
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
 async function checkpointAction(action:'capture'|'restore'|'import',file?:File){
  if(locked.current)return;locked.current=true;setBusy(true);setCheckpointError('');let fresh:[LongGoalWorkerClient,LongGoalWorkerClient]|undefined;
  try{
   if(action==='capture'){
    if(!clients.current||loaded!==selected)throw Error('Create the selected pair before capture');
    const saved=await captureLongGoalPair(loaded,clients.current);if(alive.current){setCheckpoint(saved);setExportText('');}
   }else{
    let saved=checkpoint;
    if(action==='import'){if(!file||file.size>65_000_000)throw Error('Choose a goal pair JSON file no larger than65,000,000 bytes');saved=JSON.parse(await file.text()) as LongGoalPairCheckpoint;}
    if(!saved)throw Error('No goal pair checkpoint captured');
    fresh=await restoreLongGoalPair(saved,c=>LongGoalWorkerClient.restore(c),c=>c.dispose());
    const next=await compareLongGoalSnapshots(saved.comparison,fresh[0].snapshot(),fresh[1].snapshot());
    if(!alive.current)return;
    clients.current?.forEach(c=>c.dispose());clients.current=fresh;fresh=undefined;
    setSelected(saved.comparison);setLoaded(saved.comparison);setReport(next);setComplete(clients.current.every(c=>c.snapshot().complete));setCheckpoint(structuredClone(saved));setError('');setExportText('');
   }
  }catch(e){if(alive.current)setCheckpointError(String(e));}
  finally{fresh?.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 const canContinue=!busy&&loaded===selected&&!complete&&!error;
 return <section className="card"><h2>Matched goal components</h2><p>Independent original-case workers preserve the main inspection session. Pause finishes both sides of the current component step. The report compares retained trajectories through the selected prefix.</p>
 <label>Goal comparison<select value={selected} disabled={busy} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{LONG_GOAL_COMPARISONS.map(s=><option key={s.id} value={s.id}>{s.id} · case {s.control} → {s.candidate}</option>)}</select></label><p>{spec.purpose}</p>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create goal pair</button><button disabled={!canContinue} onClick={()=>void execute('step')}>Step goal pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run goal pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause goal pair</button></div>
 <p role="status">{busy?'Working on goal comparison':error?'Goal comparison failed; recreate pair':report?`Goal pair ${report.control.prefix} / ${report.candidate.prefix} · ${report.status}`:'Create a goal pair to inspect its records'}</p>{error&&<p role="alert">{error}</p>}
 <details><summary>Goal pair checkpoint</summary><p>Both original cases and aligned prefixes are authenticated before a restored pair replaces the current pair. A rejected import leaves the current pair intact. The comparison report is regenerated from restored state.</p><div className="button-row"><button disabled={busy||loaded!==selected||!report} onClick={()=>void checkpointAction('capture')}>Capture goal pair</button><button disabled={busy||!checkpoint} onClick={()=>void checkpointAction('restore')}>Restore goal pair</button><button disabled={busy||!checkpoint} onClick={()=>setExportText(JSON.stringify(checkpoint,null,2))}>Prepare goal pair export</button></div><p>{checkpoint?`${checkpoint.comparison} captured at prefix ${checkpoint.control.prefix}.`:'No pair checkpoint captured.'}</p><label>Import goal pair JSON<input type="file" accept=".json,application/json" disabled={busy} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void checkpointAction('import',file);}}/></label>{checkpointError&&<p role="alert">{checkpointError}</p>}</details>
 {report&&<><p>Same native source save: {String(report.identity.nativeSaveEqual)} · same component save: {String(report.identity.componentSaveEqual)} · same run identity: {String(report.identity.runEqual)}</p>
 {report.status==='ALIGNED_COMPONENT_PREFIX'&&<table><caption>Exact trajectory comparisons</caption><thead><tr><th>Field</th><th>Equal</th><th>Evidence</th></tr></thead><tbody>{report.fields.map(f=><tr key={f.name}><td>{f.name}</td><td>{String(f.equal)}</td><td><details><summary>Control / candidate</summary><pre className="exact">{f.control}</pre><pre className="exact">{f.candidate}</pre></details></td></tr>)}</tbody></table>}
 <p>{report.scope}</p><details><summary>Exact goal comparison and draw records</summary><pre className="exact" data-long-goal-comparison>{JSON.stringify(report,null,2)}</pre></details></>}
 {exportText&&<PreparedExport text={exportText} label="Prepared goal pair checkpoint" filename="characterlab-long-goal-pair.json"/>}
 <p className="caption">120 declared contrasts. Full browser coverage remains a separate requirement. Equal actions do not imply equal probabilities or identical reasons.</p></section>;
}
