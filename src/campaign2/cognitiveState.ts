/** task-cognitive-path/0.1-candidate: state refinements and immutable instruction boundary.
 * Structural history validity never authenticates a caller-supplied learning history.
 * Public S0 excludes it; restore must additionally prove the complete executed prefix. */
import {canonicalEncode as enc,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {compilePredictionModel} from './predictionModel';
import {predictionModelReviewSource} from './predictionModelReview';
import {decodeCognitive,cognitiveRecord as r} from './cognitiveCodecs';
import {validateIdentityHistory,readQ} from './cognitiveMath';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataItems as items,dataKey as key,dataText as txt,dataUnsigned as u,invalidModel} from './canonicalData';
import type {compileCognitiveModel} from './cognitiveModel';

export async function compileCognitiveState(model:Awaited<ReturnType<typeof compileCognitiveModel>>){
 const structural=model.structuralState,slots=items(decodeCognitive(model.source.registry),'list');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const row=(stable:CanonicalValue)=>rows.find(v=>key(f(v,1n))===key(stable))??invalidModel('missing cognitive state definition');
 const definition=(name:string)=>f(row(typedIdentifier(1027,text('definition/'+name))),4n);
 const prior=await compilePredictionModel(predictionModelReviewSource());
 if(key(decodeCognitive(model.content.characterContentBytes()))!==key(decodeCognitive(prior.source.content)))invalidModel('cognitive character differs from inherited component');
 const contents=items(decodeCognitive(model.source.content),'set').map(v=>rec(v,170n));
 const tasks=contents.filter(v=>txt(id(f(v,2n)).payload)==='semantic-kind/task-commitment').map(content=>{
  const specId=items(f(content,16n),'list')[0],spec=rec(f(row(specId),4n),370n);
  const character=semanticReferentFromAuthoredContent(id(f(spec,1n))),referent=semanticReferentFromAuthoredContent(id(f(content,1n))),taskKey=r(371,[character,referent]);
  const from=f(spec,5n),deadline=f(spec,6n);if(typeof from==='boolean'||from.kind!=='signed'||typeof deadline==='boolean'||deadline.kind!=='signed')invalidModel('task instant grammar');
  const path:StatePath={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:taskKey}]};
  return {key:taskKey,path,character,referent,specId,spec,predictionDefinitionId:f(spec,2n),minimum:f(spec,3n),maximum:f(spec,4n),activeFrom:from.value,deadline:deadline.value};
 }).sort((a,b)=>key(a.key)<key(b.key)?-1:1);
 const byKey=new Map(tasks.map(t=>[key(t.key),t]));
 const C=tasks[0].character,identityKey=r(412,[C,typedIdentifier(1041,text('CommitmentFidelity'))]);
 const identityK=readQ(f(rec(definition('task-reason-source'),436n),2n));
 function validateEntry(path:StatePath,value?:CanonicalValue){
  if(path.rootStateTypeId!==373n&&path.rootStateTypeId!==415n)return;
  const selector=path.selectors[0];if(path.selectors.length!==1||selector?.kind!=='mapKey')invalidModel('cognitive leaf key required');
  if(path.rootStateTypeId===415n){
   if(path.fieldId!==1n||key(selector.key)!==key(identityKey))invalidModel('identity key outside frozen holder/channel');
   if(value!==undefined){const contributions=items(f(rec(value,414n),1n),'list');if(!contributions.length)invalidModel('present identity history must be nonempty');validateIdentityHistory(contributions);}
   return;
  }
  const task=byKey.get(key(selector.key));if(!task)invalidModel('task key outside declared holder/instance');
  if(path.fieldId!==1n&&path.fieldId!==2n)invalidModel('task field outside successor');
  if(value===undefined)return;
  if(path.fieldId===2n){rec(f(row(f(rec(value,390n),1n)),4n),389n);return;}
  const status=rec(value,372n),tag=u(f(status,1n));
  if(tag===2n){
   const reference=rec(f(status,2n),237n),at=f(status,3n),occurrence=id(f(reference,2n));
   if(u(f(reference,1n))!==1n||occurrence.namespaceId!==1115n||typeof occurrence.payload==='boolean'||occurrence.payload.kind!=='unsigned')invalidModel('satisfied task requires observation');
   if(typeof at==='boolean'||at.kind!=='signed'||at.value<task.activeFrom||at.value>=task.deadline)invalidModel('task satisfaction outside active window');
  }else if(tag!==1n&&tag!==3n)invalidModel('task status variant');
 }
 function validateState(state:AuthoritativeState){
  structural.validateState(state);
  const entries=state.entries();prior.stateModel.validateState(new AuthoritativeState(entries.filter(e=>e.path.rootStateTypeId!==373n&&e.path.rootStateTypeId!==415n)));
  const adopted=new Set<string>();
  for(const e of entries){validateEntry(e.path,e.value);if(e.path.rootStateTypeId===373n&&e.path.fieldId===1n)adopted.add(key((e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key));}
  for(const e of entries)if(e.path.rootStateTypeId===373n&&e.path.fieldId===2n&&!adopted.has(key((e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key)))invalidModel('instruction requires actually adopted task');
 }
 const stateModel=Object.freeze({...structural,validateState,
  validatePath(path:StatePath){structural.validatePath(path);validateEntry(path);},
  restoreState(bytes:Uint8Array){const state=structural.restoreState(bytes);validateState(state);return state;},
  read(state:AuthoritativeState,path:StatePath){structural.validatePath(path);validateEntry(path);const result=structural.read(state,path);if(result.presence)validateEntry(path,result.value!);return result;},
  applyPatch(state:AuthoritativeState,patch:StatePatch,authority:Parameters<typeof structural.applyPatch>[2],scope?:Parameters<typeof structural.applyPatch>[3]){const result=structural.applyPatch(state,patch,authority,scope);validateState(result.state);return result;},
 });
 function initialState(bytes:Uint8Array){
  const state=stateModel.restoreState(bytes);
  for(const e of state.entries()){
   if([346n,362n,415n].includes(e.path.rootStateTypeId))invalidModel('initial learned memory, prediction and identity must be empty');
   if(e.path.rootStateTypeId===373n&&e.path.fieldId===1n&&u(f(rec(e.value,372n),1n))!==1n)invalidModel('initial tasks must be Open');
  }
  prior.base.domains.validateStatic(state);prior.base.domains.validateReferences(state,0n);return state;
 }
 return Object.freeze({stateModel,initialState,tasks,identityKey,identityK,prior,definition,
  measurement:rec(f(row(typedIdentifier(1009,text('TaskMeasurementSettlementTransition'))),4n),375n),
  deadline:rec(f(row(typedIdentifier(1009,text('TaskDeadlineSettlementTransition'))),4n),376n)});
}
