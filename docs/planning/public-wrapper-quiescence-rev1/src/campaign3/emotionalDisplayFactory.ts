/** Data-only public entry and complete-prefix restore for the frozen emotionalDisplay cohort. */
import freeze from '../../docs/planning/campaign3-emotional-display-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeEmotionalDisplay as decode} from './emotionalDisplayCodecs';
import {compileEmotionalDisplayModel,compileEmotionalDisplayInputs,copyData,type EmotionalDisplayCompiled,type EmotionalDisplaySource} from './emotionalDisplayModel';
import {HOLDERS} from './emotionalDisplayModel';
const emotionalDisplayObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('EMOTIONAL_DISPLAY_OBSERVER');const out=[];
 for(const v of xs){if(typeof v==='boolean'||v.kind!=='record')throw Error('EMOTIONAL_DISPLAY_OUTPUT');const t=v.schema.typeId;if(![1100n,1103n,1110n].includes(t))continue;
 if(key(f(v,t===1103n?3n:2n))!==key(HOLDERS[i+1]))continue;
 if(t===1100n&&!items(f(v,4n),'list').length&&!items(f(v,8n),'list').length)continue;
 if(t===1110n&&key(f(v,3n))===key(f(v,4n)))continue;out.push(v);
 }return list(out);
};
import {createEmotionalDisplayRuntime} from './emotionalDisplayRuntime';

declare const brand:unique symbol;
export interface EmotionalDisplayModel {readonly [brand]:true;}
const models=new WeakMap<object,EmotionalDisplayCompiled>();
export async function prepareEmotionalDisplayModel(source:EmotionalDisplaySource):Promise<EmotionalDisplayModel>{
 const model=await compileEmotionalDisplayModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('EMOTIONAL_DISPLAY_NOT_FROZEN');
 const handle=Object.freeze({}) as EmotionalDisplayModel;models.set(handle,model);return handle;
}
export async function createEmotionalDisplayRun(handle:EmotionalDisplayModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('EMOTIONAL_DISPLAY_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileEmotionalDisplayInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createEmotionalDisplayRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(emotionalDisplayObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreEmotionalDisplayRun(source:EmotionalDisplaySource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('EMOTIONAL_DISPLAY_SAVE_SEED');
  const run=await createEmotionalDisplayRun(await prepareEmotionalDisplayModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('EMOTIONAL_DISPLAY_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('EMOTIONAL_DISPLAY_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('EMOTIONAL_DISPLAY_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('EMOTIONAL_DISPLAY_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
