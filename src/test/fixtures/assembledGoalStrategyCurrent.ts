/** M231: one nonsocial task B; empty goals, body10, fixed0.149 laws, seed7.
 * Route frames come from the original public apparatus. Completion is not mapped here. */
import {fixture as current,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,type CanonicalValue} from './assembledRewardOutcomeBoundaries';
import {taskB as task} from './assembledDecisionRegimes';
import {cases} from '../goalStrategyFixtures';
import {changeDefinition} from './assembledCharacter';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {PRIORITY,PRIORITY_ADOPTION,PRIORITY_DISPLAY} from '../../assembled/priority';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {BODY_SAMPLE,BODY_OBSERVER,BODY_DEFINITION} from '../../assembled/body';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {SELF_CONTEXT} from '../../assembled/selfBelief';
import {VALUES_CONTEXT} from '../../assembled/values';
import {SKILL,PRACTICE_SETTING,sid} from '../../assembled/skill';
import {cognitiveRecord as r} from '../../assembled/codecs';
export const names=['switchGap','retained','denied','noDisplay','expiry','duplicate','noAdoption'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof current>|undefined;
export function fixture(name:Case){
 const b=base??(base=current('diversified')),slots=[...items(decode(b.s.registry),'list')],routes=items(items(slots[12],'list')[1],'list'),route=items(routes.find(v=>key(items(v,'list')[0])===key(task))!,'list'),defs=items(slots[0],'set');
 const actions=route.slice(1).map(instruction=>f(rec(f(rec(defs.find(v=>key(f(rec(v,171n),1n))===key(instruction))!,171n),4n),389n),1n));
 const allActions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 const body=[...items(slots[6],'list')];body[1]=q(100,1);body[2]=q(0,1);body[3]=q(1,1);body[4]=q(60,1);slots[6]=list(body);
 const social=items(slots[19],'list');slots[19]=list([social[0],list(items(social[1],'list').map(v=>{const a=items(v,'list');return list([a[0],list(items(a[1],'list').filter(v=>key(items(v,'list')[0])!==key(task)))]);}))]);
 let s={...b.s,registry:enc(list(slots))};for(const [field,value]of [[3n,q(7,1)],[4n,q(9,1)],[5n,signed(1)],[6n,signed(101)]] as const)s=changeDefinition(s,'definition/task-b',field,value);
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>e.path.rootStateTypeId!==373n));
 const contexts=items(decode(b.d.orderedInputs),'list').filter(v=>at(items(v,'list')[0])===4n&&[IDENTITY_CONTEXT,SELF_CONTEXT,VALUES_CONTEXT].some(k=>key(k)===key(items(v,'list')[2])));
 if(contexts.length!==3)throw Error('M231 expected current three required contexts');
 const source=cases(),frames=name==='switchGap'?source.main.slice(0,6):source[name],inputs:CanonicalValue[]=[];
 const emit=(t:number,phase:number,event:CanonicalValue,payload:CanonicalValue)=>inputs.push(list([signed(t),u(phase),event,payload,list([])]));
 emit(1,110,sid(1001,'event/regulatory-diagnostic-probe'),r(333,[sid(1027,'definition/regulatory-diagnostic-probe')]));
 for(const row of frames){const o=rec(row,992n),t=Number(at(f(o,1n)))+1,adopt=f(o,2n)===true;
  for(const v of contexts){const a=items(v,'list');inputs.push(list([signed(t),...a.slice(1)]));}
  emit(t,10,PRIORITY_DISPLAY,list([text(adopt?PRIORITY_ADOPTION:PRIORITY),list([list([task,list(adopt?[q(1,1)]:[]),true,list([q(1,1)]),true,...(adopt?[list([route[1]])]:[])])])]));
  emit(t,10,BODY_SAMPLE,r(459,[BODY_OBSERVER,BODY_DEFINITION]));
  emit(t,30,DISPLAY,list([text(STRATEGY),list(items(f(o,3n),'list').map(v=>{const d=rec(v,991n);return list([task,u(uint(f(d,2n))-1n),f(d,1n),f(d,3n),u(at(f(d,4n))+1n),u(at(f(d,5n))+1n),f(d,6n)]);}))]));
  emit(t,30,PRACTICE_SETTING,list([text(SKILL),u(4),q(0,1),q(0,1),true,false]));
  emit(t,30,PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([task,f(o,9n),u(0)])])]));
  emit(t,40,sid(1001,'event/deliberation-opportunity'),r(377,[BODY_OBSERVER,sid(1027,'definition/task-workspace')]));
  emit(t,100,OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(allActions.map(a=>{const i=actions.findIndex(v=>key(v)===key(a));return list([a,i<0||f(o,BigInt(i+4))===true&&f(o,6n)===false&&f(o,7n)===true]);}))]));
 }
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(inputs)),runSeed:new Uint8Array(32).fill(7)},task,actions,instruction:route[1],frames,last:frames.length+1};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof start>>['run'],t:bigint){for(let n=0;run.snapshot().clock<t;n++){if(n>=48||!await run.settleNextInstant())throw Error('M231 did not reach '+t);}if(run.snapshot().clock!==t)throw Error('M231 skipped instant');}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
