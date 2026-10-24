import {OPTIONS,TASKS} from '../campaign3/affectModel';
import {dataRecord,dataField} from '../campaign2/canonicalData';
import {readable} from './canonical';
import {affectReasonSources} from './affectReasonSources';
import type {AffectExplanation} from './affectExplanations';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
const options=OPTIONS.map(v=>stable(readable(v))),grounds=TASKS.map(v=>stable(readable(dataField(dataRecord(v,371n),2n))));
const optionNames=['mitigate danger','continue the obligation'],groundNames=['adopted safety goal','adopted competing obligation'];
/** Explicit original fixture correspondence, not labels inferred from identifier substrings. */
export function affectReasonSemantics(card:AffectExplanation){
 const sources=affectReasonSources(card);
 const reasons=sources.nuclei.map(n=>{
  const option=options.indexOf(stable(n.key['CandidateKey [1]'])),ground=grounds.indexOf(stable(n.key['TaskReferent [3]']));
  if(option<0||ground<0||stable(n.key['MotiveChannel [2]'])!==stable({namespace:'1040',identity:'Commitment'}))throw Error('Unsupported AFFECT reason correspondence');
  const linked=sources.rows.filter(r=>r.coverage.some(c=>c.nucleus===n.index));
  for(const source of linked){const key=JSON.parse(source.key);if(stable(key['CandidateKey [1]'])!==options[option]||stable(key['TaskCommitmentKey [2]'])!==stable(readable(TASKS[ground])))throw Error('AFFECT semantic source correspondence mismatch');}
  const semantic={concept:ground===0?'goal.safety':'goal.competing_obligation',option:optionNames[option],ground:groundNames[ground],polarity:n.polarity,contributions:{base:n.base,standing:n.standing,situational:n.situational},strengthBand:null,certaintyBand:null,qualifiers:['recorded commitment contribution','selection does not establish execution success']};
  const human=`The ${semantic.ground} ${n.polarity==='supports'?'provides a reason to':'provides a reason against choosing to'} ${semantic.option}.`;
  return {nucleus:n.index,semantic,human,mechanical:{die:n.die,standingModifier:n.standingModifier,situationalModifier:n.situationalModifier,relevance:n.relevance},sourceIndices:linked.map(r=>r.index),sourceKey:n.key};
 });
 return {version:'affect-reason-semantic/0.1',audience:'researcher',at:card.at,reasons,scope:'Deterministic meanings for the exact original AFFECT options and goal referents. Null strength/certainty bands mean no qualified band policy, not weak or uncertain. These researcher descriptions do not grant character/player disclosure. Exact contributions and source keys remain authoritative.'};
}
