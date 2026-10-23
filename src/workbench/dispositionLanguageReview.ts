import type corpus from './dispositionLanguageCorpus.json';
type Corpus = typeof corpus;
const stable=(value:unknown):string=>value===null||typeof value!=='object'?JSON.stringify(value):Array.isArray(value)?'['+value.map(stable).join(',')+']':'{'+Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,v])=>JSON.stringify(k)+':'+stable(v)).join(',')+'}';
/** Cross-corpus wording review, separate from the frozen within-event verdict. */
export function dispositionLanguageReview(data:Corpus){
 const meanings=new Map<number,Corpus['semantics'][number]>();
 for(const s of data.semantics){if(meanings.has(s.id))throw Error('Duplicate language semantic identity');meanings.set(s.id,s);}
 const groups=new Map<string,{text:string;semanticIds:number[];occurrences:{programIndex:number;eventIndex:number;rowIndex:number;semanticId:number}[]}>();
 for(const [programIndex,p] of data.programs.entries())for(const [eventIndex,e] of p.events.entries())for(const r of e.rows){
  const s=meanings.get(r.semanticId);if(!s)throw Error('Missing language semantic identity');
  let g=groups.get(s.text);if(!g){g={text:s.text,semanticIds:[],occurrences:[]};groups.set(s.text,g);}
  if(!g.semanticIds.includes(s.id))g.semanticIds.push(s.id);
  g.occurrences.push({programIndex,eventIndex,rowIndex:r.rowIndex,semanticId:r.semanticId});
 }
 const shared=[...groups.values()].filter(g=>new Set(g.semanticIds.map(id=>stable(meanings.get(id)!.semantic))).size>1);
 return {version:'disposition-cross-corpus-wording/0.1',groups:shared.map(g=>({...g,semantics:g.semanticIds.map(id=>meanings.get(id)!)})),
  counts:{textGroups:groups.size,reviewGroups:shared.length,affectedOccurrences:shared.reduce((n,g)=>n+g.occurrences.length,0)},
  scope:'Researcher wording shared by distinct retained semantics. These are review candidates, not automatic misleading-collision verdicts. Counts span the corpus and do not replace the original within-event audit. Character/player disclosure and subject naming remain unqualified.'};
}
