/** Data-only public entry and complete-prefix restore for the frozen hearsay cohort. */
import freeze from '../../docs/planning/campaign3-hearsay-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeHearsay as decode} from './hearsayCodecs';
import {compileHearsayModel,compileHearsayInputs,copyData,type HearsayCompiled,type HearsaySource} from './hearsayModel';
import {HOLDERS} from './hearsayModel';
const hearsayObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('HEARSAY_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('HEARSAY_OUTPUT');const t=v.schema.typeId;
 if(![1199n,1202n,1203n,1204n].includes(t))return false;
 const holder=t===1203n?f(rec(f(v,2n),1202n),3n):f(v,t===1202n?3n:2n);
 if(key(holder)!==key(HOLDERS[i+1]))return false;
 if(t===1199n&&!items(f(v,9n),'list').length)return false;
 if(t===1204n&&key(f(v,3n))===key(f(v,4n)))return false;return true;
 }));
};
import {createHearsayRuntime} from './hearsayRuntime';

declare const brand:unique symbol;
export interface HearsayModel {readonly [brand]:true;}
const models=new WeakMap<object,HearsayCompiled>();
export async function prepareHearsayModel(source:HearsaySource):Promise<HearsayModel>{
 const model=await compileHearsayModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('HEARSAY_NOT_FROZEN');
 const handle=Object.freeze({}) as HearsayModel;models.set(handle,model);return handle;
}
export async function createHearsayRun(handle:HearsayModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('HEARSAY_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileHearsayInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createHearsayRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(hearsayObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreHearsayRun(source:HearsaySource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('HEARSAY_SAVE_SEED');
  const run=await createHearsayRun(await prepareHearsayModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('HEARSAY_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('HEARSAY_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('HEARSAY_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('HEARSAY_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
