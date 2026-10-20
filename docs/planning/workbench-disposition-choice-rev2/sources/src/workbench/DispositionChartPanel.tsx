import {useMemo} from 'react';
import {dispositionChart} from './dispositionChart';
import type {DispositionComparisonReport as Report} from './dispositionDivergenceHistory';
export function DispositionChartPanel({reports}:{reports:readonly Report[]}){
 const result=useMemo(()=>{try{return {chart:dispositionChart(reports)};}catch(e){return {error:String(e)};}},[reports]),c=result.chart;
 const colors=['#17695b','#9b451b'];
 return <section aria-label="DISPOSITION stored state charts"><h3>Committed constitution and plastic state</h3>{result.error&&<p role="alert">{result.error}</p>}
 {c&&<><p>{c.scope}</p>{(['constitution','plastic'] as const).map(metric=><figure key={metric}><figcaption>{metric==='constitution'?'Immutable constitution':'Stored plastic contribution'} · A green / B orange · vertical range −1 to +1</figcaption>
 <svg viewBox="0 0 660 240" role="img" aria-label={`${metric} by committed prefix; exact values in table`} style={{width:'100%',maxWidth:900}}>
 <line x1="40" y1="120" x2="620" y2="120" stroke="#999"/><text x="5" y="25">+1</text><text x="5" y="125">0</text><text x="5" y="225">−1</text>
 {[0,1].map(b=><g key={b} stroke={colors[b]} fill={colors[b]}>{c.rows.map((row,i)=>{
  const v=row.branches[b][metric],prior=c.rows[i-1],p=prior?.branches[b][metric],x=40+row.prefix*580/18,y=120-(v?.plot??0)*100;
  return v?<g key={row.prefix}>{p&&prior.prefix===row.prefix-1&&<line x1={40+prior.prefix*580/18} y1={120-p.plot*100} x2={x} y2={y} strokeDasharray={b===1?'5 3':undefined}/>}<circle cx={x} cy={y} r={b===0?4:2}><title>{`${b===0?'A':'B'} prefix ${row.prefix}: ${v.exact}`}</title></circle></g>:null;
 })}</g>)}<text x="40" y="238">0</text><text x="295" y="238">Committed prefix</text><text x="607" y="238">18</text></svg></figure>)}
 <table><thead><tr><th>Prefix</th><th>Branch</th><th>Constitution</th><th>Stored plastic</th></tr></thead><tbody>{c.rows.flatMap(row=>row.branches.map(b=><tr key={`${row.prefix}/${b.branch}`}><td>{row.prefix}</td><td>{b.branch.toUpperCase()}</td><td>{b.constitution.exact}</td><td>{b.plastic?.exact??'No stored leaf (Refold)'}</td></tr>))}</tbody></table>
 <details><summary>Exact chart sources</summary><pre className="exact" data-disposition-chart>{JSON.stringify(c,null,2)}</pre></details></>}
 </section>;
}
