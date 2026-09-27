/** Finite profile for learn-public/0.1-candidate. No predecessor model is widened. */
import {canonicalEncode as enc,list,set,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {AuthoritativeState,StateAuthorityRegistry,statePathPatternValue,type StatePath} from '../substrate/state';
import {compileMutationAuthorityRegistry} from '../substrate/mutationAuthority';
import {simInstant} from '../substrate/time';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import type {ScheduledEvent} from '../substrate/scheduler';
import {readQ} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as u} from '../campaign2/canonicalData';
import {decodeLearn as decode,learnRecord as r} from './learnCodecs';

export const LEARN_VERSION='learn-public/0.1-candidate';
export const bid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const OBSERVER=bid(1000,'observer/learn-trial'),CHARACTER=bid(1000,'character/learn-trial');
export const PROPOSITIONS=[bid(1027,'proposition/trial-a-outcome'),bid(1027,'proposition/trial-b-outcome')];
export const STAGES=[['appraise',50],['world',110],['observe',120],['freeze',124],['evidence',130],['apply',140]] as const;
export const eventId=(name:string)=>bid(1001,'event/learn/'+name);
export const learnKey=(p:CanonicalValue)=>r(888,[CHARACTER,p]);
export const learnPath=(p:CanonicalValue):StatePath=>({rootStateTypeId:890n,fieldId:1n,selectors:[{kind:'mapKey',key:learnKey(p)}]});
export const learnPattern=(p:CanonicalValue)=>{const path=learnPath(p);return {...path,selectors:path.selectors.map(selector=>({kind:'exact' as const,selector}))};};
const ownership=()=>compileMutationAuthorityRegistry([{authorityName:'authority/belief-expectation',ownedLeaves:PROPOSITIONS.map(p=>({pattern:learnPattern(p),valueGrammar:{kind:'canonical-record' as const,recordTypeId:889n},removalAllowed:false}))}]);
export function learnRecipe(law=1,numeric=1){
 if(![1,2,3].includes(law)||![1,2].includes(numeric))throw Error('LEARN_PROFILE');
 const parameters=r(884,[text(LEARN_VERSION),unsigned(law),unsigned(numeric)]),content=r(896,[OBSERVER,CHARACTER,list(PROPOSITIONS)]);
 const stages=STAGES.map(([name,phase])=>r(895,[eventId(name),unsigned(phase),list(['appraise','apply'].includes(name)?PROPOSITIONS.map(p=>statePathPatternValue(learnPattern(p))):[]),list(name==='apply'?PROPOSITIONS.map(p=>statePathPatternValue(learnPattern(p))):[]),bid(1025,'authority/belief-expectation')]));
 return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export interface LearnSource {parameters:Uint8Array;content:Uint8Array;registry:Uint8Array;}
export function copyData<K extends string>(input:Record<K,Uint8Array>,names:readonly K[]):Record<K,Uint8Array>{
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)throw Error('LEARN_DATA');
 const ds=Object.getOwnPropertyDescriptors(input);if(Reflect.ownKeys(ds).length!==names.length)throw Error('LEARN_FIELDS');
 const result={} as Record<K,Uint8Array>;
 for(const n of names){const d=ds[n];if(!d||!('value'in d)||!(d.value instanceof Uint8Array)||Object.getPrototypeOf(d.value)!==Uint8Array.prototype||Reflect.ownKeys(d.value).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))throw Error('LEARN_DATA_BYTES');
  const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(d.value);const copy=new Uint8Array(length);Uint8Array.prototype.set.call(copy,d.value);result[n]=copy;}
 return result;
}
export function validateEstimate(value:CanonicalValue){
 const v=rec(value,889n),mean=readQ(f(v,1n)),precision=readQ(f(v,2n)),basis=items(f(v,3n),'set');
 if(mean.numerator<0n||mean.numerator>mean.denominator||basis.length<1||basis.length>64||precision.denominator!==1n||precision.numerator!==2n*BigInt(basis.length))throw Error('LEARN_ESTIMATE');
}
export async function compileLearnModel(input:LearnSource){
 const source=copyData(input,['parameters','content','registry']),p=rec(decode(source.parameters),884n),law=Number(u(f(p,2n))),numeric=Number(u(f(p,3n)));

 const recipe=learnRecipe(law,numeric);
 for(const n of ['parameters','content','registry'] as const)if(key(decode(recipe[n]))!==key(decode(source[n])))throw Error('LEARN_EXACT_MODEL');
 const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities);
 const modelIdentity=await createModelIdentity({rulesVersion:LEARN_VERSION,contentSchemaVersion:LEARN_VERSION,contentManifest:await commitManifest(decode(source.content)),parameterSchemaVersion:LEARN_VERSION,parameterSet:await commitManifest(p),numericProfileVersion:'learn-exact-rational/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:LEARN_VERSION,registryManifest:await commitManifest(decode(source.registry))});
 function validateState(state:AuthoritativeState){
  decode(enc(state.canonicalValue()));
  for(const e of state.entries()){if(!PROPOSITIONS.some(p=>key(list([unsigned(e.path.rootStateTypeId),unsigned(e.path.fieldId),...e.path.selectors.map(s=>s.kind==='mapKey'?s.key:false)]))===key(list([unsigned(890),unsigned(1),learnKey(p)]))))throw Error('LEARN_STATE_PATH');validateEstimate(e.value);}

 }
 return {source,law,numeric,modelIdentity,authority,validateState};
}
export type LearnCompiled=Awaited<ReturnType<typeof compileLearnModel>>;
export async function compileLearnInputs(model:LearnCompiled,initialState:Uint8Array,orderedInputs:Uint8Array,runSeed:Uint8Array){
 if(key(decode(initialState))!==key(set([])))throw Error('LEARN_INITIAL_MUST_BE_EMPTY');
 const values=items(decode(orderedInputs),'list');if(values.length>64)throw Error('LEARN_INPUT_LIMIT');
 let previous=0n;const events:ScheduledEvent[]=[];
 for(const v of values){const original=rec(v,886n),at=f(original,1n);if(typeof at==='boolean'||at.kind!=='signed'||at.value<=previous||at.value>128n)throw Error('LEARN_INPUT_TIME');previous=at.value;
  const seen=new Set<string>();for(const frame of items(f(original,2n),'list')){const p=f(rec(frame,885n),1n),k=key(p);if(!PROPOSITIONS.some(x=>key(x)===k)||seen.has(k))throw Error('LEARN_DUPLICATE_OR_UNKNOWN_TARGET');seen.add(k);}
  for(const [name,phase] of STAGES.slice(0,2)){const n=BigInt(events.length);events.push({eventId:n,eventSequence:n,dueAt:simInstant(at.value),phase:BigInt(phase),eventTypeId:eventId(name),payload:name==='world'?v:list([]),dependencies:list([]),causalParentEventIds:[]});}
 }
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
 return {events,runIdentity};
}
