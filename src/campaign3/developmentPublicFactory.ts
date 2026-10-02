/** development-public/0.1-candidate: opaque handles and original-input replay. */
import {canonicalEncode as enc,list,unsigned as u} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeDevelopmentPublic as decode,parseDevelopmentSave,developmentPublicRecord as r} from './developmentPublicCodecs';
import {compileDevelopmentModel,compileDevelopmentInputs,copyData,stages,type DevelopmentCompiled,type DevelopmentSource} from './developmentPublicModel';
import {createDevelopmentPublicRuntime} from './developmentPublicRuntime';
import {developmentPublicRows} from './developmentPublicProjection';
import {guardPublicWrapperSettlement} from './publicWrapperQuiescence';
import {data} from './biologyPublicData';
declare const brand:unique symbol;
export interface DevelopmentModel {readonly [brand]:true;}
const models=new WeakMap<object,DevelopmentCompiled>();
export async function prepareDevelopmentModel(source:DevelopmentSource):Promise<DevelopmentModel>{const compiled=await compileDevelopmentModel(source),handle=Object.freeze({}) as DevelopmentModel;models.set(handle,compiled);return handle;}
export async function createDevelopmentPublicRun(handle:DevelopmentModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('DEVELOPMENT_MODEL_HANDLE');const original=copyData(input,['initialState','orderedInputs','runSeed']),compiled=await compileDevelopmentInputs(model,original.initialState,original.orderedInputs,original.runSeed),runtime=createDevelopmentPublicRuntime(model,compiled);
 const published=guardPublicWrapperSettlement({settle:()=>runtime.settle(),settleForConformance:runtime.settleForConformance,snapshot:runtime.snapshot,save:runtime.save});
 return Object.freeze({settleNextInstant:async()=>(await published.settle())!==undefined,snapshot(){const s=published.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace)),randomAddresses:s.randomAddresses.slice()};},rows:()=>developmentPublicRows(published.snapshot().outputs),characterProjection(){return enc(list(developmentPublicRows(published.snapshot().outputs).map(row=>{const {executed,forcedExecuted,...safe}=row;return r(1508,[u(row.at),data(safe)]); })));},save:()=>published.save(),runIdentity:()=>compiled.runIdentity.canonicalBytes.slice(),modelIdentity:()=>model.modelIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(compiled.runIdentity.value,d)):undefined;}});
}
export async function restoreDevelopmentPublicRun(source:DevelopmentSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const original=copyData(input,['initialState','orderedInputs','save']),saved=parseDevelopmentSave(original.save),identity=rec(f(saved,3n),104n),seed=f(identity,4n);if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('DEVELOPMENT_SAVE_SEED');const handle=await prepareDevelopmentModel(source),run=await createDevelopmentPublicRun(handle,{initialState:original.initialState,orderedInputs:original.orderedInputs,runSeed:seed.value});if(key(decode(run.runIdentity()))!==key(identity))throw Error('DEVELOPMENT_SAVE_IDENTITY');const count=items(f(saved,11n),'list').length;if(count>24*stages.length||count%stages.length)throw Error('DEVELOPMENT_SAVE_PARTIAL_INSTANT');for(let i=0;i<count/stages.length;i++)if(!await run.settleNextInstant())throw Error('DEVELOPMENT_SAVE_PREFIX');const actual=run.save();if(actual.length!==original.save.length||!actual.every((b,i)=>b===original.save[i]))throw Error('DEVELOPMENT_SAVE_WHOLE_EQUALITY');return run;}catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}
