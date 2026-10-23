import {useEffect,useRef,useState} from 'react';
import {DispositionPagedPairWorkerClient as Client} from './dispositionPagedPairWorkerClient';
import type {DispositionPagedPair,DispositionBranch} from './dispositionPagedPair';
import type {DispositionPairCheckpoint} from './dispositionPairCheckpoint';
import type {DispositionTextSelector} from './dispositionPagedAdapter';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
import {DISPOSITION_CONTRASTS} from './dispositionComparison';
import {DispositionPagedDiagnostics} from './DispositionPagedDiagnostics';

type View=ReturnType<DispositionPagedPair['summary']>;
type Page=ReturnType<DispositionPagedPair['textPage']>;
type Envelope=ReturnType<DispositionPagedPair['diagnostic']>;
export function DispositionPagedPairInspector({active=true}:{active?:boolean}){
 const client=useRef<Client>(),alive=useRef(true),lock=useRef(false),stop=useRef(false);
 const [view,setView]=useState<View>(),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [contrast,setContrast]=useState('model/0/13'),[branch,setBranch]=useState<DispositionBranch>('a');
 const [checkpoint,setCheckpoint]=useState<DispositionPairCheckpoint>(),[diagnostic,setDiagnostic]=useState<Envelope>(),[page,setPage]=useState<{branch:DispositionBranch;value:Page}>();
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;stop.current=true;client.current?.dispose();};},[]);
 useEffect(()=>{if(!active)stop.current=true;},[active]);
 async function execute(fn:()=>Promise<void>){if(lock.current)return;lock.current=true;setBusy(true);setError('');try{await fn();}catch(e){if(alive.current)setError(String(e));}finally{lock.current=false;if(alive.current){if(client.current)setView(client.current.summary());setBusy(false);}}}
 function install(c:Client,fresh=false){if(!alive.current){c.dispose();return;}client.current?.dispose();client.current=c;setView(c.summary());if(fresh){setDiagnostic(undefined);setPage(undefined);}}
 function selectBranch(next:DispositionBranch){setBranch(next);setDiagnostic(undefined);setPage(undefined);}
 async function advance(which:DispositionBranch|'both',all=false){stop.current=false;await execute(async()=>{do{if(!client.current||!await client.current.advance(which)||!alive.current)break;setView(client.current.summary());await new Promise(resolve=>setTimeout(resolve,0));}while(all&&!stop.current);});}
 async function load(sourceBranch:DispositionBranch,revision:string,selector:DispositionTextSelector,offset=0){await execute(async()=>{const value=await client.current!.textPage(sourceBranch,revision,selector,offset,4096);if(alive.current){if(sourceBranch!==branch){setBranch(sourceBranch);setDiagnostic(undefined);}setPage({branch:sourceBranch,value});}});}
 async function loadDiagnostic(revision:string,selection:DispositionDiagnosticSelection){await execute(async()=>{const next=await client.current!.diagnostic(branch,revision,selection);if(alive.current)setDiagnostic(next);});}
 const blocked=busy||!view||!!view.failure,summary=view?.[branch],stale=!!page&&page.value.saveHash!==view?.[page.branch].saveHash;
 return <section className="card" aria-label="Paged paired inspection" data-paged-pair>
 <h2>Paired native inspection</h2><p>Create two original programs from a declared contrast. Branch inspection is researcher-only; readable field equality does not establish observer knowledge or causal necessity.</p>
 <label>Paired contrast<select disabled={busy} value={contrast} onChange={e=>setContrast(e.target.value)}>{DISPOSITION_CONTRASTS.map(c=><option key={c.id} value={c.id}>{c.id} · {c.a} versus {c.b} · {c.changed}</option>)}</select></label>
 <div className="button-row"><button disabled={busy} onClick={()=>void execute(async()=>install(await Client.create(contrast),true))}>Create paged pair</button><button disabled={blocked||!view?.comparison.aligned||view.a.complete} onClick={()=>void advance('both')}>Step both branches</button><button disabled={blocked||!view?.comparison.aligned||view.a.complete} onClick={()=>void advance('both',true)}>Run both branches</button><button disabled={!busy} onClick={()=>{stop.current=true;}}>Pause paired run</button>
 {(['a','b'] as const).map(b=><button key={b} disabled={blocked||view?.[b].complete} onClick={()=>void advance(b)}>Step branch {b.toUpperCase()}</button>)}</div>
 <p role="status" data-pair-status>{view?`Pair A${view.a.prefix} / B${view.b.prefix}`:'No pair created'} · {busy?'Working':view?.failure?'Failed':view?.a.complete&&view.b.complete?'Complete':'Ready'}</p><p>Pause finishes the current paired advancement. Unequal prefixes withhold comparisons until aligned.</p>
 {error&&<p role="alert">{error}</p>}{view?.failure&&<p role="alert">Last published comparison retained after failure: {view.failure}. Restore a checkpoint or create a pair before further inspection.</p>}
 <button disabled={blocked} onClick={()=>void execute(async()=>{const next=await client.current!.checkpoint();if(alive.current)setCheckpoint(next);})}>Capture paired checkpoint</button><button disabled={busy||!checkpoint} onClick={()=>void execute(async()=>install(await Client.restore(checkpoint!)))}>Restore paired checkpoint</button><p data-pair-checkpoint>{checkpoint?`Captured ${checkpoint.comparison}: A${checkpoint.a.prefix} / B${checkpoint.b.prefix}.`:'No paired checkpoint captured.'}</p>
 {view&&<><p>{view.comparison.alignment}</p><p>{view.comparison.fieldEquality}</p><p>State equality: {String(view.comparison.stateEqual)} · mechanism projection equality: {String(view.comparison.mechanismProjectionEqual)}</p>
 <table style={{tableLayout:'fixed',overflowWrap:'anywhere'}}><caption>Aligned stored-field comparison</caption><thead><tr><th>Root / path</th><th>A present</th><th>B present</th><th>Readable equality</th><th>Exact source</th></tr></thead><tbody>{view.comparison.fields.map(f=><tr key={f.path}><td>{f.root} / {f.path}</td><td>{String(f.aPresent)}</td><td>{String(f.bPresent)}</td><td>{String(f.equal)}</td><td>{(['a','b'] as const).map(b=>{const source=b==='a'?f.aSource:f.bSource;return source?<button key={b} disabled={blocked} onClick={()=>void load(b,source.saveHash,source.selector)}>Open {b.toUpperCase()} root {f.root}</button>:<span key={b}>{b.toUpperCase()} absent </span>;})}</td></tr>)}</tbody></table>
 <details><summary>Exact comparison metadata</summary><pre className="exact" data-pair-comparison>{JSON.stringify(view.comparison,null,2)}</pre></details>
 <label>Inspected pair branch<select disabled={busy} value={branch} onChange={e=>selectBranch(e.target.value as DispositionBranch)}><option value="a">A · {view.a.program}</option><option value="b">B · {view.b.program}</option></select></label>
 <p data-pair-branch>Branch {branch.toUpperCase()} · {summary!.program} · prefix {summary!.prefix}</p>
 <DispositionPagedDiagnostics key={branch} summary={summary!} busy={blocked} envelope={diagnostic} onRequest={(revision,selection)=>void loadDiagnostic(revision,selection)} onText={(revision,selection)=>void load(branch,revision,selection)}/>
 {page&&<section aria-label="Paired exact source"><h3>Exact source · branch {page.branch.toUpperCase()}</h3><code data-pair-page-revision>{page.value.saveHash}</code><pre className="exact" data-pair-page-selection>{JSON.stringify(page.value.selector)}</pre><p data-pair-page-range>Offset {page.value.offset} · {page.value.text.length} units · total {page.value.totalCodeUnits}</p><p>Offsets count UTF-16 code units; pages contain at most4096 units.</p>{stale&&<p role="status">Historical paired page retained. Restore its checkpoint or open a current source before continuing pages.</p>}<button disabled={blocked||stale||page.value.offset===0} onClick={()=>void load(page.branch,page.value.saveHash,page.value.selector,Math.max(0,page.value.offset-4096))}>Previous paired page</button><button disabled={blocked||stale||page.value.nextOffset===null} onClick={()=>void load(page.branch,page.value.saveHash,page.value.selector,page.value.nextOffset!)}>Next paired page</button><pre className="exact" data-pair-page-text>{page.value.text}</pre></section>}
 <div data-pair-hashes>{(['a','b'] as const).map(b=><div key={b}><h3>Branch {b.toUpperCase()} identities</h3>{(['modelHash','runHash','stateHash','saveHash','projectionHash'] as const).map(k=><div className="hash" key={k}><span>{k}</span><code>{view[b][k]}</code></div>)}</div>)}</div></>}
 </section>;
}
