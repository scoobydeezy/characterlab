import {describe,it,expect} from 'vitest';
import {admitObservationLane,freezeAndStageSemanticExperience,validateSuccessfulExperienceSettlement,PhaseOrderingContractError,type ExperienceReservation} from '../semanticBinding/phaseOrdering';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
const observerId='observer/fixture';
const assemble=(r:ExperienceReservation,observations:bigint[])=>assemblePreRecognitionExperience({experienceId:r.experienceId,observerId,occurredAt:1n,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:observations.map(observationId=>({observerId,observationId})),transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
describe('existing SEM opportunity identity reuse: component feasibility',()=>{
 it('SO-D: current and consequence sensing at one instant have separate identities and lane freezes',()=>{
  let next=10n;
  const current=admitObservationLane({observerId,lane:'Current',dueAt:1n,emitsCharacterAccessibleEvidence:true},()=>next++).reservation!;
  const consequence=admitObservationLane({observerId,lane:'Consequence',dueAt:1n,emitsCharacterAccessibleEvidence:true},()=>next++).reservation!;
  const a=freezeAndStageSemanticExperience(current,assemble(current,[1n]),14n);
  const b=freezeAndStageSemanticExperience(consequence,assemble(consequence,[2n]),124n);
  expect(current.experienceId).not.toBe(consequence.experienceId);
  expect(a.experience.occurredAt).toBe(b.experience.occurredAt);
  expect(()=>validateSuccessfulExperienceSettlement([current,consequence],[a,b])).not.toThrow();
  expect(()=>freezeAndStageSemanticExperience(consequence,assemble(consequence,[2n]),14n)).toThrow(PhaseOrderingContractError);
 });
 it('SO-E: reusing the current experience identity for consequence sensing rejects at settlement',()=>{
  const current=admitObservationLane({observerId,lane:'Current',dueAt:1n,emitsCharacterAccessibleEvidence:true},()=>10n).reservation!;
  const consequence=admitObservationLane({observerId,lane:'Consequence',dueAt:1n,emitsCharacterAccessibleEvidence:true},()=>10n).reservation!;
  const a=freezeAndStageSemanticExperience(current,assemble(current,[1n]),14n);
  const b=freezeAndStageSemanticExperience(consequence,assemble(consequence,[2n]),124n);
  try {validateSuccessfulExperienceSettlement([current,consequence],[a,b]);throw new Error('duplicate accepted');}
  catch(error){expect(error).toBeInstanceOf(PhaseOrderingContractError);expect((error as PhaseOrderingContractError).code).toBe('DUPLICATE_EXPERIENCE_ENVELOPE');}
 });
 it('SO-A: equal observer and time may have distinct reserved/frozen experience identities',()=>{
  let next=10n;const make=()=>admitObservationLane({observerId,lane:'Current',dueAt:1n,emitsCharacterAccessibleEvidence:true},()=>next++).reservation!;
  const a=make(),b=make(),sa=freezeAndStageSemanticExperience(a,assemble(a,[1n,2n]),14n),sb=freezeAndStageSemanticExperience(b,assemble(b,[3n]),14n);
  expect(a.dueAt).toBe(b.dueAt);expect(a.experienceId).not.toBe(b.experienceId);expect(next).toBe(12n);
  expect(()=>validateSuccessfulExperienceSettlement([a,b],[sa,sb])).not.toThrow();
 });
 it('SO-B: multiple admitted observations can support one experience without extra experience identity',()=>{
  let count=0;const r=admitObservationLane({observerId,lane:'Consequence',dueAt:1n,emitsCharacterAccessibleEvidence:true},()=>{count++;return 10n;}).reservation!;
  const s=freezeAndStageSemanticExperience(r,assemble(r,[1n,2n,3n]),124n);expect(count).toBe(1);expect(s.experience.supportingObservationIds).toHaveLength(3);
  expect(()=>validateSuccessfulExperienceSettlement([r],[s])).not.toThrow();
 });
 it('SO-C: absence cannot mint a fake experience to serve as an opportunity key',()=>{
  let allocations=0;const result=admitObservationLane({observerId,lane:'Current',dueAt:1n,emitsCharacterAccessibleEvidence:false},()=>{allocations++;return 10n;});
  expect(result.reservation).toBeUndefined();expect(allocations).toBe(0);
 });
});
