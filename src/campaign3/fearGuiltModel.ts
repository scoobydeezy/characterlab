/** fear-guilt-public/0.1-candidate; exact bounded evidence and independent owners. */
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
import {fearGuiltRecord as r,decodeFearGuilt as decode} from './fearGuiltCodecs';
export {ACTOR,sid,copyData};
export const VERSION='fear-guilt-public/0.1-candidate',TARGET=sid(1000,'target/fear-guilt'),HOLDERS=['a','b'].map(n=>sid(1000,'observer/fear-guilt/'+n)),INCIDENT=semanticReferentFromAuthoredContent(sid(1038,'incident/fear-guilt'));
export const STAGES=[['source',0],['private',10],['infer-a',40],['infer-b',40],['fear',50],['appraise-a',50],['appraise-b',50],['display',110],['observe-a',120],['observe-b',120],['learn-a',140],['learn-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/fear-guilt/'+n),index=(n:string)=>n.endsWith('-b')?1:0;
export const path=(i:number):StatePath=>({rootStateTypeId:1172n,fieldId:1n,selectors:[{kind:'mapKey',key:HOLDERS[i]}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>n.startsWith('infer')||n.startsWith('learn')?[path(index(n))]:[];
export const writes=(n:string)=>n.startsWith('learn')?[path(index(n))]:[];
export const owner=(n:string)=>sid(1025,'authority/fear-guilt-holder-'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1].map(i=>({authorityName:'authority/fear-guilt-holder-'+i,ownedLeaves:[{pattern:pattern(path(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1171n},removalAllowed:false}]})));
export function fearGuiltRecipe(law=1,goal=1){
 if(![1,2,3,4].includes(law)||![1,2].includes(goal))throw Error('FEAR_GUILT_PROFILE');
 const parameters=r(1165,[text(VERSION),u(law),u(goal)]),content=r(1177,[TARGET,list(HOLDERS),INCIDENT]),stages=STAGES.map(([n,p])=>r(1176,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type FearGuiltSource=ReturnType<typeof fearGuiltRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('FEAR_GUILT_TIME');return Number(v.value);};
export async function compileFearGuiltModel(input:FearGuiltSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1165n),law=Number(uint(f(profile,2n))),goal=Number(uint(f(profile,3n))),recipe=fearGuiltRecipe(law,goal);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('FEAR_GUILT_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1177n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'fear-guilt-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const i=[0,1].find(i=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(i)))));if(i===undefined)throw Error('FEAR_GUILT_STATE_PATH');let last=0;const seen=new Set<string>();
  for(const x of items(f(rec(e.value,1171n),1n),'list')){const o=rec(x,1170n),at=instant(f(o,3n));if(at<=last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(HOLDERS[i])||key(f(o,4n))!==key(TARGET)||key(f(o,5n))!==key(INCIDENT)||![6n,7n,8n].some(k=>items(f(o,k),'list').length))throw Error('FEAR_GUILT_EVIDENCE');last=at;seen.add(key(f(o,1n)));}
 }}return {source,law,goal,content,authority,modelIdentity,validateState};
}
export type FearGuiltCompiled=Awaited<ReturnType<typeof compileFearGuiltModel>>;
export async function compileFearGuiltInputs(model:FearGuiltCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('FEAR_GUILT_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('FEAR_GUILT_INPUT_COUNT');let last=0;const truth=f(rec(originals[0],1166n),2n);
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1166n),at=instant(f(o,1n));if(at<=last)throw Error('FEAR_GUILT_INPUT_ORDER');if(f(o,2n)!==truth)throw Error('FEAR_GUILT_INCIDENT_TRUTH');last=at;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
