import { describe, it, expect } from 'vitest';
import { compilePerceivedBindings, assemblePreRecognitionExperience, type PreRecognitionSemanticExperience } from '../semanticBinding/perceptualEventFiles';
import { INITIAL_CAUSAL_ROLE_RULE, compileCausalRoleModel, deriveCausalRoleEvidence, characterEvidenceRefKey, type CausalRoleEvidence, type ObserverSafeEvidenceOccurrence } from '../semanticBinding/evidenceProvenance';
import { EventRoleId as R, type EventRoleId } from '../semanticBinding/eventBindings';
import { canonicalEncode } from '../substrate/canonicalEncoding';
import { perceivedBindingEvidenceValue } from '../semanticBinding/semanticEvidenceCodecs';
import { prepareAttentionPool, selectAttention, selectEqualPriorityControl, selectUnlimitedAttentionControl, selectedReferences, consumeSelected, closeSelectedView, type SelectedView } from '../campaign3/attentionSelection';
import { attentionFixture } from './attentionFixtures';
const pool = (f = attentionFixture()) => prepareAttentionPool(f.experience, f.claims);
const chosen = (rows: ReturnType<typeof selectAttention>['audit']) => rows.filter(r => r.selected).map(r => r.roles[0]);
describe('attention-selection-component/0.1-candidate', () => {
    it('AC-D: canonical evidence index crosses decimal occurrence boundaries', () => {
        for (const first of [8n, 9n, 98n, 99n, 998n, 999n]) {
            const f = attentionFixture(undefined, undefined, first);
            const result = selectAttention(pool(f), 1);
            expect(chosen(result.audit)).toEqual(['causal-role/actor']);
            expect(selectedReferences(result.view)[0]).toEqual({kind: 'perceived-binding', perceivedBindingId: first});
            expect(consumeSelected(result.view, selectedReferences(result.view))).toHaveLength(2);
        }
    });
    it('AC-A: exact roles, capacities and empty component pool', () => { const p = pool(); for (const k of [0, 1, 2]) {
        const r = selectAttention(p, k);
        expect(r.audit.filter(r => r.selected)).toHaveLength(k);
        expect(r.audit.map(r => [r.numerator, r.denominator])).toEqual([[1n, 1n], [9n, 10n], [3n, 5n]]);
    } const x = selectAttention(pool(attentionFixture([])), 2); expect(x.audit).toEqual([]); expect(consumeSelected(x.view, [])).toEqual([]); });
    it('AC-B: observed role swap and honest alternative components', () => { const a = pool(attentionFixture([[R.Participant], [R.Actor], [R.Target]])), x = selectAttention(a, 1); expect(chosen(x.audit)).toEqual(['causal-role/actor']); expect(chosen(selectEqualPriorityControl(a, 1).audit)).toEqual(['causal-role/participant']); expect(selectUnlimitedAttentionControl(a, 1).audit.filter(r => r.selected)).toHaveLength(3); });
    it('AC-C: missing, unsupported and multiple roles do not receive fallback priorities', () => { const f = attentionFixture([[R.Beneficiary], [R.Instrument], [R.Actor, R.Target]]), r = selectAttention(pool(f), 2); expect(r.audit.map(r => r.exclusion)).toEqual(['MissingRole', 'UnsupportedRole', 'MultipleRoles']); expect(chosen(r.audit)).toEqual([]); });
    it('AC-D: actual derivation rejects missing, forged, foreign and duplicated claims', () => { const f = attentionFixture(); const cases = [f.claims.slice(1), [...f.claims, f.claims[0]], f.claims.map((c, i) => i ? c : { ...c, observerId: 'foreign' }), f.claims.map((c, i) => i ? c : { ...c, experienceId: 99n }), f.claims.map((c, i) => i ? c : { ...c, occurredAt: 2n }), f.claims.map((c, i) => i ? c : { ...c, causalRoleId: 'causal-role/target' as const }), f.claims.map((c, i) => i ? c : { ...c, truthHandle: 1 })]; for (const claims of cases)
        expect(() => prepareAttentionPool(f.experience, claims)).toThrow(); });
    it('AC-E: rejects invalid capacity and more than three units', () => { const p = pool(); for (const k of [-1, 3, 0.5, NaN, Infinity])
        expect(() => selectAttention(p, k)).toThrow(); expect(() => pool(attentionFixture([[R.Actor], [R.Target], [R.Participant], [R.Actor]]))).toThrow(); });
    it('AC-F: order invariance, canonical ties and strict-priority renaming', () => { const f = attentionFixture(), a = selectAttention(pool(f), 1); expect(selectAttention(prepareAttentionPool({ ...f.experience, perceivedBindings: [...f.experience.perceivedBindings].reverse() }, [...f.claims].reverse()), 1).audit).toEqual(a.audit); const ties = selectAttention(pool(attentionFixture([[R.Actor], [R.Actor]])), 1).audit; expect(ties[0].selected).toBe(true); expect(chosen(selectAttention(pool(attentionFixture([[R.Actor], [R.Target], [R.Participant]], [99n, 2n, 1n])), 1).audit)).toEqual(['causal-role/actor']); });
    it('AC-G: exact selected bytes succeed while unselected and observation lookup fail', () => { const f = attentionFixture(), p = pool(f), r = selectAttention(p, 1), refs = selectedReferences(r.view), bytes = consumeSelected(r.view, refs); expect(bytes[0]).toEqual(canonicalEncode(perceivedBindingEvidenceValue(f.experience.perceivedBindings[0]))); expect(refs.map(characterEvidenceRefKey)).toEqual(['perceived-binding:10', 'causal-role:30']); for (const ref of [{ kind: 'perceived-binding' as const, perceivedBindingId: 11n }, { kind: 'observation' as const, observationId: 0n }, { kind: 'causal-role' as const, causalRoleEvidenceId: 31n }])
        expect(() => consumeSelected(selectAttention(p, 1).view, [ref])).toThrow(); });
    it('AC-H: forged, reused, closed and failed capabilities cannot read', () => { const p = pool(); expect(() => selectedReferences({ kind: 'SelectedView' } as SelectedView)).toThrow(); const a = selectAttention(p, 1).view; consumeSelected(a, []); expect(() => consumeSelected(a, [])).toThrow(); const b = selectAttention(p, 1).view; closeSelectedView(b); expect(() => selectedReferences(b)).toThrow(); const c = selectAttention(p, 1).view; expect(() => consumeSelected(c, [{ kind: 'observation', observationId: 0n }])).toThrow(); expect(() => consumeSelected(c, [])).toThrow(); });
    it('AC-I: source, audit and result mutations cannot change private authority', () => { const f = structuredClone(attentionFixture()), p = pool(f), baseline = selectAttention(p, 1).audit; (f.experience as {
        observerId: string;
    }).observerId = 'changed'; f.claims[0] = { ...f.claims[0], causalRoleId: 'causal-role/incidental' }; const a = selectAttention(p, 1); (a.audit[0] as {
        selected: boolean;
    }).selected = false; const refs = selectedReferences(a.view), bytes = consumeSelected(a.view, refs); bytes[0][0] ^= 255; expect(selectAttention(p, 1).audit).toEqual(baseline); const b = selectAttention(p, 1); expect(consumeSelected(b.view, selectedReferences(b.view))[0]).not.toEqual(bytes[0]); });
    it('AC-J: duplicate requests and duplicate semantic binding cannot enlarge selection', () => { const p = pool(), v = selectAttention(p, 1).view, ref = selectedReferences(v)[0]; expect(() => consumeSelected(v, [ref, ref])).toThrow(); const f = attentionFixture(); expect(() => prepareAttentionPool({ ...f.experience, perceivedBindings: [...f.experience.perceivedBindings, { ...f.experience.perceivedBindings[0], perceivedBindingId: 99n }] }, f.claims)).toThrow(); });
    it('AC-K: source history remains unchanged across selection and consumption', () => { const f = attentionFixture(), before = structuredClone(f), p = pool(f); for (const k of [0, 1, 2]) {
        const v = selectAttention(p, k).view;
        consumeSelected(v, selectedReferences(v));
    } expect(f).toEqual(before); });
});
