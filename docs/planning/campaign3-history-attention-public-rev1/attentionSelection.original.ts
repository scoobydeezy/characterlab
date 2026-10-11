/** attention-selection-component/0.1-candidate. Component validation is NOT public ingress. */
import { canonicalEncode, bytesToHex, list, type CanonicalValue } from '../substrate/canonicalEncoding';
import { ExactRational as Q } from '../substrate/exactMath';
import { assemblePreRecognitionExperience, compilePerceivedBindings, type PreRecognitionSemanticExperience, type PerceivedBindingEvidence } from '../semanticBinding/perceptualEventFiles';
import { INITIAL_CAUSAL_ROLE_RULE, compileCausalRoleModel, deriveCausalRoleEvidence, characterEvidenceRefKey, type CharacterEvidenceRef, type CausalRoleEvidence, type ObserverSafeEvidenceOccurrence } from '../semanticBinding/evidenceProvenance';
import { preRecognitionSemanticExperienceValue, perceivedBindingEvidenceValue, causalRoleEvidenceValue } from '../semanticBinding/semanticEvidenceCodecs';
import { perceptualEventReferentIdValue, perceptualReferentIdValue } from '../semanticBinding/semanticCodecs';
export const ATTENTION_COMPONENT_VERSION = 'attention-selection-component/0.1-candidate';
export class AttentionComponentError extends Error {
    constructor(readonly code: 'INVALID_POOL' | 'INVALID_CAPACITY' | 'INVALID_CAPABILITY' | 'READ_NOT_SELECTED', message: string) { super(message); this.name = 'AttentionComponentError'; }
}
const fail = (message: string): never => { throw new AttentionComponentError('INVALID_POOL', message); };
const key = (v: CanonicalValue) => bytesToHex(canonicalEncode(v));
const unitKey = (b: Pick<PerceivedBindingEvidence, 'perceptualEventReferentId' | 'perceptualReferentId'>) => key(list([perceptualEventReferentIdValue(b.perceptualEventReferentId), perceptualReferentIdValue(b.perceptualReferentId)]));
const priorities = new Map([['causal-role/actor', Q.of(1n)], ['causal-role/target', Q.of(9n, 10n)], ['causal-role/participant', Q.of(3n, 5n)]]);
export interface AttentionPool {
    readonly kind: 'AttentionPool';
}
export interface SelectedView {
    readonly kind: 'SelectedView';
}
export interface AttentionAuditRow {
    readonly key: string;
    readonly roles: readonly string[];
    readonly exclusion?: 'MissingRole' | 'MultipleRoles' | 'UnsupportedRole';
    readonly numerator?: bigint;
    readonly denominator?: bigint;
    readonly selected: boolean;
}
interface Unit {
    key: string;
    bindings: PerceivedBindingEvidence[];
    claims: CausalRoleEvidence[];
}
interface Pool {
    units: Unit[];
}
interface View {
    bytes: Map<string, Uint8Array>;
    refs: CharacterEvidenceRef[];
}
const pools = new WeakMap<AttentionPool, Pool>(), views = new WeakMap<SelectedView, View>();
const G = 'semantic-binding/0.1-candidate#SEM-001G';
/** Validates consistent existing SEM products, without claiming their scheduler origin. */
export function prepareAttentionPool(input: PreRecognitionSemanticExperience, companions: readonly CausalRoleEvidence[]): AttentionPool {
    const experience = assemblePreRecognitionExperience(structuredClone(input)), claims = structuredClone([...companions]);
    preRecognitionSemanticExperienceValue(experience);
    if (experience.perceptualEventReferentIds.length > 1 || experience.perceivedBindings.length > 6 || claims.length > 6 || experience.perceptualClassifications.length || experience.perceptualEventClassifications.length)
        fail('finite experience domain');
    compilePerceivedBindings(experience.perceivedBindings.map(({ perceivedBindingId, ...request }) => request), 0n);
    const units = new Map<string, Unit>(), bindingIds = new Set<bigint>();
    for (const binding of experience.perceivedBindings) {
        perceivedBindingEvidenceValue(binding);
        if (binding.observerId !== experience.observerId || binding.occurredAt !== experience.occurredAt || bindingIds.has(binding.perceivedBindingId))
            fail('binding observer/time/identity');
        bindingIds.add(binding.perceivedBindingId);
        const k = unitKey(binding), unit = units.get(k) ?? { key: k, bindings: [], claims: [] };
        unit.bindings.push(binding);
        units.set(k, unit);
    }
    if (units.size > 3)
        fail('at most three units');
    const ids = new Set<bigint>();
    for (const claim of claims) {
        causalRoleEvidenceValue(claim);
        if (claim.observerId !== experience.observerId || claim.occurredAt !== experience.occurredAt || claim.experienceId !== experience.experienceId || claim.transformationVersion !== G || ids.has(claim.causalRoleEvidenceId))
            fail('claim observer/time/identity/version');
        ids.add(claim.causalRoleEvidenceId);
        const unit = units.get(unitKey(claim));
        if (!unit)
            return fail('claim without unit');
        unit.claims.push(claim);
    }
    const model = compileCausalRoleModel('component/attention-role-validation', [INITIAL_CAUSAL_ROLE_RULE]);
    const occurrences: ObserverSafeEvidenceOccurrence[] = experience.perceivedBindings.map(b => ({ ref: { kind: 'perceived-binding', perceivedBindingId: b.perceivedBindingId }, observerId: b.observerId, occurredAt: b.occurredAt, recordSchemaVersion: 'perceived-binding/0.1-candidate', producingEpistemicSeamVersion: b.transformationVersion, scope: { experienceId: experience.experienceId, carrier: { kind: 'continuant-in-event', perceptualEventReferentId: b.perceptualEventReferentId, perceptualReferentId: b.perceptualReferentId } } }));
    occurrences.sort((a, b) => characterEvidenceRefKey(a.ref).localeCompare(characterEvidenceRefKey(b.ref)));
    const versions = [...new Set(experience.perceivedBindings.map(b => b.transformationVersion))].sort();
    for (const unit of units.values()) {
        const first = unit.bindings[0], expected = deriveCausalRoleEvidence(model, { experience, perceptualEventReferentId: first.perceptualEventReferentId, perceptualReferentId: first.perceptualReferentId, evidenceOccurrences: occurrences, readDomain: { transitionKindId: 'transition/derive-character-causal-role', permittedEvidenceSchemas: versions.map(v => ({ refKind: 'perceived-binding' as const, recordSchemaVersion: 'perceived-binding/0.1-candidate', producingEpistemicSeamVersion: v })), temporalScope: 'SameExperience' }, transformationVersion: G }, unit.claims[0]?.causalRoleEvidenceId ?? 0n).evidence;
        if (expected.length !== unit.claims.length)
            fail('incomplete role claims');
        const seen = new Set<string>();
        for (const claim of unit.claims) {
            if (seen.has(claim.causalRoleId))
                fail('duplicate semantic role');
            seen.add(claim.causalRoleId);
            const correct = expected.find(c => c.causalRoleId === claim.causalRoleId);
            if (!correct || Object.keys(claim).sort().join('|') !== Object.keys(correct).sort().join('|') || key(causalRoleEvidenceValue({ ...correct, causalRoleEvidenceId: claim.causalRoleEvidenceId })) !== key(causalRoleEvidenceValue(claim)))
                fail('claim does not match actual SEM derivation');
        }
    }
    const token: AttentionPool = Object.freeze({ kind: 'AttentionPool' });
    pools.set(token, { units: [...units.values()].sort((a, b) => a.key < b.key ? -1 : 1) });
    return token;
}
function select(pool: AttentionPool, capacity: number, law: 'role' | 'equal' | 'unlimited') {
    const facts = pools.get(pool);
    if (!facts)
        throw new AttentionComponentError('INVALID_CAPABILITY', 'unknown pool');
    if (!Number.isInteger(capacity) || capacity < 0 || capacity > 2)
        throw new AttentionComponentError('INVALID_CAPACITY', 'capacity must be0..2');
    const rows = facts.units.map(unit => { const roles = unit.claims.map(c => c.causalRoleId).sort(), exclusion = roles.length === 0 ? 'MissingRole' : roles.length > 1 ? 'MultipleRoles' : !priorities.has(roles[0]) ? 'UnsupportedRole' : undefined, priority = exclusion ? undefined : law === 'equal' ? Q.of(1n) : priorities.get(roles[0]); return { unit, roles, exclusion, priority }; });
    const eligible = rows.filter(row => row.priority !== undefined).sort((a, b) => b.priority!.compare(a.priority!) || (a.unit.key < b.unit.key ? -1 : 1));
    const selected = eligible.slice(0, law === 'unlimited' ? eligible.length : capacity), selectedKeys = new Set(selected.map(row => row.unit.key));
    const bytes = new Map<string, Uint8Array>(), refs: CharacterEvidenceRef[] = [];
    for (const { unit } of selected) {
        for (const b of unit.bindings) {
            const ref: CharacterEvidenceRef = { kind: 'perceived-binding', perceivedBindingId: b.perceivedBindingId };
            bytes.set(characterEvidenceRefKey(ref), canonicalEncode(perceivedBindingEvidenceValue(b)));
            refs.push(ref);
        }
        for (const c of unit.claims) {
            const ref: CharacterEvidenceRef = { kind: 'causal-role', causalRoleEvidenceId: c.causalRoleEvidenceId };
            bytes.set(characterEvidenceRefKey(ref), canonicalEncode(causalRoleEvidenceValue(c)));
            refs.push(ref);
        }
    }
    const view: SelectedView = Object.freeze({ kind: 'SelectedView' });
    views.set(view, { bytes, refs });
    const audit: AttentionAuditRow[] = rows.map(row => ({ key: row.unit.key, roles: [...row.roles], exclusion: row.exclusion as AttentionAuditRow['exclusion'], numerator: row.priority?.numerator, denominator: row.priority?.denominator, selected: selectedKeys.has(row.unit.key) }));
    return { audit, view };
}
export const selectAttention = (pool: AttentionPool, capacity: number) => select(pool, capacity, 'role');
export const selectEqualPriorityControl = (pool: AttentionPool, capacity: number) => select(pool, capacity, 'equal');
export const selectUnlimitedAttentionControl = (pool: AttentionPool, capacity: number) => select(pool, capacity, 'unlimited');
export function selectedReferences(view: SelectedView): readonly CharacterEvidenceRef[] { const data = views.get(view); if (!data)
    throw new AttentionComponentError('INVALID_CAPABILITY', 'expired or forged view'); return structuredClone(data.refs); }
/** A single consumption attempt revokes the capability, including a failed attempt. */
export function consumeSelected(view: SelectedView, requests: readonly CharacterEvidenceRef[]): readonly Uint8Array[] {
    const data = views.get(view);
    if (!data)
        throw new AttentionComponentError('INVALID_CAPABILITY', 'expired or forged view');
    views.delete(view);
    const seen = new Set<string>();
    return requests.map(ref => { const k = characterEvidenceRefKey(ref); if (seen.has(k) || !data.bytes.has(k))
        throw new AttentionComponentError('READ_NOT_SELECTED', 'reference absent or repeated'); seen.add(k); return data.bytes.get(k)!.slice(); });
}
export function closeSelectedView(view: SelectedView): void { views.delete(view); }
