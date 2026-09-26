import {compileMeasurementModel} from './measurementModel';
import {MEASUREMENT_RULES,decodeMeasurement,measurementSupportedSchemas} from './measurementModelSource';
import {validateMeasurementArchive} from './measurementArchive';
/** Restricted FCT-5 implementation under the frozen bounded bundle and campaign2-persistence/0.1-candidate.
 * Qualification is separate; no caller-supplied runtime semantics enter this boundary.
 */
import {canonicalEncode,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreRunIdentity,identitySchemas} from '../substrate/identity';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCanonicalSave,SaveContractError,persistenceSchemas,type PersistentStateAdapter} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {compileBoundedModelDeclarations} from './modelPackaging';
import {campaign2SupportedSchemas,decodeCampaign2} from './codecs';
import {compileOrderedInputProfile,AUTHORED_FACT_EVENT,PROBE_SOURCE_EVENT} from './orderedInputs';
import {compileProbeModel} from './probeModel';
import {PROBE_SUCCESSOR_RULES} from './probeSuccessorReview';
import {decodeProbeReview,probeSupportedSchemas,validateProbeArchive} from './probeCodecs';
import {compileAdaptationEvaluator} from './adaptationEvaluation';
import {createAdaptationRuntime} from './adaptationRuntime';
import {dataRecord as rec,dataField as f,dataKey as key,invalidModel} from './canonicalData';

export type Campaign2ModelSource=Parameters<typeof compileBoundedModelDeclarations>[0];
declare const modelBrand:unique symbol;
export interface Campaign2Model {readonly [modelBrand]:true;}
type Model=Awaited<ReturnType<typeof compileMeasurementModel>>|Awaited<ReturnType<typeof compileBoundedModelDeclarations>>|Awaited<ReturnType<typeof compileProbeModel>>;
const models=new WeakMap<object,Model>();
const sourceFields=['rulesVersion','contentSchemaVersion','registrySchemaVersion','parameterSchemaVersion','numericProfileVersion','randomAlgorithmVersion','content','registry','parameters'];
function ownData(value:unknown,fields:readonly string[]):Record<string,unknown>{
  if(value===null||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)invalidModel('requires plain data object');
  const descriptors=Object.getOwnPropertyDescriptors(value);
  if(Reflect.ownKeys(descriptors).length!==fields.length||fields.some(k=>!Object.hasOwn(descriptors,k)))invalidModel('unknown/missing data fields');
  for(const d of Object.values(descriptors))if(!('value' in d))invalidModel('accessors cannot supply model/run data');
  return Object.fromEntries(fields.map(k=>[k,descriptors[k].value]));
}
function copyBytes(value:unknown):Uint8Array{
  if(!(value instanceof Uint8Array)||Object.getPrototypeOf(value)!==Uint8Array.prototype)invalidModel('requires plain Uint8Array bytes');
  if(Reflect.ownKeys(value).some(k=>typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))invalidModel('byte input has non-data properties');
  // Avoid caller-selected constructors/species and iteration hooks when making the snapshot.
  const length=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype),'length')!.get!.call(value);
  const copy=new Uint8Array(length);Uint8Array.prototype.set.call(copy,value);return copy;
}
function modelFacts(handle:Campaign2Model):Model {const m=models.get(handle);if(!m)invalidModel('missing prepared model capability');return m;}

export async function prepareCampaign2Model(input:Campaign2ModelSource):Promise<Campaign2Model>{
  const data=ownData(input,sourceFields);
  for(const field of sourceFields.slice(0,6))if(typeof data[field]!=='string')invalidModel('version must be explicit text');
  for(const field of sourceFields.slice(6))data[field]=copyBytes(data[field]);
  const model=data.rulesVersion===MEASUREMENT_RULES?await compileMeasurementModel(data as Campaign2ModelSource):data.rulesVersion===PROBE_SUCCESSOR_RULES?await compileProbeModel(data as Campaign2ModelSource):await compileBoundedModelDeclarations(data as Campaign2ModelSource);
  // Closure derives from compiled declarations: only five integer maps, no read-only family;
  // fixed source/bridge/EVID/ADAPT dispatch has no anchor, draw or coupling operation.
  if(model.profiles.persistence!==('measurement' in model?'campaign2-measurement-evidence-persistence/0.1-candidate':'probe' in model?'campaign2-probe-persistence/0.1-candidate':'campaign2-persistence/0.1-candidate'))invalidModel('unsupported persistence profile');
  const handle=Object.freeze({}) as Campaign2Model;models.set(handle,model);return handle;
}
export function campaign2ModelIdentity(handle:Campaign2Model):Uint8Array {return modelFacts(handle).modelIdentity.canonicalBytes.slice();}

