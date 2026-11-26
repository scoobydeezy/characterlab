/** M274 native mapping: one nonsocial receive-benefit goal, original offer/world frames. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,taskA,taskB,actionA,actionB,type CanonicalValue} from './assembledWorkspaceFamily';
import {cases,seed} from '../delayedFixtures';
import {changeDefinition} from './assembledCharacter';
import {BENEFIT_RULES,BENEFIT_REGISTRY} from '../../assembled/model';
import {BENEFIT,BENEFIT_SOURCE} from '../../assembled/delayedBenefit';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {DISPLAY} from '../../assembled/strategy';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,taskA,taskB,actionA,actionB,restorePreparedCharacterRun,cachedMemory};
export type {CanonicalValue};
export function fixture(name:keyof ReturnType<typeof cases>='main',curve=1){
 const b=base('success'),slots=[...items(decode(b.s.registry),'list')],route=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(taskA))!,originals=cases()[name],mode=uint(f(rec(originals[0],1381n),10n));
 slots.push(list([text(BENEFIT),list([list([taskA,sid(1027,'benefit/delayed-unit'),route[1],route[2],u(curve),u(mode)])])]));
 let s=changeDefinition({...b.s,rulesVersion:BENEFIT_RULES,registrySchemaVersion:BENEFIT_REGISTRY,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 const old=items(decode(b.d.orderedInputs),'list'),rows:CanonicalValue[]=[];
 for(const v of old){const a=[...items(v,'list')],at=(a[0] as {value:bigint}).value;if(at!==1n&&at!==3n||key(a[2])===key(PERFORMANCE_SETTING))continue;
  if(at===3n)a[0]=signed(2);
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')],value=q(key(x[0])===key(taskA)?1:0,1);if(items(x[1],'list').length)x[1]=list([value]);x[3]=list([value]);return list(x);}))]);}
  if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=key(x[0])===key(taskA);return list(x);}))]);}
  rows.push(list(a));
 }
 for(const v of originals){const r=rec(v,1381n),at=f(r,1n);rows.push(list([at,u(10),BENEFIT_SOURCE,list([text(BENEFIT),list(items(f(r,2n),'list').map(v=>{const o=rec(v,1380n);return list([1n,2n,3n,4n,5n].map(n=>f(o,n)));})),...[3n,4n,5n,6n,7n,8n,9n,10n].map(n=>f(r,n))]),list([])]));}
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows)),runSeed:seed},name,curve,originals};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(b:ReturnType<typeof fixture>){const k=key(decode(b.s.registry))+key(decode(b.s.parameters));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export type Run=Awaited<ReturnType<typeof start>>['r'];
export async function through(r:Run,at:number){for(let i=0;r.snapshot().clock<BigInt(at);i++)if(i>=128||!await r.settleNextInstant())throw Error('M274 missing instant '+at);if(r.snapshot().clock!==BigInt(at))throw Error('M274 skipped instant '+at);}
export async function finish(r:Run){for(let i=0;i<128;i++)if(!await r.settleNextInstant())return;throw Error('M274 queue cap');}
