/** lying-public/0.1-candidate: choice, delivery and three private owners. */
import {canonicalEncode as enc,list,set,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
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
import {receivingRecord as old} from './receivingCodecs';
import {lyingRecord as r,decodeLying as decode} from './lyingCodecs';
export {ACTOR,sid,copyData};
export const VERSION='lying-public/0.1-candidate',HOLDERS=['speaker','a','b'].map(n=>sid(1000,'observer/lying/'+n));
export const TASKS=['informing','misdirection'].map(n=>old(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/lying/'+n))]));
export const OPTIONS=['truthful-assert','contrary-assert'].map(n=>old(395,[ACTOR,sid(1027,'action/lying/'+n)]));
export const STAGES=[['source',0],['observe-private',10],['learn-private',30],['probe-a',40],['probe-b',40],['context',40],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['execute',110],['observe-a',120],['observe-b',120],['learn-a',140],['learn-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/lying/'+n),index=(n:string)=>n.endsWith('-a')?1:n.endsWith('-b')?2:0;
export const path=(i:number):StatePath=>({rootStateTypeId:1087n,fieldId:1n,selectors:[{kind:'mapKey',key:HOLDERS[i]}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>n==='context'||n.startsWith('probe')||n.startsWith('learn')?[path(index(n))]:[];
export const writes=(n:string)=>n.startsWith('learn')?[path(index(n))]:[];
export const owner=(n:string)=>sid(1025,'authority/lying-holder-'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1,2].map(i=>({authorityName:'authority/lying-holder-'+i,ownedLeaves:[{pattern:pattern(path(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1086n},removalAllowed:false}]})));
export function lyingRecipe(law=1,pressure=1){
 if(![1,2,3,4,5,6].includes(law)||![1,2,3].includes(pressure))throw Error('LYING_PROFILE');const modifier=old(439,[q(1,4),u(3)]),dice=old(437,[old(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),modifier,modifier]);
 const parameters=r(1083,[text(VERSION),u(law),u(pressure)]),content=r(1097,[ACTOR,list(HOLDERS),list(TASKS),list(OPTIONS),dice]),stages=STAGES.map(([n,p])=>r(1096,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type LyingSource=ReturnType<typeof lyingRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('LYING_TIME');return Number(v.value);};
export async function compileLyingModel(input:LyingSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1083n),law=Number(uint(f(profile,2n))),pressure=Number(uint(f(profile,3n))),recipe=lyingRecipe(law,pressure);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('LYING_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1097n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'lying-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const i=[0,1,2].find(i=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(i)))));if(i===undefined)throw Error('LYING_STATE_PATH');let last=0;const seen=new Set<string>();
  for(const x of items(f(rec(e.value,1086n),1n),'list')){const o=rec(x,1085n),at=instant(f(o,3n));if(at<=last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(HOLDERS[i])||items(f(o,4n),'list').length!==1)throw Error('LYING_EVIDENCE');last=at;seen.add(key(f(o,1n)));}
 }}return {source,law,pressure,content,authority,modelIdentity,validateState};}
export type LyingCompiled=Awaited<ReturnType<typeof compileLyingModel>>;
export async function compileLyingInputs(model:LyingCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('LYING_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('LYING_INPUT_COUNT');let last=0;
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1084n),at=instant(f(o,1n));if(at<=last)throw Error('LYING_INPUT_ORDER');last=at;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
