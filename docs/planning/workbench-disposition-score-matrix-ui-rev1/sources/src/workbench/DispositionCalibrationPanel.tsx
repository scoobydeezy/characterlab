import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionCalibration} from './dispositionCalibration';
export function DispositionCalibrationPanel({event,seamVersion}:{event:TimelineEvent;seamVersion:string}){
 const result=useMemo(()=>{try{return {report:dispositionCalibration(event,seamVersion)};}catch(e){return {error:String(e)};}},[event,seamVersion]),r=result.report;
 return <section aria-label="Disposition dice calibration"><h3>From signals to dice</h3>
 {result.error&&<p role="alert">{result.error}. Calibration explanation withheld.</p>}
 {r&&!r.emitted&&<p>No reason record was emitted at this stage.</p>}
 {r?.emitted&&<><p>{r.scope}</p><p>Context: {r.learning?'learning':'non-learning'}. Modifier unit: {r.modifierUnit}. Calibration source: {r.source}.</p>
 {r.nuclei.map(n=><details key={n.index}><summary>Nucleus {n.index} · d{n.die} · {n.basePolarity}</summary>
 <table><thead><tr>{['Role','Signed effective total','Bounded net','Scaled by unit','Truncated','Capped modifier'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{n.roles.map(row=><tr key={row.role}>{[row.role,row.signedTotal,row.boundedNet,row.modifier?.scaled??'die bands',row.modifier?.truncated??'—',row.modifier?.result??'—'].map((x,i)=><td key={i}>{x}</td>)}</tr>)}</tbody></table>
 <p>Relevance {n.relevance}; threshold {n.activationThreshold}. Zero base net produces no active nucleus.</p>
 <table><thead><tr><th>Absolute base-net cutoff (inclusive)</th><th>Die</th><th>Reached</th></tr></thead><tbody>{n.bands.map(b=><tr key={b.cutoff}><td>{b.cutoff}</td><td>d{b.die}</td><td>{b.crossed?'Yes':'No'}</td></tr>)}</tbody></table><p>Below the first cutoff: d4. The last reached band determines the die.</p>
 <table><thead><tr><th>Mechanical score</th><th>Exact probability mass</th></tr></thead><tbody>{n.masses.map(m=><tr key={m.score}><td>{m.score}</td><td>{m.mass}</td></tr>)}</tbody></table>
 </details>)}</>}
 {r&&<details><summary>Exact calibration explanation</summary><pre className="exact" data-disposition-calibration>{JSON.stringify(r,null,2)}</pre></details>}
 </section>;
}
