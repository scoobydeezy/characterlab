import type {DispositionSnapshot} from './dispositionAdapter';
import {DISPOSITION_CONTRASTS} from './dispositionComparison';
import {dispositionResolution} from './dispositionResolution';

export type DispositionChoiceIdentity=Pick<DispositionSnapshot,'program'|'seamVersion'|'prefix'|'clock'|'runHash'|'saveHash'> & {timeline:readonly unknown[]};
export type DispositionChoiceRow={instant:string;reasonEvent:string;decisionEvent:string;intentEvent:string;emitted:boolean;candidate:string|null};
/** Compares recorded task choices, not state hashes or inferred character knowledge. */
export function dispositionChoiceComparison(id:string,a:DispositionSnapshot,b:DispositionSnapshot){
 const contrast=DISPOSITION_CONTRASTS.find(c=>c.id===id);if(!contrast||contrast.a!==a.program||contrast.b!==b.program)throw Error('Declared ordered choice contrast required');
 const project=(s:DispositionSnapshot)=>{
  if(s.seamVersion!=='disposition-public/0.1-candidate'||!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>18||s.clock!==String(s.prefix)||s.timeline.length!==s.prefix*10)throw Error('Committed disposition choice snapshot required');
  const rows=s.timeline.filter(e=>e.stage==='reasons').map(e=>dispositionResolution(s.timeline,e.id,s.seamVersion));
  if(rows.length!==s.prefix||new Set(rows.map(r=>r.instant)).size!==rows.length||rows.some((r,i)=>r.instant!==String(i+1)))throw Error('Complete ordered choice history required');
  return rows.map(r=>({instant:r.instant,reasonEvent:r.reasonEvent,decisionEvent:r.decisionEvent,intentEvent:r.intentEvent,emitted:r.emitted,candidate:r.emitted?r.chosenCandidate:null}));
 };
 return dispositionChoiceComparisonFromRows(id,a,b,project(a),project(b));
}
/** Providers must join rows to original reasons/decision/intent payloads before calling. */
export function dispositionChoiceComparisonFromRows(id:string,a:DispositionChoiceIdentity,b:DispositionChoiceIdentity,x:readonly DispositionChoiceRow[],y:readonly DispositionChoiceRow[]){
 const contrast=DISPOSITION_CONTRASTS.find(c=>c.id===id);
 if(!contrast||contrast.a!==a.program||contrast.b!==b.program)throw Error('Declared ordered choice contrast required');
 for(const [s,rows]of [[a,x],[b,y]] as const){
  if(s.seamVersion!=='disposition-public/0.1-candidate'||!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>18||s.clock!==String(s.prefix)||s.timeline.length!==s.prefix*10)throw Error('Committed disposition choice snapshot required');
  if(rows.length!==s.prefix||new Set(rows.map(r=>r.instant)).size!==rows.length||rows.some((r,i)=>r.instant!==String(i+1)))throw Error('Complete ordered choice history required');
  if(rows.some(r=>typeof r.emitted!=='boolean'||(r.emitted?typeof r.candidate!=='string':r.candidate!==null)||![r.reasonEvent,r.decisionEvent,r.intentEvent].every(id=>typeof id==='string'&&id.length>0)))throw Error('Invalid joined choice row');
 }
 const rows=Array.from({length:Math.max(a.prefix,b.prefix)},(_,i)=>{
  const left=x[i]?{...x[i]}:null,right=y[i]?{...y[i]}:null;
  const outcome=!left||!right?'unaligned':left.emitted!==right.emitted?'emission differs':!left.emitted?'neither emitted':left.candidate===right.candidate?'same choice':'different choice';
  return {instant:String(i+1),a:left,b:right,outcome};
 });
 const first=rows.find(r=>r.outcome==='different choice'||r.outcome==='emission differs')??null;
 return {version:'disposition-choice-comparison/0.1',comparison:id,
  a:{program:a.program,prefix:a.prefix,runHash:a.runHash,saveHash:a.saveHash},
  b:{program:b.program,prefix:b.prefix,runHash:b.runHash,saveHash:b.saveHash},
  rows,firstDifference:first,
  scope:'Original disposition candidate identities at the same native instant. Decision and intent payloads are joined exactly to recorded reasons. Emission differences are separate from different chosen candidates; a missing instant is unaligned, never equal. This is recorded choice divergence, not successful execution, observer knowledge, psychological significance or independent causal necessity. Original seed/address policy still applies.'};
}
