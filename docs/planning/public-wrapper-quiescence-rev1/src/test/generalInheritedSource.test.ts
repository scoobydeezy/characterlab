import {it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalId as id,generalSubject,generalDefinitionId as d,generalContentId as c,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {AuthoritativeState} from '../substrate/state';
import {list,typedIdentifier,unsigned as u} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
it('executes the actual inherited probe with the committed GA displacement and completes its experience reservation',async()=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),probe=model.inheritedSource.execution,engine=probe.begin(1n),state=new AuthoritativeState(model.inheritedSource.initialEntries());
 let ordinal=1n;const allocateRuntimeId=()=>ordinal++,queue:ScheduledEvent[]=[{eventId:0n,eventSequence:0n,dueAt:simInstant(1n),phase:110n,eventTypeId:id(1001,'event/regulatory-diagnostic-probe'),payload:r(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]}],outputs=[];
 while(queue.length){const event=queue.shift()!,result=engine.execute(event,state,{allocateRuntimeId});outputs.push(...result.outputs);const children=result.plan.emissions().map(emission=>{const n=allocateRuntimeId();return {...emission,eventId:n,eventSequence:n,causalParentEventIds:[event.eventId]};});result.plan.bindAllocatedChildren(children);queue.push(...children);}
 engine.finish();engine.abort();
 expect(outputs.map(v=>rec(v,(v as ReturnType<typeof rec>).schema.typeId).schema.typeId)).toEqual([334n,203n,227n]);
 expect(f(rec(outputs[0],334n),4n)).toEqual({kind:'signed',value:0n});
 expect(f(rec(f(rec(outputs[1],203n),6n),204n),2n)).toEqual({kind:'rational',numerator:0n,denominator:1n});
});
it.each([['baseline',0n],['source-zero-concern',5n],['source-above-target',10n],['source-denied-probe',undefined]] as const)('joins actual probe, carriage, M1 and prediction to terminal concern for %s',async(recipe,point)=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe)),who=generalSubject(),probe=model.inheritedSource.execution,engine=model.inheritedSource.begin(1n);
 let state=new AuthoritativeState([...model.inheritedSource.initialEntries(),{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]},value:r(267,[who.character])},{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))])}]},value:r(372,[u(1)])}]),ordinal=1n;
 const allocateRuntimeId=()=>ordinal++,queue:ScheduledEvent[]=[{eventId:0n,eventSequence:0n,dueAt:simInstant(1n),phase:110n,eventTypeId:id(1001,'event/regulatory-diagnostic-probe'),payload:r(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]}];let observed:object|undefined;
 while(queue.length){const event=queue.shift()!,result=engine.execute(event,state,{allocateRuntimeId});if(result.outputs.some(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===203n))observed=result;const children=result.plan.emissions().map(emission=>{const n=allocateRuntimeId();return {...emission,eventId:n,eventSequence:n,causalParentEventIds:[event.eventId]};});result.plan.bindAllocatedChildren(children);queue.push(...children);}
 if(observed){
  expect(()=>engine.intake({},typedIdentifier(1124,u(allocateRuntimeId())))).toThrow(/actual probe/);
  const carriage=engine.intake(observed,typedIdentifier(1124,u(allocateRuntimeId()))),evidence=engine.evidence(carriage,typedIdentifier(1125,u(allocateRuntimeId()))),application=engine.prediction(evidence,state);
  expect(application.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n,362n]);state=model.state.applyPredictionPatch(state,application.patch()).state;
  expect(f(rec(state.entries().find(e=>e.path.rootStateTypeId===362n)!.value,361n),1n)).toEqual({kind:'rational',numerator:point,denominator:1n});
  expect(()=>engine.prediction(evidence,state)).toThrow(/actual M1/);
 }else expect(point).toBeUndefined();
 engine.finish();engine.close();
 const tx=model.outputSlots.beginInstant(allocateRuntimeId),workspace=tx.beginStage('prior-concern-workspace'),w=model.workspace.construct(state,r(377,[who.observer,d('workspace')]),workspace.allocate(1128n),2n),wr=workspace.admit([decode(w.outputBytes(),generalBindingContext())]);
 const appraisal=tx.beginStage('prior-concern-appraisal'),a=appraisal.admit([model.concern.appraisal(tx,wr,appraisal.allocate(1129n))]),producer=tx.beginStage('prior-concern-producer'),p=producer.admit([model.concern.concern(tx,a,producer.allocate(1130n))]);
 const carry=model.concern.prepareDelivery(tx,p,2n).carry();expect(carry.kind).toBe('Concern');if(carry.kind==='Concern')expect(uint(f(rec(carry.response,386n),1n))).toBe(point===undefined?1n:2n);tx.commit();
});
