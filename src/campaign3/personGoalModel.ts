/** person-goal-public/0.1-candidate; exact bounded evidence and independent owners. */
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
import {personGoalRecord as r,decodePersonGoal as decode} from './personGoalCodecs';
export {ACTOR,sid,copyData};
export const VERSION='person-goal-public/0.1-candidate',TARGET=sid(1000,'target/person-goal'),HOLDERS=['a','b'].map(n=>sid(1000,'observer/person-goal/'+n)),INCIDENT=semanticReferentFromAuthoredContent(sid(1038,'incident/person-goal'));
export const CATALOGUE=[1,2,3,4,5].map(route=>r(1194,[u(route),list((route===1?[1,2]:route===2||route===4?[1]:[2]).map(u))]));
export const goalPath:StatePath={rootStateTypeId:1192n,fieldId:1n,selectors:[]};
export const STAGES=[['source',0],['private',10],['infer-a',40],['infer-b',40],['appraise-a',50],['appraise-b',50],['plan',90],['attempt',100],['execute',110],['observe-a',120],['observe-b',120],['adopt',140],['learn-a',140],['learn-b',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/person-goal/'+n),index=(n:string)=>n.endsWith('-b')?1:0;
export const path=(i:number):StatePath=>({rootStateTypeId:1185n,fieldId:1n,selectors:[{kind:'mapKey',key:HOLDERS[i]}]});
export const pattern=(p:StatePath)=>({...p,selectors:p.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads=(n:string,law=1)=>n==='adopt'||n==='plan'?[goalPath]:n.startsWith('infer')?[path(index(n)),...(law===4?[goalPath]:[])]:n.startsWith('learn')?[path(index(n))]:[];
export const writes=(n:string)=>n==='adopt'?[goalPath]:n.startsWith('learn')?[path(index(n))]:[];
export const owner=(n:string)=>sid(1025,n==='adopt'?'authority/person-goal-target':'authority/person-goal-holder-'+index(n));
const ownership=()=>compileMutationAuthorityRegistry([0,1].map(i=>({authorityName:'authority/person-goal-holder-'+i,ownedLeaves:[{pattern:pattern(path(i)),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1184n},removalAllowed:false}]})).concat([{authorityName:'authority/person-goal-target',ownedLeaves:[{pattern:pattern(goalPath),valueGrammar:{kind:'canonical-record' as const,recordTypeId:1191n},removalAllowed:false}]}]));
export function personGoalRecipe(law=1,goal=1){
 if(![1,2,3,4].includes(law)||![1,2].includes(goal))throw Error('PERSON_GOAL_PROFILE');
 const parameters=r(1178,[text(VERSION),u(law),u(goal)]),content=r(1193,[TARGET,list(HOLDERS),INCIDENT,list(CATALOGUE)]),stages=STAGES.map(([n,p])=>r(1189,[eventId(n),u(p),list(reads(n,law).map(p=>statePathPatternValue(pattern(p)))),list(writes(n).map(p=>statePathPatternValue(pattern(p)))),owner(n)]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type PersonGoalSource=ReturnType<typeof personGoalRecipe>;
export const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<1n||v.value>16n)throw Error('PERSON_GOAL_TIME');return Number(v.value);};
export async function compilePersonGoalModel(input:PersonGoalSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),1178n),law=Number(uint(f(profile,2n))),goal=Number(uint(f(profile,3n))),recipe=personGoalRecipe(law,goal);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('PERSON_GOAL_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),1193n),modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'person-goal-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){
  if(key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(goalPath)))){const g=rec(e.value,1191n);instant(f(g,3n));if(key(f(g,2n))!==key(TARGET))throw Error('PERSON_GOAL_TARGET');continue;}
  const i=[0,1].find(i=>key(statePathPatternValue(pattern(e.path)))===key(statePathPatternValue(pattern(path(i)))));if(i===undefined)throw Error('PERSON_GOAL_STATE_PATH');let last=0;const seen=new Set<string>();
  for(const x of items(f(rec(e.value,1184n),1n),'list')){const o=rec(x,1183n),at=instant(f(o,3n));if(at<=last||seen.has(key(f(o,1n)))||key(f(o,2n))!==key(HOLDERS[i])||key(f(o,4n))!==key(TARGET)||key(f(o,5n))!==key(INCIDENT)||![6n,7n].some(k=>items(f(o,k),'list').length))throw Error('PERSON_GOAL_EVIDENCE');last=at;seen.add(key(f(o,1n)));}
 }}return {source,law,goal,content,authority,modelIdentity,validateState};
}
export type PersonGoalCompiled=Awaited<ReturnType<typeof compilePersonGoalModel>>;
export async function compilePersonGoalInputs(model:PersonGoalCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('PERSON_GOAL_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(!originals.length||originals.length>8)throw Error('PERSON_GOAL_INPUT_COUNT');let last=0;const truth=key(f(rec(originals[0],1179n),2n));
 const events:ScheduledEvent[]=originals.map((v,i)=>{const o=rec(v,1179n),at=instant(f(o,1n));if(at<=last)throw Error('PERSON_GOAL_INPUT_ORDER');if(key(f(o,2n))!==truth)throw Error('PERSON_GOAL_CONSTANT_GOAL');last=at;return {eventId:BigInt(i),eventSequence:BigInt(i),dueAt:simInstant(BigInt(at)),phase:0n,eventTypeId:eventId('source'),payload:v,dependencies:list([]),causalParentEventIds:[]};});
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
