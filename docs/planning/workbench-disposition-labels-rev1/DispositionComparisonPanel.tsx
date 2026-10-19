import {useEffect,useRef,useState} from 'react';
import {DispositionWorkerClient} from './dispositionWorkerClient';
import {DISPOSITION_CONTRASTS,compareDisposition} from './dispositionComparison';
import {captureDispositionPair,restoreDispositionPair,type DispositionPairCheckpoint} from './dispositionPairCheckpoint';
type Report=Awaited<ReturnType<typeof compareDisposition>>;
function programLabel(id:string){
 const [law,name]=id.split('/');
 const names:Record<string,string>={Main:'baseline',ConstitutionPositive:'constitution +1/8',ConstitutionNegative:'constitution −1/8',NoEvidence:'zero learning significance',Pressure:'learning pressure 4',FailedExecution:'execution denied',Seed0:'learning seed zero',InactiveProbes:'inactive probes',NoContextChange:'unchanged context'};
 return `${law}: ${names[name]??name}`;
}
const changeLabel=(c:typeof DISPOSITION_CONTRASTS[number])=>c.kind==='input'?'input calendar':c.changed==='constitution'?'constitutional baseline':'candidate law';
export function DispositionComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[DispositionWorkerClient,DispositionWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState('model/0/13'),[loaded,setLoaded]=useState(''),[report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[checkpointError,setCheckpointError]=useState(''),[checkpoint,setCheckpoint]=useState<DispositionPairCheckpoint>(),[complete,setComplete]=useState(false);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;clients.current?.forEach(c=>c.dispose());};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:'create'|'step'|'run'){
  if(locked.current)return;locked.current=true;stop.current=false;setBusy(true);setError('');setReport(undefined);const fresh:DispositionWorkerClient[]=[];
  try{
   const spec=DISPOSITION_CONTRASTS.find(c=>c.id===selected)!;
   if(action==='create'){
    for(const id of [spec.a,spec.b]){fresh.push(await DispositionWorkerClient.create(id));if(!alive.current)return;}
    clients.current?.forEach(c=>c.dispose());clients.current=[fresh[0],fresh[1]];setLoaded(spec.id);
   }else if(!clients.current||loaded!==selected)throw Error('Create the selected DISPOSITION pair first');
   const pair=clients.current!;
   for(let i=0;i<(action==='step'?1:action==='run'?18:0);i++){
    if(stop.current||pair.every(c=>c.snapshot().complete))break;
    for(const c of pair){if(!c.snapshot().complete)await c.advance();if(!alive.current)return;}
   }
   const next=await compareDisposition(spec.id,pair[0].snapshot(),pair[1].snapshot());
   if(alive.current){setReport(next);setComplete(pair.every(c=>c.snapshot().complete));}
  }catch(e){if(alive.current){setError(String(e));setLoaded('');}clients.current?.forEach(c=>c.dispose());clients.current=undefined;}
  finally{if(!alive.current||!clients.current)fresh.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 async function checkpointAction(restore:boolean){
  if(locked.current)return;locked.current=true;setBusy(true);setCheckpointError('');let fresh:[DispositionWorkerClient,DispositionWorkerClient]|undefined;
  try{
   if(!restore){if(!clients.current||loaded!==selected)throw Error('Create selected pair first');const saved=await captureDispositionPair(loaded,clients.current);if(alive.current)setCheckpoint(saved);}
   else{
    if(!checkpoint)throw Error('Capture a pair first');
    fresh=await restoreDispositionPair(checkpoint,c=>DispositionWorkerClient.restore(c),c=>c.dispose());
    const next=await compareDisposition(checkpoint.comparison,fresh[0].snapshot(),fresh[1].snapshot());if(!alive.current)return;
    clients.current?.forEach(c=>c.dispose());clients.current=fresh;fresh=undefined;setSelected(checkpoint.comparison);setLoaded(checkpoint.comparison);setReport(next);setComplete(clients.current.every(c=>c.snapshot().complete));setError('');
   }
  }catch(e){if(alive.current)setCheckpointError(String(e));}
  finally{fresh?.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 const canContinue=!busy&&loaded===selected&&!complete&&!error;
 const selectedContrast=DISPOSITION_CONTRASTS.find(c=>c.id===selected)!;
 return <section className="card"><h2>Declared DISPOSITION comparisons</h2><p>Two independent workers preserve the main inspection run. Pause finishes the current pair step. Shorter programs stop at their own terminal boundary; unaligned results withhold equality claims.</p>
 <label>DISPOSITION comparison<select disabled={busy} value={selected} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{DISPOSITION_CONTRASTS.map(c=><option key={c.id} value={c.id}>{programLabel(c.a)} ↔ {programLabel(c.b)} · {changeLabel(c)}</option>)}</select></label>
 <p>Selected: {programLabel(selectedContrast.a)} versus {programLabel(selectedContrast.b)}. Change: {changeLabel(selectedContrast)}. {selectedContrast.kind==='model'?'Original inputs are identical.':'The model is held fixed; exact input changes appear in the report.'}</p>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create DISPOSITION pair</button><button disabled={!canContinue} onClick={()=>void execute('step')}>Step DISPOSITION pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run DISPOSITION pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause DISPOSITION pair</button></div>
 <p role="status">{busy?'Working on DISPOSITION comparison':error?'Comparison failed; recreate pair':report?`DISPOSITION pair ${report.a.prefix} / ${report.b.prefix} · ${report.aligned?'Aligned':'Unaligned'}`:'Create a DISPOSITION pair'}</p>{error&&<p role="alert">{error}</p>}
 <div className="button-row"><button disabled={busy||loaded!==selected||!report} onClick={()=>void checkpointAction(false)}>Capture DISPOSITION pair</button><button disabled={busy||!checkpoint} onClick={()=>void checkpointAction(true)}>Restore DISPOSITION pair</button></div><p>{checkpoint?`Captured ${programLabel(checkpoint.a.program)} / ${programLabel(checkpoint.b.program)} at prefixes ${checkpoint.a.prefix} / ${checkpoint.b.prefix}.`:'No pair checkpoint captured.'} Both native saves authenticate before replacement.</p>{checkpointError&&<p role="alert">{checkpointError}</p>}
 {report&&<><table><thead><tr><th>Branch</th><th>Program</th><th>Prefix</th><th>Constitution</th></tr></thead><tbody>{([report.a,report.b] as const).map((s,i)=><tr key={i}><td>{i===0?'A':'B'}</td><td>{programLabel(s.program)}</td><td>{s.prefix}</td><td>{s.constitution}</td></tr>)}</tbody></table><p>Mechanism projection equal: {String(report.mechanismProjectionEqual)} · State equal: {String(report.stateEqual)}</p><p>{report.randomPolicy}</p><details><summary>Exact DISPOSITION comparison</summary><pre className="exact" data-disposition-pair>{JSON.stringify(report,null,2)}</pre></details></>}
 <p>30 declared contrasts; initial reports and bounded native continuation tested. One constitutional pair has bounded browser pause, restore and continuation evidence. Full-prefix comparison, broader browser coverage and causal factor accounting remain unqualified.</p></section>;
}
