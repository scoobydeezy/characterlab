import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {failureDiagnosticValue} from '../substrate/trace';
import {SaveContractError} from '../substrate/persistence';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileValuesModel,compileValuesInputs,copyData,type ValuesCompiled,type ValuesSource} from './valuesPublicModel';
import {createValuesPublicRuntime} from './valuesPublicRuntime';
import {parseValuesSave,decodeValuesPublic as decode} from './valuesPublicCodecs';
import {valuesPublicRows} from './valuesPublicMath';
import {data} from './biologyPublicData';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
declare const brand:unique symbol;
export interface ValuesModel{readonly [brand]:true;}
const models=new WeakMap<object,ValuesCompiled>();
export async function prepareValuesModel(source:ValuesSource):Promise<ValuesModel>{const model=await compileValuesModel(source),handle=Object.freeze({}) as ValuesModel;models.set(handle,model);return handle;}
export async function createValuesPublicRun(handle:ValuesModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('VALUES_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileValuesInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createValuesPublicRuntime(model,compiled);
 const published=guardPublicWrapperSettlement({settle:()=>runtime.settle(),settleForConformance:runtime.settleForConformance,snapshot:runtime.snapshot,save:runtime.save});
 return Object.freeze({settleNextInstant:async()=>(await published.settle())!==undefined,snapshot(){const s=published.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace)),randomAddresses:s.randomAddresses.slice()};},rows:()=>valuesPublicRows(published.snapshot().outputs),characterProjection:()=>enc(list(valuesPublicRows(published.snapshot().outputs).map(x=>data({instant:x.probe.instant,view:x.view,status:x.status,chosen:x.chosen,probabilities:x.probabilities})))),save:()=>published.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreValuesPublicRun(source:ValuesSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=parseValuesSave(original.save),identity=rec(f(saved,3n),104n),seed=f(identity,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('VALUES_SAVE_SEED');const run=await createValuesPublicRun(await prepareValuesModel(source),{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity))throw Error('VALUES_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>260||count%4)throw Error('VALUES_SAVE_PARTIAL');for(let i=0;i<count/4;i++)if(!await run.settleNextInstant())throw Error('VALUES_SAVE_PREFIX');const actual=run.save();if(actual.length!==original.save.length||!actual.every((b,i)=>b===original.save[i]))throw Error('VALUES_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
