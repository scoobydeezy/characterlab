/** general-attention-trace-binding/0.1-candidate. Trace-only runtime protocol
 * mutations are explicit invariant evidence, never cognitive StatePatch/read
 * authority. Terminal owner contributions are finalized from the common B0. */
import {canonicalEncode as enc,list,text,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {traceRecordValue} from '../substrate/trace';
import {statePatchValue,mutationDiffValue,patternMatches,type AuthoritativeState,type StatePatch,type ActualReadRecord,type StructuralMutationDiff,type StatePathPattern} from '../substrate/state';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataKey as key,dataRecord as rec,dataField as f,dataText as txt,invalidModel as fail} from '../campaign2/canonicalData';
import {generalRegistrationTemplates} from './generalRegistration';
import {generalImplementation,generalStagePaths,generalSubject,generalId as id,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import type {compileGeneralDeclarations} from './generalDeclarations';

export interface GeneralTraceIdentities {readonly model:CanonicalValue;readonly run:CanonicalValue;}
export interface GeneralTraceFacts {
 readonly stage:string;readonly event:ScheduledEvent;readonly base:AuthoritativeState;
 readonly outputs:readonly CanonicalValue[];readonly children:readonly ScheduledEvent[];
 readonly reads:readonly ActualReadRecord[];readonly patch:StatePatch;
 readonly protocolPatch?:StatePatch;
}
export function compileGeneralTrace(model:Awaited<ReturnType<typeof compileGeneralDeclarations>>,identities:GeneralTraceIdentities){
 const modelIdentity=rec(identities.model,103n),runIdentity=rec(identities.run,104n),who=generalSubject(),templates=generalRegistrationTemplates();
 if(key(f(runIdentity,1n))!==key(modelIdentity))fail('GA trace run/model mismatch');
 function render(facts:GeneralTraceFacts){
  const {stage,event,base,patch,reads,outputs,children}=facts,template=templates.find(t=>t.name===stage);
  let seam:TypedIdentifierValue,version:string,domain:readonly StatePathPattern[],diffs:readonly StructuralMutationDiff[],after=base;
  if(template){
   if(event.phase!==BigInt(template.phase)||key(event.eventTypeId)!==key(template.event))fail('GA trace stage/event mismatch');
   seam=template.seam;version=txt(f(rec(decode(model.registrationBytes(stage),generalBindingContext()),706n),3n));domain=generalStagePaths(stage).reads;
   const applied=model.state.applyStagePatch(stage,base,patch);after=applied.state;diffs=applied.diffs;
  }else{
   if(txt(event.eventTypeId.payload)!==stage)fail('GA inherited trace stage');
   if(stage==='event/measurement-prediction-application'){
    seam=id(1036,'seam/measurement-prediction');version='measurement-prediction/0.2-candidate';domain=generalStagePaths('prior-concern-workspace').reads.filter(p=>[268n,362n].includes(p.rootStateTypeId));const applied=model.state.applyPredictionPatch(base,patch);after=applied.state;diffs=applied.diffs;
   }else if(stage==='event/task-deadline'){
    seam=id(1036,'seam/task-commitment');version='task-commitment/0.2-candidate';domain=generalStagePaths('prior-concern-workspace').reads.filter(p=>p.rootStateTypeId===373n);const applied=model.state.applyTaskPatch(base,patch);after=applied.state;diffs=applied.diffs;
   }else{
    if(patch.operations.length)fail('GA inherited trace read-only mutation');diffs=[];
    const probe=model.inheritedSource.execution.eventTypes().some(t=>key(t)===key(event.eventTypeId));
    if(probe){seam=id(1036,'seam/regulatory-diagnostic-probe');version='regulatory-diagnostic-probe/0.1-candidate';domain=stage==='event/regulatory-diagnostic-probe'?[model.inheritedSource.execution.pattern]:[];if(stage==='event/regulatory-diagnostic-probe')model.inheritedSource.execution.validateReadEvidence(reads);}
    else if(stage==='event/measurement-evidence-intake'){seam=id(1036,'seam/measurement-evidence-carriage');version='measurement-evidence-carriage/0.1-candidate';domain=[];}
    else if(stage==='event/measurement-episode-evidence'){seam=id(1036,'seam/measurement-episodic-memory');version='measurement-episodic-memory/0.1-candidate';domain=[];}
    else return fail('GA unknown inherited trace stage');
   }
  }
  for(const read of reads){
   if(!domain.some(p=>patternMatches(p,read.path)))fail('GA trace undeclared read');
   for(const source of read.derivedSources){if(!domain.some(p=>patternMatches(p,source.path))||key(list([source.presence,source.value??false]))!==key(list([base.read(source.path).presence,base.read(source.path).value??false])))fail('GA trace derived source differs from B0');}
   if(!read.transformationId&&key(list([read.presence,read.value??false]))!==key(list([base.read(read.path).presence,base.read(read.path).value??false])))fail('GA trace direct read differs from B0');
  }
  const sources=new Map<string,TypedIdentifierValue>();
  function visit(value:CanonicalValue):void{if(typeof value==='boolean')return;if(value.kind==='typedIdentifier'){if(value.namespaceId>=1100n)sources.set(key(value),value);return;}if(value.kind==='record')for(const v of value.fields.values())visit(v);else if(value.kind==='list'||value.kind==='set')value.items.forEach(visit);else if(value.kind==='map')for(const [k,v] of value.entries){visit(k);visit(v);}}
  visit(event.payload);
  const protocol=facts.protocolPatch??{operations:[]},runtime=model.state.applyProtocolPatch(after,protocol);
  const invariantResults=protocol.operations.length?[list([text('formation-governance-component/0.1-candidate'),statePatchValue(protocol),list(runtime.diffs.map(mutationDiffValue))])]:[];
  const value=traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity,runIdentity,event,seamId:seam,seamVersion:version,recordKind:event.eventTypeId,
   subjectIds:stage==='world'?[]:[who.observer,who.character],sourceRecordIds:[...sources.values()],registeredReadDomain:domain,actualReadRecords:reads,
   inputProjection:event.payload,outputProjection:list(outputs),randomDrawRecords:[],quantizationOperations:[],statePatch:patch,structuralMutationDiffs:diffs,emittedEvents:children,invariantResults});
  return decode(enc(value),generalBindingContext());
 }
 return Object.freeze({render,validate(facts:GeneralTraceFacts,value:CanonicalValue){if(key(render(facts))!==key(value))fail('GA trace differs from actual completed transition');}});
}
