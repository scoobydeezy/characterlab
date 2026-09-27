/** Data-only public entry and complete-prefix restore for the frozen personGoal cohort. */
import freeze from '../../docs/planning/campaign3-person-goal-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodePersonGoal as decode} from './personGoalCodecs';
import {compilePersonGoalModel,compilePersonGoalInputs,copyData,type PersonGoalCompiled,type PersonGoalSource} from './personGoalModel';
import {HOLDERS} from './personGoalModel';
const personGoalObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('PERSON_GOAL_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('PERSON_GOAL_OUTPUT');const t=v.schema.typeId;
 if(![1183n,1186n,1187n,1188n].includes(t))return false;
 const holder=t===1187n?f(rec(f(v,2n),1186n),3n):f(v,t===1186n?3n:2n);
 if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1183n&&![6n,7n].some(k=>items(f(v,k),'list').length))return false;
 if(t===1188n&&key(f(v,3n))===key(f(v,4n)))return false;return true;
 }));
};
import {createPersonGoalRuntime} from './personGoalRuntime';

declare const brand:unique symbol;
export interface PersonGoalModel {readonly [brand]:true;}
const models=new WeakMap<object,PersonGoalCompiled>();
export async function preparePersonGoalModel(source:PersonGoalSource):Promise<PersonGoalModel>{
 const model=await compilePersonGoalModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('PERSON_GOAL_NOT_FROZEN');
 const handle=Object.freeze({}) as PersonGoalModel;models.set(handle,model);return handle;
}
export async function createPersonGoalRun(handle:PersonGoalModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('PERSON_GOAL_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compilePersonGoalInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createPersonGoalRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(personGoalObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restorePersonGoalRun(source:PersonGoalSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('PERSON_GOAL_SAVE_SEED');
  const run=await createPersonGoalRun(await preparePersonGoalModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('PERSON_GOAL_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('PERSON_GOAL_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('PERSON_GOAL_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('PERSON_GOAL_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
