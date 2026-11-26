/** Nonsocial independent count goals; ordinary adoption/routes/choices, seed7. */
import {fixture as base,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,taskA,taskB,actionA,actionB,type CanonicalValue} from './assembledWorkspaceFamily';
import {changeDefinition} from './assembledCharacter';
import {COUNTED_RULES,COUNTED_REGISTRY} from '../../assembled/model';
import {COUNT,COUNT_SOURCE,countPath,countStatus,countProgress,countWorld} from '../../assembled/countedGoal';
import {BENEFIT} from '../../assembled/delayedBenefit';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {HORIZON,HORIZON_DISPLAY} from '../../assembled/horizon';
import {DISPLAY} from '../../assembled/strategy';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,taskA,taskB,actionA,actionB,restorePreparedCharacterRun,cachedMemory,countPath,countStatus,countProgress,countWorld};
export type {CanonicalValue};
export function fixture(mode:'actual'|'hidden'|'hiddenFailed'|'false'|'true'|'negative'|'noAttempt'='actual'){
 const b=base('success'),slots=[...items(decode(b.s.registry),'list')],routes=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')),A=routes.find(v=>key(v[0])===key(taskA))!,B=routes.find(v=>key(v[0])===key(taskB))!;
 slots.push(list([text(BENEFIT),list([])]),list([text(COUNT),list([[taskA,A[1],u(1)],[taskB,B[2],u(3)]].map(a=>list([...a,u(mode==='false'||mode==='true'?1:mode==='negative'?2:0)])))]));
 let s=changeDefinition({...b.s,rulesVersion:COUNTED_RULES,registrySchemaVersion:COUNTED_REGISTRY,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 s=changeDefinition(s,'definition/protocol-contact-two',1n,u(1));
 s=changeDefinition(changeDefinition(s,'definition/task-a',6n,signed(5)),'definition/task-b',6n,signed(8));
 const old=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')),rows:CanonicalValue[]=[];
 for(const at of [1,2,3,4,5,6,7])for(const prior of old.filter(a=>(a[0] as {value:bigint}).value===(at===1?1n:3n))){
  if(key(prior[2])===key(PERFORMANCE_SETTING))continue;const a=[...prior];a[0]=signed(at);
  if(mode==='noAttempt'&&at>1&&key(a[2])!==key(PRIORITY_DISPLAY))continue;
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')],value=q(key(x[0])===key(taskA)||key(x[0])===key(taskB)?1:0,1);if(items(x[1],'list').length)x[1]=list([value]);x[3]=list([value]);if(x.length===6&&key(x[0])===key(taskB))x[5]=list([B[2]]);return list(x);}))]);}
  if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=key(x[0])===key(taskA)?uint(x[1])===0n:key(x[0])===key(taskB)?uint(x[1])===1n:false;return list(x);}))]);}
  rows.push(list(a));
 }
 rows.push(list([signed(1),u(10),HORIZON_DISPLAY,list([text(HORIZON),list([list([taskB,list([u(5),true]),true])])]),list([])]));
 for(let at=1;at<=8;at++)rows.push(list([signed(at),u(10),COUNT_SOURCE,list([text(COUNT),list([taskA,taskB].map(task=>list([task,mode!=='false'&&mode!=='hiddenFailed',mode!=='hidden'&&mode!=='hiddenFailed',true])))]),list([])]));
 return {s,d:{...b.d,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32).fill(7)},mode};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(b:ReturnType<typeof fixture>){const k=key(decode(b.s.registry))+key(decode(b.s.parameters));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export type Run=Awaited<ReturnType<typeof start>>['r'];
export async function through(r:Run,at:number){for(let i=0;r.snapshot().clock<BigInt(at);i++)if(i>=128||!await r.settleNextInstant())throw Error('M276 missing instant '+at);if(r.snapshot().clock!==BigInt(at))throw Error('M276 skipped instant '+at);}
export async function finish(r:Run){for(let i=0;i<128;i++)if(!await r.settleNextInstant())return;throw Error('M276 queue cap');}
