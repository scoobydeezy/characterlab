/** Native factory and complete-instant restore. No callbacks or writable handles. */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeEmbarrassmentPublic as decode} from './embarrassmentPublicCodecs';
import {compileEmbarrassmentPublicModel,compileEmbarrassmentPublicInputs,copyData,type EmbarrassmentPublicCompiled,type EmbarrassmentPublicSource} from './embarrassmentPublicModel';
import {createEmbarrassmentPublicRuntime} from './embarrassmentPublicRuntime';
import {parseEmbarrassmentSave} from './embarrassmentPublicCodecs';
declare const brand:unique symbol;
export interface EmbarrassmentPublicModel {readonly [brand]:true;}
const models=new WeakMap<object,EmbarrassmentPublicCompiled>();
export async function prepareEmbarrassmentPublicModel(source:EmbarrassmentPublicSource):Promise<EmbarrassmentPublicModel>{const compiled=await compileEmbarrassmentPublicModel(source),handle=Object.freeze({}) as EmbarrassmentPublicModel;models.set(handle,compiled);return handle;}
export async function createEmbarrassmentPublicRun(handle:EmbarrassmentPublicModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('EMBARRASSMENT_PUBLIC_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileEmbarrassmentPublicInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createEmbarrassmentPublicRuntime(model,compiled);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView(){return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId!==1484n)));},save:()=>runtime.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreEmbarrassmentPublicRun(source:EmbarrassmentPublicSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=parseEmbarrassmentSave(original.save),disposition=rec(f(saved,3n),104n),seed=f(disposition,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('EMBARRASSMENT_PUBLIC_SAVE_SEED');const handle=await prepareEmbarrassmentPublicModel(source),stageCount=12,run=await createEmbarrassmentPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(disposition))throw Error('EMBARRASSMENT_PUBLIC_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>72||count%stageCount)throw Error('EMBARRASSMENT_PUBLIC_SAVE_PARTIAL_INSTANT');for(let i=0;i<count/stageCount;i++)if(!await run.settleNextInstant())throw Error('EMBARRASSMENT_PUBLIC_SAVE_PREFIX');const actualSave=run.save();if(actualSave.length!==original.save.length||!actualSave.every((b,i)=>b===original.save[i]))throw Error('EMBARRASSMENT_PUBLIC_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
