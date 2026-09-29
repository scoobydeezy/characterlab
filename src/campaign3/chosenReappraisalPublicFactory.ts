/** Native factory and complete-instant restore. No callbacks or writable handles. */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeChosenReappraisalPublic as decode} from './chosenReappraisalPublicCodecs';
import {compileChosenReappraisalPublicModel,compileChosenReappraisalPublicInputs,copyData,type ChosenReappraisalPublicCompiled,type ChosenReappraisalPublicSource} from './chosenReappraisalPublicModel';
import {createChosenReappraisalPublicRuntime} from './chosenReappraisalPublicRuntime';
import {parseChosenReappraisalSave} from './chosenReappraisalPublicCodecs';
declare const brand:unique symbol;
export interface ChosenReappraisalPublicModel {readonly [brand]:true;}
const models=new WeakMap<object,ChosenReappraisalPublicCompiled>();
export async function prepareChosenReappraisalPublicModel(source:ChosenReappraisalPublicSource):Promise<ChosenReappraisalPublicModel>{const compiled=await compileChosenReappraisalPublicModel(source),handle=Object.freeze({}) as ChosenReappraisalPublicModel;models.set(handle,compiled);return handle;}
export async function createChosenReappraisalPublicRun(handle:ChosenReappraisalPublicModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('CHOSEN_REAPPRAISAL_PUBLIC_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileChosenReappraisalPublicInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createChosenReappraisalPublicRuntime(model,compiled);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView(){return enc(list(runtime.snapshot().outputs));},save:()=>runtime.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreChosenReappraisalPublicRun(source:ChosenReappraisalPublicSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=parseChosenReappraisalSave(original.save),disposition=rec(f(saved,3n),104n),seed=f(disposition,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('CHOSEN_REAPPRAISAL_PUBLIC_SAVE_SEED');const handle=await prepareChosenReappraisalPublicModel(source),stageCount=12,run=await createChosenReappraisalPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(disposition))throw Error('CHOSEN_REAPPRAISAL_PUBLIC_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>96||count%stageCount)throw Error('CHOSEN_REAPPRAISAL_PUBLIC_SAVE_PARTIAL_INSTANT');for(let i=0;i<count/stageCount;i++)if(!await run.settleNextInstant())throw Error('CHOSEN_REAPPRAISAL_PUBLIC_SAVE_PREFIX');const actualSave=run.save();if(actualSave.length!==original.save.length||!actualSave.every((b,i)=>b===original.save[i]))throw Error('CHOSEN_REAPPRAISAL_PUBLIC_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
