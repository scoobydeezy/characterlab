import {it,expect} from 'vitest';
import {runSemProvenanceControls} from '../workbench/semProvenanceControls';
it('preserves scoped admission, opaque references and causal-role independence',async()=>{
 const r=await runSemProvenanceControls();expect(await runSemProvenanceControls()).toEqual(r);expect(r.cases).toHaveLength(12);expect(r.negatives).toHaveLength(17);expect(r.apiBoundary.map(e=>e.present)).toEqual([false,false,false]);
 const p=Object.fromEntries(r.cases.map(c=>[c.id,JSON.parse(c.evidence.exact)]));expect(p['missing-evidence'].result).toEqual([]);expect(p['explicit-evidence-reference'].result).toHaveLength(1);expect(p['exact-future-schema'].result).not.toHaveProperty('confidence');expect(p['safe-replay'].first).toEqual(p['safe-replay'].replay);expect(p['independent-causal-roles'].before).toEqual(p['independent-causal-roles'].after);
 expect(r.summary.coreferenceCount).toBe(2);expect(r.summary.bindingsUnchanged).toBe(true);expect(r.summary.onlyBindingSupport).toBe(true);expect(r.summary.shiftedCausalRolesEqual).toBe(true);expect(r.summary.shiftedIdsDiffer).toBe(true);expect(r.summary.shiftedSupportingRefsDiffer).toBe(true);expect(r.rollback.firstAllocated).toBe('80');expect(r.rollback.before.status).toBe('Active');expect(r.rollback.after.status).toBe('Failed');expect(Object.values(r.rollback.preserved)).toEqual([true,true,true,true]);
});
