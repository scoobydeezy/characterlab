/** Data-only public entry and complete-prefix restore for the frozen lying cohort. */
import freeze from '../../docs/planning/campaign3-lying-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeLying as decode} from './lyingCodecs';
import {compileLyingModel,compileLyingInputs,copyData,type LyingCompiled,type LyingSource} from './lyingModel';
import {HOLDERS} from './lyingModel';
const lyingObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('LYING_OBSERVER');const out=[];
 for(const v of xs){if(typeof v==='boolean'||v.kind!=='record')throw Error('LYING_OUTPUT');const t=v.schema.typeId;if(![1085n,1088n,1095n].includes(t))continue;
 if(key(f(v,t===1088n?3n:2n))!==key(HOLDERS[i+1]))continue;
 if(t===1085n&&!items(f(v,4n),'list').length)continue;
 if(t===1095n&&key(f(v,3n))===key(f(v,4n)))continue;out.push(v);
 }return list(out);
};
import {createLyingRuntime} from './lyingRuntime';

declare const brand:unique symbol;
export interface LyingModel {readonly [brand]:true;}
const models=new WeakMap<object,LyingCompiled>();
export async function prepareLyingModel(source:LyingSource):Promise<LyingModel>{
 const model=await compileLyingModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('LYING_NOT_FROZEN');
 const handle=Object.freeze({}) as LyingModel;models.set(handle,model);return handle;
}
export async function createLyingRun(handle:LyingModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('LYING_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileLyingInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createLyingRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(lyingObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreLyingRun(source:LyingSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('LYING_SAVE_SEED');
  const run=await createLyingRun(await prepareLyingModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('LYING_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('LYING_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('LYING_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('LYING_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
