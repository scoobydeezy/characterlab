/** Data-only public entry and complete-prefix restore for the frozen affect cohort. */
import freeze from '../../docs/planning/campaign3-affect-model-rev1/FREEZE.json';
import {canonicalEncode as enc,canonicalDecode,RecordSchemaRegistry,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeAffect as decode,affectSupportedSchemas} from './affectCodecs';
import {compileAffectModel,compileAffectInputs,copyData,type AffectCompiled,type AffectSource} from './affectModel';
import {createAffectRuntime} from './affectRuntime';
declare const brand:unique symbol;
export interface AffectModel {readonly [brand]:true;}
const models=new WeakMap<object,AffectCompiled>();
export async function prepareAffectModel(source:AffectSource):Promise<AffectModel>{
 const model=await compileAffectModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('AFFECT_NOT_FROZEN');
 const handle=Object.freeze({}) as AffectModel;models.set(handle,model);return handle;
}
export async function createAffectRun(handle:AffectModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 return (await constructRun(handle,input)).run;
}
async function constructRun(handle:AffectModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('AFFECT_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileAffectInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createAffectRuntime(model,original);
 const run=Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
 return {run,runtime};
}
export async function restoreAffectRun(source:AffectSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  // Structural parse only here. Every semantic byte is authenticated by equality
  // with a newly executed, fully validated save before a handle is returned. This
  // avoids repeatedly validating nested historical traces just to count a prefix.
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(canonicalDecode(data.save,new RecordSchemaRegistry(affectSupportedSchemas())),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('AFFECT_SAVE_SEED');
  const {run,runtime}=await constructRun(await prepareAffectModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('AFFECT_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  if(count>255)throw Error('AFFECT_SAVE_TRACE_LIMIT');
  while(actual<count){if(!await run.settleNextInstant())throw Error('AFFECT_SAVE_PREFIX');actual=runtime.snapshot().trace.length;if(actual>count)throw Error('AFFECT_SAVE_PARTIAL_INSTANT');}
  const replayed=run.save();if(replayed.length!==data.save.length||replayed.some((b,i)=>b!==data.save[i]))throw Error('AFFECT_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
