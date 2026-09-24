/** Data-only public entry and complete-prefix restore for the frozen recollection cohort. */
import freeze from '../../docs/planning/campaign3-recollection-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeRecollection as decode} from './recollectionCodecs';
import {compileRecollectionModel,compileRecollectionInputs,copyData,type RecollectionCompiled,type RecollectionSource} from './recollectionModel';
const recollectionObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{if(i!==0)throw Error('RECOLLECTION_OBSERVER');return list(xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1049n,1050n,1051n].includes(v.schema.typeId)||typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1042n&&((f(v,5n) as {value:bigint}).value>0n)));};
import {createRecollectionRuntime} from './recollectionRuntime';

declare const brand:unique symbol;
export interface RecollectionModel {readonly [brand]:true;}
const models=new WeakMap<object,RecollectionCompiled>();
export async function prepareRecollectionModel(source:RecollectionSource):Promise<RecollectionModel>{
 const model=await compileRecollectionModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('RECOLLECTION_NOT_FROZEN');
 const handle=Object.freeze({}) as RecollectionModel;models.set(handle,model);return handle;
}
export async function createRecollectionRun(handle:RecollectionModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('RECOLLECTION_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileRecollectionInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createRecollectionRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(recollectionObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreRecollectionRun(source:RecollectionSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('RECOLLECTION_SAVE_SEED');
  const run=await createRecollectionRun(await prepareRecollectionModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('RECOLLECTION_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('RECOLLECTION_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('RECOLLECTION_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('RECOLLECTION_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
