/** M240: same fixed laws, normal post-execution perception; no authored cognition. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue,target,origin,destination} from './assembledItemAttainment';
import {JOINT_CRITERION_RULES,JOINT_CRITERION_REGISTRY} from '../../assembled/model';
import {ITEM_WORLD,ITEM_SOURCE} from '../../assembled/itemWorld';
import {CRITERION_VERSION} from '../../assembled/criterionSensing';
import {PROBE_SOURCE_EVENT,DELIBERATION_EVENT} from '../../campaign2/orderedInputs';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['matched','blocked','external','externalHidden','absentExternal','falseCriterion','adoptionCriterion'] as const;
export type Case=typeof names[number];
export function fixture(name:Case){
 const action=name==='matched'||name==='blocked',b=prior(action?name as 'matched'|'blocked':'external'),source=items(decode(b.d.orderedInputs),'list'),rows:CanonicalValue[]=[];
 for(const v of source){const a=[...items(v,'list')],t=at(a[0]);
  if(key(a[2])===key(ITEM_SOURCE))continue;
  if(key(a[2])===key(PROBE_SOURCE_EVENT)){a[1]=u(120);if(t===4n){if(name==='externalHidden'||name==='absentExternal')continue;a[0]=signed(name==='adoptionCriterion'?2:3);if(name==='falseCriterion')a[3]=list([text(CRITERION_VERSION),a[3],signed(10)]);}}
  else if(t===5n)a[0]=signed(4);
  rows.push(list(a));
  if(!action&&t===5n)rows.push(list([signed(3),...a.slice(1)]));
 }
 const physical=(t:number,place:CanonicalValue)=>list([signed(t),u(100),ITEM_SOURCE,list([text(ITEM_WORLD),target,place]),list([])]);
 if(['external','externalHidden','adoptionCriterion'].includes(name))rows.push(physical(name==='adoptionCriterion'?2:3,destination));
 if(['matched','external','externalHidden','adoptionCriterion'].includes(name))rows.push(physical(name==='adoptionCriterion'?3:4,origin));
 const s={...b.s,rulesVersion:JOINT_CRITERION_RULES,registrySchemaVersion:JOINT_CRITERION_REGISTRY};
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},name};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination};
export type {CanonicalValue};
