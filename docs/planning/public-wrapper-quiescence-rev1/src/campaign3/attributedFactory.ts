/** Data-only public entry and complete-prefix restore for the frozen attributed cohort. */
import freeze from '../../docs/planning/campaign3-attributed-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeAttributed as decode} from './attributedCodecs';
import {compileAttributedModel,compileAttributedInputs,copyData,type AttributedCompiled,type AttributedSource} from './attributedModel';
import {HOLDERS} from './attributedModel';
const attributedObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(![0,1,2].includes(i))throw Error('ATTRIBUTED_OBSERVER');const out=[];
 for(const v of xs){if(typeof v==='boolean'||v.kind!=='record')throw Error('ATTRIBUTED_OUTPUT');const t=v.schema.typeId;
 if(i===0&&[1137n,1138n,1139n].includes(t)){out.push(v);continue;}
 if(![1133n,1136n,1143n].includes(t)||key(f(v,t===1136n?3n:2n))!==key(HOLDERS[i]))continue;
 if(t===1133n&&!items(f(v,4n),'list').length&&!items(f(v,5n),'list').length)continue;
 if(t===1143n&&key(f(v,3n))===key(f(v,4n)))continue;out.push(v);
 }return list(out);
};
import {createAttributedRuntime} from './attributedRuntime';

declare const brand:unique symbol;
export interface AttributedModel {readonly [brand]:true;}
const models=new WeakMap<object,AttributedCompiled>();
export async function prepareAttributedModel(source:AttributedSource):Promise<AttributedModel>{
 const model=await compileAttributedModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('ATTRIBUTED_NOT_FROZEN');
 const handle=Object.freeze({}) as AttributedModel;models.set(handle,model);return handle;
}
export async function createAttributedRun(handle:AttributedModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('ATTRIBUTED_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileAttributedInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createAttributedRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(attributedObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreAttributedRun(source:AttributedSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('ATTRIBUTED_SAVE_SEED');
  const run=await createAttributedRun(await prepareAttributedModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('ATTRIBUTED_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('ATTRIBUTED_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('ATTRIBUTED_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('ATTRIBUTED_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
