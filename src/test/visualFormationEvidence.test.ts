import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {text,typedIdentifier,canonicalEncode,unsigned,rational,set} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {cognitiveRecord as record} from '../campaign2/cognitiveCodecs';
import {workspaceOutput,appraisalOutput,concernOutput} from '../campaign2/cognitiveTransforms';
import {projectPriorConcern} from '../campaign3/priorConcernFeedback';
import {EventRoleId} from '../semanticBinding/eventBindings';
import {createPositionSceneSource} from '../campaign3/positionSceneSource';
import {createTrialPanelSource} from '../campaign3/trialPanelSource';
import {observeGeneralSourceOpportunity} from '../campaign3/generalSourceOpportunity';
import {createWindowMarkerManager} from '../campaign3/windowMarkerTransaction';
import {createWindowPanelManager} from '../campaign3/windowPanelTransaction';
import {deriveGeneralSourceRoles} from '../campaign3/generalSourceRoles';
import {prepareVisualFormation as prepare,prepareVisualFormationEqualPriorityControl as prepareEqual,prepareVisualFormationUnlimitedControl as prepareUnlimited,encodeVisualFormationWithCalibration as encodeCalibrated,encodeVisualFormation as encode,encodeVisualFormationWithPriorConcern as encodePrior,produceVisualFormationEvidence as produce,closeVisualFormation as close,type SelectedVisualFormation,type EncodedVisualFormation} from '../campaign3/visualFormationEvidence';
const observer=typedIdentifier(1000,text('observer/a')),one=Q.of(1n),zero=Q.of(0n),calibration={minX:0n,maxX:0n,minY:0n,maxY:0n,focalWeight:one,residualPool:zero};
function source(unresolved=false,spread=false,count=3,reverseRoles=false){
 const scene=createPositionSceneSource([{at:1n,items:(reverseRoles?[EventRoleId.Participant,EventRoleId.Target,EventRoleId.Actor]:[EventRoleId.Actor,EventRoleId.Target,EventRoleId.Participant]).slice(0,count).map((role,i)=>({marker:semanticReferentFromAuthoredContent(governedContentDefinitionId('object/'+i)),role,x:spread?BigInt(i):0n,y:0n,glyph:BigInt(i),visible:true,permitted:true,roleMode:unresolved?'Unresolved' as const:'Preserve' as const}))}]),panel=createTrialPanelSource([{at:1n,glyph:0,stage:'Before',visible:true,permitted:true}]);let n=0n;
 const r=observeGeneralSourceOpportunity(undefined,panel,scene,createWindowPanelManager('observer/a'),createWindowMarkerManager('observer/a'),observer,1n,'Current',{bodyChannels:null,panel:true,visual:true},()=>n++),experience=r.staged!.experience;
 return {input:{observation:{...r.visual!,eventDetectionId:r.visual!.eventDetectionId!},tracks:r.tracks,event:r.event!,experience},claims:deriveGeneralSourceRoles(experience,()=>n++),context:r.context};
}
it('VF-A: actual selected positive children share one later acquisition and bound context',()=>{
 const s=source();let calls=0;const next=()=>BigInt(100+calls++),p=prepare(s.input,s.claims,2,calibration,s.context,next);expect(calls).toBe(1);
 const e=encode(p.view,'independent');expect(calls).toBe(1);const r=produce(e.view,next);expect(calls).toBe(2);if(r.kind!=='Formation')throw Error('formation');
 expect(r.evidence).toMatchObject({acquisitionId:101n,sourceSelectionId:100n,at:1n});expect(r.evidence.content.children).toHaveLength(2);for(const child of r.evidence.content.children){expect(child.context).toEqual(s.context);expect(child.encoding.strength.compare(zero)).toBeGreaterThan(0);expect(child.encoding.claims).toHaveLength(1);expect(child.encoding.bindings).toHaveLength(1);}
});
it('VF-B: empty selection, known zero and unavailable role form no acquisition',()=>{
 for(const [capacity,focal,unresolved]of [[0,one,false],[2,zero,false],[2,one,true]] as const){const s=source(unresolved);let calls=0;const p=prepare(s.input,s.claims,capacity,{...calibration,focalWeight:focal},s.context,()=>BigInt(calls++)),e=encode(p.view,'independent');expect(produce(e.view,()=>BigInt(calls++))).toEqual({kind:'NoFormation',selectionId:0n});expect(calls).toBe(1);}
 // Supplied projection control only: the first complete-position scene cannot produce this absence.
 const s=source(),input={...s.input,observation:{...s.input.observation,detections:s.input.observation.detections.map(d=>({detectionId:d.detectionId}))}};
 const p=prepare(input,s.claims,2,calibration,s.context,()=>100n),e=encode(p.view,'independent');expect(e.evaluation.rows.every(r=>r.status==='UnavailableAllocation')).toBe(true);expect(produce(e.view,()=>{throw Error('must not allocate');}).kind).toBe('NoFormation');
});
it('VF-C: raw, forged, consumed and closed capabilities cannot skip a stage',()=>{
 const s=source();expect(()=>encode(s.input as unknown as SelectedVisualFormation,'independent')).toThrow();expect(()=>produce({} as EncodedVisualFormation,()=>100n)).toThrow();
 const p=prepare(s.input,s.claims,2,calibration,s.context,()=>100n),e=encode(p.view,'independent');expect(()=>encode(p.view,'independent')).toThrow();produce(e.view,()=>101n);expect(()=>produce(e.view,()=>102n)).toThrow();
 const q=prepare(s.input,s.claims,2,calibration,s.context,()=>103n);close(q.view);expect(()=>encode(q.view,'independent')).toThrow();
});
it('VF-D: context/source/evaluation edits cannot add unselected content or alter private candidate',()=>{
 const s=source(),context=structuredClone(s.context),p=prepare(s.input,s.claims,2,calibration,s.context,()=>100n);
 s.input.observation.detections[0].position.x=7n;if(s.context!.panel.sample.kind==='Present')(s.context!.panel.sample as {stage:string}).stage='After';
 const e=encode(p.view,'independent');e.evaluation.rows.length=0;const r=produce(e.view,()=>101n);if(r.kind!=='Formation')throw Error('formation');expect(r.evidence.content.children).toHaveLength(2);
 const retained=r.evidence.content.children.flatMap(c=>c.encoding.bindings.map(b=>Array.from(b))),unselected=s.input.experience.perceivedBindings[2];expect(unselected).toBeDefined();expect(retained).toHaveLength(2);for(const c of r.evidence.content.children){expect(c.context).toEqual(context);expect(c.encoding.spatialWitness.position.x).toBe(0n);}
 expect(r.evidence.content.children.every(c=>c.encoding.unit.perceptualReferentId.observerTrackSequence!==2n)).toBe(true);
});
it('VF-E: context rejects before selector allocation; failed evidence allocation publishes nothing',()=>{
 const s=source();let calls=0;expect(()=>prepare(s.input,s.claims,2,calibration,{...s.context!,experience:999n},()=>BigInt(calls++))).toThrow();expect(calls).toBe(0);
 const p=prepare(s.input,s.claims,2,calibration,s.context,()=>100n),e=encode(p.view,'independent');expect(()=>produce(e.view,()=>-1n)).toThrow('ALLOCATION');expect(()=>produce(e.view,()=>101n)).toThrow();expect(canonicalEncode(p.audit)).toBeInstanceOf(Uint8Array);
});

