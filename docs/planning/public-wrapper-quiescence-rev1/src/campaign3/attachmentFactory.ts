/** Data-only public entry and complete-prefix restore for the frozen attachment cohort. */
import freeze from '../../docs/planning/campaign3-attachment-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeAttachment as decode} from './attachmentCodecs';
import {compileAttachmentModel,compileAttachmentInputs,copyData,type AttachmentCompiled,type AttachmentSource} from './attachmentModel';
import {HOLDERS} from './attachmentModel';
const attachmentObserverView=(xs:readonly import('../substrate/canonicalEncoding').CanonicalValue[],i:number)=>{
 if(i!==0&&i!==1)throw Error('ATTACHMENT_OBSERVER');return list(xs.filter(v=>{
 if(typeof v==='boolean'||v.kind!=='record')throw Error('ATTACHMENT_OUTPUT');const t=v.schema.typeId;if(![1252n,1253n,1259n,1260n,1261n].includes(t))return false;
 const holder=t===1260n?f(rec(f(v,2n),1259n),3n):f(v,t===1259n?3n:2n);if(key(holder)!==key(HOLDERS[i]))return false;
 if(t===1252n&&![6n,7n,8n].some(k=>items(f(v,k),'list').length))return false;if(t===1261n&&key(f(v,5n))===key(f(v,6n)))return false;return true;
 }));
};
import {createAttachmentRuntime} from './attachmentRuntime';

declare const brand:unique symbol;
export interface AttachmentModel {readonly [brand]:true;}
const models=new WeakMap<object,AttachmentCompiled>();
export async function prepareAttachmentModel(source:AttachmentSource):Promise<AttachmentModel>{
 const model=await compileAttachmentModel(source);if(!freeze.models.some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('ATTACHMENT_NOT_FROZEN');
 const handle=Object.freeze({}) as AttachmentModel;models.set(handle,model);return handle;
}
export async function createAttachmentRun(handle:AttachmentModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('ATTACHMENT_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileAttachmentInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createAttachmentRuntime(model,original);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView:(i:number)=>enc(attachmentObserverView(runtime.snapshot().outputs,i)),save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
}
export async function restoreAttachmentRun(source:AttachmentSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(decode(data.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('ATTACHMENT_SAVE_SEED');
  const run=await createAttachmentRun(await prepareAttachmentModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('ATTACHMENT_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  while(actual<count){if(!await run.settleNextInstant())throw Error('ATTACHMENT_SAVE_PREFIX');actual=items(decode(run.snapshot().trace),'list').length;if(actual>count)throw Error('ATTACHMENT_SAVE_PARTIAL_INSTANT');}
  if(key(decode(run.save()))!==key(saved))throw Error('ATTACHMENT_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
