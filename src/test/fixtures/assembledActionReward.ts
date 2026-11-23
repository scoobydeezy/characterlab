/** One common task, body10; ordinary stand-in evidence1..3; practice4..7.
 * Distinct one-contact actions; one physical reward axis resets to0 and admits observed gain after own attempts. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,type CanonicalValue} from './assembledMultiCurrent';
import {ACTION_REWARD_RULES,ACTION_REWARD_REGISTRY} from '../../assembled/model';
import {ACTION_REWARD,REWARD_SOURCE,rewardBodyPath,rewardValue as anchor} from '../../assembled/rewardExperience';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {VALUES_CONTEXT,VALUES} from '../../assembled/values';
import {HABIT,HABIT_SOURCE} from '../../assembled/habit';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
import {changeDefinition} from './assembledCharacter';
export type Options={diverse?:boolean;permitted?:boolean;learn?:boolean;demand?:boolean;available?:boolean;blocked?:boolean;masked?:boolean};
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
let base:ReturnType<typeof prior>|undefined;
export function fixture(o:Options={}){
 const b=base??(base=prior('none',true,true,false)),slots=[...items(decode(b.s.registry),'list')],defs=items(slots[0],'set'),routes=items(items(slots[12],'list')[1],'list'),route=items(routes.find(v=>key(items(v,'list')[0])===key(b.taskA))!,'list');
 const actions=route.slice(1).map(instruction=>f(rec(f(rec(defs.find(v=>key(f(rec(v,171n),1n))===key(instruction))!,171n),4n),389n),1n));
 // Keep the declared primary habit first, with no action/name-specific runtime branch.
 const target=items(slots[16],'list')[1];if(key(actions[0])!==key(target))throw Error('primary route/habit correspondence');
 const actuator=items(slots[10],'list');slots[10]=list([actuator[0],o.blocked!==true,set(items(actuator[2],'set').map(v=>{const a=items(v,'list');return actions.some(x=>key(x)===key(a[0]))?list([a[0],q(0,1),u(0)]):v;}))]);
 slots[57]=list([text(ACTION_REWARD),list(actions),b.taskA,u(0),u(1000),u(1000),u(10)]);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>key(list([u(e.path.rootStateTypeId),u(e.path.fieldId)]))===key(list([u(455),u(4)]))?{...e,value:anchor(0n,0)}:e));
 const original=items(decode(b.d.orderedInputs),'list'),opportunity=(v:CanonicalValue)=>(items(v,'list')[2] as {payload:{value:string}}).payload.value==='event/deliberation-opportunity';
 const rows=original.filter(v=>at(items(v,'list')[0])<=3n&&!opportunity(v)&&![DISPLAY,PERFORMANCE_SETTING].some(k=>key(k)===key(items(v,'list')[2]))).map(v=>{
  const a=[...items(v,'list')];if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(at(a[0])===1n)r[1]=list([q(1,1)]);r[3]=list([]);return list(r);}))]);}return list(a);
 });
 const template=original.filter(v=>at(items(v,'list')[0])===8n&&![DISPLAY,PERFORMANCE_SETTING,HABIT_SOURCE,REWARD_SOURCE].some(k=>key(k)===key(items(v,'list')[2])));
 for(let t=4;t<=11;t++){
  for(const v of t===8?[]:template){const a=[...items(v,'list')];a[0]=signed(t);
   if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[1]=list([]);r[3]=key(r[0])===key(b.taskA)?list([q(1,1)]):list([]);return list(r);}))]);}
   if(key(a[2])===key(VALUES_CONTEXT))a[3]=list([text(VALUES),false,signed(1)]);
   rows.push(list(a));
  }
  const practice=t<=7?[actions[o.diverse!==false&&(t===5||t===7)?1:0]]:[];
  rows.push(list([signed(t),u(10),REWARD_SOURCE,list([text(ACTION_REWARD),o.permitted!==false,signed(o.masked?-1000:0),o.learn!==false,list(practice)]),list([])]),
   list([signed(t),u(10),HABIT_SOURCE,list([text(HABIT),true,true,false,false,true,u(0)]),list([])]));
 }
 for(const t of [3,8])rows.push(list([signed(t),u(30),DISPLAY,list([text(STRATEGY),list(routes.flatMap(v=>{const a=items(v,'list');return [0,1].map(i=>list([a[0],u(i),u((t===3?1:3)+i),t===3||i===1&&o.available!==false,u(t),u(101),true]));}))]),list([])]));
 let s=changeDefinition({...b.s,rulesVersion:ACTION_REWARD_RULES,registrySchemaVersion:ACTION_REWARD_REGISTRY,registry:enc(list(slots))},'definition/protocol-execution',1n,true);
 // Equal one-contact practice doses: seven successful executions fit inherited ADAPT scale10.
 const originalCounts=actions.map(action=>uint(f(rec(f(rec(defs.find(v=>key(f(rec(v,171n),1n))===key(action))!,171n),4n),391n),1n)));
 if(originalCounts.join(',')!=='1,2')throw Error('inherited action count changed');
 s=changeDefinition(s,(actions[1] as {payload:{value:string}}).payload.value,1n,u(1));
 if(o.demand===false)s=changeDefinition(s,'definition/task-a',6n,signed(8));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)},task:b.taskA,actions};
}
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(o:Options={}){const b=fixture(o),k=key(decode(b.s.registry));let pending=prepared.get(k);if(!pending){pending=prepareCharacterModel(b.s);prepared.set(k,pending);}const m=await pending;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof start>>['run'],t:bigint){for(let n=0;run.snapshot().clock<t;n++){if(n>=48||!await run.settleNextInstant())throw Error('did not reach '+t);}if(run.snapshot().clock!==t)throw Error('skipped instant');}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at};
export type {CanonicalValue};