function persistentState(m:Model):PersistentStateAdapter<AuthoritativeState>{
  return {clone:s=>new AuthoritativeState(s.entries()),canonicalValue:s=>s.canonicalValue(),
    restore:v=>restoreAuthoritativeState(v),validate:s=>{m.compiled.stateModel.validateState(s);m.domains.validateStatic(s);},
    analyticalAnchors:()=>list([]),randomRelevantAuthoritativeIds:()=>list([])};
}
function restrictedRun(runtime:ReturnType<typeof createAdaptationRuntime>,m:Model,inputs:Awaited<ReturnType<ReturnType<typeof compileOrderedInputProfile>['create']>>){
  return Object.freeze({
    async settleNextInstant():Promise<boolean>{return (await runtime.settleNextInstant())!==undefined;},
    snapshot(){const s=runtime.snapshot();return Object.freeze({clock:s.clock,status:s.status,state:canonicalEncode(s.state.canonicalValue()),
      outputs:canonicalEncode(list(s.outputs)),trace:canonicalEncode(list(s.committedTrace))});},
    save():Uint8Array{return runtime.save(m.modelIdentity,inputs.runIdentity);},
    runIdentity():Uint8Array{return inputs.runIdentity.canonicalBytes.slice();},
    diagnostic():Uint8Array|undefined {const d=runtime.diagnostic();return d?canonicalEncode(failureDiagnosticValue(inputs.runIdentity.value,d)):undefined;},
  });
}
export async function createCampaign2Run(handle:Campaign2Model,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
  const m=modelFacts(handle),data=ownData(input,['initialState','orderedInputs','runSeed']);
  const stateBytes=copyBytes(data.initialState),ordered=copyBytes(data.orderedInputs),seed=copyBytes(data.runSeed),adapter=persistentState(m);
  const state=adapter.restore(decodeCampaign2(stateBytes));adapter.validate(state);m.domains.validateReferences(state,0n);
  const inputs=await compileOrderedInputProfile(m.profiles.orderedInput,m.compiled.content,m.domains).create(ordered,stateBytes,m.modelIdentity,seed);
  const evaluator=compileAdaptationEvaluator(m.adaptation,m.domains,m.compiled.stateModel);
  return restrictedRun(createAdaptationRuntime(inputs,state,m.admission,evaluator,m.domains,m.compiled.stateModel,m.parameters.maxWork,m.bridge,undefined,'probe' in m?m.probe:undefined,'measurement' in m?m.measurement:undefined),m,inputs);
}
export async function restoreCampaign2Run(source:Campaign2ModelSource,input:{orderedInputs:Uint8Array;save:Uint8Array}){
  const data=ownData(input,['orderedInputs','save']),ordered=copyBytes(data.orderedInputs),saveBytes=copyBytes(data.save);
  const handle=await prepareCampaign2Model(source),m=modelFacts(handle);
  let save:ReturnType<typeof rec>;
  try{save=rec(('measurement' in m?decodeMeasurement:'probe' in m?decodeProbeReview:decodeCampaign2)(saveBytes),132n);}catch(error){
    throw new SaveContractError(`invalid canonical save: ${error instanceof Error?error.message:String(error)}`);
  }
  const runIdentity=await restoreRunIdentity(f(save,3n));
  if('measurement' in m)try{validateMeasurementArchive(save,m);}catch(error){throw new SaveContractError(error instanceof Error?error.message:String(error));}
  if('probe' in m)try{validateProbeArchive(save,m.probe.channel,m.probe.variableDefinition,m.probe.definitionId,m.probe);}catch(error){throw new SaveContractError(error instanceof Error?error.message:String(error));}
  // Saved queues at quiescence contain only original InputOnly work: every descendant settles at its source instant.
  const prepared=await prepareCanonicalSave(saveBytes,{stateAdapter:persistentState(m),eventTypeKeys:new Set([key(AUTHORED_FACT_EVENT),...('probe' in m?[key(PROBE_SOURCE_EVENT)]:[])]),
    maxSettlementWorkPerSimulationInstant:m.parameters.maxWork,expectedModelIdentity:m.modelIdentity,expectedRunIdentity:runIdentity,
    additionalSchemas:('measurement' in m?measurementSupportedSchemas():'probe' in m?probeSupportedSchemas():campaign2SupportedSchemas()).filter(s=>![...Object.values(identitySchemas),...Object.values(persistenceSchemas)].some(base=>base.typeId===s.typeId))});
  for(const value of [prepared.analyticalAnchors,prepared.randomRelevantAuthoritativeIds,prepared.continuingRunInputs])if(key(value)!==key(list([])))throw new SaveContractError('bounded persistence requires exact empty metadata');
  m.domains.validateReferences(prepared.state,prepared.clock);
  const profile=compileOrderedInputProfile(m.profiles.orderedInput,m.compiled.content,m.domains);
  await profile.validatePending(ordered,runIdentity.canonicalBytes,prepared.clock,prepared.queue);
  const inputs=await profile.restoreAuthority(ordered,runIdentity.canonicalBytes);
  const evaluator=compileAdaptationEvaluator(m.adaptation,m.domains,m.compiled.stateModel);
  return restrictedRun(createAdaptationRuntime(inputs,prepared.state,m.admission,evaluator,m.domains,m.compiled.stateModel,m.parameters.maxWork,m.bridge,prepared,'probe' in m?m.probe:undefined,'measurement' in m?m.measurement:undefined),m,inputs);
}
