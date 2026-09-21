/** Data-only public entry and complete-prefix restore for the frozen epi cohort. */
import freeze from '../../docs/planning/campaign3-epi-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeEpi as decode} from './epiCodecs';
import {compileEpiModel,compileEpiInputs,copyData,type EpiCompiled,type EpiSource} from './epiModel';
import {createEpiRuntime} from './epiRuntime';

/** Finite consumer projection, not a redactor for arbitrary trace records. */
export function characterOutputs(outputs:readonly import('../substrate/canonicalEncoding').CanonicalValue[]){
 return outputs.filter(v=>{if(typeof v==='boolean'||v.kind!=='record'||![900n,904n,905n,906n,907n,910n,912n].includes(v.schema.typeId))throw Error('EPI_UNCLASSIFIED_OUTPUT');return v.schema.typeId!==912n;});
}
declare const brand:unique symbol;
export interface EpiModel {readonly [brand]:true;}
const models=new WeakMap<object,EpiCompiled>();
export async function prepareEpiModel(source:EpiSource):Promise<EpiModel>{
 const model=await compileEpiModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('EPI_NOT_FROZEN');
 const handle=Object.freeze({}) as EpiModel;models.set(handle,model);return handle;
}
export async function createEpiRun(handle:EpiModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('EPI_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileEpiInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createEpiRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},characterView(){const s=runtime.snapshot();return {state:enc(s.state.canonicalValue()),outputs:enc(list(characterOutputs(s.outputs)))};},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreEpiRun(source:EpiSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('EPI_SAVE_SEED');
  const run=await createEpiRun(await prepareEpiModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('EPI_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('EPI_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('EPI_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('EPI_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
