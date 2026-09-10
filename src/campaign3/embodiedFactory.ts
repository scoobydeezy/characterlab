/** campaign3-embodied-persistence/0.1-candidate: exact frozen cohort, data-only runs and
 * complete-prefix restore. No source callbacks or scheduling capabilities escape. */
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {canonicalEncode as enc,list,CanonicalEncodingError} from '../substrate/canonicalEncoding';
import {restoreRunIdentity} from '../substrate/identity';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {compileEmbodiedModel} from './embodiedModel';
import {compileEmbodiedInputs,embodiedInputFacts} from './embodiedAdmission';
import {createEmbodiedRuntime} from './embodiedRuntime';
import {decodeEmbodied as decode} from './embodiedCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../campaign2/factory';
declare const brand:unique symbol;
export interface EmbodiedModel {readonly [brand]:true;}
const models=new WeakMap<object,Awaited<ReturnType<typeof compileEmbodiedModel>>>();
function facts(handle:EmbodiedModel){return models.get(handle)??invalidModel('prepared EMB model required');}
export async function prepareEmbodiedModel(source:Campaign2ModelSource):Promise<EmbodiedModel>{
 const model=await compileEmbodiedModel(source),digest=Array.from(model.modelIdentity.digest,b=>b.toString(16).padStart(2,'0')).join('');
 if(!freeze.models.some(m=>m.modelDigest===digest))invalidModel('model outside corrected frozen EMB cohort');
 const handle=Object.freeze({}) as EmbodiedModel;models.set(handle,model);return handle;
}
export const embodiedModelIdentity=(handle:EmbodiedModel)=>facts(handle).modelIdentity.canonicalBytes.slice();
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
export async function createEmbodiedRun(handle:EmbodiedModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=facts(handle),data=copies(input,['initialState','orderedInputs','runSeed']);
 const state=model.state.restoreState(data.initialState);
 const inputs=await compileEmbodiedInputs(data.orderedInputs,data.initialState,model.modelIdentity,data.runSeed),runtime=createEmbodiedRuntime(model,inputs,state),identity=embodiedInputFacts(inputs).runIdentity;
 return Object.freeze({async settleNextInstant(){return (await runtime.settleNextInstant())!==undefined;},snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))});},
  save:()=>runtime.save(),runIdentity:()=>identity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(identity.value,d)):undefined;}});
}
export async function restoreEmbodiedRun(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{return await restorePrefix(source,input);}catch(error){if(error instanceof SaveContractError||error instanceof CanonicalEncodingError)throw error;throw new SaveContractError(error instanceof Error?error.message:String(error));}
}
async function restorePrefix(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 const data=copies(input,['initialState','orderedInputs','save']),handle=await prepareEmbodiedModel(source);
 const save=rec(decode(data.save),132n),runIdentity=await restoreRunIdentity(f(save,3n)),seed=f(rec(runIdentity.value,104n),4n);
 if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
 const replay=await createEmbodiedRun(handle,{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
 if(key(decode(replay.runIdentity()))!==key(runIdentity.value))throw new SaveContractError('original S0/input/model commitments differ');
 const rows=items(f(save,11n),'list');for(const value of rows)rec(value,160n);
 let count=0;while(count<rows.length){try{if(!await replay.settleNextInstant())throw new SaveContractError('prefix exhausted');}catch(error){throw new SaveContractError('prefix execution failed: '+(error instanceof Error?error.message:String(error)));}
  count=items(decode(replay.snapshot().trace),'list').length;if(count>rows.length)throw new SaveContractError('prefix crosses whole-instant boundary');
 }
 if(key(decode(replay.save()))!==key(save))throw new SaveContractError('whole-save prefix equality failed');
 return replay;
}
