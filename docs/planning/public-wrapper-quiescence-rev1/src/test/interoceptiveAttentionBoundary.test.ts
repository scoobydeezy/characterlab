import {describe,it,expect} from 'vitest';
import {assemblePreRecognitionExperience} from '../semanticBinding/perceptualEventFiles';
import {prepareAttentionPool,selectAttention,selectedReferences,consumeSelected} from '../campaign3/attentionSelection';
const experience=()=>assemblePreRecognitionExperience({experienceId:1n,observerId:'observer/fixture',occurredAt:1n,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:'observer/fixture',observationId:2n}],transformationVersion:'semantic-binding/0.1-candidate#SEM-001H'});
describe('existing support-only interoception versus actual attention selector',()=>{
 it('IA-B1: support-only experience does not manufacture an event/continuant attention unit',()=>{
  const e=experience();expect(e.supportingObservationIds).toHaveLength(1);
  const r=selectAttention(prepareAttentionPool(e,[]),2);expect(r.audit).toEqual([]);expect(selectedReferences(r.view)).toEqual([]);expect(consumeSelected(r.view,[])).toEqual([]);
 });
 it('IA-B2: observation membership does not grant selected payload access',()=>{
  const r=selectAttention(prepareAttentionPool(experience(),[]),2);
  expect(()=>consumeSelected(r.view,[{kind:'observation',observationId:2n}])).toThrow();
 });
});

