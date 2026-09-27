/** attention-persistence/0.1-candidate and data-only first-profile activation. */
import {canonicalEncode as enc,list,CanonicalEncodingError} from '../substrate/canonicalEncoding';
import {restoreRunIdentity} from '../substrate/identity';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../campaign2/factory';
import {compileAttentionModel,type AttentionCompiledModel} from './attentionModel';
import {compileAttentionInputs} from './attentionInputs';
import {createAttentionRuntime} from './attentionRuntime';
import {decodeAttention as decode} from './attentionCodecs';
declare const brand:unique symbol;
export interface AttentionModel {readonly [brand]:true;}
const models=new WeakMap<object,AttentionCompiledModel>();
export async function prepareAttentionModel(source:Campaign2ModelSource):Promise<AttentionModel>{const model=await compileAttentionModel(source),token=Object.freeze({}) as AttentionModel;models.set(token,model);return token;}
function modelOf(token:AttentionModel){return models.get(token)??fail('prepared attention model required');}
export const attentionModelIdentity=(token:AttentionModel)=>modelOf(token).modelIdentity.canonicalBytes.slice();
function copies<K extends string>(input:Record<K,Uint8Array>,names:readonly K[]):Record<K,Uint8Array>{
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)fail('plain attention run data required');const fields=Object.getOwnPropertyDescriptors(input);if(Reflect.ownKeys(fields).length!==names.length||names.some(n=>!fields[n]||!('value'in fields[n])))fail('exact data-only run fields required');const result={} as Record<K,Uint8Array>;
 for(const name of names){const v=fields[name].value;if(!(v instanceof Uint8Array)||Object.getPrototypeOf(v)!==Uint8Array.prototype||Reflect.ownKeys(v).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))fail('plain bytes required');const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(v);result[name]=new Uint8Array(length);Uint8Array.prototype.set.call(result[name],v);}return result;
}
export async function createAttentionRun(token:AttentionModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=modelOf(token),data=copies(input,['initialState','orderedInputs','runSeed']),state=model.initialState(data.initialState),original=await compileAttentionInputs(data.orderedInputs,data.initialState,data.runSeed,model),runtime=createAttentionRuntime(model,original,state);
 return Object.freeze({async settleNextInstant(){return (await runtime.settleNextInstant())!==undefined;},snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))});},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreAttentionRun(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){try{return await restore(source,input);}catch(error){if(error instanceof SaveContractError||error instanceof CanonicalEncodingError)throw error;throw new SaveContractError(error instanceof Error?error.message:String(error));}}
async function restore(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 const data=copies(input,['initialState','orderedInputs','save']),token=await prepareAttentionModel(source),save=rec(decode(data.save),132n),identity=await restoreRunIdentity(f(save,3n)),seed=f(rec(identity.value,104n),4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
 const replay=await createAttentionRun(token,{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});if(key(decode(replay.runIdentity()))!==key(identity.value))throw new SaveContractError('original commitments differ');const count=items(f(save,11n),'list').length;
 if(count){if(!await replay.settleNextInstant()||items(decode(replay.snapshot().trace),'list').length!==count)throw new SaveContractError('not a complete instant prefix');}if(key(decode(replay.save()))!==key(save))throw new SaveContractError('whole-save prefix equality failed');return replay;
}
