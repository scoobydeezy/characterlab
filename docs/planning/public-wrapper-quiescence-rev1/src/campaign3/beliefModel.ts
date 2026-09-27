/** Finite profile for belief-public/0.1-candidate. No predecessor model is widened. */
import {canonicalEncode as enc,list,set,text,unsigned,typedIdentifier,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as u} from '../campaign2/canonicalData';
import {decodeBelief as decode,beliefRecord as r} from './beliefCodecs';

export const BELIEF_VERSION='belief-public/0.1-candidate';
export const bid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVER=bid(1000,'observer/belief-trial'),CHARACTER=bid(1000,'character/belief-trial');
export const PROPOSITIONS=[bid(1027,'proposition/trial-a-outcome'),bid(1027,'proposition/trial-b-outcome')];
export const STAGES=[['appraise',50],['world',110],['observe',120],['freeze',124],['evidence',130],['apply',140]] as const;
export const eventId=(name:string)=>bid(1001,'event/belief/'+name);
export const beliefKey=(p:CanonicalValue)=>r(738,[CHARACTER,p]);
export const beliefPath=(p:CanonicalValue):StatePath=>({rootStateTypeId:740n,fieldId:1n,selectors:[{kind:'mapKey',key:beliefKey(p)}]});
export const beliefPattern=(p:CanonicalValue)=>{const path=beliefPath(p);return {...path,selectors:path.selectors.map(selector=>({kind:'exact' as const,selector}))};};
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/belief-expectation',ownedLeaves:PROPOSITIONS.map(p=>({pattern:beliefPattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:739n},removalAllowed:false}))}]);
export function beliefRecipe(law=1,goal=-1){
 if(![1,2,3].includes(law)||![-1,0,1].includes(goal))throw Error('BELIEF_PROFILE');
 const parameters=r(734,[text(BELIEF_VERSION),unsigned(law),rational(goal,1)]),content=r(746,[OBSERVER,CHARACTER,list(PROPOSITIONS)]);
 const stages=STAGES.map(([name,phase])=>r(745,[eventId(name),unsigned(phase),list(['appraise','apply'].includes(name)?PROPOSITIONS.map(p=>statePathPatternValue(beliefPattern(p))):[]),list(name==='apply'?PROPOSITIONS.map(p=>statePathPatternValue(beliefPattern(p))):[]),bid(1025,'authority/belief-expectation')]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export interface BeliefSource {parameters:Uint8Array;content:Uint8Array;registry:Uint8Array;}
export function copyData<K extends string>(input:Record<K,Uint8Array>,names:readonly K[]):Record<K,Uint8Array>{
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)throw Error('BELIEF_DATA');
 const ds=Object.getOwnPropertyDescriptors(input);if(Reflect.ownKeys(ds).length!==names.length)throw Error('BELIEF_FIELDS');
 const result={} as Record<K,Uint8Array>;
 for(const n of names){const d=ds[n];if(!d||!('value'in d)||!(d.value instanceof Uint8Array)||Object.getPrototypeOf(d.value)!==Uint8Array.prototype||Reflect.ownKeys(d.value).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))throw Error('BELIEF_DATA_BYTES');
  const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(d.value);const copy=new Uint8Array(length);Uint8Array.prototype.set.call(copy,d.value);result[n]=copy;}
 return result;
}
export function validateEstimate(value:CanonicalValue){
 const v=rec(value,739n),mean=f(v,1n),count=u(f(v,2n)),basis=items(f(v,3n),'set');
 if(typeof mean==='boolean'||mean.kind!=='rational'||mean.numerator<0n||mean.numerator>mean.denominator||count<1n||count>32n||count!==BigInt(basis.length))throw Error('BELIEF_ESTIMATE');
}
export async function compileBeliefModel(input:BeliefSource){
 const source=copyData(input,['parameters','content','registry']),p=rec(decode(source.parameters),734n),law=Number(u(f(p,2n))),goal=f(p,3n);
 if(typeof goal==='boolean'||goal.kind!=='rational'||goal.denominator!==1n)throw Error('BELIEF_GOAL');
 const recipe=beliefRecipe(law,Number(goal.numerator));
 for(const n of ['parameters','content','registry'] as const)if(key(decode(recipe[n]))!==key(decode(source[n])))throw Error('BELIEF_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:BELIEF_VERSION,contentSchemaVersion:BELIEF_VERSION,contentManifest:await commitManifest(decode(source.content)),parameterSchemaVersion:BELIEF_VERSION,parameterSet:await commitManifest(p),numericProfileVersion:'belief-exact-rational/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:BELIEF_VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));
  for(const e of state.entries()){if(!PROPOSITIONS.some(p=>key(list([unsigned(e.path.rootStateTypeId),unsigned(e.path.fieldId),...e.path.selectors.map(s=>s.kind==='mapKey'?s.key:false)]))===key(list([unsigned(740),unsigned(1),beliefKey(p)]))))throw Error('BELIEF_STATE_PATH');validateEstimate(e.value);}
  if(law===3&&state.entries().length)throw Error('BELIEF_ABLATION_STATE');
 }
 return {source,law,goal,modelIdentity,authority,validateState};
}
export type BeliefCompiled=Awaited<ReturnType<typeof compileBeliefModel>>;
export async function compileBeliefInputs(model:BeliefCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('BELIEF_INITIAL_MUST_BE_EMPTY');
 const values=items(decode(orderedInputs),'list');if(values.length>32)throw Error('BELIEF_INPUT_LIMIT');
 let previous=0n;const events:ScheduledEvent[]=[];
 for(const v of values){const original=rec(v,736n),at=f(original,1n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=previous||at.value>64n)throw Error('BELIEF_INPUT_TIME');previous=at.value;
  const seen=new Set<string>();for(const frame of items(f(original,2n),'list')){const p=f(rec(frame,735n),1n),k=key(p);if(!PROPOSITIONS.some(x=>key(x)===k)||seen.has(k))throw Error('BELIEF_DUPLICATE_OR_UNKNOWN_TARGET');seen.add(k);}
  for(const [name,phase] of STAGES.slice(0,2)){const n=BigInt(events.length);events.push({eventId:n,eventSequence:n,dueAt:simInstant(at.value),phase:BigInt(phase),eventTypeId:eventId(name),payload:name==='world'?v:list([]),dependencies:list([]),causalParentEventIds:[]});}
 }
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {events,runIdentity};
}
