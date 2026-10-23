import {useState} from 'react';
import type {AffectSnapshot} from './affectSession';
import {affectBeliefStateProjection} from './affectBeliefStateProjection';
export function AffectBeliefStateView({snapshot,onInspect}:{snapshot:AffectSnapshot;onInspect:(eventId:string)=>void}){
 const [selection,setSelection]=useState('current');
 let report:ReturnType<typeof affectBeliefStateProjection>;try{report=affectBeliefStateProjection(snapshot);}catch(error){return <section className="card"><p role="alert">Stored belief view unavailable: {String(error)}</p></section>;}
 const selected=selection==='current'?report.history.at(-1):report.history.find(r=>(r.eventId??'initial')===selection);
 const colors=['#267666','#b0522d','#6454a0'];
 return <section className="card" aria-label="AFFECT stored belief vector"><h2>Stored belief vector and history</h2><p>{report.scope}</p>
 <p data-affect-belief-current>Current mean vector [current cue, baseline, mitigation]: [{report.current.map(r=>r.estimate?.mean??'Absent').join(', ')}]</p>
 <label>Stored belief revision<select value={selection} onChange={e=>setSelection(e.target.value)}><option value="current">Current committed state</option>{report.history.map(r=><option key={r.eventId??'initial'} value={r.eventId??'initial'}>{r.eventId?`Instant ${r.at} · apply event ${r.eventId}`:'Original initial state'}</option>)}</select></label>
 <p>Horizontal axis: committed mutation sequence (initial state at 0). Vertical axis: mean from 0 to 1. Points use rounded plotting values; exact fractions remain authoritative. Missing means have no point. Mutations at the same instant remain separate.</p>
 <svg viewBox="0 0 640 260" role="img" aria-label="Stored belief means by committed mutation" style={{width:'100%',maxHeight:260}}><line x1="40" y1="210" x2="610" y2="210" stroke="currentColor"/><line x1="40" y1="30" x2="40" y2="210" stroke="currentColor"/><text x="15" y="35">1</text><text x="15" y="210">0</text>
 {report.history.map((r,i)=>{const x=50+540*i/Math.max(1,report.history.length-1);return <g key={r.eventId??'initial'}><text x={x} y="235">{i}</text>{r.vector.map((v,j)=>v.estimate&&<circle key={v.path} cx={x} cy={210-v.estimate.plot*180} r={7-j*1.5} fill="none" stroke={colors[j]} strokeWidth="2"><title>{`${v.name}, revision ${i}: ${v.estimate.mean}`}</title></circle>)}</g>;})}</svg>
 {selected&&<><h3>{selected.eventId?`After apply event ${selected.eventId} · instant ${selected.at}`:'Original initial state'}</h3><table><thead><tr><th>Component</th><th>Mean</th><th>Learning precision</th><th>Recorded support</th></tr></thead><tbody>{selected.vector.map((r,i)=><tr key={r.path}><th style={{color:colors[i]}}>{r.name}</th><td>{r.estimate?.mean??'Absent'}</td><td>{r.estimate?.precision??'Absent'}</td><td><code>{r.estimate?JSON.stringify(r.estimate.support):'Absent'}</code></td></tr>)}</tbody></table>{selected.eventId&&<button onClick={()=>onInspect(selected.eventId!)}>Inspect stored belief mutation</button>}<details><summary>Exact stored belief paths and values</summary><pre className="exact" data-affect-belief-selected>{JSON.stringify(selected,null,2)}</pre></details></>}
 <details><summary>Stored belief history report</summary><pre className="exact" data-affect-belief-report>{JSON.stringify(report,null,2)}</pre></details></section>;
}
