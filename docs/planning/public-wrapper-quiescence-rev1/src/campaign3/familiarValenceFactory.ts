/** Data-only public entry and complete-prefix restore for the frozen familiarValence cohort. */
import freeze from '../../docs/planning/campaign3-familiar-valence-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeFamiliarValence as decode} from './familiarValenceCodecs';
import {compileFamiliarValenceModel,compileFamiliarValenceInputs,copyData,type FamiliarValenceCompiled,type FamiliarValenceSource} from './familiarValenceModel';
import {HOLDERS} from './familiarValenceModel';
const familiarValenceObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('FAMILIAR_VALENCE_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('FAMILIAR_VALENCE_OUTPUT');const t=v.schema.typeId;if(![1237n,1238n,1244n,1245n,1246n].includes(t))return false;
 const holder=t===1245n?f(rec(f(v,2n),1244n),3n):f(v,t===1244n?3n:2n);if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1237n&&![6n,7n,8n,9n].some(k=>items(f(v,k),'list').length))return false;if(t===1246n&&key(f(v,5n))===key(f(v,6n)))return false;return true;
 }));
};
import {createFamiliarValenceRuntime} from './familiarValenceRuntime';

declare const brand:unique symbol;
export interface FamiliarValenceModel {readonly [brand]:true;}
const models=new WeakMap<object,FamiliarValenceCompiled>();
export async function prepareFamiliarValenceModel(source:FamiliarValenceSource):Promise<FamiliarValenceModel>{
 const model=await compileFamiliarValenceModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('FAMILIAR_VALENCE_NOT_FROZEN');
 const handle=Object.freeze({}) as FamiliarValenceModel;models.set(handle,model);return handle;
}
export async function createFamiliarValenceRun(handle:FamiliarValenceModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('FAMILIAR_VALENCE_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileFamiliarValenceInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createFamiliarValenceRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(familiarValenceObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreFamiliarValenceRun(source:FamiliarValenceSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('FAMILIAR_VALENCE_SAVE_SEED');
  const run=await createFamiliarValenceRun(await prepareFamiliarValenceModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('FAMILIAR_VALENCE_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('FAMILIAR_VALENCE_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('FAMILIAR_VALENCE_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('FAMILIAR_VALENCE_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
