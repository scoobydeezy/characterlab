import {useMemo,useState} from 'react';
import {DIAGNOSTIC_SEARCH_VERSION,indexDiagnosticState,searchDiagnosticFields} from './diagnosticSearch';
import './diagnosticInspector.css';
export function DiagnosticStateInspector({state,identity,onOpportunity}:{state:unknown;identity:{runHash:string;modelHash:string;seamVersion:string;prefix:number;stateHash:string};onOpportunity?:(at:number)=>void}){
 const [query,setQuery]=useState(''),[selected,setSelected]=useState('');
 const index=useMemo(()=>indexDiagnosticState(state),[state]);
 const results=useMemo(()=>searchDiagnosticFields(index,query),[index,query]);
 const field=index.fields.find(f=>f.path===selected);
 const row=field?.path.match(/^\/rows\/(0|[1-9]\d*)(?:\/|$)/);
 const rows=(state as {rows?:{at:number}[]})?.rows;
 const at=row&&Array.isArray(rows)?rows[Number(row[1])]?.at:undefined;
 return <section className="diagnostic-inspector" aria-label="Search exact research state">
  <h3>Search exact research state</h3>
  <p>Research diagnostics include world truth and RNG records. Search results are not character knowledge or evidence of causal necessity. Containers show counts; leaf values remain exact.</p>
  <label>Find field path or value<input type="search" value={query} maxLength={1000} onChange={e=>setQuery(e.target.value)}/></label>
  {index.error?<p role="alert">{index.error}</p>:<>
   <p aria-live="polite">{results.total} matching fields · showing {results.matches.length}{results.limited?' · result limit reached; refine the search':''}</p>
   <ul className="diagnostic-results">{results.matches.map(f=><li key={f.path}><button aria-pressed={selected===f.path} onClick={()=>setSelected(f.path)}><code>{f.path||'(root)'}</code><span>{f.exact.length>160?f.exact.slice(0,160)+'… (preview; select for exact value)':f.exact}</span></button></li>)}</ul>
   {field&&<div data-diagnostic-selection><h3>Selected field</h3><p>Canonical JSON pointer: <code>{field.path||'(root: empty pointer)'}</code> · {field.kind}</p><pre className="exact">{field.exact}</pre><pre className="exact">{JSON.stringify({...identity,path:field.path,renderer:DIAGNOSTIC_SEARCH_VERSION,authority:'diagnostic projection',epistemicScope:'research-only; mixed character evidence and world diagnostics'},null,2)}</pre>{onOpportunity&&Number.isInteger(at)&&<button onClick={()=>onOpportunity(at!)}>Inspect opportunity {at} in Timeline</button>}</div>}
  </>}
 </section>;
}
