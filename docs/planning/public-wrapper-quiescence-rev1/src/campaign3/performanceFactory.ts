/** Data-only public entry and complete-prefix restore for the frozen performance cohort. */
import freeze from '../../docs/planning/campaign3-performance-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodePerformance as decode} from './performanceCodecs';
import {compilePerformanceModel,compilePerformanceInputs,copyData,type PerformanceCompiled,type PerformanceSource} from './performanceModel';
import {performanceObserverView} from './performanceMath';
import {createPerformanceRuntime} from './performanceRuntime';

declare const brand:unique symbol;
export interface PerformanceModel {readonly [brand]:true;}
const models=new WeakMap<object,PerformanceCompiled>();
export async function preparePerformanceModel(source:PerformanceSource):Promise<PerformanceModel>{
 const model=await compilePerformanceModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('PERFORMANCE_NOT_FROZEN');
 const handle=Object.freeze({}) as PerformanceModel;models.set(handle,model);return handle;
}
export async function createPerformanceRun(handle:PerformanceModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('PERFORMANCE_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compilePerformanceInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createPerformanceRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(performanceObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restorePerformanceRun(source:PerformanceSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('PERFORMANCE_SAVE_SEED');
  const run=await createPerformanceRun(await preparePerformanceModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('PERFORMANCE_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('PERFORMANCE_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('PERFORMANCE_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('PERFORMANCE_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
