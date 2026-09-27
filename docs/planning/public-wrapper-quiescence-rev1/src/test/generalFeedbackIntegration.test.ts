import {it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalContentId as c,generalId as id,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {produceGeneralBindings,freezeGeneralExperience} from '../campaign3/generalSemanticProduction';
import {deriveGeneralSourceRoles} from '../campaign3/generalSourceRoles';
import {causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {list,set,signed,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
const who=generalSubject(),context=generalBindingContext(),path=(root:bigint,key:CanonicalValue=who.observer):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key}]});
it('joins an actual prior concern delivery to selected-only encoding under each committed feedback switch',async()=>{
 const results:CanonicalValue[][]=[];
 for(const recipe of ['allocation-spatial','feedback-both']){
  const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe));let ordinal=0n;
  // Supplied prediction state isolates the downstream join; the separate inherited
  // source test proves the same point from an actual probe, not a public fixture.
  let state=new AuthoritativeState([{path:path(268n),value:r(267,[who.character])},{path:path(373n,r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))])),value:r(372,[u(1)])},{path:path(362n,r(360,[who.character,d('prediction')])),value:r(361,[q(0,1),set([r(237,[u(1),typedIdentifier(1115,u(999))])])])},{path:path(634n),value:r(627,new Map<bigint,CanonicalValue>([[1n,signed(0)],[3n,list([])]]))},{path:path(635n),value:r(629,[signed(0)])},...['A','B','C'].map(n=>({path:path(649n,r(644,[who.character,id(1044,'local-reserve/'+n)])),value:r(454,[q(40,1),signed(0)])}))]);
  const prior=model.outputSlots.beginInstant(()=>ordinal++),workspace=prior.beginStage('prior-concern-workspace'),w=model.workspace.construct(state,r(377,[who.observer,d('workspace')]),workspace.allocate(1128n),2n),wr=workspace.admit([decode(w.outputBytes(),context)]),appraisal=prior.beginStage('prior-concern-appraisal'),ar=appraisal.admit([model.concern.appraisal(prior,wr,appraisal.allocate(1129n))]),concern=prior.beginStage('prior-concern-producer'),cr=concern.admit([model.concern.concern(prior,ar,concern.allocate(1130n))]),delivery=model.concern.prepareDelivery(prior,cr,2n).delivery(u(0),3n);prior.commit();
  const tx=model.outputSlots.beginInstant(()=>ordinal++),original=items(decode(model.source.originalBytes(),context),'list')[0],sample=model.sensing.materialize(original,tx).sample(state),samples=decode(sample.samplesBytes(),context),tracking=model.tracking.prepare(state,'current-track',samples);tx.beginStage('current-track').admit(tracking.outputs());state=model.state.applyStagePatch('current-track',state,tracking.patch()).state;
  const binding=tx.beginStage('current-bind'),bound=produceGeneralBindings(samples,tracking.result(),()=>uint(binding.allocate(1103n).payload));binding.admit(bound.outputs());tx.beginStage('current-classify').admit([]);
  const freeze=tx.beginStage('current-freeze',sample.receipt),experience=freezeGeneralExperience(samples,tracking.result(),bound.bindings(),sample.reservation())!;freeze.admit([experience.output()]);
  const roleStage=tx.beginStage('current-roles'),claims=deriveGeneralSourceRoles(experience.staged().experience,()=>uint(roleStage.allocate(1111n).payload));roleStage.admit(claims.map(causalRoleEvidenceValue));tx.beginStage('encoding-concern-delivery').admit([delivery]);
  const selectedStage=tx.beginStage('current-visual-selection'),visual=model.selection.visual({samples,tracking:tracking.result(),staged:experience.staged(),claims},()=>uint(selectedStage.allocate(1143n).payload));selectedStage.admit(visual.outputs());
  const encoded=visual.encode(delivery);tx.beginStage('prior-concern-visual-encoding').admit(encoded);results.push([...items(f(rec(encoded[1],621n),5n),'list')]);
  const evaluation=rec(encoded[0],641n),modulation=rec(f(evaluation,3n),639n);expect(f(modulation,2n)).toEqual(u(recipe==='allocation-spatial'?2:1));expect(f(modulation,3n)).toEqual(recipe==='allocation-spatial'?q(1,1):q(3,5));
  visual.close();tx.commit();
 }
 const allocations=(rows:CanonicalValue[])=>rows.map(v=>f(rec(f(rec(f(rec(v,544n),1n),620n),4n),617n),3n));
 expect(allocations(results[0])).toEqual([q(1,1),q(1,10),q(1,10)]);expect(allocations(results[1])).toEqual([q(1,1),q(3,50),q(3,50)]);
},30000);
