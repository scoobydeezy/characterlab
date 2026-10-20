import {useEffect, useRef, useState} from 'react';
import {GeneralWorkerClient} from './generalWorkerClient';
import {compareGeneralSnapshots, GENERAL_COMPARISONS} from './generalComparison';
import catalog from './generalComparisonCatalog.json';
import {generalComparisonHistory,retainGeneralComparison} from './generalComparisonHistory';
import {captureGeneralPair,restoreGeneralPair,type GeneralPairCheckpoint} from './generalPairCheckpoint';

type Report = ReturnType<typeof compareGeneralSnapshots>;
export function GeneralComparisonPanel({active=true}:{active?:boolean}) {
  const pair = useRef<[GeneralWorkerClient, GeneralWorkerClient]>();
  const alive = useRef(true), locked = useRef(false);
  const stop=useRef(false),retained=useRef<Report[]>([]);
  const [history,setHistory]=useState<Report[]>([]),[viewed,setViewed]=useState<number>();
  const [checkpoint,setCheckpoint]=useState<GeneralPairCheckpoint>(),[checkpointError,setCheckpointError]=useState('');
  function remember(next:Report,mode:'append'|'reset'|'restore'='append'){
    const rows=retainGeneralComparison(retained.current,next,mode);retained.current=rows;setHistory(rows);setViewed(undefined);setReport(next);
  }
  const [selected, setSelected] = useState(GENERAL_COMPARISONS[0].id);
  const [loaded, setLoaded] = useState(''), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [report, setReport] = useState<Report>();
  const [complete, setComplete] = useState(false);
  const spec = GENERAL_COMPARISONS.find(s => s.id === selected)!;
  useEffect(() => {alive.current = true; return () => {alive.current = false;stop.current=true; pair.current?.forEach(c => c.dispose());};}, []);
  useEffect(()=>{if(!active)stop.current=true;},[active]);
  async function execute(action:'create'|'step'|'run') {
    if (locked.current) return;
    const fresh=action==='create';
    locked.current = true;stop.current=false; setBusy(true); setError('');
    const created: GeneralWorkerClient[] = [];
    try {
      if (fresh) {
        for (const recipe of [spec.control, spec.candidate]) {
          const client = await GeneralWorkerClient.create(recipe, catalog.seed); created.push(client);
          if (!alive.current) return;
        }
        pair.current?.forEach(c => c.dispose());
        pair.current = [created[0], created[1]]; setLoaded(spec.id);
        remember(compareGeneralSnapshots(spec.id,created[0].snapshot(),created[1].snapshot()),'reset');
      } else {
        if (!pair.current || loaded !== selected) throw Error('Create the selected pair first');
      }
      const [a, b] = pair.current!;
      for(let i=0;i<(action==='step'?1:action==='run'?100:0);i++){
        if(stop.current||(a.snapshot().complete&&b.snapshot().complete))break;
        for(const client of [a,b]){if(!client.snapshot().complete)await client.advance();if(!alive.current)return;}
        remember(compareGeneralSnapshots(spec.id,a.snapshot(),b.snapshot()));
      }
      setComplete(a.snapshot().complete && b.snapshot().complete);
    } catch (e) {
      if (alive.current) {setError(String(e)); setLoaded('');}
      pair.current?.forEach(c => c.dispose()); pair.current = undefined;
    } finally {
      if (!alive.current || !pair.current) created.forEach(c => c.dispose());
      locked.current = false; if (alive.current) setBusy(false);
    }
  }
  async function checkpointAction(restore:boolean){
    if(locked.current)return;locked.current=true;setBusy(true);setCheckpointError('');
    let fresh:[GeneralWorkerClient,GeneralWorkerClient]|undefined;
    try{
      if(!restore){if(!pair.current||loaded!==selected)throw Error('Create selected pair first');const saved=await captureGeneralPair(loaded,pair.current);if(alive.current)setCheckpoint(saved);}
      else{
        if(!checkpoint)throw Error('Capture a pair first');
        fresh=await restoreGeneralPair(checkpoint,c=>GeneralWorkerClient.restore(c),c=>c.dispose());
        const next=compareGeneralSnapshots(checkpoint.comparison,fresh[0].snapshot(),fresh[1].snapshot());if(!alive.current)return;
        remember(next,'restore');pair.current?.forEach(c=>c.dispose());pair.current=fresh;fresh=undefined;
        setSelected(checkpoint.comparison);setLoaded(checkpoint.comparison);setComplete(pair.current.every(c=>c.snapshot().complete));setError('');
      }
    }catch(e){if(alive.current)setCheckpointError(String(e));}
    finally{fresh?.forEach(c=>c.dispose());locked.current=false;if(alive.current)setBusy(false);}
  }
  const divergence=generalComparisonHistory(history),historical=history.find(r=>r.control.prefix===viewed);
  const canContinue=!busy&&loaded===selected&&!complete&&!error;
  return <section className="card" id="general-comparison">
    <h2>Controlled attention comparison</h2>
    <p>Compare two separate runs using the retained intervention and original frozen seed. The graph run above stays independent.</p>
    <label>Declared attention comparison<select value={selected} disabled={busy} onChange={e => {setSelected(e.target.value); setReport(undefined); setError('');}}>{GENERAL_COMPARISONS.map(s => <option key={s.id} value={s.id}>{s.id}: {s.control} → {s.candidate}</option>)}</select></label>
    <p>Declared change: {spec.changed.join(', ')}</p><p>{spec.alignment}</p>
    <div className="button-row"><button disabled={busy} onClick={() => void execute('create')}>Create comparison pair</button><button disabled={!canContinue} onClick={() => void execute('step')}>Step comparison pair</button><button disabled={!canContinue} onClick={()=>void execute('run')}>Run comparison pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause comparison pair</button></div>
    <p>Pause finishes the current paired step. Leaving Compare pauses at that boundary.</p>
    <div className="button-row"><button disabled={busy||loaded!==selected||!report} onClick={()=>void checkpointAction(false)}>Capture comparison pair</button><button disabled={busy||!checkpoint} onClick={()=>void checkpointAction(true)}>Restore comparison pair</button></div>
    <p>{checkpoint?`Captured ${checkpoint.comparison} at paired prefix ${checkpoint.a.prefix}.`:'No pair checkpoint captured.'} Both native saves authenticate before replacement.</p>{checkpointError&&<p role="alert">{checkpointError}</p>}
    <p role="status">{busy ? 'Working on comparison' : error ? 'Comparison failed; recreate the pair' : report ? `Comparison ${report.control.prefix} / ${report.candidate.prefix} · instants ${report.control.clock} / ${report.candidate.clock} · ${report.status}${complete ? ' · Complete' : ''}` : 'Create a pair to inspect its actual records'}</p>
    {error && <p role="alert">{error}</p>}
    {report && <><p>{report.scope}</p><p>Control: {report.control.recipe} · Candidate: {report.candidate.recipe}</p>
      {report.status === 'ALIGNED_COMMITTED_INSTANT' && <>
        <p>{report.fields.filter(f => f.changed).length} changed state paths of {report.fields.length}; {report.graph.status === 'IDENTITY_ALIGNED' ? `${report.graph.cells.filter(c => c.changed).length} changed association cells of ${report.graph.cells.length}` : 'association graph unavailable'}.</p>
        <p>Event slots: {report.events.filter(e => e.status === 'UNIQUE_STAGE_SLOT').length} unique, {report.events.filter(e => e.status === 'MISSING_SIDE').length} missing a side, {report.events.filter(e => e.status === 'AMBIGUOUS_STAGE_SLOT').length} ambiguous. Missing values are not zero.</p>
      </>}
      <details><summary>Exact comparison records and identities</summary><pre className="exact" data-general-comparison-report>{JSON.stringify(report, null, 2)}</pre></details>
    </>}
    {report&&loaded===selected&&<section aria-label="Attention comparison history"><h3>Retained comparison history</h3>
      <p>Observed prefixes: {divergence.observedPrefixes.join(', ')}. Missing prefixes: {divergence.missingPrefixes.join(', ')||'none'}.</p>
      <p>First exact state difference: {divergence.firstStateDifference?.prefix??'none observed'}; earliest proven: {String(divergence.firstStateDifference?.earliestProven??false)}. First unique-stage output difference: {divergence.firstOutputDifference?.prefix??'none observed'}; earliest proven: {String(divergence.firstOutputDifference?.earliestProven??false)}.</p>
      <p>{divergence.scope}</p><label>Inspect retained attention pair prefix<select value={viewed??''} onChange={e=>setViewed(e.target.value===''?undefined:Number(e.target.value))}><option value="">Choose a retained prefix</option>{history.map(r=><option key={r.control.prefix} value={r.control.prefix}>{r.control.prefix}</option>)}</select></label>
      <p>Historical inspection does not move either branch. Restore discards observations beyond the restored prefix.</p>
      {historical&&<details open><summary>Historical attention comparison at prefix {historical.control.prefix}</summary><pre className="exact" data-general-historical>{JSON.stringify(historical,null,2)}</pre></details>}
      <details><summary>Exact attention divergence history</summary><pre className="exact" data-general-divergence>{JSON.stringify(divergence,null,2)}</pre></details>
    </section>}
    <p className="caption">36 retained declarations; current browser coverage is tracked separately. Exact differences describe these executions and do not establish psychological necessity or complete Campaign4 qualification.</p>
  </section>;
}
