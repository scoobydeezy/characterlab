/** Data-only public entry and complete-prefix restore for the frozen decision cohort. */
import freeze from '../../docs/planning/campaign3-decision-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeDecision as decode} from './decisionCodecs';
import {compileDecisionModel,compileDecisionInputs,copyData,type DecisionCompiled,type DecisionSource} from './decisionModel';
import {decisionCharacterView} from './decisionMath';
import {createDecisionRuntime} from './decisionRuntime';

declare const brand:unique symbol;
export interface DecisionModel {readonly [brand]:true;}
const models=new WeakMap<object,DecisionCompiled>();
export async function prepareDecisionModel(source:DecisionSource):Promise<DecisionModel>{
 const model=await compileDecisionModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('DECISION_NOT_FROZEN');
 const handle=Object.freeze({}) as DecisionModel;models.set(handle,model);return handle;
}
export async function createDecisionRun(handle:DecisionModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('DECISION_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileDecisionInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createDecisionRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},characterView:()=>enc(decisionCharacterView(runtime.snapshot().outputs)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreDecisionRun(source:DecisionSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('DECISION_SAVE_SEED');
  const run=await createDecisionRun(await prepareDecisionModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('DECISION_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('DECISION_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('DECISION_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('DECISION_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
