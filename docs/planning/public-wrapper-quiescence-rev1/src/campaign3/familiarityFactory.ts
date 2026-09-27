/** Data-only public entry and complete-prefix restore for the frozen familiarity cohort. */
import freeze from '../../docs/planning/campaign3-familiarity-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeFamiliarity as decode} from './familiarityCodecs';
import {compileFamiliarityModel,compileFamiliarityInputs,copyData,type FamiliarityCompiled,type FamiliaritySource} from './familiarityModel';
const familiarityObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{if(i!==0)throw Error('FAMILIARITY_OBSERVER');return list(xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1062n,1063n].includes(v.schema.typeId)||typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1057n&&((f(v,4n) as {value:bigint}).value>0n)));};
import {createFamiliarityRuntime} from './familiarityRuntime';

declare const brand:unique symbol;
export interface FamiliarityModel {readonly [brand]:true;}
const models=new WeakMap<object,FamiliarityCompiled>();
export async function prepareFamiliarityModel(source:FamiliaritySource):Promise<FamiliarityModel>{
 const model=await compileFamiliarityModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('FAMILIARITY_NOT_FROZEN');
 const handle=Object.freeze({}) as FamiliarityModel;models.set(handle,model);return handle;
}
export async function createFamiliarityRun(handle:FamiliarityModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('FAMILIARITY_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileFamiliarityInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createFamiliarityRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(familiarityObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreFamiliarityRun(source:FamiliaritySource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('FAMILIARITY_SAVE_SEED');
  const run=await createFamiliarityRun(await prepareFamiliarityModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('FAMILIARITY_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('FAMILIARITY_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('FAMILIARITY_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('FAMILIARITY_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
