/** M253: current one-character scene; body10/seed0; two social tasks, third unknown.
 * Eight misleading trial claims then nine contradictions; probes9/10/18.
 * Normal C1 recognition, no learned S0. Recall delay20 isolates prior-belief probes. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,type CanonicalValue} from './assembledMultiSensor';
import {BELIEF_CONFIDENCE_RULES,BELIEF_CONFIDENCE_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE,SOCIAL_TRIAL} from '../../assembled/social';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Mode='corrected'|'hidden'|'accurate'|'denied'|'unknown'|'no-opportunity';
const base=()=>prior('none',true,false,false);
export function fixture(mode:Mode='corrected',legacy=false){
 const b=base(),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')];ret[3]=u(20);slots[8]=list(ret);
 const old=items(decode(b.d.orderedInputs),'list'),template=items(old.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list'),rows:CanonicalValue[]=[];
 for(const v of old){const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE))continue;
  for(const [before,after]of [[4,9],[6,10],[8,18]])if(key(a[0])===key(signed(before))){a[0]=signed(after);break;}
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const g=[...items(v,'list')];if([b.taskA,b.taskB].some(t=>key(t)===key(g[0])))g[3]=list([q(1,1)]);return list(g);}))]);}
  rows.push(list(a));
 }
 const count=mode==='accurate'?1:17;
 for(let at=1;at<=count;at++){
  const p=[...items(template[3],'list')],positive=at<=8&&mode!=='accurate';
  p[1]=list([text(SOCIAL_TRIAL),mode==='hidden',u(1),u(positive?3:4),u(at),mode!=='denied'||at<=8,true,mode==='hidden',mode!=='unknown'&&(mode!=='no-opportunity'||at<=8),true]);
  const movement=[...items(p[3],'list')];movement[0]=at>1;p[3]=list(movement);
  rows.push(list([signed(at),...template.slice(1,3),list(p),template[4]]));
 }
 return {...b,mode,s:{...b.s,rulesVersion:legacy?b.s.rulesVersion:BELIEF_CONFIDENCE_RULES,registrySchemaVersion:legacy?b.s.registrySchemaVersion:BELIEF_CONFIDENCE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode='corrected',legacy=false){const b=fixture(mode,legacy),k=b.s.rulesVersion+key(decode(b.s.registry));let m=models.get(k);if(!m){m=prepareCharacterModel(b.s);models.set(k,m);}const prepared=await m;return {b,m:prepared,run:cachedMemory(await createCharacterRun(prepared,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=160||!await run.settleNextInstant())throw Error('M253 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M253 skipped '+at);}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid};
export type {CanonicalValue};
