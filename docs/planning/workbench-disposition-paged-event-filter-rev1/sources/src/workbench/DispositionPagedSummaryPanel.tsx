import {useEffect,useState} from 'react';
import type {DispositionPagedPair} from './dispositionPagedPair';
import {dispositionPagedComparisonSummary} from './dispositionPagedComparisonSummary';

export function DispositionPagedSummaryPanel({view,disabled}:{view:ReturnType<DispositionPagedPair['summary']>;disabled:boolean}){
 const [prepared,setPrepared]=useState<ReturnType<typeof dispositionPagedComparisonSummary>>(),[url,setUrl]=useState(''),[status,setStatus]=useState('');
 useEffect(()=>{if(!prepared){setUrl('');return;}const next=URL.createObjectURL(new Blob([prepared.text],{type:'text/plain;charset=utf-8'}));setUrl(next);return()=>URL.revokeObjectURL(next);},[prepared]);
 const historical=prepared&&(prepared.artifact.comparison.a.saveHash!==view.a.saveHash||prepared.artifact.comparison.b.saveHash!==view.b.saveHash);
 function prepare(){try{setPrepared(dispositionPagedComparisonSummary(view));setStatus('Summary prepared.');}catch(e){setStatus(String(e));}}
 return <section aria-label="Paged comparison summary"><h3>Export comparison summary</h3>
 <p>Portable researcher report with exact identities, controlled changes, choices, scalar history and state-page references. Checkpoints and separate diagnostic reports retain their own roles.</p>
 <button disabled={disabled} onClick={prepare}>Prepare paged comparison summary</button>
 {prepared&&<><p data-paged-summary-revision>{historical?'Historical summary retained; prepare again for the current pair.':'Summary matches the current pair.'}</p>
 <button onClick={()=>void navigator.clipboard.writeText(prepared.text).then(()=>setStatus('Summary copied exactly.'),e=>setStatus(`Copy failed: ${String(e)}`))}>Copy paged comparison summary</button>
 {url&&<a download="characterlab-disposition-paged-comparison.txt" href={url}>Download paged comparison summary</a>}
 <details><summary>Prepared comparison summary</summary><pre className="exact" data-paged-comparison-summary>{prepared.text}</pre></details></>}
 <p role="status">{status}</p></section>;
}
