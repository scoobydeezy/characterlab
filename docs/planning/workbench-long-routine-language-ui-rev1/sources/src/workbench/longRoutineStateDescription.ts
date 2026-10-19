import {decodeHabit} from '../campaign3/habitCodecs';
import {habitSummary} from '../campaign3/habitMath';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {fromHex} from './canonical';
import type {projectLongRoutineOwnedState} from './longRoutineOwnedProjection';

/** Current owned history/belief/goals, never source metadata, profile or an execution trace. */
export function describeLongRoutineOwnedState(input:ReturnType<typeof projectLongRoutineOwnedState>){
 const {actor,practiceHistory,derivedCache,rewardBelief,goals}=structuredClone(input);
 const decode=(s:string)=>{if(typeof s!=='string'||s.length>131072)throw Error('Routine description byte bound');return decodeHabit(fromHex(s));};
 const history=rec(decode(practiceHistory),820n),entries=items(field(history,1n),'list'),seen=new Set<string>();
 const records=entries.map(value=>{const row=rec(value,819n),id=field(row,1n),at=field(row,2n),cue=field(row,3n),reward=field(row,4n);if(typeof id==='boolean'||id.kind!=='typedIdentifier'||id.namespaceId!==1155n||typeof at==='boolean'||at.kind!=='signed'||typeof cue!=='boolean'||typeof reward!=='boolean')throw Error('Unsupported routine history record');const occurrence=key(id);if(seen.has(occurrence))throw Error('Duplicate routine history occurrence');seen.add(occurrence);return{occurrence,at:String(at.value),cue:cue?'alternate':'original',reward,exact:key(row),text:`Owned practice history records an observed ${reward?'positive':'negative'} outcome at clock ${at.value} under the ${cue?'alternate':'original'} cue.`};});
 const cache=rec(decode(derivedCache),824n);if(key(cache)!==key(habitSummary({candidate:1,law:1},history)))throw Error('Routine history/cache mismatch');
 const strengths=[1n,2n].map(n=>{const q=readQ(field(cache,n));return`${q.numerator}/${q.denominator}`;});
 if(rewardBelief!==null&&typeof rewardBelief!=='boolean')throw Error('Invalid routine reward belief');
 if(!Array.isArray(goals)||goals.length>16)throw Error('Routine goal bound');const ids=new Set<string>();
 const goalRecords=goals.map(g=>{
  if(!['practice','rest'].includes(g.id)||ids.has(g.id)||!['Open','Withdrawn','Expired'].includes(g.status)||!['0/1','1/1'].includes(g.desired))throw Error('Unsupported routine goal');ids.add(g.id);
  for(const t of [g.adoptedAt,g.activeFrom,g.expiresAt,g.changedAt])if(typeof t!=='string'||!/^(0|[1-9][0-9]{0,19})$/.test(t))throw Error('Invalid routine goal time');
  const [adopted,active,expires,changed]=[g.adoptedAt,g.activeFrom,g.expiresAt,g.changedAt].map(BigInt);if(adopted>active||active>=expires||changed<adopted||g.status==='Open'&&changed!==adopted||g.status==='Withdrawn'&&changed>=expires||g.status==='Expired'&&changed!==expires)throw Error('Invalid routine goal lifecycle');
  return{...g,authority:'owned-goal-lifecycle' as const,text:`The ${g.id} goal is recorded as ${g.status}, with desired outcome ${g.desired}, adoption at ${g.adoptedAt}, activation from ${g.activeFrom}, expiry at ${g.expiresAt} and last lifecycle change at ${g.changedAt}.`};
 });
 return{version:'long-routine-owned-state-description/0.1',actor,
  history:{authority:'owned-practice-history' as const,exact:practiceHistory,records,count:records.length,text:`Owned practice history contains ${records.length} admitted outcome ${records.length===1?'record':'records'}.`},
  cache:{authority:'derived-history-diagnostic' as const,exact:derivedCache,originalCue:strengths[0],alternateCue:strengths[1],text:`The maintained candidate history fold is ${strengths[0]} for the original cue and ${strengths[1]} for the alternate cue. A fold value alone does not establish present opportunity, selected action or performance.`},
  belief:{authority:'owned-reward-belief' as const,value:rewardBelief,text:rewardBelief===null?'No reward belief is recorded.':`The retained reward belief is ${rewardBelief?'positive':'negative'}. This record does not establish the next physical outcome.`},
  goals:goalRecords,goalSummary:goalRecords.length?`${goalRecords.length} owned goal lifecycle ${goalRecords.length===1?'record is':'records are'} present.`:'No owned goal lifecycle records are present.',
  scope:'Current owned-state descriptions, not episodic recall, first-person testimony or evaluation-time reasons. Raw practice history and source memory are separate. No absent record establishes global forgetting; Open status alone does not establish current activation. No source standing, physical outcome, scenario label or later state supplies this description.'};
}
