import {beforeAll,it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalSubject,generalId as id,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {canonicalEncode as enc,list,set,map,signed,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {produceGeneralBindings,freezeGeneralExperience} from '../campaign3/generalSemanticProduction';
import {deriveGeneralSourceRoles} from '../campaign3/generalSourceRoles';
import {causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
const who=generalSubject(),context=generalBindingContext();
const path=(root:bigint,k:CanonicalValue=who.observer,field=1n):StatePath=>({rootStateTypeId:root,fieldId:field,selectors:[{kind:'mapKey',key:k}]});
let model:Awaited<ReturnType<typeof compileGeneralDeclarations>>;
// This fixture specifically witnesses pruning under spatial peripheral allocation.
beforeAll(async()=>{model=await compileGeneralDeclarations(buildGeneralDeclarationPacket('allocation-spatial'));});
function initial(){return new AuthoritativeState([{path:path(268n),value:r(267,[who.character])},{path:path(630n,who.character),value:r(555,[list([])])},{path:path(631n,who.character),value:r(625,[list([]),list([]),signed(0)])},{path:path(632n,who.character),value:r(595,[list([])])},{path:{rootStateTypeId:581n,fieldId:1n,selectors:[]},value:r(580,[map([]),map([])])},{path:path(634n),value:r(627,new Map<bigint,CanonicalValue>([[1n,signed(0)],[3n,list([])]]))},{path:path(635n),value:r(629,[signed(0)])},...['A','B','C'].map((n,i)=>({path:path(649n,r(644,[who.character,id(1044,'local-reserve/'+n)])),value:r(454,[q(40+i*20,1),signed(0)])}))]);}
const originals=()=>items(decode(model.source.originalBytes(),context),'list');
it('runs four real world/sample/track/bind/freeze/role sweeps through exact slots and state owners',()=>{
 let state=initial(),ordinal=0n;const acquisitions:bigint[][]=[];
 for(const original of originals().slice(0,4)){
  const tx=model.outputSlots.beginInstant(()=>ordinal++),world=model.sensing.materialize(original,tx),sample=world.sample(state),samples=decode(sample.samplesBytes(),context);
  const tracking=model.tracking.prepare(state,'current-track',samples),stage=tx.beginStage('current-track');stage.admit(tracking.outputs());
  state=model.state.applyStagePatch('current-track',state,tracking.patch()).state;
  const binding=tx.beginStage('current-bind'),bound=produceGeneralBindings(samples,tracking.result(),()=>uint(binding.allocate(1103n).payload));binding.admit(bound.outputs());
  tx.beginStage('current-classify').admit([]);
  const freeze=tx.beginStage('current-freeze',sample.receipt),experience=freezeGeneralExperience(samples,tracking.result(),bound.bindings(),sample.reservation())!;freeze.admit([experience.output()]);
  const roles=tx.beginStage('current-roles'),claims=deriveGeneralSourceRoles(experience.staged().experience,()=>uint(roles.allocate(1111n).payload));roles.admit(claims.map(causalRoleEvidenceValue));
  const source={samples,tracking:tracking.result(),staged:experience.staged(),claims};
  model.accessorBinding('current-visual-selection').construct(state,who.observer,source.staged.experience.occurredAt);
  const visualSelection=tx.beginStage('current-visual-selection'),visual=model.selection.visual(source,()=>uint(visualSelection.allocate(1143n).payload)),visualSelected=visualSelection.admit(visual.outputs());
  tx.beginStage('current-visual-encoding').admit(visual.encode());
  const visualFormation=tx.beginStage('visual-acquisition-evidence'),visualEvidence=visual.form(()=>uint(visualFormation.allocate(1145n).payload)),visualFormed=visualFormation.admit(visualEvidence);expect(visualEvidence).toHaveLength(1);
  model.accessorBinding('current-body-selection').construct(state,who.observer,source.staged.experience.occurredAt);
  const bodySelection=tx.beginStage('current-body-selection'),body=model.selection.body(source,()=>uint(bodySelection.allocate(1143n).payload)),bodySelected=bodySelection.admit(body.outputs());
  const bodyFormation=tx.beginStage('body-acquisition-evidence'),bodyEvidence=body.form(()=>uint(bodyFormation.allocate(1145n).payload)),bodyFormed=bodyFormation.admit(bodyEvidence);expect(bodyEvidence).toHaveLength(1);
  const owner=tx.beginStage('ordinary-memory-formation'),memory=model.memory.settleFormation(state,tx,[visualSelected,bodySelected],[visualFormed,bodyFormed],source.staged.experience.occurredAt);
  state=model.state.applyStagePatch('ordinary-memory-formation',state,memory.memoryPatch()).state;
  state=model.state.applyProtocolPatch(state,memory.protocolPatch()).state;owner.admit([]);
  const associationStage=tx.beginStage('event-association-formation'),association=model.graphOwners.association(state,tx,visualFormed,source.staged.experience.occurredAt);
  state=model.state.applyStagePatch('event-association-formation',state,association.patch()).state;associationStage.admit([]);
  const presentationStage=tx.beginStage('event-presentation-owner'),presentation=model.graphOwners.presentations(state,tx,memory,[],source.staged.experience.occurredAt);
  state=model.state.applyStagePatch('event-presentation-owner',state,presentation.patch()).state;presentationStage.admit([]);
  expect(()=>model.graphOwners.presentations(state,tx,{},[],source.staged.experience.occurredAt)).toThrow(/actual memory/);
  expect(memory.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n,630n]);
  expect(()=>visual.form(()=>0n)).toThrow(/lifecycle/);expect(()=>body.form(()=>0n)).toThrow(/lifecycle/);tx.commit();
  expect(bound.bindings()).toHaveLength(3);expect(claims).toHaveLength(3);expect(experience.staged().experience.supportingObservationIds).toHaveLength(5);
  acquisitions.push(tracking.result().tracks.map(t=>t.perceptualReferentId.observerTrackSequence));
  // The authoritative GA windows survive a canonical save/restore round trip.
  state=model.state.restoreState(enc(state.canonicalValue()));
 }
 expect(acquisitions).toEqual([[0n,1n,2n],[0n,1n,2n],[0n,1n,2n],[0n,1n,2n]]);
 expect(state.read(path(241n)).value).toEqual(u(3));expect(state.read(path(242n)).value).toEqual(u(1));
 expect(state.entries().filter(e=>e.path.rootStateTypeId===242n&&e.path.fieldId===2n)).toHaveLength(0);
 expect(rec(state.read(path(635n)).value!,629n).fields.has(2n)).toBe(false);
 expect(items(f(rec(state.read(path(630n,who.character)).value!,555n),1n),'list')).toHaveLength(7);
 // The weak third association quantizes to zero at scale100 and is pruned;
 // its positive episodic child remains available to direct cue matching.
 expect(items(f(rec(state.read(path(631n,who.character)).value!,625n),1n),'list')).toHaveLength(2);
 expect(items(f(rec(state.read(path(632n,who.character)).value!,595n),1n),'list')).toHaveLength(3);
 for(const original of originals().slice(4)){
  const tx=model.outputSlots.beginInstant(()=>ordinal++),sample=model.sensing.materialize(original,tx).sample(state),samples=decode(sample.samplesBytes(),context);
  const tracking=model.tracking.prepare(state,'current-track',samples);tx.beginStage('current-track').admit(tracking.outputs());state=model.state.applyStagePatch('current-track',state,tracking.patch()).state;
  const binding=tx.beginStage('current-bind'),bound=produceGeneralBindings(samples,tracking.result(),()=>uint(binding.allocate(1103n).payload));binding.admit(bound.outputs());tx.beginStage('current-classify').admit([]);
  const freeze=tx.beginStage('current-freeze',sample.receipt),experience=freezeGeneralExperience(samples,tracking.result(),bound.bindings(),sample.reservation())!;freeze.admit([experience.output()]);
  const source={samples,tracking:tracking.result(),staged:experience.staged(),claims:[]},now=experience.staged().experience.occurredAt,cues=model.recall.cues(source);
  tx.beginStage('current-visual-cue').admit([cues.event]);tx.beginStage('current-body-cue').admit([cues.body]);
  const eventRank=model.recall.event(state,cues.event,now),bodyRank=model.recall.body(state,cues.body,now);
  tx.beginStage('current-event-rank').admit([eventRank.result()]);tx.beginStage('current-body-rank').admit([bodyRank.result()]);
  const eventPublisher=tx.beginStage('current-recollection'),events=eventRank.publish(()=>uint(eventPublisher.allocate(1148n).payload)),eventReceipt=eventPublisher.admit(events);
  const bodyPublisher=tx.beginStage('current-recollection'),bodies=bodyRank.publish(()=>uint(bodyPublisher.allocate(1148n).payload)),bodyReceipt=bodyPublisher.admit(bodies);
  expect(events).toHaveLength(2);expect(bodies).toHaveLength(2);expect(()=>eventRank.publish(()=>0n)).toThrow(/VIEW/);
  expect(eventRank.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n,630n,631n,632n]);expect(bodyRank.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n,630n]);
  const presentationStage=tx.beginStage('event-presentation-owner'),presentation=model.graphOwners.presentations(state,tx,undefined,[eventReceipt,bodyReceipt],now);state=model.state.applyStagePatch('event-presentation-owner',state,presentation.patch()).state;presentationStage.admit([]);
  expect(presentation.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n,632n]);
  tx.commit();state=model.state.restoreState(enc(state.canonicalValue()));
 }
 const history=items(f(rec(state.read(path(632n,who.character)).value!,595n),1n),'list');
 expect(history.flatMap(v=>items(f(rec(v,594n),2n),'list')).filter(v=>(v as {value:bigint}).value>=7n)).toHaveLength(8);
});
it('enrolls actual zero-formation selection without an ordinary-memory owner or read',async()=>{
 const zero=await compileGeneralDeclarations(buildGeneralDeclarationPacket('select-k0'));let ordinal=0n,state=zero.initial.build();
 const tx=zero.outputSlots.beginInstant(()=>ordinal++),original=items(decode(zero.source.originalBytes(),context),'list')[0],sample=zero.sensing.materialize(original,tx).sample(state),samples=decode(sample.samplesBytes(),context);
 const tracking=zero.tracking.prepare(state,'current-track',samples);tx.beginStage('current-track').admit(tracking.outputs());state=zero.state.applyStagePatch('current-track',state,tracking.patch()).state;
 const bind=tx.beginStage('current-bind'),bound=produceGeneralBindings(samples,tracking.result(),()=>uint(bind.allocate(1103n).payload));bind.admit(bound.outputs());tx.beginStage('current-classify').admit([]);
 const freeze=tx.beginStage('current-freeze',sample.receipt),experience=freezeGeneralExperience(samples,tracking.result(),bound.bindings(),sample.reservation())!;freeze.admit([experience.output()]);
 const roles=tx.beginStage('current-roles'),claims=deriveGeneralSourceRoles(experience.staged().experience,()=>uint(roles.allocate(1111n).payload));roles.admit(claims.map(causalRoleEvidenceValue));
 const selection=tx.beginStage('current-visual-selection'),visual=zero.selection.visual({samples,tracking:tracking.result(),staged:experience.staged(),claims},()=>uint(selection.allocate(1143n).payload)),receipt=selection.admit(visual.outputs());
 tx.beginStage('current-visual-encoding').admit(visual.encode());const formed=visual.form(()=>{throw Error('zero formation must not allocate');});expect(formed).toEqual([]);
 const before=state.entries().filter(e=>e.path.rootStateTypeId!==581n),enrollment=zero.memory.enrollSources(state,tx,[receipt],3n);
 expect(enrollment.protocolRead().path.rootStateTypeId).toBe(581n);state=zero.state.applyProtocolPatch(state,enrollment.protocolPatch()).state;
 expect(state.entries().filter(e=>e.path.rootStateTypeId!==581n)).toEqual(before);
 const protocol=rec(state.read({rootStateTypeId:581n,fieldId:1n,selectors:[]}).value!,580n);expect((f(protocol,1n) as Extract<CanonicalValue,{kind:'map'}>).entries).toHaveLength(1);expect((f(protocol,2n) as Extract<CanonicalValue,{kind:'map'}>).entries).toHaveLength(0);
 expect(()=>zero.memory.enrollSources(state,tx,[receipt,receipt],3n)).toThrow(/duplicate/);expect(()=>zero.memory.enrollSources(state,tx,[receipt],4n)).toThrow(/time/);
 visual.close();tx.commit();expect(()=>zero.memory.enrollSources(state,tx,[receipt],3n)).toThrow();
});
it('source handoffs admit only committed originals and can be sampled once',()=>{
 let ordinal=0n;const tx=model.outputSlots.beginInstant(()=>ordinal++),original=rec(originals()[0],665n),wrong=new Map(original.fields);wrong.set(1n,signed(99));
 expect(()=>model.sensing.materialize(r(665,wrong),tx)).toThrow(/uncommitted/);
 const handoff=model.sensing.materialize(original,tx);handoff.sample(initial());expect(()=>handoff.sample(initial())).toThrow(/already/);tx.abort();
});
it('unavailable recall reads only the roster and publishes no occurrences',()=>{
 const state=new AuthoritativeState([{path:path(268n),value:r(267,[who.character])}]);
 const event=r(623,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,typedIdentifier(1115,u(0))],[3n,signed(7)],[5n,u(2)]])),body=r(606,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(7)],[4n,u(2)],[5n,set([])],[6n,set([])]]));
 for(const rank of [model.recall.event(state,event,7n),model.recall.body(state,body,7n)]){
  expect(rank.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n]);expect(rank.publish(()=>{throw Error('unavailable allocation');})).toEqual([]);
 }
});
it('missing physical state cannot produce partial source outputs or allocate body observations',()=>{
 let ordinal=0n;const tx=model.outputSlots.beginInstant(()=>ordinal++),world=model.sensing.materialize(originals()[0],tx),afterWorld=ordinal;
 expect(()=>world.sample(new AuthoritativeState([]))).toThrow(/roster/);expect(ordinal).toBe(afterWorld);tx.abort();
});
it('read-only, cross-owner and protocol writes reject without changing authoritative state',()=>{
 const state=initial(),before=enc(state.canonicalValue()),window=state.read(path(634n)).value!;
 const patch:StatePatch={operations:[{kind:'set',path:path(634n),expected:{presence:true,value:window},newValue:r(627,new Map<bigint,CanonicalValue>([[1n,signed(1)],[3n,list([])]]))}]};
 expect(()=>model.state.applyStagePatch('current-body-rank',state,patch)).toThrow(/read-only/);
 expect(()=>model.state.applyStagePatch('ordinary-memory-formation',state,patch)).toThrow(/outside/);
 expect(()=>model.state.applyProtocolPatch(state,patch)).toThrow(/outside/);expect(enc(state.canonicalValue())).toEqual(before);
});
it('SEM counters cannot regress and membership cannot exist outside its allocated prefix',()=>{
 const state=new AuthoritativeState([...initial().entries(),{path:path(241n),value:u(2)}]);
 expect(()=>model.state.applyStagePatch('current-track',state,{operations:[{kind:'set',path:path(241n),expected:{presence:true,value:u(2)},newValue:u(1)}]})).toThrow(/regression/);
 expect(()=>model.state.validateState(new AuthoritativeState([...state.entries(),{path:path(241n,r(212,[who.observer,u(2)]),2n),value:true}]))).toThrow(/prefix/);
});
it('stale tracking patches reject atomically after an intervening state change',()=>{
 let ordinal=0n;const tx=model.outputSlots.beginInstant(()=>ordinal++),state=initial(),sample=model.sensing.materialize(originals()[0],tx).sample(state),tracking=model.tracking.prepare(state,'current-track',decode(sample.samplesBytes(),context));
 const applied=model.state.applyStagePatch('current-track',state,tracking.patch()).state,before=enc(applied.canonicalValue());
 expect(()=>model.state.applyStagePatch('current-track',applied,tracking.patch())).toThrow();expect(enc(applied.canonicalValue())).toEqual(before);tx.abort();
});
it('canonical state envelope admission validates nested GA leaf grammar',()=>{
 const state=initial(),restored=model.state.restoreState(enc(state.canonicalValue()));expect(enc(restored.canonicalValue())).toEqual(enc(state.canonicalValue()));
 const invalid=new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===634n?{...e,value:r(627,new Map<bigint,CanonicalValue>([[1n,signed(-1)],[3n,list([])]]))}:e));expect(()=>model.state.restoreState(enc(invalid.canonicalValue()))).toThrow();
});
