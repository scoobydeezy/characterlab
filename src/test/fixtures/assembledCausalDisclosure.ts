/** M254: body10/seed0; recognized stand-ins1..3, A-only report opportunities4/6/8.
 * Actual failure4, misleading diagnostics5, corrective diagnostics7; no learned S0. */
import {changeDefinition} from './assembledCharacter';
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,type CanonicalValue} from './assembledMultiSensor';
import {CAUSAL_DISCLOSURE_RULES,CAUSAL_DISCLOSURE_REGISTRY} from '../../assembled/model';
import {CAUSAL,CAUSAL_QUERY,CAUSAL_SOURCE,CAUSAL_CONTEXT} from '../../assembled/causalAttribution';
import {CAUSAL_TOPIC,COMM_SOURCE,LEARNED_DISCLOSURE} from '../../assembled/communication';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {SK} from '../../assembled/stakeholderKnowledge';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Mode='corrected'|'denied'|'missing'|'current'|'delivery'|'access'|'hidden'|'success';
export function fixture(mode:Mode='corrected',legacy=false){
 const original=prior('none',true,true,false),b={...original,s:changeDefinition(original.s,'definition/protocol-execution',1n,true)},slots=[...items(decode(b.s.registry),'list')],comm=items(slots[18],'list');
 const topic=list([text(CAUSAL_TOPIC),b.taskA,u(4)]);slots[18]=list([comm[0],b.action,comm[2],legacy?comm[3]:topic]);
 const rows:CanonicalValue[]=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(COMM_SOURCE)).map(v=>{
  const a=[...items(v,'list')];
  if(key(a[2])===key(PERFORMANCE_SETTING)&&key(a[0])===key(signed(4))){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');return list([x[0],mode!=='missing',u(mode==='success'?2:1)]);}))]);}
  if(key(a[2])===key(PRACTICE_SETTING)&&key(a[0])===key(signed(4))){const p=[...items(a[3],'list')];p[3]=q(0,1);a[3]=list(p);}
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=key(x[0])===key(b.taskA)?list([q(1,1)]):list([]);return list(x);}))]);}
  return list(a);
 });
 const person=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0])[0];
 rows.push(list([signed(4),u(30),OBSTRUCTION_SOURCE,list([text(SK),C,list(mode==='hidden'?[]:[person]),list([]),b.taskA,list([false,false]),list([false,false]),list([list([]),list([])])]),list([])]));
 for(const at of [4,6,8]){
  rows.push(list([signed(at),u(30),CAUSAL_CONTEXT,list([text(CAUSAL_QUERY),b.taskA,u(4),text('ProtectRoute')]),list([])]));
  rows.push(list([signed(at),u(10),COMM_SOURCE,list([text(LEARNED_DISCLOSURE),mode!=='delivery',mode!=='access',false]),list([])]));
 }
 for(const [i,at]of [5,mode==='current'?6:7].entries())rows.push(list([signed(at),u(10),CAUSAL_SOURCE,list([text(CAUSAL),b.taskA,u(4),u(i+1),!(mode==='denied'&&i===1),!!i,!!i]),list([])]));
 return {...b,topic,recipients:items(comm[2],'list'),mode,s:{...b.s,rulesVersion:CAUSAL_DISCLOSURE_RULES,registrySchemaVersion:CAUSAL_DISCLOSURE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode='corrected',legacy=false){const b=fixture(mode,legacy),k=b.s.rulesVersion+key(decode(b.s.registry));let m=models.get(k);if(!m){m=prepareCharacterModel(b.s);models.set(k,m);}const prepared=await m;return {b,m:prepared,run:cachedMemory(await createCharacterRun(prepared,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=96||!await run.settleNextInstant())throw Error('M254 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M254 skipped '+at);}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid};
export type {CanonicalValue};
