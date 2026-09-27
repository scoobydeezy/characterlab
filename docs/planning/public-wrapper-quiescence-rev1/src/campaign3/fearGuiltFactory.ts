/** Data-only public entry and complete-prefix restore for the frozen fearGuilt cohort. */
import freeze from '../../docs/planning/campaign3-fear-guilt-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeFearGuilt as decode} from './fearGuiltCodecs';
import {compileFearGuiltModel,compileFearGuiltInputs,copyData,type FearGuiltCompiled,type FearGuiltSource} from './fearGuiltModel';
import {HOLDERS} from './fearGuiltModel';
const fearGuiltObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('FEAR_GUILT_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('FEAR_GUILT_OUTPUT');const t=v.schema.typeId;
 if(![1170n,1173n,1174n,1175n].includes(t))return false;
 const holder=t===1174n?f(rec(f(v,2n),1173n),3n):f(v,t===1173n?3n:2n);
 if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1170n&&![6n,7n,8n].some(k=>items(f(v,k),'list').length))return false;
 if(t===1175n&&key(f(v,3n))===key(f(v,4n)))return false;return true;
 }));
};
import {createFearGuiltRuntime} from './fearGuiltRuntime';

declare const brand:unique symbol;
export interface FearGuiltModel {readonly [brand]:true;}
const models=new WeakMap<object,FearGuiltCompiled>();
export async function prepareFearGuiltModel(source:FearGuiltSource):Promise<FearGuiltModel>{
 const model=await compileFearGuiltModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('FEAR_GUILT_NOT_FROZEN');
 const handle=Object.freeze({}) as FearGuiltModel;models.set(handle,model);return handle;
}
export async function createFearGuiltRun(handle:FearGuiltModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('FEAR_GUILT_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileFearGuiltInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createFearGuiltRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(fearGuiltObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreFearGuiltRun(source:FearGuiltSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('FEAR_GUILT_SAVE_SEED');
  const run=await createFearGuiltRun(await prepareFearGuiltModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('FEAR_GUILT_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('FEAR_GUILT_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('FEAR_GUILT_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('FEAR_GUILT_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
