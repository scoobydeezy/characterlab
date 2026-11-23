/** M232: nonsocial B, body10, goal5.2..5.3, seed7; actual exposure4, optional probe5/7. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledGoalStrategyCurrent';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {AUTHORED_FACT_EVENT,PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {campaign2Record as cr} from '../../campaign2/codecs';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {changeDefinition} from './assembledCharacter';
import {DISPLAY} from '../../assembled/strategy';
export const names=['revealed1','revealed0','hidden1','hidden0','externalNoRoute2','externalNoRoute0'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof prior>|undefined;
export function fixture(name:Case){
 const b=base??(base=prior('retained')),hidden=name.startsWith('hidden'),noRoute=name.startsWith('external'),count=name.endsWith('2')?2:name.endsWith('1')?1:0;
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>e.path.rootStateTypeId!==302n));
 const original=items(decode(b.d.orderedInputs),'list'),inputs=original.flatMap(v=>{const a=[...items(v,'list')],t=at(a[0]);if(noRoute&&key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list([])]);}if(t!==4n)return [list(a)];return [6,8].map(t=>list([signed(t),...a.slice(1)]));});
 inputs.push(list([signed(4),u(110),AUTHORED_FACT_EVENT,cr('AuthoredActualAdaptationFact',{Fact:cr('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:u(count)})}),list([])]));
 if(!hidden)for(const t of [5,7])inputs.push(list([signed(t),u(110),PROBE_SOURCE_EVENT,r(333,[sid(1027,'definition/regulatory-diagnostic-probe')]),list([])]));
 let s=changeDefinition(b.s,'definition/task-b',3n,q(52,10));s=changeDefinition(s,'definition/task-b',4n,q(53,10));
 return {...b,s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(inputs))},hidden,noRoute,count};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof start>>['run'],t:bigint){for(let n=0;run.snapshot().clock<t;n++){if(n>=48||!await run.settleNextInstant())throw Error('M232 did not reach '+t);}if(run.snapshot().clock!==t)throw Error('M232 skipped instant');}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
