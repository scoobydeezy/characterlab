/** performance-public/0.1-candidate: exact model/source admission and separate owners. */
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
import {performanceRecord as r,decodePerformance as decode} from './performanceCodecs';
export {ACTOR,sid,copyData};
export const VERSION='performance-public/0.1-candidate',OBSERVER=sid(1000,'observer/performance');
export const GOAL=semanticReferentFromAuthoredContent(sid(1038,'content/performance/delivery'));
export const STAGES=[['context',40],['plan',90],['attempt',100],['execution',110],['observe',120],['evidence',130],['goal',140],['learn',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/performance/'+name);
export const path=(root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(name:string)=>name==='context'?[path(1297),path(1299),path(1303)]:name==='goal'?[path(1297)]:name==='plan'?[path(1299)]:name==='learn'?[path(1303)]:[];
export const writes=(name:string)=>name==='goal'?[path(1297)]:name==='plan'?[path(1299)]:name==='learn'?[path(1303)]:[];
export const owner=(name:string)=>sid(1025,'authority/performance/'+name);
const ownership=()=>compileMutationAuthorityRegistry(['goal','plan','learn'].map(name=>({authorityName:(owner(name).payload as {value:string}).value,ownedLeaves:writes(name).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:name==='goal'?1296n:name==='plan'?1298n:1300n},removalAllowed:false}))})));
export function performanceRecipe(law=1) {
  if(![1,2,3,4].includes(law))throw Error('PERFORMANCE_PROFILE');
  const parameters=r(1292,[text(VERSION),u(law)]),content=r(1293,[ACTOR,OBSERVER,GOAL,sid(1027,'desired/item-at-destination'),list(['a','b'].map(n=>sid(1027,'route/performance/'+n)))]);
  const stages=STAGES.map(([name,phase])=>r(1310,[eventId(name),u(phase),list(reads(name).map(p=>statePathPatternValue(pattern(p)))),list(writes(name).map(p=>statePathPatternValue(pattern(p)))),owner(name)]));
  return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type PerformanceSource=ReturnType<typeof performanceRecipe>;
export const instant=(value:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='signed'||value.value<1n||value.value>8n)throw Error('PERFORMANCE_TIME');return Number(value.value);};
export async function compilePerformanceModel(input:PerformanceSource) {
  const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1292n),law=Number(uint(f(profile,2n))),recipe=performanceRecipe(law);
  for(const name of ['parameters','content','registry'] as const)if(key(decode(source[name]))!==key(decode(recipe[name])))throw Error('PERFORMANCE_EXACT_MODEL');
  const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1293n);
  const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'performance-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
  function validateState(state:AuthoritativeState) {
    decode(enc(state.canonicalValue()));
    for(const e of state.entries()) {
      const root=[1297,1299,1303].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));
      if(!root)throw Error('PERFORMANCE_STATE_PATH');
      const v=rec(e.value,root===1297?1296n:root===1299?1298n:1300n);
      if(root!==1303) {
        if(key(f(v,1n))!==key(GOAL))throw Error('PERFORMANCE_FOREIGN_KEY');instant(f(v,3n));
        if(root===1299&&instant(f(v,4n))>instant(f(v,3n)))throw Error('PERFORMANCE_VISIT_TIME');
        if(root===1297&&(uint(f(v,2n))===2n)!==(items(f(v,4n),'list').length===1))throw Error('PERFORMANCE_FULFILLMENT_SUPPORT');
      } else {
        const routeObs=items(f(v,1n),'list'),outcome=items(f(v,2n),'list');
        const receipts=new Set<string>();
        for(const obs of routeObs) {const o=rec(obs,1301n);if(![1n,2n].includes(uint(f(o,4n)))||uint(f(o,6n))===0n)throw Error('PERFORMANCE_ROUTE_EVIDENCE');const receipt=key(f(o,6n));if(receipts.has(receipt))throw Error('PERFORMANCE_DUPLICATE_RECEIPT');receipts.add(receipt);}
        for(const obs of [...routeObs,...outcome]) {const o=rec(obs,1301n);if(key(f(o,2n))!==key(OBSERVER))throw Error('PERFORMANCE_FOREIGN_OBSERVER');const at=instant(f(o,3n)),issued=instant(f(o,7n)),until=instant(f(o,8n));if(issued>at||until<issued)throw Error('PERFORMANCE_EVIDENCE_TIME');}
        let lastOutcome=0;const seenOutcomes=new Set<string>();for(const value of outcome){const o=rec(value,1301n),at=instant(f(o,3n)),id=key(f(o,1n));if(uint(f(o,4n))!==3n||![1n,2n].includes(uint(f(o,9n)))||at<=lastOutcome||seenOutcomes.has(id))throw Error('PERFORMANCE_OUTCOME_EVIDENCE');lastOutcome=at;seenOutcomes.add(id);}
      }
    }
  }
  return {source,content,law,authority,modelIdentity,validateState};
}
export type PerformanceCompiled=Awaited<ReturnType<typeof compilePerformanceModel>>;
export async function compilePerformanceInputs(model:PerformanceCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array) {
  if(key(decode(initialState))!==key(set([])))throw Error('PERFORMANCE_INITIAL_STATE');
  const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('PERFORMANCE_INPUT_COUNT');
  let last=0,adopted=false;const receipts=new Map<string,string>(),readings=new Map<string,string>(),events:ScheduledEvent[]=[];
  for(const original of originals) {
    const v=rec(original,1295n),at=instant(f(v,1n));if(at<=last)throw Error('PERFORMANCE_INPUT_ORDER');last=at;
    if(f(v,2n)===true){if(adopted)throw Error('PERFORMANCE_READOPTION');adopted=true;}
    const routes=new Set<bigint>();
    for(const value of items(f(v,3n),'list')) {
      const d=rec(value,1294n),route=uint(f(d,2n)),receipt=key(f(d,1n)),issued=instant(f(d,4n)),until=instant(f(d,5n));
      if(routes.has(route))throw Error('PERFORMANCE_DUPLICATE_ROUTE');routes.add(route);
      if(issued>at||until<issued)throw Error('PERFORMANCE_DISPLAY_TIME');
      const content=key(list([f(d,2n),f(d,3n),f(d,4n),f(d,5n)])),reading=String(route)+'/'+issued;
      if(receipts.has(receipt)&&receipts.get(receipt)!==content)throw Error('PERFORMANCE_RECEIPT_CONFLICT');
      if(readings.has(reading)&&readings.get(reading)!==receipt)throw Error('PERFORMANCE_SIMULTANEOUS_READING');
      receipts.set(receipt,content);readings.set(reading,receipt);
    }
    if(receipts.size>8)throw Error('PERFORMANCE_RECEIPT_LIMIT');
    events.push({eventId:BigInt(events.length),eventSequence:BigInt(events.length),dueAt:simInstant(BigInt(at)),phase:40n,eventTypeId:eventId('context'),payload:original,dependencies:list([]),causalParentEventIds:[]});
  }
  const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
  return {events,runIdentity,runSeed:runSeed.slice()};
}
