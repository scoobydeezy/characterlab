/** Native factory and complete-instant restore. No callbacks or writable handles. */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeBiologyPublic as decode} from './biologyPublicCodecs';
import {compileBiologyModel,compileBiologyInputs,copyData,type BiologyCompiled,type BiologySource} from './biologyPublicModel';
import {createBiologyRuntime} from './biologyPublicRuntime';
declare const brand:unique symbol;
export interface BiologyModel {readonly [brand]:true;}
const models=new WeakMap<object,BiologyCompiled>();
export async function prepareBiologyModel(source:BiologySource):Promise<BiologyModel>{const compiled=await compileBiologyModel(source),handle=Object.freeze({}) as BiologyModel;models.set(handle,compiled);return handle;}
export async function createBiologyPublicRun(handle:BiologyModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('BIOLOGY_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileBiologyInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createBiologyRuntime(model,compiled);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView(observer=0){if(observer!==0)throw Error('BIOLOGY_OBSERVER_HANDLE');return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1409n,1410n,1411n,1412n,1413n,1414n,1415n,1416n,1417n,1419n,1420n].includes(v.schema.typeId))));},save:()=>runtime.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreBiologyPublicRun(source:BiologySource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(original.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('BIOLOGY_SAVE_SEED');const run=await createBiologyPublicRun(await prepareBiologyModel(source),{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity))throw Error('BIOLOGY_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;let actual=0;while(actual<count){if(!await run.settleNextInstant())throw Error('BIOLOGY_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('BIOLOGY_SAVE_PARTIAL_INSTANT');}if(key(decode(run.save()))!==key(saved))throw Error('BIOLOGY_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
