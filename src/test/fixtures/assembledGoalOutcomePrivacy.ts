/** M235 fixed nonsocial B/body10; independent opportunity, difficulty and feedback access. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledGoalStrategyCurrent';
import {CRITERION_RULES,CRITERION_REGISTRY} from '../../assembled/model';
import {OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['visibleBlocked','visibleIncompetent','visibleSuccess','hiddenBlocked','hiddenSuccess'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof prior>|undefined;
export function fixture(name:Case){
 const b=base??(base=prior('retained')),hidden=name.startsWith('hidden'),blocked=name.endsWith('Blocked'),incompetent=name==='visibleIncompetent',success=!blocked&&!incompetent;
 const slots=items(decode(b.s.registry),'list'),actuators=items(items(slots[10],'list')[2],'set');
 for(const action of b.actions){const e=items(actuators.find(v=>key(items(v,'list')[0])===key(action))!,'list');if(key(e[1])!==key(q(0,1))||uint(e[2])!==0n)throw Error('M235 requires original zero amount/delay');}
 const original=items(decode(b.d.orderedInputs),'list'),extended=[...original,...original.filter(v=>at(items(v,'list')[0])===4n).map(v=>list([signed(5),...items(v,'list').slice(1)]))];
 const inputs=extended.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OPPORTUNITY_SOURCE)){const p=items(a[3],'list');a[3]=list([...p.slice(0,2),set(items(p[2],'set').map(v=>{const r=items(v,'list');return list([r[0],b.actions.some(action=>key(action)===key(r[0]))?!blocked:r[1]]);}))]);}
  if(key(a[2])===key(PRACTICE_SETTING)){const p=[...items(a[3],'list')];p[3]=q(incompetent?1:0,1);a[3]=list(p);}
  if(key(a[2])===key(PERFORMANCE_SETTING)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=items(v,'list');return list([r[0],!hidden,r[2]]);}))]);}return list(a);
 });
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>e.path.rootStateTypeId!==302n));
 return {...b,s:{...b.s,rulesVersion:CRITERION_RULES,registrySchemaVersion:CRITERION_REGISTRY},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(inputs))},hidden,blocked,incompetent,success};
}
let model:ReturnType<typeof prepareCharacterModel>|undefined;
export async function start(name:Case){const b=fixture(name),m=await(model??(model=prepareCharacterModel(b.s)));return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
