/** Native factory and complete-instant restore. No callbacks or writable handles. */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeDispositionPublic as decode} from './dispositionPublicCodecs';
import {compileDispositionModel,compileDispositionInputs,copyData,type DispositionCompiled,type DispositionSource} from './dispositionPublicModel';
import {createDispositionPublicRuntime} from './dispositionPublicRuntime';
import {parseDispositionSave} from './dispositionPublicCodecs';
declare const brand:unique symbol;
export interface DispositionModel {readonly [brand]:true;}
const models=new WeakMap<object,DispositionCompiled>();
export async function prepareDispositionModel(source:DispositionSource):Promise<DispositionModel>{const compiled=await compileDispositionModel(source),handle=Object.freeze({}) as DispositionModel;models.set(handle,compiled);return handle;}
export async function createDispositionPublicRun(handle:DispositionModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('DISPOSITION_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileDispositionInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createDispositionPublicRuntime(model,compiled);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},characterProjection(){return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1429n,1430n,1431n,1432n,1433n,1434n,1437n,1455n,1456n].includes(v.schema.typeId))));},save:()=>runtime.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreDispositionPublicRun(source:DispositionSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=parseDispositionSave(original.save),disposition=rec(f(saved,3n),104n),seed=f(disposition,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('DISPOSITION_SAVE_SEED');const handle=await prepareDispositionModel(source),stageCount=10,run=await createDispositionPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(disposition))throw Error('DISPOSITION_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>180||count%stageCount)throw Error('DISPOSITION_SAVE_PARTIAL_INSTANT');for(let i=0;i<count/stageCount;i++)if(!await run.settleNextInstant())throw Error('DISPOSITION_SAVE_PREFIX');const actualSave=run.save();if(actualSave.length!==original.save.length||!actualSave.every((b,i)=>b===original.save[i]))throw Error('DISPOSITION_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
