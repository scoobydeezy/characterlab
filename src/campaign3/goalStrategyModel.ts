/** goal-strategy-public/0.1-candidate: exact model/source admission and separate owners. */
import {canonicalEncode as enc,list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ACTOR,sid} from './longitudinalModel';
import {copyData} from './beliefModel';
import {goalStrategyRecord as r,decodeGoalStrategy as decode} from './goalStrategyCodecs';
export {ACTOR,sid,copyData};
export const VERSION='goal-strategy-public/0.1-candidate',OBSERVER=sid(1000,'observer/goal-strategy');
export const GOAL=semanticReferentFromAuthoredContent(sid(1038,'content/goal-strategy/delivery'));
export const STAGES=[['context',40],['plan',90],['attempt',100],['execution',110],['observe',120],['evidence',130],['goal',140],['learn',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/goal-strategy/'+name);
export const path=(root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(name:string)=>name==='context'?[path(994),path(996),path(1000)]:name==='goal'?[path(994)]:name==='plan'?[path(996)]:name==='learn'?[path(1000)]:[];
export const writes=(name:string)=>name==='goal'?[path(994)]:name==='plan'?[path(996)]:name==='learn'?[path(1000)]:[];
export const owner=(name:string)=>sid(1025,'authority/goal-strategy/'+name);
const ownership=()=>compileMutationAuthorityRegistry(['goal','plan','learn'].map(name=>({authorityName:(owner(name).payload as {value:string}).value,ownedLeaves:writes(name).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:name==='goal'?993n:name==='plan'?995n:997n},removalAllowed:false}))})));
export function goalStrategyRecipe(law=1) {
  if(![1,2,3,4].includes(law))throw Error('GOAL_PROFILE');
  const parameters=r(989,[text(VERSION),u(law)]),content=r(990,[ACTOR,OBSERVER,GOAL,sid(1027,'desired/item-at-destination'),list(['a','b'].map(n=>sid(1027,'route/goal-strategy/'+n)))]);
  const stages=STAGES.map(([name,phase])=>r(1007,[eventId(name),u(phase),list(reads(name).map(p=>statePathPatternValue(pattern(p)))),list(writes(name).map(p=>statePathPatternValue(pattern(p)))),owner(name)]));
  return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type GoalStrategySource=ReturnType<typeof goalStrategyRecipe>;
export const instant=(value:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='signed'||value.value<1n||value.value>8n)throw Error('GOAL_TIME');return Number(value.value);};
export async function compileGoalStrategyModel(input:GoalStrategySource) {
  const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),989n),law=Number(uint(f(profile,2n))),recipe=goalStrategyRecipe(law);
  for(const name of ['parameters','content','registry'] as const)if(key(decode(source[name]))!==key(decode(recipe[name])))throw Error('GOAL_EXACT_MODEL');
  const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),990n);
  const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'goal-strategy-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
  function validateState(state:AuthoritativeState) {
    decode(enc(state.canonicalValue()));
    for(const e of state.entries()) {
      const root=[994,996,1000].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));
      if(!root)throw Error('GOAL_STATE_PATH');
      const v=rec(e.value,root===994?993n:root===996?995n:997n);
      if(root!==1000) {
        if(key(f(v,1n))!==key(GOAL))throw Error('GOAL_FOREIGN_KEY');instant(f(v,3n));
        if(root===994&&(uint(f(v,2n))===2n)!==(items(f(v,4n),'list').length===1))throw Error('GOAL_FULFILLMENT_SUPPORT');
      } else {
        const routeObs=items(f(v,1n),'list'),outcome=items(f(v,2n),'list');
        const receipts=new Set<string>();
        for(const obs of routeObs) {const o=rec(obs,998n);if(![1n,2n].includes(uint(f(o,4n)))||uint(f(o,6n))===0n)throw Error('GOAL_ROUTE_EVIDENCE');const receipt=key(f(o,6n));if(receipts.has(receipt))throw Error('GOAL_DUPLICATE_RECEIPT');receipts.add(receipt);}
        for(const obs of [...routeObs,...outcome]) {const o=rec(obs,998n);if(key(f(o,2n))!==key(OBSERVER))throw Error('GOAL_FOREIGN_OBSERVER');const at=instant(f(o,3n)),issued=instant(f(o,7n)),until=instant(f(o,8n));if(issued>at||until<issued)throw Error('GOAL_EVIDENCE_TIME');}
        if(outcome.length&&uint(f(rec(outcome[0],998n),4n))!==3n)throw Error('GOAL_OUTCOME_EVIDENCE');
      }
    }
  }
  return {source,content,law,authority,modelIdentity,validateState};
}
export type GoalStrategyCompiled=Awaited<ReturnType<typeof compileGoalStrategyModel>>;
export async function compileGoalStrategyInputs(model:GoalStrategyCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array) {
  if(key(decode(initialState))!==key(set([])))throw Error('GOAL_INITIAL_STATE');
  const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('GOAL_INPUT_COUNT');
  let last=0,adopted=false;const receipts=new Map<string,string>(),readings=new Map<string,string>(),events:ScheduledEvent[]=[];
  for(const original of originals) {
    const v=rec(original,992n),at=instant(f(v,1n));if(at<=last)throw Error('GOAL_INPUT_ORDER');last=at;
    if(f(v,2n)===true){if(adopted)throw Error('GOAL_READOPTION');adopted=true;}
    const routes=new Set<bigint>();
    for(const value of items(f(v,3n),'list')) {
      const d=rec(value,991n),route=uint(f(d,2n)),receipt=key(f(d,1n)),issued=instant(f(d,4n)),until=instant(f(d,5n));
      if(routes.has(route))throw Error('GOAL_DUPLICATE_ROUTE');routes.add(route);
      if(issued>at||until<issued)throw Error('GOAL_DISPLAY_TIME');
      const content=key(list([f(d,2n),f(d,3n),f(d,4n),f(d,5n)])),reading=String(route)+'/'+issued;
      if(receipts.has(receipt)&&receipts.get(receipt)!==content)throw Error('GOAL_RECEIPT_CONFLICT');
      if(readings.has(reading)&&readings.get(reading)!==receipt)throw Error('GOAL_SIMULTANEOUS_READING');
      receipts.set(receipt,content);readings.set(reading,receipt);
    }
    if(receipts.size>8)throw Error('GOAL_RECEIPT_LIMIT');
    events.push({eventId:BigInt(events.length),eventSequence:BigInt(events.length),dueAt:simInstant(BigInt(at)),phase:40n,eventTypeId:eventId('context'),payload:original,dependencies:list([]),causalParentEventIds:[]});
  }
  const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
  return {events,runIdentity,runSeed:runSeed.slice()};
}
