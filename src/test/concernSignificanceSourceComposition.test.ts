import {projectRecallPartition} from '../campaign3/recallPartitionProjection';
import {settleEventPresentationHistory,type PresentationHistoryEntry} from '../campaign3/eventPresentationSettlement';
import {createPositionSceneSource} from '../campaign3/positionSceneSource';
import {observeGeneralSourceOpportunity} from '../campaign3/generalSourceOpportunity';
import {createWindowMarkerManager} from '../campaign3/windowMarkerTransaction';
import {validateGeneralSourceSchedule,type PlannedObservation} from '../campaign3/generalSourceSchedule';
import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {createLocalReserveSource,replenishLocalReserve} from '../campaign3/localReserveSource';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {EventRoleId} from '../semanticBinding/eventBindings';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {deriveGeneralSourceRoles} from '../campaign3/generalSourceRoles';
import {perceptualReferentIdValue} from '../semanticBinding/semanticCodecs';
import {groupRetainedPositionTrial} from '../campaign3/retainedContextGrouping';
import {adoptMaintenanceGoal,settleMaintenanceGoal,settleMaintenanceGoalDeadline} from '../campaign3/bodilyMaintenanceGoal';
import {qualifyGoalOutcome} from '../campaign3/goalOutcomeQualification';
import {prepareGoalAssessment,produceGoalAssessment} from '../campaign3/goalAssessmentProduction';
import {prepareAttributionProduction,produceAttributionResult} from '../campaign3/attributionProduction';
import {type SignificantAcquisition} from '../campaign3/directionalSignificanceState';
import {prepareOrdinaryMemoryBatch,prepareSharedProtectionMemoryBatchControl,type OrdinaryMemoryBatchInput} from '../campaign3/ordinaryMemoryBatch';
import {type AttributionField,type PositionPairTrial,type ObservedPosition} from '../campaign3/retainedAttributionUse';
import type {AttributionTrial} from '../campaign3/contrastiveAttribution';
import {prepareSignificantFormationSettlement} from '../campaign3/significantFormationSettlement';
import type {FormationProtocolValue} from '../campaign3/formationProtocolTransition';
import {prepareBodyRecollections,prepareEventRecollections,publishRecollections} from '../campaign3/recollectionProduction';
import type {BodyRecallCue} from '../campaign3/bodyRecall';
import {createTrialPanelSource} from '../campaign3/trialPanelSource';
import {createWindowPanelManager} from '../campaign3/windowPanelTransaction';
import {typedIdentifier,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {produceBodyFormationEvidence} from '../campaign3/bodyFormationEvidence';
import {selectContextualBody as selectBodyOccurrence} from '../campaign3/contextualBodySelection';
import {admitLocalReserveSignalCue} from '../campaign3/bodySignalCue';
import {consumeSelected} from '../campaign3/attentionSelection';
import {prepareVisualFormation,encodeVisualFormation,produceVisualFormationEvidence} from '../campaign3/visualFormationEvidence';
import {selectCanonicalVisual} from '../campaign3/canonicalVisualSelection';
const q=(n:number)=>Q.of(BigInt(n)),range=(a:number,b:number)=>({lower:q(a),upper:q(b)}),observer='observer/a',character='character/a';
// Fixture encoding only; a public carrier needs its separately accepted canonical schema.
type RetainedContext=ReturnType<typeof observeGeneralSourceOpportunity>['context'];
const encodeView=(payload:number[],experience:ReturnType<typeof assemblePreRecognitionExperience>,context:RetainedContext)=>new TextEncoder().encode(JSON.stringify({payload,experience,context,role:context?.panel.sample.kind==='Present'?context.panel.sample.stage:null},(_,v)=>typeof v==='bigint'?{fixtureBigint:v.toString()}:v));
const decodeView=(b:Uint8Array):{payload:number[];experience:ReturnType<typeof assemblePreRecognitionExperience>;role:'Before'|'Motion'|'After'|null;context?:RetainedContext}=>JSON.parse(new TextDecoder().decode(b),(_,v)=>v&&typeof v==='object'&&Object.keys(v).length===1&&'fixtureBigint' in v?BigInt(v.fixtureBigint):v);
type DeliveryLaw='stroke-coupled'|'scheduled';
// Source-side comparator only. Its law name and hidden deliveries never enter retained views.
const deliveryFor=(law:DeliveryLaw,stroke:boolean,index:number)=>law==='stroke-coupled'?(stroke?13:3):[13,3,3,13][index];
function experiment(goalRange=range(30,40),contextAvailable=true,creditEnabled=true,bodyRecallSlots=8,reverseReadOrder=false,hiddenPanelAt?:bigint,deliveryLaw:DeliveryLaw='stroke-coupled',baselineRecallSlots=8,sourceLimit=32,focalSourceKey='trial/d',hiddenPositionAt?:bigint,eventRecallSlots=8,hiddenRoleAt?:bigint,worldMarkerKey='object/fixture-marker',qualifiedUseMode:'SuppliedComparator'|'ActualReadsOnly'='SuppliedComparator'){
 const perception=createWindowPanelManager(observer),marker=createWindowMarkerManager(observer);let ordinal=0n;
 const allocate=()=>ordinal++;
 let memory:SignificantAcquisition[]=[];const visualAudits:CanonicalValue[]=[];const bodyAudits:ReturnType<typeof selectBodyOccurrence>['audit'][]=[];const physicalInputs:{at:bigint;delivery:number}[]=[];
 const recollectionPublications:ReturnType<typeof publishRecollections>[]=[];
 const bodyRecall=(cue:BodyRecallCue,at:bigint,slots:number)=>{const p=prepareBodyRecollections({observer,character},cue,at,slots,()=>projectRecallPartition(memory,'Interoceptive',at)),publication=publishRecollections(p.view,allocate);recollectionPublications.push(publication);return {recalled:publication.recollections.map(r=>{if(r.content.kind!=='Interoceptive')throw Error('body publication');return r.content.winner;})};};
 let protocol:FormationProtocolValue={domain:[],successes:[]};let presentationHistory:PresentationHistoryEntry[]=[];
 function form(id:bigint,at:bigint,kind:'EventContinuant'|'Interoceptive',key:string,view:Uint8Array,selection:bigint){
  const source={source:`${kind==='EventContinuant'?'visual':'body'}-selection/1143/${selection}`,character,kind};
  const tx=prepareSignificantFormationSettlement({priorProtocol:protocol,priorMemory:memory,incoming:[source],formed:[{...source,acquisition:id,formedAt:at}],freshMemory:[{id,kind,acquiredAt:at,units:[{key,views:[view]}]}],now:at,sourceLimit,capacity:{EventContinuant:32,Interoceptive:32}});
  const next=tx.finish(tx.resolveMemory());tx.close();
  presentationHistory=settleEventPresentationHistory({now:at,priorAcquisitions:memory.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[{id,kind,acquiredAt:at}],survivingAcquisitions:next.memory.map(a=>a.id),priorHistory:presentationHistory,presentations:[]});protocol=next.protocol;
  memory=next.memory;
 }
 const domains=new Map([['interoceptive-signal/A',{kind:'MetricInterval' as const,bounds:range(0,100)}]]);
 const goalDomains=new Map([['interoceptive-signal/A',range(0,100)]]);
 const goals=adoptMaintenanceGoal([],{character,goal:'maintain',signal:'interoceptive-signal/A',desired:goalRange,adoptedAt:1n,activeFrom:1n,expiresAt:100n},goalDomains);
 let frozenQualification:ReturnType<typeof qualifyGoalOutcome>|undefined;
 let focalConsequence:bigint|undefined,focalSourceAt:bigint|undefined;
 const schedule=[{key:'trial/a',at:1n,stroke:true},{key:'trial/b',at:21n,stroke:false},{key:'trial/c',at:41n,stroke:false},{key:'trial/d',at:61n,stroke:true}];
 // The actual focal consequence is designated before assessment; its retained
 // target is subsequently derived from recalled grouping, never this source array.
 const panel=createTrialPanelSource(schedule.flatMap((trial,glyph)=>(['Before','Motion','Motion','After'] as const).map((stage,i)=>{const at=trial.at+BigInt(i);return {at,glyph,stage,visible:contextAvailable&&at!==hiddenPanelAt,permitted:true};})));
 const scene=createPositionSceneSource([...schedule.flatMap(trial=>[1n,2n].map(offset=>({at:trial.at+offset,x:offset===2n&&trial.stroke?1n:0n,glyph:0n}))),{at:71n,x:0n,glyph:0n},{at:73n,x:2n,glyph:1n}].map(f=>({at:f.at,items:[{marker:semanticReferentFromAuthoredContent(governedContentDefinitionId(worldMarkerKey)),role:EventRoleId.Actor,x:f.x,y:0n,glyph:f.glyph,visible:f.at!==hiddenPositionAt,permitted:true,roleMode:f.at===71n||f.at===hiddenRoleAt?'Unresolved' as const:'Preserve' as const}]})));
 const plannedObservations:PlannedObservation[]=schedule.flatMap(trial=>[0n,1n,2n,3n].map(offset=>({at:trial.at+offset,lane:offset===3n?'Consequence' as const:'Current' as const,request:{bodyChannels:offset===0n||offset===3n?['channel/A']:null,panel:true,visual:offset===1n||offset===2n},use:{bodySelection:offset===0n||offset===3n,visualSelection:offset===1n||offset===2n,bodyCue:false,visualCue:false,goalAssessment:offset===3n&&trial.key===focalSourceKey?'assessment/focal':null}})));
 plannedObservations.push({at:71n,lane:'Current',request:{bodyChannels:['channel/A'],panel:false,visual:true},use:{bodySelection:true,visualSelection:false,bodyCue:true,visualCue:true,goalAssessment:null}},{at:73n,lane:'Current',request:{bodyChannels:null,panel:false,visual:true},use:{bodySelection:false,visualSelection:true,bodyCue:false,visualCue:false,goalAssessment:null}});
 const sourcePlan=validateGeneralSourceSchedule(plannedObservations,{initialClock:0n,horizon:100n,channels:['channel/A'],assessmentDefinitions:['assessment/focal'],lifecycleInstants:[1n,70n,100n]});
 let source=createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(k==='A'?1:0),amount:q(k==='A'?21:20),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:q(1),available:true,permitted:true})));
 const bodyOpportunity=(at:bigint,lane:'Current'|'Consequence')=>{
  const r=observeGeneralSourceOpportunity(source,panel,undefined,perception,marker,typedIdentifier(1000,text(observer)),at,lane,{bodyChannels:['channel/A'],panel:true,visual:false},allocate);
  const field=(v:CanonicalValue,n:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture canonical record');return v.fields.get(n)!;};
  const scalar=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('fixture canonical rational');return Q.of(v.numerator,v.denominator);};
  const selection=selectBodyOccurrence({...r.body!,context:r.context},{maxSignals:1,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity:1},allocate);bodyAudits.push(selection.audit);const selected=selection.view;
  const interval=field(r.body!.samples[0],5n);if(!r.staged)throw Error('fixture present body experience');
  return {staged:r.staged,experience:r.staged.experience,context:r.context,selected,sample:{kind:'Present' as const,signal:r.body!.declarations[0].signal,lower:scalar(field(interval,1n)),upper:scalar(field(interval,2n))}};
 };
 const formBody=(op:ReturnType<typeof bodyOpportunity>,at:bigint)=>{
  const produced=produceBodyFormationEvidence(op.selected,allocate);if(produced.kind!=='Formation')throw Error('fixture positive body formation');const evidence=produced.evidence;
  if(evidence.content.children.length!==1||evidence.content.children[0].views.length!==1)throw Error('fixture selected body group');
  const retained=evidence.content.children[0].views[0],value=retained.sample;if(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==461n)throw Error('selected body sample');
  const range=value.fields.get(5n);if(typeof range==='boolean'||range?.kind!=='record')throw Error('selected interval');
  const bounds=[1n,2n].map(k=>{const q=range.fields.get(k);if(typeof q==='boolean'||q?.kind!=='rational'||q.denominator!==1n)throw Error('fixture integral bound');return Number(q.numerator);});
  const acquisition=evidence.acquisitionId;form(acquisition,at,'Interoceptive',evidence.content.children[0].signal,encodeView(bounds,op.experience,retained.context),evidence.sourceSelectionId);return acquisition;
 };
 const visualOpportunity=(time:bigint,standalone=false)=>{
  const r=observeGeneralSourceOpportunity(undefined,standalone?undefined:panel,scene,perception,marker,typedIdentifier(1000,text(observer)),time,'Current',{bodyChannels:null,panel:!standalone,visual:true},allocate);
  return {sample:r.visual!.detections.length?{kind:'Present' as const}:{kind:'Unavailable' as const},experience:r.staged?.experience,context:r.context,tracks:r.tracks,event:r.event,observation:{...r.visual!,eventDetectionId:r.visual!.eventDetectionId!}};
 };
 const formPosition=(time:bigint,standalone=false,unitKey='candidate')=>{
  const s=visualOpportunity(time,standalone);
  const settleEmpty=(selection:bigint)=>{const incoming={source:`visual-selection/1143/${selection}`,character,kind:'EventContinuant' as const},tx=prepareSignificantFormationSettlement({priorProtocol:protocol,priorMemory:memory,incoming:[incoming],formed:[],freshMemory:[],now:time,sourceLimit,capacity:{EventContinuant:32,Interoceptive:32}});const next=tx.finish(tx.resolveMemory());tx.close();protocol=next.protocol;memory=next.memory;};
  if(s.sample.kind!=='Present'){const {observerId,observationId,occurredAt,detections}=s.observation;const selection=selectCanonicalVisual({kind:'NoDetection',observation:{observerId,observationId,occurredAt,detections}},1,allocate);visualAudits.push(selection.audit);expect(consumeSelected(selection.view,[])).toEqual([]);settleEmpty(selection.selectionId);return;}
  const experience=s.experience!,claims=deriveGeneralSourceRoles(experience,allocate);
  const selection=prepareVisualFormation({observation:s.observation,tracks:s.tracks,event:s.event!,experience},claims,1,{minX:0n,maxX:7n,minY:0n,maxY:7n,focalWeight:q(1),residualPool:Q.of(1n,5n)},s.context,allocate);visualAudits.push(selection.audit);
  const encoded=encodeVisualFormation(selection.view,'independent'),produced=produceVisualFormationEvidence(encoded.view,allocate);
  if(produced.kind==='NoFormation'){settleEmpty(produced.selectionId);return undefined;}
  const evidence=produced.evidence;if(evidence.content.children.length!==1)throw Error('fixture one visual child');
  const child=evidence.content.children[0],unit=child.encoding,acquisition=evidence.acquisitionId;form(acquisition,time,'EventContinuant',unitKey,encodeView([Number(unit.spatialWitness.position.x),Number(unit.spatialWitness.position.y)],experience,child.context),evidence.sourceSelectionId);return acquisition;
 };
 // Fixture schedule, not public source admission. Neutral context is independent of motion.
 for(const [index,trial] of schedule.entries()){
  const {at,stroke}=trial;
  // Literal external preparations settle at110 in the preceding instant; they
  // cannot repair a same-instant phase10 sample using an unadmitted truth controller.
  if(index>0){const delivery=index===1?7:17;physicalInputs.push({at:at-1n,delivery});source=replenishLocalReserve(source,'local-reserve/A',at-1n,q(delivery));}
  const beforeOpportunity=bodyOpportunity(at,'Current'),before=beforeOpportunity.sample;
  const beforeExp=beforeOpportunity.experience,beforeId=formBody(beforeOpportunity,at);
  formPosition(at+1n);formPosition(at+2n);
  const delivery=deliveryFor(deliveryLaw,stroke,index);physicalInputs.push({at:at+3n,delivery});source=replenishLocalReserve(source,'local-reserve/A',at+3n,q(delivery));
  const afterOpportunity=bodyOpportunity(at+3n,'Consequence'),after=afterOpportunity.sample;
  const afterExp=afterOpportunity.experience;
  if(trial.key===focalSourceKey){
   focalConsequence=afterExp.experienceId;focalSourceAt=afterExp.occurredAt;
   // Consequence-time assessment reads a prior retained baseline, not the local
   // before-sample variable. The current after sample is still live safe evidence.
   const baselineRecall=bodyRecall({kind:'Present',signals:[after.signal]},at+3n,baselineRecallSlots);
   const context=afterExp.perceptualEventReferentIds[0];
   const baselines=baselineRecall.recalled.flatMap(a=>a.units.filter(u=>u.key===after.signal).flatMap(u=>u.views.map(decodeView))).filter(v=>context&&v.role==='Before'&&v.experience.perceptualEventReferentIds.some(c=>c.observerId===context.observerId&&c.observerEventSequence===context.observerEventSequence));
   const prior=baselines.length===1?range(baselines[0].payload[0],baselines[0].payload[1]):null;
   const assessment=produceGoalAssessment(prepareGoalAssessment(afterOpportunity.staged,observer,at+3n,()=>({state:goals,character,goal:'maintain',signal:'interoceptive-signal/A',now:at+3n,before:prior,after,domains})),allocate);if(assessment.kind!=='Assessment')throw Error('fixture consequence assessment');frozenQualification=assessment.assessment.result;
  }
  const afterId=formBody(afterOpportunity,at+3n);
 }
 // Real goal lifecycle changes after the assessment; the later pipeline keeps the old value.
 const withdrawn=settleMaintenanceGoal(goals,character,'maintain',70n,'Withdraw',goalDomains);
 // One actual combined request; body selection and both cues reuse its shared freeze.
 const sharedCue=observeGeneralSourceOpportunity(source,undefined,scene,perception,marker,typedIdentifier(1000,text(observer)),71n,'Current',{bodyChannels:['channel/A'],panel:false,visual:true},allocate);
 const cueInput=sharedCue.body!;
 const cueSelected=selectBodyOccurrence(cueInput,{maxSignals:1,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity:0},allocate);bodyAudits.push(cueSelected.audit);const selected=produceBodyFormationEvidence(cueSelected.view,allocate);
 if(selected.kind!=='NoFormation')throw Error('fixture zero capacity');
 const beforeCueMemory=structuredClone(memory),beforeCueSources=protocol.domain.length,beforeCueSuccesses=protocol.successes.length;
 const cueSelection={source:`body-selection/1143/${cueSelected.selectionId}`,character,kind:'Interoceptive' as const};
 const cue=admitLocalReserveSignalCue(cueInput,71n,true);
 const afterCueMemory=structuredClone(memory);
 const settleCue=(useResults:OrdinaryMemoryBatchInput['useResults'])=>{const tx=prepareOrdinaryMemoryBatch({observer,character,priorProtocol:protocol,priorMemory:memory,incoming:[cueSelection],formed:[],freshMemory:[],now:71n,sourceLimit,capacity:{EventContinuant:32,Interoceptive:32},useResults,significance:[]});const next=tx.finish(tx.resolve());tx.close();protocol=next.protocol;memory=next.memory;return {beforeCueMemory,afterCueMemory,beforeSources:beforeCueSources,afterSources:protocol.domain.length,beforeSuccesses:beforeCueSuccesses,afterSuccesses:protocol.successes.length,cue:cue.cue};};
 const attributionContext=()=>({observer,character,at:71n,focal:focalConsequence===undefined?null:{observer,consequence:focalConsequence,sourceAt:focalSourceAt!}});
 const unavailable=<T extends {kind:string}>(value:T)=>{const attributionResult=produceAttributionResult(prepareAttributionProduction(attributionContext(),()=>null),allocate);settleCue([]);return {...value,attributionResult,sourceCount:protocol.domain.length,successCount:protocol.successes.length};};
 const recalled=bodyRecall(cue.cue,71n,bodyRecallSlots);
 if(recalled.recalled.length!==8)return unavailable({kind:'RecallUnavailable' as const});
 // The visual cue requires an actual detection, even if body sensing made an experience.
 const visualCue={experience:sharedCue.staged?.experience};
 if(!sharedCue.visual?.detections.length||!visualCue.experience)return unavailable({kind:'EventRecallUnavailable' as const});
 const eventMemory=()=>projectRecallPartition(memory,'EventContinuant',71n).map(a=>({id:a.id,acquiredAt:a.acquiredAt,units:a.units.map(u=>({key:perceptualReferentIdValue(decodeView(u.views[0]).experience.perceivedBindings[0].perceptualReferentId),views:u.views}))}));
 const eventRank=prepareEventRecollections({observer,character},{kind:'Present',key:perceptualReferentIdValue(visualCue.experience.perceivedBindings[0].perceptualReferentId)},71n,{beta:Q.of(1n,2n),scale:1000n,lambda:q(1),exponent:1,omegaB:q(0),omegaA:q(1),k:eventRecallSlots},()=>({memory:eventMemory(),graph:{keys:[],weights:[]},presentations:new Map(presentationHistory.map(h=>[h.acquisition,h.instants]))}));
 const eventPublication=publishRecollections(eventRank.view,allocate);recollectionPublications.push(eventPublication);
 const eventRecall={recalled:eventPublication.recollections.map(r=>{if(r.content.kind!=='EventContinuant')throw Error('event publication');return r.content.winner;})};
 if(eventRecall.recalled.length!==8)return unavailable({kind:'EventRecallUnavailable' as const});
 // The first controlled source has one candidate child per event acquisition.
 // Payloads below come from the actual recall result, not a fresh source/state scan.
 const eventRecalled=eventRecall.recalled.map(a=>({...a,units:a.units.map(u=>({key:'candidate',views:u.views}))}));
 const admitted=[...eventRecalled,...recalled.recalled].flatMap(a=>a.units.map(u=>({acquisition:a.id,unit:u.key})));
 const rows=[...eventRecalled,...recalled.recalled].flatMap(a=>a.units.flatMap(u=>u.views.map((bytes,view)=>({address:{acquisition:a.id,unit:u.key},view,...decodeView(bytes)}))));
 if(reverseReadOrder)rows.reverse();
 const views=rows.flatMap(({context})=>context===undefined?[]:[context]);
 const contexts=new Map(views.filter(v=>v.panel.sample.kind==='Present'&&v.panel.sample.stage==='Motion').map(v=>[v.context.observerEventSequence,v.context] as const));
 const groupings=[...contexts.values()].map(c=>groupRetainedPositionTrial(observer,c,views));
 if(groupings.length!==4||groupings.some(g=>g.kind!=='Grouped'))return unavailable({kind:'GroupingUnavailable' as const,groupings});
 // The accepted grouping, not the source loop's private pairing, binds each operand.
 const operand=(experienceId:bigint)=>{const matches=rows.filter(r=>r.context?.experience===experienceId);if(matches.length!==1)throw Error('fixture unique retained experience');const r=matches[0];return {kind:'Retained' as const,address:r.address,view:r.view};};
 const trials:PositionPairTrial[]=groupings.map(g=>{if(g.kind!=='Grouped')throw Error('fixture grouping');return {motion:{kind:'RetainedPositionPair',start:operand(g.startExperience),end:operand(g.endExperience)},before:operand(g.beforeExperience),after:operand(g.afterExperience)};});
 const focalGroups=groupings.filter(g=>g.kind==='Grouped'&&g.afterExperience===focalConsequence);
 if(focalGroups.length!==1||focalGroups[0].kind!=='Grouped')return unavailable({kind:'FocusUnavailable' as const});
 const focal=operand(focalGroups[0].endExperience).address;
 const project=<K extends AttributionField>(bytes:Uint8Array,field:K):AttributionTrial[K]=>{if(field==='motion')throw Error('separate position operands required');const b=decodeView(bytes).payload;return {lower:q(b[0]),upper:q(b[1])} as AttributionTrial[K];};
 const projectPosition=(bytes:Uint8Array):ObservedPosition=>{const v=decodeView(bytes);return {at:v.experience.occurredAt,position:[v.payload[0],v.payload[1]]};};
 // This legacy pure kernel needs a structural use-bit field. False here is only
 // scratch validation metadata; no actual protection state is read or returned.
 const recalledOperands=[...eventRecalled.map(a=>({...a,kind:'EventContinuant' as const})),...recalled.recalled].map(a=>({...a,units:a.units.map(u=>({...u,useProtection:false}))}));
 const attributionResult=produceAttributionResult(prepareAttributionProduction(attributionContext(),()=>[{memory:recalledOperands,now:71n,admitted,trials,focalTrial:groupings.indexOf(focalGroups[0])},project,projectPosition]),allocate);
 if(attributionResult.kind!=='Result')throw Error('actual focal attribution result');
 const result={assessment:{kind:attributionResult.result.disposition},consumed:attributionResult.result.consumed,attributedTargets:attributionResult.result.targets};
 const cueGovernance=settleCue([result.consumed]);
 const qualified=frozenQualification!;
 const settleLater=(now:bigint,useResults:OrdinaryMemoryBatchInput['useResults'],significance:OrdinaryMemoryBatchInput['significance'])=>{const tx=prepareOrdinaryMemoryBatch({observer,character,priorProtocol:protocol,priorMemory:memory,incoming:[],formed:[],freshMemory:[],now,sourceLimit,capacity:{EventContinuant:32,Interoceptive:32},useResults,significance});const next=tx.finish(tx.resolve());tx.close();protocol=next.protocol;memory=next.memory;};
 settleLater(72n,[],creditEnabled&&qualified.kind==='Qualifies'&&result.assessment.kind==='Supported'?[{observer,character,direction:qualified.direction,targets:result.attributedTargets}]:[]);
 // Actual later formation preserves committed metadata. Supplied later use remains
 // an explicit comparator premise and passes through the same owner boundary.
 const newer=formPosition(73n,true,'newer');
 if(newer===undefined)return {kind:'CompetitorUnavailable' as const,sourceCount:protocol.domain.length,successCount:protocol.successes.length};
 if(qualifiedUseMode==='SuppliedComparator')settleLater(74n,[[{acquisition:newer,unit:'newer'}]],[]);
 const finalMemory=memory,capacity={EventContinuant:1,Interoceptive:0};
 const retention=(prepare:typeof prepareOrdinaryMemoryBatch)=>{const tx=prepare({observer,character,priorProtocol:protocol,priorMemory:finalMemory,incoming:[],formed:[],freshMemory:[],now:75n,sourceLimit,capacity,useResults:[],significance:[]});const next=tx.finish(tx.resolve());tx.close();return {acquisitions:next.memory,protocol:next.protocol,presentations:settleEventPresentationHistory({now:75n,priorAcquisitions:finalMemory.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[],survivingAcquisitions:next.memory.map(a=>a.id),priorHistory:presentationHistory,presentations:[]})};};
 const deadline=settleMaintenanceGoalDeadline(withdrawn,character,'maintain',100n,goalDomains);
 return {kind:'Completed' as const,qualifiedUseMode,attributionResult,recollectionPublications,presentationHistory,sourcePlan,sharedCueExperience:sharedCue.opportunityId,bodyCueExperience:cueInput.opportunityId,deadline,physicalInputs,visualAudits,bodyAudits,formationSources:protocol.domain.map(s=>s.source),newer,focal,qualified,attribution:result.assessment,consumed:result.consumed,withdrawn,credited:finalMemory,cueGovernance,sourceCount:protocol.domain.length,intact:retention(prepareOrdinaryMemoryBatch),shared:retention(prepareSharedProtectionMemoryBatchControl)};
}
const observedUseExperiment=(goalRange=range(30,40),creditEnabled=true,focal='trial/a')=>experiment(goalRange,true,creditEnabled,8,false,undefined,'stroke-coupled',8,32,focal,undefined,8,undefined,'object/fixture-marker','ActualReadsOnly');
describe('controlled source-component significance composition',()=>{
 it('SC-AD: present focal consequences own attribution results even when recalled context is incomplete',()=>{const a=observedUseExperiment();if(a.kind!=='Completed')throw Error('completed');expect(a.attributionResult.result.disposition).toBe('Supported');expect(a.attributionResult.result.targets).toEqual([a.focal]);const r=experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',undefined,8,62n);if(r.kind!=='EventRecallUnavailable'||!('attributionResult'in r))throw Error('unavailable result');expect(r.attributionResult).toMatchObject({kind:'Result',result:{disposition:'Unavailable',consumed:[],targets:[],at:71n}});});
 it('SC-AC: each retention comparator derives protocol complete loss from its actual surviving owner result',()=>{const r=observedUseExperiment();if(r.kind!=='Completed')throw Error('completed');for(const result of [r.intact,r.shared]){expect(result.protocol.domain).toHaveLength(18);expect(result.protocol.successes).toHaveLength(17);expect(result.protocol.successes.filter(s=>!s.completeLoss).map(s=>s.acquisition)).toEqual(result.acquisitions.map(a=>a.id));expect(result.protocol.successes.filter(s=>s.completeLoss)).toHaveLength(16);}expect(r.intact.protocol.domain).toEqual(r.shared.protocol.domain);expect(r.intact.protocol.successes.map(({completeLoss,...s})=>s)).toEqual(r.shared.protocol.successes.map(({completeLoss,...s})=>s));});
 it('SC-AB: retained stage and episode provenance come from the actual observed panel companion',()=>{const r=observedUseExperiment();if(r.kind!=='Completed')throw Error('completed');const views=r.credited.flatMap(a=>a.units.flatMap(u=>u.views.map(decodeView)));const grouped=views.filter(v=>v.context!==undefined);expect(grouped).toHaveLength(16);for(const v of grouped){const c=v.context!;expect(c.experience).toBe(v.experience.experienceId);expect(v.experience.supportingObservationIds).toContainEqual({observerId:observer,observationId:c.panel.observation});expect(c.panel.sample.kind).toBe('Present');if(c.panel.sample.kind==='Present')expect(v.role).toBe(c.panel.sample.stage);expect(v.experience.perceptualEventReferentIds).toContainEqual(c.context);}const standalone=decodeView(r.credited.find(a=>a.id===r.newer)!.units[0].views[0]);expect(standalone.context).toBeUndefined();expect(standalone.role).toBeNull();});
 it('SC-Y: an earlier focal stroke distinguishes retention using only actually consumed memories',()=>{const r=observedUseExperiment();if(r.kind!=='Completed')throw Error('completed');expect(r.qualifiedUseMode).toBe('ActualReadsOnly');expect(r.attribution.kind).toBe('Supported');expect(r.intact.acquisitions[0].acquiredAt).toBe(3n);expect(r.shared.acquisitions[0].acquiredAt).toBe(63n);expect(r.intact.acquisitions[0].id).toBe(r.focal.acquisition);expect(r.consumed).toContainEqual({acquisition:r.shared.acquisitions[0].id,unit:'candidate'});const untouched=r.credited.find(a=>a.id===r.newer)!;expect(untouched.acquiredAt).toBe(73n);expect(untouched.units[0].useProtection).toBe(false);expect(r.consumed.some(x=>x.acquisition===r.newer)).toBe(false);expect(r.sourceCount).toBe(18);});
 it('SC-Z: removing significance or changing the concern restores the later actually used survivor',()=>{for(const r of [observedUseExperiment(range(0,100)),observedUseExperiment(range(30,40),false)]){if(r.kind!=='Completed')throw Error('completed');expect(r.attribution.kind).toBe('Supported');expect(r.intact.acquisitions[0].acquiredAt).toBe(63n);expect(r.intact).toEqual(r.shared);expect(r.credited.every(a=>a.units.every(u=>u.outcomeSignificanceDirections.length===0))).toBe(true);}});
 it('SC-AA: focal-last remains a nondiscriminating actual-use control, not a rule requiring fabricated later use',()=>{const r=observedUseExperiment(range(30,40),true,'trial/d');if(r.kind!=='Completed')throw Error('completed');expect(r.intact.acquisitions[0].acquiredAt).toBe(63n);expect(r.intact).toEqual(r.shared);expect(r.credited.find(a=>a.id===r.newer)!.units[0].useProtection).toBe(false);});
 it('SC-A: actual safe samples and goal relation feed focal credit, then distinguish retention models',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('expected composition');expect(r.qualified.kind).toBe('Qualifies');expect(r.attribution.kind).toBe('Supported');expect(r.consumed).toHaveLength(16);expect(r.credited.filter(a=>a.units[0].outcomeSignificanceDirections.length)).toHaveLength(1);expect(r.intact.acquisitions[0].id).toBe(r.focal.acquisition);expect(r.shared.acquisitions[0].id).toBe(r.newer);expect(r.withdrawn[0].status).toBe('Withdrawn');});
 it('SC-B: concern-only change or removing credit restores newer survivor with same attribution and use',()=>{const a=experiment(),b=experiment(range(0,100)),c=experiment(range(30,40),true,false);for(const r of [a,b,c])if(r.kind!=='Completed')throw Error('expected composition');if(a.kind!=='Completed'||b.kind!=='Completed'||c.kind!=='Completed')return;expect(a.attribution).toEqual(b.attribution);expect(a.consumed).toEqual(b.consumed);expect(b.qualified.kind).toBe('DoesNotQualify');expect(b.intact.acquisitions[0].id).toBe(b.newer);expect(c.intact.acquisitions[0].id).toBe(c.newer);});
 it('SC-C: lost perceived context prevents assembly although hidden fixture schedule stays unchanged',()=>{expect(experiment(range(30,40),false).kind).toBe('GroupingUnavailable');});
 it('SC-D: insufficient body recall capacity does not bypass the read gate with stored source values',()=>{expect(experiment(range(30,40),true,true,7).kind).toBe('RecallUnavailable');});
 it('SC-E: reordering retained access does not change context-bound attribution or the focal survivor',()=>{const a=experiment(),b=experiment(range(30,40),true,true,8,true);if(a.kind!=='Completed'||b.kind!=='Completed')throw Error('expected composition');expect(b.attribution).toEqual(a.attribution);expect(b.qualified).toEqual(a.qualified);expect(b.intact).toEqual(a.intact);expect(new Set(b.consumed.map(x=>`${x.acquisition}/${x.unit}`))).toEqual(new Set(a.consumed.map(x=>`${x.acquisition}/${x.unit}`)));});
 it('SC-F: one hidden neutral stage prevents grouping despite unchanged body and motion schedule',()=>{expect(experiment(range(30,40),true,true,8,false,62n).kind).toBe('GroupingUnavailable');});
 it('SC-G: independent hidden delivery can produce the same supported attribution and retention',()=>{const coupled=experiment(),scheduled=experiment(range(30,40),true,true,8,false,undefined,'scheduled');expect(scheduled).toEqual(coupled);expect(scheduled.kind).toBe('Completed');if(scheduled.kind==='Completed')expect(scheduled.attribution.kind).toBe('Supported');expect(deliveryFor('stroke-coupled',false,0)).toBe(3);expect(deliveryFor('scheduled',false,0)).toBe(13);});
 it('SC-H: absent consequence-time baseline recall cannot fall back to an earlier source sample',()=>{const r=experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',0);if(r.kind!=='Completed')throw Error('expected later attribution');expect(r.attribution.kind).toBe('Supported');expect(r.qualified.kind).toBe('QualificationUnavailable');expect(r.intact.acquisitions[0].id).toBe(r.newer);expect(r.credited.every(a=>a.units.every(u=>u.outcomeSignificanceDirections.length===0))).toBe(true);});
 it('SC-I: independent cue survives an empty completed selection which still consumes a source slot',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('expected composition');const g=r.cueGovernance;expect(g.cue).toEqual({kind:'Present',signals:['interoceptive-signal/A']});expect(g.afterCueMemory).toEqual(g.beforeCueMemory);expect(g.beforeSources).toBe(16);expect(g.afterSources).toBe(17);expect(g.beforeSuccesses).toBe(16);expect(g.afterSuccesses).toBe(16);expect(r.sourceCount).toBe(18);expect(r.attribution.kind).toBe('Supported');});
 it('SC-J: source budget includes empty cue selection, so a17-slot profile rejects the18th source',()=>{expect(()=>experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,17)).toThrow();const r=experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,18);expect(r.kind).toBe('Completed');});
 it('SC-K: actual focal consequence can name the earlier stroke; target is not the last source row',()=>{const a=experiment(),b=experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/a');if(a.kind!=='Completed'||b.kind!=='Completed')throw Error('expected composition');expect(b.attribution).toEqual(a.attribution);const consumed=(r:typeof a)=>r.consumed.map(t=>{const acquisition=r.credited.find(x=>x.id===t.acquisition)!;return {at:acquisition.acquiredAt,kind:acquisition.kind,unit:t.unit};});expect(consumed(b)).toEqual(consumed(a));expect(b.focal.acquisition).not.toBe(a.focal.acquisition);expect(b.intact.acquisitions[0].id).toBe(b.focal.acquisition);expect(b.intact.acquisitions[0].acquiredAt).toBe(3n);expect(a.intact.acquisitions[0].acquiredAt).toBe(63n);});
 it('SC-L: designating a control trial does not borrow support from the two stroke trials',()=>{const r=experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/b');if(r.kind!=='Completed')throw Error('expected composition');expect(r.attribution.kind).toBe('Unavailable');expect(r.consumed).toHaveLength(16);expect(r.credited.every(a=>a.units.every(u=>u.outcomeSignificanceDirections.length===0))).toBe(true);expect(r.intact.acquisitions[0].id).toBe(r.newer);});
 it('SC-M: hidden start or end completes empty selection but leaves too few recalled acquisitions',()=>{for(const at of [62n,63n])expect(experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',at)).toMatchObject({kind:'EventRecallUnavailable',sourceCount:17,successCount:15});});
 it('SC-N: seven event recall slots cannot be bypassed by reading all eight retained acquisitions',()=>{expect(experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',undefined,7).kind).toBe('EventRecallUnavailable');});
 it('SC-O: hidden ninth visual cue cannot be reconstructed from the surviving marker file',()=>{expect(experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',71n).kind).toBe('EventRecallUnavailable');});
 it('SC-P: hidden role cannot be recovered from unchanged position/panel truth',()=>{expect(experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',undefined,8,62n)).toMatchObject({kind:'EventRecallUnavailable',sourceCount:17,successCount:15});});
 it('SC-Q: changing the hidden world marker identity cannot change observer files or downstream memory',()=>{expect(experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',undefined,8,undefined,'object/renamed-hidden-marker')).toEqual(experiment());});
 it('SC-R: unavailable visual and panel can complete empty selection without fabricating an experience',()=>{expect(experiment(range(30,40),false,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',62n)).toMatchObject({kind:'EventRecallUnavailable',sourceCount:17,successCount:15});});
 it('SC-S: unavailable competing observation or role cannot be replaced by literal retained bytes',()=>{for(const [position,role] of [[73n,undefined],[undefined,73n]])expect(experiment(range(30,40),true,true,8,false,undefined,'stroke-coupled',8,32,'trial/d',position,8,role)).toMatchObject({kind:'CompetitorUnavailable',sourceCount:18,successCount:16});});
 it('SC-T: the newer competitor contains actual tenth-source evidence and an allocated acquisition',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('completed');const newer=r.credited.find(a=>a.id===r.newer)!;expect(newer.acquiredAt).toBe(73n);const view=decodeView(newer.units[0].views[0]);expect(view.payload).toEqual([2,0]);expect(view.experience.occurredAt).toBe(73n);expect(newer.units[0].outcomeSignificanceDirections).toEqual([]);expect(newer.id).not.toBe(r.focal.acquisition);});
 it('SC-U: each visual formation source references its actual audit occurrence and cue-only sensing adds none',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('completed');expect(r.visualAudits).toHaveLength(9);const ids=r.visualAudits.map(v=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('audit');expect(v.schema.typeId).toBe(532n);const id=v.fields.get(1n);if(typeof id==='boolean'||id?.kind!=='typedIdentifier'||typeof id.payload==='boolean'||id.payload.kind!=='unsigned')throw Error('id');expect(id.namespaceId).toBe(1143n);return id.payload.value;});expect(new Set(ids).size).toBe(9);expect(new Set(r.formationSources.filter(s=>s.startsWith('visual-selection/')))).toEqual(new Set(ids.map(id=>`visual-selection/1143/${id}`))); });
 it('SC-X: one admitted current opportunity supports both cues with independent selection accounting',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('completed');expect(r.sourcePlan).toMatchObject({observations:18,visualSweeps:10,panelSweeps:16,qualifiedSelectionSlots:18});expect(r.sharedCueExperience).toBe(r.bodyCueExperience);expect(r.sourceCount).toBe(18);});
 it('SC-W: the pending deadline preserves withdrawal and the earlier frozen qualification',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('completed');expect(r.deadline.kind).toBe('AlreadyWithdrawn');expect(r.deadline.state).toEqual(r.withdrawn);expect(r.deadline.state[0].changedAt).toBe(70n);expect(r.qualified.kind).toBe('Qualifies');});
 it('SC-V: preparation uses explicit earlier external inputs, not same-instant hidden-state repair',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('completed');expect(r.physicalInputs).toEqual([{at:4n,delivery:13},{at:20n,delivery:7},{at:24n,delivery:3},{at:40n,delivery:17},{at:44n,delivery:3},{at:60n,delivery:17},{at:64n,delivery:13}]);const before=r.credited.filter(a=>a.kind==='Interoceptive').flatMap(a=>a.units.flatMap(u=>u.views.map(decodeView))).filter(v=>v.role==='Before');expect(before).toHaveLength(4);expect(before.map(v=>v.payload)).toEqual(Array.from({length:4},()=>[20,21]));});
 it('SC-AC: all body formations and the empty cue selector use actual distinct1143 audits',()=>{const r=experiment();if(r.kind!=='Completed')throw Error('completed');expect(r.bodyAudits).toHaveLength(9);const ids=r.bodyAudits.map(a=>{expect(a.selection.namespaceId).toBe(1143n);if(typeof a.selection.payload==='boolean'||a.selection.payload.kind!=='unsigned')throw Error('identity');return a.selection.payload.value;});expect(new Set(ids).size).toBe(9);expect(r.bodyAudits.at(-1)!.rows.map(x=>x.disposition)).toEqual(['Capacity']);expect(new Set(r.formationSources.filter(s=>s.startsWith('body-selection/')))).toEqual(new Set(ids.map(id=>'body-selection/1143/'+id)));expect(r.formationSources.some(s=>s.startsWith('fixture-selection/'))).toBe(false);});

});
