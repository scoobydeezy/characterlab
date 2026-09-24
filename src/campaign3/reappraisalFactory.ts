/** Data-only public entry and complete-prefix restore for the frozen reappraisal cohort. */
import freeze from '../../docs/planning/campaign3-reappraisal-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeReappraisal as decode} from './reappraisalCodecs';
import {compileReappraisalModel,compileReappraisalInputs,copyData,type ReappraisalCompiled,type ReappraisalSource} from './reappraisalModel';
const reappraisalObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{if(i!==0)throw Error('REAPPRAISAL_OBSERVER');return list(xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1032n,1033n,1035n,1036n].includes(v.schema.typeId)||typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1027n&&(items(f(v,5n),'list').length>0||(f(v,6n) as {value:bigint}).value>0n)));};
import {createReappraisalRuntime} from './reappraisalRuntime';

declare const brand:unique symbol;
export interface ReappraisalModel {readonly [brand]:true;}
const models=new WeakMap<object,ReappraisalCompiled>();
export async function prepareReappraisalModel(source:ReappraisalSource):Promise<ReappraisalModel>{
 const model=await compileReappraisalModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('REAPPRAISAL_NOT_FROZEN');
 const handle=Object.freeze({}) as ReappraisalModel;models.set(handle,model);return handle;
}
export async function createReappraisalRun(handle:ReappraisalModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('REAPPRAISAL_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileReappraisalInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createReappraisalRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(reappraisalObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreReappraisalRun(source:ReappraisalSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('REAPPRAISAL_SAVE_SEED');
  const run=await createReappraisalRun(await prepareReappraisalModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('REAPPRAISAL_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('REAPPRAISAL_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('REAPPRAISAL_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('REAPPRAISAL_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
