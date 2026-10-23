import {useEffect,useRef,useState} from 'react';
import {LongLossWorkerClient} from './longLossWorkerClient';
import {LONG_LOSS_COMPARISONS,compareLongLossSnapshots} from './longLossComparison';
import {captureLongLossPair,restoreLongLossPair,type LongLossPairCheckpoint} from './longLossPairCheckpoint';
import {PreparedExport} from './PreparedExport';
type Report=Awaited<ReturnType<typeof compareLongLossSnapshots>>;
export function LongLossComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[LongLossWorkerClient,LongLossWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState(LONG_LOSS_COMPARISONS[0].id),[loaded,setLoaded]=useState(''),[report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[complete,setComplete]=useState(false);
 const spec=LONG_LOSS_COMPARISONS.find(s=>s.id===selected)!;
 const [checkpoint,setCheckpoint]=useState<LongLossPairCheckpoint>(),[checkpointError,setCheckpointError]=useState(''),[exportText,setExportText]=useState('');
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;clients.current?.forEach(c=>c.dispose());};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:'create'|'step'|'run'){
  if(locked.current)return;locked.current=true;stop.current=false;setBusy(true);setError('');setReport(undefined);const fresh:LongLossWorkerClient[]=[];
  try{
   if(action==='create'){
    for(const index of [spec.control,spec.candidate]){fresh.push(await LongLossWorkerClient.create(index));if(!alive.current)return;}
    clients.current?.forEach(c=>c.dispose());clients.current=[fresh[0],fresh[1]];setLoaded(spec.id);
   }else if(!clients.current||loaded!==selected)throw Error('Create the selected loss pair first');
   const pair=clients.current!;
   for(let i=0;i<(action==='step'?1:action==='run'?12:0);i++){
    if(stop.current||pair.every(c=>c.snapshot().complete))break;
    for(const c of pair){await c.advance();if(!alive.current)return;}
   }
   const next=await compareLongLossSnapshots(spec.id,pair[0].snapshot(),pair[1].snapshot());
   if(alive.current){setReport(next);setComplete(pair.every(c=>c.snapshot().complete));}
  }catch(e){if(alive.current){setError(String(e));setLoaded('');}clients.current?.forEach(c=>c.dispose());clients.current=undefined;}
  finally{if(!alive.current||!clients.current)fresh.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 async function checkpointAction(action:'capture'|'restore'|'import',file?:File){
  if(locked.current)return;locked.current=true;setBusy(true);setCheckpointError('');let fresh:[LongLossWorkerClient,LongLossWorkerClient]|undefined;
  try{
   if(action==='capture'){
    if(!clients.current||loaded!==selected)throw Error('Create the selected pair before capture');
    const saved=await captureLongLossPair(loaded,clients.current);if(alive.current){setCheckpoint(saved);setExportText('');}
   }else{
    let saved=checkpoint;
    if(action==='import'){if(!file||file.size>65_000_000)throw Error('Choose a loss pair JSON file no larger than65,000,000 bytes');saved=JSON.parse(await file.text()) as LongLossPairCheckpoint;}
    if(!saved)throw Error('No loss pair checkpoint captured');
    fresh=await restoreLongLossPair(saved,c=>LongLossWorkerClient.restore(c),c=>c.dispose());
    const next=await compareLongLossSnapshots(saved.comparison,fresh[0].snapshot(),fresh[1].snapshot());
    if(!alive.current)return;
    clients.current?.forEach(c=>c.dispose());clients.current=fresh;fresh=undefined;
    setSelected(saved.comparison);setLoaded(saved.comparison);setReport(next);setComplete(clients.current.every(c=>c.snapshot().complete));setCheckpoint(structuredClone(saved));setError('');setExportText('');
   }
  }catch(e){if(alive.current)setCheckpointError(String(e));}
  finally{fresh?.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 const canContinue=!busy&&loaded===selected&&!complete&&!error;
 return <section className="card"><h2>Matched loss components</h2><p>Independent original receiver workers preserve the main inspection session. Pause finishes both sides of the current receiving step. The report compares retained trajectories through the selected prefix.</p>
 <label>Loss comparison<select value={selected} disabled={busy} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{LONG_LOSS_COMPARISONS.map(s=><option key={s.id} value={s.id}>{s.id} · case {s.control} → {s.candidate}</option>)}</select></label><p>{spec.purpose}</p>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create loss pair</button><button disabled={!canContinue} onClick={()=>void execute('step')}>Step loss pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run loss pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause loss pair</button></div>
 <p role="status">{busy?'Working on loss comparison':error?'Loss comparison failed; recreate pair':report?`Loss pair ${report.control.prefix} / ${report.candidate.prefix} · ${report.status}`:'Create a loss pair to inspect its records'}</p>{error&&<p role="alert">{error}</p>}
 <details><summary>Loss pair checkpoint</summary><p>Both original cases and aligned prefixes are authenticated before a restored pair replaces the current pair. A rejected import leaves the current pair intact. The comparison report is regenerated from restored state.</p><div className="button-row"><button disabled={busy||loaded!==selected||!report} onClick={()=>void checkpointAction('capture')}>Capture loss pair</button><button disabled={busy||!checkpoint} onClick={()=>void checkpointAction('restore')}>Restore loss pair</button><button disabled={busy||!checkpoint} onClick={()=>setExportText(JSON.stringify(checkpoint,null,2))}>Prepare loss pair export</button></div><p>{checkpoint?`${checkpoint.comparison} captured at prefix ${checkpoint.control.prefix}.`:'No pair checkpoint captured.'}</p><label>Import loss pair JSON<input type="file" accept=".json,application/json" disabled={busy} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void checkpointAction('import',file);}}/></label>{checkpointError&&<p role="alert">{checkpointError}</p>}</details>
 {report&&<><p>Same component save: {String(report.identity.saveEqual)} · same run identity: {String(report.identity.runEqual)}</p>
 {report.status==='ALIGNED_COMPONENT_PREFIX'&&<table><caption>Exact trajectory comparisons</caption><thead><tr><th>Field</th><th>Authority</th><th>Equal</th><th>Evidence</th></tr></thead><tbody>{report.fields.map(f=><tr key={f.name}><td>{f.name}</td><td>{f.authority}</td><td>{String(f.equal)}</td><td><details><summary>Control / candidate</summary><pre className="exact">{f.control}</pre><pre className="exact">{f.candidate}</pre></details></td></tr>)}</tbody></table>}
 <p>{report.scope}</p><details><summary>Exact loss comparison and draw records</summary><pre className="exact" data-long-loss-comparison>{JSON.stringify(report,null,2)}</pre></details></>}
 {exportText&&<PreparedExport text={exportText} label="Prepared loss pair checkpoint" filename="characterlab-long-loss-pair.json"/>}
 <p className="caption">904 qualified contrasts. Full browser coverage remains a separate requirement. Equal actions do not imply equal probabilities or identical reasons.</p></section>;
}
