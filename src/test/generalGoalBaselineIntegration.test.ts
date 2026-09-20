import {it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalId as id,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {produceGeneralBindings,freezeGeneralExperience} from '../campaign3/generalSemanticProduction';
import {createTrialPanelSource,observeTrialPanel} from '../campaign3/trialPanelSource';
import {admitObservationLane} from '../semanticBinding/phaseOrdering';
import {admitLocalReserveSignalCue} from '../campaign3/bodySignalCue';
import {list,set,signed,text,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataText as txt} from '../campaign2/canonicalData';
it('qualifies an actual consequence against one retained Before view and preserves the frozen qualification later',async()=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),run=createGeneralSourceRuntime(model),who=generalSubject(),context=generalBindingContext();
 for(let i=0;i<3;i++)await run.settleNextInstant();const snapshot=run.snapshot();let state=snapshot.state,ordinal=snapshot.allocators.nextRuntimeId;
 // This is a separate bounded component fixture extending the actual retained
 // prefix. Its extra goal/After calendar is not claimed as a public cohort run.
 const adopt=model.goals.command(model.initial.build(),r(677,[who.observer,r(561,[d('goal'),u(1)])]),1n);state=model.state.applyStagePatch('goal-command-owner',state,adopt.patch()).state;
 const tx=model.outputSlots.beginInstant(()=>ordinal++),replenishment=model.physical.replenish(state,r(651,[r(644,[who.character,id(1044,'local-reserve/A')]),q(14,1)]),4n);tx.beginStage('local-reserve-replenishment').admit(replenishment.outputs());state=model.state.applyStagePatch('local-reserve-replenishment',state,replenishment.patch()).state;
 const sampling=tx.beginStage('consequence-sample'),bodyRequest=r(650,[who.observer,set([id(1005,'channel/A')])]),body=model.physical.sampleBody(state,bodyRequest,4n,()=>uint(sampling.allocate(1115n).payload)),bodyValue=rec(decode(body.bodyBytes()!,context),654n);
 const panel=observeTrialPanel(createTrialPanelSource([{at:4n,glyph:0,stage:'After',visible:true,permitted:true}]),4n);if(panel.kind!=='Present')throw Error('actual panel required');
 const panelValue=r(542,[sampling.allocate(1115n),who.observer,signed(4),u(panel.glyph),u(3),text('trial-panel-source-component/0.1-candidate')]),event=r(215,[who.observer,sampling.allocate(1113n)]),reservation=admitObservationLane({observerId:txt(who.observer.payload),lane:'Consequence',dueAt:4n,emitsCharacterAccessibleEvidence:true},()=>uint(sampling.allocate(1106n).payload)).reservation!;
 const samples=r(656,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(4)],[3n,r(655,[who.observer,bodyRequest,true,false])],[4n,bodyValue],[5n,panelValue],[7n,event],[8n,typedIdentifier(1106,u(reservation.experienceId))]])),sampleReceipt=sampling.admit([samples]);
 const tracking=model.tracking.prepare(state,'consequence-track',samples);tx.beginStage('consequence-track').admit(tracking.outputs());state=model.state.applyStagePatch('consequence-track',state,tracking.patch()).state;
 const binding=tx.beginStage('consequence-bind'),bound=produceGeneralBindings(samples,tracking.result(),()=>uint(binding.allocate(1103n).payload));binding.admit(bound.outputs());tx.beginStage('consequence-classify').admit([]);
 const experience=freezeGeneralExperience(samples,tracking.result(),bound.bindings(),reservation)!;tx.beginStage('consequence-freeze',sampleReceipt).admit([experience.output()]);
 const declarations=items(f(bodyValue,4n),'set').map(v=>{const row=rec(v,598n);return {channel:identity(f(row,1n)),signal:txt(identity(f(row,2n)).payload)};}),cueSource=admitLocalReserveSignalCue({observer:who.observer,at:4n,opportunityId:reservation.experienceId,samples:items(f(bodyValue,3n),'list'),declarations},4n,true);
 if(cueSource.cue.kind!=='Present')throw Error('actual cue required');const cue=r(606,[who.observer,signed(4),typedIdentifier(1106,u(reservation.experienceId)),u(1),set(cueSource.cue.signals.map(s=>id(1045,s))),set(cueSource.provenance.supportingObservationIds)]);tx.beginStage('goal-baseline-cue').admit([cue]);
 const rank=model.recall.body(state,cue,4n,'goal-baseline');tx.beginStage('goal-baseline-rank').admit([rank.result()]);const publish=tx.beginStage('goal-baseline-recollection'),recollections=rank.publish(()=>uint(publish.allocate(1148n).payload)),receipt=publish.admit(recollections);expect(recollections).toHaveLength(1);
 const source={samples,tracking:tracking.result(),staged:experience.staged(),claims:[]},assessment=model.goals.assess(state,tx,source,[receipt],4n),stage=tx.beginStage('goal-outcome-assessment'),result=assessment.produce(()=>uint(stage.allocate(1146n).payload)),resultReceipt=stage.admit(result.outputs),value=rec(result.outputs[0],568n);
 expect(f(value,8n)).toEqual(r(564,[u(2)]));const relation=rec(f(value,7n),563n);expect(f(relation,1n)).toEqual(r(556,[q(0,1),q(0,1)]));expect(f(relation,2n)).toEqual(r(556,[q(10,1),q(11,1)]));
 const delivery=model.outcomeDeliveries.goal(tx,resultReceipt);assessment.close();rank.close();tx.commit();
 const withdrawn=model.goals.command(state,r(677,[who.observer,r(561,[d('goal'),u(2)])]),5n);state=model.state.applyStagePatch('goal-command-owner',state,withdrawn.patch()).state;
 const later=model.outputSlots.beginInstant(()=>ordinal++),qualification=delivery.qualification(u(20),5n);later.beginStage('goal-qualification-delivery').admit([qualification]);expect(f(rec(f(rec(qualification,570n),3n),569n),6n)).toEqual(r(564,[u(2)]));later.commit();
},30000);
