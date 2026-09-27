/** Data-only public entry and complete-prefix restore for the frozen relDimensions cohort. */
import freeze from '../../docs/planning/campaign3-rel-dimensions-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeRelDimensions as decode} from './relDimensionsCodecs';
import {compileRelDimensionsModel,compileRelDimensionsInputs,copyData,type RelDimensionsCompiled,type RelDimensionsSource} from './relDimensionsModel';
import {HOLDERS} from './relDimensionsModel';
const relDimensionsObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('REL_DIMENSIONS_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('REL_DIMENSIONS_OUTPUT');const t=v.schema.typeId;if(![1209n,1210n,1216n,1217n,1218n].includes(t))return false;
 const holder=t===1217n?f(rec(f(v,2n),1216n),3n):f(v,t===1216n?3n:2n);if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1209n&&![6n,7n,8n].some(k=>items(f(v,k),'list').length))return false;if(t===1218n&&key(f(v,5n))===key(f(v,6n)))return false;return true;
 }));
};
import {createRelDimensionsRuntime} from './relDimensionsRuntime';

declare const brand:unique symbol;
export interface RelDimensionsModel {readonly [brand]:true;}
const models=new WeakMap<object,RelDimensionsCompiled>();
export async function prepareRelDimensionsModel(source:RelDimensionsSource):Promise<RelDimensionsModel>{
 const model=await compileRelDimensionsModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('REL_DIMENSIONS_NOT_FROZEN');
 const handle=Object.freeze({}) as RelDimensionsModel;models.set(handle,model);return handle;
}
export async function createRelDimensionsRun(handle:RelDimensionsModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('REL_DIMENSIONS_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileRelDimensionsInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createRelDimensionsRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(relDimensionsObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreRelDimensionsRun(source:RelDimensionsSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('REL_DIMENSIONS_SAVE_SEED');
  const run=await createRelDimensionsRun(await prepareRelDimensionsModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('REL_DIMENSIONS_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('REL_DIMENSIONS_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('REL_DIMENSIONS_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('REL_DIMENSIONS_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
