import {useEffect,useRef,useState} from 'react';
import {BioWorkerClient} from './bioWorkerClient';
import {BIO_COMPARISONS,compareBioSnapshots} from './bioComparison';
type Report=Awaited<ReturnType<typeof compareBioSnapshots>>;
export function BioComparisonPanel({active=true}:{active?:boolean}){
 const clients=useRef<[BioWorkerClient,BioWorkerClient]>(),alive=useRef(true),locked=useRef(false),stop=useRef(false);
 const [selected,setSelected]=useState(BIO_COMPARISONS[0].id),[loaded,setLoaded]=useState('');
 const [report,setReport]=useState<Report>(),[busy,setBusy]=useState(false),[error,setError]=useState(''),[complete,setComplete]=useState(false);
 const spec=BIO_COMPARISONS.find(s=>s.id===selected)!;
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;clients.current?.forEach(c=>c.dispose());};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:'create'|'probe'|'step'){
  if(locked.current)return;locked.current=true;stop.current=false;setBusy(true);setError('');setReport(undefined);const fresh:BioWorkerClient[]=[];
  try{
   if(action!=='step'){
    for(const name of [spec.control,spec.candidate]){fresh.push(await BioWorkerClient.create(name));if(!alive.current)return;}
    clients.current?.forEach(c=>c.dispose());clients.current=[fresh[0],fresh[1]];setLoaded(spec.id);
   }else if(!clients.current||loaded!==selected)throw Error('Create the selected BIO pair first');
   const pair=clients.current!;
   for(let i=0;i<(action==='probe'?5:action==='step'?1:0);i++){if(stop.current)break;for(const c of pair){await c.advance();if(!alive.current)return;}}
   const next=await compareBioSnapshots(spec.id,pair[0].snapshot(),pair[1].snapshot());
   if(alive.current){setReport(next);setComplete(pair.every(c=>c.snapshot().complete));}
  }catch(e){if(alive.current){setError(String(e));setLoaded('');}clients.current?.forEach(c=>c.dispose());clients.current=undefined;}
  finally{if(!alive.current||!clients.current)fresh.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
 }
 return <section className="card" id="bio-comparison"><h2>Controlled biography comparison</h2><p>Each pair uses independent component workers. The main BIO session remains separate. Creating a pair starts from its original empty history.</p>
 <label>BIO comparison<select value={selected} disabled={busy} onChange={e=>{setSelected(e.target.value);setReport(undefined);setError('');}}>{BIO_COMPARISONS.map(s=><option key={s.id} value={s.id}>{s.control} → {s.candidate} ({s.kind})</option>)}</select></label><p>{spec.changed}</p>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute('create')}>Create BIO pair</button><button disabled={busy} onClick={()=>void execute('probe')}>Run fresh BIO pair to shared probe</button><button disabled={busy||loaded!==selected||complete||!!error} onClick={()=>void execute('step')}>Step BIO pair</button></div>
 <p role="status">{busy?'Working on BIO comparison':error?'BIO comparison failed; recreate pair':report?`BIO pair ${report.control.prefix} / ${report.candidate.prefix} · ${report.status}`:'Create a pair to inspect its records'}</p>{error&&<p role="alert">{error}</p>}
 {report&&<><p>{report.alignment}</p><p>Same model: {String(report.identity.modelEqual)} · same run identity: {String(report.identity.runEqual)} · same saved bytes digest: {String(report.identity.saveEqual)}</p>
 {report.status==='ALIGNED_COMPONENT_PREFIX'&&<table><caption>Exact decision and history comparison (control / candidate)</caption><thead><tr><th>Step</th><th>Choice</th><th>Standing</th><th>Strength</th><th>Same display</th></tr></thead><tbody>{report.records.map(r=><tr key={r.ordinal}><td>{r.ordinal}</td><td>{r.choice.control} / {r.choice.candidate}</td><td>{r.modifiers.control.join(', ')} / {r.modifiers.candidate.join(', ')}</td><td>{r.strength.control} / {r.strength.candidate}</td><td>{String(r.displayEqual)}</td></tr>)}</tbody></table>}
 <p>{report.scope}</p><details><summary>Exact BIO comparison and RNG correspondence</summary><pre className="exact" data-bio-comparison>{JSON.stringify(report,null,2)}</pre></details></>}
 <p className="caption">19 declared instrument pairs. Browser and full-horizon coverage are qualified separately. No automatic reduction or general biography claim follows from an equal result.</p></section>;
}
