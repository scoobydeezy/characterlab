import {describe,it,expect} from 'vitest';
import {createTrialPanelPerception,consumeTrialPanel,consumeTrialPanelAndVisual,consumeUncontextualizedVisualCue,trialPanelPerceptionSnapshot} from '../campaign3/trialPanelPerception';
import {assertAdmittedTransformationVersion} from '../semanticBinding/semanticCodecs';
const observer='observer/a';
const visual=(at:bigint)=>({observer,observation:at*10n+1n,detection:at*10n+2n,at});
const panel=(at:bigint,stage:'Before'|'After')=>({observer,observation:at*10n,detection:at*10n+2n,sample:{kind:'Present' as const,at,glyph:0,stage}});
describe('visual cue event component',()=>{
 it('VCE-A: one owner allocates a new ended cue without fabricating a panel observation',()=>{
  const token=createTrialPanelPerception(observer);consumeTrialPanel(token,panel(1n,'Before'));consumeTrialPanel(token,panel(2n,'After'));
  const before=trialPanelPerceptionSnapshot(token),cue=consumeUncontextualizedVisualCue(token,visual(3n)),after=trialPanelPerceptionSnapshot(token);
  expect(cue.transition.perceptualEventReferentId.observerEventSequence).toBe(1n);
  expect(cue.end.perceptualEventReferentId).toEqual(cue.transition.perceptualEventReferentId);
  expect(after.observations).toEqual(before.observations);expect(after.window).toBeUndefined();expect(after.files.activeEventFiles).toEqual([]);
  expect(cue.transition.supportingObservationIds).toEqual([{observerId:observer,observationId:31n}]);
  (cue.transition.perceptualEventReferentId as {observerEventSequence:bigint}).observerEventSequence=99n;
  expect(trialPanelPerceptionSnapshot(token)).toEqual(after);
 });
 it('VCE-B: unsampled active context cannot be borrowed or closed',()=>{
  const token=createTrialPanelPerception(observer);consumeTrialPanel(token,panel(1n,'Before'));const before=trialPanelPerceptionSnapshot(token);
  expect(()=>consumeUncontextualizedVisualCue(token,visual(2n))).toThrow('UNSAMPLED_ACTIVE_CONTEXT');expect(trialPanelPerceptionSnapshot(token)).toEqual(before);
 });
 it('VCE-C: observer, time and both replay domains reject without publication',()=>{
  const token=createTrialPanelPerception(observer);consumeTrialPanel(token,panel(1n,'After'));consumeUncontextualizedVisualCue(token,visual(2n));const before=trialPanelPerceptionSnapshot(token),v=visual(3n);
  for(const bad of [{...v,observer:'foreign'},{...v,at:2n},{...v,observation:10n},{...v,observation:21n},{...v,detection:22n}]){
   expect(()=>consumeUncontextualizedVisualCue(token,bad)).toThrow();expect(trialPanelPerceptionSnapshot(token)).toEqual(before);
  }
 });
 it('VCE-D: all panel, fallback and cue outputs name their accepted SEM transformation',()=>{
  const token=createTrialPanelPerception(observer),a=consumeTrialPanel(token,panel(1n,'Before'));
  const b=consumeTrialPanelAndVisual(token,{observer,observation:20n,sample:{kind:'Unavailable',at:2n}},visual(2n));
  const c=consumeUncontextualizedVisualCue(token,visual(3n));
  for(const output of [a.transition!,...a.ends,b.visualEventTransition!,...b.ends,c.transition,c.end]){
   expect(output.transformationVersion).toBe('semantic-binding/0.1-candidate#SEM-001C');
   expect(()=>assertAdmittedTransformationVersion(output.transformationVersion)).not.toThrow();
  }
 });
});
