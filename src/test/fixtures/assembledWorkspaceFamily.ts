import {candidate269} from './assembledActivationCarry';
/** M263: current single composition, ordinary nonsocial sources, seed0; no learned S0. */
import {fixture as current,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB,type CanonicalValue} from './assembledPerceivedControl';
import {fixture as reappraisalPrior} from './assembledReappraisalCurrent';
import {changeDefinition} from './assembledCharacter';
import {ATTEMPT_RECEIPT_RULES,ATTEMPT_RECEIPT_REGISTRY} from '../../assembled/model';
import {INTENTION_MEMORY} from '../../assembled/intentionMemory';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {WORK,WORK_SOURCE} from '../../assembled/workMaintenance';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {PRIORITY,PRIORITY_ADOPTION,PRIORITY_DISPLAY} from '../../assembled/priority';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {BODY_SAMPLE} from '../../assembled/body';
import {CONTROL,CONTROL_SOURCE} from '../../assembled/control';
import {HABIT,HABIT_SOURCE} from '../../assembled/habit';
import {REWARD,REWARD_SOURCE} from '../../assembled/rewardExperience';
import {INTOXICATION,SLEEP_SOURCE} from '../../assembled/sleepControl';
import {fatigueFrame} from './assembledFatigue';
import {concernFrame} from './assembledRumination';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {cachedMemory} from './assembledMemoryFinal';
import {createCharacterRun,prepareCharacterModel} from '../../assembled/character';
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB};
export type {CanonicalValue};
export const event=(at:number,phase:number,type:CanonicalValue,payload:CanonicalValue)=>list([signed(at),u(phase),type,payload,list([])]);
export const actionA=sid(1027,'definition/protocol-contact-one'),actionB=sid(1027,'definition/protocol-contact-two');
const base=current();
export type Mode='work'|'rested'|'fatigue'|'load'|'rumination'|'unbroken'|'failure'|'success';
export function fixture(mode:Mode,support=false,distractor=3,capacity=mode==='work'?2:6){
 const b=structuredClone(base),slots=[...items(decode(b.s.registry),'list')];slots.push(list([text(INTENTION_MEMORY),list([])]));
 slots[47]=list([text(WORK),support,list(mode==='work'?[taskA,taskB]:[])]);
 const actuator=items(slots[10],'list');slots[10]=list([actuator[0],actuator[1],set(items(actuator[2],'set').map(v=>{const a=items(v,'list');return list([a[0],q(0,1),u(0)]);}))]);
 let s={...b.s,rulesVersion:ATTEMPT_RECEIPT_RULES,registrySchemaVersion:ATTEMPT_RECEIPT_REGISTRY,registry:enc(list(slots))};
 s=changeDefinition(s,'definition/task-workspace',2n,u(capacity));
 for(const name of ['task-a','task-b','configurable-garden'])for(const [field,value] of [[3n,q(1,1)],[4n,q(1,1)],[5n,signed(1)],[6n,signed(mode==='work'?9:12)]] as const)s=changeDefinition(s,'definition/'+name,field,value);
 s=changeDefinition(changeDefinition(s,'definition/protocol-execution',1n,true),'definition/protocol-observation',4n,false);
 const old=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')),probe=old.find(a=>key(a[2])===key(PROBE_SOURCE_EVENT))!;
 const frame=old.filter(a=>key(a[0])===key(signed(10))&&((key(a[1])===key(u(30))&&key(a[2])!==key(DISPLAY))||key(a[2])===key(sid(1001,'event/deliberation-opportunity'))));
 if(!frame.some(a=>key(a[2])===key(sid(1001,'event/deliberation-opportunity'))))throw Error('M263 missing decision frame');
 const tasks=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]),monitor=mode==='failure'||mode==='success';
 const times=mode==='work'?[6,7,8,9,10]:monitor?[3,5,7]:[3,5,7,9,11];
 const rows:CanonicalValue[]=[list([signed(1),...probe.slice(1)])];
 rows.push(event(1,30,DISPLAY,list([text(STRATEGY),list(tasks.flatMap(t=>[0,1].map(route=>list([t,u(route),u(route+1),monitor?key(t)===key(taskA):key(t)===key(taskA)?route===0:key(t)===key(taskB)?route===(mode==='work'?1:0):false,u(1),u(11),true]))))])));
 for(const at of [1,...times]){
  const goals=tasks.map(t=>{const importance=q(key(t)===key(taskA)||!monitor&&key(t)===key(taskB)?1:0,1),route=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')).find(r=>key(r[0])===key(t))!;
   return list([t,at===1?list([importance]):list([]),true,list([importance]),true,...(at===1?[list([route[mode==='work'&&key(t)===key(taskB)?2:1]])]:[])]);});
  rows.push(event(at,10,PRIORITY_DISPLAY,list([text(at===1?PRIORITY_ADOPTION:PRIORITY),list(goals)])));
 }
 for(const at of times)rows.push(...frame.map(a=>list([signed(at),...a.slice(1)])));
 if(mode==='work')for(const at of [5,6,7,8,9])rows.push(event(at,110,WORK_SOURCE,list([text(WORK),true,at===7||at===9,false,list([2,at===5?1:distractor,0].map((p,i)=>list([u(i+1),true,u(p)])))])));
 else if(monitor)for(const at of [3,5,7])rows.push(event(at,30,PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([taskA,true,u(mode==='failure'?1:2)])])])));
 else {
  for(const at of [3,5,7,9,11]){
   rows.push(event(at,10,HABIT_SOURCE,list([text(HABIT),true,true,false,false,false,u(0)])));
   rows.push(event(at,10,SLEEP_SOURCE,list([text(INTOXICATION),true,list([true,true,true,true]),list([signed(0),signed(0),signed(0),signed(0)]),u(0)])));
  }
  rows.push(event(3,10,REWARD_SOURCE,list([text(REWARD),true,signed(0),true,false])));
  for(const at of [4,5,7,9,11])rows.push(event(at,10,CONTROL_SOURCE,list([text(CONTROL),u(at===4?1:0),at!==4,true,mode==='load'&&at===7,true,u(0)])));
  if(mode==='rumination'||mode==='unbroken')rows.push(...[4,5,7,9,11].map(at=>concernFrame(at,at===4?1:at===9?2:0,mode==='rumination'&&at===7)));
  else rows.push(fatigueFrame(4,mode==='fatigue'?2:0),fatigueFrame(6,0,0,false),fatigueFrame(8,0));
 }
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 return candidate269({s,d:{...b.d,initialState:enc(new AuthoritativeState(initial.entries().filter(e=>e.path.rootStateTypeId!==373n)).canonicalValue()),runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))},mode,times});
}
export function reappraisal(mode:'complete'|'interrupted'){
 const b=structuredClone(base),old=reappraisalPrior(mode),slots=[...items(decode(b.s.registry),'list')],prior=items(decode(old.s.registry),'list');
 slots[6]=prior[6];slots[19]=prior[19];slots[28]=prior[28];slots.push(list([text(INTENTION_MEMORY),list([])]));
 let s={...b.s,rulesVersion:ATTEMPT_RECEIPT_RULES,registrySchemaVersion:ATTEMPT_RECEIPT_REGISTRY,registry:enc(list(slots))};
 for(const v of items(prior[0],'set'))if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n){const id=f(v,1n);if(typeof id!=='boolean'&&id.kind==='typedIdentifier'&&typeof id.payload!=='boolean'&&id.payload.kind==='text'&&['definition/task-a','definition/task-b'].includes(id.payload.value))for(const field of [3n,4n,5n,6n])s=changeDefinition(s,id.payload.value,field,f(f(v,4n) as Extract<CanonicalValue,{kind:'record'}>,field));}
 s=changeDefinition(changeDefinition(s,'definition/protocol-execution',1n,true),'definition/protocol-observation',4n,false);
 // These nonsocial tasks have no social consumer; keep the original perceived threat/operation sources.
 return candidate269({s,d:{...b.d,runSeed:old.d.runSeed,orderedInputs:enc(list(items(decode(old.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE))))}});
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start<T extends ReturnType<typeof fixture>|ReturnType<typeof reappraisal>>(b:T){const k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export type Run=Awaited<ReturnType<typeof start>>['r'];
export async function through(r:Run,at:number){for(let n=0;r.snapshot().clock<BigInt(at);n++)if(n>=128||!await r.settleNextInstant())throw Error('M263 missing instant '+at);if(r.snapshot().clock!==BigInt(at))throw Error('M263 skipped '+at);}
export async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M263 queue cap');}
