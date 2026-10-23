/** Data-only public entry and complete-prefix restore for the frozen commit cohort. */
import freeze from '../../docs/planning/campaign3-commit-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeCommit as decode} from './commitCodecs';
import {compileCommitModel,compileCommitInputs,copyData,type CommitCompiled,type CommitSource} from './commitModel';
import {commitObserverView} from './commitMath';
import {createCommitRuntime} from './commitRuntime';

declare const brand:unique symbol;
export interface CommitModel {readonly [brand]:true;}
const models=new WeakMap<object,CommitCompiled>();
export async function prepareCommitModel(source:CommitSource):Promise<CommitModel>{
 const model=await compileCommitModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('COMMIT_NOT_FROZEN');
 const handle=Object.freeze({}) as CommitModel;models.set(handle,model);return handle;
}
export async function createCommitRun(handle:CommitModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('COMMIT_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileCommitInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createCommitRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(commitObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreCommitRun(source:CommitSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('COMMIT_SAVE_SEED');
  const run=await createCommitRun(await prepareCommitModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('COMMIT_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('COMMIT_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('COMMIT_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('COMMIT_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
