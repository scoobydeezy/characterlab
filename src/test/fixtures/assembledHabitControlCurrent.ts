/** M289: social TASK, body10/rate0, A practice4..7, A0/B1000 information8.
 * Precision10, workspace6; recovery8 then awake9..11, permitted normal physiology.
 * Four cases differ only in probe cue and ordinary control instructions. */
import {fixture as prior,start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type CanonicalValue} from './assembledHabitCurrent';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {HABIT_SOURCE} from '../../assembled/habit';
import {CONTROL,CONTROL_SOURCE} from '../../assembled/control';
import {INTOXICATION,SLEEP_SOURCE} from '../../assembled/sleepControl';
import {changeDefinition} from './assembledCharacter';
export const cases=['free','other-cue','controlled','controlled-other-cue'] as const;
export type Case=typeof cases[number];
export function fixture(name:Case){
 const b=prior('trained'),controlled=name.startsWith('controlled'),other=name.endsWith('other-cue');
 const slots=items(decode(b.s.registry),'list');if(items(slots[55],'list')[7]!==true||uint(items(slots[57],'list')[6])!==10n)throw Error('M289 source control/precision changed');
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>![CONTROL_SOURCE,SLEEP_SOURCE].some(t=>key(t)===key(items(v,'list')[2]))).map(v=>{
  const a=[...items(v,'list')],t=(a[0] as {value:bigint}).value;
  if(key(a[2])===key(REWARD_SOURCE)&&t===8n){const p=[...items(a[3],'list')];p[5]=list([list([b.actions[0],u(0)]),list([b.actions[1],u(1000)])]);a[3]=list(p);}
  if(key(a[2])===key(HABIT_SOURCE)&&t>=9n){const p=[...items(a[3],'list')];p[1]=!other;a[3]=list(p);}
  return list(a);
 });
 for(const t of[8,9,10,11])rows.push(list([signed(t),u(10),SLEEP_SOURCE,list([text(INTOXICATION),t===8,list([true,true,true,true]),list([signed(0),signed(0),signed(0),signed(0)]),u(0)]),list([])]));
 for(const t of[9,10,11])rows.push(list([signed(t),u(10),CONTROL_SOURCE,list([text(CONTROL),u(controlled?(t===9?1:t===11?2:0):0),true,true,false,true,u(0)]),list([])]));
 const s=changeDefinition(b.s,'definition/task-workspace',2n,u(6));
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},name,controlled,other};
}
export {start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory};
export type {CanonicalValue};
