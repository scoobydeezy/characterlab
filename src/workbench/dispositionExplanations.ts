import type {TimelineEvent} from './contracts';
import {dispositionFactorSources} from './dispositionFactorSources';
export const DISPOSITION_LANGUAGE_VERSION='disposition-factor-language/0.2';
export type DispositionLanguageAudience='researcher'|'character'|'player';
type Audience=DispositionLanguageAudience;
/** Researcher language consumes recorded factors only; no character disclosure contract exists. */
export function explainDispositionFactors(event:TimelineEvent,seamVersion:string,audience:Audience){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified disposition language seam');
 if(!['researcher','character','player'].includes(audience))throw Error('Unknown disposition language audience');
 if(audience!=='researcher')return {version:DISPOSITION_LANGUAGE_VERSION,seamVersion,audience,emitted:false as const,rows:[],issues:[],scope:'Explanation unavailable: no qualified disclosure contract exists for this audience.'};
 const factors=dispositionFactorSources(event);
 return explainDispositionFactorSources(event,seamVersion,audience,factors);
}
/** Renderer shared by native readers; withheld audiences never receive source identities. */
export function explainDispositionFactorSources(event:Pick<TimelineEvent,'id'|'instant'>,seamVersion:string,audience:Audience,factors?:Pick<ReturnType<typeof dispositionFactorSources>,'emitted'|'rows'>){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified disposition language seam');
 if(!['researcher','character','player'].includes(audience))throw Error('Unknown disposition language audience');
 if(audience!=='researcher')return {version:DISPOSITION_LANGUAGE_VERSION,seamVersion,audience,emitted:false as const,rows:[],issues:[],scope:'Explanation unavailable: no qualified disclosure contract exists for this audience.'};
 if(!factors)throw Error('Recorded disposition factors required');
 const header={version:DISPOSITION_LANGUAGE_VERSION,seamVersion,audience,eventId:event.id,instant:event.instant};
 if(!factors.emitted)return {...header,emitted:false as const,rows:[],issues:[],scope:'No reason record emitted. No motive or choice inferred.'};
 const rows=factors.rows.map(source=>{
  const k=JSON.parse(source.key),strength=source.strength,polarity=strength.startsWith('-')?'opposing':/^0\//.test(strength)?'zero':'supporting';
  const semantic={
   concept:source.role==='base'?'task.motive_pressure':source.role==='standing'?'task.disposition_feedback':'task.situational_response',
   candidate:JSON.stringify(k['CandidateKey [1]']),task:JSON.stringify(k['TaskCommitmentKey [2]']),
   polarity,exactStrength:strength,strengthBand:'unqualified',certaintyBand:'unavailable',
   qualifiers:['recorded factor','not subjective uncertainty','not complete choice explanation'],
  };
  const label=source.role==='base'?'Task motive pressure':source.role==='standing'?'Disposition feedback':'Situational response';
  const text=audience==='researcher'?`${label} ${polarity==='zero'?'has zero recorded strength':polarity==='supporting'?'supports this task option':'opposes this task option'} (${strength}).`:null;
  return {sourceKey:source.key,semantic,text,coverage:source.coverage,mechanical:{eventId:event.id,sourceKey:source.key,basis:source.basis},
   issues:[{code:'NO HUMAN REASON',scope:'character/player',detail:'No qualified disclosure contract maps this recorded factor to character or player knowledge.'},
    {code:'OPAQUE',scope:'subject',detail:'Task and candidate retain exact identities; no qualified player-facing subject name is available.'}]};
 });
 return {...header,emitted:true as const,rows,issues:rows.flatMap(r=>r.issues.map(i=>({...i,sourceKey:r.sourceKey}))),
  scope:'Researcher descriptions of recorded task factors. Semantic subject identity and exact strength are retained; strength bands and subjective certainty are not invented. Character/player text is withheld pending a qualified disclosure contract. This report exposes language gaps and does not establish player-language completion.'};
}
