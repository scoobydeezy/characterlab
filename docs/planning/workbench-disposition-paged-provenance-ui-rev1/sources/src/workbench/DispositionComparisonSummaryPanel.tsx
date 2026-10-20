import {useEffect,useMemo,useRef,useState} from 'react';
import type {DispositionComparisonReport as Report} from './dispositionDivergenceHistory';
import {dispositionComparisonSummary} from './dispositionComparisonSummary';
export function DispositionComparisonSummaryPanel({current,history,busy}:{current:Report;history:readonly Report[];busy:boolean}){
 const [prepared,setPrepared]=useState(false),[status,setStatus]=useState('');
 const result=useMemo(()=>{try{return {summary:dispositionComparisonSummary(current,history)};}catch(e){return {error:String(e)};}},[current,history]);
 const latest=useRef(current);latest.current=current;
 useEffect(()=>{setPrepared(false);setStatus('');},[current,history]);
 async function copy(){
  const text=result.summary?.text,revision=current;if(!text)return;
  try{await navigator.clipboard.writeText(text);if(latest.current===revision)setStatus('Comparison summary copied.');}
  catch{if(latest.current===revision)setStatus('Clipboard unavailable. Select and copy the prepared text.');}
 }
 return <section aria-label="DISPOSITION comparison summary"><h3>Share the committed comparison</h3>
 <p>The summary preserves the declared contrast, exact branch identities, source input changes and retained divergence observations. It cannot restore a run.</p>
 {result.error&&<p role="alert">{result.error}</p>}
 <button disabled={busy||!result.summary} onClick={()=>setPrepared(true)}>Prepare DISPOSITION comparison summary</button>
 {prepared&&result.summary&&<><label>Prepared DISPOSITION comparison summary<textarea readOnly rows={10} value={result.summary.text}/></label>
 <button disabled={busy} onClick={()=>void copy()}>Copy DISPOSITION comparison summary</button></>}
 {status&&<p role="status">{status}</p>}
 </section>;
}
