/** M239 data-only item/route correspondence, fixed character laws and seed7. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledExecutionCriterion';
import {changeDefinition} from './assembledCharacter';
import {ITEM_RULES,ITEM_REGISTRY} from '../../assembled/model';
import {ITEM_WORLD,ITEM_SOURCE,itemPath} from '../../assembled/itemWorld';
import {CRITERION_VERSION} from '../../assembled/criterionSensing';
import {PROBE_SOURCE_EVENT,AUTHORED_FACT_EVENT} from '../../campaign2/orderedInputs';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['matched','wrongItem','wrongPlace','hidden','falsePositive','external','blocked'] as const;
export type Case=typeof names[number];
export const target=sid(1601,'item/parcel-a'),other=sid(1601,'item/parcel-b'),origin=sid(1602,'place/origin'),destination=sid(1602,'place/desk-a'),otherPlace=sid(1602,'place/desk-b');
const bases=new Map<string,ReturnType<typeof prior>>();
export function fixture(name:Case){
 const mode=name==='external'?'external':name==='blocked'?'denied':'permitted';let b=bases.get(mode);if(!b){b=prior(mode);bases.set(mode,b);}
 let s=changeDefinition(b.s,'definition/task-b',3n,q(1,1));s=changeDefinition(s,'definition/task-b',4n,q(1,1));
 const moveItem=name==='wrongItem'||name==='falsePositive'?other:target,movePlace=name==='wrongPlace'?otherPlace:destination;
 const declaration=list([text(ITEM_WORLD),set([target,other]),set([origin,destination,otherPlace]),list(b.actions.map(action=>list([action,moveItem,movePlace]))),list([b.task,target,destination])]);
 s={...s,rulesVersion:ITEM_RULES,registrySchemaVersion:ITEM_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),declaration]))};
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(b.d.initialState)).entries(),...([target,other].map(item=>({path:itemPath(item),value:origin})))]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>!(name==='hidden'&&at(items(v,'list')[0])===4n)).map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(AUTHORED_FACT_EVENT))return list([a[0],u(100),ITEM_SOURCE,list([text(ITEM_WORLD),target,destination]),list([])]);if(name==='falsePositive'&&at(a[0])===4n&&key(a[2])===key(PROBE_SOURCE_EVENT))a[3]=list([text(CRITERION_VERSION),a[3],signed(10)]);return list(a);});
 return {...b,s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},hidden:name==='hidden',moveItem,movePlace,declaration};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
