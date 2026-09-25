/** Data-only public entry and complete-prefix restore for the frozen betrayal cohort. */
import freeze from '../../docs/planning/campaign3-betrayal-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeBetrayal as decode} from './betrayalCodecs';
import {compileBetrayalModel,compileBetrayalInputs,copyData,type BetrayalCompiled,type BetrayalSource} from './betrayalModel';
import {HOLDERS} from './betrayalModel';
const betrayalObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('BETRAYAL_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('BETRAYAL_OUTPUT');const t=v.schema.typeId;if(![1266n,1267n,1273n,1274n,1275n].includes(t))return false;
 const holder=t===1274n?f(rec(f(v,2n),1273n),3n):f(v,t===1273n?3n:2n);if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1266n&&![7n,8n,9n,10n,11n].some(k=>items(f(v,k),'list').length))return false;if(t===1275n&&key(f(v,5n))===key(f(v,6n)))return false;return true;
 }));
};
import {createBetrayalRuntime} from './betrayalRuntime';

declare const brand:unique symbol;
export interface BetrayalModel {readonly [brand]:true;}
const models=new WeakMap<object,BetrayalCompiled>();
export async function prepareBetrayalModel(source:BetrayalSource):Promise<BetrayalModel>{
 const model=await compileBetrayalModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('BETRAYAL_NOT_FROZEN');
 const handle=Object.freeze({}) as BetrayalModel;models.set(handle,model);return handle;
}
export async function createBetrayalRun(handle:BetrayalModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('BETRAYAL_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileBetrayalInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createBetrayalRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(betrayalObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreBetrayalRun(source:BetrayalSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('BETRAYAL_SAVE_SEED');
  const run=await createBetrayalRun(await prepareBetrayalModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('BETRAYAL_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('BETRAYAL_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('BETRAYAL_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('BETRAYAL_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
