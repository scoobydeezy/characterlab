/** Data-only public entry and complete-prefix restore for the frozen control cohort. */
import freeze from '../../docs/planning/campaign3-control-model-rev2/FREEZE.json';
import {canonicalEncode as enc,canonicalDecode,RecordSchemaRegistry,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeControl as decode,controlSupportedSchemas} from './controlCodecs';
import {compileControlModel,compileControlInputs,copyData,type ControlCompiled,type ControlSource} from './controlModel';
import {createControlRuntime} from './controlRuntime';
declare const brand:unique symbol;
export interface ControlModel {readonly [brand]:true;}
const models=new WeakMap<object,ControlCompiled>();
export async function prepareControlModel(source:ControlSource):Promise<ControlModel>{
 const model=await compileControlModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('CONTROL_NOT_FROZEN');
 const handle=Object.freeze({}) as ControlModel;models.set(handle,model);return handle;
}
export async function createControlRun(handle:ControlModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 return (await constructRun(handle,input)).run;
}
async function constructRun(handle:ControlModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('CONTROL_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileControlInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createControlRuntime(model,original);
 const run=Object.freeze({observerView(i=0){if(i!==0)throw Error('CONTROL_OBSERVER_HANDLE');return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[826n,827n,1017n,1018n,1019n,1020n,1021n,836n,837n,838n,1015n,1016n].includes(v.schema.typeId))));},settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
 return {run,runtime};
}
export async function restoreControlRun(source:ControlSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  // Structural parse only here. Every semantic byte is authenticated by equality
  // with a newly executed, fully validated save before a handle is returned. This
  // avoids repeatedly validating nested historical traces just to count a prefix.
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(canonicalDecode(data.save,new RecordSchemaRegistry(controlSupportedSchemas())),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('CONTROL_SAVE_SEED');
  const {run,runtime}=await constructRun(await prepareControlModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('CONTROL_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  if(count>224)throw Error('CONTROL_SAVE_TRACE_LIMIT');
  while(actual<count){if(!await run.settleNextInstant())throw Error('CONTROL_SAVE_PREFIX');actual=runtime.snapshot().trace.length;if(actual>count)throw Error('CONTROL_SAVE_PARTIAL_INSTANT');}
  const replayed=run.save();if(replayed.length!==data.save.length||replayed.some((b,i)=>b!==data.save[i]))throw Error('CONTROL_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}



