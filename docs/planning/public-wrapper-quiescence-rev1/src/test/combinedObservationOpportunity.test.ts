import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {text,typedIdentifier,canonicalEncode} from '../substrate/canonicalEncoding';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {createTrialPanelSource} from '../campaign3/trialPanelSource';
import {createNineFramePositionDisplaySource} from '../campaign3/positionDisplaySource';
import {createTrialPanelPerception,trialPanelPerceptionSnapshot} from '../campaign3/trialPanelPerception';
import {createNineSweepMarkerTransactionManager,committedMarkerSnapshot} from '../campaign3/transactionalMarkerTracking';
import {observeCombinedOpportunity} from '../campaign3/combinedObservationOpportunity';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
const observer=typedIdentifier(1000,text('observer/a')),q=(n:number)=>Q.of(BigInt(n));
function source(p=true,v=true,b=true){return {
 body:createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(0),amount:q(0),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:q(1),available:b,permitted:true}))),
 panel:createTrialPanelSource([{at:1n,glyph:0,stage:'Before',visible:p,permitted:true}]),
 display:createNineFramePositionDisplaySource(Array.from({length:9},(_,i)=>({at:BigInt(i+1),x:0n,y:0n,glyph:0n,visible:v,permitted:true}))),
 perception:createTrialPanelPerception('observer/a'),tracker:createNineSweepMarkerTransactionManager('observer/a')};}
const snapshot=(s:ReturnType<typeof source>)=>({panel:trialPanelPerceptionSnapshot(s.perception),marker:committedMarkerSnapshot(s.tracker)});
const run=(s:ReturnType<typeof source>,allocate:()=>bigint,lane:'Current'|'Consequence'='Current',at=1n)=>observeCombinedOpportunity(s.body,s.panel,s.display,s.perception,s.tracker,observer,at,['channel/A'],lane,allocate);
describe('actual combined panel/visual/body source',()=>{
 it('CO-A: all eight presence combinations obey one reservation and one event-detection rule in both lanes',()=>{
  for(const lane of ['Current','Consequence'] as const)for(const p of [false,true])for(const v of [false,true])for(const b of [false,true]){
   const s=source(p,v,b);let n=0n;const r=run(s,()=>n++,lane),any=p||v||b;
   expect(n).toBe(3n+(p||v?1n:0n)+(v?2n:0n)+(any?1n:0n));expect(r.opportunityId!==null).toBe(any);expect(r.eventDetection!==undefined).toBe(p||v);
   expect(r.staged?.stagedAtPhase).toBe(any?(lane==='Current'?14n:124n):undefined);
   expect(r.staged?.experience.supportingObservationIds.map(s=>s.observationId)??[]).toEqual([...(b?[0n]:[]),...(p?[1n]:[]),...(v?[2n]:[])]);
   expect(r.tracks).toHaveLength(v?1:0);expect(r.staged?.experience.perceivedBindings.length??0).toBe(v?1:0);expect(r.context!==undefined).toBe(p);
   if(r.staged){const bytes=canonicalEncode(preRecognitionSemanticExperienceValue(r.staged.experience));expect(canonicalEncode(decodeSemanticValue(bytes))).toEqual(bytes);}
  }
 });
 it('CO-B: position and panel never manufacture an Actor role',()=>{const s=source();let n=0n;const r=run(s,()=>n++);expect(r.staged!.experience.perceivedBindings.map(b=>b.eventRoleEvidence)).toEqual([{kind:'unresolved'}]);expect(r.perceived.visualEventTransition).toEqual(r.perceived.transition);expect(r.staged!.experience.perceptualEventReferentIds).toHaveLength(1);});
 it('CO-C: failure at every allocation leaves both local owners unchanged and retry uses the same identities',()=>{
  const fresh=source();let next=0n;const expected=run(fresh,()=>next++);
  for(let failAt=0;failAt<7;failAt++){const s=source(),before=snapshot(s);let n=0;expect(()=>run(s,()=>n===failAt?-1n:BigInt(n++))).toThrow();expect(snapshot(s)).toEqual(before);let retry=0n;expect(run(s,()=>retry++)).toEqual(expected);}
 });
 it('CO-D: failed unavailable-panel fallback cannot close the prior context or advance marker continuity',()=>{
  const s=source();let n=0n;run(s,()=>n++);const before=snapshot(s);let calls=0;
  expect(()=>run(s,()=>calls++===6?-1n:n++,'Current',2n)).toThrow();expect(snapshot(s)).toEqual(before);
 });
 it('CO-E: returned perception products cannot alter committed local owners',()=>{
  const s=source();let n=0n;const r=run(s,()=>n++),before=snapshot(s);(r.tracks[0].perceptualReferentId as {observerTrackSequence:bigint}).observerTrackSequence=99n;(r.context!.context as {observerEventSequence:bigint}).observerEventSequence=99n;expect(snapshot(s)).toEqual(before);
 });
});
