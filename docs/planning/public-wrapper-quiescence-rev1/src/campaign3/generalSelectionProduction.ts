/** Internal canonical adapters for the accepted visual/body selection and formation
 * components. Runtime authenticates the completed source; one-use component views
 * remain the only route from selection to encoding and acquisition production. */
import {canonicalEncode as enc,list,signed,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as identity,dataUnsigned as uint,dataText as txt,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {perceptualReferentIdValue,perceptualEventReferentIdValue,currentDetectionIdValue} from '../semanticBinding/semanticCodecs';
import type {StagedSemanticExperience} from '../semanticBinding/phaseOrdering';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import type {CausalRoleEvidence} from '../semanticBinding/evidenceProvenance';
import {generalRecord as r,generalDefinitionId as d,generalSubject,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {exact,atom} from './embodiedMath';
import {prepareVisualFormation,prepareVisualFormationEqualPriorityControl,prepareVisualFormationUnlimitedControl,encodeVisualFormationWithCalibration,encodeVisualFormationWithAllocationControl,encodeVisualFormationWithPriorConcern,produceVisualFormationEvidence,closeVisualFormation} from './visualFormationEvidence';
import {generalDeliveredConcern,generalConcernModulation} from './generalConcernProduction';
import {selectCanonicalVisual,selectCanonicalVisualEqualPriorityControl,selectCanonicalVisualUnlimitedControl} from './canonicalVisualSelection';
import {closeSelectedView} from './attentionSelection';
import {bindSpatialEvidence,type SpatialEvidenceBindingInput} from './spatialEvidenceBinding';
import {projectPositive} from './positiveSpatialCandidate';
import {selectCanonicalBody,produceCanonicalBodyFormation,canonicalPerceivedTrialContext} from './canonicalBodyProduction';
import {closeContextualBody} from './contextualBodySelection';
import type {PerceivedTrialContext} from './perceivedTrialContext';
import type {compileGeneralTrackingStage} from './generalTrackingStage';
type Tracking=ReturnType<ReturnType<ReturnType<typeof compileGeneralTrackingStage>['prepare']>['result']>;
export interface GeneralSelectionSource {readonly samples:CanonicalValue;readonly tracking:Tracking;readonly staged?:StagedSemanticExperience;readonly claims:readonly CausalRoleEvidence[]}
type EncodingUnit=ReturnType<typeof projectPositive>['candidate']['units'][number];
const context=generalBindingContext(),who=generalSubject(),observer=txt(identity(who.observer).payload);
const occurrence=(ns:number,n:bigint)=>typedIdentifier(ns,u(n));
const ordinal=(value:CanonicalValue)=>uint(identity(value).payload);
const unit=(v:EncodingUnit['unit'])=>r(530,[perceptualEventReferentIdValue(v.perceptualEventReferentId),perceptualReferentIdValue(v.perceptualReferentId)]);
const factors=(v:EncodingUnit['factors'])=>r(617,[atom(v.base),atom(v.role),atom(v.attention),atom(v.raw)]);
function witness(v:ReturnType<typeof bindSpatialEvidence>[number]){return r(612,new Map<bigint,CanonicalValue>([[1n,unit(v.unit)],[2n,currentDetectionIdValue(observer,v.detectionId)],...(v.spatialClass==='SpatialUnknown'?[]:[[3n,r(608,[u(v.position.x),u(v.position.y)])] as [bigint,CanonicalValue]]),[4n,u(['SpatialFocal','SpatialPeripheral','SpatialUnknown'].indexOf(v.spatialClass)+1)],[5n,u(v.peripheralCount)]]));}
function encoding(v:EncodingUnit){return r(620,[unit(v.unit),list(v.bindings.map(b=>decode(b,context))),list(v.claims.map(b=>decode(b,context))),factors(v.factors),atom(v.strength),witness(v.spatialWitness)]);}
function companion(source:GeneralSelectionSource):PerceivedTrialContext|undefined {
 const s=rec(source.samples,656n),p=s.fields.get(5n),event=source.tracking.perceived?.context;
 if(!source.staged||!event||typeof p==='boolean'||!p||p.kind!=='record'||p.schema.typeId!==542n)return undefined;
 return {experience:source.staged.experience.experienceId,context:event,panel:{observation:ordinal(f(p,1n)),sample:{kind:'Present',at:source.staged.experience.occurredAt,glyph:Number(uint(f(p,4n))),stage:(['Before','Motion','After'] as const)[Number(uint(f(p,5n)))-1]}}};
}
/** Canonical carriage from the same completed source used by the producers. */
export function generalOpportunityEvidence(source:GeneralSelectionSource,trackingOutputs:readonly CanonicalValue[]){
 const samples=rec(source.samples,656n),contextValue=companion(source),contextRecord=contextValue?canonicalPerceivedTrialContext(contextValue):undefined;
 const experience=source.staged?preRecognitionSemanticExperienceValue(source.staged.experience):undefined;
 const body=samples.fields.has(4n)?rec(f(samples,4n),654n):undefined,visual=samples.fields.get(6n);
 const tracks=trackingOutputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===217n);
 const event=source.tracking.perceived?.visualEventTransition??source.tracking.perceived?.transition;
 const eventRecord=event?trackingOutputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===219n&&key(f(v,3n))===key(perceptualEventReferentIdValue(event.perceptualEventReferentId))):undefined;
 return {
  body:body?r(599,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,f(samples,2n)],[3n,f(body,3n)],...(experience?[[4n,experience] as [bigint,CanonicalValue]]:[]),[5n,f(body,4n)],...(contextRecord?[[6n,contextRecord] as [bigint,CanonicalValue]]:[])])):undefined,
  visual:visual?r(611,new Map<bigint,CanonicalValue>([[1n,visual],[2n,list(tracks)],...(eventRecord?[[3n,eventRecord] as [bigint,CanonicalValue]]:[]),...(experience?[[4n,experience] as [bigint,CanonicalValue]]:[]),...(contextRecord?[[5n,contextRecord] as [bigint,CanonicalValue]]:[])])):undefined,
 };
}
function admitted(source:GeneralSelectionSource){
 const samples=rec(decode(enc(source.samples),context),656n);if(key(f(samples,1n))!==key(who.observer))fail('GA selection source observer');
 const at=(f(samples,2n) as Extract<CanonicalValue,{kind:'signed'}>).value;
 if(source.staged&&(source.staged.experience.observerId!==observer||source.staged.experience.occurredAt!==at||ordinal(f(samples,8n))!==source.staged.experience.experienceId))fail('GA selection experience association');
 return {samples,at};
}
export function compileGeneralSelectionProduction(definitions:ReadonlyMap<string,RecordValue>,allocation='Spatial'){
 const definition=(name:string,type:bigint)=>rec(decode(enc(f(definitions.get(key(d(name)))??fail('GA selection definition'),4n)),context),type);
 const spatial=definition('spatial',687n),policy=definition('visual-selection',519n),budget=definition('encoding',688n),body=definition('body-selection',696n),feedbackPolicy=definition('feedback',694n);
 const calibration={minX:uint(f(spatial,1n)),maxX:uint(f(spatial,2n)),minY:uint(f(spatial,3n)),maxY:uint(f(spatial,4n)),focalWeight:exact(f(spatial,5n)),residualPool:exact(f(spatial,6n))};
 const encodingCalibration={law:(['independent','historical-shared','historical-hybrid','retired-flat'] as const)[Number(uint(f(budget,1n)))-1],budget:exact(f(budget,2n)),threshold:exact(f(budget,3n))};
 const algorithm=Number(uint(f(policy,1n)))-1,capacity=Number(uint(f(policy,2n))) as 0|1|2;
 return Object.freeze({
  visual(source:GeneralSelectionSource,allocate:()=>bigint){
   const {samples,at}=admitted(source),visual=rec(f(samples,6n),610n),detections=items(f(visual,5n),'list'),contextValue=companion(source),contextRecord=contextValue?canonicalPerceivedTrialContext(contextValue):undefined;
   const event=source.tracking.perceived?.visualEventTransition??source.tracking.perceived?.transition;
   let prepared:ReturnType<typeof prepareVisualFormation>|undefined,empty:ReturnType<typeof selectCanonicalVisual>|undefined,spatialWitnesses:ReturnType<typeof bindSpatialEvidence>=[];
   if(detections.length){
    if(!source.staged||!event)fail('GA visual missing completed experience/event');
    const input:SpatialEvidenceBindingInput={observation:{observerId:observer,observationId:ordinal(f(visual,1n)),occurredAt:at,eventDetectionId:ordinal(f(rec(f(visual,4n),215n),2n)),detections:detections.map(v=>{const row=rec(v,609n),position=row.fields.has(4n)?rec(f(row,4n),608n):undefined;return {detectionId:ordinal(f(rec(f(row,1n),214n),2n)),...(position?{position:{x:uint(f(position,1n)),y:uint(f(position,2n))}}:{})};})},tracks:source.tracking.tracks,event,experience:source.staged.experience};
    spatialWitnesses=bindSpatialEvidence(input,calibration);
    prepared=[prepareVisualFormation,prepareVisualFormationEqualPriorityControl,prepareVisualFormationUnlimitedControl][algorithm](input,source.claims,capacity,calibration,contextValue,allocate);
   }else empty=[selectCanonicalVisual,selectCanonicalVisualEqualPriorityControl,selectCanonicalVisualUnlimitedControl][algorithm]({kind:'NoDetection',observation:{observerId:observer,observationId:ordinal(f(visual,1n)),occurredAt:at,detections:[]}},capacity,allocate);
   const selected=prepared??empty!,selectedKeys=new Set(items(f(rec(selected.selected,534n),4n),'list').map(v=>key(f(rec(v,533n),1n))));
   const extended=r(615,new Map<bigint,CanonicalValue>([[1n,selected.selected],[2n,list(spatialWitnesses.filter(w=>selectedKeys.has(key(unit(w.unit)))).map(witness))],...(contextRecord?[[3n,contextRecord] as [bigint,CanonicalValue]]:[])]));
   const join=r(616,[who.observer,extended,d('encoding')]);let phase:'selected'|'encoded'|'closed'='selected',encoded:ReturnType<typeof encodeVisualFormationWithCalibration>|ReturnType<typeof encodeVisualFormationWithPriorConcern>|ReturnType<typeof encodeVisualFormationWithAllocationControl>|undefined,children:CanonicalValue[]=[];
   return Object.freeze({
    outputs:()=>[decode(enc(selected.audit),context),decode(enc(extended),context)],
    encode(delivery?:CanonicalValue){if(phase!=='selected')fail('GA visual encoding lifecycle');phase='encoded';
     const carry=delivery?generalDeliveredConcern(delivery,at):undefined,feedback=carry?generalConcernModulation(carry,at,f(feedbackPolicy,1n)===true):undefined;
     if(allocation!=='Spatial'&&f(feedbackPolicy,1n)===true)fail('GA nonspatial feedback control unsupported');
     encoded=prepared?(allocation!=='Spatial'?encodeVisualFormationWithAllocationControl(prepared.view,encodingCalibration,allocation==='RoleCalibrated'?'role-calibrated':'disabled-attention'):carry?encodeVisualFormationWithPriorConcern(prepared.view,encodingCalibration.law,carry,who.character,f(feedbackPolicy,1n)===true,encodingCalibration):encodeVisualFormationWithCalibration(prepared.view,encodingCalibration)):undefined;if(empty)closeSelectedView(empty.view);
     const rows=encoded?.evaluation.rows??[],positive=encoded?projectPositive(encoded.evaluation).candidate.units:[];
     children=positive.map(v=>r(544,contextRecord?[encoding(v),contextRecord]:[encoding(v)]));
     const evaluation=r(619,[join,list(rows.map(row=>r(618,new Map<bigint,CanonicalValue>([[1n,unit(row.witness.unit)],[2n,u(['Positive','KnownZero','UnavailableAllocation'].indexOf(row.status)+1)],...('factors'in row&&row.factors?[[3n,factors(row.factors)] as [bigint,CanonicalValue]]:[]),...('strength'in row&&row.strength?[[4n,atom(row.strength)] as [bigint,CanonicalValue]]:[])]))))]);
     const candidate=r(621,[occurrence(1143,selected.selectionId),who.observer,signed(at),d('encoding'),list(children)]);
     return [delivery?r(641,[evaluation,delivery,feedback!.value]):evaluation,candidate].map(v=>decode(enc(v),context));
    },
    form(allocate:()=>bigint){if(phase!=='encoded')fail('GA visual formation lifecycle');phase='closed';
     const actual=encoded?produceVisualFormationEvidence(encoded.view,allocate):{kind:'NoFormation' as const,selectionId:selected.selectionId};
     if(actual.kind==='NoFormation'){if(children.length)fail('GA visual candidate/formation mismatch');return [];}
     const e=actual.evidence,actualChildren=e.content.children.map(c=>r(544,c.context?[encoding(c.encoding),canonicalPerceivedTrialContext(c.context)]:[encoding(c.encoding)]));
     if(key(list(actualChildren))!==key(list(children)))fail('GA visual positive producer mismatch');
     return [decode(enc(r(549,[occurrence(1145,e.acquisitionId),e.observer,signed(e.at),occurrence(1143,e.sourceSelectionId),text(e.transformationVersion),r(547,[d('encoding'),list(actualChildren)])])),context)];
    },
    close(){if(prepared)closeVisualFormation(prepared.view);if(encoded)closeVisualFormation(encoded.view);if(empty)closeSelectedView(empty.view);phase='closed';},
   });
  },
  body(source:GeneralSelectionSource,allocate:()=>bigint){
   const {samples,at}=admitted(source),b=rec(f(samples,4n),654n),contextValue=companion(source),contextRecord=contextValue?canonicalPerceivedTrialContext(contextValue):undefined;
   const declarations=items(f(b,4n),'set').map(v=>{const row=rec(v,598n);return {channel:identity(f(row,1n)),signal:txt(identity(f(row,2n)).payload)};});
   const selected=selectCanonicalBody({observer:who.observer,at,opportunityId:source.staged?.experience.experienceId??null,samples:items(f(b,3n),'list'),declarations,staged:source.staged,context:contextValue},{maxSignals:Number(uint(f(body,1n))),maxViewsPerSignal:Number(uint(f(body,2n))),maxBytesPerSignal:Number(uint(f(body,3n))),capacity:Number(uint(f(body,4n)))},allocate);
   const selectedSignals=items(f(selected.audit,5n),'list').map(v=>rec(v,602n)).filter(v=>uint(f(v,3n))===1n).map(v=>f(v,1n));
   const groups=selectedSignals.map(signal=>r(546,[signal,list(items(f(b,3n),'list').filter(v=>{const sample=rec(v,(v as RecordValue).schema.typeId);return sample.schema.typeId===461n&&declarations.some(d=>key(d.channel)===key(f(sample,3n))&&d.signal===txt(identity(signal).payload));}).sort((a,b)=>key(a)<key(b)?-1:key(a)>key(b)?1:0).map(sample=>r(545,contextRecord?[sample,contextRecord]:[sample])))]));
   const view=r(604,new Map<bigint,CanonicalValue>([[1n,f(selected.audit,1n)],[2n,who.observer],[3n,signed(at)],...(source.staged?[[4n,occurrence(1106,source.staged.experience.experienceId)] as [bigint,CanonicalValue]]:[]),[5n,list(groups)]]));let closed=false;
   return Object.freeze({outputs:()=>[decode(enc(selected.audit),context),decode(enc(view),context)],form(allocate:()=>bigint){if(closed)fail('GA body formation lifecycle');closed=true;const actual=produceCanonicalBodyFormation(selected.view,allocate);if(actual.kind==='NoFormation'){if(groups.length)fail('GA body candidate/formation mismatch');return [];}
    if(key(f(rec(f(actual.evidence,6n),548n),1n))!==key(list(groups)))fail('GA body positive producer mismatch');return [decode(enc(actual.evidence),context)];},close(){closeContextualBody(selected.view);closed=true;}});
  },
 });
}
