/** attributed-public/0.1-candidate: choice, delivery and three private owners. */
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
import {attributedRecord as r,decodeAttributed as decode} from './attributedCodecs';
export {ACTOR,sid,copyData};
export const VERSION='attributed-public/0.1-candidate',HOLDERS=['speaker','target','other'].map(n=>sid(1000,'observer/attributed/'+n));
export const PROPOSITION=semanticReferentFromAuthoredContent(sid(1038,'proposition/obstruction-caused-failure'));
export const TASKS=['informing','misdirection'].map(n=>old(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/attributed/'+n))]));
export const OPTIONS=['truthful-assert','contrary-assert'].map(n=>old(395,[ACTOR,sid(1027,'action/attributed/'+n)]));
export const STAGES=[['source',0],['observe-speaker',10],['observe-target',10],['observe-other',10],['learn-speaker',30],['learn-target',30],['learn-other',30],['probe-speaker',40],['probe-target',40],['probe-other',40],['context',40],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['execute',110],['receive-target',120],['learn-receipt',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/attributed/'+n),index=(n:string)=>n.endsWith('-target')||n==='learn-receipt'?1:n.endsWith('-other')?2:0;
export const path=(i:number):StatePath=>({rootStateTypeId:1087n,fieldId:1n,selectors:[{kind:'mapKey',key:HOLDERS[i]}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string,law=1)=>{const base=n==='context'||n.startsWith('probe')||n.startsWith('learn')?[path(index(n))]:[];return law===4&&(n==='context'||n==='probe-speaker'||n==='probe-other')?[...base,path(1)]:base;};
export const writes=(n:string)=>n.startsWith('learn')?[path(index(n))]:[];
export const owner=(n:string)=>sid(1025,'authority/attributed-holder-'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1,2].map(i=>({authorityName:'authority/attributed-holder-'+i,ownedLeaves:[{pattern:pattern(path(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1086n},removalAllowed:false}]})));
export function attributedRecipe(law=1,pressure=1){
 if(![1,2,3,4].includes(law)||![1,2,3].includes(pressure))throw Error('ATTRIBUTED_PROFILE');const modifier=old(439,[q(1,4),u(3)]),dice=old(437,[old(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),modifier,modifier]);
 const parameters=r(1131,[text(VERSION),u(law),u(pressure)]),content=r(1145,[ACTOR,list(HOLDERS),list(TASKS),list(OPTIONS),dice,PROPOSITION]),stages=STAGES.map(([n,p])=>r(1144,[eventId(n),u(p),list(reads(n,law).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type AttributedSource=ReturnType<typeof attributedRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('ATTRIBUTED_TIME');return Number(v.value);};
export async function compileAttributedModel(input:AttributedSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1083n),law=Number(uint(f(profile,2n))),pressure=Number(uint(f(profile,3n))),recipe=attributedRecipe(law,pressure);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('ATTRIBUTED_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1097n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'attributed-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const i=[0,1,2].find(i=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(i)))));if(i===undefined)throw Error('ATTRIBUTED_STATE_PATH');const knowledge=rec(e.value,1134n),person=rec(f(knowledge,2n),1147n);if(key(f(person,1n))!==key(HOLDERS[i])||key(f(person,2n))!==key(HOLDERS[1])||key(f(person,3n))!==key(PROPOSITION))throw Error('ATTRIBUTED_PERSON_KEY');
  let last=0,lastChannel=0;const seen=new Set<string>();
  const check=(x:CanonicalValue)=>{const o=rec(x,1133n),at=instant(f(o,3n)),channel=Number(uint(f(o,6n)));if(key(f(o,2n))!==key(HOLDERS[i]))throw Error('ATTRIBUTED_FOREIGN_EVIDENCE');return {o,at,channel};};
  for(const x of items(f(knowledge,1n),'list')){const {o,at,channel}=check(x);if(at<last||at===last&&channel<=lastChannel||seen.has(key(f(o,1n)))||items(f(o,4n),'list').length!==1)throw Error('ATTRIBUTED_EVIDENCE');last=at;lastChannel=channel;seen.add(key(f(o,1n)));}
  last=0;for(const x of items(f(person,4n),'list')){const sample=rec(x,1146n),{o,at,channel}=check(f(sample,1n));if(i===1||at<=last||channel!==1||key(f(sample,2n))!==key(HOLDERS[1])||key(f(sample,3n))!==key(PROPOSITION)||key(f(o,5n))!==key(list([f(sample,4n)])))throw Error('ATTRIBUTED_REPORT');last=at;}

 }}return {source,law,pressure,content,authority,modelIdentity,validateState};}
export type AttributedCompiled=Awaited<ReturnType<typeof compileAttributedModel>>;
export async function compileAttributedInputs(model:AttributedCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('ATTRIBUTED_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('ATTRIBUTED_INPUT_COUNT');let last=0;
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1084n),at=instant(f(o,1n));if(at<=last)throw Error('ATTRIBUTED_INPUT_ORDER');last=at;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
