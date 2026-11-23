/** Common task/body10/social reports1..3; four practices; idle report set8.
 * Both task routes available on9..11, feedback withheld after8 to retain correction. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,type CanonicalValue} from './assembledRewardInformation';
import {REWARD_REPORT_SET_RULES,REWARD_REPORT_SET_REGISTRY} from '../../assembled/model';
import {REWARD_REPORT_SET,REWARD_SOURCE} from '../../assembled/rewardExperience';
import {HABIT_SOURCE} from '../../assembled/habit';
import {DISPLAY} from '../../assembled/strategy';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Options={diverse?:boolean;otherCue?:boolean;reverse?:boolean;reports?:readonly (readonly [number,number])[];denied?:boolean;withheld?:boolean;bothAvailable?:boolean};
export function fixture(o:Options={}){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')],declaration=items(slots[57],'list');slots[57]=list([text(REWARD_REPORT_SET),...declaration.slice(1)]);
 const reports=(o.reports??[[0,0],[1,0]]).map(([i,v])=>list([b.actions[i],u(v)]));if(o.reverse)reports.reverse();
 const inputs=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],t=at(a[0]);
  if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];p[0]=text(REWARD_REPORT_SET);if(t===5n||t===7n)p[4]=list([b.actions[o.diverse!==false?1:0]]);if(t===8n){p[1]=!o.denied;p[3]=!o.withheld;p[5]=list(reports);}if(t>=9n)p[3]=false;a[3]=list(p);}
  if(key(a[2])===key(HABIT_SOURCE)&&t>=9n){const p=[...items(a[3],'list')];p[1]=!o.otherCue;a[3]=list(p);}
  if(key(a[2])===key(DISPLAY)&&t===8n){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(b.task))r[3]=o.bothAvailable!==false||uint(r[1])===1n;return list(r);}))]);}
  return list(a);
 });
 return {...b,s:{...b.s,rulesVersion:REWARD_REPORT_SET_RULES,registrySchemaVersion:REWARD_REPORT_SET_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(inputs))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(o:Options={}){const b=fixture(o),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at};
export type {CanonicalValue};
