/** M119 plancd68abab. Current reference; actual practice and separate observed reports.
 * Three nonsocial tasks, A-only route, body10/rate0 with body/habit channels absent.
 * No learned S0. Same seed0, difficulty1/2, private impairment16 and later recovery. */
import {fixture as base,time,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledHabitReversal';
import {SKILL,PRACTICE_SETTING,skillPath,skillValue} from '../../assembled/skill';
import {HABIT_SOURCE} from '../../assembled/habit';
import {DISPLAY} from '../../assembled/strategy';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {unsigned} from '../../substrate/canonicalEncoding';
export type Profile='trained-negative'|'trained-positive'|'untrained-positive'|'impaired'|'blocked'|'hidden';
export const times=[10,12,14,16,18,20,22];
export function fixture(profile:Profile){
 const b=base('untrained',10,true),slots=items(decode(b.s.registry),'list'),tasks=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]);
 const procedures=items(items(slots[11],'list')[1],'list').map(v=>items(v,'list')),procedure=procedures.find(v=>key(v[0])===key(target))![1];
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return ![PRACTICE_SETTING,PERFORMANCE_SETTING,HABIT_SOURCE].some(k=>key(k)===key(a[2]))&&!(key(a[2])===key(DISPLAY)&&time(a[0])!==1n);});
 rows.push(...rows.filter(v=>time(items(v,'list')[0])===20n).map(v=>list([signed(22),...items(v,'list').slice(1)])));
 for(const at of times){
  const phase=at<=12?0:4,practice=at===12&&profile!=='untrained-positive',permitted=!(at===12&&profile==='blocked');
  rows.push(list([signed(at),unsigned(30),PRACTICE_SETTING,list([text(SKILL),unsigned(phase),q(at===16&&profile==='impaired'?3:0,4),q(1,2),permitted,practice]),list([])]));
  // Native mode1 displays failure; mode2 displays success (original control numbering differs).
  const visible=profile!=='hidden'&&[10,20].includes(at),report=at===10?(profile.endsWith('positive')?2:1):0;
  rows.push(list([signed(at),unsigned(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list(tasks.map(task=>list([task,visible,unsigned(report)])))]),list([])]));
 }
 return {...b,d:{...b.d,orderedInputs:enc(list(rows))},tasks,procedure};
}
export {time,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,skillPath,skillValue};
export type {Run,CanonicalValue};
