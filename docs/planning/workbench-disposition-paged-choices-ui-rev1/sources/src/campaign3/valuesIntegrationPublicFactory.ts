import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {failureDiagnosticValue} from '../substrate/trace';
import {SaveContractError} from '../substrate/persistence';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileIntegrationModel,compileIntegrationInputs,copyData,unpack,type IntegrationCompiled,type IntegrationSource} from './valuesIntegrationPublicModel';
import {createIntegrationPublicRuntime} from './valuesIntegrationPublicRuntime';
import {parseValuesIntegrationSave,decodeValuesIntegrationPublic as decode} from './valuesIntegrationPublicCodecs';

import {data} from './biologyPublicData';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
declare const brand:unique symbol;
export interface IntegrationModel{readonly [brand]:true;}
const models=new WeakMap<object,IntegrationCompiled>();
export async function prepareIntegrationModel(source:IntegrationSource):Promise<IntegrationModel>{const model=await compileIntegrationModel(source),handle=Object.freeze({}) as IntegrationModel;models.set(handle,model);return handle;}
export async function createIntegrationPublicRun(handle:IntegrationModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('VALUES_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileIntegrationInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createIntegrationPublicRuntime(model,compiled);
 const published=guardPublicWrapperSettlement({settle:()=>runtime.settle(),settleForConformance:runtime.settleForConformance,snapshot:runtime.snapshot,save:runtime.save});
 return Object.freeze({settleNextInstant:async()=>(await published.settle())!==undefined,snapshot(){const s=published.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace)),randomAddresses:s.randomAddresses.slice()};},rows:()=>integrationRows(published.snapshot().outputs),characterProjection:()=>enc(list(integrationRows(published.snapshot().outputs).map(x=>data(x)))),save:()=>published.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreIntegrationPublicRun(source:IntegrationSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=parseValuesIntegrationSave(original.save),identity=rec(f(saved,3n),104n),seed=f(identity,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('VALUES_SAVE_SEED');const run=await createIntegrationPublicRun(await prepareIntegrationModel(source),{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity))throw Error('VALUES_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>832||count%13)throw Error('VALUES_SAVE_PARTIAL');for(let i=0;i<count/13;i++)if(!await run.settleNextInstant())throw Error('VALUES_SAVE_PREFIX');const actual=run.save();if(actual.length!==original.save.length||!actual.every((b,i)=>b===original.save[i]))throw Error('VALUES_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}

import type {CanonicalValue} from '../substrate/canonicalEncoding';
import type {createValuesIntegration} from './valuesIntegration';
type Row=ReturnType<ReturnType<typeof createValuesIntegration>['observerView']>['rows'][number];
export function integrationRows(outputs:readonly CanonicalValue[]):Row[]{return outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1529n).map(v=>unpack<Row>(v,1529));}
