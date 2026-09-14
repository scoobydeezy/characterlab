import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {text,typedIdentifier,canonicalEncode} from '../substrate/canonicalEncoding';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {observeLocalReserveOpportunity} from '../campaign3/localReserveObservation';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {createTrialPanelSource} from '../campaign3/trialPanelSource';
import {createTrialPanelPerception,trialPanelPerceptionSnapshot} from '../campaign3/trialPanelPerception';
import {observePanelBodyOpportunity} from '../campaign3/panelBodyOpportunity';
import {selectLocalReserveSignals,consumeInteroceptiveSignals} from '../campaign3/interoceptiveSignalSelection';
import {admitLocalReserveSignalCue} from '../campaign3/bodySignalCue';
const q=(n:number)=>Q.of(BigInt(n)),observer=typedIdentifier(1000,text('observer/a'));
function sources(p:boolean,b:boolean){return {body:createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100),rate:q(0),amount:q(0),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:q(1),available:b,permitted:true}))),panel:createTrialPanelSource([{at:1n,glyph:0,stage:'Before',visible:p,permitted:true}]),perception:createTrialPanelPerception('observer/a')};}
const limits={maxSignals:1,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity:0};
describe('one panel/body experience reservation',()=>{
 it('PB-E: every emitted body-only or panel/body experience is admitted by the frozen SEM codec',()=>{
  for(const lane of ['Current','Consequence'] as const)for(const p of [false,true])for(const b of [false,true]){
   const s=sources(p,b);let n=0n;const outputs=[observePanelBodyOpportunity(s.body,s.panel,s.perception,observer,1n,['channel/A'],lane,()=>n++),observeLocalReserveOpportunity(s.body,observer,1n,['channel/A'],lane,()=>n++)];
   for(const output of outputs)if(output.staged){const x=output.staged.experience;expect(x.transformationVersion).toBe('semantic-binding/0.1-candidate#SEM-001H');const bytes=canonicalEncode(preRecognitionSemanticExperienceValue(x));expect(canonicalEncode(decodeSemanticValue(bytes))).toEqual(bytes);}
  }
 });
 it('PB-A: four actual presence branches in both lanes reserve zero or exactly one experience',()=>{for(const lane of ['Current','Consequence'] as const)for(const p of [false,true])for(const b of [false,true]){const s=sources(p,b);let n=0n;const r=observePanelBodyOpportunity(s.body,s.panel,s.perception,observer,1n,['channel/A'],lane,()=>n++);expect(n).toBe(2n+(p?1n:0n)+(p||b?1n:0n));expect(r.opportunityId===null).toBe(!p&&!b);expect(r.staged?.stagedAtPhase).toBe(p||b?(lane==='Current'?14n:124n):undefined);expect(r.staged?.experience.supportingObservationIds.map(s=>s.observationId)??[]).toEqual([...(b?[0n]:[]),...(p?[1n]:[])]);expect(r.staged?.experience.perceptualEventReferentIds.length??0).toBe(p?1:0);expect(r.context?.experience).toBe(p?r.opportunityId:undefined);}});
 it('PB-B: shared experience does not force body presence or selection, and cue remains independent',()=>{for(const p of [false,true])for(const b of [false,true]){const s=sources(p,b);let n=0n;const r=observePanelBodyOpportunity(s.body,s.panel,s.perception,observer,1n,['channel/A'],'Current',()=>n++);expect(consumeInteroceptiveSignals(selectLocalReserveSignals(r,limits).view)).toMatchObject({opportunityId:r.opportunityId,groups:[]});expect(admitLocalReserveSignalCue(r,1n,true).cue.kind).toBe(b?'Present':'Absent');}});
 it('PB-C: failed reservation cannot publish the prepared panel context',()=>{const s=sources(true,true),before=trialPanelPerceptionSnapshot(s.perception);let n=0n;expect(()=>observePanelBodyOpportunity(s.body,s.panel,s.perception,observer,1n,['channel/A'],'Current',()=>n++===3n?-1n:n-1n)).toThrow('PANEL_BODY_ALLOCATION');expect(trialPanelPerceptionSnapshot(s.perception)).toEqual(before);});
 it('PB-D: a returned context cannot edit the actual committed owner',()=>{const s=sources(true,true);let n=0n;const r=observePanelBodyOpportunity(s.body,s.panel,s.perception,observer,1n,['channel/A'],'Current',()=>n++),before=trialPanelPerceptionSnapshot(s.perception);(r.context!.context as {observerEventSequence:bigint}).observerEventSequence=99n;(r.perceived.context! as {observerEventSequence:bigint}).observerEventSequence=98n;expect(trialPanelPerceptionSnapshot(s.perception)).toEqual(before);});
});
