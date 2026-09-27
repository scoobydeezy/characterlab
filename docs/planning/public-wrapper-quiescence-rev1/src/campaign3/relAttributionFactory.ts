/** Data-only public entry and complete-prefix restore for the frozen relAttribution cohort. */
import freeze from '../../docs/planning/campaign3-rel-attribution-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeRelAttribution as decode} from './relAttributionCodecs';
import {compileRelAttributionModel,compileRelAttributionInputs,copyData,type RelAttributionCompiled,type RelAttributionSource} from './relAttributionModel';
import {HOLDERS} from './relAttributionModel';
const relAttributionObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('REL_ATTRIBUTION_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('REL_ATTRIBUTION_OUTPUT');const t=v.schema.typeId;if(![1223n,1224n,1230n,1231n,1232n].includes(t))return false;
 const holder=t===1231n?f(rec(f(v,2n),1230n),3n):f(v,t===1230n?3n:2n);if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1223n&&![7n,8n,9n].some(k=>items(f(v,k),'list').length))return false;if(t===1232n&&key(f(v,5n))===key(f(v,6n)))return false;return true;
 }));
};
import {createRelAttributionRuntime} from './relAttributionRuntime';

declare const brand:unique symbol;
export interface RelAttributionModel {readonly [brand]:true;}
const models=new WeakMap<object,RelAttributionCompiled>();
export async function prepareRelAttributionModel(source:RelAttributionSource):Promise<RelAttributionModel>{
 const model=await compileRelAttributionModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('REL_ATTRIBUTION_NOT_FROZEN');
 const handle=Object.freeze({}) as RelAttributionModel;models.set(handle,model);return handle;
}
export async function createRelAttributionRun(handle:RelAttributionModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('REL_ATTRIBUTION_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileRelAttributionInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createRelAttributionRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(relAttributionObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreRelAttributionRun(source:RelAttributionSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('REL_ATTRIBUTION_SAVE_SEED');
  const run=await createRelAttributionRun(await prepareRelAttributionModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('REL_ATTRIBUTION_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('REL_ATTRIBUTION_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('REL_ATTRIBUTION_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('REL_ATTRIBUTION_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
