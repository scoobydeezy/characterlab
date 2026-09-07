import {it,expect,vi} from 'vitest';
import {canonicalEncode,list,signed,unsigned} from '../substrate/canonicalEncoding';
import {AuthoritativeState,actualReadRecordValue,mutationDiffValue,statePathValue} from '../substrate/state';
import * as stateModule from '../substrate/state';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {firstModelCandidate,candidateId} from '../campaign2/firstModelCandidate';
import {compileOrderedInputProfile,beginAuthoredSourceInstant,AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';
import {compileAdaptationEvaluator,adaptationExecutionDiffs} from '../campaign2/adaptationEvaluation';
import {campaign2Record as r} from '../campaign2/codecs';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
async function batchFixture(count:bigint){
  const m=await compileBoundedModelDeclarations(firstModelCandidate()),initial=new AuthoritativeState([]);
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
  return {initial,allocator,tokens,ingress,source,stateModel:m.compiled.stateModel,batch:evaluator.prepare(tokens,2n).begin(initial)};
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
