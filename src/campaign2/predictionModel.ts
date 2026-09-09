/** measurement-prediction/0.2-candidate: exact frozen model and owned value grammar. */
import {canonicalEncode as enc,set,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {compileValDeclarations} from './valDeclarations';
import {compileCampaign2StateModel} from './stateModel';
import {compileOccurrenceIdentities} from './occurrenceIdentity';
import {compileMemoryModel,snapshotMemorySource} from './memoryModel';
import {memoryModelSource,memoryWrapperDeclarations,MEMORY_VERSION,MEMORY_RECALL_ABLATION} from './memoryModelSource';
import {predictionModelReviewSource,PREDICTION_RULES,PREDICTION_REGISTRY,PREDICTION_VERSION,PREDICTION_APPLICATION_ABLATION,PREDICTION_READ_ABLATION,PREDICTION_PROFILES,PREDICTION_BUNDLE} from './predictionModelReview';
import {decodePrediction,predictionSupportedSchemas} from './predictionCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataUnsigned as u,dataText as txt,dataKey as key,invalidModel} from './canonicalData';
import type {Campaign2ModelSource} from './factory';
import {validateSemanticUnionVariant} from '../semanticBinding/semanticSchemaRegistry';

export async function compilePredictionModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);
 if(source.rulesVersion!==PREDICTION_RULES||source.registrySchemaVersion!==PREDICTION_REGISTRY)invalidModel('exact prediction profile required');
 const slots=items(decodePrediction(source.registry),'list');if(slots.length!==6)invalidModel('six prediction registry slots required');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const row=(name:string)=>{const wanted={kind:'typedIdentifier' as const,namespaceId:BigInt(name.startsWith('definition/')?1027:1009),payload:{kind:'text' as const,value:name}},matches=rows.filter(v=>key(f(rec(v,171n),1n))===key(wanted));if(matches.length!==1)invalidModel('prediction singleton '+name);return rec(matches[0],171n);};
 const definition=rec(f(row('definition/measurement-prediction'),4n),359n),definitionId=id(f(row('definition/measurement-prediction'),1n));
 const application=rec(f(row('MeasurementPredictionApplicationTransition'),4n),364n),read=f(row('MeasurementPredictionReadTransition'),4n),opportunity=rec(f(row('definition/measurement-prediction-opportunity'),4n),369n);
 if(typeof read==='boolean'||read.kind!=='record'||read.schema.typeId!==368n||read.schema.schemaVersion!==2n)invalidModel('requires corrected368/2');
 const probe=rec(f(row('definition/regulatory-diagnostic-probe'),4n),331n),a=f(probe,4n),p=f(probe,5n);
 if(typeof a!=='boolean'||typeof p!=='boolean')invalidModel('prediction source booleans');
 const fw=f(row('MemoryFormationTransition'),4n);if(typeof fw==='boolean'||fw.kind!=='record'||![356n,357n].includes(fw.schema.typeId))invalidModel('memory formation wrapper');
 const rv=txt(f(rec(f(rec(f(row('MeasurementRecallTransition'),4n),358n),1n),353n),2n)),av=txt(f(application,2n)),pv=txt(f(read,2n));
 if(![MEMORY_VERSION,MEMORY_RECALL_ABLATION].includes(rv)||![PREDICTION_VERSION,PREDICTION_APPLICATION_ABLATION].includes(av)||![PREDICTION_VERSION,PREDICTION_READ_ABLATION].includes(pv))invalidModel('prediction control version');
 const F=fw.schema.typeId===357n,R=rv===MEMORY_VERSION,B=av===PREDICTION_VERSION,P=pv===PREDICTION_VERSION;
 const schemas=predictionSupportedSchemas(),codec={decode:decodePrediction,schema:(type:bigint)=>{const s=schemas.find(s=>s.typeId===type);if(!s)invalidModel('prediction schema unavailable');return s;}};
 const val=rows.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(txt(id(f(rec(v,171n),2n)).payload)));
 await compileValDeclarations(enc(set(val.filter(v=>txt(id(f(rec(v,171n),2n)).payload)==='registry/semantic-kind'))),enc(set([])),codec).compileContent(source.content,enc(slots[0]));
 const declarations=compileValDeclarations(enc(set(val)),source.registry,codec);
 const expected=predictionModelReviewSource(a,p,F,R,B,P);
 for(const field of Object.keys(expected) as (keyof Campaign2ModelSource)[]){const x=source[field],y=expected[field];if(typeof y==='string'?x!==y:key(decodePrediction(x as Uint8Array))!==key(decodePrediction(y)))invalidModel('prediction differs from frozen source: '+field);}
 const content=await declarations.compileContent(source.content,enc(slots[0]));content.validateRecordRoles(source.registry);
 const structural=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,codec);
 const wrappers=memoryWrapperDeclarations(),memory=await compileMemoryModel(memoryModelSource(a,p,F?wrappers.formation:wrappers.formationAblated,R?wrappers.recall:wrappers.recallAblated));
 // The unchanged memory component validates its own families. It never sees or
 // reads the added belief family; the full structural owner checks it separately.
 const memoryState=(state:AuthoritativeState)=>new AuthoritativeState(state.entries().filter(e=>e.path.rootStateTypeId!==362n));
 function predictionValue(path:StatePath,value:CanonicalValue){
  if(path.rootStateTypeId!==362n)return;
  const selector=path.selectors[0];if(selector?.kind!=='mapKey')invalidModel('prediction map key required');
  const k=rec(selector.key,360n),v=rec(value,361n),mean=f(v,1n),basis=items(f(v,2n),'set'),n=BigInt(basis.length);
  if(key(f(k,2n))!==key(definitionId)||n<1n||n>u(f(definition,4n)))invalidModel('prediction target/support domain');
  for(const ref of basis){const q=rec(ref,237n);validateSemanticUnionVariant(237n,u(f(q,1n)),[...q.fields.keys()].filter(n=>n!==1n));if(u(f(q,1n))!==1n)invalidModel('prediction basis requires observation references');const occurrence=id(f(q,2n));if(occurrence.namespaceId!==1115n||typeof occurrence.payload==='boolean'||occurrence.payload.kind!=='unsigned')invalidModel('prediction observation occurrence');}
  if(typeof mean==='boolean'||mean.kind!=='rational'||mean.numerator<0n||mean.numerator>10n*mean.denominator||(10n*n)%mean.denominator!==0n)invalidModel('prediction exact mean domain');
 }
 const validateState=(state:AuthoritativeState)=>{structural.validateState(state);memory.stateModel.validateState(memoryState(state));for(const e of state.entries())predictionValue(e.path,e.value);};
 const stateModel=Object.freeze({...structural,validateState,restoreState(bytes:Uint8Array){const s=structural.restoreState(bytes);validateState(s);return s;},read(state:AuthoritativeState,path:StatePath){const result=structural.read(state,path);if(result.presence)predictionValue(path,result.value!);return result;},applyPatch(state:AuthoritativeState,patch:StatePatch,authority:TypedIdentifierValue,scope?:Parameters<typeof structural.applyPatch>[3]){const result=structural.applyPatch(state,patch,authority,scope);validateState(result.state);return result;}});
 const admission=rec(f(row('definition/transition-admission'),4n),279n),occurrenceMap=f(admission,3n);
 const occurrences=compileOccurrenceIdentities(enc(occurrenceMap),content,codec);
 if(typeof occurrenceMap==='boolean'||occurrenceMap.kind!=='map')invalidModel('occurrence map required');
 const rule=rec(occurrenceMap.entries.find(([schema])=>u(f(rec(schema,254n),1n))===366n)![1],278n),readoutNamespace=u(f(rec(f(rule,2n),263n),1n));
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(decodePrediction(source.content)),parameterSet:await commitManifest(decodePrediction(source.parameters)),registryManifest:await commitManifest(decodePrediction(source.registry))});
 return Object.freeze({source,modelIdentity,content,stateModel,definition,definitionId,application,read,opportunity,occurrences,readoutNamespace,applicationEnabled:B,readEnabled:P,profiles:PREDICTION_PROFILES,semanticBundle:PREDICTION_BUNDLE,
  // Old registration bytes are equal by exact source admission. Runtime trace
  // receives the whole new identity explicitly; this is not old-factory activation.
  memoryComponent:Object.freeze({...memory,stateModel,content}),base:memory.base});
}
