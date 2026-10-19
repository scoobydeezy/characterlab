import {useMemo,useState} from 'react';
import {DIAGNOSTIC_SEARCH_VERSION,indexDiagnosticState,compareDiagnosticIndexes,filterDiagnosticChanges,type DiagnosticIndex} from './diagnosticSearch';
import './diagnosticInspector.css';
type Identity={runHash:string;modelHash:string;seamVersion:string;prefix:number;stateHash:string};
export function DiagnosticStateInspector({state,identity,onOpportunity}:{state:unknown;identity:Identity;onOpportunity?:(at:number)=>void}){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState(''),[section,setSection]=useState(''),[changedOnly,setChangedOnly]=useState(false);
 const [baseline,setBaseline]=useState<{index:DiagnosticIndex;identity:Identity}>();
 const index=useMemo(()=>indexDiagnosticState(state),[state]);
 const compatible=baseline&&baseline.identity.runHash===identity.runHash&&baseline.identity.modelHash===identity.modelHash&&baseline.identity.seamVersion===identity.seamVersion;
 const rows=useMemo(()=>index.error?[]:compareDiagnosticIndexes(index,compatible?baseline.index:undefined),[index,baseline,compatible]);
 const results=useMemo(()=>filterDiagnosticChanges(rows,query,section,!!compatible&&changedOnly),[rows,query,section,compatible,changedOnly]);
 const sections=[...new Set(rows.filter(r=>r.path).map(r=>'/'+r.path.split('/')[1]))];
 const field=rows.find(f=>f.path===selected);
 const row=field?.after?.path.match(/^\/rows\/(0|[1-9]\d*)(?:\/|$)/);
 const stateRows=(state as {rows?:{at:number}[]})?.rows;
 const at=row&&Array.isArray(stateRows)?stateRows[Number(row[1])]?.at:undefined;
 if(state===undefined)return <p>Waiting for a committed state to inspect.</p>;
 return <section className="diagnostic-inspector" aria-label="Search exact research state">
  <h3>Search exact research state</h3>
  <p>Research diagnostics include world truth and RNG records. Search results are not character knowledge or evidence of causal necessity. Containers show counts; leaf values remain exact. Changed containers may have equal counts but different descendants.</p>
  <div className="button-row"><button disabled={!!index.error} onClick={()=>setBaseline({index,identity:{...identity}})}>Pin current diagnostic baseline</button><button disabled={!baseline} onClick={()=>{setBaseline(undefined);setChangedOnly(false);}}>Clear diagnostic baseline</button></div>
  <p>{compatible?`Baseline prefix ${baseline.identity.prefix}; current prefix ${identity.prefix}.`:baseline?'Baseline belongs to another run or contract; pin this run to compare.':'No diagnostic baseline pinned.'} Baseline stays pinned while this inspector is open. Array paths compare positions, not inferred object identity.</p>
  <label>State section<select value={section} onChange={e=>setSection(e.target.value)}><option value="">All state sections</option>{sections.map(s=><option key={s} value={s}>{s}</option>)}</select></label>
  <label><input type="checkbox" disabled={!compatible} checked={!!compatible&&changedOnly} onChange={e=>setChangedOnly(e.target.checked)}/>Show changed fields only</label>
  <label>Find field path or value<input type="search" value={query} maxLength={1000} onChange={e=>setQuery(e.target.value)}/></label>
  {index.error?<p role="alert">{index.error}</p>:<>
   <p aria-live="polite">{results.total} matching fields · showing {results.matches.length}{results.limited?' · result limit reached; refine the search':''}</p>
   <ul className="diagnostic-results">{results.matches.map(f=>{const exact=f.after?.exact??'(missing in current state)';return <li key={f.path}><button aria-pressed={selected===f.path} onClick={()=>setSelected(f.path)}><code>{f.path||'(root)'}</code><span>{f.status==='current'?'':f.status+' · '}{exact.length>160?exact.slice(0,160)+'… (preview; select for exact value)':exact}</span></button></li>;})}</ul>
   {field&&<div data-diagnostic-selection><h3>Selected field</h3><p>Canonical JSON pointer: <code>{field.path||'(root: empty pointer)'}</code> · {field.after?.kind??field.before?.kind} · {field.status}</p>
    {compatible&&<><h3>Baseline value</h3><pre className="exact" data-diagnostic-before>{field.before?.exact??'(missing in baseline)'}</pre></>}
    <h3>Current value</h3><pre className="exact" data-diagnostic-after>{field.after?.exact??'(missing in current state)'}</pre>
    <pre className="exact" data-diagnostic-identity>{JSON.stringify({current:identity,...(compatible?{baseline:baseline.identity}:{}),path:field.path,renderer:DIAGNOSTIC_SEARCH_VERSION,authority:'diagnostic projection',epistemicScope:'research-only; mixed character evidence and world diagnostics'},null,2)}</pre>{onOpportunity&&Number.isInteger(at)&&<button onClick={()=>onOpportunity(at!)}>Inspect opportunity {at} in Timeline</button>}</div>}
  </>}
 </section>;
}
