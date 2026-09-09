/** Frozen measurement-memory run creation. Restore is separately prefix-validated. */
import {canonicalEncode,list} from '../substrate/canonicalEncoding';
import {restoreRunIdentity,identitySchemas} from '../substrate/identity';
import {AuthoritativeState} from '../substrate/state';
import {prepareCanonicalSave,persistenceSchemas,scheduledEventValue,SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {compileOrderedInputProfile,AUTHORED_FACT_EVENT,PROBE_SOURCE_EVENT} from './orderedInputs';
import {compileAdaptationEvaluator} from './adaptationEvaluation';
import {createAdaptationRuntime} from './adaptationRuntime';
import {compileMemoryModel} from './memoryModel';
import {decodeMemory,memorySupportedSchemas} from './memoryCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,invalidModel} from './canonicalData';
import type {Campaign2ModelSource} from './factory';
declare const memoryModelBrand:unique symbol;
export interface MemoryModel {readonly [memoryModelBrand]:true;}
const models=new WeakMap<object,Awaited<ReturnType<typeof compileMemoryModel>>>();
function memoryModelFacts(handle:MemoryModel){const m=models.get(handle);if(!m)invalidModel('prepared memory model required');return m;}
export async function prepareMemoryModel(source:Campaign2ModelSource):Promise<MemoryModel>{const m=await compileMemoryModel(source),handle=Object.freeze({}) as MemoryModel;models.set(handle,m);return handle;}
export function memoryModelIdentity(handle:MemoryModel):Uint8Array{return memoryModelFacts(handle).modelIdentity.canonicalBytes.slice();}
type Runtime=ReturnType<typeof createAdaptationRuntime>;
type Inputs=Awaited<ReturnType<ReturnType<typeof compileOrderedInputProfile>['create']>>;
const privateRuns=new WeakMap<object,Runtime>();
function expose(runtime:Runtime,model:ReturnType<typeof memoryModelFacts>,inputs:Inputs){
 const result=Object.freeze({async settleNextInstant(){return (await runtime.settleNextInstant())!==undefined;},snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:canonicalEncode(s.state.canonicalValue()),outputs:canonicalEncode(list(s.outputs)),trace:canonicalEncode(list(s.committedTrace))});},save:()=>runtime.save(model.modelIdentity,inputs.runIdentity),runIdentity:()=>inputs.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?canonicalEncode(failureDiagnosticValue(inputs.runIdentity.value,d)):undefined;}});
 privateRuns.set(result,runtime);return result;
}
function runData(input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)invalidModel('plain run data required');
 const fields=['initialState','orderedInputs','runSeed'] as const,ds=Object.getOwnPropertyDescriptors(input);
 if(Reflect.ownKeys(ds).length!==3||fields.some(k=>!ds[k]||!('value'in ds[k])))invalidModel('exact run fields required');
 const copy=(k:typeof fields[number])=>{const v=ds[k].value;if(!(v instanceof Uint8Array)||Object.getPrototypeOf(v)!==Uint8Array.prototype||Reflect.ownKeys(v).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))invalidModel('plain run bytes required');const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(v);const out=new Uint8Array(length);Uint8Array.prototype.set.call(out,v);return out;};
 return {initialState:copy('initialState'),orderedInputs:copy('orderedInputs'),runSeed:copy('runSeed')};
}
export async function createMemoryRun(handle:MemoryModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=memoryModelFacts(handle),data=runData(input),state=model.stateModel.restoreState(data.initialState);
 if(state.entries().some(e=>e.path.rootStateTypeId===346n))invalidModel('initial episodes must be empty');
 const base=model.base;base.domains.validateStatic(state);base.domains.validateReferences(state,0n);
 const inputs=await compileOrderedInputProfile(model.profiles.orderedInput,model.content,base.domains).create(data.orderedInputs,data.initialState,model.modelIdentity,data.runSeed);
 const evaluator=compileAdaptationEvaluator(base.adaptation,base.domains,model.stateModel);
 const runtime=createAdaptationRuntime(inputs,state,base.admission,evaluator,base.domains,model.stateModel,base.parameters.maxWork,base.bridge,undefined,base.probe,base.measurement,model);
 return expose(runtime,model,inputs);
}
export async function restoreMemoryRun(source:Campaign2ModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 if(!input||Object.getPrototypeOf(input)!==Object.prototype)invalidModel('plain restore input required');
 const ds=Object.getOwnPropertyDescriptors(input),names=['initialState','orderedInputs','save'];
 if(Reflect.ownKeys(ds).length!==3||names.some(k=>!ds[k]||!('value'in ds[k])))invalidModel('exact restore fields required');
 const copies=runData({initialState:ds.initialState.value!,orderedInputs:ds.orderedInputs.value!,runSeed:ds.save.value!});
 const savedBytes=copies.runSeed,save=rec(decodeMemory(savedBytes),132n),runIdentity=await restoreRunIdentity(f(save,3n));
 const seed=f(rec(runIdentity.value,104n),4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
 const handle=await prepareMemoryModel(source),model=memoryModelFacts(handle),base=model.base;
 const replay=await createMemoryRun(handle,{initialState:copies.initialState,orderedInputs:copies.orderedInputs,runSeed:seed.value});
 if(key(decodeMemory(replay.runIdentity()))!==key(runIdentity.value))throw new SaveContractError('original S0/input/model commitments differ');
 const records=items(f(save,11n),'list');for(const value of records)rec(value,160n);const N=records.length;
 let count=0;while(count<N){try{if(!await replay.settleNextInstant())throw new SaveContractError('prefix exhausted');}catch(error){throw new SaveContractError('prefix execution failed: '+(error instanceof Error?error.message:String(error)));}
  count=items(decodeMemory(replay.snapshot().trace),'list').length;if(count>N)throw new SaveContractError('prefix crosses whole-instant boundary');
 }
 if(key(decodeMemory(replay.save()))!==key(save))throw new SaveContractError('whole-save prefix equality failed');
 const facts=privateRuns.get(replay)!.memoryPendingFacts(); // Detached facts only, after exact equality.
 const adapter={clone:(s:AuthoritativeState)=>new AuthoritativeState(s.entries()),canonicalValue:(s:AuthoritativeState)=>s.canonicalValue(),restore:(v:Parameters<typeof canonicalEncode>[0])=>model.stateModel.restoreState(canonicalEncode(v)),validate:(s:AuthoritativeState)=>model.stateModel.validateState(s),analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
 const originalKeys=new Set([key(AUTHORED_FACT_EVENT),key(PROBE_SOURCE_EVENT)]),eventKeys=new Set([...originalKeys,...facts.map(x=>key(x.event.eventTypeId))]);
 const prepared=await prepareCanonicalSave(savedBytes,{stateAdapter:adapter,eventTypeKeys:eventKeys,maxSettlementWorkPerSimulationInstant:base.parameters.maxWork,expectedModelIdentity:model.modelIdentity,expectedRunIdentity:runIdentity,additionalSchemas:memorySupportedSchemas().filter(s=>![...Object.values(identitySchemas),...Object.values(persistenceSchemas)].some(b=>b.typeId===s.typeId))});
 const generated=prepared.queue.filter(e=>!originalKeys.has(key(e.eventTypeId)));
 if(generated.length!==facts.length||generated.some(e=>!facts.some(x=>key(scheduledEventValue(x.event))===key(scheduledEventValue(e)))))throw new SaveContractError('pending association bijection failed');
 const profile=compileOrderedInputProfile(model.profiles.orderedInput,model.content,base.domains);
 await profile.validatePending(copies.orderedInputs,runIdentity.canonicalBytes,prepared.clock,prepared.queue.filter(e=>originalKeys.has(key(e.eventTypeId))));
 const inputs=await profile.restoreAuthority(copies.orderedInputs,runIdentity.canonicalBytes);
 const evaluator=compileAdaptationEvaluator(base.adaptation,base.domains,model.stateModel);
 const runtime=createAdaptationRuntime(inputs,prepared.state,base.admission,evaluator,base.domains,model.stateModel,base.parameters.maxWork,base.bridge,prepared,base.probe,base.measurement,model,facts);
 return expose(runtime,model,inputs);
}
