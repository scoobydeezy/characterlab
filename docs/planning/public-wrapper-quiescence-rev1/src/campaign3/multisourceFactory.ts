/** Public finite multisource factory. Data-only inputs and complete-prefix restore. */
import freeze from '../../docs/planning/campaign3-multisource-model-rev2/FREEZE.json';
import {canonicalEncode as enc,list,CanonicalEncodingError} from '../substrate/canonicalEncoding';
import {restoreRunIdentity} from '../substrate/identity';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../campaign2/factory';
import {compileMultisourceModel} from './multisourceModel';
import {compileMultisourceInputs} from './multisourceInputs';
import {createMultisourceRuntime} from './multisourceRuntime';
import {decodeMultisource as decode} from './multisourcePublicCodecs';
declare const brand:unique symbol;
export interface MultisourceModel {readonly [brand]:true;}
const models=new WeakMap<object,Awaited<ReturnType<typeof compileMultisourceModel>>>();
const facts=(handle:MultisourceModel)=>models.get(handle)??fail('prepared multisource model required');
export async function prepareMultisourceModel(source:Campaign2ModelSource):Promise<MultisourceModel>{
 const model=await compileMultisourceModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))fail('outside frozen multisource cohort');const handle=Object.freeze({}) as MultisourceModel;models.set(handle,model);return handle;
}
export const multisourceModelIdentity=(handle:MultisourceModel)=>facts(handle).modelIdentity.canonicalBytes.slice();
function copies<K extends string>(input:Record<K,Uint8Array>,names:readonly K[]):Record<K,Uint8Array>{
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)fail('plain multisource run data required');const descriptors=Object.getOwnPropertyDescriptors(input);
 if(Reflect.ownKeys(descriptors).length!==names.length||names.some(n=>!descriptors[n]||!('value'in descriptors[n])))fail('exact data-only multisource fields');
 const result={} as Record<K,Uint8Array>;for(const name of names){const v=descriptors[name].value;
  if(!(v instanceof Uint8Array)||Object.getPrototypeOf(v)!==Uint8Array.prototype||Reflect.ownKeys(v).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))fail('plain multisource bytes required');
  const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(v);result[name]=new Uint8Array(length);Uint8Array.prototype.set.call(result[name],v);
 }return result;
}
export async function createMultisourceRun(handle:MultisourceModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=facts(handle),data=copies(input,['initialState','orderedInputs','runSeed']),initial=model.initialState(data.initialState),inputs=await compileMultisourceInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createMultisourceRuntime(model,inputs,initial);
 return Object.freeze({async settleNextInstant(){return (await runtime.settleNextInstant())!==undefined;},snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))});},save:()=>runtime.save(),runIdentity:()=>inputs.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(inputs.runIdentity.value,d)):undefined;}});
}
export async function restoreMultisourceRun(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copies(input,['initialState','orderedInputs','save']),handle=await prepareMultisourceModel(source),save=rec(decode(data.save),132n),identity=await restoreRunIdentity(f(save,3n)),seed=f(rec(identity.value,104n),4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
  const run=await createMultisourceRun(handle,{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity.value))throw new SaveContractError('original model/S0/input commitments differ');
  const target=items(f(save,11n),'list');target.forEach(v=>rec(v,160n));let count=0;
  while(count<target.length){if(!await run.settleNextInstant())throw new SaveContractError('prefix exhausted');count=items(decode(run.snapshot().trace),'list').length;if(count>target.length)throw new SaveContractError('not a whole-instant prefix');}
  if(key(decode(run.save()))!==key(save))throw new SaveContractError('whole-save prefix equality failed');return run;
 }catch(error){if(error instanceof SaveContractError||error instanceof CanonicalEncodingError)throw error;throw new SaveContractError(error instanceof Error?error.message:String(error));}
}
