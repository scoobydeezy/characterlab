import {receivingRecord as statusRecord} from './codecs';
/** configuration0.1: same ordered task/forecast selection, domain up to3 tasks. */
import {list,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import type {WorkspaceTask,WorkspaceReads} from '../campaign2/cognitiveTransforms';
export function workspaceOutput(occurrence:CanonicalValue,character:CanonicalValue,agendaId:CanonicalValue,definition:CanonicalValue,tasks:readonly WorkspaceTask[],at:bigint,reads:WorkspaceReads,taskLimit=3){
 const d=rec(definition,378n),capacity=uint(f(d,2n));if(capacity>BigInt(taskLimit+1)||tasks.length>taskLimit)invalidModel('workspace finite domain');
 const eligible=f(d,3n)===true?[...tasks].sort((a,b)=>key(a.key)<key(b.key)?-1:1).filter(task=>{
  if(key(f(rec(task.key,371n),1n))!==key(character))invalidModel('workspace foreign task');
  const prior=reads.status(task.key);return prior!==undefined&&uint(f(statusRecord(prior,372n),1n))===1n&&task.activeFrom<=at&&at<task.deadline;
 }).sort((a,b)=>a.deadline<b.deadline?-1:a.deadline>b.deadline?1:key(a.key)<key(b.key)?-1:1):[];
 const selected=capacity===0n?[]:eligible.slice(0,capacity>=2n?Number(capacity-1n):1);
 let forecast=r(380,[u(1)]),unavailable:'NoSelectedTask'|'CapacityExcluded'|'AccessDisabled'|'PriorAbsent'|undefined;
 if(!selected.length)unavailable='NoSelectedTask';
 else if(capacity<2n)unavailable='CapacityExcluded';
 else if(f(d,4n)!==true)unavailable='AccessDisabled';
 else {const prior=reads.prediction();if(prior===undefined)unavailable='PriorAbsent';else forecast=r(380,[u(2),prior]);}
 return {output:r(381,[occurrence,character,agendaId,list(selected.map(t=>r(379,[t.key,t.specId]))),forecast]),unavailable};
}
