/** Data-only public entry and complete-prefix restore for the frozen reason cohort. */
import freeze from '../../docs/planning/campaign3-reason-model-rev3/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeReason as decode} from './reasonCodecs';
import {compileReasonModel,compileReasonInputs,copyData,type ReasonCompiled,type ReasonSource} from './reasonModel';
import {createReasonRuntime} from './reasonRuntime';

declare const brand:unique symbol;
export interface ReasonModel {readonly [brand]:true;}
const models=new WeakMap<object,ReasonCompiled>();
export async function prepareReasonModel(source:ReasonSource):Promise<ReasonModel>{
 const model=await compileReasonModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('REASON_NOT_FROZEN');
 const handle=Object.freeze({}) as ReasonModel;models.set(handle,model);return handle;
}
export async function createReasonRun(handle:ReasonModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('REASON_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileReasonInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createReasonRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreReasonRun(source:ReasonSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('REASON_SAVE_SEED');
  const run=await createReasonRun(await prepareReasonModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('REASON_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('REASON_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('REASON_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('REASON_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
