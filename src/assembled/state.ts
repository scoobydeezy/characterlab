import {withWorkMaintenanceState} from './workMaintenance';
import {withAssociationState} from './learnedAssociation';
import {withEffectBelief} from './effectEvidence';
import {receivingRecord as statusRecord} from './codecs';
import {withQualifiedIdentityState} from './identityEligibility';
import {withRecognitionState} from './recognitionState';
// assembled-character-model/0.1-candidate: bounded successor of cognitiveState at db0ca7a8.
/** task-cognitive-path/0.1-candidate: state refinements and immutable instruction boundary.
 * Structural history validity never authenticates a caller-supplied learning history.
 * Public S0 excludes it; restore must additionally prove the complete executed prefix. */
import {canonicalEncode as enc,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {compilePredictionModel} from '../campaign2/predictionModel';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {decodeCognitive,cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {validateIdentityHistory,readQ} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataItems as items,dataKey as key,dataText as txt,dataUnsigned as u,invalidModel} from '../campaign2/canonicalData';
import {withRelationshipState} from './relationship';
import {withSocialState} from './social';
import {withCommunicationState} from './communication';
import {withControlState} from './control';
import {withHabitState} from './habit';
import {withPerformanceState} from './performance';
import {withHorizonState} from './horizon';
import {withPriorityState,GOAL_OWNER} from './priority';
import {pattern} from './skill';
import {withStrategyState} from './strategy';
import {withSkillState} from './skill';
import {withRetentionState} from './retention';
import {withEpisodicState} from './memory';
import {withBodyState} from './body';
import type {compileCharacterModel} from './model';

export async function compileCharacterState(model:Awaited<ReturnType<typeof compileCharacterModel>>){
 const structural=model.structuralState,slots=items(decodeCognitive(model.baseRegistry),'list');
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
 if(model.tolerance&&!prior.base.reg.hasVariable(model.tolerance.variable))invalidModel('unknown tolerance regulatory variable');
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
  if(path.fieldId===2n){const instruction=f(rec(value,390n),1n);rec(f(row(instruction),4n),389n);if(model.commitmentAdoption&&!model.strategy!.find(t=>key(t.task)===key(task.key))?.plans.some(p=>key(p.instructionId)===key(instruction)))invalidModel('adopted instruction/task reference');return;}
  const status=statusRecord(value,372n),tag=u(f(status,1n));
  if(tag===2n){
   const reference=rec(f(status,2n),237n),at=f(status,3n),occurrence=id(f(reference,2n));
   if(u(f(reference,1n))!==1n||occurrence.namespaceId!==1115n||typeof occurrence.payload==='boolean'||occurrence.payload.kind!=='unsigned')invalidModel('satisfied task requires observation');
   if(typeof at==='boolean'||at.kind!=='signed'||at.value<task.activeFrom||at.value>=task.deadline)invalidModel('task satisfaction outside active window');
  }else if(tag===4n){
   const at=f(status,2n);if(!model.commitmentLifecycle||status.schema.schemaVersion!==2n||typeof at==='boolean'||at.kind!=='signed'||at.value>=task.deadline)invalidModel('cancelled task domain/version');
  }else if(tag!==1n&&tag!==3n)invalidModel('task status variant');
 }
 function validateState(state:AuthoritativeState){
  structural.validateState(state);
  const entries=state.entries();prior.stateModel.validateState(new AuthoritativeState(entries.filter(e=>e.path.rootStateTypeId!==373n&&e.path.rootStateTypeId!==415n)));
  const adopted=new Set<string>();
  for(const e of entries){validateEntry(e.path,e.value);if(e.path.rootStateTypeId===373n&&e.path.fieldId===1n)adopted.add(key((e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key));}
  for(const e of entries)if(e.path.rootStateTypeId===373n&&e.path.fieldId===2n&&!adopted.has(key((e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key)))invalidModel('instruction requires actually adopted task');
 }
 const instructionPaths=tasks.map(t=>({...t.path,fieldId:2n}));
 const instructionAuthority=model.commitmentAdoption?new StateAuthorityRegistry(instructionPaths.map(path=>({pattern:pattern(path),validateValue:(value:CanonicalValue)=>{structural.validatePath(path);model.content.validateRecordRoles(enc(value));validateEntry(path,value);},removalAllowed:false})),[{mutationAuthorityId:GOAL_OWNER,patterns:instructionPaths.map(pattern)}]):undefined;
 const inheritedState=Object.freeze({...structural,validateState,
  validatePath(path:StatePath){structural.validatePath(path);validateEntry(path);},
  restoreState(bytes:Uint8Array){const state=structural.restoreState(bytes);validateState(state);return state;},
  read(state:AuthoritativeState,path:StatePath){structural.validatePath(path);validateEntry(path);const result=structural.read(state,path);if(result.presence)validateEntry(path,result.value!);return result;},
  applyPatch(state:AuthoritativeState,patch:StatePatch,authority:Parameters<typeof structural.applyPatch>[2],scope?:Parameters<typeof structural.applyPatch>[3]){if(model.commitmentLifecycle)for(const op of patch.operations)if(op.path.rootStateTypeId===373n&&op.path.fieldId===1n){
    const before=state.read(op.path),tag=before.presence?u(f(statusRecord(before.value!,372n),1n)):0n;
    if(tag!==0n&&tag!==1n)invalidModel('terminal commitment cannot change');
    if(op.kind==='set'&&u(f(statusRecord(op.newValue,372n),1n))===4n&&tag!==1n)invalidModel('cancellation requires Open commitment');
   }const instructions=model.commitmentAdoption?patch.operations.filter(o=>o.path.rootStateTypeId===373n&&o.path.fieldId===2n):[];
   for(const op of instructions){if(op.kind!=='set'||state.read(op.path).presence||state.read({...op.path,fieldId:1n}).presence)invalidModel('adopted instruction is immutable');if(!patch.operations.some(p=>p.kind==='set'&&key(statePathValue(p.path))===key(statePathValue({...op.path,fieldId:1n}))&&key(p.newValue)===key(r(372,[{kind:'unsigned',value:1n}]))))invalidModel('instruction requires joint fresh Open adoption');if(scope&&(!scope.writableRoots.includes(373n)||!scope.targetPaths.some(p=>key(statePathValue(p))===key(statePathValue(op.path)))))invalidModel('instruction write scope');}
   const basePatch={operations:patch.operations.filter(o=>!instructions.includes(o))},base=structural.applyPatch(state,basePatch,authority,scope),result=instructions.length?applyStatePatch(base.state,{operations:instructions},authority,instructionAuthority!):{state:base.state,diffs:[]};validateState(result.state);return {state:result.state,diffs:[...base.diffs,...result.diffs]};},
 });
 const episodes=model.memory?withEpisodicState(inheritedState,C,model.body!,!!model.affectMemory,model.encoding,!!model.memoryUse,model.bodyMemoryUse,model.positionMemory,model.retainedAttribution,model.significanceEnabled,model.actionMemory,model.effectEvidence?.proposition,model.social?.beliefTrials?32n:8n):inheritedState;
 const embodied=model.body?withBodyState(episodes,C,model.body):episodes;
 const retained=model.retention?withRetentionState(embodied,C):embodied;
 const procedural=model.skill?withSkillState(retained,C,model.procedures,model.formationEnabled):retained;
 const planned=model.strategy?withStrategyState(procedural,C,model.strategy):procedural;
 const prioritized=model.priority?withPriorityState(planned,tasks.map(t=>t.key),model.goalMeaning?{C,settings:model.goalMeaning}:undefined,model.spatialMeaning?{C,settings:model.spatialMeaning}:undefined,model.commitmentAdoption):planned;
 const forecasted=model.horizon?withHorizonState(prioritized,tasks.map(t=>t.key)):prioritized;
 const monitored=model.performance?withPerformanceState(forecasted,model.strategy!,model.expectationEnabled,model.selfBeliefEnabled?C:undefined,model.values,model.causalEnabled,model.interferenceEnabled):forecasted;
 const habitual=model.habit?withHabitState(monitored,C):monitored;
 const controlled=model.control?withControlState(habitual,C,model.mitigationEnabled?3:model.sharedAffectSources?2:model.reappraisal!==undefined,model.fatigue!==undefined,model.rumination):habitual;
 const communicating=model.communication?withCommunicationState(controlled,[...(model.communication.topic?[]:[C]),...model.communication.recipients],model.communication.topic,model.communication.expectation,model.commitmentWitness?tasks.map(t=>t.key):[]):controlled;
 const socialized=model.social?withSocialState(communicating,C,model.social.target,model.social.targets,!!model.loss,!!model.embarrassment,model.social.beliefTrials,model.socialWitness?.observers):communicating;
 const related=model.relationship?withRelationshipState(socialized,C,model.relationship.target,model.relationship.bindings.map(b=>b.target),model.attachment):socialized;
 const recognized=model.recognition?withRecognitionState(related,model.recognition,!!model.encoding,model.positionEnabled):related;
 const identityRegistration=rec(f(rows.find(v=>key(f(v,1n))===key(typedIdentifier(1009,text('TaskIdentityApplicationTransition'))))!,4n),450n);
 const qualified=model.eligibilityEnabled?withQualifiedIdentityState(recognized,identityKey,id(f(rec(f(identityRegistration,6n),322n),2n))):recognized;
 const believed=model.effectEvidence?withEffectBelief(qualified,C,model.effectEvidence):qualified;
 const associated=model.affectMemory?.learned?withAssociationState(believed,C,model.affectMemory.learned):believed;
 const stateModel=model.workMaintenance?withWorkMaintenanceState(associated,C,model.workMaintenance,tasks.length):associated;
 function initialState(bytes:Uint8Array){
  const state=stateModel.restoreState(bytes);
  for(const e of state.entries()){
   if(e.path.rootStateTypeId===631n)invalidModel('initial learned association must be absent');
   if(model.reappraisal&&(e.path.rootStateTypeId===1031n||e.path.rootStateTypeId===1000n&&e.path.fieldId===8n))invalidModel('initial reappraisal knowledge/frame must be absent');
   if(model.recognition&&[241n,242n,244n].includes(e.path.rootStateTypeId))invalidModel('initial recognition tracks/resolutions must be absent');
   if(model.relationship&&e.path.rootStateTypeId===848n)invalidModel('initial relationship history must be absent');
   if(model.social&&e.path.rootStateTypeId===810n)invalidModel('initial person belief must be absent');
   if(model.communication&&e.path.rootStateTypeId===1072n)invalidModel('initial communication knowledge must be absent');
   if(e.path.rootStateTypeId===1330n)invalidModel('initial rumination must be absent');
   if(e.path.rootStateTypeId===1351n)invalidModel('initial fatigue must be absent');
   if(model.control&&(e.path.rootStateTypeId===1014n||e.path.rootStateTypeId===373n&&e.path.fieldId===4n))invalidModel('initial control state must be absent');
   if(model.habit&&[821n,823n].includes(e.path.rootStateTypeId))invalidModel('initial habit/reward must be absent');
   if(e.path.rootStateTypeId===373n&&(model.goalMeaning&&e.path.fieldId===5n||model.spatialMeaning&&e.path.fieldId===6n))invalidModel('initial maintenance goal must be absent');
   if(model.priority&&e.path.rootStateTypeId===373n&&e.path.fieldId===3n)invalidModel('initial importance must be absent');
   if(model.strategy&&[996n,1000n].includes(e.path.rootStateTypeId))invalidModel('initial strategy state must be absent');
   if(model.values&&e.path.rootStateTypeId===1516n)invalidModel('initial values must be absent');
   if(model.formationEnabled&&e.path.rootStateTypeId===1503n)invalidModel('initial formation must be absent');
   if(model.skill&&[785n,1500n].includes(e.path.rootStateTypeId))invalidModel('initial skill/development must be absent');
   if(e.path.rootStateTypeId===455n){const at=f(rec(e.value,454n),2n);if(typeof at==='boolean'||at.kind!=='signed'||at.value!==0n)invalidModel('initial body anchor must be at0');}
   if([346n,362n,415n].includes(e.path.rootStateTypeId))invalidModel('initial learned memory, prediction and identity must be empty');
   if(e.path.rootStateTypeId===373n&&e.path.fieldId===1n&&u(f(statusRecord(e.value,372n),1n))!==1n)invalidModel('initial tasks must be Open');
  }
  prior.base.domains.validateStatic(state);prior.base.domains.validateReferences(state,0n);return state;
 }
 return Object.freeze({stateModel,initialState,tasks,identityKey,identityK,prior,definition,
  measurement:rec(f(row(typedIdentifier(1009,text('TaskMeasurementSettlementTransition'))),4n),375n),
  deadline:rec(f(row(typedIdentifier(1009,text('TaskDeadlineSettlementTransition'))),4n),376n)});
}
