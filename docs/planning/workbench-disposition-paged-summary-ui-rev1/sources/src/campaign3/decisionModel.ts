/** decision-public/0.1-candidate: exact finite public model recipes. */
import {canonicalEncode as enc,list,set,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {ACTOR,TASKS,OPTIONS,sid} from './longitudinalModel';
import {copyData} from './beliefModel';
import {decisionRecord as r,decodeDecision as decode} from './decisionCodecs';
export {ACTOR,TASKS,OPTIONS,sid,copyData};
export const VERSION='decision-public/0.1-candidate',OBSERVER=sid(1000,'observer/decision');
export const STAGES=[['source',10],['freeze',14],['raw',51],['reasons',52],['decision',60],['intent',70],['expression',80],['plan',90],['attempt',100],['execution',110],['observation',120],['consequence',124],['history',140]] as const;
export const eventId=(n:string)=>sid(1001,'event/decision/'+n),historyPath:StatePath={rootStateTypeId:946n,fieldId:1n,selectors:[{kind:'mapKey',key:ACTOR}]},historyPattern={...historyPath,selectors:historyPath.selectors.map(selector=>({kind:'exact' as const,selector}))};
export const authorityId=sid(1025,'authority/decision-history'),reads=(n:string)=>n==='history'?[historyPattern]:[];
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/decision-history',ownedLeaves:[{pattern:historyPattern,valueGrammar:{kind:'canonical-record',recordTypeId:951n},removalAllowed:false}]}]);
export function decisionRecipe(law=1){
 if(![1,2,3,4,5,6].includes(law))throw Error('DECISION_PROFILE');
 const modifier=old(439,[q(1,4),u(3)]),dice=old(437,[old(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),modifier,modifier]);
 const parameters=r(930,[text(VERSION),u(law)]),content=r(931,[OBSERVER,ACTOR,dice,old(440,[q(1,2),q(3,4)])]);
 const stages=STAGES.map(([n,phase])=>r(947,[eventId(n),u(phase),list(reads(n).map(statePathPatternValue)),list(n==='history'?[statePathPatternValue(historyPattern)]:[]),authorityId]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type DecisionSource=ReturnType<typeof decisionRecipe>;
export async function compileDecisionModel(input:DecisionSource){
 const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),930n),law=Number(uint(f(profile,2n))),recipe=decisionRecipe(law);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(source[n]))!==key(decode(recipe[n])))throw Error('DECISION_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),931n);
 const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'decision-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){decode(enc(state.canonicalValue()));for(const e of state.entries()){if(e.path.rootStateTypeId!==946n||e.path.fieldId!==1n||e.path.selectors.length!==1||e.path.selectors[0].kind!=='mapKey'||key(e.path.selectors[0].key)!==key(ACTOR))throw Error('DECISION_STATE_PATH');const history=items(f(rec(e.value,951n),1n),'list');let last=-1n;for(const entry of history){const row=rec(entry,945n);if(row.fields.has(3n)!==row.fields.has(4n))throw Error('DECISION_HISTORY_SEM');const id=f(row,1n);if(typeof id==='boolean'||id.kind!=='typedIdentifier'||typeof id.payload==='boolean'||id.payload.kind!=='unsigned'||id.payload.value<=last)throw Error('DECISION_HISTORY_ORDER');last=id.payload.value;}}}
 return {source,content,law,modelIdentity,authority,validateState};
}
export type DecisionCompiled=Awaited<ReturnType<typeof compileDecisionModel>>;
export async function compileDecisionInputs(model:DecisionCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('DECISION_INITIAL_STATE');const originals=items(decode(orderedInputs),'list');if(originals.length>8)throw Error('DECISION_INPUT_LIMIT');
 const events:ScheduledEvent[]=[];let last=0n;
 for(const value of originals){const v=rec(value,932n),at=f(v,1n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=last||at.value>64n)throw Error('DECISION_TIME');last=at.value;events.push({eventId:BigInt(events.length),eventSequence:BigInt(events.length),dueAt:simInstant(at.value),phase:10n,eventTypeId:eventId('source'),payload:value,dependencies:list([]),causalParentEventIds:[]});}
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});return {events,runIdentity,runSeed:runSeed.slice()};
}
