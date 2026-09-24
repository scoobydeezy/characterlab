/** familiarity-public/0.1-candidate: controlled appearance, never implicit identity. */
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
import {familiarityRecord as r,decodeFamiliarity as decode} from './familiarityCodecs';
export {ACTOR,sid,copyData};
export const VERSION='familiarity-public/0.1-candidate',OBSERVER=sid(1000,'observer/familiarity');
export const STAGES=[['source',0],['observe',10],['freeze',20],['recognize',21],['consolidate',140]] as const;
export const eventId=(name:string)=>sid(1001,'event/familiarity/'+name);
export const path=(root=1060):StatePath=>({rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string)=>['freeze','consolidate'].includes(n)?[path()]:[];
export const writes=(n:string)=>n==='consolidate'?[path()]:[];
export const owner=(n:string)=>sid(1025,'authority/familiarity-'+n);
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/familiarity-consolidate',ownedLeaves:[{pattern:pattern(path()),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1059n},removalAllowed:false}]}]);
export function familiarityRecipe(law=1){if(![1,2,3,4,5].includes(law))throw Error('FAMILIARITY_PROFILE');const parameters=r(1055,[text(VERSION),u(law)]),content=r(1066,[ACTOR,OBSERVER,u(3)]),stages=STAGES.map(([n,p])=>r(1065,[eventId(n),u(p),list(reads(n).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};}
export type FamiliaritySource=ReturnType<typeof familiarityRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('FAMILIARITY_TIME');return Number(v.value);};
export async function compileFamiliarityModel(input:FamiliaritySource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1055n),law=Number(uint(f(profile,2n))),recipe=familiarityRecipe(law);for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('FAMILIARITY_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1066n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'familiarity-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  if(key(statePathPatternValue(pattern(e.path)))!==key(statePathPatternValue(pattern(path()))))throw Error('FAMILIARITY_STATE_PATH');let last=0;const seen=new Set<string>();
  for(const x of items(f(rec(e.value,1059n),1n),'list')){const v=rec(x,1058n),at=instant(f(v,2n));if(at<=last||seen.has(key(f(v,1n))))throw Error('FAMILIARITY_IMPRINT');last=at;seen.add(key(f(v,1n)));}
 }}return {source,law,content,authority,modelIdentity,validateState};}
export type FamiliarityCompiled=Awaited<ReturnType<typeof compileFamiliarityModel>>;
export async function compileFamiliarityInputs(model:FamiliarityCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('FAMILIARITY_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>12)throw Error('FAMILIARITY_INPUT_COUNT');let last=0,present=0;
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1056n),at=instant(f(o,1n)),identity=uint(f(o,4n));if(at<=last)throw Error('FAMILIARITY_INPUT_ORDER');last=at;if(identity<1n||identity>8n||f(o,2n)===true&&++present>8)throw Error('FAMILIARITY_SOURCE_BOUND');return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
