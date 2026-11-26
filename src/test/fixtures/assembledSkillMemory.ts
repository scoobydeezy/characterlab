/** M283 plan0cd8ef2f: nonsocial A-only, body30/rate0, seed0, empty skill.
 * Practice3 -> perceived action endpoint4 -> memory pressure5 -> execution7. */
import {fixture as base,event,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,sid,taskA,actionA,type CanonicalValue} from './assembledWorkspaceFamily';
import {changeDefinition} from './assembledCharacter';
import {WORK_CUE_RULES,WORK_CUE_REGISTRY} from '../../assembled/model';
import {BENEFIT} from '../../assembled/delayedBenefit';
import {COUNT} from '../../assembled/countedGoal';
import {PRACTICE_SETTING,SKILL} from '../../assembled/skill';
import {PERFORMANCE_SETTING,PERFORMANCE} from '../../assembled/performance';
import {POSITION_SOURCE,POSITION} from '../../assembled/positionPerception';
import {createCharacterRun,prepareCharacterModel} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Mode='lost'|'retained'|'untrained'|'hidden';
export function fixture(mode:Mode){
 const b=base('success'),slots=[...items(decode(b.s.registry),'list')];
 if(slots.length!==61)throw Error('M283 expected61-slot source');
 slots.push(list([text(BENEFIT),list([])]),list([text(COUNT),list([])]));
 const body=[...items(slots[6],'list')];body[2]=q(0,1);slots[6]=list(body);
 const ret=[...items(slots[8],'list')];ret[4]=list([list([signed(5),ret[1],ret[2],u(mode==='retained'?32:0)])]);slots[8]=list(ret);
 let s=changeDefinition({...b.s,rulesVersion:WORK_CUE_RULES,registrySchemaVersion:WORK_CUE_REGISTRY,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{
  const a=items(v,'list');return ![PRACTICE_SETTING,PERFORMANCE_SETTING].some(t=>key(t)===key(a[2]))&&key(a[0])!==key(signed(5));
 });
 for(const at of [3,7])rows.push(event(at,30,PRACTICE_SETTING,list([text(SKILL),u(at===3?0:4),q(0,1),q(at===3?0:1,at===3?1:2),true,at===3&&mode!=='untrained'])));
 rows.push(event(3,30,PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([taskA,mode!=='hidden',u(0)])])])));
 for(const at of [3,4])rows.push(event(at,10,POSITION_SOURCE,list([text(POSITION),list([u(at===3?0:1),u(0),u(1),true,true,u(1)]),list([u(1),text(at===3?'Before':'Motion'),true,true])])));
 const procedures=items(items(slots[11],'list')[1],'list').map(v=>items(v,'list')),procedure=procedures.find(v=>key(v[0])===key(actionA))![1];
 return {s,d:{...b.d,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)},procedure,mode};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode){
 const b=fixture(mode),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;
 return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,taskA,actionA,cachedMemory};
export type {CanonicalValue};
