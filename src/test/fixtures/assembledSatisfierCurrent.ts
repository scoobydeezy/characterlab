/** M292: social common task, body10/rate0, seed0; original substitution sources.
 * Current workspace6, recovery8/awake9..11; no learned starting state. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,type CanonicalValue} from './assembledSubstitutionReplay';
import {promote,cachedMemory} from './assembledSkillCarry';
import {GENERAL_HABIT_RULES,GENERAL_HABIT_REGISTRY} from '../../assembled/model';
import {changeDefinition} from './assembledCharacter';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {sid} from '../../assembled/skill';
import {set} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {INTOXICATION,SLEEP_SOURCE} from '../../assembled/sleepControl';
import {CONTROL,CONTROL_SOURCE} from '../../assembled/control';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
export const cases=['concentrated','diversified','knownFailure','knownAlternative','unavailable','correctedConcentrated','deniedInfo','absentInfo'] as const;
export type Case=typeof cases[number];
export function fixture(name:Case){
 const original=prior(name),b=promote(original),old=items(decode(original.s.registry),'list'),slots=[...items(decode(b.s.registry),'list')];
 for(const i of[0,10,11])slots[i]=old[i];
 const item=sid(1601,'item/m292-parcel'),origin=sid(1602,'place/m292-origin'),destination=sid(1602,'place/m292-destination');
 slots[59]=list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([b.actions[0],item,destination])]),list([])]);
 let s=changeDefinition({...b.s,rulesVersion:GENERAL_HABIT_RULES,registrySchemaVersion:GENERAL_HABIT_REGISTRY,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 s=changeDefinition(s,'definition/task-workspace',2n,u(6));
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(original.d.initialState)).entries(),{path:itemPath(item),value:origin}]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>![CONTROL_SOURCE,SLEEP_SOURCE].some(t=>key(t)===key(items(v,'list')[2])));
 for(const t of[8,9,10,11])rows.push(list([signed(t),u(10),SLEEP_SOURCE,list([text(INTOXICATION),t===8,list([true,true,true,true]),list([signed(0),signed(0),signed(0),signed(0)]),u(0)]),list([])]));
 for(const t of[9,10,11])rows.push(list([signed(t),u(10),CONTROL_SOURCE,list([text(CONTROL),u(0),true,true,false,true,u(0)]),list([])]));
 return {...b,s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},original,name,receiving:{...b.receiving,addedInitial:['one unbound item location'],preservedOriginalDomains:true}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,cachedMemory};
export type {CanonicalValue};
