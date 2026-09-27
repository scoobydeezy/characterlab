/** recollection-public/0.1-candidate: bounded routine imprints and category summaries. */
import {canonicalEncode as enc,list,set,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ACTOR,sid} from './longitudinalModel';
import {copyData} from './beliefModel';
import {recollectionRecord as r,decodeRecollection as decode} from './recollectionCodecs';
export {ACTOR,sid,copyData};
export const VERSION='recollection-public/0.1-candidate',OBSERVER=sid(1000,'observer/recollection');
export const STAGES=[['recall',40],['source',110],['observe',120],['consolidate',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/recollection/'+name);
export const path=(root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>['recall','consolidate'].includes(n)?[path(1045),path(1048)]:[];
export const writes=(n:string)=>n==='consolidate'?[path(1045),path(1048)]:[];
export const owner=(n:string)=>sid(1025,'authority/recollection-'+n);
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/recollection-consolidate',ownedLeaves:[1045,1048].map(n=>({pattern:pattern(path(n)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:BigInt(n-1)},removalAllowed:false}))}]);
export function recollectionRecipe(law=1){if(![1,2,3,4,5].includes(law))throw Error('RECOLLECTION_PROFILE');const parameters=r(1040,[text(VERSION),u(law)]),content=r(1054,[ACTOR,OBSERVER,u(3)]),stages=STAGES.map(([n,p])=>r(1053,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};}
export type RecollectionSource=ReturnType<typeof recollectionRecipe>;
export const instant=(value:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='signed'||value.value<1n||value.value>16n)throw Error('RECOLLECTION_TIME');return Number(value.value);};
export async function compileRecollectionModel(input:RecollectionSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1040n),law=Number(uint(f(profile,2n))),recipe=recollectionRecipe(law);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('RECOLLECTION_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1054n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'recollection-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const root=[1045,1048].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));if(!root)throw Error('RECOLLECTION_STATE_PATH');
  if(root===1045){const xs=items(f(rec(e.value,1044n),1n),'list'),labels=new Set<bigint>(),sources=new Set<string>();let last=0;for(const x of xs){const v=rec(x,1043n),at=instant(f(v,2n)),label=uint(f(v,3n));if(at<=last||label<1n||label>8n||labels.has(label)||sources.has(key(f(v,1n))))throw Error('RECOLLECTION_FRAGMENT');last=at;labels.add(label);sources.add(key(f(v,1n)));}}
  else {let category=0n;const seen=new Set<string>();for(const x of items(f(rec(e.value,1047n),1n),'list')){const v=rec(x,1046n),c=uint(f(v,1n)),refs=items(f(v,4n),'list');if(c<=category||uint(f(v,2n))+uint(f(v,3n))!==BigInt(refs.length)||refs.length===0)throw Error('RECOLLECTION_SUMMARY');category=c;for(const ref of refs){if(seen.has(key(ref)))throw Error('RECOLLECTION_DUPLICATE_CREDIT');seen.add(key(ref));}}}
 }}return {source,law,content,authority,modelIdentity,validateState};}
export type RecollectionCompiled=Awaited<ReturnType<typeof compileRecollectionModel>>;
export async function compileRecollectionInputs(model:RecollectionCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('RECOLLECTION_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>12)throw Error('RECOLLECTION_INPUT_COUNT');let last=0;const labels=new Set<bigint>();
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1041n),at=instant(f(o,1n)),kind=uint(f(o,2n)),label=uint(f(o,3n)),query=uint(f(o,9n));if(at<=last)throw Error('RECOLLECTION_INPUT_ORDER');last=at;if(query>8n||kind===0n&&label!==0n||kind===1n&&(label<1n||label>8n||labels.has(label)))throw Error('RECOLLECTION_LABEL');if(kind===1n)labels.add(label);return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:40n,eventTypeId:eventId('recall'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
