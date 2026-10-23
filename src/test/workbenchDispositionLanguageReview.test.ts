import {it,expect} from 'vitest';
import corpus from '../workbench/dispositionLanguageCorpus.json';
import {dispositionLanguageReview} from '../workbench/dispositionLanguageReview';
it('exposes cross-program subject differences without changing frozen within-event verdicts',()=>{
 const before=JSON.stringify(corpus),review=dispositionLanguageReview(corpus);
 expect(review.counts.textGroups).toBe(44);expect(review.counts.reviewGroups).toBe(4);
 expect(review.groups.map(g=>[...g.semanticIds].sort((a,b)=>a-b))).toEqual([[2,7],[3,5],[44,47],[45,46]]);
 const addresses=new Set<string>();
 for(const g of review.groups){expect(new Set(g.semantics.map(s=>s.semantic.candidate)).size).toBe(2);
  for(const o of g.occurrences){const e=corpus.programs[o.programIndex].events[o.eventIndex],r=e.rows.find(r=>r.rowIndex===o.rowIndex)!;expect(r.semanticId).toBe(o.semanticId);expect(corpus.semantics.find(s=>s.id===r.semanticId)!.text).toBe(g.text);const key=JSON.stringify([o.programIndex,o.eventIndex,o.rowIndex]);expect(addresses.has(key)).toBe(false);addresses.add(key);}
 }
 expect(addresses.size).toBe(review.counts.affectedOccurrences);expect(JSON.stringify(corpus)).toBe(before);expect(corpus.counts.collisions).toBe(0);
});
it('does not classify equivalent semantics or repeated occurrences as distinct meanings',()=>{
 const c=structuredClone(corpus);for(const s of c.semantics)s.semantic=structuredClone(c.semantics[0].semantic);
 expect(dispositionLanguageReview(c).counts.reviewGroups).toBe(0);
 c.programs[0].events[0].rows[0].semanticId=99999;expect(()=>dispositionLanguageReview(c)).toThrow('Missing language semantic identity');
});
