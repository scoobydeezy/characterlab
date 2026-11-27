/** M291: M290 social reward task/nonsocial B, body10/rate0, seed0.
 * Three acquired reports4..6, actual A attempt7, information-only correction8. */
import {fixture as prior,start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory,type CanonicalValue} from './assembledGeneralHabit';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
export const cases=['trained','untrained','reversed','denied-correction','absent-correction'] as const;
export type Case=typeof cases[number];
export function fixture(name:Case){
 const b=prior('recent'),denied=name==='denied-correction'||name==='absent-correction';
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')],at=(a[0] as {value:bigint}).value;
  if(key(a[2])===key(REWARD_SOURCE)){
   const p=[...items(a[3],'list')];
   if(at>=4n&&at<=6n){p[1]=true;p[2]=list([signed(0),signed(name==='untrained'?-1000:0)]);}
   if(at===7n){p[1]=name==='reversed';p[2]=list([signed(0),signed(-1000)]);}
   if(at===8n&&denied){p[1]=false;if(name==='absent-correction')p[5]=list([]);}
   a[3]=list(p);
  }
  return list(a);
 });
 return {...b,d:{...b.d,orderedInputs:enc(list(rows))},name,denied};
}
export {start,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,cachedMemory};
export type {CanonicalValue};
