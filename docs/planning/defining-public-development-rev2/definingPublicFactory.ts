/** Opaque public model/run handles. Restore never installs caller state. */
import {canonicalEncode as enc,list,text} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {compileDefiningPublicModel,createDefiningPublicExecution,copyData,parseDefiningPublic,equalBytes,type DefiningPublicCompiled,type DefiningPublicSource} from './definingPublicModel';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
declare const brand:unique symbol;
export interface DefiningPublicModel {readonly [brand]:true}
const models=new WeakMap<DefiningPublicModel,DefiningPublicCompiled>();
const get=(handle:DefiningPublicModel)=>{const m=models.get(handle);if(!m)throw Error('DEFINING_PUBLIC_MODEL_HANDLE');return m;};
export async function prepareDefiningPublicModel(source:DefiningPublicSource){const model=await compileDefiningPublicModel(source),handle=Object.freeze({}) as DefiningPublicModel;models.set(handle,model);return handle;}
export function definingPublicOriginals(handle:DefiningPublicModel){const m=get(handle);return {initialState:m.initialState.slice(),orderedInputs:m.originals.slice(),runSeed:new Uint8Array(32)};}
export async function createDefiningPublicRun(handle:DefiningPublicModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const m=get(handle),{runtime,runIdentity}=await createDefiningPublicExecution(m,input);
 // Guard the factory's boolean projection too, not only the inner scheduler promise.
 const published=guardPublicWrapperSettlement({settle:async()=>(await runtime.settle())!==undefined,settleForConformance:async()=>{throw Error('DEFINING_PUBLIC_NO_CONFORMANCE_ENTRY');},snapshot:()=>runtime.snapshot(),save:()=>runtime.save()});
 return Object.freeze({
  settleNextInstant:published.settle,
  snapshot(){const s=published.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.committedTrace))};},
  observerView(){const outputs=published.snapshot().outputs;return enc(list([text('defining-observer/0.1'),list(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===590n)),list(outputs.flatMap(v=>typeof v!=='boolean'&&v.kind==='record'&&[1489n,1490n].includes(v.schema.typeId)?[list([text(v.schema.typeId===1489n?'historical':'current'),f(v,3n),f(v,7n)])]:[]))]));},
  save:published.save,modelIdentity:()=>m.modelIdentity.canonicalBytes.slice(),runIdentity:()=>runIdentity.canonicalBytes.slice(),
  diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(runIdentity.value,d)):undefined;},
 });
}
export async function restoreDefiningPublicRun(source:DefiningPublicSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  const original=copyData(input,['initialState','orderedInputs','save']),saved=rec(parseDefiningPublic(original.save),132n),clock=f(saved,4n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof clock==='boolean'||clock.kind!=='signed'||clock.value<0n||clock.value>4000n||typeof seed==='boolean'||seed.kind!=='bytes')throw Error('DEFINING_PUBLIC_SAVE_HEADER');
  const handle=await prepareDefiningPublicModel(source),run=await createDefiningPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});
  if(!equalBytes(enc(f(saved,2n)),run.modelIdentity())||!equalBytes(enc(identity),run.runIdentity()))throw Error('DEFINING_PUBLIC_SAVE_IDENTITY');
  let count=0;while(run.snapshot().clock<clock.value){if(++count>27||!await run.settleNextInstant())throw Error('DEFINING_PUBLIC_SAVE_PREFIX');}
  if(!equalBytes(run.save(),original.save))throw Error('DEFINING_PUBLIC_SAVE_WHOLE_EQUALITY');
  return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
