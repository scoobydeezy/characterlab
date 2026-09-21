/** Data-only public entry and complete-prefix restore for the frozen relationship cohort. */
import failedFreeze from '../../docs/planning/campaign3-relationship-model-rev1/FREEZE.json';
import freeze from '../../docs/planning/campaign3-relationship-model-rev2/FREEZE.json';
import {canonicalEncode as enc,canonicalDecode,RecordSchemaRegistry,list} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {decodeRelationship as decode,relationshipSupportedSchemas} from './relationshipCodecs';
import {compileRelationshipModel,compileRelationshipInputs,copyData,type RelationshipCompiled,type RelationshipSource} from './relationshipModel';
import {createRelationshipRuntime} from './relationshipRuntime';
declare const brand:unique symbol;
export interface RelationshipModel {readonly [brand]:true;}
const models=new WeakMap<object,RelationshipCompiled>();
export async function prepareRelationshipModel(source:RelationshipSource):Promise<RelationshipModel>{
 const model=await compileRelationshipModel(source);if(![...freeze.models,...failedFreeze.models].some(m=>m.modelIdentity===key(model.modelIdentity.value)))throw Error('RELATIONSHIP_NOT_FROZEN');
 const handle=Object.freeze({}) as RelationshipModel;models.set(handle,model);return handle;
}
export async function createRelationshipRun(handle:RelationshipModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 return (await constructRun(handle,input)).run;
}
async function constructRun(handle:RelationshipModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=models.get(handle);if(!model)throw Error('RELATIONSHIP_MODEL_HANDLE');
 const data=copyData(input,['initialState','orderedInputs','runSeed']),original=await compileRelationshipInputs(model,data.initialState,data.orderedInputs,data.runSeed),runtime=createRelationshipRuntime(model,original);
 const run=Object.freeze({settleNextInstant:async()=>(await runtime.settle())!==undefined,snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.trace))};},observerView(observer:Uint8Array){const data=copyData({observer},['observer']);return runtime.view(decode(data.observer));},save:()=>runtime.save(),runIdentity:()=>original.runIdentity.canonicalBytes.slice(),diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(original.runIdentity.value,d)):undefined;}});
 return {run,runtime};
}
export async function restoreRelationshipRun(source:RelationshipSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{
  // Structural parse only here. Every semantic byte is authenticated by equality
  // with a newly executed, fully validated save before a handle is returned. This
  // avoids repeatedly validating nested historical traces just to count a prefix.
  const data=copyData(input,['initialState','orderedInputs','save']),saved=rec(canonicalDecode(data.save,new RecordSchemaRegistry(relationshipSupportedSchemas())),132n),identity=rec(f(saved,3n),104n),seed=f(identity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw Error('RELATIONSHIP_SAVE_SEED');
  const {run,runtime}=await constructRun(await prepareRelationshipModel(source),{initialState:data.initialState,orderedInputs:data.orderedInputs,runSeed:seed.value});
  if(key(decode(run.runIdentity()))!==key(identity))throw Error('RELATIONSHIP_SAVE_IDENTITY');
  const count=items(f(saved,11n),'list').length;let actual=0;
  if(count>204)throw Error('RELATIONSHIP_SAVE_TRACE_LIMIT');
  while(actual<count){if(!await run.settleNextInstant())throw Error('RELATIONSHIP_SAVE_PREFIX');actual=runtime.snapshot().trace.length;if(actual>count)throw Error('RELATIONSHIP_SAVE_PARTIAL_INSTANT');}
  const replayed=run.save();if(replayed.length!==data.save.length||replayed.some((b,i)=>b!==data.save[i]))throw Error('RELATIONSHIP_SAVE_WHOLE_EQUALITY');return run;
 }catch(e){throw new SaveContractError(e instanceof Error?e.message:String(e));}
}






