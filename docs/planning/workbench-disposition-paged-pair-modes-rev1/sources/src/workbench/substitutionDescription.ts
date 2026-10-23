import type {SubstitutionSnapshot} from './substitutionAdapter';
import {decodeReceiving} from '../campaign3/receivingCodecs';
import {dataRecord as rec,dataField as field,dataUnsigned as uint} from '../campaign2/canonicalData';
import {fromHex} from './canonical';
type Observer=SubstitutionSnapshot['observer'];
export interface SubstitutionDescription{sourceIndex:number;at:number;kind:string;human:string;exact:string;}
const option=(i:number)=>i===0?'A':'B';
const pair=(v:readonly unknown[])=>v.map((x,i)=>`${option(i)} ${x===null?'unknown':String(x)}`).join(', ');
/** The observer is the only input. No profile, world state, RNG ledger or later
 * belief estimate can supply an earlier description. Mechanical records are never echoed. */
export function describeSubstitutionObserver(observer:Observer){
 if(!observer||Object.keys(observer).sort().join(',')!=='belief,journal,rows'||!Array.isArray(observer.rows)||observer.rows.length>8||!Array.isArray(observer.belief)||observer.belief.length!==2||!Array.isArray(observer.journal)||JSON.stringify(observer).length>32_000_000)throw Error('Invalid SUBSTITUTION observer');
 const entries:SubstitutionDescription[]=[];
 const push=(sourceIndex:number,at:number,kind:string,human:string,source:unknown)=>entries.push({sourceIndex,at,kind,human,exact:JSON.stringify(source,null,2)});
 for(const [sourceIndex,r]of observer.rows.entries()){
  if(r.at!==sourceIndex+1||![0,1,2,3].includes(r.mode)||![0,1].includes(r.demand)||![-1,0,1].includes(r.intent)||![r.available,r.beliefBefore,r.habitBefore,r.admitted,r.values].every(v=>Array.isArray(v)&&v.length===2))throw Error('Invalid SUBSTITUTION observer row');
  const at=r.at,mode=['information only','instructed practice of A','instructed practice of B','free choice'][r.mode];
  push(sourceIndex,at,'Recorded evaluation',`At opportunity ${at}, admitted mode: ${mode}; task demand: ${r.demand}; cue present: ${r.cue}. Current availability: ${pair(r.available)}. Prior relief estimates: ${pair(r.beliefBefore)}; unknown differs from known zero. Acquired same-cue operands: ${pair(r.habitBefore)}. Admitted candidates: ${pair(r.admitted)}; option values: ${pair(r.values)}. Candidate admission, valuation and action remain distinct; these operands do not establish that acquired history was necessary.`,{at,mode:r.mode,demand:r.demand,cue:r.cue,available:r.available,beliefBefore:r.beliefBefore,habitBefore:r.habitBefore,admitted:r.admitted,values:r.values});
  const resolution=rec(decodeReceiving(fromHex(r.resolution)),409n),status=Number(uint(field(rec(field(resolution,4n),419n),1n)));
  if(![1,2,3].includes(status)||(status===3)!==(r.intent>=0))throw Error('SUBSTITUTION choice/intent mismatch');
  const selected=status===1?'No candidates were admitted; no intent was selected.':status===2?'Candidates were admitted but no active reasons remained; no intent was selected.':`Option ${option(r.intent)} was selected.`;
  push(sourceIndex,at,'Recorded selection',`At opportunity ${at}, ${selected} Selection precedes execution and admitted feedback. It does not establish physical delivery or successful relief. Mechanical draws are excluded from this description.`,{at,resolutionStatus:status,intent:r.intent});
  push(sourceIndex,at,'Admitted feedback',`At opportunity ${at}, ${r.receipt===null?'no action-outcome receipt was admitted':`the admitted action-outcome receipt reports ${r.receipt?'success':'failure'}`}. A missing receipt is not an observed failure; a reported success is not proof of physical delivery. This feedback arrives after the recorded choice.`,{at,intent:r.intent,receipt:r.receipt});
  const samples=observer.belief.map(xs=>xs.filter(s=>s.at===at)),practices=observer.journal.filter(p=>p.at===at),priorPractices=observer.journal.filter(p=>p.at<at).length;
  push(sourceIndex,at,'Recorded learning',`At opportunity ${at}, retained belief samples added: ${pair(samples.map(xs=>xs.length))}; performed-history records added: ${practices.length}. Performed history contains ${priorPractices} records before and ${priorPractices+practices.length} after. Information samples and observed practice remain distinct. Receiving a report does not guarantee a retained update; these records can affect later evaluations, not the already-recorded choice.`,{at,beliefSamplesAdded:samples,practiceRecordsAdded:practices,historyBefore:priorPractices,historyAfter:priorPractices+practices.length});
 }
 return{version:'substitution-observer-description/0.1',entries,scope:'Deterministic descriptions of recorded component operands, selection, admitted receipt and retained updates. Source indices refer to the exact observer prefix. Not private thought, physical truth, clinical dependence, full causal attribution or proof of history necessity. Original mechanical provenance remains in the separate raw observer view.'};
}
