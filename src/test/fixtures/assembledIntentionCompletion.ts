/** M260 fixed sensor windows, nonsocial instruction task, no learned S0.
 * Item execution and sensed completion use existing owners and shared phase140.
 * Body30/rate10; instructed actions deliver0 body units. Seed0, laws unchanged. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,type CanonicalValue} from './assembledIntentionMemory';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {CRITERION_VERSION} from '../../assembled/criterionSensing';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {WORK_SOURCE} from '../../assembled/workMaintenance';
import {changeDefinition} from './assembledCharacter';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const cases=['main','blocked','hidden','hiddenBlocked','falseReceipt','trueReceipt','routeB','lateCue'] as const;
export type Case=typeof cases[number];
export const target=sid(1601,'item/intended-parcel'),origin=sid(1602,'place/intention-origin'),destination=sid(1602,'place/intention-destination');
const sources=new Map<boolean,ReturnType<typeof prior>['s']>();
export function fixture(name:Case){
 const failed=['blocked','hiddenBlocked','falseReceipt'].includes(name),hidden=['hidden','hiddenBlocked'].includes(name),late=name==='lateCue',b=prior({failed,route:name==='routeB'?1:0});
 let s=sources.get(failed);if(!s){
  s=changeDefinition(changeDefinition(b.s,'definition/task-a',3n,q(1,1)),'definition/task-a',4n,q(1,1));
  const slots=[...items(decode(s.registry),'list')],actions=b.route.plans.map(p=>p.actionId),actuator=items(slots[10],'list');
  slots[10]=list([actuator[0],actuator[1],set(items(actuator[2],'set').map(v=>{const a=items(v,'list');return actions.some(x=>key(x)===key(a[0]))?list([a[0],q(0,1),a[2]]):v;}))]);
  slots[59]=list([text(SENSOR_BINDING),set([target]),set([origin,destination]),list(actions.map(action=>list([action,target,destination]))),list([taskA,target,destination])]);
  s={...s,registry:enc(list(slots))};sources.set(failed,s);
 }
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>e.path.rootStateTypeId!==1600n),{path:itemPath(target),value:origin}]);
 const original=items(decode(b.d.orderedInputs),'list'),probe=items(original.find(v=>key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT))!,'list'),board=items(original.find(v=>key(items(v,'list')[2])===key(WORK_SOURCE))!,'list');
 const rows=original.filter(v=>![PROBE_SOURCE_EVENT,WORK_SOURCE].some(t=>key(items(v,'list')[2])===key(t)));
 rows.push(list([signed(1),u(120),...probe.slice(2)]));
 for(const t of late?[5]:[4,5])rows.push(list([signed(t),...board.slice(1)]));
 if(!hidden)rows.push(list([signed(late?6:5),u(120),PROBE_SOURCE_EVENT,list([text(CRITERION_VERSION),probe[3],signed(name==='falseReceipt'?10:0)]),probe[4]]));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},name,failed,hidden,late,route:b.route,actionAt:late?6n:5n};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=128||!await run.settleNextInstant())throw Error('M260 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M260 skipped '+at);}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA};
export type {CanonicalValue};
