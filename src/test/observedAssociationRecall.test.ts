import {projectRecallPartition} from '../campaign3/recallPartitionProjection';
import {settleEventPresentationHistory} from '../campaign3/eventPresentationSettlement';
import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode,list,unsigned,rational,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {perceptualReferentIdValue,decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {EventRoleId} from '../semanticBinding/eventBindings';
import {createPositionSceneSource} from '../campaign3/positionSceneSource';
import {observeGeneralSourceOpportunity} from '../campaign3/generalSourceOpportunity';
import {createWindowPanelManager} from '../campaign3/windowPanelTransaction';
import {createWindowMarkerManager} from '../campaign3/windowMarkerTransaction';
import {deriveGeneralSourceRoles} from '../campaign3/generalSourceRoles';
import {prepareVisualFormation,encodeVisualFormation,produceVisualFormationEvidence} from '../campaign3/visualFormationEvidence';
import {canonicalOperationKeyIndex} from '../campaign3/canonicalChildKeys';
import {prepareSignificantFormationSettlement} from '../campaign3/significantFormationSettlement';
import type {SignificantAcquisition} from '../campaign3/directionalSignificanceState';
import type {FormationProtocolValue} from '../campaign3/formationProtocolTransition';
import {settleEventAssociation,type EventAssociationState} from '../campaign3/eventAssociationSettlement';
import {prepareEventRecollections,publishRecollections,takeEventPresentation} from '../campaign3/recollectionProduction';
import {validateGeneralSourceSchedule} from '../campaign3/generalSourceSchedule';
const zero=Q.of(0n),one=Q.of(1n),observer=typedIdentifier(1000,text('observer/a'));

// Actual component producers and owner results; public state/ingress/codec gates remain open.
function run(learning=true,loseGraph=false,cueVisible=true,worldPrefix='object/',gain=Q.of(5n),present=false){
 const scene=createPositionSceneSource([1n,2n,3n,4n].map(at=>({at,items:[0,1].map(i=>({marker:semanticReferentFromAuthoredContent(governedContentDefinitionId(worldPrefix+i)),role:i===0?EventRoleId.Actor:EventRoleId.Target,x:at===1n?BigInt(i):at===2n?BigInt(1-i):0n,y:0n,glyph:BigInt(i),visible:at<4n||i===0&&cueVisible,permitted:true,roleMode:'Preserve' as const}))})));
 const plan=validateGeneralSourceSchedule([1n,2n,3n,4n].map(at=>({at,lane:'Current' as const,request:{bodyChannels:null,panel:false,visual:true},use:{bodySelection:false,visualSelection:at<4n,bodyCue:false,visualCue:at===4n,goalAssessment:null}})),{initialClock:0n,horizon:4n,channels:[],assessmentDefinitions:[],lifecycleInstants:[]});
 const perception=createWindowPanelManager('observer/a'),tracker=createWindowMarkerManager('observer/a');let ordinal=0n;const allocate=()=>ordinal++;
 let memory:SignificantAcquisition[]=[],protocol:FormationProtocolValue={domain:[],successes:[]},graph:EventAssociationState={keys:[],weights:[],lastUpdatedAt:0n},labels:ReturnType<typeof canonicalOperationKeyIndex>|undefined;
 const presentations=new Map<bigint,readonly bigint[]>(),evaluations:ReturnType<typeof encodeVisualFormation>['evaluation'][]=[],prefixGraphSizes:number[]=[];
 for(const at of [1n,2n,3n]){
  const source=observeGeneralSourceOpportunity(undefined,undefined,scene,perception,tracker,observer,at,'Current',{bodyChannels:null,panel:false,visual:true},allocate),experience=source.staged!.experience;
  // A transaction-local canonical adapter over actual observed files, not world IDs.
  labels??=canonicalOperationKeyIndex(source.tracks.map(t=>perceptualReferentIdValue(t.perceptualReferentId)));
  const claims=deriveGeneralSourceRoles(experience,allocate),selection=prepareVisualFormation({observation:{...source.visual!,eventDetectionId:source.visual!.eventDetectionId!},tracks:source.tracks,event:source.event!,experience},claims,2,{minX:0n,maxX:0n,minY:0n,maxY:0n,focalWeight:one,residualPool:zero},source.context,allocate);
  const encoded=encodeVisualFormation(selection.view,'independent');evaluations.push(encoded.evaluation);const produced=produceVisualFormationEvidence(encoded.view,allocate);if(produced.kind!=='Formation')throw Error('fixture positive acquisition');
  const units=produced.evidence.content.children.map(c=>c.encoding),id=produced.evidence.acquisitionId,qualified={source:`selection/${produced.evidence.sourceSelectionId}`,character:'character/a',kind:'EventContinuant' as const};
  // Test carrier bytes preserve actual selected bindings/claims/position/strength.
  const fresh={id,kind:'EventContinuant' as const,acquiredAt:at,units:units.map(u=>({key:labels!.label(perceptualReferentIdValue(u.unit.perceptualReferentId)),views:[canonicalEncode(list([list(u.bindings.map(decodeSemanticValue)),list(u.claims.map(decodeSemanticValue)),list([unsigned(u.spatialWitness.position.x),unsigned(u.spatialWitness.position.y)]),rational(u.strength.numerator,u.strength.denominator)]))]}))};
  const owner=prepareSignificantFormationSettlement({priorProtocol:protocol,priorMemory:memory,incoming:[qualified],formed:[{...qualified,acquisition:id,formedAt:at}],freshMemory:[fresh],now:at,sourceLimit:32,capacity:{EventContinuant:96,Interoceptive:0}}),settled=owner.finish(owner.resolveMemory());owner.close();const history=settleEventPresentationHistory({now:at,priorAcquisitions:memory.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[{id,kind:'EventContinuant',acquiredAt:at}],survivingAcquisitions:settled.memory.map(a=>a.id),priorHistory:[...presentations].map(([acquisition,instants])=>({acquisition,instants})),presentations:[]});memory=settled.memory;protocol=settled.protocol;presentations.clear();for(const h of history)presentations.set(h.acquisition,h.instants);
  graph=settleEventAssociation({prior:graph,now:at,formation:units.map(u=>({key:labels!.label(perceptualReferentIdValue(u.unit.perceptualReferentId)),strength:u.strength})),calibration:{scale:1000n,eta:learning?gain:zero,lambda:zero},capacity:{nodes:30,edges:870}});prefixGraphSizes.push(graph.keys.length);
 }
 const beforeRecall=structuredClone(memory),beforeProtocol=structuredClone(protocol);
 if(loseGraph)graph=settleEventAssociation({prior:graph,now:4n,formation:null,calibration:{scale:1000n,eta:gain,lambda:zero},capacity:{nodes:0,edges:0}});
 const cue=observeGeneralSourceOpportunity(undefined,undefined,scene,perception,tracker,observer,4n,'Current',{bodyChannels:null,panel:false,visual:true},allocate);
 const actualCue=cue.visual!.detections.length?{kind:'Present' as const,key:perceptualReferentIdValue(cue.tracks[0].perceptualReferentId)}:{kind:'Absent' as const};
 const ranked=prepareEventRecollections({observer:'observer/a',character:'character/a'},actualCue,4n,{beta:Q.of(1n,2n),scale:1000n,lambda:one,exponent:1,omegaB:Q.of(11n),omegaA:one,k:2},()=>({memory:projectRecallPartition(memory,'EventContinuant',4n).map(a=>({id:a.id,acquiredAt:a.acquiredAt,units:a.units.map(u=>({key:labels!.original(u.key),views:u.views}))})),graph:{keys:graph.keys.map(k=>labels!.original(k)),weights:graph.weights},presentations}));
 const recalled=ranked.evaluation,publication=publishRecollections(ranked.view,allocate);
 const beforePresentations=new Map(presentations);
 if(present){const actual=takeEventPresentation(publication),history=settleEventPresentationHistory({now:actual.at,priorAcquisitions:memory.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[],survivingAcquisitions:memory.map(a=>a.id),priorHistory:[...presentations].map(([acquisition,instants])=>({acquisition,instants})),presentations:actual.presentations});presentations.clear();for(const h of history)presentations.set(h.acquisition,h.instants);}

 return {plan,memory,protocol,presentations,beforePresentations,publication,beforeRecall,beforeProtocol,graph,evaluations,prefixGraphSizes,recalled};
}
describe('observed sparse/dense acquisition, association and recall',()=>{
 it('OAR-G: actual publication alone does not present; explicit event handoff updates only winning histories',()=>{const base=run(),shown=run(true,false,true,'object/',Q.of(5n),true);expect(base.publication.recollections).toHaveLength(2);expect(base.presentations).toEqual(base.beforePresentations);expect(shown.recalled).toEqual(base.recalled);expect(shown.memory).toEqual(base.memory);expect(shown.graph).toEqual(base.graph);const winners=new Set(shown.publication.recollections.map(r=>r.content.winner.id));for(const [id,times]of shown.presentations)expect(times).toEqual([...shown.beforePresentations.get(id)!,...(winners.has(id)?[4n]:[])]);});
 it('OAR-A: zero peripheral allocation creates two sparse acquisitions then actual dense coactivation',()=>{const r=run();expect(r.memory.map(a=>a.units.length)).toEqual([1,1,2]);expect(r.prefixGraphSizes).toEqual([0,0,2]);expect(r.graph.weights).toEqual([[zero,Q.of(245n,1000n)],[Q.of(245n,1000n),zero]]);expect(r.protocol.successes).toHaveLength(3);expect(r.plan.qualifiedSelectionSlots).toBe(3);expect(r.evaluations.slice(0,2).map(e=>e.rows.filter(r=>r.status==='KnownZero').length)).toEqual([1,1]);});
 it('OAR-B: learning changes the second recalled episode with identical retained bytes and presentations',()=>{const intact=run(),disabled=run(false);expect(intact.memory).toEqual(disabled.memory);expect(intact.protocol).toEqual(disabled.protocol);expect(intact.recalled.recalled.map(a=>a.acquiredAt)).toEqual([3n,2n]);expect(disabled.recalled.recalled.map(a=>a.acquiredAt)).toEqual([3n,1n]);expect(intact.graph.keys).toHaveLength(2);expect(disabled.graph.keys).toEqual([]);});
 it('OAR-C: complete graph loss preserves episodic content and direct cue access',()=>{const intact=run(),lost=run(true,true),disabled=run(false);expect(lost.memory).toEqual(intact.memory);expect(lost.graph.keys).toEqual([]);expect(lost.recalled).toEqual(disabled.recalled);expect(lost.recalled.access.some(a=>a.directMatch.compare(one)===0)).toBe(true);});
 it('OAR-D: cue absence prevents recall despite surviving episodes and learned associations',()=>{const r=run(true,false,false);expect(r.memory).toHaveLength(3);expect(r.graph.keys).toHaveLength(2);expect(r.recalled.disposition).toBe('UnavailableCue');expect(r.recalled.recalled).toEqual([]);expect(r.memory).toEqual(r.beforeRecall);expect(r.protocol).toEqual(r.beforeProtocol);});
 it('OAR-F: a weaker accepted learning rate is a nondiscriminating control, not a universal rank claim',()=>{const weak=run(true,false,true,'object/',Q.of(3n)),strong=run(true,false,true,'object/',Q.of(4n));expect(weak.memory).toEqual(strong.memory);expect(weak.recalled.recalled.map(a=>a.acquiredAt)).toEqual([3n,1n]);expect(strong.recalled.recalled.map(a=>a.acquiredAt)).toEqual([3n,2n]);});
 it('OAR-E: recall is read-only and hidden world renaming cannot alter the observer-side result',()=>{const a=run(),b=run(true,false,true,'renamed-object/');expect(b).toEqual(a);expect(a.memory).toEqual(a.beforeRecall);expect(a.protocol).toEqual(a.beforeProtocol);});
});
