import {it,expect,vi} from 'vitest';
import {canonicalEncode,list,set,map,signed,unsigned,typedIdentifier,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,actualReadRecordValue,mutationDiffValue,statePathValue} from '../substrate/state';
import * as stateModule from '../substrate/state';
import {compileBoundedModelDeclarations,compileCampaign2Registry} from '../campaign2/modelPackaging';
import {firstModelCandidate,candidateId} from '../campaign2/firstModelCandidate';
import {compileOrderedInputProfile,beginAuthoredSourceInstant,AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {compileAdaptationEvaluator,adaptationExecutionDiffs} from '../campaign2/adaptationEvaluation';
import {campaign2Record as r,decodeCampaign2} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
async function batchFixture(count:bigint,initial=new AuthoritativeState([]),modelSource=firstModelCandidate()){
  const m=await compileBoundedModelDeclarations(modelSource);
  const manifest=canonicalEncode(list([
    r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)}),
    r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:candidateId(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(count)}),
  ].map(fact=>list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:fact}),list([])]))));
  const inputs=await compileOrderedInputProfile(m.profiles.orderedInput,m.compiled.content,m.domains).create(manifest,canonicalEncode(initial.canonicalValue()),m.modelIdentity,new Uint8Array(32));
  const source=beginAuthoredSourceInstant(inputs,2n),ingress=beginTransitionIngressV04(m.admission,2n);
  let runtime=0n,eventId=2n,eventSequence=2n;const allocator={allocateRuntimeId:()=>runtime++};
  const tokens=inputs.initialEvents.flatMap(event=>{
    const output=source.execute(event,allocator),plan=ingress.observeAuthoredSource(event,canonicalEncode(output));
    const children=plan.emissions().map(e=>({...e,eventId:eventId++,eventSequence:eventSequence++,causalParentEventIds:[event.eventId]}));
    plan.bindAllocatedChildren(children);return children.map(child=>ingress.admit(child));
  });
  const evaluator=compileAdaptationEvaluator(m.adaptation,m.domains,m.compiled.stateModel);
  return {initial,allocator,tokens,ingress,source,content:m.compiled.content,stateModel:m.compiled.stateModel,batch:evaluator.prepare(tokens,2n).begin(initial)};
}
it('ADAPT mutation evidence comes from the successful common-snapshot WRT barrier and is isolated',async()=>{
  const c=await batchFixture(2n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
  for(const e of executions){
    expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);
    expect(e.actualReadRecords.map(actualReadRecordValue)).toEqual(e.actualReads);
    expect(e.actualReadRecords.every(read=>!read.presence)).toBe(true);
  }
  expect(c.initial.entries()).toEqual([]);
  const result=c.batch.finish(),diffs=executions.flatMap(adaptationExecutionDiffs);
  expect(diffs).toHaveLength(5);expect(result.state.entries()).toHaveLength(5);
  for(const diff of diffs){
    expect(diff.oldPresence).toBe(false);expect(diff.oldValue).toBeUndefined();expect(diff.newPresence).toBe(true);
    const matching=result.state.entries().find(e=>canonicalEncode(statePathValue(e.path)).toString()===canonicalEncode(statePathValue(diff.path)).toString());
    expect(matching?.value).toEqual(diff.newValue);
    expect(diff.mutationAuthorityId.namespaceId).toBe(1025n);
  }
  const bytes=canonicalEncode(list(adaptationExecutionDiffs(executions[0]).map(mutationDiffValue)));
  const copied=adaptationExecutionDiffs(executions[0]);Object.assign(copied[0].path,{fieldId:99n});(copied as unknown[]).length=0;
  expect(canonicalEncode(list(adaptationExecutionDiffs(executions[0]).map(mutationDiffValue)))).toEqual(bytes);
  expect(()=>adaptationExecutionDiffs({...executions[0]})).toThrow(/completed/);
  for(const e of executions)c.ingress.completeAdaptation(e).bindAllocatedChildren([]);
  c.ingress.finish();c.source.close();expect(()=>adaptationExecutionDiffs(executions[0])).toThrow();
});
it('a later WRT failure publishes no completed mutation evidence for an earlier staged application',async()=>{
  const c=await batchFixture(2n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
  const apply=stateModule.applyStatePatch,spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementationOnce(apply).mockImplementationOnce(()=>{throw Error('injected later WRT failure');});
  try{
    expect(()=>c.batch.finish()).toThrow(/later WRT/);
    for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);
    expect(c.initial.entries()).toEqual([]);
  }finally{spy.mockRestore();c.ingress.abort();c.source.close();}
});
it('zero-count dispatches retain real prior reads with no patches or invented mutation diffs',async()=>{
  const c=await batchFixture(0n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator)),result=c.batch.finish();
  expect(executions.flatMap(e=>e.actualReadRecords)).toHaveLength(5);
  expect(executions.flatMap(e=>e.patch.operations)).toEqual([]);
  expect(executions.flatMap(adaptationExecutionDiffs)).toEqual([]);
  expect(canonicalEncode(result.state.canonicalValue())).toEqual(canonicalEncode(c.initial.canonicalValue()));
  c.ingress.abort();c.source.close();
});
it.each([false,true])('AD-E4: a role-valid wrong exposure rejects before Set preconditions (stale=%s)',async stale=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
 const operation=executions[0].patch.operations[0];if(operation.kind!=='set')throw Error('expected Set');
 const path={...operation.path,selectors:[{kind:'mapKey' as const,key:r('ToleranceKey',{CharacterId:character,ExposureReferentId:typedIdentifier(1002,typedIdentifier(1122,unsigned(900))),RegulatoryVariableId:candidateId(1029,'variable/fixture-regulation')})}]};
 Object.assign(operation,{path,...(stale?{expected:{presence:true,value:operation.newValue}}:{})});
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'ADAPTATION_TARGET_PATH_VIOLATION'}));expect(c.initial.entries()).toEqual([]);for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);}
 finally{c.ingress.abort();c.source.close();}
});
it.each(['shape','role','authority','leaf'])('ADAPT B preserves the accepted prefix before the exact target check: %s',async mode=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator)),op=executions[0].patch.operations[0];
 const first=op.path.selectors[0];if(first.kind!=='mapKey')throw Error('key');
 let path=op.path,code='ADAPTATION_TARGET_PATH_VIOLATION';
 if(mode==='shape'){path={...path,fieldId:2n};code='INVALID_PATH';}
 if(mode==='role'){path={...path,selectors:[{kind:'mapKey',key:r('ToleranceKey',{CharacterId:candidateId(1000,'observer/wrong'),ExposureReferentId:character,RegulatoryVariableId:candidateId(1029,'variable/fixture-regulation')})}]};code='CANONICAL_ROLE_VIOLATION';}
 if(mode==='authority'){path=executions[1].patch.operations[0].path;code='NON_OWNING_AUTHORITY';}
 if(mode==='leaf')path={...path,fieldId:2n,selectors:[{kind:'mapKey',key:r('SensitizationKey',{CharacterId:character,ExposureReferentId:typedIdentifier(1002,typedIdentifier(1122,unsigned(901))),RegulatoryVariableId:candidateId(1029,'variable/fixture-regulation')})}]};
 Object.assign(op,{path});
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code}));expect(c.initial.entries()).toEqual([]);for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);}
 finally{c.ingress.abort();c.source.close();}
});
it('ADAPT B rejects WRT diff substitution before publishing completed execution evidence',async()=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator)),apply=stateModule.applyStatePatch;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>({...apply(...args),diffs:[]}));
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'ADAPTATION_MUTATION_DIFF_VIOLATION'}));for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);expect(c.initial.entries()).toEqual([]);}
 finally{spy.mockRestore();c.ingress.abort();c.source.close();}
});
it.each([[0,1,3,1029],[0,2,3,1029],[0,3,2,1029],[0,4,2,1033],[1,1,2,1034]])('AD-E4 exact key operand: execution %i leaf %i field %i namespace %i',async(execution,leaf,field,namespace)=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
 const op=executions[execution].patch.operations.find(o=>o.path.fieldId===BigInt(leaf))!;
 const selector=op.path.selectors[0];if(selector.kind!=='mapKey'||typeof selector.key==='boolean'||selector.key.kind!=='record')throw Error('record key');
 const changed=record(selector.key.schema,new Map([...selector.key.fields,[BigInt(field),candidateId(namespace,'wrong-domain/control')]]));
 Object.assign(op,{path:{...op.path,selectors:[{kind:'mapKey',key:changed}]}});
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'ADAPTATION_TARGET_PATH_VIOLATION'}));for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);}
 finally{c.ingress.abort();c.source.close();}
});
it.each([0,1])('ADAPT B does not turn a resolved no-change target into permission for an extra Set (value=%i)',async magnitude=>{
 const c=await batchFixture(0n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
 const path={rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:candidateId(1029,'variable/fixture-regulation')})}]};
 Object.assign(executions[0].patch,{operations:[{kind:'set',path,expected:{presence:false},newValue:r('ToleranceValue',{Magnitude:unsigned(magnitude)})}]});
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'ADAPTATION_MUTATION_DIFF_VIOLATION'}));for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);}
 finally{c.ingress.abort();c.source.close();}
});
it.each(['wrong-remove','absent-remove','equal-set','wrong-equal-set'])('AD-E8 operation precedence: %s',async mode=>{
 const path=(other=false)=>({rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:r('ToleranceKey',{CharacterId:character,ExposureReferentId:other?typedIdentifier(1002,typedIdentifier(1122,unsigned(902))):character,RegulatoryVariableId:candidateId(1029,'variable/fixture-regulation')})}]});
 const value=r('ToleranceValue',{Magnitude:unsigned(1)}),equal=mode.includes('equal');
 const initial=new AuthoritativeState(equal?[{path:path(),value},{path:path(true),value}]:[]),before=canonicalEncode(initial.canonicalValue());
 const c=await batchFixture(1n,initial),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
 const operation=executions[0].patch.operations.find(o=>o.path.fieldId===1n)!;
 const wrong=mode.startsWith('wrong');
 if(equal){
  // Establish the ordinary-WRT control explicitly: unchanged-value Set is legal
  // there and creates a structural diff; ADAPT must reject the wrong effective result.
  const noOp={kind:'set' as const,path:path(wrong),expected:{presence:true as const,value},newValue:value};
  const global=c.stateModel.applyPatch(initial,{operations:[noOp]},candidateId(1025,'authority/regulatory-adaptation'));
  expect(canonicalEncode(global.state.canonicalValue())).toEqual(before);expect(global.diffs).toHaveLength(1);
  Object.assign(operation,noOp);
 }else Object.assign(operation,{kind:'remove',path:path(wrong),expectedOldValue:value});
 const code=wrong?'ADAPTATION_TARGET_PATH_VIOLATION':equal?'ADAPTATION_MUTATION_DIFF_VIOLATION':'STALE_PRECONDITION';
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code}));expect(canonicalEncode(initial.canonicalValue())).toEqual(before);for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);}
 finally{c.ingress.abort();c.source.close();}
});
it('AD-E4 generic scope: alternate qualified subject passes roles; bounded profile retains one-character exclusion',async()=>{
 const model=firstModelCandidate(),stable=governedContentDefinitionId('character/alternate-control'),other=semanticReferentFromAuthoredContent(stable);
 const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields,[n,x]]));};
 const definitions=items(decodeCampaign2(model.content),'set');model.content=canonicalEncode(set([...definitions,replace(definitions[0],1n,stable)]));
 const slots=[...items(decodeCampaign2(model.registry),'list')];
 slots[0]=set(items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n||key(f(v,1n))!==key(candidateId(1029,'variable/fixture-regulation')))return v;
  const registration=rec(f(v,4n),283n),reference=rec(f(registration,2n),282n),anchors=f(reference,1n);if(typeof anchors==='boolean'||anchors.kind!=='map')throw Error('anchors');
  return replace(v,4n,replace(registration,2n,replace(reference,1n,map([...anchors.entries,[r('RegulatoryCharacterReferenceKey',{CharacterId:other}),anchors.entries[0][1]]]))));
 }));model.registry=canonicalEncode(list(slots));
 // Same admitted character kind, exact REG coverage, separately committed model
 // control. No second-kind validator, roster or frozen packet changes.
 await expect(compileBoundedModelDeclarations(model)).rejects.toThrow(/bounded specimen requires one character/);
 const generic=await compileCampaign2Registry(model.registrySchemaVersion,model.registry,model.content);generic.content.qualifyCharacter(other);
 const c=await batchFixture(1n);
 const executions=c.tokens.map(t=>c.batch.execute(t,c.allocator)),op=executions[0].patch.operations.find(o=>o.path.fieldId===1n)!;
 const selector=op.path.selectors[0];if(selector.kind!=='mapKey')throw Error('key');
 const path={...op.path,selectors:[{kind:'mapKey' as const,key:replace(selector.key,1n,other)}]};
 expect(()=>generic.stateModel.validatePath(path)).not.toThrow();
 const proposed={...op,path};
 expect(()=>generic.stateModel.applyPatch(c.initial,{operations:[proposed]},executions[0].authority)).not.toThrow();
 try{expect(()=>generic.stateModel.applyPatch(c.initial,{operations:[proposed]},executions[0].authority,{writableRoots:[302n],targetPaths:[op.path]})).toThrowError(expect.objectContaining({code:'ADAPTATION_TARGET_PATH_VIOLATION'}));for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);}
 finally{c.ingress.abort();c.source.close();}
});
it('ADAPT B scope interpreter control: legal broad-authority write fails a narrower root set before target/preconditions',async()=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator)),execution=executions[0],op=execution.patch.operations.find(o=>o.path.fieldId===1n)!;
 try{
  const patch={operations:[op]};
  expect(()=>c.stateModel.applyPatch(c.initial,patch,execution.authority)).not.toThrow();
  expect(()=>c.stateModel.applyPatch(c.initial,patch,execution.authority,{writableRoots:[302n],targetPaths:[op.path]})).not.toThrow();
  // Counterfactual internal scope input ONLY. The accepted production capability
  // compiler cannot derive this authority/root pairing; see reachability review.
  const stale={...op,expected:{presence:true,value:r('ToleranceValue',{Magnitude:unsigned(1)})}};
  for(const candidate of [op,stale])expect(()=>c.stateModel.applyPatch(c.initial,{operations:[candidate]},execution.authority,{writableRoots:[303n],targetPaths:[]})).toThrowError(expect.objectContaining({code:'TRANSITION_WRITE_SCOPE_VIOLATION'}));
 }finally{c.ingress.abort();c.source.close();}
});
it('ADAPT staged outputs reject swapped rule-target associations while the aggregate patch stays unchanged',async()=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator)),execution=executions[0];
 const indexes=[1n,2n].map(leaf=>execution.outputs.findIndex(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===325n&&key(f(rec(f(v,4n),140n),2n))===key(unsigned(leaf))));
 expect(indexes.every(i=>i>=0)).toBe(true);
 const [a,b]=indexes.map(i=>rec(execution.outputs[i],325n)),before=canonicalEncode(stateModule.statePatchValue(execution.patch));
 execution.outputs[indexes[0]]=record(a.schema,new Map([...a.fields,[4n,f(b,4n)]]));
 execution.outputs[indexes[1]]=record(b.schema,new Map([...b.fields,[4n,f(a,4n)]]));
 expect(canonicalEncode(stateModule.statePatchValue(execution.patch))).toEqual(before);
 try{expect(()=>c.batch.finish()).toThrowError(expect.objectContaining({code:'TRANSITION_OUTPUT_VIOLATION'}));for(const e of executions)expect(()=>adaptationExecutionDiffs(e)).toThrow(/completed/);expect(c.initial.entries()).toEqual([]);}
 finally{c.ingress.abort();c.source.close();}
});
it('AD-E4/E8 independent fixture oracle binds each committed RuleId to its exact target before publication',async()=>{
 const c=await batchFixture(1n),executions=c.tokens.map(t=>c.batch.execute(t,c.allocator));
 const V=candidateId(1029,'variable/fixture-regulation');
 const oracle=[
  ['tolerance',302n,1n,r('ToleranceKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:V})],
  ['sensitization',302n,2n,r('SensitizationKey',{CharacterId:character,ExposureReferentId:character,RegulatoryVariableId:V})],
  ['regulatory-displacement',302n,3n,r('RegulatoryAdaptationKey',{CharacterId:character,RegulatoryVariableId:V})],
  ['accumulated-load',302n,4n,r('AccumulatedLoadKey',{CharacterId:character,LoadDomainId:candidateId(1033,'load/fixture-load')})],
  ['procedural-competence',303n,1n,r('ProceduralCompetenceKey',{CharacterId:character,ProcedureId:candidateId(1034,'procedure/fixture-practice')})],
 ] as const;
 try{
  const evaluations=executions.flatMap(e=>e.outputs.slice(1)).map(v=>rec(v,325n));expect(evaluations).toHaveLength(5);
  for(const [name,rootStateTypeId,fieldId,targetKey] of oracle){
   const matching=evaluations.filter(e=>key(f(e,3n))===key(candidateId(1035,`rule/fixture-${name}`)));expect(matching).toHaveLength(1);
   expect(f(matching[0],4n)).toEqual(statePathValue({rootStateTypeId,fieldId,selectors:[{kind:'mapKey',key:targetKey}]}));
  }
  // Expected associations are authored above, never queried from the resolver
  // under test. Equal count/Step cannot hide swapping two rule labels.
  expect(c.batch.finish().state.entries()).toHaveLength(5);
 }finally{c.ingress.abort();c.source.close();}
});
