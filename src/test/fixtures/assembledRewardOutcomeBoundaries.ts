/** Common social task/body10, ABAB4..7, no panel reports, A unavailable/B known.
 * Truth-side delivery and per-lane sensor conditions are independent inputs. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,type CanonicalValue} from './assembledSubstitutionBoundaries';
import {REWARD_PAIRED_SENSING_RULES,REWARD_PAIRED_SENSING_REGISTRY} from '../../assembled/model';
import {REWARD_PAIRED_SENSING,REWARD_SOURCE} from '../../assembled/rewardExperience';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Case='diversified'|'falseTraining'|'deniedFeedback'|'hiddenBlocked'|'falseSuccess'|'trueSuccess'|'failure';
export function blocked(name:Case,t:number){return name==='falseTraining'&&t<=7||['hiddenBlocked','falseSuccess'].includes(name)&&t>=9||name==='failure'&&t===9;}
export function fixture(name:Case){
 const b=prior('diversified'),slots=[...items(decode(b.s.registry),'list')],d=items(slots[57],'list');slots[57]=list([text(REWARD_PAIRED_SENSING),...d.slice(1)]);
 const actions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 const inputs=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(OPPORTUNITY_SOURCE)).map(v=>{const a=[...items(v,'list')],t=Number(at(a[0]));
  if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];p[0]=text(REWARD_PAIRED_SENSING);p[1]=!(['deniedFeedback','hiddenBlocked'].includes(name)&&t>=8);p[2]=list([signed(0),signed(name==='falseTraining'&&t<=7||['falseSuccess','trueSuccess'].includes(name)&&t>=9?1000:0)]);a[3]=list(p);}return list(a);
 });
 for(let t=4;t<=11;t++)inputs.push(list([signed(t),u(100),OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(actions.map(action=>list([action,!blocked(name,t)])))]),list([])]));
 return {...b,s:{...b.s,rulesVersion:REWARD_PAIRED_SENSING_RULES,registrySchemaVersion:REWARD_PAIRED_SENSING_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(inputs))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at};
export type {CanonicalValue};
