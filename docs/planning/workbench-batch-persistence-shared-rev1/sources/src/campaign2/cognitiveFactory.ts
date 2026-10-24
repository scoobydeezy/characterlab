/** task-cognitive-model-profile/0.1-candidate: data-only public boundary.
 * Restore executes the complete accepted prefix and retains that replay's private
 * associations and RNG ledger. Neither can be supplied by callers or decoded from
 * psychological records as an alternative authority.
 */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {restoreRunIdentity} from '../substrate/identity';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {compileCognitiveModel} from './cognitiveModel';
import {compileCognitiveState} from './cognitiveState';
import {createCognitiveRuntime} from './cognitiveRuntime';
import {compileOrderedInputProfile,COGNITIVE_INPUT_PROFILE} from './orderedInputs';
import {decodeCognitive} from './cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel} from './canonicalData';
import type {Campaign2ModelSource} from './factory';
declare const brand:unique symbol;
export interface CognitiveModel {readonly [brand]:true;}
type Prepared={model:Awaited<ReturnType<typeof compileCognitiveModel>>;component:Awaited<ReturnType<typeof compileCognitiveState>>};
const models=new WeakMap<object,Prepared>();
function facts(handle:CognitiveModel){return models.get(handle)??invalidModel('prepared cognitive model required');}
export async function prepareCognitiveModel(source:Campaign2ModelSource):Promise<CognitiveModel>{const model=await compileCognitiveModel(source),component=await compileCognitiveState(model),handle=Object.freeze({}) as CognitiveModel;models.set(handle,{model,component});return handle;}
export const cognitiveModelIdentity=(handle:CognitiveModel)=>facts(handle).model.modelIdentity.canonicalBytes.slice();

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
export async function createCognitiveRun(handle:CognitiveModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const {model,component}=facts(handle),data=copies(input,['initialState','orderedInputs','runSeed']);
 const state=component.initialState(data.initialState),profile=compileOrderedInputProfile(COGNITIVE_INPUT_PROFILE,model.content,component.prior.base.domains,decodeCognitive);
 const inputs=await profile.create(data.orderedInputs,data.initialState,model.modelIdentity,data.runSeed),runtime=createCognitiveRuntime(model,component,inputs,state);
 return Object.freeze({async settleNextInstant(){return (await runtime.settleNextInstant())!==undefined;},snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.committedTrace))});},
  save:()=>runtime.save(model.modelIdentity,inputs.runIdentity),runIdentity:()=>inputs.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(inputs.runIdentity.value,d)):undefined;}});
}
export async function restoreCognitiveRun(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 // Snapshot caller data before the first await, including model bytes inside its
 // compiler. The replay constructor is the same fixed production constructor.
 const data=copies(input,['initialState','orderedInputs','save']),handle=await prepareCognitiveModel(source);
 const save=rec(decodeCognitive(data.save),132n),runIdentity=await restoreRunIdentity(f(save,3n)),seed=f(rec(runIdentity.value,104n),4n);
 if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
 const replay=await createCognitiveRun(handle,{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
 if(key(decodeCognitive(replay.runIdentity()))!==key(runIdentity.value))throw new SaveContractError('original S0/input/model commitments differ');
 const rows=items(f(save,11n),'list');for(const value of rows)rec(value,160n);
 let count=0;while(count<rows.length){try{if(!await replay.settleNextInstant())throw new SaveContractError('prefix exhausted');}catch(error){throw new SaveContractError('prefix execution failed: '+(error instanceof Error?error.message:String(error)));}
  count=items(decodeCognitive(replay.snapshot().trace),'list').length;if(count>rows.length)throw new SaveContractError('prefix crosses whole-instant boundary');
 }
 // Exact equality to a newly generated valid canonical save checks every section,
 // including projections, queue, allocator, complete trace and outputs. No partial
 // imported state is installed. Retaining replay also retains genuine used draws,
 // including choices whose rejected meaning produced no identity contribution.
 if(key(decodeCognitive(replay.save()))!==key(save))throw new SaveContractError('whole-save prefix equality failed');
 return replay;
}
