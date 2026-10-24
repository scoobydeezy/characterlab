import {useMemo,useState} from 'react';
import {searchRecordedState,type RecordedStateField} from './recordedStateSearch';
export function RecordedStateInspector({fields,prefix,saveHash}:{fields:readonly RecordedStateField[];prefix:number;saveHash:string}){
 const [query,setQuery]=useState(''),[root,setRoot]=useState('all'),[selected,setSelected]=useState(''),[page,setPage]=useState(0);
 const result=useMemo(()=>{try{return {rows:searchRecordedState(fields,query,root),error:''};}catch(e){return {rows:[],error:String(e)};}},[fields,query,root]);
 const roots=[...new Set(fields.map(f=>f.root))].sort(),pages=Math.max(1,Math.ceil(result.rows.length/25)),currentPage=Math.min(page,pages-1),visible=result.rows.slice(currentPage*25,(currentPage+1)*25),selection=fields.find(f=>f.path===selected);
 return <section className="card" aria-label="Search recorded state"><h2>Search recorded state</h2>
 <p>Current committed prefix {prefix}. These are exact stored-state records from the native snapshot, not derived chart coordinates or a claim of character knowledge. Search is a case-insensitive substring match across root, canonical path and exact value. Filters do not change state.</p>
 <div className="hash"><span>Selected revision save hash</span><code data-recorded-state-revision>{saveHash}</code></div>
 <label>Find recorded state<input value={query} onChange={e=>{setQuery(e.target.value);setPage(0);}}/></label>
 <label>Recorded state root<select value={root} onChange={e=>{setRoot(e.target.value);setPage(0);}}><option value="all">All roots</option>{!roots.includes(root)&&root!=='all'&&<option value={root}>{root} · absent at this revision</option>}{roots.map(r=><option key={r} value={r}>{r}</option>)}</select></label>
 {result.error&&<p role="alert">{result.error}</p>}<p role="status">{result.rows.length} of {fields.length} stored paths · page {currentPage+1} of {pages} · up to 25 results per page</p>
 {result.rows.length===0&&!result.error&&<p>No stored paths match these filters. This is not evidence of unused machinery.</p>}
 <div className="button-row"><button disabled={currentPage===0} onClick={()=>setPage(currentPage-1)}>Previous state results</button><button disabled={currentPage+1>=pages} onClick={()=>setPage(currentPage+1)}>Next state results</button><button onClick={()=>{setQuery('');setRoot('all');setPage(0);}}>Clear state filters</button></div>
 <ul>{visible.map((f,i)=><li key={f.path}><button onClick={()=>setSelected(f.path)}>Inspect stored root {f.root} · result {currentPage*25+i+1}</button><code style={{overflowWrap:'anywhere'}} data-recorded-state-result>{f.path}</code></li>)}</ul>
 {selected&&!selection&&<p>The selected path is absent from the current committed revision.</p>}
 {selection&&<section aria-label="Selected stored state"><h3>Selected stored state · root {selection.root}</h3>{!result.rows.some(f=>f.path===selection.path)&&<p>This selection does not match the active filters.</p>}<pre className="exact" data-recorded-state-path>{selection.path}</pre><pre className="exact" data-recorded-state-value>{selection.exact}</pre></section>}
 </section>;
}
