// Generated original SEM-001J refusal and structural witnesses, separately recorded.
/**
 * `SEM-001J` — the integrated phenomenon gate.
 *
 * `SEM-001I.3` was accepted with a carried condition: the integrated gate must not run the symbolic
 * oracle and then serialize its result canonically. It must migrate the remaining `SEM-001B..H`
 * in-memory occurrence boundaries onto the accepted typed IDs and the codec/state machinery, and
 * *no authoritative `PHEN-SEM-001` result may depend on a symbolic string occurrence ID*.
 *
 * A statement in an acceptance record cannot discharge that. This file proves it, in four
 * independent ways that fail for different reasons:
 *
 *   1. the accepted constructors refuse a symbolic occurrence identity outright;
 *   2. a legacy version string routed at an authoritative field is refused at an exact boundary;
 *   3. poisoning every fixture scaffolding string leaves the authoritative bytes identical;
 *   4. every identity in the committed canonical chain resolves through one accepted namespace,
 *      and every occurrence payload in it is an allocated ordinal rather than text.
 *
 * Together those separate two populations that were previously entangled: symbolic strings are
 * test scaffolding, and accepted typed canonical identities are authoritative execution. Symbolic
 * shapes may still exist in helper code — what matters is that they cannot reach a result.
 */
/// <reference types="vite/client" />

import {
  bytesToHex, canonicalEncode, text,
  type CanonicalValue,
} from '../substrate/canonicalEncoding';
import {
  SEMANTIC_OCCURRENCE_NAMESPACES,
  SEMANTIC_TYPED_ID_NAMESPACES,
} from '../semanticBinding/semanticSchemaRegistry';
import { semanticOccurrenceId, semanticRecordValue } from '../semanticBinding/semanticCodecs';
import { EventRoleId } from '../semanticBinding/eventBindings';
import { compilePerceivedBindings } from '../semanticBinding/perceptualEventFiles';
import { assertClassificationEmissionTarget } from '../semanticBinding/perceptualClassification';
import { list } from '../substrate/canonicalEncoding';
import { simInstant } from '../substrate/time';
import {
  eventRoleEvidenceValue,
  perceivedBindingEvidenceValue,
  preRecognitionSemanticExperienceValue,
  recognitionResolutionRecordValue,
} from '../semanticBinding/semanticEvidenceCodecs';
import { CausalRoleId } from '../semanticBinding/evidenceProvenance';
import { SEMANTIC_FINITE_REGISTRIES } from '../semanticBinding/semanticSchemaRegistry';
import {
  DARIUS, GLEN, MINA, MULTI_ROLE_AFFORDANCES, MULTI_ROLE_BINDING_REQUESTS,
  OBSERVER_AFFORDANCES, REPEATED_ROLE_AFFORDANCES, REPEATED_ROLE_BINDING_REQUESTS, TRACK_FEATURES,
  createRunAllocator, deriveObserverCausalRoles, projectObserver, recognizeObserverContinuant,
  truthBindings, type ObserverId, type ObserverRoleAffordance,
} from '../test/fixtures/phenSem001';
import type { PerceptualFeatureId } from '../semanticBinding/perceptualClassification';
import {
  CATALOGS, CONSUMED_TRACK, OBSERVE, canonicalChainValue, handlerKey, initialState,
  observeHandler, observerPayload, scheduler,
} from '../test/fixtures/phenSem001Run';


