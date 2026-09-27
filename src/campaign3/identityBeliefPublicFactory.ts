/** Native factory and complete-instant restore. No callbacks or writable handles. */
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeIdentityBeliefPublic as decode,parseIdentityBeliefSave} from './identityBeliefPublicCodecs';
import {HOLDERS,type Holder} from './identityBelief';
import {dataUnsigned as uint} from '../campaign2/canonicalData';
import {compileBeliefModel,compileBeliefInputs,copyData,type BeliefCompiled,type BeliefSource} from './identityBeliefPublicModel';
import {createIdentityBeliefRuntime} from './identityBeliefRuntime';
declare const brand:unique symbol;
export interface IdentityBeliefModel {readonly [brand]:true;}
const models=new WeakMap<object,BeliefCompiled>();
export async function prepareIdentityBeliefModel(source:BeliefSource):Promise<IdentityBeliefModel>{const compiled=await compileBeliefModel(source),handle=Object.freeze({}) as IdentityBeliefModel;models.set(handle,compiled);return handle;}
export async function createIdentityBeliefPublicRun(handle:IdentityBeliefModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('IDENTITY_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileBeliefInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createIdentityBeliefRuntime(model,compiled);
 return Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView(holder:Holder){const h=HOLDERS.indexOf(holder)+1;if(h===0)throw Error('IDENTITY_BELIEF_HOLDER');return enc(list(runtime.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[1448n,1449n,1450n].includes(v.schema.typeId)&&uint(f(v,1n))===BigInt(h))));},save:()=>runtime.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreIdentityBeliefPublicRun(source:BeliefSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=rec(parseIdentityBeliefSave(original.save),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('IDENTITY_SAVE_SEED');const handle=await prepareIdentityBeliefModel(source),stages=models.get(handle)!.stages,run=await createIdentityBeliefPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity))throw Error('IDENTITY_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>5*stages.length)throw Error('IDENTITY_SAVE_PREFIX_BOUND');if(count%stages.length)throw Error('IDENTITY_SAVE_PARTIAL_INSTANT');for(let i=0;i<count/stages.length;i++)if(!await run.settleNextInstant())throw Error('IDENTITY_SAVE_PREFIX');const actualSave=run.save();if(actualSave.length!==original.save.length||!actualSave.every((b,i)=>b===original.save[i]))throw Error('IDENTITY_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