function actualEarlierConcern(access=true){
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),task={key:record(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-a'))]),specId:typedIdentifier(1027,text('definition/task-a')),activeFrom:0n,deadline:10n};
 const occ=(n:number)=>typedIdentifier(n,unsigned(10)),w=workspaceOutput(occ(1128),C,typedIdentifier(1027,text('definition/task-workspace')),record(378,[typedIdentifier(1027,text('definition/measurement-prediction')),unsigned(2),true,access]),[task],0n,{status:()=>record(372,[unsigned(1)]),prediction:()=>record(361,[rational(0,1),set([record(237,[unsigned(1),occ(1115)])])])}).output;
 const a=appraisalOutput(occ(1129),w,[{taskKey:task.key,specId:task.specId,minimum:Q.of(4n),maximum:Q.of(6n)}]),output=concernOutput(occ(1130),a,record(385,[rational(1,1),true]));return {C,output,carry:projectPriorConcern(output,0n)};
}
it('VF-F: actual earlier concern modulates selected peripheral encoding without changing selection or acquisition count',()=>{
 const prior=actualEarlierConcern(),bytes=canonicalEncode(prior.output),results=[false,true].map(enabled=>{
  const s=source(false,true);let calls=0;const p=prepare(s.input,s.claims,2,{...calibration,residualPool:Q.of(1n,5n)},s.context,()=>BigInt(100+calls++)),e=encodePrior(p.view,'independent',prior.carry,prior.C,enabled),formed=produce(e.view,()=>BigInt(100+calls++));if(formed.kind!=='Formation')throw Error('formation');return {p,e,formed,calls};
 });
 expect(canonicalEncode(results[0].p.audit)).toEqual(canonicalEncode(results[1].p.audit));for(const r of results){expect(r.calls).toBe(2);expect(r.formed.evidence.sourceSelectionId).toBe(100n);expect(r.formed.evidence.acquisitionId).toBe(101n);expect(r.formed.evidence.content.children).toHaveLength(2);}
 const attention=(i:number,kind:string)=>results[i].formed.evidence.content.children.find(c=>c.encoding.spatialWitness.spatialClass===kind)!.encoding.factors.attention;
 expect(attention(0,'SpatialFocal')).toEqual(one);expect(attention(1,'SpatialFocal')).toEqual(one);expect(attention(0,'SpatialPeripheral')).toEqual(Q.of(1n,10n));expect(attention(1,'SpatialPeripheral')).toEqual(Q.of(3n,50n));
 expect(results.map(r=>r.e.evaluation.feedback.branch)).toEqual(['DisabledFeedback','EnabledKnown']);expect(canonicalEncode(prior.output)).toEqual(bytes);
});
it('VF-G: unavailable delivered concern is explicit; current feedback fails and consumes the stage',()=>{
 const prior=actualEarlierConcern(false),s=source(false,true),p=prepare(s.input,s.claims,2,{...calibration,residualPool:Q.of(1n,5n)},s.context,()=>100n),e=encodePrior(p.view,'independent',prior.carry,prior.C,true);
 expect(e.evaluation.feedback).toMatchObject({sourceStatus:'Unavailable',branch:'BaselineWithoutAvailableFeedback'});expect(produce(e.view,()=>101n).kind).toBe('Formation');
 const q=prepare(s.input,s.claims,2,calibration,s.context,()=>102n);expect(()=>encodePrior(q.view,'independent',{...prior.carry,sourceAt:1n},prior.C,true)).toThrow('FUTURE_OR_CURRENT');expect(()=>encode(q.view,'independent')).toThrow('VISUAL_FORMATION_SELECTED');
});

it('VF-H: canonical equal and unlimited controls reuse frozen policy forms and actual eligible content',()=>{
 const s=source(false,false,3,true),run=(select:typeof prepare,capacity:0|1|2)=>{let calls=0;const p=select(s.input,s.claims,capacity,calibration,s.context,()=>BigInt(100+calls++)),e=encode(p.view,'independent'),r=produce(e.view,()=>BigInt(100+calls++));if(r.kind!=='Formation')throw Error('formation');return {p,r,calls};};
 const role=run(prepare,1),equal=run(prepareEqual,1),unlimited=run(prepareUnlimited,0);expect(role.r.evidence.content.children[0].encoding.unit.perceptualReferentId.observerTrackSequence).toBe(2n);expect(equal.r.evidence.content.children[0].encoding.unit.perceptualReferentId.observerTrackSequence).toBe(0n);expect(unlimited.r.evidence.content.children).toHaveLength(3);expect(unlimited.calls).toBe(2);
 for(const [r,algorithm]of [[role,1],[equal,2],[unlimited,3]] as const){const policy=r.p.audit.fields.get(5n);if(typeof policy==='boolean'||policy?.kind!=='record')throw Error('policy');expect(policy.fields.get(1n)).toEqual(unsigned(algorithm));}
 const missing=source(true),p=prepareUnlimited(missing.input,missing.claims,2,calibration,missing.context,()=>100n);expect(produce(encode(p.view,'independent').view,()=>{throw Error('no acquisition');}).kind).toBe('NoFormation');
});
it('VF-I: actual sparse/dense evidence exposes the small-floor shared law while preserving null controls',()=>{
 const run=(count:number,law:'independent'|'historical-shared'|'historical-hybrid'|'retired-flat',budget:Q)=>{const s=source(false,false,count),p=prepareUnlimited(s.input,s.claims,2,calibration,s.context,()=>100n),e=encodeCalibrated(p.view,{law,budget,threshold:Q.of(1n,4n)}),r=produce(e.view,()=>101n);if(r.kind!=='Formation')throw Error('formation');return r.evidence.content.children.map(c=>c.encoding);};
 const actor=(xs:ReturnType<typeof run>)=>xs.find(x=>x.factors.role.equals(one))!.strength;
 expect(actor(run(1,'historical-shared',Q.of(1n,5n)))).toEqual(one);expect(actor(run(3,'historical-shared',Q.of(1n,5n)))).toEqual(Q.of(2n,5n));
 for(const count of [1,3])expect(actor(run(count,'historical-shared',one))).toEqual(Q.of(3n,10n));
 for(const law of ['independent','retired-flat'] as const)for(const count of [1,3])for(const floor of [one,Q.of(1n,5n)])expect(actor(run(count,law,floor))).toEqual(law==='independent'?Q.of(3n,13n):one);
 const hybrid=run(3,'historical-hybrid',Q.of(1n,5n));expect(hybrid.find(x=>x.factors.role.equals(Q.of(3n,5n)))!.strength).toEqual(one);expect(hybrid.reduce((sum,x)=>sum.add(x.strength),zero).compare(one)).toBeGreaterThan(0);
});
it('VF-J: malformed or unsupported model calibration fails without reopening the selected stage',()=>{
 const make=()=>{const s=source();return prepare(s.input,s.claims,2,calibration,s.context,()=>100n).view;};
 for(const bad of [{law:'unknown',budget:one,threshold:zero},{law:'independent',budget:zero,threshold:zero}]){const v=make();expect(()=>encodeCalibrated(v,bad as Parameters<typeof encodeCalibrated>[1])).toThrow('CALIBRATION');expect(()=>encode(v,'independent')).toThrow('SELECTED');}
 let reads=0;const v=make(),bad={get law(){reads++;return 'independent' as const;},budget:one,threshold:zero};expect(()=>encodeCalibrated(v,bad)).toThrow('CALIBRATION');expect(reads).toBe(0);
});
