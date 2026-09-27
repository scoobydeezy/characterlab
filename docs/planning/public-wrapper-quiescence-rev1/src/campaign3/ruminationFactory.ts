/** Data-only public entry and complete-prefix restore for the frozen rumination cohort. */
import freeze from '../../docs/planning/campaign3-rumination-model-rev1/FREEZE.json';
import {canonicalEncode as enc,canonicalDecode,RecordSchemaRegistry,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeRumination as decode,ruminationSupportedSchemas} from './ruminationCodecs';
import {compileRuminationModel,compileRuminationInputs,copyData,type RuminationCompiled,type RuminationSource} from './ruminationModel';
import {createRuminationRuntime} from './ruminationRuntime';
declare const brand:unique symbol;
export interface RuminationModel {readonly [brand]:true;}
const models=new WeakMap<object,RuminationCompiled>();
export async function prepareRuminationModel(source:RuminationSource):Promise<RuminationModel>{
 const model=await compileRuminationModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('RUMINATION_NOT_FROZEN');
 const handle=Object.freeze({}) as RuminationModel;models.set(handle,model);return handle;
}
export async function createRuminationRun(handle:RuminationModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 return (await constructRun(handle,input)).run;
}
async function constructRun(handle:RuminationModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('RUMINATION_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileRuminationInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createRuminationRuntime(model,original);
 const run=Object.freeze({observerView(i=0){if(i!==0)throw Error('RUMINATION_OBSERVER_HANDLE');return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[826n,827n,1320n,1321n,1322n,1323n,1324n,836n,837n,838n,1318n,1319n,1328n,1331n].includes(v.schema.typeId))));},settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
 return {run,runtime};
}
export async function restoreRuminationRun(source:RuminationSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  // Structural parse only here. Every semantic byte is authenticated by equality
  // with a newly executed, fully validated save before a handle is returned. This
  // avoids repeatedly validating nested historical traces just to count a prefix.
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(canonicalDecode(data.save,new RecordSchemaRegistry(ruminationSupportedSchemas())),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('RUMINATION_SAVE_SEED');
  const {run,runtime}=await constructRun(await prepareRuminationModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('RUMINATION_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  if(count>240)throw Error('RUMINATION_SAVE_TRACE_LIMIT');
  while(actual<count){if(!await run.settleNextInstant())throw Error('RUMINATION_SAVE_PREFIX');actual=runtime.snapshot().trace.length;if(actual>count)throw Error('RUMINATION_SAVE_PARTIAL_INSTANT');}
  const replayed=run.save();if(replayed.length!==data.save.length||replayed.some((b,i)=>b!==data.save[i]))throw Error('RUMINATION_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}



