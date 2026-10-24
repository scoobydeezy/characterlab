import {RecordedStateInspector} from './RecordedStateInspector';
import {AffectTimelineView} from './AffectTimelineView';
import {AffectArchitectureView} from './AffectArchitectureView';
import {AffectBeliefStateView} from './AffectBeliefStateView';
import {useEffect,useRef,useState} from 'react';
import {AffectPairSession,type AffectPairCheckpoint,type AffectPairBranch} from './affectPairSession';
import {AffectWorkerClient} from './affectWorkerClient';
import {AFFECT_CONTRASTS,summarizeAffectComparison,affectObligationPairId} from './affectComparison';
import {AffectAppraisalComparisonPanel} from './AffectAppraisalComparisonPanel';
import {AffectFactorView} from './AffectFactorView';
import {AffectExplanationView} from './AffectExplanationView';
import {PreparedExport} from './PreparedExport';
const modes=['Character','Experiment','Reasoning','Timeline','Compare','Architecture'] as const;
const factory={create:(program:string)=>AffectWorkerClient.create(program),restore:AffectWorkerClient.restore};
export function AffectPairedWorkbench({active}:{active:boolean}){
 const session=useRef<AffectPairSession>(),lock=useRef(false),stop=useRef(false),alive=useRef(true);
 const [id,setId]=useState('hidden-world'),[view,setView]=useState<ReturnType<AffectPairSession['snapshot']>>(),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [mode,setMode]=useState<typeof modes[number]>('Experiment'),[branch,setBranch]=useState<AffectPairBranch>('a'),[eventId,setEventId]=useState(''),[checkpoint,setCheckpoint]=useState<AffectPairCheckpoint>(),[text,setText]=useState('');
 const [obligationSeed,setObligationSeed]=useState(0),[obligationPosition,setObligationPosition]=useState(1);
 const obligationId=affectObligationPairId(obligationSeed,obligationPosition);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;session.current?.dispose();};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(action:()=>Promise<void>){if(lock.current)return;lock.current=true;stop.current=false;setBusy(true);setError('');try{await action();}catch(e){if(alive.current)setError(String(e));}finally{if(alive.current){if(session.current)setView(session.current.snapshot());setBusy(false);}lock.current=false;}}
 async function install(next:AffectPairSession){if(!alive.current){next.dispose();return;}session.current?.dispose();session.current=next;setEventId('');}
 async function advance(which:AffectPairBranch|'both',all=false){await execute(async()=>{do{if(!session.current||!await session.current.advance(which))break;if(alive.current)setView(session.current.snapshot());await new Promise(r=>setTimeout(r,0));}while(all&&!stop.current);});}
 const report=view?.comparison,snapshot=report?.[branch],failed=!!view?.failure;
 return <section className="card" aria-label="Persistent AFFECT paired experiment"><h2>Retained AFFECT branches</h2><p>This pair is independent of the standalone run above. Both branches retain their original frozen program, seed and committed history. All views below inspect the selected branch revision.</p>
 <fieldset><legend>Fresh obligation-strength comparison</legend><label>Frozen obligation seed<select disabled={busy} value={obligationSeed} onChange={e=>setObligationSeed(Number(e.target.value))}>{Array.from({length:8},(_,seed)=><option key={seed} value={seed}>{seed}</option>)}</select></label><label>Branch B obligation contribution<input type="range" min="0" max="1" step="1" value={obligationPosition} aria-valuetext={obligationPosition===0?'1/10, same as branch A':'10/1'} disabled={busy} onChange={e=>setObligationPosition(Number(e.target.value))}/></label><p>Draft: branch A 1/10; branch B {obligationPosition===0?'1/10':'10/1'}. These are two original settings, with no intermediate values.</p><p>Changing the draft does not change a committed run. Creating the comparison starts fresh original branches with identical initial state, input calendar and seed, changing only the competing obligation contribution. This is a goal setting, not a personality trait.</p><button disabled={busy||!obligationId} onClick={()=>void execute(async()=>{if(!obligationId)throw Error('No differing original setting');await install(await AffectPairSession.create(obligationId,factory));setId(obligationId);setCheckpoint(undefined);setText('');})}>Create obligation comparison from draft</button>{!obligationId&&<p>Both draft settings are 1/10. Select 10/1 to create the declared contrast.</p>}</fieldset>
 <label>Retained AFFECT contrast<select disabled={busy} value={id} onChange={e=>setId(e.target.value)}>{AFFECT_CONTRASTS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute(async()=>{await install(await AffectPairSession.create(id,factory));setCheckpoint(undefined);setText('');})}>Create retained AFFECT pair</button><button disabled={busy||failed||!report?.aligned||!!(report.a.complete&&report.b.complete)} onClick={()=>void advance('both')}>Step retained AFFECT pair</button><button disabled={busy||failed||!report?.aligned||!!(report.a.complete&&report.b.complete)} onClick={()=>void advance('both',true)}>Run retained AFFECT pair</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause retained AFFECT pair</button>{(['a','b'] as const).map(b=><button key={b} disabled={busy||failed||!report||report[b].complete} onClick={()=>void advance(b)}>Step retained branch {b.toUpperCase()}</button>)}</div>
 <p role="status">{report?`Retained A${report.a.prefix} / B${report.b.prefix} · ${busy?'Working':failed?'Failed':report.a.complete&&report.b.complete?'Complete':'Ready'}`:'No retained pair created.'}</p><p>Pause finishes the current requested advancement. After a partial failure, the last published comparison remains historical; restore or create a new pair before continuing.</p>{error&&<p role="alert">{error}</p>}
 <div className="button-row"><button disabled={busy||failed||!report} onClick={()=>void execute(async()=>{setCheckpoint(await session.current!.checkpoint());})}>Capture retained AFFECT checkpoint</button><button disabled={busy||!checkpoint} onClick={()=>void execute(async()=>{await install(await AffectPairSession.restore(checkpoint!,factory));setId(checkpoint!.contrast);})}>Restore retained AFFECT checkpoint</button></div><p>{checkpoint?`Captured A${checkpoint.a.prefix} / B${checkpoint.b.prefix}.`:'No paired checkpoint captured.'}</p>
 <nav aria-label="Retained AFFECT modes" className="button-row">{modes.map(m=><button key={m} onClick={()=>{stop.current=true;setMode(m);}}>{m}</button>)}</nav>
 <label>Retained AFFECT branch<select value={branch} onChange={e=>{setBranch(e.target.value as AffectPairBranch);setEventId('');}}><option value="a">Branch A</option><option value="b">Branch B</option></select></label>
 {snapshot&&<><p>Branch {branch.toUpperCase()} · {snapshot.program} · prefix {snapshot.prefix}</p><div data-affect-retained-hashes>{(['modelHash','runHash','stateHash','saveHash'] as const).map(k=><div className="hash" key={k}><span>{k}</span><code>{snapshot[k]}</code></div>)}</div>
 {mode==='Character'&&<><RecordedStateInspector key={snapshot.runHash} fields={snapshot.fields} prefix={snapshot.prefix} saveHash={snapshot.saveHash}/><AffectBeliefStateView key={snapshot.saveHash} snapshot={snapshot} onInspect={id=>{setEventId(id);setMode('Timeline');}}/><AffectFactorView cards={snapshot.explanations}/><AffectExplanationView cards={snapshot.explanations}/></>}
 {mode==='Experiment'&&<p>{report?.contrast.changed} Fixture changes create fresh original programs; runtime interventions remain unavailable.</p>}
 {mode==='Reasoning'&&<AffectExplanationView cards={snapshot.explanations} history trace={{events:snapshot.timeline,runHash:snapshot.runHash,saveHash:snapshot.saveHash,modelHash:snapshot.modelHash}}/>}
 {mode==='Timeline'&&<AffectTimelineView snapshot={snapshot} selected={eventId} onSelect={setEventId} retained/>}
 {mode==='Compare'&&report&&<AffectAppraisalComparisonPanel key={report.a.saveHash+report.b.saveHash} comparison={report}/>}
 {mode==='Architecture'&&<AffectArchitectureView key={snapshot.saveHash} snapshot={snapshot} onInspect={id=>{setEventId(id);setMode('Timeline');}}/>}
 <button disabled={busy||failed} onClick={()=>setText(JSON.stringify(summarizeAffectComparison(report!),null,2))}>Prepare retained AFFECT summary</button></>}
 {text&&<PreparedExport text={text} label="Retained AFFECT summary preview" filename="affect-pair-summary.json"/>}</section>;
}
