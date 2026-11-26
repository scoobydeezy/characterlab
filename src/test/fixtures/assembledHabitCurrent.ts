/** M288: same current reference, social TASK, body10/rate0, normal reports1..3.
 * Four actual A practices4..7; zero information8; free probes9..11. Seed0. */
import {fixture as prior} from './assembledSubstitutionReplay';
import {promote,start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type CanonicalValue} from './assembledSkillCarry';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {changeDefinition} from './assembledCharacter';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {sid} from '../../assembled/skill';
import {set} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {HABIT_SOURCE} from '../../assembled/habit';
export const cases=['trained','untrained','reversed','other-cue','unseen-cue','denied-training'] as const;
export type Case=typeof cases[number];
export function fixture(name:Case){
 const original=prior('correctedConcentrated'),b=promote(original),old=items(decode(original.s.registry),'list'),slots=[...items(decode(b.s.registry),'list')];
 // Preserve the source's exact task/action/instruction domain, not the template's.
 for(const i of [0,10,11])slots[i]=old[i];
 const item=sid(1601,'item/m288-parcel'),origin=sid(1602,'place/m288-origin'),destination=sid(1602,'place/m288-destination');
 slots[59]=list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([b.actions[0],item,destination])]),list([])]);
 const s=changeDefinition({...b.s,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(original.d.initialState)).entries(),{path:itemPath(item),value:origin}]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')],t=(a[0] as {value:bigint}).value;
  if(key(a[2])===key(REWARD_SOURCE)&&t>=4n&&t<=7n){
   const p=[...items(a[3],'list')];
   if(name==='untrained'||name==='reversed'&&t>=6n)p[2]=list([signed(0),signed(-1000)]);
   if(name==='denied-training')p[1]=false;
   a[3]=list(p);
  }
  if(key(a[2])===key(HABIT_SOURCE)&&t>=9n){const p=[...items(a[3],'list')];if(name==='other-cue')p[1]=false;if(name==='unseen-cue')p[2]=false;a[3]=list(p);}
  return list(a);
 });
 return {...b,s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},receiving:{...b.receiving,addedInitial:['one unbound item location'],preservedOriginalDomains:true},name};
}
export {start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory};
export type {CanonicalValue};
