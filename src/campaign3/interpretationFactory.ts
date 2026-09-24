/** Data-only public entry and complete-prefix restore for the frozen interpretation cohort. */
import freeze from '../../docs/planning/campaign3-interpretation-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeInterpretation as decode} from './interpretationCodecs';
import {compileInterpretationModel,compileInterpretationInputs,copyData,type InterpretationCompiled,type InterpretationSource} from './interpretationModel';
import {HOLDERS} from './interpretationModel';
const interpretationObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('INTERPRETATION_OBSERVER');const out=[];
 for(const v of xs){if(typeof v==='boolean'||v.kind!=='record')throw Error('INTERPRETATION_OUTPUT');const t=v.schema.typeId;if(![1129n,1130n,1119n,1126n].includes(t))continue;
 if(key(t===1130n?f(rec(f(v,2n),1129n),2n):f(v,t===1119n?3n:2n))!==key(HOLDERS[i+1]))continue;
 
 if(t===1126n&&key(f(v,3n))===key(f(v,4n)))continue;out.push(v);
 }return list(out);
};
import {createInterpretationRuntime} from './interpretationRuntime';

declare const brand:unique symbol;
export interface InterpretationModel {readonly [brand]:true;}
const models=new WeakMap<object,InterpretationCompiled>();
export async function prepareInterpretationModel(source:InterpretationSource):Promise<InterpretationModel>{
 const model=await compileInterpretationModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('INTERPRETATION_NOT_FROZEN');
 const handle=Object.freeze({}) as InterpretationModel;models.set(handle,model);return handle;
}
export async function createInterpretationRun(handle:InterpretationModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('INTERPRETATION_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileInterpretationInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createInterpretationRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(interpretationObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreInterpretationRun(source:InterpretationSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('INTERPRETATION_SAVE_SEED');
  const run=await createInterpretationRun(await prepareInterpretationModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('INTERPRETATION_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('INTERPRETATION_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('INTERPRETATION_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('INTERPRETATION_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
