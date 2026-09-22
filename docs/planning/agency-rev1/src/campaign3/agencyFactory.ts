/** Data-only public entry and complete-prefix restore for the frozen agency cohort. */
import freeze from '../../docs/planning/campaign3-agency-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeAgency as decode} from './agencyCodecs';
import {compileAgencyModel,compileAgencyInputs,copyData,type AgencyCompiled,type AgencySource} from './agencyModel';
import {agencyObserverView} from './agencyMath';
import {createAgencyRuntime} from './agencyRuntime';

declare const brand:unique symbol;
export interface AgencyModel {readonly [brand]:true;}
const models=new WeakMap<object,AgencyCompiled>();
export async function prepareAgencyModel(source:AgencySource):Promise<AgencyModel>{
 const model=await compileAgencyModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('AGENCY_NOT_FROZEN');
 const handle=Object.freeze({}) as AgencyModel;models.set(handle,model);return handle;
}
export async function createAgencyRun(handle:AgencyModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('AGENCY_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileAgencyInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createAgencyRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(agencyObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreAgencyRun(source:AgencySource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('AGENCY_SAVE_SEED');
  const run=await createAgencyRun(await prepareAgencyModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('AGENCY_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('AGENCY_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('AGENCY_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('AGENCY_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
