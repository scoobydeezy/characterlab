/** M290: social reward task, nonsocial task B; body10/rate0; fixed seed0.
 * Recent/remote reorder four perceived outcomes, with equal mean200 at probe9. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type CanonicalValue} from './assembledHabitControlCurrent';
import {GENERAL_HABIT_RULES,GENERAL_HABIT_REGISTRY} from '../../assembled/model';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {HABIT_SOURCE} from '../../assembled/habit';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {changeDefinition} from './assembledCharacter';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
export const cases=['recent','remote','other-cue','controlled'] as const;
export type Case=typeof cases[number];
export function promote<T extends ReturnType<typeof prior>>(b:T){return {...b,s:{...b.s,rulesVersion:GENERAL_HABIT_RULES,registrySchemaVersion:GENERAL_HABIT_REGISTRY}};}
export function fixture(name:Case){
 const b=prior(name==='controlled'?'controlled':name==='other-cue'?'other-cue':'free');
 const slots=[...items(decode(b.s.registry),'list')],routes=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list'));
 const other=routes.find(r=>key(r[0])!==key(b.task))![0];
 const social=items(slots[19],'list');
 slots[19]=list([social[0],list(items(social[1],'list').map(v=>{const a=items(v,'list');return list([a[0],list(items(a[1],'list').filter(v=>key(items(v,'list')[0])===key(b.task)))]);} ))]);
 let s={...b.s,rulesVersion:GENERAL_HABIT_RULES,registrySchemaVersion:GENERAL_HABIT_REGISTRY,registry:enc(list(slots))};
 s=changeDefinition(changeDefinition(s,'definition/task-b',3n,q(10,1)),'definition/task-b',4n,q(10,1));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')],t=(a[0] as {value:bigint}).value;
  if(key(a[2])===key(REWARD_SOURCE)&&t>=4n&&t<=7n){const p=[...items(a[3],'list')];p[2]=list([signed(0),signed(t===(name==='remote'?4n:7n)?0:-1000)]);a[3]=list(p);}
  if(key(a[2])===key(PRIORITY_DISPLAY)){
   const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(t>=9n)r[3]=key(r[0])===key(other)?list([q(1,1)]):list([]);return list(r);}))]);
  }
  if(key(a[2])===key(DISPLAY)){
   const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(other))r[3]=t===3n?uint(r[1])===1n:true;return list(r);}))]);
  }
  return list(a);
 });
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},name,other};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start<T extends Pick<ReturnType<typeof fixture>,'s'|'d'>>(b:T){const k=b.s.rulesVersion+key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export {prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory};
export type {CanonicalValue};
