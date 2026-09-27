import { compilePerceivedBindings, assemblePreRecognitionExperience, type PreRecognitionSemanticExperience } from '../semanticBinding/perceptualEventFiles';
import { INITIAL_CAUSAL_ROLE_RULE, compileCausalRoleModel, deriveCausalRoleEvidence, characterEvidenceRefKey, type CausalRoleEvidence, type ObserverSafeEvidenceOccurrence } from '../semanticBinding/evidenceProvenance';
import { EventRoleId as R, type EventRoleId } from '../semanticBinding/eventBindings';
import { canonicalEncode } from '../substrate/canonicalEncoding';
import { perceivedBindingEvidenceValue } from '../semanticBinding/semanticEvidenceCodecs';
const C = 'semantic-binding/0.1-candidate#SEM-001C', G = 'semantic-binding/0.1-candidate#SEM-001G', H = 'semantic-binding/0.1-candidate#SEM-001H';
export function attentionFixture(roles: readonly (readonly EventRoleId[])[] = [[R.Actor], [R.Target], [R.Participant]], tracks = roles.map((_, i) => BigInt(i)), firstBindingId = 10n) {
    const observerId = 'observer/attention-test', event = { observerId, observerEventSequence: 0n };
    const bindings = compilePerceivedBindings(roles.flatMap((rs, i) => rs.map(eventRoleId => ({ observerId, perceptualEventReferentId: event, perceptualReferentId: { observerId, observerTrackSequence: tracks[i] }, eventRoleEvidence: { kind: 'exact' as const, eventRoleId }, supportingObservationIds: [{ observerId, observationId: 0n }], occurredAt: 1n, transformationVersion: C }))), firstBindingId).bindings;
    const experience = assemblePreRecognitionExperience({ experienceId: 20n, observerId, occurredAt: 1n, perceptualEventReferentIds: roles.length ? [event] : [], perceivedBindings: bindings, perceptualClassifications: [], perceptualEventClassifications: [], supportingObservationIds: [{ observerId, observationId: 0n }], transformationVersion: H });
    const index: ObserverSafeEvidenceOccurrence[] = bindings.map(b => ({ ref: { kind: 'perceived-binding', perceivedBindingId: b.perceivedBindingId }, observerId, occurredAt: 1n, recordSchemaVersion: 'perceived-binding/0.1-candidate', producingEpistemicSeamVersion: C, scope: { experienceId: 20n, carrier: { kind: 'continuant-in-event', perceptualEventReferentId: event, perceptualReferentId: b.perceptualReferentId } } }));
    index.sort((a, b) => characterEvidenceRefKey(a.ref).localeCompare(characterEvidenceRefKey(b.ref)));
    const claims: CausalRoleEvidence[] = [];
    for (const track of tracks) {
        const next = deriveCausalRoleEvidence(compileCausalRoleModel('component/attention-test', [INITIAL_CAUSAL_ROLE_RULE]), { experience, perceptualEventReferentId: event, perceptualReferentId: { observerId, observerTrackSequence: track }, evidenceOccurrences: index, readDomain: { transitionKindId: 'transition/derive-character-causal-role', permittedEvidenceSchemas: [{ refKind: 'perceived-binding', recordSchemaVersion: 'perceived-binding/0.1-candidate', producingEpistemicSeamVersion: C }], temporalScope: 'SameExperience' }, transformationVersion: G }, 30n + BigInt(claims.length));
        claims.push(...next.evidence);
    }
    return { experience, claims };
}
