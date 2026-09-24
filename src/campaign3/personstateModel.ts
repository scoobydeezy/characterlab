/** personstate-public/0.2-candidate: choice, delivery and three private owners. */
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
import {personstateRecord as r,decodePersonState as decode} from './personstateCodecs';
export {ACTOR,sid,copyData};
export const VERSION='personstate-public/0.2-candidate',HOLDERS=['target','a','b'].map(n=>sid(1000,'observer/personstate/'+n));
export const PROPOSITION=semanticReferentFromAuthoredContent(sid(1038,'proposition/personstate/helps'));
export const TASKS=['helping','self-directed'].map(n=>old(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/personstate/'+n))]));
export const OPTIONS=['help','decline'].map(n=>old(395,[ACTOR,sid(1027,'action/personstate/'+n)]));
export const STAGES=[['source',0],['observe-private',10],['cue-a',10],['cue-b',10],['learn-private',30],['learn-cue-a',30],['learn-cue-b',30],['context',40],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['execute',110],['observe-a',120],['observe-b',120],['appraise-a',130],['appraise-b',130],['learn-a',140],['learn-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/personstate/'+n),index=(n:string)=>n.endsWith('-a')?1:n.endsWith('-b')?2:0;
export const path=(i:number):StatePath=>({rootStateTypeId:1152n,fieldId:1n,selectors:[{kind:'mapKey',key:HOLDERS[i]}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string,law=1)=>{const base=n==='context'||n.startsWith('appraise')||n.startsWith('learn')?[path(index(n))]:[];return law===5&&n.startsWith('appraise')?[...base,path(0)]:base;};
export const writes=(n:string)=>n.startsWith('learn')?[path(index(n))]:[];
export const owner=(n:string)=>sid(1025,'authority/personstate-holder-'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1,2].map(i=>({authorityName:'authority/personstate-holder-'+i,ownedLeaves:[{pattern:pattern(path(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1151n},removalAllowed:false}]})));
export function personstateRecipe(law=1,pressure=1,goal=1){
 if(![1,2,3,4,5].includes(law)||![1,2,3].includes(pressure)||![1,2].includes(goal))throw Error('PERSONSTATE_PROFILE');const modifier=old(439,[q(1,4),u(3)]),dice=old(437,[old(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),modifier,modifier]);
 const parameters=r(1148,[text(VERSION),u(law),u(pressure),u(goal)]),content=r(1162,[ACTOR,list(HOLDERS),list(TASKS),list(OPTIONS),dice,PROPOSITION]),stages=STAGES.map(([n,p])=>r(1161,[eventId(n),u(p),list(reads(n,law).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type PersonStateSource=ReturnType<typeof personstateRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('PERSONSTATE_TIME');return Number(v.value);};
export async function compilePersonStateModel(input:PersonStateSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1148n),law=Number(uint(f(profile,2n))),pressure=Number(uint(f(profile,3n))),goal=Number(uint(f(profile,4n))),recipe=personstateRecipe(law,pressure,goal);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('PERSONSTATE_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1162n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'personstate-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const i=[0,1,2].find(i=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(i)))));if(i===undefined)throw Error('PERSONSTATE_STATE_PATH');const knowledge=rec(e.value,1151n);if(key(f(knowledge,3n))!==key(HOLDERS[0])||key(f(knowledge,4n))!==key(PROPOSITION))throw Error('PERSONSTATE_KEY');let last=0;const seen=new Set<string>();
  for(const x of items(f(knowledge,1n),'list')){const o=rec(x,i===0?1150n:1164n),at=instant(f(o,3n));if(at<=last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(HOLDERS[i])||i>0&&items(f(o,4n),'list').length!==1)throw Error('PERSONSTATE_EVIDENCE');last=at;seen.add(key(f(o,1n)));}
  const cues=items(f(knowledge,2n),'list');if(i===0&&cues.length)throw Error('PERSONSTATE_PRIVATE_CUE');for(const c of cues){const cue=rec(c,1163n);instant(f(cue,3n));if(key(f(cue,2n))!==key(HOLDERS[i]))throw Error('PERSONSTATE_FOREIGN_CUE');}

 }}return {source,law,pressure,goal,content,authority,modelIdentity,validateState};}
export type PersonStateCompiled=Awaited<ReturnType<typeof compilePersonStateModel>>;
export async function compilePersonStateInputs(model:PersonStateCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('PERSONSTATE_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('PERSONSTATE_INPUT_COUNT');let last=0;
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1149n),at=instant(f(o,1n));if(at<=last)throw Error('PERSONSTATE_INPUT_ORDER');last=at;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
