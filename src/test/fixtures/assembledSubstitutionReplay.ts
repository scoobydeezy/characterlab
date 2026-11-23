/** Remaining fixed-reference substitution scenarios on0.149; no model dispatch. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,type CanonicalValue} from './assembledRewardOutcomeBoundaries';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {HABIT_SOURCE} from '../../assembled/habit';
import {DISPLAY} from '../../assembled/strategy';
import {changeDefinition} from './assembledCharacter';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const groups={
 A:['concentrated','knownFailure','deniedInfo','absentInfo','noDemand','unavailable','unseenTraining','withheldLearning'],
 B:['knownAlternative','correctedConcentrated','correctedDiversified','otherCue','restoredA','bothAvailable','withheldInformation']
} as const;
export type Case=typeof groups[keyof typeof groups][number];
export function fixture(name:Case){
 const b=prior('diversified'),concentrated=['concentrated','knownAlternative','knownFailure','deniedInfo','absentInfo','correctedConcentrated','restoredA','withheldInformation'].includes(name),corrected=['correctedConcentrated','correctedDiversified','otherCue'].includes(name),withheld=['withheldLearning','withheldInformation'].includes(name);
 const inputs=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],t=at(a[0]);
  if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];if(concentrated&&(t===5n||t===7n))p[4]=list([b.actions[0]]);
   if(t===8n){p[5]=list(corrected?b.actions.map(action=>list([action,u(0)])):['knownAlternative','knownFailure','deniedInfo','withheldInformation'].includes(name)?[list([b.actions[1],u(name==='knownFailure'?0:1000)])]:[]);if(['deniedInfo','absentInfo'].includes(name))p[1]=false;}
   if(name==='unseenTraining'&&t<=7n)p[1]=false;if(withheld||corrected&&t>=9n)p[3]=false;a[3]=list(p);
  }
  if(key(a[2])===key(HABIT_SOURCE)&&t>=9n&&name==='otherCue'){const p=[...items(a[3],'list')];p[1]=false;a[3]=list(p);}
  if(key(a[2])===key(DISPLAY)&&t===8n){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(b.task))r[3]=name==='unavailable'?false:corrected||name==='bothAvailable'||uint(r[1])===1n;return list(r);}))]);}
  return list(a);
 });
 if(name==='restoredA'){const a=[...items(inputs.find(v=>at(items(v,'list')[0])===8n&&key(items(v,'list')[2])===key(DISPLAY))!,'list')],p=items(a[3],'list');a[0]=signed(10);a[3]=list([p[0],list(items(p[1],'list').filter(v=>key(items(v,'list')[0])===key(b.task)).map(v=>{const r=[...items(v,'list')];r[2]=u(5+Number(uint(r[1])));r[3]=true;r[4]=u(10);return list(r);}))]);inputs.push(list(a));}
 const s=name==='noDemand'?changeDefinition(b.s,'definition/task-a',6n,signed(8)):b.s;
 return {...b,s,d:{...b.d,orderedInputs:enc(list(inputs))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at};
export type {CanonicalValue};
