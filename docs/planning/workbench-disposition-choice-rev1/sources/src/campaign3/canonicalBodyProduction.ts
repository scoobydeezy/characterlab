/** general-attention-body-production/0.1-candidate. Actual component capabilities;
 * source/profile authentication and scheduler transactions remain upstream. */
import {list,signed,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {observerIdValue,perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {generalAttentionRecord as record,generalAttentionRawRecord as raw} from './generalAttentionCodecs';
import {selectContextualBody,closeContextualBody,type ContextualBodyInput,type ContextualBodyView} from './contextualBodySelection';
import {produceBodyFormationEvidence,BODY_FORMATION_EVIDENCE_VERSION} from './bodyFormationEvidence';
import {copyPerceivedTrialContext,type PerceivedTrialContext} from './perceivedTrialContext';
import type {SignalGateLimits} from './interoceptiveSignalSelection';
const panelVersion='trial-panel-source-component/0.1-candidate';
const grammar={admittedVersions:[panelVersion,BODY_FORMATION_EVIDENCE_VERSION]};
/** Representation of a previously bound safe context; this grants no live-source authority. */
export function canonicalPerceivedTrialContext(input:PerceivedTrialContext){
 const c=copyPerceivedTrialContext(input),p=c.panel.sample;
 return record('PerceivedTrialContextEvidence',[typedIdentifier(1106,unsigned(c.experience)),perceptualEventReferentIdValue(c.context),record('TrialPanelPresentObservation',[
  typedIdentifier(1115,unsigned(c.panel.observation)),observerIdValue(c.context.observerId),signed(p.at),unsigned(p.glyph),unsigned(['Before','Motion','After'].indexOf(p.stage)+1),text(panelVersion)
 ],grammar)],grammar);
}
export function selectCanonicalBody(input:ContextualBodyInput,limits:SignalGateLimits,allocate:()=>bigint){
 const selected=selectContextualBody(input,limits,allocate);
 try{
  const a=selected.audit,fields=new Map<bigint,CanonicalValue>([[1n,a.selection],[2n,a.observer],[3n,signed(a.at)],
   [5n,list(a.rows.map(row=>record('BodySelectionAuditRow',[typedIdentifier(1045,text(row.signal)),unsigned(row.views),unsigned(['Selected','Capacity','Unavailable'].indexOf(row.disposition)+1)])))]]);
  if(a.opportunity!==null)fields.set(4n,typedIdentifier(1106,unsigned(a.opportunity)));
  return {selectionId:selected.selectionId,audit:raw('BodySelectionAudit',fields),view:selected.view};
 }catch(error){closeContextualBody(selected.view);throw error;}
}
export function produceCanonicalBodyFormation(view:ContextualBodyView,allocate:()=>bigint){
 const produced=produceBodyFormationEvidence(view,allocate);
 if(produced.kind==='NoFormation')return produced;
 const e=produced.evidence;
 const children=e.content.children.map(c=>record('PositiveBodySignalGroup',[typedIdentifier(1045,text(c.signal)),list(c.views.map(v=>record('RetainedBodyView',v.context===undefined?[v.sample]:[v.sample,canonicalPerceivedTrialContext(v.context)],grammar)))],grammar));
 const content=record('PositiveBodyAcquisitionContent',[list(children)],grammar);
 return {kind:'Formation' as const,evidence:record('AcquisitionFormationEvidence',[typedIdentifier(1145,unsigned(e.acquisitionId)),e.observer,signed(e.at),typedIdentifier(1143,unsigned(e.sourceSelectionId)),text(e.transformationVersion),content],grammar)};
}
