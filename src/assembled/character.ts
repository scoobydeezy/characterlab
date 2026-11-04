// assembled-character-model/0.1-candidate: bounded successor of cognitiveFactory at db0ca7a8.
/** task-cognitive-model-profile/0.1-candidate: data-only public boundary.
 * Restore executes the complete accepted prefix and retains that replay's private
 * associations and RNG ledger. Neither can be supplied by callers or decoded from
 * psychological records as an alternative authority.
 */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {restoreRunIdentity} from '../substrate/identity';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {compileCharacterModel} from './model';
import {compileCharacterState} from './state';
import {compileCognitiveIngress} from './ingress';
import {createCharacterRuntime} from './runtime';
import {compileCharacterInputs} from './inputs';
import {decodeCognitive} from './codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../campaign2/factory';
declare const brand:unique symbol;
export interface CharacterModel {readonly [brand]:true;}
type Prepared={model:Awaited<ReturnType<typeof compileCharacterModel>>;component:Awaited<ReturnType<typeof compileCharacterState>>};
const models=new WeakMap<object,Prepared>();
// Private replay progress, derived only from successful scheduler commits.
// This is not authoritative state and cannot replace the final full-save check.
const traceCounts=new WeakMap<object,()=>number>();
function facts(handle:CharacterModel){return models.get(handle)??invalidModel('prepared cognitive model required');}
export async function prepareCharacterModel(source:Campaign2ModelSource):Promise<CharacterModel>{const model=await compileCharacterModel(source),component=await compileCharacterState(model),handle=Object.freeze({}) as CharacterModel;compileCognitiveIngress(model,component);models.set(handle,{model,component});return handle;}
export const characterModelIdentity=(handle:CharacterModel)=>facts(handle).model.modelIdentity.canonicalBytes.slice();

function copies<K extends string>(input:Record<K,Uint8Array>,names:readonly K[]):Record<K,Uint8Array>{
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)invalidModel('plain run data required');
 const descriptors=Object.getOwnPropertyDescriptors(input);
 if(Reflect.ownKeys(descriptors).length!==names.length||names.some(n=>!descriptors[n]||!('value'in descriptors[n])))invalidModel('exact data-only run fields required');
 const result={} as Record<K,Uint8Array>;
 for(const name of names){const v=descriptors[name].value;if(!(v instanceof Uint8Array)||Object.getPrototypeOf(v)!==Uint8Array.prototype||Reflect.ownKeys(v).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))invalidModel('plain run bytes required');
  const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(v);result[name]=new Uint8Array(length);Uint8Array.prototype.set.call(result[name],v);
 }
 return result;
}
export async function createCharacterRun(handle:CharacterModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const {model,component}=facts(handle),data=copies(input,['initialState','orderedInputs','runSeed']);
 const state=component.initialState(data.initialState),inputs=await compileCharacterInputs(model,component,data),runtime=createCharacterRuntime(model,component,inputs,state);
 let committedTraceCount=0;
 const run=Object.freeze({async settleNextInstant(){const result=await runtime.settleNextInstant();if(result===undefined)return false;committedTraceCount+=result.traceContributions.length;return true;},snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.committedTrace))});},
  save:()=>runtime.save(model.modelIdentity,inputs.runIdentity),runIdentity:()=>inputs.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(inputs.runIdentity.value,d)):undefined;}});
 traceCounts.set(run,()=>committedTraceCount);
 return run;
}
export async function restoreCharacterRun(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 // Snapshot caller data before the first await, including model bytes inside its
 // compiler. The replay constructor is the same fixed production constructor.
 const data=copies(input,['initialState','orderedInputs','save']),handle=await prepareCharacterModel(source);
 const save=rec(decodeCognitive(data.save),132n),runIdentity=await restoreRunIdentity(f(save,3n)),seed=f(rec(runIdentity.value,104n),4n);
 if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
 const replay=await createCharacterRun(handle,{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
 if(key(decodeCognitive(replay.runIdentity()))!==key(runIdentity.value))throw new SaveContractError('original S0/input/model commitments differ');
 const rows=items(f(save,11n),'list');for(const value of rows)rec(value,160n);
 let count=0;while(count<rows.length){try{if(!await replay.settleNextInstant())throw new SaveContractError('prefix exhausted');}catch(error){throw new SaveContractError('prefix execution failed: '+(error instanceof Error?error.message:String(error)));}
  count=traceCounts.get(replay)!();if(count>rows.length)throw new SaveContractError('prefix crosses whole-instant boundary');
 }
 // Exact equality to a newly generated valid canonical save checks every section,
 // including projections, queue, allocator, complete trace and outputs. No partial
 // imported state is installed. Retaining replay also retains genuine used draws,
 // including choices whose rejected meaning produced no identity contribution.
 // The incoming save has already passed complete grammar decoding. Compare every
 // canonical byte with the generated save: no second grammar walk or hex strings.
 const actual=replay.save(),expected=enc(save);
 if(actual.length!==expected.length||actual.some((byte,i)=>byte!==expected[i]))throw new SaveContractError('whole-save prefix equality failed');
 return replay;
}

export type {Campaign2ModelSource as CharacterModelSource} from '../campaign2/factory';
