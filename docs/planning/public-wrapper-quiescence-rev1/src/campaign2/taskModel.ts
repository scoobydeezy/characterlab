/** task-commitment/0.2-candidate. Closed model construction; no public activation capability. */
import {canonicalEncode as enc,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {createModelIdentity,commitManifest} from '../substrate/identity';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {snapshotMemorySource} from './memoryModel';
import {compilePredictionModel} from './predictionModel';
import {predictionModelReviewSource,PREDICTION_VERSION,PREDICTION_APPLICATION_ABLATION,PREDICTION_READ_ABLATION} from './predictionModelReview';
import {MEMORY_VERSION,MEMORY_RECALL_ABLATION} from './memoryModelSource';
import {compileCampaign2StateModel} from './stateModel';
import {compileTaskDeclarations} from './taskDeclarations';
import {decodeTask,taskRecord as r,taskSupportedSchemas} from './taskCodecs';
import {taskModelReviewSource,TASK_RULES,TASK_REGISTRY,TASK_PROFILES,TASK_BUNDLE,type TaskSpecimen} from './taskModelReview';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt,dataIdentity as id,dataUnsigned as u,invalidModel} from './canonicalData';
import type {Campaign2ModelSource} from './factory';

export async function compileTaskModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);
 if(source.rulesVersion!==TASK_RULES||source.registrySchemaVersion!==TASK_REGISTRY)invalidModel('exact task profile required');
 const slots=items(decodeTask(source.registry),'list');if(slots.length!==6)invalidModel('task registry slots');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const row=(name:string)=>{const found=rows.filter(v=>{const stable=id(f(v,1n));return stable.namespaceId===BigInt(name.startsWith('definition/')?1027:1009)&&typeof stable.payload!=='boolean'&&stable.payload.kind==='text'&&stable.payload.value===name;});if(found.length!==1)invalidModel('task singleton '+name);return found[0];};
 const probe=rec(f(row('definition/regulatory-diagnostic-probe'),4n),331n),available=f(probe,4n),permitted=f(probe,5n);
 if(typeof available!=='boolean'||typeof permitted!=='boolean')invalidModel('probe control booleans');
 const form=f(row('MemoryFormationTransition'),4n);if(typeof form==='boolean'||form.kind!=='record'||![356n,357n].includes(form.schema.typeId))invalidModel('memory formation wrapper');
 const memoryVersion=txt(f(rec(f(rec(f(row('MeasurementRecallTransition'),4n),358n),1n),353n),2n));
 const application=rec(f(row('MeasurementPredictionApplicationTransition'),4n),364n),read=f(row('MeasurementPredictionReadTransition'),4n);
 if(typeof read==='boolean'||read.kind!=='record'||read.schema.typeId!==368n||read.schema.schemaVersion!==2n)invalidModel('corrected prediction read required');
 const av=txt(f(application,2n)),rv=txt(f(read,2n));
 if(![MEMORY_VERSION,MEMORY_RECALL_ABLATION].includes(memoryVersion)||![PREDICTION_VERSION,PREDICTION_APPLICATION_ABLATION].includes(av)||![PREDICTION_VERSION,PREDICTION_READ_ABLATION].includes(rv))invalidModel('unknown inherited control version');
 const flags=[available,permitted,form.schema.typeId===357n,memoryVersion===MEMORY_VERSION,av===PREDICTION_VERSION,rv===PREDICTION_VERSION] as const;
 const content=await compileTaskDeclarations(source.content,source.registry);content.validateRecordRoles(source.registry);
 let specimen:TaskSpecimen|undefined;
 for(const candidate of ['overlapping','coincident','recurrence'] as const){const expected=taskModelReviewSource(candidate,...flags);
  if((Object.keys(expected) as (keyof Campaign2ModelSource)[]).every(field=>typeof expected[field]==='string'?source[field]===expected[field]:key(decodeTask(source[field] as Uint8Array))===key(decodeTask(expected[field] as Uint8Array)))){specimen=candidate;break;}}
 if(!specimen)invalidModel('task source differs from frozen declaration family');
 const prediction=await compilePredictionModel(predictionModelReviewSource(...flags));
 if(key(decodeTask(content.characterContentBytes()))!==key(decodeTask(prediction.source.content)))invalidModel('qualified character image differs from retained REG component');
 const schemas=taskSupportedSchemas(),structural=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode:decodeTask,schema:type=>{const s=schemas.find(s=>s.typeId===type);if(!s)invalidModel('task schema unavailable');return s;}});
 const taskContents=items(decodeTask(source.content),'set').filter(v=>txt(id(f(rec(v,170n),2n)).payload)==='semantic-kind/task-commitment');
 const tasks=taskContents.map(value=>{const contentRecord=rec(value,170n),specId=items(f(contentRecord,16n),'list')[0],definition=rows.find(v=>key(f(v,1n))===key(specId));if(!definition)invalidModel('missing task spec');
  const spec=rec(f(definition,4n),370n),C=semanticReferentFromAuthoredContent(id(f(spec,1n))),task=semanticReferentFromAuthoredContent(id(f(contentRecord,1n))),taskKey=r(371,[C,task]);
  const from=f(spec,5n),deadline=f(spec,6n);if(typeof from==='boolean'||from.kind!=='signed'||typeof deadline==='boolean'||deadline.kind!=='signed')invalidModel('task instant domain');
  const path:StatePath={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:taskKey}]};
  return {key:taskKey,path,character:C,referent:task,specId,spec,predictionDefinitionId:f(spec,2n),minimum:f(spec,3n),maximum:f(spec,4n),activeFrom:from.value,deadline:deadline.value};
 }).sort((a,b)=>key(a.key)<key(b.key)?-1:1);
 const byKey=new Map(tasks.map(task=>[key(task.key),task]));
 function validateTaskValue(path:StatePath,value:CanonicalValue){if(path.rootStateTypeId!==373n)return;
  const selector=path.selectors[0];if(path.fieldId!==1n||path.selectors.length!==1||selector?.kind!=='mapKey')invalidModel('task state path');
  const task=byKey.get(key(selector.key));if(!task)invalidModel('task key outside declared holder/instance domain');
  const status=rec(value,372n),tag=u(f(status,1n));
  if(tag===2n){const ref=rec(f(status,2n),237n),at=f(status,3n),occurrence=id(f(ref,2n)),ordinal=occurrence.payload;
   if(u(f(ref,1n))!==1n||ref.fields.size!==2||occurrence.namespaceId!==1115n||typeof ordinal==='boolean'||ordinal.kind!=='unsigned')invalidModel('task satisfaction requires observation reference');
   if(typeof at==='boolean'||at.kind!=='signed'||at.value<task.activeFrom||at.value>=task.deadline)invalidModel('task satisfaction time outside window');
  }else if(tag!==1n&&tag!==3n)invalidModel('task status variant');
 }
 const withoutTasks=(state:AuthoritativeState)=>new AuthoritativeState(state.entries().filter(e=>e.path.rootStateTypeId!==373n));
 function validateState(state:AuthoritativeState){structural.validateState(state);prediction.stateModel.validateState(withoutTasks(state));for(const e of state.entries())validateTaskValue(e.path,e.value);}
 const stateModel=Object.freeze({...structural,validateState,restoreState(bytes:Uint8Array){const state=structural.restoreState(bytes);validateState(state);return state;},read(state:AuthoritativeState,path:StatePath){const result=structural.read(state,path);if(result.presence)validateTaskValue(path,result.value!);return result;},applyPatch(state:AuthoritativeState,patch:StatePatch,authority:Parameters<typeof structural.applyPatch>[2],scope?:Parameters<typeof structural.applyPatch>[3]){const result=structural.applyPatch(state,patch,authority,scope);validateState(result.state);return result;}});
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(decodeTask(source.content)),registryManifest:await commitManifest(decodeTask(source.registry)),parameterSet:await commitManifest(decodeTask(source.parameters))});
 const memoryComponent=Object.freeze({...prediction.memoryComponent,stateModel,content});
 return Object.freeze({source,modelIdentity,content,stateModel,tasks,measurement:rec(f(row('TaskMeasurementSettlementTransition'),4n),375n),deadline:rec(f(row('TaskDeadlineSettlementTransition'),4n),376n),specimen,flags,profiles:TASK_PROFILES,semanticBundle:TASK_BUNDLE,base:prediction.base,predictionComponent:Object.freeze({...prediction,stateModel,content,memoryComponent})});
}
