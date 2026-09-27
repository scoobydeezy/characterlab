/** Native factory and complete-instant restore. No callbacks or writable handles. */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeIdentityPublic as decode} from './identityPublicCodecs';
import {compileIdentityModel,compileIdentityInputs,copyData,type IdentityCompiled,type IdentitySource} from './identityPublicModel';
import {createIdentityTaskRuntime} from './identityTaskRuntime';
import {createIdentityBiologyRuntime} from './identityBiologyRuntime';
const createIdentityRuntime=(model:IdentityCompiled,input:Awaited<ReturnType<typeof compileIdentityInputs>>)=>model.family==='Task'?createIdentityTaskRuntime(model,input):createIdentityBiologyRuntime(model,input);
declare const brand:unique symbol;
export interface IdentityModel {readonly [brand]:true;}
const models=new WeakMap<object,IdentityCompiled>();
export async function prepareIdentityModel(source:IdentitySource):Promise<IdentityModel>{const compiled=await compileIdentityModel(source),handle=Object.freeze({}) as IdentityModel;models.set(handle,compiled);return handle;}
export async function createIdentityPublicRun(handle:IdentityModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('IDENTITY_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileIdentityInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createIdentityRuntime(model,compiled);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView(observer=0){if(observer!==0)throw Error('IDENTITY_OBSERVER_HANDLE');return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1409n,1410n,1411n,1412n,1413n,1414n,1415n,1416n,1417n,1419n,1420n,1429n,1430n,1431n,1432n,1433n,1434n,1437n,1438n,1442n].includes(v.schema.typeId))));},save:()=>runtime.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreIdentityPublicRun(source:IdentitySource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(original.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('IDENTITY_SAVE_SEED');const handle=await prepareIdentityModel(source),stages=models.get(handle)!.stages,run=await createIdentityPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity))throw Error('IDENTITY_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count%stages.length)throw Error('IDENTITY_SAVE_PARTIAL_INSTANT');for(let i=0;i<count/stages.length;i++)if(!await run.settleNextInstant())throw Error('IDENTITY_SAVE_PREFIX');const actualSave=run.save();if(actualSave.length!==original.save.length||!actualSave.every((b,i)=>b===original.save[i]))throw Error('IDENTITY_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
