import {useState} from 'react';
import type {AffectExplanation} from './affectExplanations';
import {affectFactorView,AFFECT_FACTOR_AXES,type AffectFactorAxis} from './affectFactorProjection';
export function AffectFactorView({cards}:{cards:readonly AffectExplanation[]}){
 const [selected,setSelected]=useState('latest'),[axes,setAxes]=useState<AffectFactorAxis[]>(['Likelihood','Severity','Vulnerability']),[rotation,setRotation]=useState(35);
 let rows:ReturnType<typeof affectFactorView>;try{rows=affectFactorView(cards);}catch(error){return <section className="card"><p role="alert">Appraisal visualization unavailable: {String(error)}</p></section>;}
 const current=selected==='latest'?rows.at(-1):rows.find(r=>r.id===selected),angle=rotation*Math.PI/180;
 const project=(values:number[])=>{const [x,y,z]=values.map(v=>v-.5);return {x:240+135*(x*Math.cos(angle)-z*Math.sin(angle)),y:220-150*y+65*(x*Math.sin(angle)+z*Math.cos(angle))};};
 const points=rows.flatMap(r=>{const values=axes.map(a=>r.factors[a]);if(values.some(v=>v===null))return [];const [x,y,z]=values.map(v=>v!.plot-.5);return [{row:r,values:values.map(v=>v!.exact),x:240+135*(x*Math.cos(angle)-z*Math.sin(angle)),y:220-150*y+65*(x*Math.sin(angle)+z*Math.cos(angle))}];});
 return <section className="card" aria-label="AFFECT factor visualization"><h2>Appraisal factors across time</h2>
 <p>Derived evaluation records · affect-public/0.1-candidate. These are recorded factors and candidate coordinates, not independent stored emotion state. Axes use the recorded 0–1 numeric domains; their meanings and control units remain profile-specific. Plot positions are rounded; exact fractions below remain authoritative.</p>
 <label>Appraisal revision<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="latest">Latest appraisal</option>{rows.map(r=><option key={r.id} value={r.id}>Instant {r.at} · {r.id}</option>)}</select></label>
 <div className="field-grid">{['X','Y','Z'].map((label,i)=><label key={label}>{label} appraisal factor<select value={axes[i]} onChange={e=>setAxes(a=>a.map((v,j)=>i===j?e.target.value as AffectFactorAxis:v))}>{AFFECT_FACTOR_AXES.map(a=><option key={a}>{a}</option>)}</select></label>)}</div>
 <label>Appraisal view rotation<input type="range" min="0" max="360" value={rotation} onChange={e=>setRotation(Number(e.target.value))}/></label>
 {new Set(axes).size<3&&<p className="notice">Repeated factors produce a lower-dimensional projection.</p>}
 <p data-affect-plot-count>{points.length} of {rows.length} appraisals have all selected factors. Unavailable factors are not plotted as zero; overlapping points may represent different instants.</p>
 <svg viewBox="0 0 480 440" role="img" aria-label="Recorded appraisal factors in three selected dimensions" style={{width:'100%',maxHeight:440}}>
 <text x="15" y="25">X: {axes[0]} · Y: {axes[1]} · Z: {axes[2]}</text>
 {[[1,0,0],[0,1,0],[0,0,1]].map((v,i)=>{const start=project([0,0,0]),end=project(v);return <g key={i}><line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#8b9b8a"/><text x={end.x+6} y={end.y}>{['X','Y','Z'][i]} = 1</text></g>;})}
 {points.map(p=><g key={p.row.id}><circle cx={p.x} cy={p.y} r={current?.id===p.row.id?7:4} fill={current?.id===p.row.id?'#b0522d':'#267666'}><title>{`Instant ${p.row.at}: ${p.values.join(', ')}`}</title></circle><text x={p.x+9} y={p.y-9} fontSize="11">{p.row.at}</text></g>)}</svg>
 {current?<><h3>Selected appraisal · instant {current.at}</h3><table><thead><tr><th>Factor</th><th>Exact value</th></tr></thead><tbody>{AFFECT_FACTOR_AXES.map(a=><tr key={a}><td>{a}</td><td data-affect-factor-exact>{current.factors[a]?.exact??'Unavailable (not zero)'}</td></tr>)}</tbody></table>
 <p data-affect-coordinate-values>Raw candidate coordinates: {current.raw.length?current.raw.map(v=>v.exact).join(', '):'Unavailable (not zero)'}. Resulting coordinates: {current.result.length?current.result.map(v=>v.exact).join(', '):'Unavailable (not zero)'}.</p>
 <details><summary>Exact selected appraisal source</summary><pre className="exact" data-affect-factor-source>{current.provenance}</pre></details></>:<p>No selected appraisal is available in this prefix.</p>}
 </section>;
}
