import {compileOccurrenceIdentities} from './occurrenceIdentity';
import {measurementSupportedSchemas} from './measurementModelSource';
/** Authoritative exact frozen carriage-model admission; no caller-selected profile or handler. */
import {canonicalEncode,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {compileProbeModel} from './probeModel';
import {probeModelReviewSource} from './probeModelReview';
import {PROBE_SUCCESSOR_RULES} from './probeSuccessorReview';
import {measurementEvidenceModelSource,decodeMeasurement,measurementRecord,MEASUREMENT_RULES,MEASUREMENT_PROFILES} from './measurementModelSource';
import {validateProbeArchive} from './probeCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,invalidModel} from './canonicalData';
const atom=(ns:number,name:string)=>typedIdentifier(ns,text(name));
export const INTAKE_EVENT=atom(1001,'event/measurement-evidence-intake'),CARRIAGE_PADDING=atom(1001,'event/measurement-evidence-padding');
export const INTAKE_TRANSITION=atom(1009,'MeasurementEvidenceIntakeTransition');
export async function compileMeasurementModel(source:Parameters<typeof compileProbeModel>[0]){
 const snapshot={...source,registry:source.registry.slice(),content:source.content.slice(),parameters:source.parameters.slice()};
 if(snapshot.rulesVersion!==MEASUREMENT_RULES)invalidModel('carriage requires exact RulesVersion');
 const slots=items(decodeMeasurement(snapshot.registry),'list');if(slots.length!==6)invalidModel('carriage registry slot count');
 const entries=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const find=(name:string)=>{const matches=entries.filter(v=>key(f(rec(v,171n),1n))===key(atom(name==='MeasurementEvidenceIntakeTransition'?1009:1027,name)));if(matches.length!==1)invalidModel('carriage requires exact singleton '+name);return rec(matches[0],171n);};
 const probeDefinition=rec(f(find('definition/regulatory-diagnostic-probe'),4n),331n),a=f(probeDefinition,4n),p=f(probeDefinition,5n);
 if(typeof a!=='boolean'||typeof p!=='boolean')invalidModel('probe boolean grammar');
 const expected=measurementEvidenceModelSource(a as boolean,p as boolean);
 for(const field of Object.keys(expected) as (keyof typeof expected)[]){const x=snapshot[field],y=expected[field];if(typeof y==='string'?x!==y:key(decodeMeasurement(x as Uint8Array))!==key(decodeMeasurement(y)))invalidModel('carriage model mismatch '+field);}
 const base=await compileProbeModel({...probeModelReviewSource(a as boolean,p as boolean),rulesVersion:PROBE_SUCCESSOR_RULES});
 const definition=rec(f(find('definition/measurement-evidence-intake'),4n),336n),registration=canonicalEncode(f(find('MeasurementEvidenceIntakeTransition'),4n));
 const singleton=rec(f(find('definition/transition-admission'),4n),279n);
 // Reuse the shared occurrence interpreter with this model's exact schemas and role declarations.
 const roleContent={...base.compiled.content,recordRole(typeId:bigint,fieldId:bigint){
  const matches=items(slots[5],'set').filter(v=>{const position=rec(f(rec(v,265n),1n),264n);return key(f(position,1n))===key({kind:'unsigned',value:1n})&&key(f(position,2n))===key({kind:'unsigned',value:typeId})&&key(f(position,4n))===key({kind:'unsigned',value:fieldId});});
  if(matches.length>1)invalidModel('duplicate canonical role');
  return matches.length?canonicalEncode(f(rec(matches[0],265n),2n)):undefined;
 }};
 const occurrenceRules=compileOccurrenceIdentities(canonicalEncode(f(singleton,3n)),roleContent,{decode:decodeMeasurement,schema:type=>{const schema=measurementSupportedSchemas().find(s=>s.typeId===type);if(!schema)invalidModel('unknown occurrence schema');return schema!;}});
 const occurrence=(bytes:Uint8Array)=>occurrenceRules.extract(bytes);
 const validateInput=(value:CanonicalValue)=>{
  const observation=rec(value,203n);occurrence(canonicalEncode(observation));
  validateProbeArchive(observation,base.probe.channel,base.probe.variableDefinition,base.probe.definitionId,base.probe);
  if(key(f(observation,2n))!==key(f(definition,1n))||key(f(observation,4n))!==key(f(definition,2n))||key(f(observation,11n))!==key(text('regulatory-diagnostic-probe/0.1-candidate')))invalidModel('intake observer/channel/producer mismatch');
 };
 const validateOutput=(value:CanonicalValue)=>{const out=rec(value,337n);occurrence(canonicalEncode(out));validateInput(f(out,2n));if(key(f(out,3n))!==key(f(definition,3n))||key(f(out,4n))!==key(text('measurement-evidence-carriage/0.1-candidate')))invalidModel('carriage unit/version mismatch');};
 const admission={...base.admission,decode:decodeMeasurement,
  registrations:()=>[...base.admission.registrations(),{transitionKey:key(INTAKE_TRANSITION),registration:registration.slice()}],
  occurrenceIdentity:occurrence,
  registrationForEvent:(event:CanonicalValue)=>key(event)===key(INTAKE_EVENT)?registration.slice():base.admission.registrationForEvent(event),
  validateOutputs:(transition:CanonicalValue,outputs:readonly Uint8Array[])=>{if(key(transition)!==key(INTAKE_TRANSITION))return base.admission.validateOutputs(transition,outputs);if(outputs.length!==1)invalidModel('carriage output count');const output=decodeMeasurement(outputs[0]);validateOutput(output);return [output];},
 };
 const registryManifest=await commitManifest(decodeMeasurement(snapshot.registry)),modelIdentity=await createModelIdentity({...snapshot,contentManifest:await commitManifest(decodeMeasurement(snapshot.content)),parameterSet:await commitManifest(decodeMeasurement(snapshot.parameters)),registryManifest});
 return {...base,admission,registryManifest,modelIdentity,profiles:MEASUREMENT_PROFILES,measurement:Object.freeze({definition,registration,validateInput,validateOutput,unit:decodeMeasurement(canonicalEncode(f(definition,3n)))})};
}
