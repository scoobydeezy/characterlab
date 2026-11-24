/** M241 fixed laws/seed7; only ordinary physical settings differ. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination,type CanonicalValue} from './assembledJointCriterion';
import {ITEM_EXECUTION_RULES,ITEM_EXECUTION_REGISTRY} from '../../assembled/model';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {ITEM_SOURCE} from '../../assembled/itemWorld';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['capable','incompetent','obstructed','denied','hiddenIncompetent','hiddenObstructed','external'] as const;
export type Case=typeof names[number];
export function fixture(name:Case,legacy=false){
 const b=prior(name==='external'?'external':name==='denied'?'blocked':'matched'),hidden=name.startsWith('hidden'),incompetent=name==='incompetent'||name==='hiddenIncompetent',obstructed=name==='obstructed'||name==='hiddenObstructed';
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>!(hidden&&(key(items(v,'list')[2])===key(ITEM_SOURCE)||at(items(v,'list')[0])===3n&&key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT)))).map(v=>{
  const a=[...items(v,'list')];if(key(a[2])===key(PRACTICE_SETTING)&&incompetent){const p=[...items(a[3],'list')];p[3]=q(1,1);a[3]=list(p);}
  if(key(a[2])===key(OPPORTUNITY_SOURCE)&&obstructed){const p=items(a[3],'list');a[3]=list([p[0],p[1],set(items(p[2],'set').map(v=>{const r=items(v,'list');return list([r[0],b.actions.some(action=>key(action)===key(r[0]))?false:r[1]]);}))]);}
  return list(a);
 });
 return {...b,s:legacy?b.s:{...b.s,rulesVersion:ITEM_EXECUTION_RULES,registrySchemaVersion:ITEM_EXECUTION_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))},name,hidden,incompetent,obstructed};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case,legacy=false){const b=fixture(name,legacy),k=b.s.rulesVersion+key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination};
export type {CanonicalValue};
