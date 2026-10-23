import {decodeRelationship} from '../campaign3/relationshipCodecs';
import {decodeBelief} from '../campaign3/beliefCodecs';
import {validateEstimate} from '../campaign3/beliefModel';
import {dataRecord as rec,dataField as field,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {fromHex} from './canonical';
import type {projectLongLossOwnedState} from './longLossOwnedProjection';

/** Current owned records only. No trace, scenario, appraisal, physical outcome or prior state. */
export function describeLongLossOwnedState(input:ReturnType<typeof projectLongLossOwnedState>){
 const {actor,target,relationshipHistory,availabilityBelief,goals}=structuredClone(input);
 const decodeBytes=(s:string)=>{if(typeof s!=='string'||s.length>131072)throw Error('Loss description byte bound');return fromHex(s);};
 const history=items(field(rec(decodeRelationship(decodeBytes(relationshipHistory)),847n),1n),'list');
 const occurrences=history.map(v=>{const r=rec(v,846n),at=field(r,2n),kind=uint(field(r,3n));if(typeof at==='boolean'||at.kind!=='signed'||kind!==1n)throw Error('Unsupported loss relationship record');return{occurrence:key(field(r,1n)),at:String(at.value),kind:'admitted-joint-interaction' as const};});
 let estimate:string|null=null,support:string[]=[];
 if(availabilityBelief!==null){const value=decodeBelief(decodeBytes(availabilityBelief));validateEstimate(value);const r=rec(value,739n),q=readQ(field(r,1n));estimate=`${q.numerator}/${q.denominator}`;support=items(field(r,3n),'set').map(key);}
 if(!Array.isArray(goals)||goals.length>16)throw Error('Loss description goal bound');const ids=new Set<string>();
 const goalRecords=goals.map(g=>{
  if(!['continuity','support'].includes(g.id)||ids.has(g.id)||!['Open','Withdrawn','Expired'].includes(g.status))throw Error('Unsupported loss goal');ids.add(g.id);
  for(const t of [g.adoptedAt,g.activeFrom,g.expiresAt,g.changedAt])if(typeof t!=='string'||!/^(0|[1-9][0-9]{0,19})$/.test(t))throw Error('Invalid loss goal time');
  const [adopted,active,expires,changed]=[g.adoptedAt,g.activeFrom,g.expiresAt,g.changedAt].map(BigInt);
  if(adopted>active||active>=expires||changed<adopted||g.status==='Open'&&changed!==adopted||g.status==='Withdrawn'&&changed>=expires||g.status==='Expired'&&changed!==expires)throw Error('Invalid loss goal lifecycle');
  return{...g,authority:'owned-goal-lifecycle' as const,text:`The ${g.id} goal is recorded as ${g.status}, adopted at clock ${g.adoptedAt}, with activation from ${g.activeFrom} and expiry at ${g.expiresAt}; its last lifecycle change is at ${g.changedAt}.`};
 });
 return{version:'long-loss-owned-state-description/0.1',actor,target,
  relationship:{authority:'owned-relationship-history' as const,exact:relationshipHistory,count:occurrences.length,occurrences,text:`Owned relationship history contains ${occurrences.length} admitted joint-interaction ${occurrences.length===1?'record':'records'}.`},
  belief:{authority:'owned-availability-belief' as const,exact:availabilityBelief,estimate,support,text:estimate===null?'No retained availability estimate is present.':`The retained report-based availability estimate is ${estimate}, with ${support.length} supporting evidence ${support.length===1?'identity':'identities'}. This estimate does not establish actual contact availability.`},
  goals:goalRecords,goalSummary:goalRecords.length?`${goalRecords.length} owned goal lifecycle ${goalRecords.length===1?'record is':'records are'} present.`:'No owned goal lifecycle records are present.',
  scope:'Current owned-state descriptions, not first-person testimony, episodic recall, clinical grief, physical outcome reports or evaluation-time reasons. Open status alone does not establish current activation. Evidence identities do not reconstruct report contents. No absent record establishes global forgetting.'};
}
