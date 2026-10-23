import {useState} from 'react';
import corpus from './dispositionLanguageCorpus.json';
import type {DispositionInspectionSummary} from './dispositionPagedAdapter';
import {dispositionLanguageReview} from './dispositionLanguageReview';
const wording=dispositionLanguageReview(corpus);
export function DispositionLanguageCorpusPanel({summary,busy,onInspect}:{summary:DispositionInspectionSummary;busy:boolean;onInspect:(eventId:string)=>void}){
 const [program,setProgram]=useState(0),[event,setEvent]=useState(0),[issue,setIssue]=useState('all'),[wordingGroup,setWordingGroup]=useState(0);
 const p=corpus.programs[program],e=p.events[event],rows=e.rows.filter(r=>issue==='all'||r.issues.some(i=>i.code===issue));
 const matching=summary.seamVersion==='disposition-public/0.1-candidate'&&summary.program===p.program&&summary.timeline.some(h=>h.id===e.eventId&&h.instant===e.instant&&h.stage==='reasons'&&h.phase==='52');
 return <section aria-label="Retained Disposition language corpus"><h3>Corpus language audit · retained evidence</h3>
 <p>This is the frozen 15-program audit, separate from the current run. Researcher descriptions are not admitted character/player knowledge.</p>
 <p data-language-corpus-counts>{corpus.counts.programs} programs · {corpus.counts.events} reports · {corpus.counts.descriptions} descriptions · {corpus.counts.uniqueSemantics} distinct semantics · {corpus.counts.gaps} unresolved findings</p>
 <details><summary>Cross-corpus wording review · {wording.counts.reviewGroups} groups</summary><p>{wording.scope}</p><p data-language-wording-counts>{wording.counts.textGroups} distinct sentences · {wording.counts.reviewGroups} shared-wording groups · {wording.counts.affectedOccurrences} affected factor occurrences</p>
 <label>Shared wording<select value={wordingGroup} onChange={x=>setWordingGroup(Number(x.target.value))}>{wording.groups.map((g,i)=><option key={g.text} value={i}>{g.text}</option>)}</select></label>
 {wording.groups[wordingGroup]&&<><p data-language-wording-text>{wording.groups[wordingGroup].text}</p><p>Compare the exact subject and meaning before judging whether this shared wording is misleading.</p><pre className="exact" data-language-wording-semantics>{JSON.stringify(wording.groups[wordingGroup].semantics,null,2)}</pre>
 <label>Retained wording occurrence<select value="" onChange={x=>{if(x.target.value==='')return;const o=wording.groups[wordingGroup].occurrences[Number(x.target.value)];setProgram(o.programIndex);setEvent(o.eventIndex);setIssue('all');}}><option value="" disabled>Select an occurrence to inspect below</option>{wording.groups[wordingGroup].occurrences.map((o,i)=>{const p=corpus.programs[o.programIndex],e=p.events[o.eventIndex];return <option key={i} value={i}>{p.program} · event {e.eventId} · row {o.rowIndex} · semantic {o.semanticId}</option>;})}</select></label></>}
 </details>
 <p>{corpus.scope}</p><label>Corpus program<select value={program} onChange={x=>{setProgram(Number(x.target.value));setEvent(0);}}>{corpus.programs.map((p,i)=><option key={p.index} value={i}>{p.program}</option>)}</select></label>
 <label>Corpus reason event<select value={event} onChange={x=>setEvent(Number(x.target.value))}>{p.events.map((e,i)=><option key={e.eventId} value={i}>Instant {e.instant} · event {e.eventId} · {e.rows.length} factors</option>)}</select></label>
 <label>Language finding<select value={issue} onChange={x=>setIssue(x.target.value)}><option value="all">All findings</option><option>NO HUMAN REASON</option><option>OPAQUE</option></select></label>
 <p data-language-corpus-selection>{p.program} · instant {e.instant} · event {e.eventId} · {rows.length} matching factors · {e.emitted?'reason record emitted':'no reason record emitted'}</p>
 <button disabled={busy||!matching} onClick={()=>{if(!busy&&matching)onInspect(e.eventId);}}>Inspect matching live reason report</button><p>{matching?'The selected original-program event exists in this run. Inspection uses the current save revision and does not install archived state.':'Load the same original program and advance through this event to inspect its live report. The retained corpus remains independently readable.'}</p>
 {rows.map(r=>{const s=corpus.semantics[r.semanticId];return <article key={r.rowIndex}><p>{s.text}</p><ul>{r.issues.filter(i=>issue==='all'||i.code===issue).map(i=><li key={i.code}>{i.code} · {i.scope}: {i.detail}</li>)}</ul><details><summary>Exact retained semantics and source address</summary><pre className="exact" data-language-corpus-source>{JSON.stringify({languageVersion:corpus.languageVersion,semantic:s.semantic,source:{archive:p.archive,sha256:p.sha256,reportIndex:e.reportIndex,rowIndex:r.rowIndex,eventId:e.eventId,snapshot:p.snapshot}},null,2)}</pre></details></article>;})}
 {!rows.length&&<p>No matching factor rows in this retained event. This does not establish complete language qualification.</p>}
 <details><summary>Corpus provenance</summary><pre className="exact">{JSON.stringify(corpus.source,null,2)}</pre><p>Source indices are zero-based addresses in the frozen compressed report archive. Counts are repeated event observations, not unique research obligations. Rendering does not recompute historical semantics.</p></details>
 </section>;
}
