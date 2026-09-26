/** Data-only public entry and complete-prefix restore for the frozen procrastination cohort. */
import freeze from '../../docs/planning/campaign3-procrastination-model-rev1/FREEZE.json';
import {canonicalEncode as enc,canonicalDecode,RecordSchemaRegistry,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeProcrastination as decode,procrastinationSupportedSchemas} from './procrastinationCodecs';
import {compileProcrastinationModel,compileProcrastinationInputs,copyData,type ProcrastinationCompiled,type ProcrastinationSource} from './procrastinationModel';
import {createProcrastinationRuntime} from './procrastinationRuntime';
declare const brand:unique symbol;
export interface ProcrastinationModel {readonly [brand]:true;}
const models=new WeakMap<object,ProcrastinationCompiled>();
export async function prepareProcrastinationModel(source:ProcrastinationSource):Promise<ProcrastinationModel>{
 const model=await compileProcrastinationModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('PROCRASTINATION_NOT_FROZEN');
 const handle=Object.freeze({}) as ProcrastinationModel;models.set(handle,model);return handle;
}
export async function createProcrastinationRun(handle:ProcrastinationModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 return (await constructRun(handle,input)).run;
}
async function constructRun(handle:ProcrastinationModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('PROCRASTINATION_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileProcrastinationInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createProcrastinationRuntime(model,original);
 const run=Object.freeze({observerView(i=0){if(i!==0)throw Error('PROCRASTINATION_OBSERVER_HANDLE');return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1375n,1376n,1362n,1363n,1364n,1365n,1366n,836n,837n,838n,1360n,1361n,1370n,1373n].includes(v.schema.typeId))));},settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
 return {run,runtime};
}
export async function restoreProcrastinationRun(source:ProcrastinationSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  // Structural parse only here. Every semantic byte is authenticated by equality
  // with a newly executed, fully validated save before a handle is returned. This
  // avoids repeatedly validating nested historical traces just to count a prefix.
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(canonicalDecode(data.save,new RecordSchemaRegistry(procrastinationSupportedSchemas())),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('PROCRASTINATION_SAVE_SEED');
  const {run,runtime}=await constructRun(await prepareProcrastinationModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('PROCRASTINATION_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  if(count>240)throw Error('PROCRASTINATION_SAVE_TRACE_LIMIT');
  while(actual<count){if(!await run.settleNextInstant())throw Error('PROCRASTINATION_SAVE_PREFIX');actual=runtime.snapshot().trace.length;if(actual>count)throw Error('PROCRASTINATION_SAVE_PARTIAL_INSTANT');}
  const replayed=run.save();if(replayed.length!==data.save.length||replayed.some((b,i)=>b!==data.save[i]))throw Error('PROCRASTINATION_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}



