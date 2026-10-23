import {useState} from 'react';
import corpus from './dispositionLanguageCorpus.json';
export function DispositionLanguageCorpusPanel(){
 const [program,setProgram]=useState(0),[event,setEvent]=useState(0),[issue,setIssue]=useState('all');
 const p=corpus.programs[program],e=p.events[event],rows=e.rows.filter(r=>issue==='all'||r.issues.some(i=>i.code===issue));
 return <section aria-label="Retained Disposition language corpus"><h3>Corpus language audit · retained evidence</h3>
 <p>This is the frozen 15-program audit, separate from the current run. Researcher descriptions are not admitted character/player knowledge.</p>
 <p data-language-corpus-counts>{corpus.counts.programs} programs · {corpus.counts.events} reports · {corpus.counts.descriptions} descriptions · {corpus.counts.uniqueSemantics} distinct semantics · {corpus.counts.gaps} unresolved findings</p>
 <p>{corpus.scope}</p><label>Corpus program<select value={program} onChange={x=>{setProgram(Number(x.target.value));setEvent(0);}}>{corpus.programs.map((p,i)=><option key={p.index} value={i}>{p.program}</option>)}</select></label>
 <label>Corpus reason event<select value={event} onChange={x=>setEvent(Number(x.target.value))}>{p.events.map((e,i)=><option key={e.eventId} value={i}>Instant {e.instant} · event {e.eventId} · {e.rows.length} factors</option>)}</select></label>
 <label>Language finding<select value={issue} onChange={x=>setIssue(x.target.value)}><option value="all">All findings</option><option>NO HUMAN REASON</option><option>OPAQUE</option></select></label>
 <p data-language-corpus-selection>{p.program} · instant {e.instant} · event {e.eventId} · {rows.length} matching factors · {e.emitted?'reason record emitted':'no reason record emitted'}</p>
 {rows.map(r=>{const s=corpus.semantics[r.semanticId];return <article key={r.rowIndex}><p>{s.text}</p><ul>{r.issues.filter(i=>issue==='all'||i.code===issue).map(i=><li key={i.code}>{i.code} · {i.scope}: {i.detail}</li>)}</ul><details><summary>Exact retained semantics and source address</summary><pre className="exact" data-language-corpus-source>{JSON.stringify({languageVersion:corpus.languageVersion,semantic:s.semantic,source:{archive:p.archive,sha256:p.sha256,reportIndex:e.reportIndex,rowIndex:r.rowIndex,eventId:e.eventId,snapshot:p.snapshot}},null,2)}</pre></details></article>;})}
 {!rows.length&&<p>No matching factor rows in this retained event. This does not establish complete language qualification.</p>}
 <details><summary>Corpus provenance</summary><pre className="exact">{JSON.stringify(corpus.source,null,2)}</pre><p>Source indices are zero-based addresses in the frozen compressed report archive. Counts are repeated event observations, not unique research obligations. Rendering does not recompute historical semantics.</p></details>
 </section>;
}
