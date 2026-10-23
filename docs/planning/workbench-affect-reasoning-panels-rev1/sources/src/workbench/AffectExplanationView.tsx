import {useState} from 'react';
import {AFFECT_RENDERER,type AffectExplanation} from './affectExplanations';
import {AffectReasonSemanticPanel} from './AffectReasonSemanticPanel';
import {AffectReasonSourcesPanel} from './AffectReasonSourcesPanel';
export function AffectExplanationView({cards,history=false}:{cards:readonly AffectExplanation[];history?:boolean}){
 const [selected,setSelected]=useState('latest'),times=[...new Set(cards.map(c=>c.at))],at=!history||selected==='latest'||!times.includes(selected)?times.at(-1):selected;
 const shown=history&&selected==='all'?cards:cards.filter(c=>c.at===at);
 return <section className="card" aria-label={history?'AFFECT reasoning history':'AFFECT latest evaluations'}><h2>{history?'Recorded reasoning evaluations':'Latest character evaluations'}</h2><p>{AFFECT_RENDERER} · Recorded learning, appraisal and decision evidence. Model names identify research profiles. Physical execution is not narrated as observed knowledge.</p>
 {history&&<label>AFFECT explanation instant<select value={selected} onChange={e=>setSelected(e.target.value)}><option value="latest">Latest recorded instant</option><option value="all">All recorded instants</option>{times.map(t=><option key={t} value={t}>Instant {t}</option>)}</select></label>}
 {shown.length?shown.map(c=><article key={c.id} data-affect-explanation-id={c.id}><h3>{c.headline}</h3><p className="caption">Instant {c.at} · {c.kind}</p><p>{c.human}</p>{history&&c.kind==='Decision'&&<><AffectReasonSemanticPanel card={c}/><AffectReasonSourcesPanel card={c}/></>}<details><summary>Exact evaluation provenance</summary><pre className="exact">{c.provenance}</pre></details></article>):<p>No evaluations are recorded in this prefix. Missing evidence is not zero evidence.</p>}
 </section>;
}