import {chainFor} from './semIntegratedFixture';
import {createNegativeRecorder} from './semNegativeRecorder';
export function executeSemShortcuts(){
const recorder=createNegativeRecorder(), {it,recordFailure,finish}=recorder;
const expect=(actual:unknown)=>({...recorder.expect(actual),toBeGreaterThan:(minimum:number)=>{if(typeof actual!=='number')throw Error('Numeric comparison required');recorder.expect({actual,minimum,greater:actual>minimum}).toEqual({actual,minimum,greater:true});}});
const codeOf = (run: () => unknown): string => {
  try {
    run();
  } catch (error) {
    const code = (error as { readonly code?: unknown }).code;
    if (typeof code === 'string') { recordFailure(code, error); return code; }
    throw error;
  }
  throw new Error('expected a contract failure, but the construction was admitted');
};

  it('refuses a symbolic occurrence identity at the accepted constructor', () => {
    // The constructor takes an allocated ordinal. A symbolic handle in that position is not a
    // near-miss to be coerced; it has no canonical encoding at all.
    expect(() => semanticOccurrenceId('ObservationId', 'observation/mina-1' as never)).toThrow();
    expect(() => semanticOccurrenceId('ObservationId', 12n)).not.toThrow();

    // And the namespace itself is closed, so a symbolic occurrence family cannot be invented
    // alongside the accepted sixteen.
    expect(codeOf(() => semanticOccurrenceId('LegacyObservationHandle' as never, 1n)))
      .toBe('UNKNOWN_SEMANTIC_NAMESPACE');
    expect(codeOf(() => semanticOccurrenceId('ObservationId', -1n)))
      .toBe('INVALID_OCCURRENCE_ORDINAL');
  });

  it('refuses a legacy seam-version string routed at an authoritative field', () => {
    // The fixture's own former labels, which sat in authoritative version fields until this gate
    // migrated them. Routing one at an authoritative record now fails at an exact boundary rather
    // than encoding a record no accepted contract governs.
    const allocator = createRunAllocator();
    const projection = projectObserver({
      observerId: GLEN, truth: truthBindings(), allocator, experienceId: 1n,
    });
    const binding = projection.perceivedBindings[0];

    for (const legacy of ['phen-sem-001/causal-1', 'phen-sem-001/recognition-1', 'perceived-binding/0.1-candidate']) {
      expect(codeOf(() => perceivedBindingEvidenceValue({ ...binding, transformationVersion: legacy })))
        .toBe('UNADMITTED_CONTRACT_VERSION');
    }

    // The record built from the accepted contract version encodes normally, so the refusal above
    // is the version and not the record.
    expect(() => perceivedBindingEvidenceValue(binding)).not.toThrow();

    // The same closure holds on the recognition side.
    const track = projection.tracksByLabel.get(CONSUMED_TRACK[GLEN])!;
    const catalog = CATALOGS[GLEN];
    const resolution = recognizeObserverContinuant({
      projection, perceptualReferentId: track, catalog,
      assertCandidate: catalog[0], nextRuntimeId: allocator.next(),
    })!;
    expect(codeOf(() => recognitionResolutionRecordValue({
      ...resolution, recognitionVersion: 'phen-sem-001/recognition-1',
    }))).toBe('UNADMITTED_CONTRACT_VERSION');
    expect(() => recognitionResolutionRecordValue(resolution)).not.toThrow();
  });

    const allocator = createRunAllocator();
    const truth = truthBindings();
    const projection = projectObserver({
      observerId: GLEN, truth, allocator, experienceId: 1n,
    });
    const actorBinding = projection.perceivedBindings.find(
      (value) => value.eventRoleEvidence.kind === 'exact')!;
    // A binding *request*: the compiled evidence carries its own allocated `perceivedBindingId`,
    // which is not an input field. Leaving it on would make the request illegal for a second
    // reason and the first divergence would be that, not the leak under test.
    const { perceivedBindingId: _allocated, ...bindingRequest } = projection.perceivedBindings[0];

it("Shortcut 1: Truth identity leak — refused at the perceived-binding boundary, before allocation.",()=>{
    // 1. Truth identity leak — refused at the perceived-binding boundary, before allocation.
    expect(codeOf(() => compilePerceivedBindings([{
      ...bindingRequest, semanticReferentId: truth[1].semanticReferent.semanticReferentId,
    } as never], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');
    // The same request without the leak compiles, so the refusal is the leaked field.
    expect(() => compilePerceivedBindings([bindingRequest], 100n)).not.toThrow();


});
it("Shortcut 2: Truth-role overexposure — the unresolved variant forbids the role field, so a projection",()=>{
    // 2. Truth-role overexposure — the unresolved variant forbids the role field, so a projection
    // that claims not to have resolved a role cannot smuggle one alongside.
    expect(codeOf(() => eventRoleEvidenceValue(
      { kind: 'unresolved', eventRoleId: EventRoleId.Actor } as never)))
      .toBe('ILLEGAL_UNION_LAYOUT');


});
it("Shortcut 3: Referent-keyed collapse — one continuant in two roles stays two canonical records.",()=>{
    // 3. Referent-keyed collapse — one continuant in two roles stays two canonical records.
    const multiRole = projectObserver({
      observerId: MINA, truth: truthBindings(MULTI_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(), experienceId: 1n, affordances: MULTI_ROLE_AFFORDANCES,
    });
    const shared = multiRole.tracksByLabel.get('shared/person')!;
    const sharedRecords = multiRole.perceivedBindings
      .filter((value) => value.perceptualReferentId.observerTrackSequence === shared.observerTrackSequence)
      .map((value) => bytesToHex(canonicalEncode(perceivedBindingEvidenceValue(value))));
    expect(sharedRecords).toHaveLength(2);
    expect(new Set(sharedRecords).size).toBe(2);


});
it("Shortcut 4: Role-keyed collapse — two continuants in one repeatable role stay two canonical records.",()=>{
    // 4. Role-keyed collapse — two continuants in one repeatable role stay two canonical records.
    const repeated = projectObserver({
      observerId: MINA, truth: truthBindings(REPEATED_ROLE_BINDING_REQUESTS),
      allocator: createRunAllocator(), experienceId: 1n, affordances: REPEATED_ROLE_AFFORDANCES,
    });
    const companions = repeated.perceivedBindings.filter((value) =>
      value.eventRoleEvidence.kind === 'exact'
      && value.eventRoleEvidence.eventRoleId === EventRoleId.Companion);
    expect(new Set(companions.map((value) =>
      bytesToHex(canonicalEncode(perceivedBindingEvidenceValue(value))))).size).toBe(2);


});
it("Shortcut 5: Event-only collapse — the event-file is not the experience, and two experiences over one",()=>{
    // 5. Event-only collapse — the event-file is not the experience, and two experiences over one
    // event-file remain two canonical records with distinct `ExperienceId` occurrences.
    const second = projectObserver({
      observerId: GLEN, truth, allocator: createRunAllocator(), experienceId: 2n,
    });
    expect(bytesToHex(canonicalEncode(preRecognitionSemanticExperienceValue(second.experience))))
      .not.toBe(bytesToHex(canonicalEncode(preRecognitionSemanticExperienceValue(projection.experience))));
    expect(second.experience.perceptualEventReferentIds)
      .toEqual(projection.experience.perceptualEventReferentIds);


});
it("Shortcut 6: Classification into psychology — refused at the receiving seam.",()=>{
    // 6. Classification into psychology — refused at the receiving seam.
    expect(codeOf(() => assertClassificationEmissionTarget('pressure')))
      .toBe('FORBIDDEN_EMISSION_TARGET');


});
it("Shortcut 7: Hidden-truth causal influence — the causal record's basis is observer-side, and a truth",()=>{
    // 7. Hidden-truth causal influence — the causal record's basis is observer-side, and a truth
    // linkage field on the evidence it would read is refused by its own named code.
    expect(codeOf(() => compilePerceivedBindings([{
      ...bindingRequest, truthEventBindingId: truth[0].eventBindingId,
    } as never], 100n))).toBe('FORBIDDEN_TRUTH_FIELD');


});
it("Shortcut 8: Character traversal of omniscient ancestry — the ancestry graph names truth bindings the",()=>{
    // 8. Character traversal of omniscient ancestry — the ancestry graph names truth bindings the
    // canonical chain never carries, so there is no field to traverse from.
    expect(projection.omniscientAncestry.length).toBeGreaterThan(0);
    const chainText = JSON.stringify(chainFor(GLEN), (_key, value: unknown) =>
      typeof value === 'bigint' ? value.toString() : value);
    for (const edge of projection.omniscientAncestry) {
      expect(chainText).not.toContain(String(edge.truthEventBindingId));
    }


});
it("Shortcut 9: Noncanonical or invalid evidence — an unregistered field cannot be constructed at all.",()=>{
    // 9. Noncanonical or invalid evidence — an unregistered field cannot be constructed at all.
    expect(codeOf(() => semanticRecordValue('PerceivedBindingEvidence', {
      PerceivedBindingId: semanticOccurrenceId('PerceivedBindingId', 1n),
      NarrativeGloss: text('she swung the pipe'),
    }))).toBe('UNKNOWN_SEMANTIC_FIELD');


});
it("Shortcut 10: Legacy symbolic authoritative ID use — proved four ways above; re-asserted here as the",()=>{
    // 10. Legacy symbolic authoritative ID use — proved four ways above; re-asserted here as the
    // integrated shortcut it would be.
    expect(codeOf(() => perceivedBindingEvidenceValue({
      ...actorBinding, transformationVersion: 'phen-sem-001/causal-1',
    }))).toBe('UNADMITTED_CONTRACT_VERSION');

});

return finish();
}
export const originalSource={path:'src/test/sem001JIntegratedGate.test.ts',sha256:'15c5859489270bd197a28801c3bcebccdb68559f37075f7328f96f6d64c3bb2f'} as const;
