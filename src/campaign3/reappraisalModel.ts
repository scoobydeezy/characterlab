/** reappraisal-public/0.1-candidate: exact model/source admission and separate owners. */
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
import {reappraisalRecord as r,decodeReappraisal as decode} from './reappraisalCodecs';
export {ACTOR,sid,copyData};
export const VERSION='reappraisal-public/0.1-candidate',OBSERVER=sid(1000,'observer/reappraisal');
export const GOAL=semanticReferentFromAuthoredContent(sid(1038,'content/reappraisal/safety'));
export const STAGES=[['appraise',50],['intent',70],['attempt',100],['execute',110],['observe',120],['learn',140],['frame',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/reappraisal/'+name);
export const path=(root:number):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>n==='appraise'?[path(1029),path(1031)]:n==='intent'||n==='learn'?[path(1029)]:n==='frame'?[path(1031)]:[];
export const writes=(n:string)=>n==='learn'?[path(1029)]:n==='frame'?[path(1031)]:[];
export const owner=(n:string)=>sid(1025,'authority/reappraisal-'+(n==='learn'?'learning':n));
const ownership=()=>compileMutationAuthorityRegistry(['learn','frame'].map(n=>({authorityName:(owner(n).payload as {value:string}).value,ownedLeaves:writes(n).map(p=>({pattern:pattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:n==='learn'?1028n:1030n},removalAllowed:false}))})));
export function reappraisalRecipe(law=1,projection=1){if(![1,2,3,4].includes(law)||![1,2].includes(projection))throw Error('REAPPRAISAL_PROFILE');const parameters=r(1025,[text(VERSION),u(law),u(projection)]),content=r(1039,[ACTOR,OBSERVER,GOAL,q(1,1),q(1,1),q(0,1)]),stages=STAGES.map(([n,p])=>r(1037,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};}
export type ReappraisalSource=ReturnType<typeof reappraisalRecipe>;
export const instant=(value:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='signed'||value.value<1n||value.value>8n)throw Error('REAPPRAISAL_TIME');return Number(value.value);};
export async function compileReappraisalModel(input:ReappraisalSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1025n),law=Number(uint(f(profile,2n))),projection=Number(uint(f(profile,3n))),recipe=reappraisalRecipe(law,projection);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('REAPPRAISAL_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1039n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'reappraisal-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  const root=[1029,1031].find(n=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(n)))));if(!root)throw Error('REAPPRAISAL_STATE_PATH');
  if(root===1031){const v=rec(e.value,1030n);instant(f(v,3n));if(uint(f(v,1n))===2n&&law!==3)throw Error('REAPPRAISAL_FRAME_MODE');}
  else {const v=rec(e.value,1028n);if(f(v,2n)===true&&law!==4)throw Error('REAPPRAISAL_RELIEF_CREDIT');let last=0;const seen=new Set<string>();for(const o0 of items(f(v,1n),'list')){const o=rec(o0,1027n),at=instant(f(o,3n));if(at<=last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(OBSERVER))throw Error('REAPPRAISAL_OBSERVATION');last=at;seen.add(key(f(o,1n)));if(uint(f(o,4n))===0n&&items(f(o,5n),'list').length)throw Error('REAPPRAISAL_PROBE_OUTCOME');}}
 }}return {source,law,projection,content,authority,modelIdentity,validateState};}
export type ReappraisalCompiled=Awaited<ReturnType<typeof compileReappraisalModel>>;
export async function compileReappraisalInputs(model:ReappraisalCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){if(key(decode(initialState))!==key(set([])))throw Error('REAPPRAISAL_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('REAPPRAISAL_INPUT_COUNT');let last=0,requests=0;const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1026n),at=instant(f(o,1n));if(at<=last)throw Error('REAPPRAISAL_INPUT_ORDER');last=at;if(f(o,8n)===true&&++requests>1)throw Error('REAPPRAISAL_REQUEST_LIMIT');return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:50n,eventTypeId:eventId('appraise'),payload:v,dependencies:list([]),causalParentEventIds:[]};});const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};}
