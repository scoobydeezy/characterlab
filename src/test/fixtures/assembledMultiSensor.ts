/** M246: original M223 social/task/physical semantics; scalar instrument retained.
 * Body10, seed0, recognized stand-ins1..3, attempts4/6, Value linkage6, choice8.
 * Add physical item state, no item criterion or authored psychological state. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,type Mode,type CanonicalValue} from './assembledMultiCurrent';
import {SENSOR_BINDING_RULES,SENSOR_BINDING_REGISTRY} from '../../assembled/model';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {sid} from '../../assembled/skill';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const item=sid(1601,'item/m246-parcel'),origin=sid(1602,'place/m246-origin'),destination=sid(1602,'place/m246-destination');
const bases=new Map<string,ReturnType<typeof prior>>();
export function fixture(mode:Mode='collective',permitted=true,truth=true,linked=true){
 const k=[mode,permitted,truth,linked].join('/');let b=bases.get(k);if(!b){b=prior(mode,permitted,truth,linked);bases.set(k,b);}
 const slots=items(decode(b.s.registry),'list');if(slots.length!==59)throw Error('M246 original59 slots');
 const route=items(items(items(slots[12],'list')[1],'list').find(v=>key(items(v,'list')[0])===key(b.taskA))!,'list'),definition=items(slots[0],'set').find(v=>key(f(rec(v,171n),1n))===key(route[1]))!,action=f(rec(f(rec(definition,171n),4n),389n),1n);
 const declaration=list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([action,item,destination])]),list([])]);
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(b.d.initialState)).entries(),{path:itemPath(item),value:origin}]);
 return {...b,control:b,s:{...b.s,rulesVersion:SENSOR_BINDING_RULES,registrySchemaVersion:SENSOR_BINDING_REGISTRY,registry:enc(list([...slots,declaration]))},d:{...b.d,initialState:enc(initial.canonicalValue())},declaration,action,mode,permitted,truth,linked};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode='collective',permitted=true,truth=true,linked=true){const b=fixture(mode,permitted,truth,linked),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=96||!await run.settleNextInstant())throw Error('M246 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M246 skipped instant');}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid};
export type {Mode,CanonicalValue};
