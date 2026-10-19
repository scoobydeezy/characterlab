import {useEffect,useRef,useState} from 'react';
import {SubstitutionWorkerClient} from './substitutionWorkerClient';
import {SUBSTITUTION_CONTRASTS,compareSubstitution} from './substitutionComparison';
import {captureSubstitutionPair,restoreSubstitutionPair,type SubstitutionPairCheckpoint} from './substitutionPairCheckpoint';
type Report=Awaited<ReturnType<typeof compareSubstitution>>;
export function SubstitutionComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[SubstitutionWorkerClient,SubstitutionWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState('input/concentrated'),[loaded,setLoaded]=useState(''),[report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[checkpointError,setCheckpointError]=useState(''),[checkpoint,setCheckpoint]=useState<SubstitutionPairCheckpoint>(),[complete,setComplete]=useState(false);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;clients.current?.forEach(c=>c.dispose());};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:'create'|'step'|'run'){
  if(locked.current)return;locked.current=true;stop.current=false;setBusy(true);setError('');setReport(undefined);const fresh:SubstitutionWorkerClient[]=[];
  try{
   const spec=SUBSTITUTION_CONTRASTS.find(c=>c.id===selected)!;
   if(action==='create'){
    for(const id of [spec.a,spec.b]){fresh.push(await SubstitutionWorkerClient.create(id));if(!alive.current)return;}
    clients.current?.forEach(c=>c.dispose());clients.current=[fresh[0],fresh[1]];setLoaded(spec.id);
   }else if(!clients.current||loaded!==selected)throw Error('Create the selected SUBSTITUTION pair first');
   const pair=clients.current!;
   for(let i=0;i<(action==='step'?1:action==='run'?8:0);i++){
    if(stop.current||pair.every(c=>c.snapshot().complete))break;
    for(const c of pair){if(!c.snapshot().complete)await c.advance();if(!alive.current)return;}
   }
   const next=await compareSubstitution(spec.id,pair[0].snapshot(),pair[1].snapshot());
   if(alive.current){setReport(next);setComplete(pair.every(c=>c.snapshot().complete));}
  }catch(e){if(alive.current){setError(String(e));setLoaded('');}clients.current?.forEach(c=>c.dispose());clients.current=undefined;}
  finally{if(!alive.current||!clients.current)fresh.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 async function checkpointAction(restore:boolean){
  if(locked.current)return;locked.current=true;setBusy(true);setCheckpointError('');let fresh:[SubstitutionWorkerClient,SubstitutionWorkerClient]|undefined;
  try{
   if(!restore){if(!clients.current||loaded!==selected)throw Error('Create selected pair first');const saved=await captureSubstitutionPair(loaded,clients.current);if(alive.current)setCheckpoint(saved);}
   else{
    if(!checkpoint)throw Error('Capture a pair first');
    fresh=await restoreSubstitutionPair(checkpoint,c=>SubstitutionWorkerClient.restore(c),c=>c.dispose());
    const next=await compareSubstitution(checkpoint.comparison,fresh[0].snapshot(),fresh[1].snapshot());if(!alive.current)return;
    clients.current?.forEach(c=>c.dispose());clients.current=fresh;fresh=undefined;setSelected(checkpoint.comparison);setLoaded(checkpoint.comparison);setReport(next);setComplete(clients.current.every(c=>c.snapshot().complete));setError('');
   }
  }catch(e){if(alive.current)setCheckpointError(String(e));}
  finally{fresh?.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 const canContinue=!busy&&loaded===selected&&!complete&&!error;
 return <section className="card"><h2>Declared SUBSTITUTION comparisons</h2><p>Two independent workers preserve the main inspection run. Pause finishes the current pair step. Shorter programs stop at their own terminal boundary; unaligned results withhold equality claims.</p>
 <label>SUBSTITUTION comparison<select disabled={busy} value={selected} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{SUBSTITUTION_CONTRASTS.map(c=><option key={c.id} value={c.id}>{c.id}</option>)}</select></label>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create SUBSTITUTION pair</button><button disabled={!canContinue} onClick={()=>void execute('step')}>Step SUBSTITUTION pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run SUBSTITUTION pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause SUBSTITUTION pair</button></div>
 <p role="status">{busy?'Working on SUBSTITUTION comparison':error?'Comparison failed; recreate pair':report?`SUBSTITUTION pair ${report.a.prefix} / ${report.b.prefix} · ${report.aligned?'Aligned':'Unaligned'}`:'Create a SUBSTITUTION pair'}</p>{error&&<p role="alert">{error}</p>}
 <div className="button-row"><button disabled={busy||loaded!==selected||!report} onClick={()=>void checkpointAction(false)}>Capture SUBSTITUTION pair</button><button disabled={busy||!checkpoint} onClick={()=>void checkpointAction(true)}>Restore SUBSTITUTION pair</button></div><p>{checkpoint?`Captured ${checkpoint.comparison} at prefixes ${checkpoint.a.prefix} / ${checkpoint.b.prefix}.`:'No pair checkpoint captured.'} Both component saves authenticate before replacement.</p>{checkpointError&&<p role="alert">{checkpointError}</p>}
 {report&&<><p>Component observer equal: {String(report.observerEqual)} · State equal: {String(report.stateEqual)}</p><p>{report.randomPolicy}</p><details><summary>Exact SUBSTITUTION comparison</summary><pre className="exact" data-substitution-comparison>{JSON.stringify(report,null,2)}</pre></details></>}
 <p>41 declared comparisons qualified across369 aligned prefixes. Browser coverage and causal factor accounting remain separate requirements.</p></section>;
}
